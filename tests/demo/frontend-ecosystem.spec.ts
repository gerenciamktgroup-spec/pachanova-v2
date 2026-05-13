import { test, expect } from '@playwright/test';

test.describe('FRONT-4 Frontend Ecosystem Completion', () => {
  test.describe('Shell Duplication Check', () => {
    test('Investor Dashboard tiene un solo sidebar y header', async ({ page }) => {
      await page.goto('/dashboard/investor');
      await expect(page.locator('[data-testid="mission-sidebar"]')).toHaveCount(1);
      await expect(page.locator('header')).toHaveCount(1);
    });

    test('Admin Dashboard tiene un solo sidebar y header', async ({ page }) => {
      await page.goto('/dashboard/admin');
      await expect(page.locator('[data-testid="mission-sidebar"]')).toHaveCount(1);
      await expect(page.locator('header')).toHaveCount(1);
    });

    test('Fideicomiso Dashboard tiene un solo sidebar y header', async ({ page }) => {
      await page.goto('/dashboard/fideicomiso');
      await expect(page.locator('[data-testid="mission-sidebar"]')).toHaveCount(1);
      await expect(page.locator('header')).toHaveCount(1);
    });
  });

  test.describe('Carga de Subrutas Core', () => {
    const routes = [
      '/dashboard/investor/ledger',
      '/dashboard/investor/genesis',
      '/dashboard/investor/disclosures',
      '/dashboard/admin/users',
      '/dashboard/admin/audit',
      '/dashboard/admin/integrations',
      '/dashboard/admin/token-orders',
      '/dashboard/fideicomiso/operations',
      '/dashboard/fideicomiso/signatures',
      '/dashboard/fideicomiso/legal-backing',
      '/demo/scenarios',
      '/demo/legal'
    ];

    for (const route of routes) {
      test(`La ruta ${route} carga correctamente (200)`, async ({ page }) => {
        const response = await page.goto(route);
        expect(response?.status()).toBe(200);
        // Debe haber un layout con sidebar
        await expect(page.getByTestId("mission-sidebar")).toBeVisible();
      });
    }
  });

  test.describe('Comportamientos Visuales', () => {
    test('Map UI muestra Visualización 2D en vez de Engine Disabled', async ({ page }) => {
      await page.goto('/dashboard/investor');
      await expect(page.locator('text=Visualización 2D Demo')).toBeVisible();
      await expect(page.locator('text=Map UI Engine Disabled')).not.toBeVisible();
    });

    test('Botón de Simular Flujo muestra SafeActionButton activo o disabled', async ({ page }) => {
      await page.goto('/dashboard/investor');
      const actionBtn = page.locator('button', { hasText: 'Simular flujo Genesis' });
      await expect(actionBtn).toBeVisible();
    });
  });
});
