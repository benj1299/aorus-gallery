import { test, expect } from '@playwright/test';

test.describe('ISR Revalidation', () => {
  test('new artist appears on public page after creation', async ({ page }) => {
    const name = `ISR Artist ${Date.now()}`;

    // Create artist via admin
    await page.goto('/admin/artists/new');
    await expect(page.locator('h1')).toBeVisible();

    await page.locator('input[name="name"]').fill(name);
    await page.locator('input[name="nationality.en"]').fill('Test');

    const editor = page.locator('.ProseMirror').first();
    await expect(editor).toBeVisible({ timeout: 10000 });
    await editor.click();
    await editor.pressSequentially('ISR test bio');

    await page.locator('input[type="hidden"][name="imageUrl"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600'; }
    );

    await page.evaluate(() => document.querySelector('form')?.requestSubmit());
    await page.waitForURL('**/admin/artists', { timeout: 15000 });

    // Check public page
    await page.goto('/en/artists', { waitUntil: 'networkidle' });
    await expect(page.getByText(name)).toBeVisible({ timeout: 15000 });

    // Cleanup
    await page.goto('/admin/artists');
    const row = page.locator('tr', { hasText: name });
    await row.locator('[title="Supprimer"]').click();
    await row.locator('[title="Confirmer"]').click();
    await page.waitForTimeout(3000);
  });

  test('new press article appears on public page', async ({ page }) => {
    const title = `ISR Press ${Date.now()}`;

    await page.goto('/admin/press/new');
    await expect(page.locator('h1')).toBeVisible();

    await page.locator('input[name="title.en"]').fill(title);
    await page.locator('input[name="publication"]').fill('Test Publication');
    await page.locator('input[name="publishedAt"]').fill('2025-06-15');
    await page.locator('input[name="url"]').fill('https://example.com/test');

    await page.locator('input[type="hidden"][name="imageUrl"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'https://images.unsplash.com/photo-1577720643272-265f09367456?w=600'; }
    );

    const editor = page.locator('.ProseMirror').first();
    if (await editor.count() > 0) {
      await editor.click();
      await editor.pressSequentially('ISR test excerpt content');
    }

    await page.evaluate(() => document.querySelector('form')?.requestSubmit());
    await page.waitForURL('**/admin/press', { timeout: 15000 });

    // Check public page
    await page.goto('/en/press', { waitUntil: 'networkidle' });
    await expect(page.getByText(title)).toBeVisible({ timeout: 15000 });

    // Cleanup
    await page.goto('/admin/press');
    const row = page.locator('tr', { hasText: title });
    await row.locator('[title="Supprimer"]').click();
    await row.locator('[title="Confirmer"]').click();
    await page.waitForTimeout(3000);
  });
});
