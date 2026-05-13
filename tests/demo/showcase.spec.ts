import { test, expect } from '@playwright/test';

test.describe('Release Candidate Showcase E2E', () => {

  test.beforeEach(async ({ page }) => {
    // Forzar entorno offline sin variables reales
    await page.route('/api/demo/integrations', async route => {
      const json = {
        success: true,
        matrix: {
          payments: { status: 'PENDING_CREDENTIALS', provider: 'mercadopago_sandbox', externalEnabled: true, simulated: false },
          contracts: { status: 'PENDING_FOUNDRY', provider: 'demo', externalEnabled: false, simulated: true }
        }
      };
      await route.fulfill({ json });
    });
  });

  test('1. /demo/showcase carga', async ({ page }) => {
    await page.goto('/demo/showcase');
    await expect(page.getByTestId('demo-showcase-page')).toBeVisible();
    await expect(page.getByTestId('showcase-hero')).toBeVisible();
  });

  test('2. /demo/operator muestra Panel', async ({ page }) => {
    await page.goto('/demo/operator');
    await expect(page.getByTestId('demo-operator-page')).toBeVisible();
    await expect(page.getByTestId('operator-command-list')).toBeVisible();
  });

  test('3. /demo/reports carga sin secretos', async ({ page }) => {
    await page.goto('/demo/reports');
    await expect(page.getByTestId('demo-reports-page')).toBeVisible();
    
    const content = await page.content();
    expect(content).not.toContain('APP_USR-');
    expect(content).not.toContain('TEST_');
    expect(content).not.toContain('sk_live');
  });

  test('4. /demo/integrations muestra matrix sin leaks', async ({ page }) => {
    await page.goto('/demo/integrations');
    await expect(page.getByTestId('demo-integrations-page')).toBeVisible();
    await expect(page.getByTestId('integration-card-payments')).toBeVisible();

    const content = await page.content();
    expect(content).not.toContain('APP_USR-');
    expect(content).not.toContain('sk_live');
  });
});
