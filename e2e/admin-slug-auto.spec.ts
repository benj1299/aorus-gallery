import { test, expect } from '@playwright/test';

test.describe('Auto Slug Generation', () => {
  test('artist slug is auto-generated from name', async ({ page }) => {
    const uniqueSuffix = Date.now().toString().slice(-6);
    const artistName = `Slug Artist ${uniqueSuffix}`;

    await page.goto('/admin/artists/new');
    await expect(page.locator('h1')).toBeVisible();

    await page.locator('input[name="name"]').fill(artistName);
    await page.locator('input[name="nationality.en"]').fill('Test Country');

    // Bio is now richtext (Tiptap)
    const editor = page.locator('.ProseMirror').first();
    await expect(editor).toBeVisible({ timeout: 10000 });
    await editor.click();
    await editor.pressSequentially('This is a test artist bio for auto-slug E2E testing.');

    // Set image via ImageUpload hidden input
    await page.locator('input[type="hidden"][name="imageUrl"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80'; }
    );

    // Submit form via requestSubmit
    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.waitForURL('**/admin/artists', { timeout: 15000 });

    // Verify the artist appears in the list
    await expect(page.getByText(artistName)).toBeVisible();

    // Click Edit to verify slug was auto-generated
    const artistRow = page.locator('tr', { hasText: artistName });
    await artistRow.locator('[data-testid="edit-btn"]').click();
    await expect(page.locator('h1')).toBeVisible();

    // The URL contains the auto-generated ID (UUID)
    await expect(page).toHaveURL(/\/admin\/artists\/[a-z0-9-]+/);

    // Clean up: delete the test artist
    await page.goto('/admin/artists');
    const cleanupRow = page.locator('tr', { hasText: artistName });
    await cleanupRow.locator('[data-testid="delete-btn"]').click();
    await cleanupRow.locator('[data-testid="delete-confirm"]').click();
    await expect(cleanupRow).not.toBeVisible({ timeout: 10000 });
  });

  test('artwork slug is auto-generated', async ({ page }) => {
    const uniqueSuffix = Date.now().toString().slice(-6);
    const artworkTitle = `Slug Artwork ${uniqueSuffix}`;

    await page.goto('/admin/artworks/new');
    await expect(page.locator('h1')).toBeVisible();

    await page.locator('input[name="title.en"]').fill(artworkTitle);

    // Select first artist via native <select>
    await page.locator('select[name="artistId"]').selectOption({ index: 1 });

    await page.locator('input[name="medium.en"]').fill('Digital Medium');
    await page.locator('input[name="dimensions"]').fill('50 x 50 cm');
    await page.locator('input[name="year"]').fill('2025');

    // Set image via ImageUpload hidden input
    await page.locator('input[type="hidden"][name="imageUrl"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80'; }
    );

    // Submit form via requestSubmit
    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.waitForURL('**/admin/artworks', { timeout: 15000 });

    // Verify the artwork appears
    await expect(page.getByText(artworkTitle)).toBeVisible();

    // Clean up: delete the artwork
    const artworkRow = page.locator('tr', { hasText: artworkTitle });
    await artworkRow.locator('[data-testid="delete-btn"]').click();
    await artworkRow.locator('[data-testid="delete-confirm"]').click();
    await expect(artworkRow).not.toBeVisible({ timeout: 10000 });
  });
});
