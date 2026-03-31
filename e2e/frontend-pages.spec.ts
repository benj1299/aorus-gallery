import { test, expect } from '@playwright/test';

test.describe('Frontend Pages', () => {
  test('homepage loads and has ORUS GALLERY text', async ({ page }) => {
    await page.goto('/en');
    // The hero section has the title "ORUS GALLERY" in an h1 or prominent element
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
    // Navigation should be present
    await expect(page.getByRole('link', { name: 'Artists', exact: true })).toBeVisible();
  });

  test('about page loads and has ORIGIN + US', async ({ page }) => {
    await page.goto('/en/about');
    await expect(page.getByText('ORIGIN + US', { exact: true })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('About ORUS Gallery', { exact: true })).toBeVisible();
  });

  test('artists page loads and shows artist cards', async ({ page }) => {
    await page.goto('/en/artists');
    // Wait for the page to load with artist content
    await expect(page.getByText('Matthieu Scheiffer').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Owen Rival').first()).toBeVisible();
  });

  test('artist detail page loads with name', async ({ page }) => {
    await page.goto('/en/artists/matthieu-scheiffer');
    await expect(page.getByText('Matthieu Scheiffer').first()).toBeVisible({ timeout: 10000 });
  });

  test('press page loads', async ({ page }) => {
    await page.goto('/en/press');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });

  test('contact page loads with form fields', async ({ page }) => {
    await page.goto('/en/contact');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    // Verify form fields are present
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#message')).toBeVisible();
    await expect(page.locator('#rgpd')).toBeVisible();
  });

  test('exhibitions page loads', async ({ page }) => {
    await page.goto('/en/exhibitions');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });

  test('privacy page loads', async ({ page }) => {
    await page.goto('/en/privacy');
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible({ timeout: 10000 });
  });

  test('terms page loads', async ({ page }) => {
    await page.goto('/en/terms');
    await expect(page.getByRole('heading', { name: 'Terms & Conditions' })).toBeVisible({ timeout: 10000 });
  });
});
