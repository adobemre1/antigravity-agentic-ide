import { test, expect } from '@playwright/test';

test('homepage loads and displays core elements', async ({ page }) => {
  await page.goto('/');

  // Check title
  await expect(page).toHaveTitle(/Seyhan/i);

  // Check search input exists
  const searchInput = page.locator('input[placeholder*="ara" i]');
  await expect(searchInput).toBeVisible();

  // Check main headers
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
