import { test, expect } from '@playwright/test';

test.describe('Admin Messages', () => {
  test('messages page loads and shows table headers', async ({ page }) => {
    await page.goto('/admin/messages');
    await expect(page.getByRole('heading', { name: 'Messages de contact' })).toBeVisible();

    // Verify table headers are present (French labels)
    await expect(page.getByRole('columnheader', { name: 'Statut' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Nom' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Message' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Date' })).toBeVisible();
  });
});
