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
    await page.waitForLoadState('networkidle');
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

    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/artworks/new');
  });

  test('exhibition form rejects empty title', async ({ page }) => {
    await page.goto('/admin/exhibitions/new');
    await expect(page.locator('h1')).toBeVisible();

    // Don't fill title, just submit
    await page.evaluate(() => document.querySelector('form')?.requestSubmit());
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/exhibitions/new');
  });

  test('press form rejects empty publication', async ({ page }) => {
    await page.goto('/admin/press/new');
    await expect(page.locator('h1')).toBeVisible();

    // Fill title but skip required publication and publishedAt fields
    await page.locator('input[name="title.en"]').fill('Test Press');
    await page.evaluate(() => document.querySelector('form')?.requestSubmit());
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/press/new');
  });

  test('banner form rejects empty title', async ({ page }) => {
    await page.goto('/admin/banner');
    await expect(page.locator('h1')).toBeVisible();

    // Don't fill title, just set image and submit
    await page.locator('input[type="hidden"][name="imageUrl"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'https://example.com/test.jpg'; }
    );

    await page.evaluate(() => document.querySelector('form')?.requestSubmit());
    await page.waitForLoadState('networkidle');

    // Should stay on banner page (no redirect)
    expect(page.url()).toContain('/admin/banner');
  });

  test('artist form shows error toast for invalid data', async ({ page }) => {
    await page.goto('/admin/artists/new');
    await expect(page.locator('h1')).toBeVisible();

    // Submit with empty name via button click (triggers useActionState properly)
    await page.locator('input[type="hidden"][name="imageUrl"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'https://example.com/test.jpg'; }
    );

    await page.locator('button[type="submit"]').click();

    // Should show a toast error (Sonner uses [data-sonner-toast] or li[data-sonner-toast])
    const toastLocator = page.locator('[data-sonner-toast]').or(page.locator('[role="status"]'));
    await expect(toastLocator).toBeVisible({ timeout: 10000 });

    // Should NOT redirect — still on /new
    expect(page.url()).toContain('/admin/artists/new');
  });
});
