import { test, expect, type Page } from '@playwright/test';

const ARTIST_NAME = 'CV Test Artist E2E';

/** Delete all artists matching the test name */
async function cleanupTestArtist(page: Page) {
  await page.goto('/admin/artists');
  await page.locator('input[placeholder*="Rechercher"]').fill(ARTIST_NAME);
  await page.waitForTimeout(500);
  // Delete all matching rows
  let row = page.locator('tr', { hasText: ARTIST_NAME });
  while (await row.count() > 0) {
    await row.first().locator('[title="Supprimer"]').click();
    await row.first().locator('[title="Confirmer"]').click();
    await page.waitForTimeout(2000);
    await page.reload();
    await page.locator('input[placeholder*="Rechercher"]').fill(ARTIST_NAME);
    await page.waitForTimeout(500);
    row = page.locator('tr', { hasText: ARTIST_NAME });
  }
}

test.describe('Artist CV Management', () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: 'e2e/.auth/admin.json' });
    const page = await context.newPage();
    await cleanupTestArtist(page);
    await context.close();
  });

  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: 'e2e/.auth/admin.json' });
    const page = await context.newPage();
    await cleanupTestArtist(page);
    await context.close();
  });

  test('create artist with CV entries, verify year round-trip, and delete specific entry', async ({ page }) => {
    // === STEP 1: Create artist with 3 solo show entries ===
    await page.goto('/admin/artists/new');
    await expect(page.locator('h1')).toBeVisible();

    await page.locator('input[name="name"]').fill(ARTIST_NAME);
    await page.locator('input[name="nationality.en"]').fill('French');

    const editor = page.locator('.ProseMirror').first();
    await expect(editor).toBeVisible({ timeout: 10000 });
    await editor.click();
    await editor.pressSequentially('Test bio for CV management.');

    await page.getByRole('button', { name: 'URL' }).click();
    await page.locator('input[type="url"]').fill('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80');

    await page.locator('input[name="cv.SOLO_SHOW.0.year"]').fill('2024');
    await page.locator('input[name="cv.SOLO_SHOW.0.en"]').fill('Paris Art Show 2024');

    await page.getByRole('button', { name: 'Ajouter', exact: true }).first().click();
    await page.locator('input[name="cv.SOLO_SHOW.1.year"]').fill('2022');
    await page.locator('input[name="cv.SOLO_SHOW.1.en"]').fill('Tokyo Exhibition 2022');

    await page.getByRole('button', { name: 'Ajouter', exact: true }).first().click();
    await page.locator('input[name="cv.SOLO_SHOW.2.year"]').fill('2020');
    await page.locator('input[name="cv.SOLO_SHOW.2.en"]').fill('Berlin Gallery 2020');

    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.waitForURL('**/admin/artists', { timeout: 15000 });
    await page.locator('input[placeholder*="Rechercher"]').fill(ARTIST_NAME);
    await expect(page.getByText(ARTIST_NAME)).toBeVisible();

    // === STEP 2: Open edit, verify years are loaded from DB ===
    const row = page.locator('tr', { hasText: ARTIST_NAME });
    await row.locator('[title="Modifier"]').click();
    await expect(page.locator('h1')).toBeVisible();

    await expect(page.locator('input[name="cv.SOLO_SHOW.0.year"]')).toHaveValue('2024');
    await expect(page.locator('input[name="cv.SOLO_SHOW.1.year"]')).toHaveValue('2022');
    await expect(page.locator('input[name="cv.SOLO_SHOW.2.year"]')).toHaveValue('2020');

    // === STEP 3: Save (round-trip) and verify years survive ===
    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.waitForURL('**/admin/artists', { timeout: 15000 });

    await page.locator('input[placeholder*="Rechercher"]').fill(ARTIST_NAME);
    const row2 = page.locator('tr', { hasText: ARTIST_NAME });
    await expect(row2).toBeVisible();
    await row2.locator('[title="Modifier"]').click();

    // Years must survive the round-trip (this was the bug: updateArtist was dropping year)
    await expect(page.locator('input[name="cv.SOLO_SHOW.0.year"]')).toHaveValue('2024');
    await expect(page.locator('input[name="cv.SOLO_SHOW.1.year"]')).toHaveValue('2022');
    await expect(page.locator('input[name="cv.SOLO_SHOW.2.year"]')).toHaveValue('2020');

    // === STEP 4: Remove middle entry (Tokyo 2022) ===
    await expect(page.locator('input[name*="cv.SOLO_SHOW"][name$=".year"]')).toHaveCount(3);

    // Navigate from the year input up to its entry row, then find the X button
    await page.locator('input[name="cv.SOLO_SHOW.1.year"]').locator('xpath=../../button').click();

    await expect(page.locator('input[name*="cv.SOLO_SHOW"][name$=".year"]')).toHaveCount(2);
    await expect(page.locator('input[name="cv.SOLO_SHOW.0.en"]')).toHaveValue('Paris Art Show 2024');
    await expect(page.locator('input[name="cv.SOLO_SHOW.1.en"]')).toHaveValue('Berlin Gallery 2020');

    // Save and verify deletion persisted
    await page.locator('form').evaluate((form: HTMLFormElement) => form.requestSubmit());
    await page.waitForURL('**/admin/artists', { timeout: 15000 });

    await page.locator('input[placeholder*="Rechercher"]').fill(ARTIST_NAME);
    const row3 = page.locator('tr', { hasText: ARTIST_NAME });
    await expect(row3).toBeVisible();
    await row3.locator('[title="Modifier"]').click();

    await expect(page.locator('input[name*="cv.SOLO_SHOW"][name$=".year"]')).toHaveCount(2);
    await expect(page.locator('input[name="cv.SOLO_SHOW.0.en"]')).toHaveValue('Paris Art Show 2024');
    await expect(page.locator('input[name="cv.SOLO_SHOW.1.en"]')).toHaveValue('Berlin Gallery 2020');
  });

  test('frontend displays CV with years sorted descending', async ({ page }) => {
    await page.goto('/admin/artists');
    await page.locator('input[placeholder*="Rechercher"]').fill(ARTIST_NAME);
    await page.waitForTimeout(500);
    const row = page.locator('tr', { hasText: ARTIST_NAME });

    if (await row.count() === 0) {
      test.skip();
      return;
    }

    const viewLink = row.locator('a[title="Voir la page publique"]');
    if (await viewLink.count() === 0) {
      test.skip();
      return;
    }

    const href = await viewLink.getAttribute('href');
    expect(href).toBeTruthy();

    await page.goto(href!);
    await expect(page.locator('h1')).toContainText(ARTIST_NAME);

    await expect(page.getByText(/2024\s*[—–-]\s*Paris Art Show/)).toBeVisible();
    await expect(page.getByText(/2020\s*[—–-]\s*Berlin Gallery/)).toBeVisible();
  });
});
