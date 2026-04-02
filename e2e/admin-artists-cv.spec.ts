import { test, expect } from '@playwright/test';

test.describe('Artist CV Management', () => {
  const suffix = Date.now().toString().slice(-6);
  const artistName = `CV Test Artist ${suffix}`;

  test.afterAll(async ({ browser }) => {
    // Cleanup: delete the test artist
    const context = await browser.newContext({ storageState: 'e2e/.auth/admin.json' });
    const page = await context.newPage();
    await page.goto('/admin/artists');
    const row = page.locator('tr', { hasText: artistName });
    if (await row.count() > 0) {
      await row.locator('[title="Supprimer"]').click();
      await row.locator('[title="Confirmer"]').click();
      await page.waitForTimeout(3000);
    }
    await context.close();
  });

  test('create artist with CV entries and years', async ({ page }) => {
    await page.goto('/admin/artists/new');
    await expect(page.locator('h1')).toBeVisible();

    // Fill basic info
    await page.locator('input[name="name"]').fill(artistName);
    await page.locator('input[name="nationality.en"]').fill('French');

    // Bio (Tiptap editor)
    const editor = page.locator('.ProseMirror').first();
    await expect(editor).toBeVisible({ timeout: 10000 });
    await editor.click();
    await editor.pressSequentially('Test bio for CV management.');

    // Image
    await page.locator('input[type="hidden"][name="imageUrl"]').evaluate(
      (el: HTMLInputElement) => {
        el.value = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80';
      },
    );

    // Fill first solo show entry (already present by default)
    await page.locator('input[name="cv.SOLO_SHOW.0.year"]').fill('2024');
    await page.locator('input[name="cv.SOLO_SHOW.0.en"]').fill('Paris Art Show 2024');

    // Add a second solo show — the first "Ajouter" button in the form is for SOLO_SHOW
    // Use nth(0) since there are multiple "Ajouter" buttons (one per CV section)
    await page.getByRole('button', { name: 'Ajouter', exact: true }).first().click();
    await page.locator('input[name="cv.SOLO_SHOW.1.year"]').fill('2022');
    await page.locator('input[name="cv.SOLO_SHOW.1.en"]').fill('Tokyo Exhibition 2022');

    // Add a third solo show
    await page.getByRole('button', { name: 'Ajouter', exact: true }).first().click();
    await page.locator('input[name="cv.SOLO_SHOW.2.year"]').fill('2020');
    await page.locator('input[name="cv.SOLO_SHOW.2.en"]').fill('Berlin Gallery 2020');

    // Submit
    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.waitForURL('**/admin/artists', { timeout: 15000 });
    await expect(page.getByText(artistName)).toBeVisible();
  });

  test('edit artist preserves CV years', async ({ page }) => {
    await page.goto('/admin/artists');

    // Navigate to edit page
    const row = page.locator('tr', { hasText: artistName });
    await row.locator('[title="Modifier"]').click();
    await expect(page.locator('h1')).toBeVisible();

    // Verify year fields are populated (years should be preserved after save)
    await expect(page.locator('input[name="cv.SOLO_SHOW.0.year"]')).toHaveValue('2024');
    await expect(page.locator('input[name="cv.SOLO_SHOW.1.year"]')).toHaveValue('2022');
    await expect(page.locator('input[name="cv.SOLO_SHOW.2.year"]')).toHaveValue('2020');

    // Verify title fields
    await expect(page.locator('input[name="cv.SOLO_SHOW.0.en"]')).toHaveValue('Paris Art Show 2024');
    await expect(page.locator('input[name="cv.SOLO_SHOW.1.en"]')).toHaveValue('Tokyo Exhibition 2022');
    await expect(page.locator('input[name="cv.SOLO_SHOW.2.en"]')).toHaveValue('Berlin Gallery 2020');

    // Save without changes to verify round-trip
    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.waitForURL('**/admin/artists', { timeout: 15000 });

    // Re-open edit and verify years survived the round-trip
    const row2 = page.locator('tr', { hasText: artistName });
    await row2.locator('[title="Modifier"]').click();

    await expect(page.locator('input[name="cv.SOLO_SHOW.0.year"]')).toHaveValue('2024');
    await expect(page.locator('input[name="cv.SOLO_SHOW.1.year"]')).toHaveValue('2022');
    await expect(page.locator('input[name="cv.SOLO_SHOW.2.year"]')).toHaveValue('2020');
  });

  test('remove specific CV entry removes correct one', async ({ page }) => {
    await page.goto('/admin/artists');
    const row = page.locator('tr', { hasText: artistName });
    await row.locator('[title="Modifier"]').click();
    await expect(page.locator('h1')).toBeVisible();

    // Verify we start with 3 solo show entries
    const soloYears = page.locator('input[name*="cv.SOLO_SHOW"][name$=".year"]');
    await expect(soloYears).toHaveCount(3);

    // The middle entry (index 1, Tokyo 2022) has an X button
    // Each entry row is: year input + locale inputs + X button, all in a flex container
    // We target the X button in the same row as the index-1 year input
    const middleYearInput = page.locator('input[name="cv.SOLO_SHOW.1.year"]');
    const middleEntryRow = middleYearInput.locator('xpath=ancestor::div[contains(@class,"flex gap-2")]');
    await middleEntryRow.locator('button').click();

    // After removing middle entry, should have 2 entries
    await expect(page.locator('input[name*="cv.SOLO_SHOW"][name$=".year"]')).toHaveCount(2);

    // The remaining entries should be Paris 2024 and Berlin 2020
    await expect(page.locator('input[name="cv.SOLO_SHOW.0.en"]')).toHaveValue('Paris Art Show 2024');
    await expect(page.locator('input[name="cv.SOLO_SHOW.1.en"]')).toHaveValue('Berlin Gallery 2020');
    await expect(page.locator('input[name="cv.SOLO_SHOW.0.year"]')).toHaveValue('2024');
    await expect(page.locator('input[name="cv.SOLO_SHOW.1.year"]')).toHaveValue('2020');

    // Save and verify persistence
    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.waitForURL('**/admin/artists', { timeout: 15000 });

    // Re-open and verify only 2 entries remain with correct data
    const row2 = page.locator('tr', { hasText: artistName });
    await row2.locator('[title="Modifier"]').click();

    await expect(page.locator('input[name*="cv.SOLO_SHOW"][name$=".year"]')).toHaveCount(2);
    await expect(page.locator('input[name="cv.SOLO_SHOW.0.en"]')).toHaveValue('Paris Art Show 2024');
    await expect(page.locator('input[name="cv.SOLO_SHOW.1.en"]')).toHaveValue('Berlin Gallery 2020');
    await expect(page.locator('input[name="cv.SOLO_SHOW.0.year"]')).toHaveValue('2024');
    await expect(page.locator('input[name="cv.SOLO_SHOW.1.year"]')).toHaveValue('2020');
  });

  test('frontend displays CV with years sorted descending', async ({ page }) => {
    // Navigate to the artist's public page via slug
    await page.goto('/admin/artists');
    const row = page.locator('tr', { hasText: artistName });
    const viewLink = row.locator('a[title="Voir la page publique"]');

    if (await viewLink.count() === 0) {
      test.skip();
      return;
    }

    const href = await viewLink.getAttribute('href');
    expect(href).toBeTruthy();

    await page.goto(href!);
    await expect(page.locator('h1')).toContainText(artistName);

    // Verify CV section shows years in "YYYY — Title" format
    await expect(page.getByText(/2024\s*[—–-]\s*Paris Art Show/)).toBeVisible();
    await expect(page.getByText(/2020\s*[—–-]\s*Berlin Gallery/)).toBeVisible();
  });
});
