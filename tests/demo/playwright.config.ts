import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.demo.local' });
dotenv.config({ path: '.env.local' });
process.env.DEMO_MODE = 'true';

const baseURL = process.env.DEMO_BASE_URL || 'http://localhost:3004';
const port = baseURL.split(':').pop() || '3004';

export default defineConfig({
  testDir: './',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `pnpm --filter web start -p ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    env: {
      DEMO_MODE: 'true',
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://pachanova_demo:pachanova_demo@localhost:5433/pachanova_demo',
    }
  },
});
