import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display site title', async ({ page }) => {
        await expect(page.locator('header')).toContainText('Blog');
    });

    test('should have navigation menu', async ({ page }) => {
        await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Blog' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
    });

    test('should navigate to About page', async ({ page }) => {
        await page.getByRole('link', { name: 'About' }).click();
        await expect(page).toHaveURL(/.*about/);
    });

    test('should navigate to Blog page', async ({ page }) => {
        await page.getByRole('link', { name: 'Blog' }).click();
        await expect(page).toHaveURL(/.*blog/);
    });

    test('should have theme toggle', async ({ page }) => {
        const themeToggle = page.getByRole('button', { name: /toggle.*theme/i });
        await expect(themeToggle).toBeVisible();
    });

    test('should toggle dark mode', async ({ page }) => {
        const themeToggle = page.getByRole('button', { name: /toggle.*theme/i });
        await themeToggle.click();

        // Check if dark mode class is applied
        const html = page.locator('html');
        await expect(html).toHaveClass(/dark/);
    });

    test('should have search functionality', async ({ page }) => {
        const searchInput = page.getByRole('searchbox');
        await expect(searchInput).toBeVisible();
    });

    test('should display hero section', async ({ page }) => {
        await expect(page.locator('h1, h2').first()).toBeVisible();
    });
});
