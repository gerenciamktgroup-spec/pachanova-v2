import { test, expect } from '@playwright/test';

test.describe('FRONT-3E.1 Real DB Workflow Actions E2E (No Mocks)', () => {
  // Estos tests dependen de la base de datos local y los servicios reales.
  // NO se utilizan page.route() mocks aquí.

  test.describe('Investor Workflows', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/investor');
    });

    test('Real Path: Simular flujo Genesis y registrar intento demo', async ({ page }) => {
      // 1. Ir a la nueva ruta guiada
      await page.goto('/dashboard/investor/genesis');
      await expect(page.getByTestId('genesis-flow-page')).toBeVisible({ timeout: 15000 });
      
      // 2. Paso 1: KYC
      const continueBtn = page.locator('button', { hasText: 'Continuar al Selector' });
      if (await continueBtn.isVisible()) {
        await continueBtn.click();
      }
      
      // 3. Paso 2: Selector
      const reviewBtn = page.locator('button', { hasText: 'Revisar Operación' });
      await expect(reviewBtn).toBeVisible({ timeout: 10000 });
      await reviewBtn.click();
      
      // 4. Paso 3: Review y Simulación
      const simulateBtn = page.getByTestId('genesis-demo-submit');
      await expect(simulateBtn).toBeVisible({ timeout: 10000 });
      
      if (await simulateBtn.isEnabled()) {
        await simulateBtn.click();
        
        // 5. Paso 4: Success
        await expect(page.getByTestId('genesis-demo-success')).toBeVisible({ timeout: 15000 });
      }
    });
  });

  test.describe('Admin Workflows', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/admin');
    });

    test('Real Path: Abrir UserDetailDrawer y Marcar para revisión', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await expect(page.getByTestId('admin-users-grid')).toBeVisible({ timeout: 15000 });
      
      const emptyState = page.locator('text=Sin usuarios');
      if (await emptyState.isVisible()) return;

      const detallesBtn = page.getByTestId('admin-users-grid').locator('button', { hasText: 'Detalles' }).first();
      await expect(detallesBtn).toBeVisible();
      // Wait for any animations
      await page.waitForTimeout(500);
      await detallesBtn.click();
      
      // 3. UserDetailDrawer opens, click "Marcar para revisión demo"
      const reviewBtn = page.getByTestId('admin-user-review-action');
      await expect(reviewBtn).toBeVisible({ timeout: 10000 });
      // Wait for drawer to animate in
      await page.waitForTimeout(500);
      await reviewBtn.click();
      
      // 4. Expect success
      await expect(page.locator('text=Revisión Registrada').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Fideicomiso Workflows', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/fideicomiso');
    });

  });
});
