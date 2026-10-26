import { defineConfig } from '@playwright/test';

const onCi = !!process.env['CI'];

// The frontend is served by `ng serve` and proxies /api and /actuator to the backend on 8080.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: onCi,
  retries: onCi ? 1 : 0,
  reporter: onCi ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: process.env['E2E_BASE_URL'] ?? 'http://localhost:4200',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } } },
  ],
});
