import { test, expect } from '@playwright/test';

test('homepage visual regression', async ({ page }) => {
  await page.goto('/');
  // Capture screenshot of the main container
  const container = page.locator('main');
  await expect(container).toHaveScreenshot('homepage.png', { maxDiffPixelRatio: 0.2 });
});
