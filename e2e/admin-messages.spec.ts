import { test, expect } from '@playwright/test';

test.describe('Admin Messages', () => {
  test('messages page loads and shows table headers', async ({ page }) => {
    await page.goto('/admin/messages');
    await expect(page.getByRole('heading', { name: 'Contact Messages' })).toBeVisible();

    // Verify table headers are present
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Message' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Date' })).toBeVisible();
  });
});
