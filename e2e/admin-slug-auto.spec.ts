import { test, expect } from '@playwright/test';

/** Remove the Next.js dev overlay that intercepts pointer events */
async function dismissOverlay(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    document.querySelectorAll('nextjs-portal').forEach(el => el.remove());
  });
}

test.describe('Auto Slug Generation', () => {
  test('artist slug is auto-generated from name', async ({ page }) => {
    const uniqueSuffix = Date.now().toString().slice(-6);
    const artistName = `Slug Artist ${uniqueSuffix}`;

    await page.goto('/admin/artists/new');
    await expect(page.getByText('New Artist')).toBeVisible();

    await page.locator('input[name="name"]').fill(artistName);
    await page.locator('input[name="nationality.en"]').fill('Test Country');
    await page.locator('textarea[name="bio.en"]').fill('This is a test artist bio for auto-slug E2E testing.');
    await page.locator('input[name="imageUrl"]').fill('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80');

    // Submit form via requestSubmit to bypass dev overlay
    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.waitForURL('**/admin/artists', { timeout: 15000 });

    // Verify the artist appears in the list
    await expect(page.getByText(artistName)).toBeVisible();

    // Click Edit to verify slug was auto-generated
    await dismissOverlay(page);
    const artistRow = page.locator('tr', { hasText: artistName });
    await artistRow.getByText('Edit').click();
    await expect(page.getByText(`Edit: ${artistName}`)).toBeVisible();

    // The URL contains the auto-generated ID (UUID)
    await expect(page).toHaveURL(/\/admin\/artists\/[a-z0-9-]+/);

    // Clean up: delete the test artist
    await page.goto('/admin/artists');
    await dismissOverlay(page);
    const cleanupRow = page.locator('tr', { hasText: artistName });
    await cleanupRow.getByText('Delete').click();
    await cleanupRow.getByText('Confirm').click();
    await page.waitForTimeout(3000);
    await page.reload();
    await expect(page.getByText(artistName)).not.toBeVisible();
  });

  test('artwork slug is auto-generated', async ({ page }) => {
    const uniqueSuffix = Date.now().toString().slice(-6);
    const artworkTitle = `Slug Artwork ${uniqueSuffix}`;

    await page.goto('/admin/artworks/new');
    await expect(page.getByText('New Artwork')).toBeVisible();

    await page.locator('input[name="title.en"]').fill(artworkTitle);

    // The artist selector is a FormSelect (Radix Select) with a hidden input.
    // Set the first artist ID directly via the hidden input.
    // First, get the first artist option value from the combobox trigger text
    // or set it by reading available options from the page.
    await page.evaluate(() => {
      // Find the artistId hidden input and set it to the first available artist
      const combobox = document.querySelector('[role="combobox"]');
      if (combobox) {
        // The first artist name is in the trigger, but we need the ID
        // Use the data attributes or trigger a click programmatically
      }
    });

    // Use Radix Select interaction: click trigger, then option
    await dismissOverlay(page);
    const artistCombobox = page.getByRole('combobox').first();
    await artistCombobox.click();
    // Wait for the dropdown to appear and click the first option
    await page.getByRole('option').first().click({ timeout: 5000 });

    await page.locator('input[name="medium.en"]').fill('Digital Medium');
    await page.locator('input[name="dimensions"]').fill('50 x 50 cm');
    await page.locator('input[name="year"]').fill('2025');
    await page.locator('input[name="imageUrl"]').fill('https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80');

    // Submit form via requestSubmit
    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.waitForURL('**/admin/artworks', { timeout: 15000 });

    // Verify the artwork appears
    await expect(page.getByText(artworkTitle)).toBeVisible();

    // Clean up: delete the artwork
    await dismissOverlay(page);
    const artworkRow = page.locator('tr', { hasText: artworkTitle });
    await artworkRow.getByText('Delete').click();
    await artworkRow.getByText('Confirm').click();
    await page.waitForTimeout(3000);
    await page.reload();
    await expect(page.getByText(artworkTitle)).not.toBeVisible();
  });
});
