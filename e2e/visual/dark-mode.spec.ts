import { test, expect } from '@playwright/test';

test.describe('Dark Mode Visual Regression', () => {
    test('should match homepage in dark mode', async ({ page }) => {
        await page.goto('/');

        // Toggle dark mode
        const themeToggle = page.getByRole('button', { name: /toggle.*theme/i });
        await themeToggle.click();
        await page.waitForTimeout(500); // Wait for transition

        await expect(page).toHaveScreenshot('homepage-dark.png', {
            fullPage: true,
            animations: 'disabled',
        });
    });

    test('should match blog page in dark mode', async ({ page }) => {
        await page.goto('/blog');
        await page.waitForSelector('article', { timeout: 5000 });

        // Toggle dark mode
        const themeToggle = page.getByRole('button', { name: /toggle.*theme/i });
        await themeToggle.click();
        await page.waitForTimeout(500);

        await expect(page).toHaveScreenshot('blog-dark.png', {
            fullPage: true,
            animations: 'disabled',
        });
    });

    test('should match header in dark mode', async ({ page }) => {
        await page.goto('/');

        // Toggle dark mode
        const themeToggle = page.getByRole('button', { name: /toggle.*theme/i });
        await themeToggle.click();
        await page.waitForTimeout(500);

        const header = page.locator('header');
        await expect(header).toHaveScreenshot('header-dark.png');
    });
});
