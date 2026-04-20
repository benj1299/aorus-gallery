import { test, expect, Page, Route } from '@playwright/test';

/**
 * E2E coverage for the admin ImageEditor (components/admin/image-editor.tsx)
 * wrapped by ImageUpload (components/admin/image-upload.tsx) — focused on
 * the two fixes shipped in commit ad87e24:
 *
 *   1. Dark theme contrast (bg-gray-950 dialog, white-ish text, white Apply).
 *   2. Apply persists crop/rotation via /api/image-proxy (R2 CORS proxy),
 *      no longer silently refetches the original bytes.
 *
 * Admin session is seeded by e2e/auth.setup.ts via storageState
 * (e2e/.auth/admin.json). The banner admin page is the one flow in the app
 * that currently surfaces the ImageUpload + editor end-to-end, so these
 * tests exercise /admin/banner.
 *
 * Client i18n locale is FR (NextIntlClientProvider in admin layout), so all
 * visible labels checked below use the French strings from messages/fr.json.
 *
 * Side-effects: tests may mutate the banner row. afterEach restores a known
 * test image so prod data isn't left in a garbage state. If no banner is
 * configured at all, persistence-style tests skip with a clear message.
 */

// Known-good image served by an allowed host (whitelisted in image-proxy).
// Uses Unsplash rather than R2 because the R2 test bucket may not have a
// permanent test key — what we verify is "remote URL gets proxied", which
// holds for any whitelisted remote host (Unsplash + R2 both pass through
// /api/image-proxy via the openEditorWithCurrent logic).
const KNOWN_R2_IMAGE =
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80';
// A small 1x1 transparent PNG as a data URI — used to test the no-proxy path.
const TINY_DATA_URI =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
// Fallback Unsplash URL (also whitelisted). Used when no banner exists yet,
// so we can set one via the hidden input and still exercise the proxy path.
const FALLBACK_UNSPLASH =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80';

// Timeouts — generous because the proxy round-trip can be slow on cold start.
const DIALOG_TIMEOUT = 15_000;
const APPLY_TIMEOUT = 20_000;

/** Read the current imageUrl from the banner form's hidden input. */
async function readImageUrl(page: Page): Promise<string> {
  return page
    .locator('input[type="hidden"][name="imageUrl"]')
    .inputValue();
}

/**
 * Set the imageUrl via the React URL-tab input, so the component's state
 * (currentUrl + hidden input + React re-renders) stays coherent. A raw DOM
 * value set bypasses React's controlled state and the hidden input snaps
 * back on the next render.
 */
async function writeImageUrl(page: Page, url: string): Promise<void> {
  const preview = page.locator('[data-testid="image-upload-preview"]');
  if ((await preview.count()) > 0) {
    await page.getByRole('button', { name: /Retirer/i }).first().click();
    await expect(preview).toHaveCount(0, { timeout: 5_000 });
  }
  // Click the URL tab (the component starts on 'upload' tab when currentUrl empty)
  await page.getByRole('button', { name: /^URL$/i }).first().click();
  const urlInput = page.locator('input[type="url"]').first();
  await expect(urlInput).toBeVisible({ timeout: 5_000 });
  await urlInput.fill(url);
  // After fill, the React onChange sets currentUrl; hidden input reflects it.
  await expect(
    page.locator('input[type="hidden"][name="imageUrl"]'),
  ).toHaveValue(url, { timeout: 5_000 });
}

/** Click the pencil "Recadrer ou faire pivoter" link under the preview. */
async function openEditor(page: Page): Promise<void> {
  // The link text comes from messages/fr.json → admin.upload.editImage.
  // Match by role=button (it's a <button type="button">) with the FR label.
  const editButton = page.getByRole('button', {
    name: /Recadrer ou faire pivoter/i,
  });
  await expect(editButton).toBeVisible({ timeout: DIALOG_TIMEOUT });
  await editButton.click();
}

/** Return the open editor dialog locator. Asserts it is visible. */
async function expectEditorOpen(page: Page) {
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible({ timeout: DIALOG_TIMEOUT });
  // Title comes from admin.imageEditor.title — FR locale → "Recadrer l'image".
  await expect(
    dialog.getByText("Recadrer l'image", { exact: false }),
  ).toBeVisible();
  return dialog;
}

/** Ensure the banner form has some imageUrl so the preview + edit link render. */
async function ensureBannerHasImage(page: Page): Promise<string> {
  await page.goto('/admin/banner');
  await expect(page.locator('h1')).toBeVisible({ timeout: DIALOG_TIMEOUT });
  let current = await readImageUrl(page);
  if (!current) {
    // Seed with a whitelisted URL so we can trigger the editor + proxy path.
    await writeImageUrl(page, FALLBACK_UNSPLASH);
    current = await readImageUrl(page);
  }
  // Preview should now render.
  await expect(
    page.locator('[data-testid="image-upload-preview"]'),
  ).toBeVisible({ timeout: DIALOG_TIMEOUT });
  return current;
}

// Track the banner's initial imageUrl so afterEach can restore it.
let initialBannerImageUrl = '';

test.describe('Admin ImageEditor (/admin/banner)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/banner');
    await expect(page.locator('h1')).toBeVisible({ timeout: DIALOG_TIMEOUT });
    initialBannerImageUrl = await readImageUrl(page);
  });

  test.afterEach(async ({ page }) => {
    // Best-effort restore. If a persistence test navigated away or the DOM
    // no longer exposes the input, we silently skip — we never want the
    // restore step itself to fail the run.
    try {
      if (page.url().includes('/admin/banner')) {
        const input = page.locator('input[type="hidden"][name="imageUrl"]');
        if ((await input.count()) > 0) {
          const current = await readImageUrl(page);
          if (initialBannerImageUrl && current !== initialBannerImageUrl) {
            await writeImageUrl(page, initialBannerImageUrl);
          }
        }
      }
    } catch {
      // Swallow — cleanup is best-effort.
    }
  });

  // -------------------------------------------------------------------------
  // Scenario 1 — Editor dialog opens on "Recadrer" click
  // -------------------------------------------------------------------------
  test('1. opens editor dialog when clicking "Recadrer ou faire pivoter"', async ({
    page,
  }) => {
    // Given user is on /admin/banner with an existing imageUrl
    await ensureBannerHasImage(page);

    // When they click the pencil-icon edit button
    await openEditor(page);

    // Then role="dialog" appears within 5s containing "Recadrer l'image"
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5_000 });
    await expect(
      dialog.getByText("Recadrer l'image", { exact: false }),
    ).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // Scenario 2 — Editor applies dark theme (bug 1 verification)
  // -------------------------------------------------------------------------
  test('2. applies the new dark theme (bg-gray-950, white title, white Apply button)', async ({
    page,
  }) => {
    await ensureBannerHasImage(page);
    await openEditor(page);
    const dialog = await expectEditorOpen(page);

    // (a) dialog element has the bg-gray-950 class
    const dialogClass = await dialog.getAttribute('class');
    expect(dialogClass).toBeTruthy();
    expect(dialogClass!).toContain('bg-gray-950');

    // (b) Apply button has both bg-white and text-gray-950 classes
    const applyBtn = page.locator('[data-testid="image-editor-apply"]');
    await expect(applyBtn).toBeVisible();
    const applyClass = (await applyBtn.getAttribute('class')) ?? '';
    expect(applyClass).toContain('bg-white');
    expect(applyClass).toContain('text-gray-950');

    // (c) Cancel button className includes text-white
    const cancelBtn = page.locator('[data-testid="image-editor-cancel"]');
    await expect(cancelBtn).toBeVisible();
    const cancelClass = (await cancelBtn.getAttribute('class')) ?? '';
    expect(cancelClass).toContain('text-white');

    // (d) DialogTitle computed color has RGB all in [240, 255] (white-ish).
    // Locate the title node inside the dialog. Use the visible text — it is
    // unique within the dialog and maps to the DialogTitle element.
    const title = dialog
      .getByText("Recadrer l'image", { exact: false })
      .first();
    const rgb = await title.evaluate((el) => {
      const c = window.getComputedStyle(el).color;
      // Match "rgb(R, G, B)" or "rgba(R, G, B, A)"
      const m = c.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
      if (!m) return null;
      return [Number(m[1]), Number(m[2]), Number(m[3])];
    });
    expect(rgb).not.toBeNull();
    const [r, g, b] = rgb!;
    expect(r).toBeGreaterThanOrEqual(240);
    expect(r).toBeLessThanOrEqual(255);
    expect(g).toBeGreaterThanOrEqual(240);
    expect(g).toBeLessThanOrEqual(255);
    expect(b).toBeGreaterThanOrEqual(240);
    expect(b).toBeLessThanOrEqual(255);
  });

  // -------------------------------------------------------------------------
  // Scenario 3 — Editor uses the image proxy for remote R2 URLs (bug 2)
  // -------------------------------------------------------------------------
  test('3. routes remote R2 URLs through /api/image-proxy', async ({ page }) => {
    // Seed with a known R2 URL so the editor has to proxy it.
    await page.goto('/admin/banner');
    await expect(page.locator('h1')).toBeVisible({ timeout: DIALOG_TIMEOUT });
    await writeImageUrl(page, KNOWN_R2_IMAGE);
    await expect(
      page.locator('[data-testid="image-upload-preview"]'),
    ).toBeVisible({ timeout: DIALOG_TIMEOUT });

    await openEditor(page);
    await expectEditorOpen(page);

    // The Cropper library renders the underlying <img> with class
    // `reactEasyCrop_Image`. Its src must be /api/image-proxy?url=...
    const cropperImg = page.locator('.reactEasyCrop_Image');
    await expect(cropperImg).toBeAttached({ timeout: DIALOG_TIMEOUT });
    const src = await cropperImg.getAttribute('src');
    expect(src, 'cropper <img> src').toBeTruthy();
    expect(src!).toContain('/api/image-proxy?url=');
    expect(src!).toContain(encodeURIComponent(KNOWN_R2_IMAGE).slice(0, 30));
  });

  // -------------------------------------------------------------------------
  // Scenario 4 — Editor uses direct src for data: URIs (no proxy)
  // -------------------------------------------------------------------------
  test('4. uses direct src (no proxy) for data: URIs', async ({ page }) => {
    await page.goto('/admin/banner');
    await expect(page.locator('h1')).toBeVisible({ timeout: DIALOG_TIMEOUT });
    await writeImageUrl(page, TINY_DATA_URI);
    await expect(
      page.locator('[data-testid="image-upload-preview"]'),
    ).toBeVisible({ timeout: DIALOG_TIMEOUT });

    await openEditor(page);
    await expectEditorOpen(page);

    const cropperImg = page.locator('.reactEasyCrop_Image');
    await expect(cropperImg).toBeAttached({ timeout: DIALOG_TIMEOUT });
    const src = await cropperImg.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src!.startsWith('data:')).toBe(true);
    expect(src!).not.toContain('/api/image-proxy');
  });

  // -------------------------------------------------------------------------
  // Scenario 5 — /api/image-proxy whitelist enforcement
  // -------------------------------------------------------------------------
  test('5. /api/image-proxy enforces whitelist, https, and required param', async ({
    page,
  }) => {
    // Evaluate from within the authenticated page so same-origin + cookies
    // apply (even though this endpoint doesn't require auth, it keeps the
    // fetch on the actual app origin under test).

    // Non-whitelisted host → 403
    const evil = await page.evaluate(async () => {
      const r = await fetch(
        `/api/image-proxy?url=${encodeURIComponent(
          'https://evil.example.com/x.jpg',
        )}`,
      );
      return { status: r.status };
    });
    expect(evil.status).toBe(403);

    // Whitelisted R2 URL → 200 + access-control-allow-origin: *
    const r2 = await page.evaluate(async (url: string) => {
      const r = await fetch(`/api/image-proxy?url=${encodeURIComponent(url)}`);
      return {
        status: r.status,
        acao: r.headers.get('access-control-allow-origin'),
      };
    }, KNOWN_R2_IMAGE);
    // Accept 200 (image exists) or 404 (our known test key not uploaded) —
    // what matters is that the whitelist passed. If the upstream image
    // doesn't exist, the proxy forwards its status (e.g. 404). So the
    // contract we actually verify is: NOT 403 (whitelist passed) AND the
    // CORS header is set when we got 2xx from upstream.
    expect(r2.status).not.toBe(403);
    if (r2.status === 200) {
      expect(r2.acao).toBe('*');
    }

    // Missing url param → 400
    const missing = await page.evaluate(async () => {
      const r = await fetch(`/api/image-proxy`);
      return { status: r.status };
    });
    expect(missing.status).toBe(400);

    // Non-https (http://) → 400
    const httpOnly = await page.evaluate(async () => {
      const r = await fetch(
        `/api/image-proxy?url=${encodeURIComponent(
          'http://images.unsplash.com/x.jpg',
        )}`,
      );
      return { status: r.status };
    });
    expect(httpOnly.status).toBe(400);
  });

  // -------------------------------------------------------------------------
  // Scenario 6 — Apply updates hidden input with new URL (bug 2 persistence)
  // -------------------------------------------------------------------------
  test('6. clicking Apply updates the hidden imageUrl input to a new URL', async ({
    page,
  }) => {
    // Seed with a known R2 URL so the crop path exercises the proxy.
    await page.goto('/admin/banner');
    await expect(page.locator('h1')).toBeVisible({ timeout: DIALOG_TIMEOUT });
    await writeImageUrl(page, KNOWN_R2_IMAGE);
    await expect(
      page.locator('[data-testid="image-upload-preview"]'),
    ).toBeVisible({ timeout: DIALOG_TIMEOUT });

    const urlBefore = await readImageUrl(page);
    expect(urlBefore).toBe(KNOWN_R2_IMAGE);

    await openEditor(page);
    const dialog = await expectEditorOpen(page);

    // Wait for Cropper to mount the underlying image and become interactive.
    const cropperContainer = dialog.locator('[data-testid="container"]');
    await expect(cropperContainer).toBeAttached({ timeout: DIALOG_TIMEOUT });
    // Give the image a moment to load — if it errors (404/CORS), the Apply
    // click may fallback to the original bytes. That's fine: the fix we care
    // about is that the proxy URL is USED, not that the final bytes differ.
    await page.waitForTimeout(1_500);

    // Drag the crop area slightly to force a non-trivial crop.
    const box = await cropperContainer.boundingBox();
    if (box) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx + 30, cy + 30, { steps: 5 });
      await page.mouse.up();
    }

    // Click Apply.
    const applyBtn = page.locator('[data-testid="image-editor-apply"]');
    await expect(applyBtn).toBeEnabled({ timeout: APPLY_TIMEOUT });
    await applyBtn.click();

    // Dialog should close within APPLY_TIMEOUT.
    await expect(dialog).toBeHidden({ timeout: APPLY_TIMEOUT });

    // Within 10s, the hidden input's value must change from urlBefore. The
    // replacement should either be (a) a new HTTPS URL on an allowed host
    // (successful upload to R2) OR (b) a data:/blob: URI (local fallback
    // when R2 creds aren't set in the test env).
    await expect
      .poll(
        async () => await readImageUrl(page),
        { timeout: APPLY_TIMEOUT, message: 'imageUrl should change after Apply' },
      )
      .not.toBe(urlBefore);

    const urlAfter = await readImageUrl(page);
    const looksLikeAllowedHttps =
      urlAfter.startsWith('https://') &&
      /(r2\.dev|r2\.orusgallery\.com|unsplash\.com|cloudinary\.com)/.test(
        urlAfter,
      );
    const looksLikeLocalUri =
      urlAfter.startsWith('data:') || urlAfter.startsWith('blob:');
    expect(
      looksLikeAllowedHttps || looksLikeLocalUri,
      `urlAfter was "${urlAfter}" — expected https://<allowed-host> or data:/blob:`,
    ).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Scenario 7 — Cancel closes the dialog without mutation
  // -------------------------------------------------------------------------
  test('7. clicking Cancel closes the dialog and does not mutate imageUrl', async ({
    page,
  }) => {
    await ensureBannerHasImage(page);
    const urlBefore = await readImageUrl(page);

    await openEditor(page);
    const dialog = await expectEditorOpen(page);

    // Wait for cropper to mount so we have something to "adjust".
    await expect(
      dialog.locator('[data-testid="container"]'),
    ).toBeAttached({ timeout: DIALOG_TIMEOUT });

    // Drag a bit to simulate crop adjustments.
    const box = await dialog
      .locator('[data-testid="container"]')
      .boundingBox();
    if (box) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx + 20, cy + 20, { steps: 3 });
      await page.mouse.up();
    }

    await page.locator('[data-testid="image-editor-cancel"]').click();
    await expect(dialog).toBeHidden({ timeout: DIALOG_TIMEOUT });

    // Hidden input value must be unchanged after cancel.
    const urlAfter = await readImageUrl(page);
    expect(urlAfter).toBe(urlBefore);
  });

  // -------------------------------------------------------------------------
  // Scenario 8 — Empty-state fallback (regression guard)
  // -------------------------------------------------------------------------
  test('8. "Aucune image à éditer" is not shown under the normal flow', async ({
    page,
  }) => {
    await ensureBannerHasImage(page);
    await openEditor(page);
    const dialog = await expectEditorOpen(page);

    // The empty-state copy exists in code (noImage key) as a defensive
    // fallback when imageSrc is blank. In the normal flow — opening from a
    // preview with an imageUrl set — it must NEVER appear.
    await expect(
      dialog.getByText('Aucune image à éditer', { exact: false }),
    ).toHaveCount(0);

    // And the cropper container should be mounted instead.
    await expect(
      dialog.locator('[data-testid="container"]'),
    ).toBeAttached({ timeout: DIALOG_TIMEOUT });
  });

  // -------------------------------------------------------------------------
  // Scenario 9 — Form submit persists the new URL (round-trip)
  // -------------------------------------------------------------------------
  test('9. saved imageUrl round-trips through Enregistrer + reload', async ({
    page,
  }) => {
    // If no banner exists, skip — this scenario requires an upsert path and
    // we don't want to create prod side-effects on a fresh DB.
    if (!initialBannerImageUrl) {
      test.skip(true, 'No existing banner configured; skipping round-trip.');
      return;
    }

    // Seed with a whitelisted R2 URL, edit, Apply, Save, reload, verify.
    await writeImageUrl(page, KNOWN_R2_IMAGE);
    await expect(
      page.locator('[data-testid="image-upload-preview"]'),
    ).toBeVisible({ timeout: DIALOG_TIMEOUT });

    await openEditor(page);
    const dialog = await expectEditorOpen(page);

    // Let the cropper initialize then drag for a real crop.
    const cropperContainer = dialog.locator('[data-testid="container"]');
    await expect(cropperContainer).toBeAttached({ timeout: DIALOG_TIMEOUT });
    await page.waitForTimeout(1_500);
    const box = await cropperContainer.boundingBox();
    if (box) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx + 40, cy + 20, { steps: 5 });
      await page.mouse.up();
    }

    const applyBtn = page.locator('[data-testid="image-editor-apply"]');
    await expect(applyBtn).toBeEnabled({ timeout: APPLY_TIMEOUT });
    await applyBtn.click();
    await expect(dialog).toBeHidden({ timeout: APPLY_TIMEOUT });

    // Wait for imageUrl to change away from KNOWN_R2_IMAGE (editor returned).
    await expect
      .poll(async () => await readImageUrl(page), { timeout: APPLY_TIMEOUT })
      .not.toBe(KNOWN_R2_IMAGE);
    const newUrl = await readImageUrl(page);
    expect(newUrl.length).toBeGreaterThan(0);

    // Submit the form. The server action upserts + redirect('/admin/banner').
    // Wait for the POST to complete so we don't race against the DB update.
    const submitResponse = page.waitForResponse(
      (resp) =>
        resp.url().includes('/admin/banner') &&
        resp.request().method() === 'POST' &&
        resp.status() < 400,
      { timeout: 30_000 },
    );
    await page
      .locator('form')
      .first()
      .evaluate((form) => (form as HTMLFormElement).requestSubmit());
    await submitResponse;
    await page.waitForLoadState('networkidle', { timeout: 30_000 });

    // Re-fetch fresh from the server.
    await page.goto('/admin/banner', { waitUntil: 'networkidle' });
    await expect(page.locator('h1')).toBeVisible({ timeout: DIALOG_TIMEOUT });

    const persisted = await readImageUrl(page);
    // Accept either the new https URL (successful upload persisted) or the
    // newUrl itself (which may be a blob: URI in some local flows — that
    // won't persist through the server round-trip, so skip the strict check
    // in that case).
    if (newUrl.startsWith('https://')) {
      expect(persisted).toBe(newUrl);
    } else {
      // Local blob URIs don't survive server round-trip; just ensure the
      // banner was saved with *some* imageUrl.
      expect(persisted.length).toBeGreaterThan(0);
    }

    // Cleanup: restore the original image we captured in beforeEach so we
    // don't leave the just-cropped version in prod.
    if (initialBannerImageUrl && persisted !== initialBannerImageUrl) {
      await writeImageUrl(page, initialBannerImageUrl);
      await page
        .locator('form')
        .first()
        .evaluate((form) => (form as HTMLFormElement).requestSubmit());
      await page.waitForURL(/\/admin\/banner/, { timeout: 30_000 });
    }
  });
});
