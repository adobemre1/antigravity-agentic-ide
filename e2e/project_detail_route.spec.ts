import { test, expect } from '@playwright/test';

test('project detail route works', async ({ page }) => {
  // Navigate to home to get a project id
  await page.goto('/');
  const firstCard = page.locator('[data-test-id="project-card"]').first();
  const href = await firstCard.getAttribute('href');
  const id = href?.split('/').pop() ?? '1';

  await page.goto(`/project/${id}`);
  // Verify title is visible
  await expect(page.locator('h1')).toBeVisible();
  // Verify similar projects section exists
  await expect(page.locator('text=Benzer Projeler')).toBeVisible();
});
