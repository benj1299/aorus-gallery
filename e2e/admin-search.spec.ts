import { test, expect } from '@playwright/test';

test.describe('Admin Search', () => {
  test('search filters artist list', async ({ page }) => {
    await page.goto('/admin/artists');
    await expect(page.locator('h1')).toBeVisible();

    // Type in search — placeholder is "Rechercher un artiste..."
    const searchInput = page.locator('input[placeholder*="Rechercher"]');
    await searchInput.fill('Matthieu');

    // Should filter to show only matching rows
    await page.waitForTimeout(500);
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);
    await expect(page.getByText('Matthieu Scheiffer')).toBeVisible();
  });

  test('clearing search shows all results', async ({ page }) => {
    await page.goto('/admin/artists');
    await expect(page.locator('h1')).toBeVisible();

    const searchInput = page.locator('input[placeholder*="Rechercher"]');
    await searchInput.fill('Matthieu');
    await page.waitForTimeout(500);

    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(500);

    const rows = page.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(9);
  });
});
