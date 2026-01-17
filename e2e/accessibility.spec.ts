import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => { 
  test('should not have any automatically detectable accessibility issues on home page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for content to load
    await page.waitForSelector('[data-test-id="home-header"]');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude('iframe') 
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility issues on project detail', async ({ page }) => {
    await page.goto('/project/1');
    await page.waitForSelector('h1');

    const results = await new AxeBuilder({ page }).analyze();
    if (results.violations.length > 0) {
      console.log('Project Detail Violations:', JSON.stringify(results.violations, null, 2));
    }
    expect(results.violations).toEqual([]);
  });
});
