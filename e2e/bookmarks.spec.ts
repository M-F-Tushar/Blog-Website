import { test, expect } from '@playwright/test';

test.describe('Bookmarks', () => {
    test('should navigate to reading list page', async ({ page }) => {
        await page.goto('/');

        // Click on Reading List link in navigation
        const readingListLink = page.getByRole('link', { name: /reading list|bookmarks/i });
        await readingListLink.click();

        await expect(page).toHaveURL(/.*bookmarks/);
    });

    test('should display reading list page', async ({ page }) => {
        await page.goto('/bookmarks');

        // Should show page title
        await expect(page.locator('h1')).toContainText(/reading list|bookmarks/i);
    });

    test('should show empty state when no bookmarks', async ({ page }) => {
        // Clear localStorage to ensure no bookmarks
        await page.goto('/bookmarks');
        await page.evaluate(() => localStorage.clear());
        await page.reload();

        // Should show empty state
        await expect(page.locator('text=/no bookmarks|start saving/i')).toBeVisible();
    });

    test('should bookmark a post from blog page', async ({ page }) => {
        await page.goto('/blog');
        await page.waitForSelector('article', { timeout: 5000 });

        // Hover over first post to reveal bookmark button
        const firstPost = page.locator('article').first();
        await firstPost.hover();

        // Click bookmark button
        const bookmarkButton = firstPost.locator('button[aria-label*="bookmark"]');

        if (await bookmarkButton.count() > 0) {
            await bookmarkButton.click();

            // Navigate to reading list
            await page.goto('/bookmarks');

            // Should have at least one bookmarked post
            const posts = page.locator('article');
            await expect(posts.first()).toBeVisible();
        }
    });

    test('should remove bookmark', async ({ page }) => {
        await page.goto('/blog');
        await page.waitForSelector('article', { timeout: 5000 });

        // Bookmark a post
        const firstPost = page.locator('article').first();
        await firstPost.hover();

        const bookmarkButton = firstPost.locator('button[aria-label*="bookmark"]');

        if (await bookmarkButton.count() > 0) {
            // Add bookmark
            await bookmarkButton.click();

            // Remove bookmark
            await bookmarkButton.click();

            // Navigate to reading list
            await page.goto('/bookmarks');

            // Should show empty state or fewer posts
            const emptyState = page.locator('text=/no bookmarks/i');
            const hasEmptyState = await emptyState.count() > 0;

            expect(hasEmptyState).toBeTruthy();
        }
    });
});
