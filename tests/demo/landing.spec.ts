import { test, expect } from '@playwright/test';

test.describe('Landing Institucional Pública (LANDING-2)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Carga inicial y Hero (HTTP 200 implícito)', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Tierra real.');
    await expect(page.locator('text=500.000 m²').first()).toBeVisible();
  });

  test('DemoStatusRibbon y Disclaimers', async ({ page }) => {
    // Disclaimers Footer
    await expect(page.locator('text=Esta web es informativa.')).toBeVisible();
  });

  test('Métricas de San Bartolo', async ({ page }) => {
    await expect(page.locator('text=500.000 m² de tierra')).toBeVisible();
  });

  test('Navegación de CTAs', async ({ page }) => {
    // 1. Explorar Demo 3D -> /demo/start
    const startDemoLink = page.locator('a:has-text("EXPLORAR DEMO 3D")').first();
    await expect(startDemoLink).toHaveAttribute('href', '/demo/start');

    // 2. Ver el activo -> #activo
    const activoLink = page.locator('a:has-text("Ver el activo")').first();
    await expect(activoLink).toHaveAttribute('href', '#activo');
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
    await expect(page.locator('h1')).toContainText('Tierra real.');
    await expect(page.locator('text=EXPLORAR DEMO 3D').first()).toBeVisible();
    
    // Verificar que un contenedor principal no tenga overflow horizontal
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(390);
  });
});
