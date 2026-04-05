import { test, expect } from '@playwright/test';

test.describe('Admin Quick Toggles', () => {
  test('toggle visible switch on an artwork changes its state', async ({ page }) => {
    await page.goto('/admin/artworks');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    // Find the first row's "Visible" toggle (Radix Switch rendered as button[role="switch"])
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();

    // The toggle labels contain "Visible", "En avant", "Vendu" — get the first switch in the row
    const visibleToggle = firstRow.locator('label', { hasText: 'Visible' }).locator('button[role="switch"]');
    await expect(visibleToggle).toBeVisible();

    const initialState = await visibleToggle.getAttribute('data-state');

    // Click to toggle
    await visibleToggle.click();
    await page.waitForTimeout(1500);

    // State should have changed
    const newState = await visibleToggle.getAttribute('data-state');
    expect(newState).not.toBe(initialState);

    // Toggle back to restore original state
    await visibleToggle.click();
    await page.waitForTimeout(1500);

    const restoredState = await visibleToggle.getAttribute('data-state');
    expect(restoredState).toBe(initialState);
  });

  test('toggle featured switch works', async ({ page }) => {
    await page.goto('/admin/artworks');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();

    const featuredToggle = firstRow.locator('label', { hasText: 'En avant' }).locator('button[role="switch"]');
    await expect(featuredToggle).toBeVisible();

    const initialState = await featuredToggle.getAttribute('data-state');
    await featuredToggle.click();
    await page.waitForTimeout(1500);

    const newState = await featuredToggle.getAttribute('data-state');
    expect(newState).not.toBe(initialState);

    // Restore
    await featuredToggle.click();
    await page.waitForTimeout(1500);
  });

  test('toggle sold switch works', async ({ page }) => {
    await page.goto('/admin/artworks');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();

    const soldToggle = firstRow.locator('label', { hasText: 'Vendu' }).locator('button[role="switch"]');
    await expect(soldToggle).toBeVisible();

    const initialState = await soldToggle.getAttribute('data-state');
    await soldToggle.click();
    await page.waitForTimeout(1500);

    const newState = await soldToggle.getAttribute('data-state');
    expect(newState).not.toBe(initialState);

    // Restore
    await soldToggle.click();
    await page.waitForTimeout(1500);
  });

  test('toggling back restores original state', async ({ page }) => {
    await page.goto('/admin/artworks');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();

    const visibleToggle = firstRow.locator('label', { hasText: 'Visible' }).locator('button[role="switch"]');
    await expect(visibleToggle).toBeVisible();

    const originalState = await visibleToggle.getAttribute('data-state');

    // Toggle on
    await visibleToggle.click();
    await page.waitForTimeout(1500);
    const toggledState = await visibleToggle.getAttribute('data-state');
    expect(toggledState).not.toBe(originalState);

    // Toggle back
    await visibleToggle.click();
    await page.waitForTimeout(1500);
    const restoredState = await visibleToggle.getAttribute('data-state');
    expect(restoredState).toBe(originalState);
  });

  test('artists list has visible toggle', async ({ page }) => {
    await page.goto('/admin/artists');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();

    const visibleToggle = firstRow.locator('label', { hasText: 'Visible' }).locator('button[role="switch"]');
    await expect(visibleToggle).toBeVisible();

    // Verify it is functional by reading its state
    const state = await visibleToggle.getAttribute('data-state');
    expect(state === 'checked' || state === 'unchecked').toBe(true);
  });

  test('exhibitions list has visible toggle', async ({ page }) => {
    await page.goto('/admin/exhibitions');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();

    const visibleToggle = firstRow.locator('label', { hasText: 'Visible' }).locator('button[role="switch"]');
    await expect(visibleToggle).toBeVisible();

    const state = await visibleToggle.getAttribute('data-state');
    expect(state === 'checked' || state === 'unchecked').toBe(true);
  });
});
