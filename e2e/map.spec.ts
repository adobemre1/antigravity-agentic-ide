import { test, expect } from '@playwright/test';

test.describe.skip('Interactive Map Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display map toggle and switch views', async ({ page }) => {
    const mapBtn = page.locator('[data-test-id="map-view-btn"]');
    await expect(mapBtn).toBeVisible();

    // Default view should be grid
    await expect(page.locator('[data-test-id="project-card"]').first()).toBeVisible();
    await expect(page.locator('[data-test-id="map-container"]')).not.toBeVisible();

    // Switch to Map
    // Add a small pause to ensure hydration/animation is settled
    await page.waitForTimeout(1000);
    await mapBtn.click();
    await page.waitForTimeout(2000); // Wait for transition
    
    // Check if button state changed (bg-primary indicates active)
    await expect(mapBtn).toHaveClass(/bg-primary/, { timeout: 5000 });

    await expect(page.locator('[data-test-id="map-container"]')).toBeVisible({ timeout: 15000 });
    
    // Check if Leaflet map is initialized
    await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 15000 });
    // Leaflet often adds this class to the localized container
    // Wait slightly for tiles to attempt loading or at least structure to be ready
    await page.waitForSelector('.leaflet-pane', { state: 'attached' });
  });

  test('should render markers on the map', async ({ page }) => {
    const mapBtn = page.locator('[data-test-id="map-view-btn"]');
    await mapBtn.click();
    
    await expect(page.locator('[data-test-id="map-container"]')).toBeVisible({ timeout: 10000 });

    // Wait for markers to appear
    // Leaflet renders markers as img tags with class leaflet-marker-icon
    const markers = page.locator('.leaflet-marker-icon');
    await expect(markers).toHaveCount(10, { timeout: 10000 });
  });

  test('click on marker should show popup', async ({ page }) => {
    const mapBtn = page.locator('[data-test-id="map-view-btn"]');
    await mapBtn.click();
    
    await expect(page.locator('[data-test-id="map-container"]')).toBeVisible({ timeout: 10000 });

    const firstMarker = page.locator('.leaflet-marker-icon').first();
    await firstMarker.click({ force: true }); // force click if obstructed by other map layers

    const popup = page.locator('.leaflet-popup-content');
    await expect(popup).toBeVisible({ timeout: 5000 });
    await expect(popup).toContainText('View Details');
  });
});
