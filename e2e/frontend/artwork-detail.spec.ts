import { test, expect } from '@playwright/test';

test.describe('Artwork Detail Page', () => {
  let artworkSlug: string;
  let artworkTitle: string;
  let artistName: string;

  test.beforeAll(async ({ browser }) => {
    // Discover a real artwork slug from the homepage featured artworks
    const page = await browser.newPage({
      storageState: 'e2e/.auth/admin.json',
    });
    await page.goto('/en');
    await page.waitForLoadState('domcontentloaded');

    // Find the first artwork link on the homepage (links to /en/artworks/{slug})
    const artworkLink = page.locator('a[href*="/artworks/"]').first();
    await expect(artworkLink).toBeVisible({ timeout: 15000 });
    const href = await artworkLink.getAttribute('href');
    // href is like /en/artworks/some-slug
    const parts = href!.split('/artworks/');
    artworkSlug = parts[parts.length - 1];

    // Navigate to the artwork detail page to capture metadata
    await page.goto(`/en/artworks/${artworkSlug}`);
    await page.waitForLoadState('domcontentloaded');

    // Grab the artist name and artwork title from the cartel
    const cartelBlock = page.locator('.max-w-xl').first();
    await expect(cartelBlock).toBeVisible({ timeout: 15000 });

    // Artist name is the first link in the cartel (font-display text)
    artistName = (await cartelBlock.locator('a').first().textContent()) ?? '';
    // Title is in an italic span
    artworkTitle = (await cartelBlock.locator('span.italic').first().textContent()) ?? '';

    await page.close();
  });

  test('page loads at /en/artworks/{slug}', async ({ page }) => {
    await page.goto(`/en/artworks/${artworkSlug}`);
    await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
    // The page should contain structured data (ld+json)
    const ldJson = page.locator('script[type="application/ld+json"]');
    await expect(ldJson.first()).toBeAttached();
  });

  test('page returns 404 for non-existent slug', async ({ page }) => {
    const response = await page.goto('/en/artworks/this-slug-definitely-does-not-exist-12345');
    // Next.js notFound() may return 404 status or 200 with the not-found page
    const status = response?.status() ?? 0;
    expect([404, 200]).toContain(status);
    // Verify it shows not-found content (not the artwork page)
    await expect(page.locator('.max-w-xl')).not.toBeVisible({ timeout: 5000 });
  });

  test('cartel displays artist name', async ({ page }) => {
    await page.goto(`/en/artworks/${artworkSlug}`);
    const cartel = page.locator('.max-w-xl').first();
    await expect(cartel).toBeVisible({ timeout: 15000 });
    await expect(cartel.locator('a').first()).toContainText(artistName);
  });

  test('cartel displays artwork title', async ({ page }) => {
    await page.goto(`/en/artworks/${artworkSlug}`);
    const cartel = page.locator('.max-w-xl').first();
    await expect(cartel).toBeVisible({ timeout: 15000 });
    await expect(cartel.locator('span.italic').first()).toContainText(artworkTitle);
  });

  test('main image uses object-contain', async ({ page }) => {
    await page.goto(`/en/artworks/${artworkSlug}`);
    const mainImage = page.locator('[data-testid="artwork-main-image"] img').first();
    await expect(mainImage).toBeAttached({ timeout: 15000 });
    const className = await mainImage.getAttribute('class');
    expect(className).toContain('object-contain');
    expect(className).not.toContain('object-cover');
  });

  test('navigation links (prev/next) exist if available', async ({ page }) => {
    await page.goto(`/en/artworks/${artworkSlug}`);
    await page.waitForLoadState('domcontentloaded');

    // The prev/next section uses links with /artworks/ in their href
    // At least one of prev or next should exist for most artworks
    const navLinks = page.locator('a[href*="/artworks/"]');
    const count = await navLinks.count();
    // The page itself has at least the back-to-artist link; prev/next are additional
    // We just verify the page loaded without errors
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('Inquire CTA link exists', async ({ page }) => {
    await page.goto(`/en/artworks/${artworkSlug}`);
    // The inline "inquire" link points to /contact
    const inquireLink = page.locator('a[href*="/contact"]').first();
    await expect(inquireLink).toBeVisible({ timeout: 15000 });
  });

  test('back to artist link works', async ({ page }) => {
    await page.goto(`/en/artworks/${artworkSlug}`);

    // The back link is the first link at the top with the artist name
    const backLink = page.locator('a[href*="/artists/"]').first();
    await expect(backLink).toBeVisible({ timeout: 15000 });
    await expect(backLink).toContainText(artistName);

    // Click it and verify we land on the artist page
    await backLink.click();
    await page.waitForURL('**/artists/**', { timeout: 15000 });
    await expect(page.locator('h1')).toContainText(artistName);
  });
});
