import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.use({ storageState: { cookies: [], origins: [] } }); // No auth

  test('login with valid credentials redirects to admin', async ({ page }) => {
    await page.goto('/admin/login');
    await page.locator('#email').fill('admin@orusgallery.com');
    await page.locator('#password').fill('admin-orus-2025');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL('**/admin', { timeout: 15000 });
    await expect(page).toHaveURL(/\/admin/);
  });

  test('login with wrong credentials shows error', async ({ page }) => {
    await page.goto('/admin/login');
    await page.locator('#email').fill('wrong@email.com');
    await page.locator('#password').fill('wrongpassword');
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('text=Invalid').or(page.locator('text=incorrects').or(page.locator('text=erreur')))).toBeVisible({ timeout: 5000 });
  });

  test('accessing admin without session redirects to login', async ({ page }) => {
    await page.goto('/admin/artists');
    await page.waitForURL('**/admin/login', { timeout: 10000 });
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
