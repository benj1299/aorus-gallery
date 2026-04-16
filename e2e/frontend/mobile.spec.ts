import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test.describe('Mobile Responsive', () => {
  test('homepage loads on mobile and carousel is scrollable', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('domcontentloaded');

    // Hero section renders with the ORUS GALLERY heading
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 15000 });

    // The featured artworks carousel is a horizontal scroll container
    const carousel = page.locator('.overflow-x-auto.snap-x');
    const isVisible = await carousel.isVisible().catch(() => false);

    if (!isVisible) {
      // If no featured artworks, the page falls back to artist grid — still valid
      return;
    }

    // Verify the carousel has snap-start children (artwork cards)
    const cards = carousel.locator('.snap-start');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Verify the container is scrollable by checking scrollWidth > clientWidth
    const isScrollable = await carousel.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(isScrollable).toBe(true);
  });

  test('mobile hamburger menu opens and shows navigation links', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('domcontentloaded');

    // Desktop nav should be hidden on mobile (md:flex = hidden below md)
    const desktopNav = page.locator('.hidden.md\\:flex');
    await expect(desktopNav).not.toBeVisible();

    // Mobile menu button should be visible (md:hidden)
    const menuButton = page.locator('button[aria-label="Open menu"]');
    await expect(menuButton).toBeVisible({ timeout: 15000 });

    // Open the mobile menu
    await menuButton.click();

    // The mobile menu overlay appears with navigation links
    const mobileMenu = page.locator('.fixed.inset-0.z-40');
    await expect(mobileMenu).toBeVisible({ timeout: 5000 });

    // Verify key nav links are visible in the mobile menu
    await expect(mobileMenu.getByText('Artists')).toBeVisible({ timeout: 5000 });
    await expect(mobileMenu.getByText('Contact')).toBeVisible({ timeout: 5000 });
    await expect(mobileMenu.getByText('About')).toBeVisible({ timeout: 5000 });
  });

  test('mobile menu closes when a link is clicked', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('domcontentloaded');

    const menuButton = page.locator('button[aria-label="Open menu"]');
    await expect(menuButton).toBeVisible({ timeout: 15000 });
    await menuButton.click();

    const mobileMenu = page.locator('.fixed.inset-0.z-40');
    await expect(mobileMenu).toBeVisible({ timeout: 5000 });

    // Click the Artists link
    await mobileMenu.getByText('Artists').click();

    // Should navigate and the menu should close
    await page.waitForURL('**/artists', { timeout: 15000 });
    await expect(mobileMenu).not.toBeVisible({ timeout: 5000 });
  });

  test('artist listing renders in a two-column grid on mobile', async ({ page }) => {
    await page.goto('/en/artists');
    await page.waitForLoadState('domcontentloaded');

    // Artists page uses grid-cols-2 on mobile (md:grid-cols-3 lg:grid-cols-4)
    const grid = page.locator('.grid.grid-cols-2');
    await expect(grid).toBeVisible({ timeout: 15000 });

    // Verify artist cards are present
    const artistCards = grid.locator('a[href*="/artists/"]');
    const count = await artistCards.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // On iPhone 13 (390px), the grid-cols-2 layout means each card is roughly half the viewport
    const firstCard = artistCards.first();
    const cardBox = await firstCard.boundingBox();
    expect(cardBox).toBeTruthy();
    // Each card should be less than 60% of the viewport width (two-column layout)
    const viewportWidth = page.viewportSize()?.width ?? 390;
    expect(cardBox!.width).toBeLessThan(viewportWidth * 0.6);
  });

  test('artwork detail page: image fills width and cartel is visible below', async ({ page }) => {
    // Discover a real artwork slug
    await page.goto('/en');
    await page.waitForLoadState('domcontentloaded');

    const artworkLink = page.locator('a[href*="/artworks/"]').first();
    const isVisible = await artworkLink.isVisible().catch(() => false);

    if (!isVisible) {
      test.skip();
      return;
    }

    const href = await artworkLink.getAttribute('href');
    const slug = href!.split('/artworks/').pop();

    await page.goto(`/en/artworks/${slug}`);
    await page.waitForLoadState('domcontentloaded');

    // Main image container should be present
    const mainImage = page.locator('[data-testid="artwork-main-image"]');
    await expect(mainImage).toBeVisible({ timeout: 15000 });

    const imgBox = await mainImage.boundingBox();
    expect(imgBox).toBeTruthy();
    const viewportWidth = page.viewportSize()?.width ?? 390;
    // Image container should span most of the viewport width (minus small padding)
    expect(imgBox!.width).toBeGreaterThan(viewportWidth * 0.8);

    // Cartel (artist name, title) should be visible below the image
    const cartel = page.locator('.max-w-xl').first();
    await expect(cartel).toBeVisible({ timeout: 15000 });

    // Cartel should be positioned below the main image
    const cartelBox = await cartel.boundingBox();
    expect(cartelBox).toBeTruthy();
    expect(cartelBox!.y).toBeGreaterThan(imgBox!.y);
  });

  test('contact form is usable on mobile', async ({ page }) => {
    await page.goto('/en/contact');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    // Verify form fields are visible and usable
    const nameField = page.locator('#name');
    const emailField = page.locator('#email');
    const messageField = page.locator('#message');
    const rgpdCheckbox = page.locator('#rgpd');

    await expect(nameField).toBeVisible({ timeout: 5000 });
    await expect(emailField).toBeVisible({ timeout: 5000 });
    await expect(messageField).toBeVisible({ timeout: 5000 });
    await expect(rgpdCheckbox).toBeVisible({ timeout: 5000 });

    // Fields should fill the available width on mobile
    const nameBox = await nameField.boundingBox();
    expect(nameBox).toBeTruthy();
    const viewportWidth = page.viewportSize()?.width ?? 390;
    // Input should be at least 70% of viewport width on mobile
    expect(nameBox!.width).toBeGreaterThan(viewportWidth * 0.7);

    // Submit button should be visible
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible({ timeout: 5000 });

    // Fill out the form to verify interactivity
    await nameField.fill('Mobile Test');
    await emailField.fill('mobile@test.com');
    await messageField.fill('Testing form on mobile viewport');

    // Verify the values were entered
    await expect(nameField).toHaveValue('Mobile Test');
    await expect(emailField).toHaveValue('mobile@test.com');
    await expect(messageField).toHaveValue('Testing form on mobile viewport');
  });
});
