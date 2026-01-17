import { test, expect } from '@playwright/test';

test('project detail navigation works', async ({ page }) => {
  await page.goto('/');
  // Click first project card
  const firstCard = page.locator('[data-test-id="project-card"]').first();
  await firstCard.click();
  // Expect URL to contain /project/ (assuming route pattern)
  await expect(page).toHaveURL(/\/project\//);
  // Verify title appears on detail page
  const title = await page.locator('h1').first();
  await expect(title).toBeVisible();
});
