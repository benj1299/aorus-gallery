import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

test.describe('Upload API Security', () => {
  test('rejects unauthenticated upload', async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();

    // Create a minimal valid PNG
    const pngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
    const tmpPath = path.join(__dirname, 'test-upload-security.png');
    fs.writeFileSync(tmpPath, pngBuffer);

    const response = await page.request.fetch('/api/upload', {
      method: 'POST',
      multipart: { file: { name: 'test.png', mimeType: 'image/png', buffer: pngBuffer } },
    });

    expect(response.status()).toBe(401);
    fs.unlinkSync(tmpPath);
    await context.close();
  });

  test('rejects non-image file', async ({ page }) => {
    // Create a text file with .png extension
    const textContent = Buffer.from('This is not an image');

    const response = await page.request.fetch('/api/upload', {
      method: 'POST',
      multipart: { file: { name: 'fake.png', mimeType: 'image/png', buffer: textContent } },
    });

    // Should be rejected (400 bad MIME or 422 corrupted)
    expect(response.status()).toBeGreaterThanOrEqual(400);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });

  test('rejects oversized file', async ({ page }) => {
    // Create a buffer > 10MB
    const bigBuffer = Buffer.alloc(11 * 1024 * 1024, 0);

    const response = await page.request.fetch('/api/upload', {
      method: 'POST',
      multipart: { file: { name: 'big.png', mimeType: 'image/png', buffer: bigBuffer } },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('lourd');
  });
});
