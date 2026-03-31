import { test, expect } from '@playwright/test';

/** Remove the Next.js dev overlay that intercepts pointer events */
async function dismissOverlay(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    document.querySelectorAll('nextjs-portal').forEach(el => el.remove());
  });
}

test.describe('Exhibitions CRUD', () => {
  const uniqueSuffix = Date.now().toString().slice(-6);
  const exhibitionTitle = `E2E Exhibition ${uniqueSuffix}`;
  const exhibitionTitleUpdated = `E2E Exhibition ${uniqueSuffix} Updated`;

  test('list shows exhibitions page', async ({ page }) => {
    await page.goto('/admin/exhibitions');
    await expect(page.getByRole('heading', { name: 'Exhibitions' })).toBeVisible();
  });

  test('create, edit, and delete exhibition', async ({ page }) => {
    // Create a new exhibition
    await page.goto('/admin/exhibitions/new');
    await expect(page.getByText('New Exhibition')).toBeVisible();

    // Fill title (EN tab is active by default)
    await page.locator('input[name="title.en"]').fill(exhibitionTitle);

    // Set type and status via hidden inputs directly (bypasses Radix Select)
    await page.locator('input[type="hidden"][name="type"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'EXHIBITION'; }
    );
    await page.locator('input[type="hidden"][name="status"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'CURRENT'; }
    );

    // Submit form via requestSubmit
    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.waitForURL('**/admin/exhibitions', { timeout: 15000 });

    // Verify it appears in the list
    await expect(page.getByText(exhibitionTitle)).toBeVisible();

    // Edit the exhibition — dismiss overlay after redirect
    const row = page.locator('tr', { hasText: exhibitionTitle });
    await dismissOverlay(page);
    await row.getByText('Edit').click();

    // Change the title
    const titleInput = page.locator('input[name="title.en"]');
    await titleInput.clear();
    await titleInput.fill(exhibitionTitleUpdated);

    // Submit via requestSubmit
    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.waitForURL('**/admin/exhibitions', { timeout: 15000 });
    await expect(page.getByText(exhibitionTitleUpdated)).toBeVisible();

    // Delete the exhibition
    await dismissOverlay(page);
    const updatedRow = page.locator('tr', { hasText: exhibitionTitleUpdated });
    await updatedRow.getByText('Delete').click();
    await updatedRow.getByText('Confirm').click();

    await page.waitForTimeout(3000);
    await page.reload();
    await expect(page.getByText(exhibitionTitleUpdated)).not.toBeVisible();
  });
});
