import { test, expect } from '@playwright/test';

test.describe('Admin Flow E2E', () => {
  test('Master Admin can login and view users', async ({ page }) => {
    // 1. Navigate to login page
    await page.goto('http://localhost:3000/login');
    
    // 2. Login as Master Admin
    await page.fill('input[name="email"]', 'gerencia.mkrgroup@gmail.com');
    await page.fill('input[name="password"]', 'flavio0909A!');
    await page.click('button[type="submit"]');

    // 3. Verify successful redirection to dashboard or admin
    await page.waitForURL('**/dashboard**');
    
    // 4. Navigate to the Admin Users Management
    await page.goto('http://localhost:3000/dashboard/admin/users');
    
    // 5. Verify the Admin panel elements exist
    await expect(page.locator('text=Gestión de Empleados y Clientes')).toBeVisible();
    
    // 6. Verify that the table data loaded (there should be investors listed)
    const tableRows = page.locator('table tbody tr');
    await expect(tableRows).toHaveCountGreaterThan(0);
    
    // 7. Verify the presence of specific demo users
    await expect(page.locator('text=demo.investor.holder@pachanova.local')).toBeVisible();
  });
});
