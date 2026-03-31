import { test, expect } from '@playwright/test';

test.describe('Logout', () => {
  test('logout redirects to login', async ({ browser }) => {
    // Use a fresh context to avoid invalidating the shared session
    const context = await browser.newContext();
    const page = await context.newPage();

    // Login first
    await page.goto('/admin/login');
    await page.locator('#email').fill('admin@orusgallery.com');
    await page.locator('#password').fill('admin-orus-2025');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/admin', { timeout: 15000 });

    // Click logout button in sidebar
    await page.locator('button', { hasText: 'connexion' }).or(page.locator('button[title*="connexion"]')).click();

    // Should redirect to login
    await page.waitForURL('**/admin/login', { timeout: 10000 });
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    await context.close();
  });

  test('protected route redirects without session', async ({ browser }) => {
    // New context without auth — ensure no cookies
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();

    await page.goto('/admin/artists');
    await page.waitForURL('**/admin/login', { timeout: 15000 });
    await expect(page).toHaveURL(/\/admin\/login/);

    await context.close();
  });
});
