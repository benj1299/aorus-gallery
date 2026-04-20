import { test, expect, Page } from '@playwright/test';

/**
 * E2E coverage for the bespoke admin ImageEditor
 * (components/admin/image-editor.tsx) wrapped by ImageUpload
 * (components/admin/image-upload.tsx).
 *
 * The editor was rewritten in 9ea48d7: no more react-easy-crop, drops zoom,
 * switches to light theme, adds a ±15° straighten slider + a 90° quick
 * rotate button + a free-form crop rectangle with 4 corner handles + a Reset
 * button. The /api/image-proxy contract is unchanged and still used for
 * remote R2 URLs.
 *
 * Admin session is seeded by e2e/auth.setup.ts via storageState
 * (e2e/.auth/admin.json). The banner admin page is the one flow in the app
 * that currently surfaces ImageUpload + editor end-to-end, so these tests
 * exercise /admin/banner.
 *
 * Client i18n locale is FR (NextIntlClientProvider in admin layout), so
 * visible labels are French: "Recadrer ou faire pivoter" (edit link),
 * "Recadrer l'image" (dialog title), "Appliquer", "Annuler".
 *
 * Side-effects: tests may mutate the banner row. afterEach restores a known
 * test image so prod data isn't left in a garbage state. If no banner is
 * configured at all, the full round-trip (scenario 10) skips with a clear
 * message.
 */

// Known-good image served by an allowed host (whitelisted in image-proxy).
const KNOWN_R2_IMAGE =
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80';
// Small 1x1 transparent PNG as a data URI — used to test the no-proxy path.
const TINY_DATA_URI =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
// Fallback Unsplash URL. Used when no banner exists yet, so we can set one
// via the hidden input and still exercise the proxy path.
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
  // Click the URL tab (component starts on 'upload' tab when currentUrl empty)
  await page.getByRole('button', { name: /^URL$/i }).first().click();
  const urlInput = page.locator('input[type="url"]').first();
  await expect(urlInput).toBeVisible({ timeout: 5_000 });
  await urlInput.fill(url);
  await expect(
    page.locator('input[type="hidden"][name="imageUrl"]'),
  ).toHaveValue(url, { timeout: 5_000 });
}

/** Click the pencil "Recadrer ou faire pivoter" link under the preview. */
async function openEditor(page: Page): Promise<void> {
  const editButton = page.getByRole('button', {
    name: /Recadrer ou faire pivoter/i,
  });
  await expect(editButton).toBeVisible({ timeout: DIALOG_TIMEOUT });
  await editButton.click();
}

/** Return the open editor dialog locator, and wait for the preview image. */
async function expectEditorOpen(page: Page) {
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible({ timeout: DIALOG_TIMEOUT });
  await expect(
    dialog.getByText("Recadrer l'image", { exact: false }),
  ).toBeVisible();
  // Workspace always present once the dialog is up.
  await expect(
    dialog.locator('[data-testid="image-editor-workspace"]'),
  ).toBeVisible({ timeout: DIALOG_TIMEOUT });
  return dialog;
}

/** Ensure the banner form has some imageUrl so preview + edit link render. */
async function ensureBannerHasImage(page: Page): Promise<string> {
  await page.goto('/admin/banner');
  await expect(page.locator('h1')).toBeVisible({ timeout: DIALOG_TIMEOUT });
  let current = await readImageUrl(page);
  if (!current) {
    await writeImageUrl(page, FALLBACK_UNSPLASH);
    current = await readImageUrl(page);
  }
  await expect(
    page.locator('[data-testid="image-upload-preview"]'),
  ).toBeVisible({ timeout: DIALOG_TIMEOUT });
  return current;
}

/** Wait for the preview img to be attached AND fully loaded. */
async function waitForPreview(page: Page) {
  const preview = page.locator('[data-testid="image-editor-preview"]');
  await expect(preview).toBeAttached({ timeout: DIALOG_TIMEOUT });
  // Poll until naturalWidth > 0 — this is the signal that the component's
  // onLoad fired and `natural` state was set, which in turn unblocks
  // displayArea and the crop overlay.
  await expect
    .poll(
      async () => {
        return page.evaluate(() => {
          const img = document.querySelector(
            '[data-testid="image-editor-preview"]',
          ) as HTMLImageElement | null;
          return img?.naturalWidth ?? 0;
        });
      },
      {
        timeout: DIALOG_TIMEOUT,
        message: 'preview image naturalWidth never became > 0',
      },
    )
    .toBeGreaterThan(0);
  // Give React one more frame to commit displayArea + crop.
  await page.waitForTimeout(300);
  return preview;
}

/** Read the `transform` CSS on the preview's rotating parent. */
async function readPreviewTransform(page: Page): Promise<string> {
  return page.evaluate(() => {
    const img = document.querySelector(
      '[data-testid="image-editor-preview"]',
    );
    if (!img) return '';
    const parent = img.parentElement;
    if (!parent) return '';
    return window.getComputedStyle(parent).transform;
  });
}

/** Parse the rotation angle (degrees) from a CSS transform matrix. */
function matrixToDegrees(matrix: string): number | null {
  // transform: matrix(a, b, c, d, tx, ty) — rotation = atan2(b, a) in radians
  const m = matrix.match(/matrix\(\s*([-\d.]+),\s*([-\d.]+),\s*([-\d.]+),\s*([-\d.]+)/);
  if (!m) return null;
  const a = parseFloat(m[1]);
  const b = parseFloat(m[2]);
  const rad = Math.atan2(b, a);
  return (rad * 180) / Math.PI;
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
    // Best-effort restore. Never let cleanup fail the run.
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
      // Swallow.
    }
  });

  // -------------------------------------------------------------------------
  // Scenario 1 — Editor dialog opens on "Recadrer" click
  // -------------------------------------------------------------------------
  test('1. opens editor dialog when clicking "Recadrer ou faire pivoter"', async ({
    page,
  }) => {
    await ensureBannerHasImage(page);
    await openEditor(page);

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5_000 });
    await expect(
      dialog.getByText("Recadrer l'image", { exact: false }),
    ).toBeVisible();
    // The new bespoke editor always mounts a workspace (not react-easy-crop).
    await expect(
      dialog.locator('[data-testid="image-editor-workspace"]'),
    ).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // Scenario 2 — Light theme (post-rewrite)
  // -------------------------------------------------------------------------
  test('2. applies the new light theme (bg-white dialog, dark title, workspace bg-gray-50, dark Apply)', async ({
    page,
  }) => {
    await ensureBannerHasImage(page);
    await openEditor(page);
    const dialog = await expectEditorOpen(page);

    // (a) Dialog element class contains bg-white (light theme), NOT bg-gray-950.
    const dialogClass = (await dialog.getAttribute('class')) ?? '';
    expect(dialogClass, 'dialog class').toContain('bg-white');
    expect(dialogClass).not.toContain('bg-gray-950');

    // (b) Workspace has the bg-gray-50 light background class.
    const workspace = dialog.locator('[data-testid="image-editor-workspace"]');
    const workspaceClass = (await workspace.getAttribute('class')) ?? '';
    expect(workspaceClass).toContain('bg-gray-50');

    // (c) DialogTitle computed color is dark (each channel in 0..90 = darkish).
    //     Tailwind v4 serializes colors as `oklch(...)` or `color(srgb ...)`
    //     depending on the browser. Rather than parse those formats, paint
    //     the color onto a canvas and read back RGB via getImageData.
    const title = dialog
      .getByText("Recadrer l'image", { exact: false })
      .first();
    const rgb = await title.evaluate((el) => {
      const c = window.getComputedStyle(el).color;
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.fillStyle = '#000'; // reset
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]];
    });
    expect(rgb, 'title color parsed').not.toBeNull();
    const [r, g, b] = rgb!;
    // text-gray-900 ≈ rgb(17,24,39) — well within 0..90 per channel.
    expect(r).toBeLessThanOrEqual(90);
    expect(g).toBeLessThanOrEqual(90);
    expect(b).toBeLessThanOrEqual(90);

    // (d) Apply button computed background is NOT white-ish (uses default
    //     primary dark styling, no longer forced bg-white). Same canvas
    //     trick for oklch/color() formats.
    const applyBtn = page.locator('[data-testid="image-editor-apply"]');
    await expect(applyBtn).toBeVisible();
    const applyRgb = await applyBtn.evaluate((el) => {
      const c = window.getComputedStyle(el).backgroundColor;
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.fillStyle = '#000';
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2], d[3]];
    });
    expect(applyRgb, 'apply bg color parsed').not.toBeNull();
    const [br, bg, bb] = applyRgb!;
    // White-ish would be all three channels > 240. Assert NOT all three are
    // high — leaves room for various primary colors (emerald, gray-900, etc.).
    const isWhiteIsh = br > 240 && bg > 240 && bb > 240;
    expect(
      isWhiteIsh,
      `Apply button bg rgba(${br},${bg},${bb}) looks white-ish — expected default dark primary`,
    ).toBe(false);

    // (e) Sanity: Apply button classes no longer include the old forced
    //     bg-white + text-gray-950 combo.
    const applyClass = (await applyBtn.getAttribute('class')) ?? '';
    // It's ok if bg-white appears via a transitive class, but text-gray-950
    // was the hallmark of the old dark-theme override — it should be gone.
    expect(applyClass).not.toContain('text-gray-950');
  });

  // -------------------------------------------------------------------------
  // Scenario 3 — Remote R2 URLs still route through /api/image-proxy
  // -------------------------------------------------------------------------
  test('3. routes remote R2 URLs through /api/image-proxy', async ({ page }) => {
    await page.goto('/admin/banner');
    await expect(page.locator('h1')).toBeVisible({ timeout: DIALOG_TIMEOUT });
    await writeImageUrl(page, KNOWN_R2_IMAGE);
    await expect(
      page.locator('[data-testid="image-upload-preview"]'),
    ).toBeVisible({ timeout: DIALOG_TIMEOUT });

    await openEditor(page);
    await expectEditorOpen(page);

    // The preview img src should be the proxied URL.
    const preview = page.locator('[data-testid="image-editor-preview"]');
    await expect(preview).toBeAttached({ timeout: DIALOG_TIMEOUT });
    const src = await preview.getAttribute('src');
    expect(src, 'preview <img> src').toBeTruthy();
    expect(src!).toContain('/api/image-proxy?url=');
    expect(src!).toContain(encodeURIComponent(KNOWN_R2_IMAGE).slice(0, 30));
  });

  // -------------------------------------------------------------------------
  // Scenario 4 — Data URIs pass through directly
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

    const preview = page.locator('[data-testid="image-editor-preview"]');
    await expect(preview).toBeAttached({ timeout: DIALOG_TIMEOUT });
    const src = await preview.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src!.startsWith('data:')).toBe(true);
    expect(src!).not.toContain('/api/image-proxy');
  });

  // -------------------------------------------------------------------------
  // Scenario 5 — /api/image-proxy contract (whitelist / https / missing url)
  // -------------------------------------------------------------------------
  test('5. /api/image-proxy enforces whitelist, https, and required param', async ({
    page,
  }) => {
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

    // Whitelisted URL → NOT 403 (may be 200 with CORS, or upstream 404 — fine)
    const r2 = await page.evaluate(async (url: string) => {
      const r = await fetch(`/api/image-proxy?url=${encodeURIComponent(url)}`);
      return {
        status: r.status,
        acao: r.headers.get('access-control-allow-origin'),
      };
    }, KNOWN_R2_IMAGE);
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
  // Scenario 6 — Straighten slider present, defaults to 0, adjusts transform
  // -------------------------------------------------------------------------
  test('6. straighten slider is present, defaults to 0, and adjusts rotation transform', async ({
    page,
  }) => {
    await ensureBannerHasImage(page);
    await openEditor(page);
    const dialog = await expectEditorOpen(page);
    await waitForPreview(page);

    // Slider wrapper is present.
    const sliderWrapper = dialog.locator(
      '[data-testid="image-editor-straighten"]',
    );
    await expect(sliderWrapper).toBeVisible();

    // Default displayed value is "+0.0°".
    const valueBadge = dialog.getByText(/\+0\.0°/);
    await expect(valueBadge).toBeVisible();

    // Baseline rotation (should be 0deg / identity matrix).
    const transformBefore = await readPreviewTransform(page);
    const degBefore = matrixToDegrees(transformBefore);
    // "none" is also fine at exactly 0°. Accept either.
    if (degBefore !== null) {
      expect(Math.abs(degBefore)).toBeLessThan(0.1);
    }

    // Adjust the slider via keyboard. Radix slider thumb has role=slider.
    const thumb = sliderWrapper.locator('[role="slider"]').first();
    await thumb.focus();
    // step is 0.5 — press Right 10 times → 5° straighten.
    for (let i = 0; i < 10; i += 1) {
      await page.keyboard.press('ArrowRight');
    }
    // Wait for React commit + transform to update.
    await page.waitForTimeout(250);

    // Verify the displayed badge moved off 0.
    const updatedBadge = dialog.locator('text=/[+-]\\d+\\.\\d+°/').first();
    await expect(updatedBadge).toBeVisible();
    const updatedText = await updatedBadge.textContent();
    expect(updatedText).not.toMatch(/\+0\.0°/);

    // And the CSS transform on the preview parent has rotated off 0.
    const transformAfter = await readPreviewTransform(page);
    expect(transformAfter).not.toBe(transformBefore);
    const degAfter = matrixToDegrees(transformAfter);
    expect(degAfter, 'rotation angle after drag').not.toBeNull();
    expect(Math.abs(degAfter!)).toBeGreaterThan(1);
  });

  // -------------------------------------------------------------------------
  // Scenario 7 — 90° quick rotate button adds 90° to the rotation
  // -------------------------------------------------------------------------
  test('7. 90° button adds 90 degrees to the preview rotation transform', async ({
    page,
  }) => {
    await ensureBannerHasImage(page);
    await openEditor(page);
    const dialog = await expectEditorOpen(page);
    await waitForPreview(page);

    const transformBefore = await readPreviewTransform(page);
    const degBefore = matrixToDegrees(transformBefore) ?? 0;

    await dialog.locator('[data-testid="image-editor-rotate-90"]').click();
    await page.waitForTimeout(300);

    const transformAfter = await readPreviewTransform(page);
    const degAfter = matrixToDegrees(transformAfter);
    expect(degAfter, 'rotation angle after 90° click').not.toBeNull();

    // Rotation space is atan2 → wraps in (-180, 180]. Handle wraparound.
    let delta = degAfter! - degBefore;
    while (delta <= -180) delta += 360;
    while (delta > 180) delta -= 360;
    // The quick rotate bumps the source by 90°, but the viewer's matrix may
    // decompose to ±90° depending on the starting orientation. Accept either
    // direction within 2° tolerance for floating-point.
    expect(Math.abs(Math.abs(delta) - 90)).toBeLessThan(2);
  });

  // -------------------------------------------------------------------------
  // Scenario 8 — Reset button restores straighten to 0 and rotation to 0
  // -------------------------------------------------------------------------
  test('8. Reset button restores straighten to 0 and rotation to 0deg', async ({
    page,
  }) => {
    await ensureBannerHasImage(page);
    await openEditor(page);
    const dialog = await expectEditorOpen(page);
    await waitForPreview(page);

    // Perturb straighten + 90°.
    const sliderWrapper = dialog.locator(
      '[data-testid="image-editor-straighten"]',
    );
    const thumb = sliderWrapper.locator('[role="slider"]').first();
    await thumb.focus();
    for (let i = 0; i < 6; i += 1) await page.keyboard.press('ArrowRight');
    await dialog.locator('[data-testid="image-editor-rotate-90"]').click();
    await page.waitForTimeout(250);

    // Confirm we did perturb.
    const transformPerturbed = await readPreviewTransform(page);
    const degPerturbed = matrixToDegrees(transformPerturbed);
    // Should be far from 0.
    expect(degPerturbed).not.toBeNull();
    expect(Math.abs(degPerturbed!)).toBeGreaterThan(1);

    // Click Reset.
    await dialog.locator('[data-testid="image-editor-reset"]').click();
    await page.waitForTimeout(300);

    // Straighten badge is back to +0.0°.
    await expect(dialog.getByText(/\+0\.0°/)).toBeVisible();

    // Rotation transform reads ~0° (or "none").
    const transformReset = await readPreviewTransform(page);
    const degReset = matrixToDegrees(transformReset);
    if (degReset !== null) {
      expect(Math.abs(degReset)).toBeLessThan(0.5);
    }
  });

  // -------------------------------------------------------------------------
  // Scenario 9 — Four corner handles present and crop resizes via drag
  // -------------------------------------------------------------------------
  test('9. four corner handles are present and dragging one resizes the crop rectangle', async ({
    page,
  }) => {
    await ensureBannerHasImage(page);
    await openEditor(page);
    const dialog = await expectEditorOpen(page);
    await waitForPreview(page);

    // Wait for crop overlay to mount (initial crop = full image box). The
    // overlay depends on displayArea, which is set in useLayoutEffect after
    // the natural image size is known. Poll until a non-zero bounding box
    // is reported.
    const cropRect = dialog.locator('[data-testid="image-editor-crop"]');
    await expect(cropRect).toBeVisible({ timeout: DIALOG_TIMEOUT });
    let boxBefore = await cropRect.boundingBox();
    for (let i = 0; i < 10 && (!boxBefore || boxBefore.width < 50); i += 1) {
      await page.waitForTimeout(200);
      boxBefore = await cropRect.boundingBox();
    }
    expect(boxBefore, 'crop rect bounding box').not.toBeNull();
    expect(boxBefore!.width, 'initial crop width').toBeGreaterThan(50);

    // All 4 corner handles present.
    for (const h of ['nw', 'ne', 'sw', 'se'] as const) {
      await expect(
        dialog.locator(`[data-testid="image-editor-handle-${h}"]`),
      ).toBeVisible();
    }

    // The overlay uses React pointer event handlers + setPointerCapture on
    // the overlay itself. Simulate the pointer sequence with dispatchEvent
    // — Playwright's mouse.down/move/up sends MouseEvents, but the
    // component listens for PointerEvents. Dispatch directly on the
    // overlay, passing the handle DOM node as target so the onPointerDown
    // handler's `target.dataset.handle` check flags this as a resize.
    const seHandle = dialog.locator('[data-testid="image-editor-handle-se"]');
    const seBox = await seHandle.boundingBox();
    expect(seBox, 'SE handle bounding box').not.toBeNull();
    const sx = seBox!.x + seBox!.width / 2;
    const sy = seBox!.y + seBox!.height / 2;
    // Drag far inward — half the crop width and height — to guarantee a
    // large, unambiguous shrink even if minSize clamps kick in.
    const ex = sx - Math.max(100, boxBefore!.width / 2);
    const ey = sy - Math.max(100, boxBefore!.height / 2);

    // Use Playwright's dispatchEvent to send native PointerEvents. This
    // bypasses the usual mouse-to-pointer emulation and calls the
    // component's onPointerDown/Move/Up handlers directly. Stub the
    // setPointerCapture call so React's synthetic handler doesn't throw
    // on an invalid pointerId.
    await page.evaluate(() => {
      const overlay = document.querySelector(
        '[data-testid="image-editor-crop"]',
      ) as HTMLElement | null;
      if (!overlay) return;
      overlay.setPointerCapture = () => {};
      overlay.releasePointerCapture = () => {};
    });

    const handleDown = dialog.locator(
      '[data-testid="image-editor-handle-se"]',
    );
    const cropForDispatch = dialog.locator('[data-testid="image-editor-crop"]');

    // pointerdown on the handle — React reads e.target.dataset.handle = 'se'.
    await handleDown.dispatchEvent('pointerdown', {
      clientX: sx,
      clientY: sy,
      button: 0,
      buttons: 1,
      pointerType: 'mouse',
      pointerId: 1,
      bubbles: true,
      cancelable: true,
    });

    // Multiple pointermove frames on the overlay.
    const steps = 12;
    for (let i = 1; i <= steps; i += 1) {
      const mx = sx + ((ex - sx) * i) / steps;
      const my = sy + ((ey - sy) * i) / steps;
      await cropForDispatch.dispatchEvent('pointermove', {
        clientX: mx,
        clientY: my,
        button: 0,
        buttons: 1,
        pointerType: 'mouse',
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      });
    }

    await cropForDispatch.dispatchEvent('pointerup', {
      clientX: ex,
      clientY: ey,
      button: 0,
      buttons: 0,
      pointerType: 'mouse',
      pointerId: 1,
      bubbles: true,
      cancelable: true,
    });

    await page.waitForTimeout(400);

    const boxAfter = await cropRect.boundingBox();
    expect(boxAfter, 'crop rect after drag').not.toBeNull();
    // After shrinking the SE corner, width and height should be strictly
    // smaller than before. Use a generous 20px threshold — the drag moves
    // by at least 100px in image-pixel space, which scales down but should
    // still be well above the threshold.
    expect(
      boxAfter!.width,
      `expected width shrink: before=${boxBefore!.width.toFixed(1)} after=${boxAfter!.width.toFixed(1)}`,
    ).toBeLessThan(boxBefore!.width - 20);
    expect(
      boxAfter!.height,
      `expected height shrink: before=${boxBefore!.height.toFixed(1)} after=${boxAfter!.height.toFixed(1)}`,
    ).toBeLessThan(boxBefore!.height - 20);
  });

  // -------------------------------------------------------------------------
  // Scenario 10 — Apply persists: hidden input changes + survives reload
  // -------------------------------------------------------------------------
  test('10. Apply updates the hidden imageUrl AND survives Enregistrer + reload', async ({
    page,
  }) => {
    if (!initialBannerImageUrl) {
      test.skip(true, 'No existing banner configured; skipping round-trip.');
      return;
    }

    // Seed with a whitelisted R2 URL so the proxy path is exercised.
    await writeImageUrl(page, KNOWN_R2_IMAGE);
    await expect(
      page.locator('[data-testid="image-upload-preview"]'),
    ).toBeVisible({ timeout: DIALOG_TIMEOUT });

    const urlBefore = await readImageUrl(page);
    expect(urlBefore).toBe(KNOWN_R2_IMAGE);

    await openEditor(page);
    const dialog = await expectEditorOpen(page);
    await waitForPreview(page);

    // Adjust the crop so Apply has a real transform to bake in.
    const cropRect = dialog.locator('[data-testid="image-editor-crop"]');
    await expect(cropRect).toBeVisible({ timeout: DIALOG_TIMEOUT });
    const seHandle = dialog.locator('[data-testid="image-editor-handle-se"]');
    const seBox = await seHandle.boundingBox();
    if (seBox) {
      const sx = seBox.x + seBox.width / 2;
      const sy = seBox.y + seBox.height / 2;
      await page.mouse.move(sx, sy);
      await page.mouse.down();
      await page.mouse.move(sx - 40, sy - 40, { steps: 5 });
      await page.mouse.up();
    }

    const applyBtn = page.locator('[data-testid="image-editor-apply"]');
    await expect(applyBtn).toBeEnabled({ timeout: APPLY_TIMEOUT });
    await applyBtn.click();
    await expect(dialog).toBeHidden({ timeout: APPLY_TIMEOUT });

    // Hidden input must diverge from urlBefore within APPLY_TIMEOUT.
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

    // Submit + reload round-trip.
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

    await page.goto('/admin/banner', { waitUntil: 'networkidle' });
    await expect(page.locator('h1')).toBeVisible({ timeout: DIALOG_TIMEOUT });

    const persisted = await readImageUrl(page);
    if (urlAfter.startsWith('https://')) {
      expect(persisted).toBe(urlAfter);
    } else {
      // Local blob URIs don't survive server round-trip; just ensure the
      // banner was saved with *some* imageUrl.
      expect(persisted.length).toBeGreaterThan(0);
    }

    // Cleanup: restore the original image captured in beforeEach.
    if (initialBannerImageUrl && persisted !== initialBannerImageUrl) {
      await writeImageUrl(page, initialBannerImageUrl);
      await page
        .locator('form')
        .first()
        .evaluate((form) => (form as HTMLFormElement).requestSubmit());
      await page.waitForURL(/\/admin\/banner/, { timeout: 30_000 });
    }
  });

  // -------------------------------------------------------------------------
  // Scenario 11 — Cancel closes the dialog without mutation
  // -------------------------------------------------------------------------
  test('11. clicking Cancel closes the dialog and does not mutate imageUrl', async ({
    page,
  }) => {
    await ensureBannerHasImage(page);
    const urlBefore = await readImageUrl(page);

    await openEditor(page);
    const dialog = await expectEditorOpen(page);
    await waitForPreview(page);

    // Touch the straighten slider a bit (would have changed output if Apply).
    const thumb = dialog
      .locator('[data-testid="image-editor-straighten"] [role="slider"]')
      .first();
    await thumb.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    await dialog.locator('[data-testid="image-editor-cancel"]').click();
    await expect(dialog).toBeHidden({ timeout: DIALOG_TIMEOUT });

    const urlAfter = await readImageUrl(page);
    expect(urlAfter).toBe(urlBefore);
  });

  // -------------------------------------------------------------------------
  // Scenario 12 — Empty-state "Aucune image à éditer" regression guard
  // -------------------------------------------------------------------------
  test('12. "Aucune image à éditer" is not shown under the normal flow', async ({
    page,
  }) => {
    await ensureBannerHasImage(page);
    await openEditor(page);
    const dialog = await expectEditorOpen(page);

    // The noImage copy is a defensive fallback for blank imageSrc. Opening
    // from a preview with an imageUrl set must NEVER show it.
    await expect(
      dialog.getByText('Aucune image à éditer', { exact: false }),
    ).toHaveCount(0);

    // Workspace is mounted, and the preview img becomes attached.
    await expect(
      dialog.locator('[data-testid="image-editor-workspace"]'),
    ).toBeVisible();
    await expect(
      dialog.locator('[data-testid="image-editor-preview"]'),
    ).toBeAttached({ timeout: DIALOG_TIMEOUT });
  });
});
