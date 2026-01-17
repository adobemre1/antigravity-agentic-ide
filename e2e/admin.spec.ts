import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {

  test('should redirect unauthenticated users', async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/admin');
    await expect(page).toHaveURL('/');
  });

  test('should allow access to admin user', async ({ page }) => {
    // Mock Admin Login
    await page.addInitScript(() => {
        localStorage.setItem('seyhan_auth_user', JSON.stringify({
            id: 'admin_1',
            name: 'Admin User',
            email: 'admin@seyhan.bel.tr',
            role: 'admin',
            avatar: 'https://cdn.edevlet.gov.tr/img/turkiye-gov-tr-icon.svg'
        }));
    });
    
    await page.goto('/admin');
    await expect(page).toHaveURL('/admin');
    await expect(page.locator('text=Seyhan Admin')).toBeVisible();
    await expect(page.locator('text=Toplam Proje')).toBeVisible();
  });

  test('should navigate to projects table and filter', async ({ page }) => {
    // Mock Admin Login
    await page.addInitScript(() => {
        localStorage.setItem('seyhan_auth_user', JSON.stringify({
            id: 'admin_1',
            name: 'Admin User',
            email: 'admin@seyhan.bel.tr',
            role: 'admin',
            avatar: 'https://cdn.edevlet.gov.tr/img/turkiye-gov-tr-icon.svg'
        }));
    });

    await page.goto('/admin');
    
    // Click Sidebar link
    await page.click('text=Projeler');
    await expect(page).toHaveURL('/admin/projects');
    
    // Verify Table Headers
    await expect(page.locator('text=Başlık & Açıklama')).toBeVisible();
    
    // Test Filter
    const searchInput = page.locator('input[placeholder="Proje ara..."]');
    await searchInput.fill('Seyhan');
    await page.waitForTimeout(500);
    
    // Check if rows still exist
    const rows = page.locator('tbody tr');
    expect(await rows.count()).toBeGreaterThan(0);
  });
});
