import { test, expect } from '@playwright/test';

test.describe('Landing Institucional Pública (LANDING-2)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Carga inicial y Hero (HTTP 200 implícito)', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('PachaNova: infraestructura para tokenizar activos inmobiliarios');
    await expect(page.locator('text=5 Hectáreas').first()).toBeVisible();
  });

  test('DemoStatusRibbon y Disclaimers', async ({ page }) => {
    // Disclaimers Footer
    await expect(page.locator('text=Es una demostración de software.')).toBeVisible();
    await expect(page.locator('text=No constituye oferta pública ni recomendación de inversión.')).toBeVisible();
  });

  test('Métricas de San Bartolo', async ({ page }) => {
    await expect(page.getByTestId('landing-how-to-read-demo')).toBeVisible();
  });

  test('Navegación de CTAs', async ({ page }) => {
    // 1. Ver cómo funciona -> /demo/business-flow
    const businessLink = page.locator('a:has-text("Ver cómo funciona")').first();
    await expect(businessLink).toHaveAttribute('href', '/demo/business-flow');

    // 2. Entrar al simulador -> /demo/showcase
    const showcaseLink = page.locator('a:has-text("Entrar al simulador")').first();
    await expect(showcaseLink).toHaveAttribute('href', '/demo/showcase');

    // 3. Explorar panel inversor -> /dashboard/investor
    const investorLink = page.locator('a:has-text("Explorar panel inversor")').first();
    await expect(investorLink).toHaveAttribute('href', '/dashboard/investor');

    // 4. Admin panel from roles -> /dashboard/admin
    const adminLink = page.locator('a[href="/dashboard/admin"]').first();
    await expect(adminLink).toBeVisible();

    // 5. Fideicomiso panel from roles -> /dashboard/fideicomiso
    const fideicomisoLink = page.locator('a[href="/dashboard/fideicomiso"]').first();
    await expect(fideicomisoLink).toBeVisible();
  });

  test('Compliance y Security Scan en el DOM', async ({ page }) => {
    const pageContent = await page.content();
    
    // Prohibited claims
    expect(pageContent).not.toContain('production-ready');
    expect(pageContent).not.toContain('listo para producción');
    expect(pageContent).not.toContain('mainnet');
    expect(pageContent).not.toContain('dinero real');
    expect(pageContent).not.toContain('real money');
    expect(pageContent).not.toContain('compra ahora');
    expect(pageContent).not.toContain('invierte ahora');
    expect(pageContent).not.toContain('paga ahora');
    expect(pageContent).not.toContain('token real');
    expect(pageContent).not.toContain('on-chain real');
    expect(pageContent).not.toContain('MercadoPago conectado');
    expect(pageContent).not.toContain('contratos conectados');
    expect(pageContent).not.toContain('rentabilidad garantizada');
    expect(pageContent).not.toContain('riesgo cero');
    expect(pageContent).not.toContain('inversión segura');

    // Prohibited secrets
    expect(pageContent).not.toContain('APP_USR');
    expect(pageContent).not.toContain('PRIVATE_KEY');
    expect(pageContent).not.toContain('cloudsql');
    expect(pageContent).not.toContain('neon.tech');
  });
});

test.describe('Landing Mobile Smoke Test', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('Carga correcta en Mobile y grilla responsiva', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=PachaNova: infraestructura para tokenizar activos inmobiliarios')).toBeVisible();
    await expect(page.locator('text=Entrar al simulador').first()).toBeVisible();
    
    // Verificar que un contenedor principal no tenga overflow horizontal
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(390);
  });
});
