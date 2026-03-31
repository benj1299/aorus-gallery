import { test, expect } from '@playwright/test';

test.describe('Frontend i18n', () => {
  test('English locale shows English navigation', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
    // English nav items — scope to the header element to avoid body link duplicates
    const header = page.locator('header');
    await expect(header.getByRole('link', { name: 'Artists', exact: true })).toBeVisible();
    await expect(header.getByRole('link', { name: 'About', exact: true })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Press', exact: true })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
  });

  test('French locale shows French navigation', async ({ page }) => {
    await page.goto('/fr');
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
    // French nav items from fr.json — scope to header
    const header = page.locator('header');
    await expect(header.getByRole('link', { name: 'Artistes', exact: true })).toBeVisible();
    await expect(header.getByRole('link', { name: /Propos/i })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Presse', exact: true })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
  });

  test('Chinese locale shows Chinese navigation', async ({ page }) => {
    await page.goto('/zh');
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
    // Chinese nav items from zh.json (Traditional Chinese) — scope to header
    const header = page.locator('header');
    await expect(header.getByRole('link', { name: '藝術家', exact: true })).toBeVisible();
    await expect(header.getByRole('link', { name: '關於', exact: true })).toBeVisible();
    await expect(header.getByRole('link', { name: '媒體', exact: true })).toBeVisible();
    await expect(header.getByRole('link', { name: '聯繫', exact: true })).toBeVisible();
  });

  test('about page content changes per locale', async ({ page }) => {
    // English
    await page.goto('/en/about');
    await expect(page.getByText('About ORUS Gallery', { exact: true })).toBeVisible({ timeout: 10000 });

    // French
    await page.goto('/fr/about');
    await expect(page.getByText("propos d'ORUS Gallery")).toBeVisible({ timeout: 10000 });

    // Chinese
    await page.goto('/zh/about');
    await expect(page.getByText('關於 ORUS Gallery')).toBeVisible({ timeout: 10000 });
  });
});
