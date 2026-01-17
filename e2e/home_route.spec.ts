import { test, expect } from '@playwright/test';

test('home route loads and shows project cards', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-test-id="home-header"]')).toHaveText('Seyhan Proje Portalı');
  const cards = page.locator('[data-test-id="project-card"]');
  await expect(cards.first()).toBeVisible();
});
