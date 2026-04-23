import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('User can log in successfully and be redirected to dashboard', async ({ page }) => {
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
    await expect(page.getByText('test@example.com')).toBeVisible();
    await expect(page.getByText('Delta.')).toBeVisible();
  });
});
