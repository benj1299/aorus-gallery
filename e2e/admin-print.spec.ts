import { test, expect } from '@playwright/test';

test.describe('Print Routes', () => {
  test('artist print page loads', async ({ page }) => {
    // Get an artist ID from the admin list
    await page.goto('/admin/artists');
    await expect(page.locator('h1')).toBeVisible();

    const firstEditLink = page.locator('a[data-testid="edit-btn"]').first();
    const href = await firstEditLink.getAttribute('href');
    // href is like /admin/artists/some-id
    const id = href?.split('/').pop();

    await page.goto(`/admin/print/artist/${id}`);
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });

  test('exhibition print page loads', async ({ page }) => {
    await page.goto('/admin/exhibitions');
    await expect(page.locator('h1')).toBeVisible();

    const firstEditLink = page.locator('a[data-testid="edit-btn"]').first();
    const href = await firstEditLink.getAttribute('href');
    const id = href?.split('/').pop();

    if (!id) {
      test.skip();
      return;
    }

    await page.goto(`/admin/print/exhibition/${id}`);
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    // Verify content rendered (no 404)
    await expect(page.locator('text=404')).not.toBeVisible({ timeout: 2000 });
  });
});
