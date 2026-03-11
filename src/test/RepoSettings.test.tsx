import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RepoSettings from '../pages/RepoSettings'
import { toast } from 'sonner' 

// ---- Mock Data ----
const mockUser = {
    id: '1',
    email: 'john@example.com',
    full_name: 'John Doe',
}

const mockRepo = {
    id: 'repo-123',
    repo_name: 'delta/frontend',
    is_active: false,
    docs_root_path: '/docs',
    target_branch: 'main',
    reviewer: 'test-reviewer',
    docs_policies: 'Test Policy',
    drift_sensitivity: 0.8,
    style_preference: 'Professional',
}

// ---- Mutable Mock Returns ----
const createTestQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } })

let mockUserReturn: any
let mockLogoutReturn: any
let mockReposReturn: any
let mockUpdateSettingsReturn: any
let mockToggleRepoReturn: any
let mockDriftEventsReturn: any

// ---- Mocks ----
vi.mock('@/hooks/useUser', () => ({
    useCurrentUser: () => mockUserReturn,
    getGravatarUrl: () => 'https://mock.avatar.url',
}))

vi.mock('@/hooks/useAuth', () => ({
    useLogout: () => mockLogoutReturn,
}))

vi.mock('@/hooks/useRepos', () => ({
    useRepos: () => mockReposReturn,
    useUpdateRepoSettings: () => mockUpdateSettingsReturn,
    useToggleRepo: () => mockToggleRepoReturn,
}))

vi.mock('@/hooks/useDriftEvents', () => ({
    useDriftEvents: () => mockDriftEventsReturn
}))

vi.mock('@/components/shared/NotificationBell', () => ({
    NotificationBell: () => <div>NotificationBell</div>
}))

// Mock React Router parameters to target the specific repo
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useParams: () => ({ repoId: 'repo-123' }),
        useNavigate: () => vi.fn(),
    }
})

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}))

// Wrapper component
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={createTestQueryClient()}>
        <BrowserRouter>{children}</BrowserRouter>
     </QueryClientProvider>
)

describe('RepoSettings Component - Unit Tests', () => {
    beforeEach(() => {
        // Reset defaults
        mockUserReturn = { data: mockUser, isLoading: false }
        mockLogoutReturn = { mutate: vi.fn(), isPending: false }
        mockReposReturn = { data: [mockRepo], isLoading: false }
        mockDriftEventsReturn = { data: [], isLoading: false }
        
        // Mock the mutation functions correctly based on Tanstack Query signature
        mockUpdateSettingsReturn = { 
            mutate: vi.fn((_args, callbacks) => {
                if (callbacks?.onSuccess) callbacks.onSuccess()
            }), 
            isPending: false 
        }
        
        mockToggleRepoReturn = { 
            mutate: vi.fn((_args, callbacks) => {
                if (callbacks?.onSuccess) callbacks.onSuccess()
            }), 
            isPending: false 
        }
        
        vi.clearAllMocks()
    })

    // ========================================
    // LOADING & ERROR STATES
    // ========================================

    it('shows loading spinner when data fetching is incomplete', () => {
        mockReposReturn = { data: undefined, isLoading: true }
        render(<RepoSettings />, { wrapper })
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
    })

    it('shows "Repository not found" if the mock repo list does not contain the URL ID', () => {
        // The URL mock expects 'repo-123', so return a completely different repo
        mockReposReturn = { data: [{ id: 'wrong-repo' }], isLoading: false }
        render(<RepoSettings />, { wrapper })
        expect(screen.getByText(/Repository not found/i)).toBeInTheDocument()
    })

    // ========================================
    // RENDERING
    // ========================================

    it('renders the repository name and correct status badge', () => {
        render(<RepoSettings />, { wrapper })
        expect(screen.getByRole('heading', { name: /delta\/frontend/i })).toBeInTheDocument()
        expect(screen.getByText('Inactive')).toBeInTheDocument() // Because mock is_active is false
        
        // Verify default config values mapped correctly to input fields
        expect(screen.getByDisplayValue('/docs')).toBeInTheDocument()
        expect(screen.getByDisplayValue('main')).toBeInTheDocument()
        expect(screen.getByDisplayValue('test-reviewer')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Test Policy')).toBeInTheDocument()
    })

    // ========================================
    // TOGGLING STATUS
    // ========================================

    it('calls useToggleRepo mutation when the active checkbox is clicked', async () => {
        const user = userEvent.setup()
        render(<RepoSettings />, { wrapper })
        
        // Find the hidden checkbox by its associated label manually since it's an sr-only input
        const checkbox = screen.getByLabelText(/Enable Monitoring/i)
        
        // Click the checkbox
        await user.click(checkbox)

        // Verify that it sent the correct payload (repo ID and true/false flip)
        expect(mockToggleRepoReturn.mutate).toHaveBeenCalledWith(
            { id: 'repo-123', is_active: true }, 
            expect.any(Object)
        )
        
        // Verify the success toast triggered
        expect(toast.success).toHaveBeenCalledWith('Repository monitoring enabled')
    })

    // ========================================
    // UPDATING SETTINGS FORM
    // ========================================

    it('allows editing of the path and branch inputs', async () => {
        const user = userEvent.setup()
        render(<RepoSettings />, { wrapper })
        
        const pathInput = screen.getByLabelText(/Documentation Path/i)
        const branchInput = screen.getByLabelText(/Target Branch/i)
        
        await user.clear(pathInput)
        await user.type(pathInput, '/public/docs')
        
        await user.clear(branchInput)
        await user.type(branchInput, 'master')
        
        expect(pathInput).toHaveValue('/public/docs')
        expect(branchInput).toHaveValue('master')
    })

    it('calls useUpdateRepoSettings mutation when the Save button is clicked', async () => {
        const user = userEvent.setup()
        render(<RepoSettings />, { wrapper })
        
        const pathInput = screen.getByLabelText(/Documentation Path/i)
        await user.clear(pathInput)
        await user.type(pathInput, '/new/path')
        
        const saveButton = screen.getByRole('button', { name: /Save Settings/i })
        await user.click(saveButton)
        
        // Verify the mutation was fired with the updated path, but keeping the other old defaults
        expect(mockUpdateSettingsReturn.mutate).toHaveBeenCalledWith(
            {
                id: 'repo-123',
                settings: expect.objectContaining({
                    docs_root_path: '/new/path',
                    target_branch: 'main',
                    style_preference: 'Professional'
                })
            },
            expect.any(Object)
        )
        
        // Verify success toast
        expect(toast.success).toHaveBeenCalledWith('Settings saved successfully!')
    })
})
