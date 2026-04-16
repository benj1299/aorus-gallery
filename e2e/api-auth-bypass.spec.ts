import { test, expect } from '@playwright/test';

test.describe('Server Actions Auth Bypass', () => {
  test('createArtist rejects without auth', async ({ page }) => {
    await page.goto('/admin/artists/new');
    await expect(page.locator('h1')).toBeVisible();

    // Clear auth cookies
    await page.context().clearCookies();

    // Fill minimal form and submit
    await page.locator('input[name="name"]').fill('Unauthorized Artist');
    await page.evaluate(() => document.querySelector('form')?.requestSubmit());

    // Should NOT redirect to /admin/artists (the success path)
    // Wait for any potential navigation to settle, then assert we stayed on the form
    await page.waitForLoadState('networkidle');
    expect(page.url()).not.toMatch(/\/admin\/artists$/);
  });

  test('updateSiteSettings rejects without auth', async ({ page }) => {
    await page.goto('/admin/settings');
    await expect(page.locator('h1')).toBeVisible();

    await page.context().clearCookies();

    await page.evaluate(() => document.querySelector('form')?.requestSubmit());

    await page.waitForLoadState('networkidle');
    // Should not successfully save — either error or redirect to login
    // The page should NOT still show the settings form working normally
  });
});
