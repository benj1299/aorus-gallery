import { test, expect } from '@playwright/test';

test.describe('AdaptiveImage and Image Quality', () => {
  test('homepage artwork images use object-contain', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('domcontentloaded');

    // Featured artworks section uses AdaptiveImage, which renders with object-contain
    // These are inside aspect-[4/5] containers with artwork links
    const artworkImages = page.locator('a[href*="/artworks/"] img');
    const count = await artworkImages.count();

    if (count > 0) {
      // Check each artwork image uses object-contain
      for (let i = 0; i < count; i++) {
        const img = artworkImages.nth(i);
        const className = await img.getAttribute('class');
        expect(className, `Artwork image ${i} should use object-contain`).toContain('object-contain');
      }
    }
  });

  test('artist detail page artwork images use object-contain', async ({ page }) => {
    // Navigate to a known artist detail page
    await page.goto('/en/artists/matthieu-scheiffer');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('Matthieu Scheiffer').first()).toBeVisible({ timeout: 15000 });

    // Artwork images in the "Selected Works" grid use AdaptiveImage
    const artworkImages = page.locator('a[href*="/artworks/"] img');
    const count = await artworkImages.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const img = artworkImages.nth(i);
        const className = await img.getAttribute('class');
        expect(className, `Artist page artwork image ${i} should use object-contain`).toContain('object-contain');
      }
    }
  });

  test('artist portrait still uses object-cover', async ({ page }) => {
    await page.goto('/en/artists/matthieu-scheiffer');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('Matthieu Scheiffer').first()).toBeVisible({ timeout: 15000 });

    // The artist portrait is in an aspect-[3/4] container, uses regular Image with object-cover
    const portraitImage = page.locator('.aspect-\\[3\\/4\\] img').first();
    await expect(portraitImage).toBeVisible({ timeout: 15000 });

    const className = await portraitImage.getAttribute('class');
    expect(className, 'Artist portrait should use object-cover for headshots').toContain('object-cover');
  });

  test('no object-cover on artwork images in artwork detail page', async ({ page }) => {
    // Discover a real artwork slug from homepage
    await page.goto('/en');
    await page.waitForLoadState('domcontentloaded');

    const artworkLink = page.locator('a[href*="/artworks/"]').first();
    const isVisible = await artworkLink.isVisible().catch(() => false);

    if (!isVisible) {
      // If no featured artworks on homepage, skip gracefully
      test.skip();
      return;
    }

    const href = await artworkLink.getAttribute('href');
    const slug = href!.split('/artworks/').pop();

    await page.goto(`/en/artworks/${slug}`);
    await page.waitForLoadState('domcontentloaded');

    // Main artwork image (in min-h-[60vh] container)
    // Image uses fill mode (position:absolute) + fade-in, so use toBeAttached
    const mainImage = page.locator('.min-h-\\[60vh\\] img').first();
    await expect(mainImage).toBeAttached({ timeout: 15000 });
    const mainClass = await mainImage.getAttribute('class');
    expect(mainClass, 'Main artwork image must not use object-cover').not.toContain('object-cover');
    expect(mainClass, 'Main artwork image should use object-contain').toContain('object-contain');

    // Check all detail images too (contextual images section)
    const allArtworkImages = page.locator('img.object-contain');
    const containCount = await allArtworkImages.count();
    expect(containCount, 'At least the main image should use object-contain').toBeGreaterThanOrEqual(1);

    // Ensure no artwork images on this page use object-cover
    // (Only non-artwork images like background/hero might use it, but artwork images should not)
    const artworkDetailImages = page.locator('.min-h-\\[60vh\\] img, .aspect-square img');
    const detailCount = await artworkDetailImages.count();
    for (let i = 0; i < detailCount; i++) {
      const img = artworkDetailImages.nth(i);
      const imgClass = await img.getAttribute('class');
      expect(imgClass, `Artwork detail image ${i} must not use object-cover`).not.toContain('object-cover');
    }
  });
});
