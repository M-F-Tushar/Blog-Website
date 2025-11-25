import { test, expect } from '@playwright/test';

test.describe('Homepage Visual Regression', () => {
    test('should match homepage screenshot', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Take screenshot and compare
        await expect(page).toHaveScreenshot('homepage.png', {
            fullPage: true,
            animations: 'disabled',
        });
    });

    test('should match homepage hero section', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const hero = page.locator('section').first();
        await expect(hero).toHaveScreenshot('homepage-hero.png');
    });

    test('should match navigation header', async ({ page }) => {
        await page.goto('/');

        const header = page.locator('header');
        await expect(header).toHaveScreenshot('header.png');
    });
});
