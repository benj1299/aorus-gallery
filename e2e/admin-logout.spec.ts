import { test, expect } from '@playwright/test';

test.describe('Logout', () => {
  test('logout redirects to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('nav')).toBeVisible();

    // Click logout button in sidebar
    await page.locator('button', { hasText: 'connexion' }).or(page.locator('button[title*="connexion"]')).click();

    // Should redirect to login
    await page.waitForURL('**/admin/login', { timeout: 10000 });
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('protected route redirects without session', async ({ browser }) => {
    // New context without auth
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('/admin/artists');
    await page.waitForURL('**/admin/login', { timeout: 10000 });

    await context.close();
  });
});
