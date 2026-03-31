import { test, expect } from '@playwright/test';

test.describe('Rich Text Editor', () => {
  test('type and format text in bio editor', async ({ page }) => {
    await page.goto('/admin/artists/new');

    // Find the ProseMirror editor (inside bio TranslatableInput)
    const editor = page.locator('.ProseMirror').first();
    await expect(editor).toBeVisible({ timeout: 10000 });

    // Type text
    await editor.click();
    await editor.type('Hello World');

    // Select all text and bold it
    await page.keyboard.press('Control+A');
    await page.locator('button[title="Gras"]').or(page.locator('button').filter({ has: page.locator('svg') }).first()).click();

    // Check hidden input contains <strong>
    const html = await page.locator('input[type="hidden"][name="bio.en"]').inputValue();
    expect(html).toContain('<strong>');
  });
});
