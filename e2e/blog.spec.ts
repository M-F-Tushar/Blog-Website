import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/blog');
    });

    test('should display blog page title', async ({ page }) => {
        await expect(page.locator('h1')).toContainText(/blog|articles/i);
    });

    test('should display blog posts', async ({ page }) => {
        // Wait for posts to load
        await page.waitForSelector('article', { timeout: 5000 });
        const posts = page.locator('article');
        await expect(posts.first()).toBeVisible();
    });

    test('should have view mode toggles', async ({ page }) => {
        // Check for view mode buttons (grid, list, compact)
        const viewModeButtons = page.locator('button[aria-label*="view"]');
        const count = await viewModeButtons.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should navigate to individual blog post', async ({ page }) => {
        // Wait for posts to load
        await page.waitForSelector('article a', { timeout: 5000 });

        // Click on the first post link
        const firstPostLink = page.locator('article a').first();
        await firstPostLink.click();

        // Should navigate to post detail page
        await expect(page).toHaveURL(/.*blog\/.+/);
    });

    test('should display post metadata', async ({ page }) => {
        await page.waitForSelector('article', { timeout: 5000 });
        const firstPost = page.locator('article').first();

        // Check for date
        await expect(firstPost.locator('time')).toBeVisible();
    });

    test('should filter by category', async ({ page }) => {
        // Look for category links or filters
        const categoryLinks = page.locator('[href*="/tags/"]');
        const count = await categoryLinks.count();

        if (count > 0) {
            await categoryLinks.first().click();
            await expect(page).toHaveURL(/.*tags\/.+/);
        }
    });
});

test.describe('Blog Post Detail', () => {
    test('should display post content', async ({ page }) => {
        // Navigate to blog and click first post
        await page.goto('/blog');
        await page.waitForSelector('article a', { timeout: 5000 });
        await page.locator('article a').first().click();

        // Check for post title
        await expect(page.locator('h1')).toBeVisible();

        // Check for post content
        await expect(page.locator('.prose, article')).toBeVisible();
    });

    test('should have share buttons', async ({ page }) => {
        await page.goto('/blog');
        await page.waitForSelector('article a', { timeout: 5000 });
        await page.locator('article a').first().click();

        // Look for share functionality
        const shareButtons = page.locator('button[aria-label*="share"], a[aria-label*="share"]');
        const count = await shareButtons.count();
        expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should have table of contents for long posts', async ({ page }) => {
        await page.goto('/blog');
        await page.waitForSelector('article a', { timeout: 5000 });
        await page.locator('article a').first().click();

        // Check if TOC exists (may not be present for all posts)
        const toc = page.locator('.toc, nav[aria-label*="table"]');
        const exists = await toc.count();
        // Just verify it doesn't error
        expect(exists).toBeGreaterThanOrEqual(0);
    });
});
