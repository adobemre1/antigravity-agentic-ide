import { test, expect } from '@playwright/test';

test.describe('Seyhan AI Widget', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('should toggle chat window', async ({ page }) => {
        // Find FAB and click
        // const fab = page.locator('button[layoutId="chat-fab"]'); // More specific selector if possible, or keep class
        // Use the one from the file if layoutId isn't reliable, but layoutId props aren't DOM attributes usually.
        // Let's stick to the class but wait for it.
        const fabButton = page.locator('button.rounded-full.shadow-lg').first();
        await expect(fabButton).toBeVisible();
        await fabButton.click();

        // Check if window opens
        const window = page.locator('div.border.shadow-2xl');
        await expect(window).toBeVisible();
        await expect(page.locator('text=Seyhan Asistan')).toBeVisible();

        // Close
        await page.click('button.p-1.hover\\:bg-white\\/20');
        await expect(window).not.toBeVisible();
    });

    test('should allow typing query', async ({ page }) => {
        await page.click('button.rounded-full.shadow-lg');
        
        const input = page.locator('input[placeholder="Bir soru sorun..."]');
        await input.fill('Parklar nerede?');
        await expect(input).toHaveValue('Parklar nerede?');
        
        const submitBtn = page.locator('button[type="submit"]');
        await expect(submitBtn).toBeEnabled();
    });
});
