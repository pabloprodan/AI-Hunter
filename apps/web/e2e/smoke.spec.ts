import { test, expect } from '@playwright/test';

test.describe('Smoke tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page).toHaveTitle(/AI Hunter/);
  });

  test('dashboard loads with kanban', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('discovered')).toBeVisible();
  });

  test('settings page loads with profile form', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByText('Freelancer Profile')).toBeVisible();
    await expect(page.getByText('React', { exact: true })).toBeVisible();
  });
});
