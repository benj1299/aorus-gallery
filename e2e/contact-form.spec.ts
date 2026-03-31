import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('submit contact form and verify in admin messages', async ({ page }) => {
    const uniqueName = `E2E Tester ${Date.now()}`;
    const uniqueEmail = `e2e-${Date.now()}@test.com`;
    const uniqueMessage = `This is an automated E2E test message ${Date.now()}`;

    // Navigate to the French contact page
    await page.goto('/fr/contact');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // Select a status radio button (collector)
    await page.locator('#status-collector').click();

    // Fill name
    await page.locator('#name').fill(uniqueName);

    // Fill email
    await page.locator('#email').fill(uniqueEmail);

    // Fill message
    await page.locator('#message').fill(uniqueMessage);

    // Check RGPD checkbox
    await page.locator('#rgpd').check();

    // Submit the form
    await page.getByRole('button', { name: /Envoyer/i }).click();

    // Verify success message appears (French)
    await expect(page.getByText('Merci pour votre message')).toBeVisible({ timeout: 10000 });

    // Navigate to admin messages and verify the submission appears
    await page.goto('/admin/messages');
    await expect(page.getByRole('heading', { name: 'Messages de contact' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(uniqueName)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(uniqueEmail)).toBeVisible();
  });
});
