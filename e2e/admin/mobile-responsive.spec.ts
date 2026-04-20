import { test, expect, Page } from '@playwright/test';

/**
 * E2E coverage for the admin responsive layout shipped in 9ea48d7.
 *
 * New pieces under test:
 *   - AdminMobileTopBar (components/admin/sidebar.tsx) — sticky header with
 *     hamburger + branded title, visible < md, hidden >= md.
 *   - Mobile drawer (same file) — opens on hamburger click, closes on link
 *     nav via onNavigate, uses testid admin-sidebar-mobile.
 *   - FormLayout sticky submit (components/admin/form-layout.tsx) — the
 *     footer row is position:sticky on mobile (sticky bottom-0 md:static).
 *   - AdminTable horizontal scroll (components/admin/admin-table.tsx) —
 *     wrapper has overflow-x-auto so tables scroll instead of truncating.
 *   - Artwork form grid responsive — grid-cols-1 sm:grid-cols-2 stacks at
 *     375px viewport.
 *
 * Read-only layout assertions. No form submits, no DB mutations.
 *
 * Auth: seeded by e2e/auth.setup.ts via storageState (e2e/.auth/admin.json).
 *
 * Viewports:
 *   - Desktop: 1280 × 720 (Tailwind md+ threshold = 768px)
 *   - Mobile:  375 × 812 (iPhone SE 3rd gen)
 */

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };
const MOBILE_VIEWPORT = { width: 375, height: 812 };
const LOAD_TIMEOUT = 15_000;

async function gotoAdmin(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('h1').first()).toBeVisible({ timeout: LOAD_TIMEOUT });
}

test.describe('Admin responsive layout (desktop)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('1. desktop sidebar is visible, mobile top bar is hidden at md+', async ({
    page,
  }) => {
    await gotoAdmin(page, '/admin');

    const desktopSidebar = page.locator(
      '[data-testid="admin-sidebar-desktop"]',
    );
    const mobileTopBar = page.locator('[data-testid="admin-top-bar"]');

    await expect(desktopSidebar).toBeVisible();
    // Mobile top bar is rendered with `md:hidden`, so it's display:none at md+.
    await expect(mobileTopBar).toBeHidden();
  });
});

test.describe('Admin responsive layout (mobile, 375×812)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
  });

  test('2. at mobile, desktop sidebar is hidden and mobile top bar is visible', async ({
    page,
  }) => {
    await gotoAdmin(page, '/admin');

    const desktopSidebar = page.locator(
      '[data-testid="admin-sidebar-desktop"]',
    );
    const mobileTopBar = page.locator('[data-testid="admin-top-bar"]');

    await expect(desktopSidebar).toBeHidden();
    await expect(mobileTopBar).toBeVisible();

    // Top bar should sit at the top of the viewport (sticky top-0).
    const barBox = await mobileTopBar.boundingBox();
    expect(barBox, 'top bar box').not.toBeNull();
    expect(barBox!.y).toBeLessThanOrEqual(4);
  });

  test('3. hamburger opens the drawer, Artistes link is visible, clicking it closes drawer and navigates', async ({
    page,
  }) => {
    await gotoAdmin(page, '/admin');

    const trigger = page.locator('[data-testid="admin-menu-trigger"]');
    await expect(trigger).toBeVisible();

    // Drawer not yet mounted.
    await expect(
      page.locator('[data-testid="admin-sidebar-mobile"]'),
    ).toHaveCount(0);

    await trigger.click();

    const drawer = page.locator('[data-testid="admin-sidebar-mobile"]');
    await expect(drawer).toBeVisible({ timeout: 5_000 });

    // Artists link visible inside the drawer. Scope to the drawer so we
    // don't accidentally click the (hidden) desktop sidebar's link.
    const artistsLink = drawer.locator('[data-testid="nav-artists"]');
    await expect(artistsLink).toBeVisible();

    await Promise.all([
      page.waitForURL('**/admin/artists', { timeout: 15_000 }),
      artistsLink.click(),
    ]);

    // After navigation, the drawer unmounts (onNavigate + pathname-change
    // both call setOpen(false), AnimatePresence exit runs).
    await expect(
      page.locator('[data-testid="admin-sidebar-mobile"]'),
    ).toHaveCount(0, { timeout: 5_000 });

    // And we're on the Artists page.
    expect(page.url()).toContain('/admin/artists');
  });

  test('4. FormLayout submit button is position:sticky on mobile /admin/banner', async ({
    page,
  }) => {
    await gotoAdmin(page, '/admin/banner');

    const submit = page.locator('[data-testid="form-submit"]');
    await expect(submit).toBeVisible();

    // The submit button sits inside a sticky footer div — read the position
    // from its parent container (the "sticky bottom-0 md:static" wrapper).
    const position = await submit.evaluate((el) => {
      const footer = el.closest('.sticky, [class*="sticky"]');
      if (!footer) return 'none';
      return window.getComputedStyle(footer).position;
    });
    expect(position).toBe('sticky');
  });

  test('5. /admin/artworks table wrapper is horizontally scrollable (overflow-x-auto)', async ({
    page,
  }) => {
    await gotoAdmin(page, '/admin/artworks');

    // AdminTable wraps the <Table> in a `rounded-lg border overflow-x-auto`
    // container. Find the nearest ancestor of the <table> that has
    // overflow-x: auto.
    const table = page.locator('table').first();
    await expect(table).toBeVisible({ timeout: LOAD_TIMEOUT });

    const overflowX = await table.evaluate((el) => {
      let cur: HTMLElement | null = el.parentElement;
      while (cur) {
        const ox = window.getComputedStyle(cur).overflowX;
        if (ox === 'auto' || ox === 'scroll') return ox;
        cur = cur.parentElement;
      }
      return 'none';
    });
    expect(overflowX).toMatch(/^(auto|scroll)$/);
  });

  test('6. /admin/artworks/new stacks grid-cols-1 sm:grid-cols-2 inputs vertically at 375px', async ({
    page,
  }) => {
    await gotoAdmin(page, '/admin/artworks/new');

    // The artwork form uses `grid-cols-1 sm:grid-cols-2` on the row
    // containing `medium` (TranslatableInput, default-active locale = 'en')
    // and `dimensions` (plain Input). At 375px (< sm=640px), grid-cols-1
    // applies → the two fields stack.
    const mediumEn = page.locator('input[name="medium.en"]');
    const dimensions = page.locator('input[name="dimensions"]');
    await expect(mediumEn).toBeVisible({ timeout: LOAD_TIMEOUT });
    await expect(dimensions).toBeVisible({ timeout: LOAD_TIMEOUT });

    const mediumBox = await mediumEn.boundingBox();
    const dimensionsBox = await dimensions.boundingBox();
    expect(mediumBox, 'medium input box').not.toBeNull();
    expect(dimensionsBox, 'dimensions input box').not.toBeNull();

    // Stacked vertically means dimensions sits well below medium (distinct
    // top offsets). At sm+ they'd be on the same row (same y, within a few px).
    expect(
      Math.abs(mediumBox!.y - dimensionsBox!.y),
      'medium and dimensions should stack vertically at 375px',
    ).toBeGreaterThan(20);
  });
});
