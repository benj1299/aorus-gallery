import { test, expect } from '@playwright/test';

/**
 * Victor feedback: "Pour la bannière, ça ne marche pas."
 * Fix: banner is now rendered above the ORUS hero (when visible).
 * These tests verify the structure renders without error when banner data is present or absent.
 */

test.describe('Homepage Banner Placement', () => {
  test('homepage loads without error', async ({ page }) => {
    const response = await page.goto('/fr');
    expect(response?.status()).toBeLessThan(400);
    await page.waitForLoadState('domcontentloaded');
    // The ORUS hero must always be visible regardless of banner presence
    await expect(page.getByRole('heading', { name: /ORUS/i }).first()).toBeVisible({ timeout: 15000 });
  });

  test('banner (when present) renders above hero', async ({ page }) => {
    await page.goto('/fr');
    await page.waitForLoadState('domcontentloaded');

    const banner = page.locator('[data-testid="home-banner"]');
    const bannerCount = await banner.count();

    if (bannerCount === 0) {
      // No banner configured — acceptable state, skip positional check
      test.skip();
      return;
    }

    const bannerBox = await banner.boundingBox();
    const heroHeading = page.getByRole('heading', { name: /ORUS/i }).first();
    const heroBox = await heroHeading.boundingBox();

    expect(bannerBox).not.toBeNull();
    expect(heroBox).not.toBeNull();
    expect(bannerBox!.y).toBeLessThan(heroBox!.y);
  });
});
