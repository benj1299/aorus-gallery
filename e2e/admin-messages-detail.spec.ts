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

  test('delete message via detail page', async ({ page }) => {
    const uniqueName = `Delete Test ${Date.now()}`;
    const uniqueEmail = `delete-${Date.now()}@test.com`;

    // Step 1: Create a contact message via the public form
    await page.goto('/fr/contact');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    await page.locator('#status-collector').click();
    await page.locator('#name').fill(uniqueName);
    await page.locator('#email').fill(uniqueEmail);
    await page.locator('#message').fill('Message to be deleted');
    await page.locator('#rgpd').check();
    await page.getByRole('button', { name: /Envoyer/i }).click();
    await expect(page.getByText('Merci')).toBeVisible({ timeout: 10000 });

    // Step 2: Navigate to admin messages and find the message
    await page.goto('/admin/messages');
    await expect(page.getByText(uniqueName)).toBeVisible({ timeout: 10000 });

    // Step 3: Click the view link on that row
    const row = page.locator('tbody tr', { hasText: uniqueName });
    await row.locator('a[title*="Voir"]').click();

    // Step 4: Verify we're on the detail page
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // Step 5: Click the delete button ("Supprimer")
    await page.getByRole('button', { name: 'Supprimer' }).click();

    // Step 6: Confirm deletion by clicking "Oui"
    await page.getByRole('button', { name: 'Oui' }).click();

    // Step 7: Verify redirect to /admin/messages
    await page.waitForURL('**/admin/messages', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Messages de contact' })).toBeVisible();

    // Step 8: Verify the message is gone
    await expect(page.getByText(uniqueName)).not.toBeVisible({ timeout: 5000 });
  });
});
