import { test, expect } from '@playwright/test';

test('search filters projects correctly', async ({ page }) => {
  await page.goto('/');
  const searchInput = page.locator('input[placeholder*="ara" i]');
  await expect(searchInput).toBeVisible();
  await searchInput.fill('AI-TRAFFIC');
  // Assuming project cards have data-test-id="project-card"
  const projectCards = page.locator('[data-test-id="project-card"]');
  await expect(projectCards).toHaveCount(1);
  await expect(projectCards.first()).toContainText('AI-TRAFFIC');
});
