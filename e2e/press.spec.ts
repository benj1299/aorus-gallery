import { test, expect } from '@playwright/test';

test.describe('Press CRUD', () => {
  test('list shows seeded articles', async ({ page }) => {
    await page.goto('/admin/press');
    await expect(page.locator('h1')).toBeVisible();
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('create new press article', async ({ page }) => {
    await page.goto('/admin/press/new');
    await expect(page.locator('h1')).toBeVisible();

    await page.locator('input[name="title.en"]').fill('Test Press Article E2E');
    await page.locator('input[name="publication"]').fill('Test Publication');
    await page.locator('input[name="publishedAt"]').fill('2025-06-15');
    await page.locator('input[name="url"]').fill('https://example.com/test');

    // Set image via ImageUpload hidden input
    await page.locator('input[type="hidden"][name="imageUrl"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'https://images.unsplash.com/photo-1577720643272-265f09367456?w=600&q=80'; }
    );

    // Excerpt is now richtext (Tiptap) — type in ProseMirror editor
    const editor = page.locator('.ProseMirror').first();
    await expect(editor).toBeVisible({ timeout: 10000 });
    await editor.click();
    await editor.pressSequentially('Test excerpt for E2E testing.');

    await page.evaluate(() => document.querySelector('form')?.requestSubmit());

    await page.waitForURL('**/admin/press', { timeout: 15000 });
    await expect(page.getByText('Test Press Article E2E')).toBeVisible();
  });

  test('edit press article', async ({ page }) => {
    await page.goto('/admin/press');

    const row = page.locator('tr', { hasText: 'Test Press Article E2E' });
    await row.locator('[data-testid="edit-btn"]').click();

    const titleInput = page.locator('input[name="title.en"]');
    await titleInput.clear();
    await titleInput.fill('Test Press Updated');

    await page.evaluate(() => document.querySelector('form')?.requestSubmit());

    await page.waitForURL('**/admin/press', { timeout: 15000 });
    await expect(page.getByText('Test Press Updated')).toBeVisible();
  });

  test('delete press article', async ({ page }) => {
    await page.goto('/admin/press');

    const row = page.locator('tr', { hasText: 'Test Press Updated' });
    await row.locator('[data-testid="delete-btn"]').click();
    await row.locator('[data-testid="delete-confirm"]').click();

    await expect(row).not.toBeVisible({ timeout: 10000 });
  });
});
