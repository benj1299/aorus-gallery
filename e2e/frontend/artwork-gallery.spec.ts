import { test, expect } from '@playwright/test';

/**
 * Victor feedback: "il faut bien réussir aussi à défiler après toutes les photos
 * des œuvres et ensuite les oeuvres ne s'affichent pas bien au niveau de leur
 * autres photos."
 *
 * Fix: main image swaps via a thumbnail strip; contextual photos are now a
 * horizontal snap carousel with smooth scroll.
 */

async function findArtworkWithMultipleImages(page: import('@playwright/test').Page): Promise<string> {
  await page.goto('/fr');
  await page.waitForLoadState('domcontentloaded');
  const links = page.locator('a[href*="/artworks/"]');
  const count = await links.count();
  for (let i = 0; i < Math.min(count, 10); i++) {
    const href = await links.nth(i).getAttribute('href');
    if (!href) continue;
    const slug = href.split('/artworks/').pop();
    if (!slug) continue;
    await page.goto(`/fr/artworks/${slug}`);
    await page.waitForLoadState('domcontentloaded');
    const thumbs = page.locator('[data-testid="artwork-thumbnails"] button');
    if ((await thumbs.count()) > 1) return slug;
  }
  return '';
}

test.describe('Artwork Gallery Navigation', () => {
  test('main image container is attached and uses contain fit', async ({ page }) => {
    await page.goto('/fr');
    await page.waitForLoadState('domcontentloaded');
    const firstArtwork = page.locator('a[href*="/artworks/"]').first();
    const href = await firstArtwork.getAttribute('href');
    const slug = href!.split('/artworks/').pop();
    await page.goto(`/fr/artworks/${slug}`);
    await page.waitForLoadState('domcontentloaded');

    const mainImage = page.locator('[data-testid="artwork-main-image"] img').first();
    await expect(mainImage).toBeAttached({ timeout: 15000 });
    const cls = await mainImage.getAttribute('class');
    expect(cls).toContain('object-contain');
  });

  test('thumbnail strip appears when artwork has multiple images', async ({ page }) => {
    const slug = await findArtworkWithMultipleImages(page);
    if (!slug) {
      test.skip();
      return;
    }
    await page.goto(`/fr/artworks/${slug}`);
    await page.waitForLoadState('domcontentloaded');
    const thumbs = page.locator('[data-testid="artwork-thumbnails"] button');
    await expect(thumbs.first()).toBeVisible({ timeout: 15000 });
    const count = await thumbs.count();
    expect(count).toBeGreaterThan(1);
  });

  test('clicking a thumbnail swaps the main image', async ({ page }) => {
    const slug = await findArtworkWithMultipleImages(page);
    if (!slug) {
      test.skip();
      return;
    }
    await page.goto(`/fr/artworks/${slug}`);
    await page.waitForLoadState('domcontentloaded');

    const mainImg = page.locator('[data-testid="artwork-main-image"] img').first();
    await expect(mainImg).toBeAttached({ timeout: 15000 });
    const initialSrc = await mainImg.getAttribute('src');

    const secondThumb = page.locator('[data-testid="artwork-thumbnails"] button').nth(1);
    await secondThumb.click();

    // Wait for src to change
    await expect.poll(async () => {
      const el = page.locator('[data-testid="artwork-main-image"] img').first();
      return el.getAttribute('src');
    }, { timeout: 5000 }).not.toBe(initialSrc);
  });

  test('contextual carousel is horizontally scrollable', async ({ page }) => {
    const slug = await findArtworkWithMultipleImages(page);
    if (!slug) {
      test.skip();
      return;
    }
    await page.goto(`/fr/artworks/${slug}`);
    await page.waitForLoadState('domcontentloaded');

    const carousel = page.locator('[data-testid="artwork-contextual-carousel"]');
    const count = await carousel.count();
    if (count === 0) {
      // Artwork has thumbnails but no contextual extra images array
      test.skip();
      return;
    }

    const overflowX = await carousel.evaluate((el) => getComputedStyle(el).overflowX);
    expect(overflowX).toMatch(/auto|scroll/);
  });
});
