import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '.auth/admin.json');

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/admin/login');
  await page.locator('#email').fill('admin@orusgallery.com');
  await page.locator('#password').fill('admin-orus-2025');
  await page.locator('button[type="submit"]').click();

  // Wait for redirect to admin artists page
  await page.waitForURL('**/admin/artists', { timeout: 15000 });
  await expect(page.locator('h1')).toBeVisible();

  await page.context().storageState({ path: authFile });
});
