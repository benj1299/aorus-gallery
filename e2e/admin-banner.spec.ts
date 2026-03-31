import { test, expect } from '@playwright/test';

/** Set an image URL in the ImageUpload component by targeting its hidden input */
async function setImageUrl(page: import('@playwright/test').Page, name: string, url: string) {
  await page.locator(`input[type="hidden"][name="${name}"]`).evaluate(
    (el: HTMLInputElement, u: string) => { el.value = u; },
    url
  );
}

test.describe('Banner CRUD', () => {
  test('create visible banner', async ({ page }) => {
    await page.goto('/admin/banner');
    await expect(page.locator('h1')).toBeVisible();

    // Fill in the banner form — title EN tab is active by default
    const titleInput = page.locator('input[name="title.en"]');
    await titleInput.clear();
    await titleInput.fill('E2E Banner Visible Test');

    // Set image via hidden input directly
    await setImageUrl(page, 'imageUrl', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600');

    // Set visible to true via the hidden input
    await page.locator('input[type="hidden"][name="visible"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'true'; }
    );

    // Submit form via requestSubmit
    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.waitForURL('**/admin/banner', { timeout: 15000 });
    await expect(page.locator('h1')).toBeVisible();
  });

  test('set banner invisible and verify admin state', async ({ page }) => {
    await page.goto('/admin/banner');
    await expect(page.locator('h1')).toBeVisible();

    // Fill title
    const titleInput = page.locator('input[name="title.en"]');
    await titleInput.clear();
    await titleInput.fill('E2E Banner Hidden Test');

    // Set image via hidden input directly
    await setImageUrl(page, 'imageUrl', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600');

    // Set visible to false via the hidden input
    await page.locator('input[type="hidden"][name="visible"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'false'; }
    );

    // Submit form via requestSubmit
    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.waitForURL('**/admin/banner', { timeout: 15000 });

    // Verify the saved state: the visible toggle should reflect "false"
    const savedValue = await page.locator('input[type="hidden"][name="visible"]').inputValue();
    expect(savedValue).toBe('false');
  });
});
