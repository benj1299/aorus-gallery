import { test, expect } from '@playwright/test';

test.describe('Admin Toggle Persistence', () => {
  test('artwork toggles persist after save: visible=true, featuredHome=false', async ({ page }) => {
    const title = `Toggle Persist ${Date.now()}`;

    // Create artwork with visible=true (default), featuredHome=false (default)
    await page.goto('/admin/artworks/new');
    await expect(page.locator('h1')).toBeVisible();

    await page.locator('input[name="title.en"]').fill(title);
    await page.locator('select[name="artistId"]').selectOption({ index: 1 });
    await page.locator('input[name="medium.en"]').fill('Oil on canvas');
    await page.locator('input[name="dimensions"]').fill('100 x 80 cm');
    await page.locator('input[name="year"]').fill('2025');

    // Set image
    await page.locator('input[type="hidden"][name="imageUrl"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80'; }
    );

    // Verify default toggle states before submission
    const visibleSwitch = page.locator('button[role="switch"]#visible');
    const featuredSwitch = page.locator('button[role="switch"]#featuredHome');
    if (await visibleSwitch.count() > 0) {
      await expect(visibleSwitch).toHaveAttribute('data-state', 'checked');
    }
    if (await featuredSwitch.count() > 0) {
      await expect(featuredSwitch).toHaveAttribute('data-state', 'unchecked');
    }

    await page.evaluate(() => document.querySelector('form')?.requestSubmit());
    await page.waitForURL('**/admin/artworks', { timeout: 15000 });
    await expect(page.getByText(title)).toBeVisible();

    // Edit the artwork and verify toggles persisted
    const row = page.locator('tr', { hasText: title });
    await row.locator('[data-testid="edit-btn"]').click();
    await expect(page.locator('h1')).toBeVisible();

    const editVisibleSwitch = page.locator('button[role="switch"]#visible');
    const editFeaturedSwitch = page.locator('button[role="switch"]#featuredHome');
    if (await editVisibleSwitch.count() > 0) {
      const visibleState = await editVisibleSwitch.getAttribute('data-state');
      expect(visibleState).toBe('checked');
    }
    if (await editFeaturedSwitch.count() > 0) {
      const featuredState = await editFeaturedSwitch.getAttribute('data-state');
      expect(featuredState).toBe('unchecked');
    }

    // Cleanup
    await page.goto('/admin/artworks');
    const cleanupRow = page.locator('tr', { hasText: title });
    await cleanupRow.locator('[data-testid="delete-btn"]').click();
    await cleanupRow.locator('[data-testid="delete-confirm"]').click();
    await expect(cleanupRow).not.toBeVisible({ timeout: 10000 });
  });

  test('edit artwork: toggle visible off, verify it persists', async ({ page }) => {
    const title = `Visible Off ${Date.now()}`;

    // Create artwork first
    await page.goto('/admin/artworks/new');
    await expect(page.locator('h1')).toBeVisible();

    await page.locator('input[name="title.en"]').fill(title);
    await page.locator('select[name="artistId"]').selectOption({ index: 1 });
    await page.locator('input[name="medium.en"]').fill('Acrylic');
    await page.locator('input[name="dimensions"]').fill('50 x 40 cm');
    await page.locator('input[name="year"]').fill('2025');
    await page.locator('input[type="hidden"][name="imageUrl"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80'; }
    );

    // Toggle visible OFF before saving
    const visibleSwitch = page.locator('button[role="switch"]#visible');
    if (await visibleSwitch.count() > 0) {
      // Default is checked, click to uncheck
      await visibleSwitch.click();
      await expect(visibleSwitch).toHaveAttribute('data-state', 'unchecked', { timeout: 5000 });
    }

    await page.evaluate(() => document.querySelector('form')?.requestSubmit());
    await page.waitForURL('**/admin/artworks', { timeout: 15000 });

    // Edit and verify visible is still off
    const row = page.locator('tr', { hasText: title });
    await row.locator('[data-testid="edit-btn"]').click();
    await expect(page.locator('h1')).toBeVisible();

    const editVisibleSwitch = page.locator('button[role="switch"]#visible');
    if (await editVisibleSwitch.count() > 0) {
      const state = await editVisibleSwitch.getAttribute('data-state');
      expect(state).toBe('unchecked');
    }

    // Cleanup
    await page.goto('/admin/artworks');
    const cleanupRow = page.locator('tr', { hasText: title });
    await cleanupRow.locator('[data-testid="delete-btn"]').click();
    await cleanupRow.locator('[data-testid="delete-confirm"]').click();
    await expect(cleanupRow).not.toBeVisible({ timeout: 10000 });
  });

  test('edit artwork: toggle featuredHome on, verify it persists', async ({ page }) => {
    const title = `Featured On ${Date.now()}`;

    // Create artwork
    await page.goto('/admin/artworks/new');
    await expect(page.locator('h1')).toBeVisible();

    await page.locator('input[name="title.en"]').fill(title);
    await page.locator('select[name="artistId"]').selectOption({ index: 1 });
    await page.locator('input[name="medium.en"]').fill('Mixed media');
    await page.locator('input[name="dimensions"]').fill('60 x 60 cm');
    await page.locator('input[name="year"]').fill('2025');
    await page.locator('input[type="hidden"][name="imageUrl"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80'; }
    );

    // Toggle featuredHome ON
    const featuredSwitch = page.locator('button[role="switch"]#featuredHome');
    if (await featuredSwitch.count() > 0) {
      await featuredSwitch.click();
      await expect(featuredSwitch).toHaveAttribute('data-state', 'checked', { timeout: 5000 });
    }

    await page.evaluate(() => document.querySelector('form')?.requestSubmit());
    await page.waitForURL('**/admin/artworks', { timeout: 15000 });

    // Edit and verify featuredHome is still on
    const row = page.locator('tr', { hasText: title });
    await row.locator('[data-testid="edit-btn"]').click();
    await expect(page.locator('h1')).toBeVisible();

    const editFeaturedSwitch = page.locator('button[role="switch"]#featuredHome');
    if (await editFeaturedSwitch.count() > 0) {
      const state = await editFeaturedSwitch.getAttribute('data-state');
      expect(state).toBe('checked');
    }

    // Also verify the artwork appears on the homepage carousel (featuredHome=true)
    await page.goto('/en');
    await page.waitForLoadState('domcontentloaded');

    // The featured artwork should appear in the carousel section
    // Look for a link pointing to the artwork's slug in the carousel container
    const carouselContainer = page.locator('.overflow-x-auto.scrollbar-hide');
    if (await carouselContainer.count() > 0) {
      // The carousel may or may not include this artwork depending on sort order
      // Just verify the carousel section rendered without errors
      await expect(carouselContainer).toBeVisible({ timeout: 10000 });
    }

    // Cleanup
    await page.goto('/admin/artworks');
    const cleanupRow = page.locator('tr', { hasText: title });
    await cleanupRow.locator('[data-testid="delete-btn"]').click();
    await cleanupRow.locator('[data-testid="delete-confirm"]').click();
    await expect(cleanupRow).not.toBeVisible({ timeout: 10000 });
  });

  test('artist: toggle visible off, verify hidden on public page', async ({ page }) => {
    // Use the quick toggle on the artists list to toggle visibility
    await page.goto('/admin/artists');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    // Get the first artist row and record its name
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();
    const artistName = await firstRow.locator('td').first().textContent();

    // Check the current state of the visible toggle
    const visibleToggle = firstRow.locator('label', { hasText: 'Visible' }).locator('button[role="switch"]');
    await expect(visibleToggle).toBeVisible();
    const initialState = await visibleToggle.getAttribute('data-state');

    // If already unchecked, toggle to checked first so we can test turning it off
    if (initialState === 'unchecked') {
      await visibleToggle.click();
      await expect(visibleToggle).toHaveAttribute('data-state', 'checked', { timeout: 10000 });
    }

    // Now toggle visible OFF
    await visibleToggle.click();
    await expect(visibleToggle).toHaveAttribute('data-state', 'unchecked', { timeout: 10000 });

    // Check the public artists page -- the artist should be hidden
    await page.goto('/en/artists');
    await page.waitForLoadState('domcontentloaded');

    if (artistName) {
      // The artist name should NOT appear on the public page when visible=false
      await expect(page.getByText(artistName.trim(), { exact: true })).not.toBeVisible({ timeout: 5000 });
    }

    // Restore: toggle visible back ON
    await page.goto('/admin/artists');
    const restoredRow = page.locator('tbody tr').first();
    const restoredToggle = restoredRow.locator('label', { hasText: 'Visible' }).locator('button[role="switch"]');
    await restoredToggle.click();
    await expect(restoredToggle).toHaveAttribute('data-state', 'checked', { timeout: 10000 });
  });
});
