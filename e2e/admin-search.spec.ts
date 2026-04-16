import { test, expect } from '@playwright/test';

test.describe('Admin Search', () => {
  test('search filters artist list', async ({ page }) => {
    await page.goto('/admin/artists');
    await expect(page.locator('h1')).toBeVisible();

    // Type in search — placeholder is "Rechercher un artiste..."
    const searchInput = page.locator('input[placeholder*="Rechercher"]');
    await searchInput.fill('Matthieu');

    // Should filter to show only matching rows — wait for filtered result to appear
    await expect(page.getByText('Matthieu Scheiffer')).toBeVisible({ timeout: 5000 });
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('clearing search shows all results', async ({ page }) => {
    await page.goto('/admin/artists');
    await expect(page.locator('h1')).toBeVisible();

    const searchInput = page.locator('input[placeholder*="Rechercher"]');
    await searchInput.fill('Matthieu');
    // Wait for filter to take effect
    await expect(page.getByText('Matthieu Scheiffer')).toBeVisible({ timeout: 5000 });

    // Clear search
    await searchInput.clear();
    // Wait for the full list to restore — use auto-retrying assertion
    await expect(page.locator('tbody tr')).not.toHaveCount(0, { timeout: 5000 });

    const rows = page.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(9);
  });
});
