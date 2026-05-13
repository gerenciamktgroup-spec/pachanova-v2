import { test, expect } from '@playwright/test';

test.describe('UX-2 Phase: Product Narrative & Genesis Clarity', () => {

  test('Landing page shows educational content', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('landing-how-to-read-demo')).toBeVisible();
    await expect(page.getByTestId('landing-what-is-simulated')).toBeVisible();
    await expect(page.getByTestId('landing-what-connects-later')).toBeVisible();
  });

  test('Public pages load successfully', async ({ page }) => {
    const pages = ['/como-funciona', '/preguntas-frecuentes'];
    for (const url of pages) {
      const response = await page.goto(url);
      expect(response?.status()).toBe(200);
    }
    
    await page.goto('/como-funciona');
    await expect(page.getByTestId('how-it-works-page')).toBeVisible();
    await expect(page.getByTestId('how-it-works-steps')).toBeVisible();

    await page.goto('/preguntas-frecuentes');
    await expect(page.getByTestId('faq-page')).toBeVisible();
    await expect(page.getByTestId('faq-accordion')).toBeVisible();
  });

  test('Genesis Flow simulates pedagogically', async ({ page }) => {
    // 1. Ir al panel inversor para encontrar el CTA
    await page.goto('/dashboard/investor');
    const genesisBtn = page.locator('text=Simular adquisición Genesis');
    await expect(genesisBtn).toBeVisible();
    
    // 2. Ir al flujo genesis
    await page.goto('/dashboard/investor/genesis');
    
    // Verificar que estamos en la página
    await expect(page.getByTestId('genesis-flow-page')).toBeVisible();
    
    // Validar estado KYC (Paso 1)
    await expect(page.getByTestId('genesis-step-profile')).toBeVisible();
    await page.locator('button:has-text("Continuar")').click();

    // Validar selector (Paso 2)
    await expect(page.getByTestId('genesis-step-quantity')).toBeVisible();
    await expect(page.getByTestId('genesis-step-token-math')).toBeVisible();
    await page.locator('button:has-text("Revisar")').click();

    // Validar Review (Paso 3)
    await expect(page.getByTestId('genesis-step-review')).toBeVisible();
    await expect(page.getByTestId('genesis-pending-credentials')).toBeVisible();
    
    await expect(page.locator('text=Comprar ahora')).toHaveCount(0);
    await expect(page.locator('text=Invertir')).toHaveCount(0);

    // Intentar simular
    const submitWrapper = page.getByTestId('genesis-demo-submit');
    const registrarBtn = submitWrapper.locator('button');
    await expect(registrarBtn).toBeVisible();
    await registrarBtn.click();

    // Esperar a la evidencia sandbox (Paso 4)
    await expect(page.getByTestId('genesis-step-demo-log')).toBeVisible();
    await expect(page.getByTestId('genesis-demo-success')).toBeVisible();
  });

  test('No external integrations exposed as production', async ({ page }) => {
    await page.goto('/demo/integrations');
    const mercadoPagoRow = page.getByTestId('integration-card-payments');
    await expect(mercadoPagoRow.getByTestId('pending-credentials-badge').or(mercadoPagoRow.getByTestId('integration-badge-SIMULATED'))).toBeVisible();
    
    const foundryRow = page.getByTestId('integration-card-contracts');
    await expect(foundryRow.getByTestId('pending-foundry-badge').or(foundryRow.getByTestId('integration-badge-SIMULATED'))).toBeVisible();
  });

});
