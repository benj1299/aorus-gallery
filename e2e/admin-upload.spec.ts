import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

test.describe('Image Upload', () => {
  test('upload image via file input', async ({ page }) => {
    await page.goto('/admin/artists/new');

    // Create a minimal 1x1 red PNG for testing
    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      'base64'
    );
    const tmpPath = path.join(__dirname, 'test-image.png');
    fs.writeFileSync(tmpPath, pngBuffer);

    // Find the hidden file input inside image upload
    const fileInput = page.locator('input[type="file"][accept]');
    await fileInput.setInputFiles(tmpPath);

    // Wait for upload completion — hidden input should have a value
    await page.waitForFunction(() => {
      const input = document.querySelector('input[type="hidden"][name="imageUrl"]') as HTMLInputElement;
      return input && input.value.length > 0;
    }, { timeout: 15000 });

    const imageUrl = await page.locator('input[type="hidden"][name="imageUrl"]').inputValue();
    expect(imageUrl.length).toBeGreaterThan(10);

    // Clean up
    fs.unlinkSync(tmpPath);
  });

  test('set image via URL tab', async ({ page }) => {
    await page.goto('/admin/artists/new');

    // Click URL tab
    await page.getByText('URL').click();

    // Type a URL
    await page.locator('input[type="url"]').fill('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80');

    // Verify hidden input has the URL
    const val = await page.locator('input[type="hidden"][name="imageUrl"]').inputValue();
    expect(val).toContain('unsplash.com');
  });
});
