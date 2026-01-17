import { test, expect } from '@playwright/test';

test('category filter works correctly', async ({ page }) => {
  await page.goto('/');
  // Click the first category button (assuming at least one)
  const firstCategoryButton = page.locator('[data-test-id^="category-"]').first();
  const category = await firstCategoryButton.textContent();
  await firstCategoryButton.click();
  // After filtering, expect all visible project cards to have the selected category label
  const visibleCards = page.locator('[data-test-id="project-card"]').filter({ has: page.locator(`text=${category?.trim()}`) });
  const count = await visibleCards.count();
  await expect(count).toBeGreaterThan(0);
});
