import { test, expect } from '@playwright/test';

test.describe('UX Orchestration E2E', () => {

  test('NextStepCard and JourneyProgressRail render correctly on Investor Dashboard', async ({ page }) => {
    await page.goto('/dashboard/investor');
    await expect(page.getByTestId('journey-progress-rail')).toBeVisible();
    await expect(page.getByTestId('next-step-card-investor')).toBeVisible();
  });

  test('NextStepCard and JourneyProgressRail render correctly on Admin Dashboard', async ({ page }) => {
    await page.goto('/dashboard/admin');
    await expect(page.getByTestId('journey-progress-rail')).toBeVisible();
    await expect(page.getByTestId('next-step-card-admin')).toBeVisible();
  });

  test('NextStepCard and JourneyProgressRail render correctly on Fideicomiso Dashboard', async ({ page }) => {
    await page.goto('/dashboard/fideicomiso');
    await expect(page.getByTestId('journey-progress-rail')).toBeVisible();
    await expect(page.getByTestId('next-step-card-fideicomiso')).toBeVisible();
  });

  test('Role Switcher and Guided Mode Toggle are visible in Header', async ({ page }) => {
    await page.goto('/demo/showcase');
    await expect(page.getByTestId('role-switcher')).toBeVisible();
    await expect(page.getByTestId('guided-mode-toggle')).toBeVisible();
  });

  test('InfoHint tooltips work on Landing Page', async ({ page }) => {
    await page.goto('/');
    const infoHints = page.locator('.lucide-info');
    await expect(infoHints.first()).toBeVisible();
  });

});
