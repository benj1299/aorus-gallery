import { test, expect } from '@playwright/test';

test.describe('Artists CRUD', () => {
  test('list shows seeded artists', async ({ page }) => {
    await page.goto('/admin/artists');
    await expect(page.getByText('Matthieu Scheiffer')).toBeVisible();
    await expect(page.getByText('Owen Rival')).toBeVisible();
    // Should have artists in table
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(9);
  });

  test('create new artist', async ({ page }) => {
    await page.goto('/admin/artists/new');
    await expect(page.locator('h1')).toContainText('artiste');

    await page.locator('input[name="name"]').fill('Test Artist');
    await page.locator('input[name="nationality.en"]').fill('Test Country');

    // Bio is now a rich text editor (Tiptap)
    const editor = page.locator('.ProseMirror').first();
    await expect(editor).toBeVisible({ timeout: 10000 });
    await editor.click();
    await editor.pressSequentially('This is a test artist bio for E2E testing.');

    // Set image via ImageUpload hidden input
    await page.locator('input[type="hidden"][name="imageUrl"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80'; }
    );

    await page.evaluate(() => document.querySelector('form')?.requestSubmit());

    // Should redirect to artists list
    await page.waitForURL('**/admin/artists', { timeout: 15000 });
    await expect(page.getByText('Test Artist')).toBeVisible();
  });

  test('edit artist', async ({ page }) => {
    await page.goto('/admin/artists');

    // Find Test Artist row and click Edit (pencil icon with title="Modifier")
    const row = page.locator('tr', { hasText: 'Test Artist' });
    await row.locator('[title="Modifier"]').click();

    await expect(page.locator('h1')).toBeVisible();

    // Change the name
    const nameInput = page.locator('input[name="name"]');
    await nameInput.clear();
    await nameInput.fill('Test Artist Updated');

    await page.evaluate(() => document.querySelector('form')?.requestSubmit());

    await page.waitForURL('**/admin/artists', { timeout: 15000 });
    await expect(page.getByText('Test Artist Updated')).toBeVisible();
  });

  test('delete artist', async ({ page }) => {
    await page.goto('/admin/artists');

    const row = page.locator('tr', { hasText: 'Test Artist Updated' });
    await row.locator('[title="Supprimer"]').click();

    // Confirm deletion (check icon with title="Confirmer")
    await row.locator('[title="Confirmer"]').click();

    // Wait for server action + refresh
    await page.waitForTimeout(3000);
    await page.reload();
    await expect(page.getByText('Test Artist Updated')).not.toBeVisible();
  });
});
