import { test, expect } from '@playwright/test';

test.describe.skip('Internationalization (i18n)', () => {
  test('should switch languages on home page', async ({ page }) => {
    // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    await page.goto('/');

    // Default is TR
    await expect(page.locator('h1')).toContainText('Seyhan Proje Portalı');
    await expect(page.locator('h2')).toContainText('Proje Bulundu');

    // Switch to EN
    await page.click('button:text("EN")');
    
    // Verify internal state
    await expect(page.locator('[data-test-id="current-lang"]')).toHaveText('en', { timeout: 10000 });

    // Verify changes
    await expect(page.locator('h1')).toContainText('Seyhan Project Portal');
    await expect(page.locator('h2')).toContainText('Projects Found');
    
    // Check footer
    await expect(page.locator('footer')).toContainText('All rights reserved');

    // Switch back to TR
    await page.click('button:text("TR")');
    await expect(page.locator('h1')).toContainText('Seyhan Proje Portalı');
  });

  test('should persist language selection across pages', async ({ page }) => {
    await page.goto('/');
    
    // Switch to EN
    await page.click('button:text("EN")');
    await expect(page.locator('h1')).toContainText('Seyhan Project Portal');

    // Navigate to project detail
    await page.click('[data-test-id="project-card"] >> nth=0');
    
    // Verify detail page is in EN
    await expect(page.locator('header h1')).not.toBeEmpty();
    // Check "Similar Projects" header
    await expect(page.locator('h2')).toContainText('Similar Projects');
    
    // Check categories (assuming first project has categories translated)
    // We can just check the "All" category if it was visible, but usually projects specific categories
    // For now, checking static text "Similar Projects" is good enough proof
  });
});
