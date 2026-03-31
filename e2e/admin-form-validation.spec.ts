import { test, expect } from '@playwright/test';

test.describe('Form Validation', () => {
  test('artist form rejects empty name', async ({ page }) => {
    await page.goto('/admin/artists/new');
    await expect(page.locator('h1')).toBeVisible();

    // Don't fill name, but fill required image
    await page.locator('input[type="hidden"][name="imageUrl"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'https://example.com/test.jpg'; }
    );

    await page.evaluate(() => document.querySelector('form')?.requestSubmit());

    // Should NOT redirect to /admin/artists
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/admin/artists/new');
  });

  test('artwork form rejects no artist selected', async ({ page }) => {
    await page.goto('/admin/artworks/new');
    await expect(page.locator('h1')).toBeVisible();

    await page.locator('input[name="title.en"]').fill('Test Artwork');
    // Don't select an artist
    await page.locator('input[type="hidden"][name="imageUrl"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'https://example.com/test.jpg'; }
    );

    await page.evaluate(() => document.querySelector('form')?.requestSubmit());

    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/admin/artworks/new');
  });
});
