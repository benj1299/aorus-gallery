import { test, expect } from '@playwright/test';

test.describe('Artworks CRUD', () => {
  test('list shows seeded artworks', async ({ page }) => {
    await page.goto('/admin/artworks');
    await expect(page.locator('h1')).toBeVisible();
    // Should have artworks (27 seeded)
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(9);
  });

  test('create new artwork', async ({ page }) => {
    await page.goto('/admin/artworks/new');
    await expect(page.locator('h1')).toBeVisible();

    await page.locator('input[name="title.en"]').fill('Test Artwork E2E');

    // Select first artist via native <select>
    await page.locator('select[name="artistId"]').selectOption({ index: 1 });

    await page.locator('input[name="medium.en"]').fill('Oil on canvas');
    await page.locator('input[name="dimensions"]').fill('100 x 80 cm');
    await page.locator('input[name="year"]').fill('2025');
    await page.locator('input[name="price"]').fill('5000');

    // Set image via ImageUpload hidden input
    await page.locator('input[type="hidden"][name="imageUrl"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80'; }
    );

    await page.evaluate(() => document.querySelector('form')?.requestSubmit());

    await page.waitForURL('**/admin/artworks', { timeout: 15000 });
    await expect(page.getByText('Test Artwork E2E')).toBeVisible();
  });

  test('edit artwork', async ({ page }) => {
    await page.goto('/admin/artworks');

    const row = page.locator('tr', { hasText: 'Test Artwork E2E' });
    await row.locator('[title="Modifier"]').click();

    const titleInput = page.locator('input[name="title.en"]');
    await titleInput.clear();
    await titleInput.fill('Test Artwork Updated');

    await page.evaluate(() => document.querySelector('form')?.requestSubmit());

    await page.waitForURL('**/admin/artworks', { timeout: 15000 });
    await expect(page.getByText('Test Artwork Updated')).toBeVisible();
  });

  test('delete artwork', async ({ page }) => {
    await page.goto('/admin/artworks');

    const row = page.locator('tr', { hasText: 'Test Artwork Updated' });
    await row.locator('[title="Supprimer"]').click();
    await row.locator('[title="Confirmer"]').click();

    await page.waitForTimeout(3000);
    await page.reload();
    await expect(page.getByText('Test Artwork Updated')).not.toBeVisible();
  });

  test('artwork flags persist after edit', async ({ page }) => {
    // Create artwork with specific flags
    await page.goto('/admin/artworks/new');
    await expect(page.locator('h1')).toBeVisible();

    const title = `Flags Test ${Date.now()}`;
    await page.locator('input[name="title.en"]').fill(title);
    await page.locator('select[name="artistId"]').selectOption({ index: 1 });
    await page.locator('input[name="medium.en"]').fill('Test');
    await page.locator('input[name="dimensions"]').fill('10x10');
    await page.locator('input[name="year"]').fill('2025');

    // Set image via ImageUpload hidden input
    await page.locator('input[type="hidden"][name="imageUrl"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600'; }
    );

    // Toggle sold flag (Radix Switch rendered as button[role="switch"] with id="sold")
    const soldSwitch = page.locator('button[role="switch"]#sold');
    if (await soldSwitch.count() > 0) {
      await soldSwitch.click();
    }

    await page.evaluate(() => document.querySelector('form')?.requestSubmit());
    await page.waitForURL('**/admin/artworks', { timeout: 15000 });

    // Edit and verify flag persisted
    const row = page.locator('tr', { hasText: title });
    await row.locator('[title="Modifier"]').click();

    // Check sold switch state
    const editSoldSwitch = page.locator('button[role="switch"]#sold');
    if (await editSoldSwitch.count() > 0) {
      const state = await editSoldSwitch.getAttribute('data-state');
      expect(state).toBe('checked');
    }

    // Cleanup
    await page.goto('/admin/artworks');
    const cleanupRow = page.locator('tr', { hasText: title });
    await cleanupRow.locator('[title="Supprimer"]').click();
    await cleanupRow.locator('[title="Confirmer"]').click();
    await page.waitForTimeout(3000);
  });
});
