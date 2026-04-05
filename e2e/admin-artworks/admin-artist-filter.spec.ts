import { test, expect } from '@playwright/test';

test.describe('Admin Artist Filter', () => {
  test('filter dropdown is visible on artworks page', async ({ page }) => {
    await page.goto('/admin/artworks');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    const filterSelect = page.locator('select');
    await expect(filterSelect).toBeVisible();
    // Should have "Tous les artistes" as default option
    await expect(filterSelect.locator('option').first()).toContainText('Tous les artistes');
  });

  test('"Tous les artistes" shows all artworks', async ({ page }) => {
    await page.goto('/admin/artworks');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    // Ensure the filter is set to "Tous les artistes" (default)
    const filterSelect = page.locator('select');
    await filterSelect.selectOption({ value: '' });
    await page.waitForTimeout(500);

    // Count all visible rows
    const allRows = page.locator('tbody tr');
    const allCount = await allRows.count();
    expect(allCount).toBeGreaterThanOrEqual(1);
  });

  test('selecting a specific artist filters the list', async ({ page }) => {
    await page.goto('/admin/artworks');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    // Count all rows first (with "Tous les artistes")
    const allRowsBefore = page.locator('tbody tr');
    const totalCount = await allRowsBefore.count();

    // Get the artist options (skip first "Tous les artistes" option)
    const filterSelect = page.locator('select');
    const options = filterSelect.locator('option');
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThan(1); // At least one artist option

    // Select the second option (first real artist)
    const artistOption = options.nth(1);
    const artistValue = await artistOption.getAttribute('value');
    const artistName = await artistOption.textContent();
    expect(artistValue).toBeTruthy();

    await filterSelect.selectOption({ value: artistValue! });
    await page.waitForTimeout(500);

    // Filtered rows should be less than or equal to total
    const filteredRows = page.locator('tbody tr');
    const filteredCount = await filteredRows.count();
    expect(filteredCount).toBeLessThanOrEqual(totalCount);
    expect(filteredCount).toBeGreaterThanOrEqual(1);

    // All visible rows should contain the selected artist name
    for (let i = 0; i < filteredCount; i++) {
      const row = filteredRows.nth(i);
      await expect(row).toContainText(artistName!.trim());
    }
  });

  test('clearing filter (back to "Tous") shows all again', async ({ page }) => {
    await page.goto('/admin/artworks');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    // Count initial rows
    const allRowsBefore = page.locator('tbody tr');
    const totalCount = await allRowsBefore.count();

    // Apply an artist filter
    const filterSelect = page.locator('select');
    const options = filterSelect.locator('option');
    const artistOption = options.nth(1);
    const artistValue = await artistOption.getAttribute('value');
    await filterSelect.selectOption({ value: artistValue! });
    await page.waitForTimeout(500);

    // Verify filtered (may be fewer)
    const filteredCount = await page.locator('tbody tr').count();
    expect(filteredCount).toBeLessThanOrEqual(totalCount);

    // Clear filter
    await filterSelect.selectOption({ value: '' });
    await page.waitForTimeout(500);

    // Should be back to original count
    const restoredCount = await page.locator('tbody tr').count();
    expect(restoredCount).toBe(totalCount);
  });
});
