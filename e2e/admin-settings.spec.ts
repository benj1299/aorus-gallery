import { test, expect } from '@playwright/test';

test.describe('Admin Settings', () => {
  test('toggle exhibitions visibility', async ({ page }) => {
    // Step 1: Enable exhibitions
    await page.goto('/admin/settings');
    await expect(page.locator('h1')).toBeVisible();

    // Read current state
    const currentState = await page.locator('button[role="switch"]#showExhibitions').getAttribute('data-state');

    // If unchecked, click to toggle on
    if (currentState === 'unchecked') {
      await page.locator('button[role="switch"]#showExhibitions').click();
      await expect(page.locator('input[type="hidden"][name="showExhibitions"]')).toHaveValue('true');
    }

    // Submit and wait for the server action to complete
    await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/admin/settings') && resp.status() < 400),
      page.locator('button[type="submit"]').click(),
    ]);

    // Wait for the page to fully settle
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verify exhibitions link visible on public site
    await page.goto('/fr', { waitUntil: 'networkidle' });
    await expect(page.locator('header').getByText('Expositions')).toBeVisible({ timeout: 10000 });

    // Step 2: Disable exhibitions
    await page.goto('/admin/settings');
    await expect(page.locator('h1')).toBeVisible();

    const currentState2 = await page.locator('button[role="switch"]#showExhibitions').getAttribute('data-state');
    if (currentState2 === 'checked') {
      await page.locator('button[role="switch"]#showExhibitions').click();
      await expect(page.locator('input[type="hidden"][name="showExhibitions"]')).toHaveValue('false');
    }

    await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/admin/settings') && resp.status() < 400),
      page.locator('button[type="submit"]').click(),
    ]);

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.goto('/fr', { waitUntil: 'networkidle' });
    await expect(page.locator('header').getByText('Expositions')).not.toBeVisible({ timeout: 5000 });
  });
});
