import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const ARTIFACTS_DIR = path.join(process.cwd(), 'artifacts', 'frontend-final-qa');

test.beforeAll(() => {
  if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  }
});

test.describe('FRONT-3F Final Acceptance: Desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('Demo Showcase carga correctamente y captura screenshot', async ({ page }) => {
    await page.goto('/demo/showcase');
    await expect(page.getByTestId('demo-showcase-page')).toBeVisible();
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'demo-showcase-desktop.png'), fullPage: true });
  });

  test('Investor Dashboard carga y captura screenshot', async ({ page }) => {
    await page.goto('/dashboard/investor');
    await expect(page.getByTestId('pro-rata-land-card')).toBeVisible();
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'investor-dashboard-desktop.png'), fullPage: true });
    
    // Verifying ProRataLandCardV2 fallback
    await expect(page.locator('text=Visualización 2D Demo')).toBeVisible();
  });

  test('Admin Dashboard DataGrid y Captura', async ({ page }) => {
    await page.goto('/dashboard/admin');
    await expect(page.getByTestId('admin-users-grid')).toBeVisible();
    
    // Verifying DataGrid
    await expect(page.getByTestId('admin-users-grid')).toBeVisible();
    
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'admin-dashboard-desktop.png'), fullPage: true });
  });

  test('Fideicomiso Dashboard Quorum y Captura', async ({ page }) => {
    await page.goto('/dashboard/fideicomiso');
    await expect(page.getByTestId('fideicomiso-quorum-card')).toBeVisible();
    await expect(page.locator('text=Pending Foundry').first()).toBeVisible();
    
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'fideicomiso-dashboard-desktop.png'), fullPage: true });
  });

  test('Integrations check pending credentials y captura', async ({ page }) => {
    await page.goto('/demo/integrations');
    await expect(page.getByTestId('integration-status-pending-credentials')).toBeVisible();
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'demo-integrations-desktop.png'), fullPage: true });
  });
});

test.describe('FRONT-3F Final Acceptance: Mobile', () => {
  test.use({ viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1' });

  test('Demo Showcase (Mobile)', async ({ page }) => {
    await page.goto('/demo/showcase');
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'demo-showcase-mobile.png'), fullPage: true });
  });

  test('Investor Dashboard (Mobile)', async ({ page }) => {
    await page.goto('/dashboard/investor');
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'investor-dashboard-mobile.png'), fullPage: true });
  });
  
  test('Admin Dashboard (Mobile)', async ({ page }) => {
    await page.goto('/dashboard/admin');
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'admin-dashboard-mobile.png'), fullPage: true });
  });
});
