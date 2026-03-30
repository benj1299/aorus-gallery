import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';
const isProduction = !baseURL.includes('localhost');

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: isProduction ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'e2e/test-results.json' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    actionTimeout: isProduction ? 15000 : 5000,
    navigationTimeout: isProduction ? 30000 : 15000,
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/admin.json',
      },
      dependencies: ['setup'],
    },
  ],
  ...(isProduction ? {} : {
    webServer: {
      command: 'pnpm dev',
      url: 'http://localhost:3000',
      reuseExistingServer: true,
    },
  }),
});
