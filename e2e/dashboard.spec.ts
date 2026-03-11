import { test, expect } from '@playwright/test';

test.describe('Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Mock the Auth login
    await page.route('**/api/auth/login', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ 
                access_token: 'mock-token',
                token_type: 'bearer',
                user: { email: 'test@example.com', full_name: 'Test User' } 
            }),
        });
    });

    // 2. Mock the repositories list (endpoint is /repos/ according to useRepos.ts)
    await page.route('**/api/repos/**', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                { 
                    id: '1', 
                    repo_name: 'mock-repo-1', 
                    is_active: true,
                    avatar_url: null,
                    created_at: new Date().toISOString()
                }
            ]),
        });
    });

    // 3. Mock the statistics (/dashboard/stats)
    await page.route('**/api/dashboard/stats', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ 
                installations_count: 1,
                repos_linked_count: 5,
                drift_events_count: 12,
                pr_waiting_count: 2
            }),
        });
    });

    // Navigate to login and authenticate
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('User can view the dashboard and interact with repositories', async ({ page }) => {
    // Verify key UI components of the dashboard are present
    await expect(page.getByText(/Welcome back/)).toBeVisible();
    await expect(page.getByText('mock-repo-1')).toBeVisible();
    
    // Check if the page has finished loading by looking for stats tiles
    await expect(page.getByText('Repos Linked')).toBeVisible();
    await expect(page.getByText('PRs Waiting')).toBeVisible();

    // The user should eventually see the empty state message or a list of repos
    await Promise.any([
        expect(page.getByText('No repositories linked')).toBeVisible(),
        expect(repoList.first()).toBeVisible(),
    ]);
  });
});
