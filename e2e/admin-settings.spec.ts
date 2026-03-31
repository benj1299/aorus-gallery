import { test, expect } from '@playwright/test';

test.describe('Admin Settings', () => {
  test('toggle exhibitions visibility', async ({ page }) => {
    // Enable exhibitions
    await page.goto('/admin/settings');
    await expect(page.locator('h1')).toBeVisible();

    // Set showExhibitions to true via hidden input
    await page.evaluate(() => {
      const input = document.querySelector('input[type="hidden"][name="showExhibitions"]') as HTMLInputElement;
      if (input) input.value = 'true';
    });
    await page.evaluate(() => document.querySelector('form')?.requestSubmit());
    await page.waitForURL('**/admin/settings', { timeout: 15000 });

    // Verify exhibitions link visible on public site
    await page.goto('/fr');
    const header = page.locator('header');
    await expect(header.getByText('Expositions')).toBeVisible();

    // Disable exhibitions
    await page.goto('/admin/settings');
    await page.evaluate(() => {
      const input = document.querySelector('input[type="hidden"][name="showExhibitions"]') as HTMLInputElement;
      if (input) input.value = 'false';
    });
    await page.evaluate(() => document.querySelector('form')?.requestSubmit());
    await page.waitForURL('**/admin/settings', { timeout: 15000 });

    // Verify exhibitions link hidden
    await page.goto('/fr');
    await expect(page.locator('header').getByText('Expositions')).not.toBeVisible();
  });
});
