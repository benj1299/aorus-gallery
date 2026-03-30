import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.use({ storageState: { cookies: [], origins: [] } }); // No auth

  test('login with valid credentials redirects to admin', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByLabel('Email').fill('admin@orusgallery.com');
    await page.getByLabel('Password').fill('admin-orus-2025');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.waitForURL('**/admin/artists', { timeout: 15000 });
    await expect(page).toHaveURL(/\/admin\/artists/);
  });

  test('login with wrong credentials shows error', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByLabel('Email').fill('wrong@email.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.locator('text=Invalid')).toBeVisible({ timeout: 5000 });
  });

  test('accessing admin without session redirects to login', async ({ page }) => {
    await page.goto('/admin/artists');
    await page.waitForURL('**/admin/login', { timeout: 10000 });
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
