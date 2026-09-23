import { test, expect } from '@playwright/test';

test.describe('Aqua-X-Foul Critical Maritime Journey', () => {
  test('Complete Flow: Login -> Dashboard -> Fleet -> Search -> Vessel Details -> Projections', async ({ page }) => {
    // 1. Visit Login
    await page.goto('/login');
    await expect(page.getByText('Aqua-X-Foul')).toBeVisible();

    // 2. Perform Login
    await page.getByRole('button', { name: /Sign In to Dashboard|Use 1-Click/i }).first().click();

    // 3. Verify Dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByText(/Total Vessels/i)).toBeVisible();
    await expect(page.getByText('142')).toBeVisible();

    // 4. Navigate to Fleet
    await page.getByRole('link', { name: 'Fleet' }).click();
    await expect(page).toHaveURL(/.*fleet/);
    await expect(page.getByText(/Fleet & Vessel Directory/i)).toBeVisible();

    // 5. Search Vessel
    const searchInput = page.getByPlaceholderText(/Search by vessel name/i);
    await searchInput.fill('Ocean Pioneer');
    await expect(page.getByText('Ocean Pioneer')).toBeVisible();

    // 6. Select Vessel
    await page.getByText('Ocean Pioneer').first().click();
    await expect(page).toHaveURL(/.*vessels\/v-9876543/);
    await expect(page.getByText(/OCEAN PIONEER/i)).toBeVisible();

    // 7. Verify Projections Tab
    await page.getByRole('button', { name: 'Projections' }).click();
    await expect(page.getByText(/Optimal Cleaning Target/i)).toBeVisible();
    await expect(page.getByText(/Scenario A: No Cleaning/i)).toBeVisible();
  });
});
