import { test, expect } from '@playwright/test';

test.describe('PWA Features', () => {

  test('should have a valid web app manifest', async ({ request }) => {
    const response = await request.get('/manifest.webmanifest');
    expect(response.status()).toBe(200);
    
    const manifest = await response.json();
    expect(manifest.name).toBe('Seyhan Proje Portalı');
    expect(manifest.display).toBe('standalone');
    expect(manifest.shortcuts.length).toBeGreaterThan(0);
  });

  test('should show install button when beforeinstallprompt fires', async ({ page }) => {
    await page.goto('/');
    
    // Initial state: hidden
    const installBtn = page.locator('button[title="Uygulamayı Yükle"]');
    await expect(installBtn).toBeHidden();

    // Trigger event manually
    await page.evaluate(() => {
        const event = new Event('beforeinstallprompt');
        // @ts-expect-error Polyfilling explicit event properties
        event.prompt = () => {};
        // @ts-expect-error Polyfilling explicit event properties
        event.userChoice = Promise.resolve({ outcome: 'accepted' });
        window.dispatchEvent(event);
    });

    // Should be visible now
    await expect(installBtn).toBeVisible();
    
    // Click it
    await installBtn.click();
    
    // Should hide after "installation"
    await expect(installBtn).toBeHidden();
  });
});
