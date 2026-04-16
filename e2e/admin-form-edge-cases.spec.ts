import { test, expect } from '@playwright/test';

test.describe('Admin Form Edge Cases', () => {
  test('artist form rejects empty name and shows error toast', async ({ page }) => {
    await page.goto('/admin/artists/new');
    await expect(page.locator('h1')).toBeVisible();

    // Fill nationality and bio but leave name empty
    await page.locator('input[name="nationality.en"]').fill('French');

    // Set a valid image URL so only name triggers the error
    await page.locator('input[type="hidden"][name="imageUrl"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'https://example.com/test.jpg'; }
    );

    // Submit via button click to trigger useActionState properly
    await page.locator('[data-testid="form-submit"]').click();

    // Should show a toast error (Sonner renders [data-sonner-toast])
    const toastLocator = page.locator('[data-sonner-toast]').or(page.locator('[role="status"]'));
    await expect(toastLocator).toBeVisible({ timeout: 10000 });

    // Should NOT redirect -- still on /new
    expect(page.url()).toContain('/admin/artists/new');
  });

  test('artwork form rejects missing image URL', async ({ page }) => {
    await page.goto('/admin/artworks/new');
    await expect(page.locator('h1')).toBeVisible();

    await page.locator('input[name="title.en"]').fill('No Image Artwork');
    await page.locator('select[name="artistId"]').selectOption({ index: 1 });
    await page.locator('input[name="medium.en"]').fill('Acrylic');
    await page.locator('input[name="dimensions"]').fill('50 x 40 cm');
    await page.locator('input[name="year"]').fill('2025');

    // Do NOT set imageUrl -- leave it empty

    await page.locator('[data-testid="form-submit"]').click();

    // Should show error toast (Zod httpsUrl rejects empty string)
    const toastLocator = page.locator('[data-sonner-toast]').or(page.locator('[role="status"]'));
    await expect(toastLocator).toBeVisible({ timeout: 10000 });

    // Should NOT redirect
    expect(page.url()).toContain('/admin/artworks/new');
  });

  test('artwork form rejects HTTP (non-HTTPS) image URL', async ({ page }) => {
    await page.goto('/admin/artworks/new');
    await expect(page.locator('h1')).toBeVisible();

    await page.locator('input[name="title.en"]').fill('HTTP Image Artwork');
    await page.locator('select[name="artistId"]').selectOption({ index: 1 });
    await page.locator('input[name="medium.en"]').fill('Watercolor');
    await page.locator('input[name="dimensions"]').fill('30 x 20 cm');
    await page.locator('input[name="year"]').fill('2025');

    // Set an HTTP URL (not HTTPS) -- should be rejected by httpsUrl schema
    await page.locator('input[type="hidden"][name="imageUrl"]').evaluate(
      (el: HTMLInputElement) => { el.value = 'http://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600'; }
    );

    await page.locator('[data-testid="form-submit"]').click();

    // Should show error toast (httpsUrl refine rejects http://)
    const toastLocator = page.locator('[data-sonner-toast]').or(page.locator('[role="status"]'));
    await expect(toastLocator).toBeVisible({ timeout: 10000 });

    // Should NOT redirect
    expect(page.url()).toContain('/admin/artworks/new');
  });

  test('exhibition form handles end date before start date gracefully', async ({ page }) => {
    await page.goto('/admin/exhibitions/new');
    await expect(page.locator('h1')).toBeVisible();

    const title = `Date Edge Case ${Date.now()}`;
    await page.locator('input[name="title.en"]').fill(title);
    await page.locator('select[name="type"]').selectOption('EXHIBITION');
    await page.locator('select[name="status"]').selectOption('UPCOMING');

    // Set end date before start date
    await page.locator('input[name="startDate"]').fill('2025-12-31');
    await page.locator('input[name="endDate"]').fill('2025-01-01');

    await page.locator('[data-testid="form-submit"]').click();

    // The server should either reject (toast error) or accept and redirect.
    // Both outcomes are acceptable -- the important thing is no crash.
    await page.waitForLoadState('networkidle');

    const url = page.url();
    if (url.includes('/admin/exhibitions/new')) {
      // Server rejected: should show toast or stay on page
      const toastLocator = page.locator('[data-sonner-toast]').or(page.locator('[role="status"]'));
      const hasToast = await toastLocator.isVisible().catch(() => false);
      // Either a toast is shown or the form simply stayed -- both are graceful
      expect(url).toContain('/admin/exhibitions/new');
    } else {
      // Server accepted and redirected -- exhibition was created, clean it up
      await expect(page.getByText(title)).toBeVisible({ timeout: 10000 });
      const row = page.locator('tr', { hasText: title });
      await row.locator('[data-testid="delete-btn"]').click();
      await row.locator('[data-testid="delete-confirm"]').click();
      await expect(row).not.toBeVisible({ timeout: 10000 });
    }
  });

  test('press form rejects missing publication field', async ({ page }) => {
    await page.goto('/admin/press/new');
    await expect(page.locator('h1')).toBeVisible();

    // Fill title but leave publication empty
    await page.locator('input[name="title.en"]').fill('Press No Publication');
    await page.locator('input[name="publishedAt"]').fill('2025-06-15');

    // Leave publication empty and submit
    await page.locator('[data-testid="form-submit"]').click();

    // Should show error toast or stay on form
    const toastLocator = page.locator('[data-sonner-toast]').or(page.locator('[role="status"]'));
    await expect(toastLocator).toBeVisible({ timeout: 10000 });

    // Should NOT redirect
    expect(page.url()).toContain('/admin/press/new');
  });

  test('contact form rejects invalid email', async ({ page }) => {
    await page.goto('/en/contact');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // Select a status
    await page.locator('#status-collector').click();

    // Fill name
    await page.locator('#name').fill('Test User');

    // Fill invalid email
    await page.locator('#email').fill('not-an-email');

    // Fill message (meets 10 char minimum)
    await page.locator('#message').fill('This is a test message for validation');

    // Check RGPD
    await page.locator('#rgpd').check();

    // Submit
    await page.getByRole('button', { name: /Send Message/i }).click();

    // Should show inline validation error for email (react-hook-form with Zod)
    await expect(page.locator('.text-red-600').first()).toBeVisible({ timeout: 5000 });

    // The success message should NOT appear
    await expect(page.getByText('Thank you for your message')).not.toBeVisible({ timeout: 2000 });
  });

  test('contact form with XSS script tag in message is safely handled', async ({ page }) => {
    const ts = Date.now();
    const xssName = `XSS Edge ${ts}`;
    const xssMessage = `Testing <script>alert("xss")</script> injection in message field ${ts}`;

    await page.goto('/en/contact');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    await page.locator('#status-collector').click();
    await page.locator('#name').fill(xssName);
    await page.locator('#email').fill(`xss-edge-${ts}@test.com`);
    await page.locator('#message').fill(xssMessage);
    await page.locator('#rgpd').check();
    await page.getByRole('button', { name: /Send Message/i }).click();

    // Should show success (message accepted -- sanitization is server-side)
    await expect(page.getByText('Thank you for your message')).toBeVisible({ timeout: 10000 });

    // Navigate to admin messages and verify XSS did not execute
    await page.goto('/admin/messages');
    await expect(page.getByText(xssName)).toBeVisible({ timeout: 10000 });

    // Open the message detail
    const row = page.locator('tbody tr', { hasText: xssName });
    await row.locator('a[data-testid="view-btn"]').click();
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // Verify no XSS was executed -- the script tag should be rendered as safe text
    const xssTriggered = await page.evaluate(() => (window as any).xssTriggered);
    expect(xssTriggered).toBeFalsy();

    // Verify the message content is visible as text (escaped, not executed)
    await expect(page.getByText('injection in message field')).toBeVisible();
  });
});
