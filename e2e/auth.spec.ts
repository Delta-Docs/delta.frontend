import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('User can log in successfully and be redirected to dashboard', async ({ page }: { page: import('@playwright/test').Page }) => {
    // Navigate to the login page
    await page.goto('/login');

    // Verify we are on the login page
    await expect(page).toHaveTitle(/Delta|Login/);
    await expect(page.locator('h1')).toContainText('Login');

    // Fill in the login form. 
    // We use the test credentials seeded in the database.
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword123');

    // Click the login button
    await page.click('button[type="submit"]');

    // Verify redirection to the dashboard
    await expect(page).toHaveURL(/\/dashboard/);

    // Verify dashboard elements are visible indicating successful login
    // Note: The seeded user full_name is "Test User"
    await expect(page.getByText('Test User')).toBeVisible();
    await expect(page.getByText('Delta.')).toBeVisible();
  });
});
