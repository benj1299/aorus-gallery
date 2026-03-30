import { test, expect } from '@playwright/test';

test.describe('Artworks CRUD', () => {
  test('list shows seeded artworks', async ({ page }) => {
    await page.goto('/admin/artworks');
    await expect(page.getByRole('heading', { name: 'Artworks' })).toBeVisible();
    // Should have artworks (27 seeded)
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(9);
  });

  test('create new artwork', async ({ page }) => {
    await page.goto('/admin/artworks/new');
    await expect(page.getByText('New Artwork')).toBeVisible();

    await page.locator('input[name="title.en"]').fill('Test Artwork E2E');
    await page.locator('input[name="slug"]').fill('test-artwork-e2e');

    // Select first artist
    await page.locator('select[name="artistId"]').selectOption({ index: 1 });

    await page.locator('input[name="medium.en"]').fill('Oil on canvas');
    await page.locator('input[name="dimensions"]').fill('100 x 80 cm');
    await page.locator('input[name="year"]').fill('2025');
    await page.locator('input[name="price"]').fill('5000');
    await page.locator('input[name="imageUrl"]').fill('https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80');

    await page.getByRole('button', { name: 'Save Artwork' }).click();

    await page.waitForURL('**/admin/artworks', { timeout: 15000 });
    await expect(page.getByText('Test Artwork E2E')).toBeVisible();
  });

  test('edit artwork', async ({ page }) => {
    await page.goto('/admin/artworks');

    const row = page.locator('tr', { hasText: 'Test Artwork E2E' });
    await row.getByText('Edit').click();

    const titleInput = page.locator('input[name="title.en"]');
    await titleInput.clear();
    await titleInput.fill('Test Artwork Updated');

    await page.getByRole('button', { name: 'Save Artwork' }).click();

    await page.waitForURL('**/admin/artworks', { timeout: 15000 });
    await expect(page.getByText('Test Artwork Updated')).toBeVisible();
  });

  test('delete artwork', async ({ page }) => {
    await page.goto('/admin/artworks');

    const row = page.locator('tr', { hasText: 'Test Artwork Updated' });
    await row.getByText('Delete').click();
    await row.getByText('Confirm').click();

    await page.waitForTimeout(3000);
    await page.reload();
    await expect(page.getByText('Test Artwork Updated')).not.toBeVisible();
  });
});
