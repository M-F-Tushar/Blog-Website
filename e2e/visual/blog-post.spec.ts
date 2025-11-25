import { test, expect } from '@playwright/test';

test.describe('Blog Post Visual Regression', () => {
    test('should match blog listing page', async ({ page }) => {
        await page.goto('/blog');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('article', { timeout: 5000 });

        await expect(page).toHaveScreenshot('blog-listing.png', {
            fullPage: true,
            animations: 'disabled',
        });
    });

    test('should match blog post detail page', async ({ page }) => {
        await page.goto('/blog');
        await page.waitForSelector('article a', { timeout: 5000 });
        await page.locator('article a').first().click();
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveScreenshot('blog-post-detail.png', {
            fullPage: true,
            animations: 'disabled',
        });
    });

    test('should match blog post content area', async ({ page }) => {
        await page.goto('/blog');
        await page.waitForSelector('article a', { timeout: 5000 });
        await page.locator('article a').first().click();
        await page.waitForLoadState('networkidle');

        const content = page.locator('.prose, article').first();
        await expect(content).toHaveScreenshot('blog-post-content.png');
    });
});
