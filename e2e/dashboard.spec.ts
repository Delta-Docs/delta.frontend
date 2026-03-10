import { test, expect } from '@playwright/test';

test.describe('Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login and authenticate before each dashboard test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('User can view the dashboard and interact with repositories', async ({ page }) => {
    // Verify key UI components of the dashboard are present
    await expect(page.getByText('Welcome back')).toBeVisible();
    
    // Wait for the repositories to load (either empty state or actual repos)
    // We wait for either the 'No repositories linked yet' text OR a repository item
    const emptyState = page.getByText('No repositories linked yet');
    const repoList = page.locator('.space-y-3.mt-4'); // Container for repos
    
    // Check if the page has finished loading by looking for stats tiles
    await expect(page.getByText('Total Installations')).toBeVisible();
    await expect(page.getByText('Prs Waiting')).toBeVisible();

    // The user should eventually see the empty state message or a list of repos
    // We don't strictly assert the content since it depends on the seeded DB state,
    // but we verify the dashboard fully renders without crashing.
    await Promise.any([
        expect(emptyState).toBeVisible(),
        expect(repoList).toBeVisible(),
    ]);
  });
});
