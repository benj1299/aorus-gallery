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

    // Click to toggle — wait for data-state to change
    const expectedState = initialState === 'checked' ? 'unchecked' : 'checked';
    await visibleToggle.click();
    await expect(visibleToggle).toHaveAttribute('data-state', expectedState, { timeout: 10000 });

    // Toggle back to restore original state
    await visibleToggle.click();
    await expect(visibleToggle).toHaveAttribute('data-state', initialState!, { timeout: 10000 });
  });

  test('toggle featured switch works', async ({ page }) => {
    await page.goto('/admin/artworks');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();

    const featuredToggle = firstRow.locator('label', { hasText: 'En avant' }).locator('button[role="switch"]');
    await expect(featuredToggle).toBeVisible();

    const initialState = await featuredToggle.getAttribute('data-state');
    const expectedState = initialState === 'checked' ? 'unchecked' : 'checked';
    await featuredToggle.click();
    await expect(featuredToggle).toHaveAttribute('data-state', expectedState, { timeout: 10000 });

    // Restore
    await featuredToggle.click();
    await expect(featuredToggle).toHaveAttribute('data-state', initialState!, { timeout: 10000 });
  });

  test('toggle sold switch works', async ({ page }) => {
    await page.goto('/admin/artworks');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();

    const soldToggle = firstRow.locator('label', { hasText: 'Vendu' }).locator('button[role="switch"]');
    await expect(soldToggle).toBeVisible();

    const initialState = await soldToggle.getAttribute('data-state');
    const expectedState = initialState === 'checked' ? 'unchecked' : 'checked';
    await soldToggle.click();
    await expect(soldToggle).toHaveAttribute('data-state', expectedState, { timeout: 10000 });

    // Restore
    await soldToggle.click();
    await expect(soldToggle).toHaveAttribute('data-state', initialState!, { timeout: 10000 });
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
    const expectedToggled = originalState === 'checked' ? 'unchecked' : 'checked';
    await visibleToggle.click();
    await expect(visibleToggle).toHaveAttribute('data-state', expectedToggled, { timeout: 10000 });

    // Toggle back
    await visibleToggle.click();
    await expect(visibleToggle).toHaveAttribute('data-state', originalState!, { timeout: 10000 });
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
