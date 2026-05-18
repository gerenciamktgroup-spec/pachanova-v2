import { test, expect } from '@playwright/test';

test.describe('Landing Institucional Pública (LANDING-2)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Carga inicial y Hero (HTTP 200 implícito)', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Tu primer metro cuadrado');
    await expect(page.locator('text=5 hectáreas').first()).toBeVisible();
  });

  test('DemoStatusRibbon y Disclaimers', async ({ page }) => {
    // Disclaimers Footer
    await expect(page.locator('text=Simulación de software')).toBeVisible();
    await expect(page.locator('text=no constituye oferta pública')).toBeVisible();
  });

  test('Métricas de San Bartolo', async ({ page }) => {
    await expect(page.getByTestId('landing-how-to-read-demo')).toBeVisible();
  });

  test('Navegación de CTAs', async ({ page }) => {
    // 1. Explorar el Demo -> /demo/start
    const exploreLink = page.locator('a:has-text("Explorar el Demo")').first();
    await expect(exploreLink).toHaveAttribute('href', '/demo/start');

    // 2. Ver Showcase -> /demo/showcase
    const showcaseLink = page.locator('a:has-text("Ver Showcase")').first();
    await expect(showcaseLink).toHaveAttribute('href', '/demo/showcase');

    // 3. Admin panel from roles -> /dashboard/admin
    const adminLink = page.locator('a[href="/dashboard/admin"]').first();
    await expect(adminLink).toBeVisible();

    // 4. Fideicomiso panel from roles -> /dashboard/fideicomiso
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
    expect(pageContent).not.toContain('token real');
    expect(pageContent).not.toContain('on-chain real');
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
    await expect(page.locator('text=Tu primer metro cuadrado')).toBeVisible();
    await expect(page.locator('text=Explorar el Demo').first()).toBeVisible();
    
    // Verificar que un contenedor principal no tenga overflow horizontal
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(390);
  });
});
