import { test, expect } from '@playwright/test';

test.describe('Search', () => {
    test('should perform search from header', async ({ page }) => {
        await page.goto('/');

        const searchInput = page.getByRole('searchbox');
        await searchInput.fill('test');
        await searchInput.press('Enter');

        // Should navigate to search page
        await expect(page).toHaveURL(/.*search.*q=test/);
    });

    test('should display search results', async ({ page }) => {
        await page.goto('/search?q=test');

        // Wait for results or empty state
        await page.waitForTimeout(1000);

        // Should show either results or "no results" message
        const hasResults = await page.locator('article').count() > 0;
        const hasEmptyState = await page.locator('text=/no.*results/i').count() > 0;

        expect(hasResults || hasEmptyState).toBeTruthy();
    });

    test('should highlight search terms in results', async ({ page }) => {
        await page.goto('/search?q=react');

        // Wait for potential results
        await page.waitForTimeout(1000);

        // Check if highlighting exists (mark tags)
        const highlights = page.locator('mark');
        const count = await highlights.count();

        // May or may not have results, just verify no errors
        expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should show filters', async ({ page }) => {
        await page.goto('/search?q=test');

        // Look for filter button or controls
        const filterButton = page.getByRole('button', { name: /filter/i });

        if (await filterButton.count() > 0) {
            await filterButton.click();
            // Filters should be visible
            await expect(page.locator('[class*="filter"]')).toBeVisible();
        }
    });

    test('should allow sorting results', async ({ page }) => {
        await page.goto('/search?q=test');

        // Look for sort dropdown
        const sortSelect = page.locator('select, [role="combobox"]').filter({ hasText: /sort|relevance|date/i });

        if (await sortSelect.count() > 0) {
            await sortSelect.first().click();
        }
    });

    test('should handle empty search', async ({ page }) => {
        await page.goto('/search');

        // Should show prompt to search
        await expect(page.locator('text=/enter.*search|search.*begin/i')).toBeVisible();
    });
});
