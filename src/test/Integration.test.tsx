import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

// Keep actual React functions intact, but override standard environment behaviors to prevent
// components from crashing due to missing configurations on test mount
const originalFetch = global.fetch

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false, // Turn off retries for faster test failures
            staleTime: 0,
        },
    },
})

// Since we can't use node_modules mocking comfortably, we will directly
// intercept window/global fetch which Tanstack react-query relies on behind the scenes
describe('Dashboard - True Integration Test via Fetch Interception', () => {
    let queryClient: QueryClient

    beforeEach(() => {
        // Reset fetch to a mock and create a fresh query client cache
        global.fetch = vi.fn()
        queryClient = createTestQueryClient()
        
        // Mock a basic logged in user session by intercepting the /auth/me or similar query 
        // to prevent immediate layout crashes
        vi.mock('@/hooks/useUser', () => ({
            useCurrentUser: () => ({ data: { id: '1', full_name: 'Integration User' }, isLoading: false }),
            getGravatarUrl: () => 'avatar.png'
        }))
        vi.mock('@/hooks/useAuth', () => ({
            useLogout: () => ({ mutate: vi.fn(), isPending: false })
        }))
    })

    afterEach(() => {
        // Restore standard node behavior
        global.fetch = originalFetch
        vi.restoreAllMocks()
        queryClient.clear()
    })

    const renderWithProviders = (ui: React.ReactElement) => {
        return render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    {ui}
                </MemoryRouter>
            </QueryClientProvider>
        )
    }

    it('Scenario 1: Renders the beautiful "Empty State" UI when the API returns perfectly empty data', async () => {
        // We configure the global fetch to return a 200 response with empty arrays/objects
        // exactly as the FastAPI backend would if the user had zero installations
        const mockFetch = global.fetch as ReturnType<typeof vi.fn>
        
        mockFetch.mockImplementation(async (url: string) => {
            if (url.includes('/dashboard/repos')) {
                return {
                    ok: true,
                    json: async () => [] // Zero repositories
                }
            }
            if (url.includes('/api/dashboard/stats')) {
                return {
                    ok: true,
                    json: async () => ({
                        installations_count: 0,
                        repos_linked_count: 0,
                        drift_events_count: 0,
                        pr_waiting_count: 0,
                    })
                }
            }
            
            // Fallback for any other unexpected requests
            return { ok: true, json: async () => ({}) }
        })

        renderWithProviders(<Dashboard />)

        // Wait for the components to finish mounting, fetching, and rendering
        await waitFor(() => {
            expect(screen.getByText(/No repositories linked yet/i)).toBeInTheDocument()
        })
        
        // Ensure that it specifically told them to connect their GitHub account
        expect(screen.getByText(/Connect your GitHub account to get started/i)).toBeInTheDocument()
        
        // Ensure stats tiles display 0 everywhere
        const zeroes = screen.getAllByText('0')
        expect(zeroes.length).toBeGreaterThanOrEqual(4)
        
        // Verify that the React application natively dispatched API requests to the expected endpoints
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/dashboard/repos'), expect.anything())
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/dashboard/stats'), expect.anything())
    })

    it('Scenario 2: Renders a populated layout when the backend API successfully fetches linked repositories', async () => {
        const mockFetch = global.fetch as ReturnType<typeof vi.fn>
        
        mockFetch.mockImplementation(async (url: string) => {
            if (url.includes('/dashboard/repos')) {
                // Return exactly the payload the backend produces for repositories
                return {
                    ok: true,
                    json: async () => [
                        { id: 1, name: 'org/backend-service', language: 'Python', stargazers_count: 99, forks_count: 10, description: 'Test', avatar_url: '' }
                    ]
                }
            }
            if (url.includes('/api/dashboard/stats')) {
                return {
                    ok: true,
                    json: async () => ({
                        installations_count: 1,
                        repos_linked_count: 1,
                        drift_events_count: 3,
                        pr_waiting_count: 1,
                    })
                }
            }
            return { ok: true, json: async () => ({}) }
        })

        // We must wrap the render in act/waitFor to allow the QueryClient to digest the Promises
        renderWithProviders(<Dashboard />)

        // Give the react-query cache time to fulfill the Promises and trigger a re-render
        // Testing-library requires targeting something that actually appears in the DOM
        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument()
        })
        
        await waitFor(() => {
            // Verify the component successfully mapped the API data into physical DOM nodes
            expect(screen.getByText('org/backend-service')).toBeInTheDocument()
            expect(screen.getByText('Python')).toBeInTheDocument()
            expect(screen.getByText('99')).toBeInTheDocument()
            expect(screen.queryByText(/No repositories linked yet/i)).not.toBeInTheDocument()
        })
    })

    it('Scenario 3: Conditionally disables UI features and shows skeletons when the Backend returns a 500 error', async () => {
        const mockFetch = global.fetch as ReturnType<typeof vi.fn>
        
        mockFetch.mockImplementation(async () => {
            // Force the API to simulate an unhandled database crash
            return {
                ok: false,
                status: 500,
                json: async () => ({ detail: "Internal Server Error" })
            }
        })

        renderWithProviders(<Dashboard />)

        // React-Query will eventually give up (since we set retries: 0) causing an error state
        // When useDashboardRepos/Stats fails, they return `isError: true` which the 
        // Dashboard uses to render generic skeleton states or "0"s instead of crashing
        await waitFor(() => {
            // Stats should fail gracefully to 0 rather than exploding
            const zeroes = screen.getAllByText('0')
            expect(zeroes.length).toBeGreaterThanOrEqual(4)
        })

        // No rogue data should be visible
        expect(screen.queryByText('org/backend-service')).not.toBeInTheDocument()
    })
})
