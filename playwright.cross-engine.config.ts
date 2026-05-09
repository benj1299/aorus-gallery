// Cross-engine Playwright config — owned by /tester:cross-engine.
// SEPARATE from the main playwright.config.ts (which handles e2e admin auth flows)
// to avoid coupling cross-engine matrix runs with auth setup or custom webServer.

import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'https://www.orusgallery.com';
const isProduction = !baseURL.includes('localhost');

export default defineConfig({
  // Generated runner lives under .tests/, separate from e2e/
  testDir: '.tests',
  testMatch: /cross-engine-runner\.spec\.ts$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0, // No retries — cross-engine flake should be diagnosed, not masked
  workers: process.env.CI ? 2 : 4,
  reporter: [['list'], ['json', { outputFile: process.env.PLAYWRIGHT_JSON_OUTPUT_NAME || '.tests/cross-engine-playwright.json' }]],
  // Keep failure artifacts (traces, error screenshots) inside our managed area
  // so step 04's rolling-window cleanup can prune them with the rest.
  // Without this override, Playwright would write to ./test-results/ at project root.
  outputDir: '.tests/cross-engine-diffs/.test-results',
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  // No webServer — cross-engine runs against external URL by default.
  // Override BASE_URL=http://localhost:3000 for local runs after `pnpm dev`.
});
