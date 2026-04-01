import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test('dashboard loads with stats and quick actions', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: /Tableau de bord/i })).toBeVisible();

    // Verify stat cards exist (inside main content, not sidebar)
    const main = page.locator('main');
    await expect(main.getByText('Artistes')).toBeVisible();
    await expect(main.getByText('Messages').first()).toBeVisible();

    // Verify quick action buttons
    await expect(main.getByRole('link', { name: /Nouvel artiste/i })).toBeVisible();
  });

  test('dashboard stat links navigate correctly', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: /Tableau de bord/i })).toBeVisible();

    // Click on Artistes stat card
    await page.getByText('Artistes').first().click();
    await page.waitForURL('**/admin/artists', { timeout: 10000 });
    await expect(page.locator('h1')).toBeVisible();
  });
});
