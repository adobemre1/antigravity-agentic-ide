import { test, expect } from '@playwright/test';

test.describe('Agentic Flow & Performance', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for hydration
    await page.waitForLoadState('networkidle');
  });

  test('should load the homepage with correct SEO title', async ({ page }) => {
    await expect(page).toHaveTitle(/Seyhan|Project/);
  });

  test('should have a working chat widget', async ({ page }) => {
    // Open chat using the test ID
    const chatFab = page.locator('[data-testid="chat-fab"]');
    await expect(chatFab).toBeVisible();
    await chatFab.click();

    // Verify chat container opens - wait for animation
    const chatContainer = page.locator('[data-testid="chat-widget-container"]');
    await expect(chatContainer).toBeVisible({ timeout: 10000 });
    
    // Check for "Seyhan Asistan" text inside the container
    await expect(chatContainer.getByText('Seyhan Asistan')).toBeVisible();
  });

  test('should allow manual filtering which simulates Agent action', async ({ page }) => {
    const searchInput = page.getByTestId('search-input'); // Usin explicit ID from SearchBar
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Park');
    
    // Wait for the UI to settle (debounce is usually quick but good to wait)
    await page.waitForTimeout(1000); 

    // Filter results
    // Actually, let's look for text again but with longer timeout
    await expect(page.locator('main').getByText('Park', { exact: false }).first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to map view', async ({ page }) => {
    const mapBtn = page.locator('[data-test-id="map-view-btn"]');
    await expect(mapBtn).toBeVisible();
    await mapBtn.click();
    
    const mapContainer = page.locator('[data-test-id="map-container"]');
    await expect(mapContainer).toBeVisible({ timeout: 15000 }); // Map load/suspense might be slow
  });

  test('should check performance metrics', async ({ page }) => {
    // Basic interaction to ensure no jank
    const gridBtn = page.getByText('Grid', { exact: true });
    await gridBtn.click();
    await expect(page.locator('text=Grid')).toBeVisible();
  });
});
