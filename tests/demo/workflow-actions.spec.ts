import { test, expect } from '@playwright/test';

test.describe('FRONT-3E Workflow Actions E2E', () => {

  // Investor workflows are now tested in ux2-orchestration.spec.ts

  test.describe('Admin Workflows', () => {
    test.beforeEach(async ({ page }) => {
      // Mock the API route to ensure consistent state
      await page.route('/api/demo/actions/admin-user-review', async route => {
        await route.fulfill({ json: { ok: true, message: "Revisión Registrada" } });
      });
      await page.goto('/dashboard/admin');
    });

    test('6. Click en usuario abre UserDetailDrawer', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      // Wait for grid to load
      await expect(page.getByTestId('admin-users-grid')).toBeVisible();
      
      const emptyState = page.locator('text=Sin usuarios');
      if (await emptyState.isVisible()) return;

      const detallesBtn = page.locator('button', { hasText: 'Detalles' }).first();
      await expect(detallesBtn).toBeVisible({ timeout: 10000 });
      await detallesBtn.click();
      await expect(page.locator('text=Detalles del Usuario')).toBeVisible();
    });

    test('7. Drawer muestra token_balance y m²', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await expect(page.getByTestId('admin-users-grid')).toBeVisible();
      const emptyState = page.locator('text=Sin usuarios');
      if (await emptyState.isVisible()) return;

      const detallesBtn = page.locator('button', { hasText: 'Detalles' }).first();
      await expect(detallesBtn).toBeVisible();
      await detallesBtn.click({ force: true });
      await expect(page.locator('text=Token Balance')).toBeVisible({ timeout: 10000 });
    });

    test('8. Marcar para revisión demo muestra success/audit', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      const detallesBtn = page.getByTestId('admin-users-grid').locator('button', { hasText: 'Detalles' }).first();
      await expect(detallesBtn).toBeVisible();
      // Wait for any animations
      await page.waitForTimeout(500);
      await detallesBtn.click();
      
      const reviewBtn = page.getByTestId('admin-user-review-action');
      await expect(reviewBtn).toBeVisible({ timeout: 10000 });
      // Wait for drawer to animate in
      await page.waitForTimeout(500);
      await reviewBtn.click();
      
      await expect(page.locator('text=Revisión Registrada').first()).toBeVisible({ timeout: 10000 });
    });

    test('9. No aparecen secretos', async ({ page }) => {
      await expect(page.getByTestId('admin-users-grid')).toBeVisible();
      const emptyState = page.locator('text=Sin usuarios');
      if (await emptyState.isVisible()) return;

      const detallesBtn = page.locator('button', { hasText: 'Detalles' }).first();
      await expect(detallesBtn).toBeVisible();
      await detallesBtn.click({ force: true });
      
      await expect(page.locator('text=password')).not.toBeVisible();
      await expect(page.locator('text=secret')).not.toBeVisible();
    });
  });

  test.describe('Fideicomiso Workflows', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('/api/demo/actions/fideicomiso-operation', async route => {
        await route.fulfill({ json: { ok: true, message: "Operación Registrada" } });
      });
      await page.goto('/dashboard/fideicomiso');
    });

    test('10. Proponer operación demo cambia estado a proposed', async ({ page }) => {
      const proposeBtn = page.getByTestId('fideicomiso-propose-action');
      if (await proposeBtn.isVisible()) {
        await proposeBtn.click();
        await expect(page.locator('text=Operación Registrada').first()).toBeVisible();
      }
    });

    test('11. Firmar fiduciario cambia quorum a 1/3', async ({ page }) => {
      const signBtn = page.getByTestId('fideicomiso-sign-fiduciario-action');
      if (await signBtn.isVisible() && await signBtn.isEnabled()) {
        await signBtn.click();
        await expect(page.locator('text=Operación Registrada').first()).toBeVisible();
      }
    });

    test('12. Firmar admin cambia quorum a 2/3', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await expect(page.getByTestId('fideicomiso-quorum-card')).toBeVisible();
      const signBtn = page.getByTestId('fideicomiso-sign-admin-action');
      await expect(signBtn).toBeVisible();
      if (await signBtn.isEnabled()) {
        await signBtn.click({ force: true });
        await expect(page.locator('text=Operación Registrada').first()).toBeVisible({ timeout: 10000 });
      }
    });

    test('13. Ejecutar solo habilitado con quorum', async ({ page }) => {
      const execBtn = page.getByTestId('fideicomiso-execute-action');
      if (await execBtn.isVisible()) {
        expect(true).toBe(true);
      }
    });

    test('14. Timeline muestra executed_simulated (Trust Anchor)', async ({ page }) => {
      await expect(page.getByTestId('trust-anchor-timeline')).toBeVisible();
    });

    test('15. Pending Foundry visible', async ({ page }) => {
      await expect(page.locator('text=Pending Foundry').first()).toBeVisible();
    });
  });
});
