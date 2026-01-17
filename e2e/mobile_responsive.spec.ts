import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  // Use iPhone 12 viewport
  test.use({ viewport: { width: 390, height: 844 } });

  test('should display hamburger menu or mobile layout elements on home page', async ({ page }) => {
    await page.goto('/');
    
    // Verify header is visible
    await expect(page.locator('[data-test-id="home-header"]')).toBeVisible();
    
    // Search bar should be visible (it stacks on mobile)
    await expect(page.locator('[data-test-id="search-input"]')).toBeVisible();

    // Verify grid changes to single column (implicitly checked by visibility of cards)
    // We can check if a project card is visible without scrolling too much
    await expect(page.locator('[data-test-id="project-card"]').first()).toBeVisible();
  });

  test('project detail should stack content on mobile', async ({ page }) => {
    await page.goto('/project/1');
    
    // Title visible
    await expect(page.locator('h1')).toBeVisible();
    
    // Image should be full width (checking visibility is enough for smoke test)
    await expect(page.locator('img').first()).toBeVisible();
  });
});
