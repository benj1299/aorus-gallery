/**
 * Admin Bug Discovery — explores every admin flow and asserts NO console errors
 * and NO 4xx/5xx responses. Tests are EXPECTED to fail where bugs exist; each
 * failure is the documented broken contract.
 *
 * Reuses e2e/.auth/admin.json via the chromium project (see playwright.config.ts).
 *
 * Conventions:
 *   - Each test attaches console + response listeners up-front and asserts the
 *     captured arrays are empty at the end.
 *   - Created entities use a unique `bug-test-<timestamp>-<flow>` slug so this
 *     spec is idempotent and easy to clean up later.
 *   - We ignore well-known noisy console messages (favicon 404, devtools warnings,
 *     React DevTools install nudge) but capture EVERYTHING else.
 */

import { test, expect, type Page, type ConsoleMessage, type Response } from '@playwright/test';

interface ErrorCapture {
  consoleErrors: string[];
  pageErrors: string[];
  failedResponses: { url: string; status: number; method: string }[];
}

const TIMESTAMP = Date.now();

// Patterns we consider noise (third-party warnings, devtools nudges, etc.).
const CONSOLE_IGNORE = [
  /Download the React DevTools/i,
  /\[next-router-not-mounted\]/i,
  /next\/font/i,
  /favicon\.ico/i,
];

const RESPONSE_IGNORE = [
  /\/favicon\.ico/,
  /\/_next\/data\//, // RSC payload requests for prefetch can intermittently 404
  /chrome-extension:/,
  // 404 on missing optimised images is a content issue, not an admin bug
];

function attachErrorListeners(page: Page): ErrorCapture {
  const capture: ErrorCapture = { consoleErrors: [], pageErrors: [], failedResponses: [] };

  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() !== 'error' && msg.type() !== 'warning') return;
    if (msg.type() === 'warning') return; // Only fail on errors; warnings are noise
    const text = msg.text();
    if (CONSOLE_IGNORE.some((re) => re.test(text))) return;
    capture.consoleErrors.push(`[${msg.type()}] ${text}`);
  });

  page.on('pageerror', (err) => {
    capture.pageErrors.push(`${err.name}: ${err.message}`);
  });

  page.on('response', (resp: Response) => {
    const status = resp.status();
    if (status < 400) return;
    const url = resp.url();
    if (RESPONSE_IGNORE.some((re) => re.test(url))) return;
    // 304 etc are not errors; only 4xx/5xx
    if (status >= 400) {
      capture.failedResponses.push({ url, status, method: resp.request().method() });
    }
  });

  return capture;
}

function assertNoErrors(capture: ErrorCapture, context: string) {
  const summary: string[] = [];
  if (capture.pageErrors.length) {
    summary.push(`Page errors:\n  ${capture.pageErrors.join('\n  ')}`);
  }
  if (capture.consoleErrors.length) {
    summary.push(`Console errors:\n  ${capture.consoleErrors.join('\n  ')}`);
  }
  if (capture.failedResponses.length) {
    summary.push(
      `Failed responses:\n  ${capture.failedResponses
        .map((r) => `${r.method} ${r.status} ${r.url}`)
        .join('\n  ')}`
    );
  }
  expect(summary, `${context}\n${summary.join('\n')}`).toEqual([]);
}

// =============================================================================
// DASHBOARD
// =============================================================================
test.describe('admin dashboard', () => {
  test('GET /admin renders and is error-free', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: /Tableau de bord/i })).toBeVisible();
    await page.waitForLoadState('networkidle');
    assertNoErrors(capture, 'Dashboard load');
  });
});

// =============================================================================
// ARTISTS — list, new, edit, view, toggle, delete
// =============================================================================
test.describe('admin artists', () => {
  test('list /admin/artists is error-free', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin/artists');
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
    assertNoErrors(capture, 'Artists list');
  });

  test('GET /admin/artists/new renders the form error-free', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin/artists/new');
    await expect(page.getByRole('heading', { name: /Nouvel artiste/i })).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await page.waitForLoadState('networkidle');
    assertNoErrors(capture, 'Artist new form');
  });

  test('CRUD: create -> edit -> toggle -> delete artist (no errors at each step)', async ({ page }) => {
    const capture = attachErrorListeners(page);
    const name = `BugTest Artist ${TIMESTAMP}`;
    const renamed = `${name} Renamed`;

    // CREATE
    await page.goto('/admin/artists/new');
    await page.locator('input[name="name"]').fill(name);
    // Only EN is required (TranslatableInput tabs default to EN, server-side
    // validation only requires `loc === 'en'`). Filling EN alone is enough
    // for a smoke-test CRUD round-trip.
    await page.locator('input[name="nationality.en"]').fill('French');
    await page
      .locator('input[type="hidden"][name="imageUrl"]')
      .evaluate((el: HTMLInputElement) => {
        el.value = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80';
      });
    await page.evaluate(() => document.querySelector('form')?.requestSubmit());
    await page.waitForURL('**/admin/artists**', { timeout: 20000 });
    await expect(page.getByText(name).first()).toBeVisible();

    // TOGGLE visibility from list
    const row = page.locator('tr', { hasText: name });
    await row.locator('[data-testid="toggle-visible"]').click();
    await page.waitForLoadState('networkidle');

    // EDIT (rename)
    await row.locator('[data-testid="edit-btn"]').click();
    await expect(page.locator('input[name="name"]')).toHaveValue(name);
    await page.locator('input[name="name"]').fill(renamed);
    await page.evaluate(() => document.querySelector('form')?.requestSubmit());
    await page.waitForURL('**/admin/artists**', { timeout: 20000 });
    await expect(page.getByText(renamed).first()).toBeVisible();

    // DELETE (cleanup)
    const renamedRow = page.locator('tr', { hasText: renamed });
    await renamedRow.locator('[data-testid="delete-btn"]').click();
    await renamedRow.locator('[data-testid="delete-confirm"]').click();
    await expect(renamedRow).not.toBeVisible({ timeout: 10000 });

    assertNoErrors(capture, 'Artist CRUD');
  });

  test('GET /admin/artists/[id]/view is error-free for the first artist', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin/artists');
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();
    const firstViewBtn = firstRow.locator('[data-testid="view-btn"]');
    // The view-btn is a target=_blank link to the public page; we want the admin
    // view route. Detect via row data; fall back to clicking edit then back.
    await firstRow.locator('[data-testid="edit-btn"]').click();
    const url = page.url();
    const idMatch = url.match(/\/admin\/artists\/([^/?#]+)/);
    expect(idMatch, 'should extract artist id from edit URL').not.toBeNull();
    const artistId = idMatch![1];
    await page.goto(`/admin/artists/${artistId}/view`);
    await page.waitForLoadState('networkidle');
    assertNoErrors(capture, 'Artist view detail');
  });
});

// =============================================================================
// ARTWORKS — list, new, edit, view, toggles (visible/sold/featured), delete
// =============================================================================
test.describe('admin artworks', () => {
  test('list /admin/artworks is error-free', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin/artworks');
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
    assertNoErrors(capture, 'Artworks list');
  });

  test('GET /admin/artworks/new renders error-free', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin/artworks/new');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[name="title.en"]')).toBeVisible();
    await page.waitForLoadState('networkidle');
    assertNoErrors(capture, 'Artwork new form');
  });

  test('toggle artwork visible/sold from list does not log errors', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin/artworks');
    const row = page.locator('tbody tr').first();
    await expect(row).toBeVisible();

    const visibleToggle = row.locator('[data-testid="toggle-visible"]');
    if (await visibleToggle.count()) {
      await visibleToggle.click();
      await page.waitForLoadState('networkidle');
      // Toggle back so we leave state unchanged
      await visibleToggle.click();
      await page.waitForLoadState('networkidle');
    }

    const soldToggle = row.locator('[data-testid="toggle-sold"]');
    if (await soldToggle.count()) {
      await soldToggle.click();
      await page.waitForLoadState('networkidle');
      await soldToggle.click();
      await page.waitForLoadState('networkidle');
    }

    assertNoErrors(capture, 'Artwork toggle list');
  });

  test('GET first artwork view detail is error-free', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin/artworks');
    const firstRow = page.locator('tbody tr').first();
    await firstRow.locator('[data-testid="edit-btn"]').click();
    const url = page.url();
    const idMatch = url.match(/\/admin\/artworks\/([^/?#]+)/);
    expect(idMatch).not.toBeNull();
    await page.goto(`/admin/artworks/${idMatch![1]}/view`);
    await page.waitForLoadState('networkidle');
    assertNoErrors(capture, 'Artwork view detail');
  });
});

// =============================================================================
// EXHIBITIONS — list, new, edit, view, delete
// =============================================================================
test.describe('admin exhibitions', () => {
  test('list /admin/exhibitions is error-free', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin/exhibitions');
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
    assertNoErrors(capture, 'Exhibitions list');
  });

  test('GET /admin/exhibitions/new renders error-free', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin/exhibitions/new');
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
    assertNoErrors(capture, 'Exhibition new form');
  });

  test('GET first exhibition view detail is error-free', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin/exhibitions');
    const rows = page.locator('tbody tr');
    if ((await rows.count()) === 0) {
      test.skip();
      return;
    }
    await rows.first().locator('[data-testid="edit-btn"]').click();
    const idMatch = page.url().match(/\/admin\/exhibitions\/([^/?#]+)/);
    expect(idMatch).not.toBeNull();
    await page.goto(`/admin/exhibitions/${idMatch![1]}/view`);
    await page.waitForLoadState('networkidle');
    assertNoErrors(capture, 'Exhibition view detail');
  });
});

// =============================================================================
// PRESS — list, new, edit, delete
// =============================================================================
test.describe('admin press', () => {
  test('list /admin/press is error-free', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin/press');
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
    assertNoErrors(capture, 'Press list');
  });

  test('GET /admin/press/new renders error-free', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin/press/new');
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
    assertNoErrors(capture, 'Press new form');
  });
});

// =============================================================================
// BANNER
// =============================================================================
test.describe('admin banner', () => {
  test('GET /admin/banner is error-free', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin/banner');
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
    assertNoErrors(capture, 'Banner page');
  });
});

// =============================================================================
// MESSAGES (read-only inbox)
// =============================================================================
test.describe('admin messages', () => {
  test('list /admin/messages is error-free', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin/messages');
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
    assertNoErrors(capture, 'Messages list');
  });

  test('first message detail is error-free', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin/messages');
    const rows = page.locator('tbody tr');
    if ((await rows.count()) === 0) {
      test.skip();
      return;
    }
    // The first <a> in a row is mailto: (P2-2 in bug report) — target the
    // explicit eye-icon view-btn instead. On the messages list this opens the
    // admin detail route, not the public site.
    const viewBtn = rows.first().locator('[data-testid="view-btn"]');
    await expect(viewBtn).toBeVisible();
    await viewBtn.click();
    await page.waitForURL(/\/admin\/messages\/[^/?#]+/);
    await page.waitForLoadState('networkidle');
    assertNoErrors(capture, 'Message detail');
  });
});

// =============================================================================
// SETTINGS
// =============================================================================
test.describe('admin settings', () => {
  test('GET /admin/settings is error-free', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin/settings');
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
    assertNoErrors(capture, 'Settings page');
  });
});

// =============================================================================
// PRINT — new artist inventory + exhibition print
// =============================================================================
test.describe('admin print routes', () => {
  test('artist inventory /admin/print/artist/[id] renders error-free', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin/artists');
    const firstRow = page.locator('tbody tr').first();
    await firstRow.locator('[data-testid="edit-btn"]').click();
    const idMatch = page.url().match(/\/admin\/artists\/([^/?#]+)/);
    expect(idMatch).not.toBeNull();
    await page.goto(`/admin/print/artist/${idMatch![1]}`);
    await expect(page.locator('h1')).toBeVisible();
    // Print button should be present (renders even when there are 0 artworks)
    await expect(page.locator('[data-testid="inventory-print-btn"]')).toBeVisible();
    await page.waitForLoadState('networkidle');
    assertNoErrors(capture, 'Artist inventory print');
  });

  test('exhibition print /admin/print/exhibition/[id] renders error-free', async ({ page }) => {
    const capture = attachErrorListeners(page);
    await page.goto('/admin/exhibitions');
    const rows = page.locator('tbody tr');
    if ((await rows.count()) === 0) {
      test.skip();
      return;
    }
    await rows.first().locator('[data-testid="edit-btn"]').click();
    const idMatch = page.url().match(/\/admin\/exhibitions\/([^/?#]+)/);
    expect(idMatch).not.toBeNull();
    await page.goto(`/admin/print/exhibition/${idMatch![1]}`);
    await page.waitForLoadState('networkidle');
    assertNoErrors(capture, 'Exhibition print');
  });
});

// =============================================================================
// FORM VALIDATION — empty submit on every "new" route
// =============================================================================
test.describe('admin form empty-submit', () => {
  for (const route of [
    '/admin/artists/new',
    '/admin/artworks/new',
    '/admin/exhibitions/new',
    '/admin/press/new',
  ]) {
    test(`empty submit at ${route} surfaces a validation error, not a crash`, async ({ page }) => {
      const capture = attachErrorListeners(page);
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
      await page.evaluate(() => document.querySelector('form')?.requestSubmit());
      // Either we stay on the page (validation error) or redirect with `error` param.
      // The thing we want to NOT see: a 500 server error or unhandled JS crash.
      await page.waitForLoadState('networkidle');
      assertNoErrors(capture, `Empty submit ${route}`);
    });
  }
});
