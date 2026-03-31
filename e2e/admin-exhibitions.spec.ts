import { test, expect } from '@playwright/test';

test.describe('Exhibitions CRUD', () => {
  const uniqueSuffix = Date.now().toString().slice(-6);
  const exhibitionTitle = `E2E Exhibition ${uniqueSuffix}`;
  const exhibitionTitleUpdated = `E2E Exhibition ${uniqueSuffix} Updated`;

  test('list shows exhibitions page', async ({ page }) => {
    await page.goto('/admin/exhibitions');
    await expect(page.getByRole('heading', { name: 'Expositions' })).toBeVisible();
  });

  test('create, edit, and delete exhibition', async ({ page }) => {
    // Create a new exhibition
    await page.goto('/admin/exhibitions/new');
    await expect(page.locator('h1')).toBeVisible();

    // Fill title (EN tab is active by default)
    await page.locator('input[name="title.en"]').fill(exhibitionTitle);

    // Set type and status via native select
    await page.locator('select[name="type"]').selectOption('EXHIBITION');
    await page.locator('select[name="status"]').selectOption('CURRENT');

    // Submit form via requestSubmit
    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.waitForURL('**/admin/exhibitions', { timeout: 15000 });

    // Verify it appears in the list
    await expect(page.getByText(exhibitionTitle)).toBeVisible();

    // Edit the exhibition — use icon button with title
    const row = page.locator('tr', { hasText: exhibitionTitle });
    await row.locator('[title="Modifier"]').click();

    // Change the title
    const titleInput = page.locator('input[name="title.en"]');
    await titleInput.clear();
    await titleInput.fill(exhibitionTitleUpdated);

    // Submit via requestSubmit
    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.waitForURL('**/admin/exhibitions', { timeout: 15000 });
    await expect(page.getByText(exhibitionTitleUpdated)).toBeVisible();

    // Delete the exhibition
    const updatedRow = page.locator('tr', { hasText: exhibitionTitleUpdated });
    await updatedRow.locator('[title="Supprimer"]').click();
    await updatedRow.locator('[title="Confirmer"]').click();

    await page.waitForTimeout(3000);
    await page.reload();
    await expect(page.getByText(exhibitionTitleUpdated)).not.toBeVisible();
  });
});
