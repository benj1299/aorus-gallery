import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '.auth/admin.json');

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/admin/login');
  await page.getByLabel('Email').fill('admin@orusgallery.com');
  await page.getByLabel('Password').fill('admin-orus-2025');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Wait for redirect to admin artists page
  await page.waitForURL('**/admin/artists', { timeout: 15000 });
  await expect(page.getByRole('heading', { name: 'Artists' })).toBeVisible();

  await page.context().storageState({ path: authFile });
});
