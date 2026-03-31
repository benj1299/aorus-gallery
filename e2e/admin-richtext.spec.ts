import { test, expect } from '@playwright/test';

test.describe('Rich Text Editor', () => {
  test('type and format text in bio editor', async ({ page }) => {
    await page.goto('/admin/artists/new');

    // Find the ProseMirror editor (inside bio TranslatableInput)
    const editor = page.locator('.ProseMirror').first();
    await expect(editor).toBeVisible({ timeout: 10000 });

    // Type text
    await editor.click();
    await editor.pressSequentially('Hello World');

    // Select all text and bold it
    await page.keyboard.press('Meta+A');
    // Click the bold button in the toolbar
    const boldButton = page.locator('button[title="Gras"]');
    if (await boldButton.count() > 0) {
      await boldButton.click();
    } else {
      // Fallback: use keyboard shortcut
      await page.keyboard.press('Meta+B');
    }

    // Check hidden input contains <strong>
    const html = await page.locator('input[type="hidden"][name="bio.en"]').inputValue();
    expect(html).toContain('<strong>');
  });
});
