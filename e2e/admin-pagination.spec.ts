import { test, expect } from '@playwright/test';

test.describe('Admin Pagination', () => {
  test('artworks table paginates correctly', async ({ page }) => {
    await page.goto('/admin/artworks');
    await expect(page.locator('h1')).toBeVisible();

    // Default itemsPerPage is 10 — first page should have exactly 10 rows
    const rows = page.locator('tbody tr');
    const firstPageCount = await rows.count();
    expect(firstPageCount).toBe(10);

    // Pagination uses "Suivant" button
    const nextButton = page.locator('button', { hasText: 'Suivant' });
    await expect(nextButton).toBeVisible();
    await nextButton.click();
    // Wait for the table to re-render after pagination
    await page.waitForLoadState('networkidle');

    const secondPageCount = await rows.count();
    expect(secondPageCount).toBeGreaterThanOrEqual(1);
  });
});
