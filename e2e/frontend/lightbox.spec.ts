import { test, expect } from '@playwright/test';

test.describe('Lightbox', () => {
  let artworkSlug: string;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage({
      storageState: 'e2e/.auth/admin.json',
    });
    await page.goto('/en');
    await page.waitForLoadState('domcontentloaded');

    const artworkLink = page.locator('a[href*="/artworks/"]').first();
    await expect(artworkLink).toBeVisible({ timeout: 15000 });
    const href = await artworkLink.getAttribute('href');
    const parts = href!.split('/artworks/');
    artworkSlug = parts[parts.length - 1];

    await page.close();
  });

  test('clicking main image opens the lightbox dialog', async ({ page }) => {
    await page.goto(`/en/artworks/${artworkSlug}`);
    await page.waitForLoadState('domcontentloaded');

    const mainImage = page.locator('[data-testid="artwork-main-image"]');
    await expect(mainImage).toBeVisible({ timeout: 15000 });

    await mainImage.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });
  });

  test('lightbox image uses object-contain', async ({ page }) => {
    await page.goto(`/en/artworks/${artworkSlug}`);
    await page.waitForLoadState('domcontentloaded');

    const mainImage = page.locator('[data-testid="artwork-main-image"]');
    await expect(mainImage).toBeVisible({ timeout: 15000 });
    await mainImage.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    const lightboxImg = dialog.locator('img');
    await expect(lightboxImg).toBeAttached({ timeout: 5000 });
    const className = await lightboxImg.getAttribute('class');
    expect(className).toContain('object-contain');
  });

  test('pressing Escape closes the lightbox', async ({ page }) => {
    await page.goto(`/en/artworks/${artworkSlug}`);
    await page.waitForLoadState('domcontentloaded');

    const mainImage = page.locator('[data-testid="artwork-main-image"]');
    await expect(mainImage).toBeVisible({ timeout: 15000 });
    await mainImage.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    await page.keyboard.press('Escape');

    await expect(dialog).not.toBeVisible({ timeout: 5000 });
  });

  test('clicking close button closes the lightbox', async ({ page }) => {
    await page.goto(`/en/artworks/${artworkSlug}`);
    await page.waitForLoadState('domcontentloaded');

    const mainImage = page.locator('[data-testid="artwork-main-image"]');
    await expect(mainImage).toBeVisible({ timeout: 15000 });
    await mainImage.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    const closeBtn = page.locator('[data-testid="lightbox-close"]');
    await expect(closeBtn).toBeVisible({ timeout: 5000 });
    await closeBtn.click();

    await expect(dialog).not.toBeVisible({ timeout: 5000 });
  });

  test('contextual image opens lightbox at correct index', async ({ page }) => {
    await page.goto(`/en/artworks/${artworkSlug}`);
    await page.waitForLoadState('domcontentloaded');

    // Contextual images are in the details grid (aspect-[4/3] containers with cursor-zoom-in)
    const contextualImages = page.locator('.aspect-\\[4\\/3\\].cursor-zoom-in');
    const count = await contextualImages.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // Click the first contextual image (index 1 in the allImages array: main=0, contextual starts at 1)
    await contextualImages.first().click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Counter should show "2 / N" since contextual images start at index 1
    const counter = page.locator('[data-testid="lightbox-counter"]');
    await expect(counter).toBeVisible({ timeout: 5000 });
    const counterText = await counter.textContent();
    expect(counterText).toMatch(/^2\s*\/\s*\d+$/);
  });

  test('counter shows "1 / N" format when multiple images exist', async ({ page }) => {
    await page.goto(`/en/artworks/${artworkSlug}`);
    await page.waitForLoadState('domcontentloaded');

    // Check if this artwork has contextual images (which means allImages.length > 1)
    const contextualImages = page.locator('.aspect-\\[4\\/3\\].cursor-zoom-in');
    const contextualCount = await contextualImages.count();

    if (contextualCount === 0) {
      test.skip();
      return;
    }

    // Open lightbox from main image (index 0)
    const mainImage = page.locator('[data-testid="artwork-main-image"]');
    await expect(mainImage).toBeVisible({ timeout: 15000 });
    await mainImage.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    const counter = page.locator('[data-testid="lightbox-counter"]');
    await expect(counter).toBeVisible({ timeout: 5000 });
    const counterText = await counter.textContent();
    // Format: "1 / N" where N >= 2
    expect(counterText).toMatch(/^1\s*\/\s*\d+$/);
    const total = parseInt(counterText!.split('/')[1].trim(), 10);
    expect(total).toBeGreaterThanOrEqual(2);
  });

  test('navigation buttons appear when multiple images exist', async ({ page }) => {
    await page.goto(`/en/artworks/${artworkSlug}`);
    await page.waitForLoadState('domcontentloaded');

    const contextualImages = page.locator('.aspect-\\[4\\/3\\].cursor-zoom-in');
    const contextualCount = await contextualImages.count();

    if (contextualCount === 0) {
      test.skip();
      return;
    }

    const mainImage = page.locator('[data-testid="artwork-main-image"]');
    await expect(mainImage).toBeVisible({ timeout: 15000 });
    await mainImage.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    const prevBtn = page.locator('[data-testid="lightbox-prev"]');
    const nextBtn = page.locator('[data-testid="lightbox-next"]');

    await expect(prevBtn).toBeVisible({ timeout: 5000 });
    await expect(nextBtn).toBeVisible({ timeout: 5000 });
  });
});
