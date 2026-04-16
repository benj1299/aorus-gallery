import { test, expect } from '@playwright/test';

test.describe('Homepage Carousel', () => {
  test('homepage has horizontal scrollable container for featured artworks', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('domcontentloaded');

    // The carousel is a flex container with overflow-x-auto and snap-x classes
    const carouselContainer = page.locator('.overflow-x-auto.scrollbar-hide.snap-x');
    await expect(carouselContainer).toBeVisible({ timeout: 15000 });

    // Verify it uses horizontal scroll (overflow-x: auto from Tailwind)
    const overflowX = await carouselContainer.evaluate(
      (el) => window.getComputedStyle(el).overflowX
    );
    expect(overflowX).toBe('auto');
  });

  test('carousel contains up to 10 artwork cards', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('domcontentloaded');

    const carouselContainer = page.locator('.overflow-x-auto.scrollbar-hide.snap-x');
    await expect(carouselContainer).toBeVisible({ timeout: 15000 });

    // Each artwork card is a snap-start shrink-0 div inside the container
    const artworkCards = carouselContainer.locator('.snap-start.shrink-0');
    const count = await artworkCards.count();

    // Should have at least 1 artwork and at most 10 (server slices to 10)
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(10);
  });

  test('each carousel card links to artwork detail page', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('domcontentloaded');

    const carouselContainer = page.locator('.overflow-x-auto.scrollbar-hide.snap-x');
    await expect(carouselContainer).toBeVisible({ timeout: 15000 });

    const artworkCards = carouselContainer.locator('.snap-start.shrink-0');
    const count = await artworkCards.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Check the first card has a link to /artworks/
    const firstCardLink = artworkCards.first().locator('a[href*="/artworks/"]');
    await expect(firstCardLink).toBeAttached();

    const href = await firstCardLink.getAttribute('href');
    expect(href).toContain('/artworks/');
  });

  test('carousel cards have images and artist names', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('domcontentloaded');

    const carouselContainer = page.locator('.overflow-x-auto.scrollbar-hide.snap-x');
    await expect(carouselContainer).toBeVisible({ timeout: 15000 });

    const artworkCards = carouselContainer.locator('.snap-start.shrink-0');
    const count = await artworkCards.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Check the first card has an image
    const firstCard = artworkCards.first();
    const image = firstCard.locator('img');
    await expect(image.first()).toBeAttached({ timeout: 10000 });

    // Check the first card displays artist name text (below the image in a p tag)
    // The card structure has: title (font-display) + artist name (text-noir/50 or text-blanc/70)
    const cardTexts = firstCard.locator('p');
    const textCount = await cardTexts.count();
    // Should have at least 2 text elements (title + artist name) in visible area
    // or in the hover overlay
    expect(textCount).toBeGreaterThanOrEqual(2);

    // Verify at least one text element has non-empty content (the artist name)
    const lastText = cardTexts.last();
    const artistNameText = await lastText.textContent();
    expect(artistNameText?.trim().length).toBeGreaterThan(0);
  });

  test('clicking a carousel card navigates to artwork detail', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('domcontentloaded');

    const carouselContainer = page.locator('.overflow-x-auto.scrollbar-hide.snap-x');
    await expect(carouselContainer).toBeVisible({ timeout: 15000 });

    const firstCardLink = carouselContainer.locator('.snap-start.shrink-0').first().locator('a[href*="/artworks/"]');
    await expect(firstCardLink).toBeAttached();

    const href = await firstCardLink.getAttribute('href');
    await firstCardLink.click();

    // Should navigate to the artwork detail page
    await page.waitForURL('**/artworks/**', { timeout: 15000 });
    expect(page.url()).toContain('/artworks/');

    // The detail page should load with visible content
    await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
  });
});
