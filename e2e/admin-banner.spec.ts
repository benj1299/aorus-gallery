import { test, expect } from '@playwright/test';

test.describe('Banner CRUD', () => {
  test('create visible banner and verify on homepage', async ({ page }) => {
    await page.goto('/admin/banner');
    await expect(page.getByText('Home Banner')).toBeVisible();

    // Fill in the banner form — title EN tab is active by default
    const titleInput = page.locator('input[name="title.en"]');
    await titleInput.clear();
    await titleInput.fill('E2E Banner Visible Test');

    // Fill image URL
    const imageUrlInput = page.locator('input[name="imageUrl"]');
    await imageUrlInput.clear();
    await imageUrlInput.fill('https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600');

    // Set visible to true via the hidden input
    await page.locator('input[type="hidden"][name="visible"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'true'; }
    );

    // Submit form via requestSubmit
    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.waitForURL('**/admin/banner', { timeout: 15000 });
    await expect(page.getByText('Home Banner')).toBeVisible();

    // Verify banner appears on the homepage
    await page.goto('/en');
    await expect(page.getByText('E2E Banner Visible Test')).toBeVisible({ timeout: 10000 });
  });

  test('set banner invisible and verify admin state', async ({ page }) => {
    await page.goto('/admin/banner');
    await expect(page.getByText('Home Banner')).toBeVisible();

    // Fill title
    const titleInput = page.locator('input[name="title.en"]');
    await titleInput.clear();
    await titleInput.fill('E2E Banner Hidden Test');

    const imageUrlInput = page.locator('input[name="imageUrl"]');
    await imageUrlInput.clear();
    await imageUrlInput.fill('https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600');

    // Set visible to false via the hidden input
    await page.locator('input[type="hidden"][name="visible"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'false'; }
    );

    // Submit form via requestSubmit
    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.waitForURL('**/admin/banner', { timeout: 15000 });

    // Verify the saved state: the visible toggle should reflect "false"
    // The hidden input should have been set to false by the server action redirect
    const savedValue = await page.locator('input[type="hidden"][name="visible"]').inputValue();
    expect(savedValue).toBe('false');
  });
});
