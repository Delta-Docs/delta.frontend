import { test, expect } from '@playwright/test';

test.describe('Dashboard Flow', () => {
  test.beforeEach(async ({ page }: { page: import('@playwright/test').Page }) => {
    // Navigate to login and authenticate before each dashboard test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('User can view the dashboard and interact with repositories', async ({ page }: { page: import('@playwright/test').Page }) => {
    // Verify key UI components of the dashboard are present
    await expect(page.getByText('Welcome back')).toBeVisible();
    
    // Wait for the repositories to load (either empty state or actual repos)
    const repoList = page.locator('.repo-row'); // Container for repos
    
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
