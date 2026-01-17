import { test, expect } from '@playwright/test';

test.describe('Authentication Feature', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should open login modal when clicking Login', async ({ page }) => {
        // Wait for page hydration
        await page.waitForTimeout(1000);
        await page.click('text=Giriş Yap');
        // Wait for modal animation
        await page.waitForTimeout(1000);
        await expect(page.locator('text=Seyhan Portalı')).toBeVisible();
        await expect(page.locator('text=e-Devlet ile Giriş Yap')).toBeVisible();
    });

    test('should login with E-Devlet simulation', async ({ page }) => {
        await page.waitForTimeout(1000);
        await page.click('text=Giriş Yap');
        await page.waitForTimeout(500);
        await page.click('text=e-Devlet ile Giriş Yap');

        // Should close modal and show Avatar
        await expect(page.locator('text=Seyhan Portalı')).not.toBeVisible();
        
        // Wait for auth state update and animation
        await page.waitForTimeout(2000); 
        
        // Check for Avatar image in Navbar
        const avatar = page.locator('header img.rounded-full');
        await expect(avatar).toBeVisible();
    });

    test('should navigate to profile page', async ({ page }) => {
        // Login first
        await page.waitForTimeout(1000);
        await page.click('text=Giriş Yap');
        await page.waitForTimeout(500);
        await page.click('text=e-Devlet ile Giriş Yap');
        await page.waitForTimeout(2000);

        // Open Dropdown
        await page.locator('header img.rounded-full').click();
        await page.waitForTimeout(500);
        
        // Click Profile link
        await page.click('text=Profilim');
        
        // Check Profile Page content
        await expect(page).toHaveURL('/profile');
        await expect(page.locator('h1', { hasText: 'Seyhanlı Vatandaş' })).toBeVisible({ timeout: 10000 });
        await expect(page.locator('text=e-Devlet Onaylı')).toBeVisible();
    });

    test('should logout successfully', async ({ page }) => {
        // Login first
        await page.waitForTimeout(1000);
        await page.click('text=Giriş Yap');
        await page.waitForTimeout(500);
        await page.click('text=e-Devlet ile Giriş Yap');
        await page.waitForTimeout(2000);

        // Open Dropdown
        await page.locator('header img.rounded-full').click();
        await page.waitForTimeout(500);
        
        // Click Logout
        await page.locator('text=Çıkış Yap').click();
        await page.waitForTimeout(1000);

        // Should return to guest state
        await expect(page.locator('text=Giriş Yap')).toBeVisible();
        await expect(page.locator('header img.rounded-full')).not.toBeVisible();
    });
});
