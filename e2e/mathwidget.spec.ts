import { test, expect } from '@playwright/test';

test('MathWidget renders without errors', async ({ page }) => {
  await page.goto('/');
  // Assuming the MathWidget has a heading containing 'Math & Physics Engine'
  const widgetHeader = page.getByRole('heading', { name: /Math & Physics Engine/i });
  await expect(widgetHeader).toBeVisible();
});
