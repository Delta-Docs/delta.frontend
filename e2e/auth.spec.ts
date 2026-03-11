import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the login API with correct nested structure
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-token',
          token_type: 'bearer',
          user: {
            email: 'test@example.com',
            full_name: 'Test User'
          }
        }),
      });
    });
  });

  test('User can log in successfully and be redirected to dashboard', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');

    // Verify we are on the login page
    await expect(page).toHaveTitle(/Delta|Login/);
    await expect(page.locator('h1')).toContainText('Delta.');

    // Fill in the login form. 
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword123');

    // Click the login button
    await page.click('button[type="submit"]');

    // Verify redirection to the dashboard
    await expect(page).toHaveURL(/\/dashboard/);

    // Verify dashboard elements are visible indicating successful login
    // Using regex for more robust matching of "Welcome back, Test"
    await expect(page.getByText(/Welcome back/)).toBeVisible();
    await expect(page.locator('.dashboard-user-name')).toContainText('Test User');
  });
});
