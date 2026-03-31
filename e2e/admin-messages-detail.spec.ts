import { test, expect } from '@playwright/test';

test.describe('Messages Detail', () => {
  test('view message detail', async ({ page }) => {
    await page.goto('/admin/messages');

    // Click eye icon on first message row (if any messages exist)
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    if (count === 0) {
      test.skip();
      return;
    }

    // Click the eye icon (title="Voir le message" or similar)
    await rows.first().locator('a[title*="Voir"]').click();

    // Verify detail page shows content
    await expect(page.locator('h1')).toBeVisible();
    // Should show email, message content
    await expect(page.locator('text=@')).toBeVisible(); // email contains @
  });
});
