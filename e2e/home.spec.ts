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
        const themeToggle = page.getByRole('button', { name: /toggle theme/i });
        await expect(themeToggle).toBeVisible();
    });

    test('should toggle dark mode', async ({ page }) => {
        const themeToggle = page.getByRole('button', { name: /toggle theme/i });
        const html = page.locator('html');
        const before = await html.getAttribute('class');
        await themeToggle.click();

        const after = await html.getAttribute('class');
        expect(Boolean(before?.includes('dark'))).not.toBe(Boolean(after?.includes('dark')));
    });

    test('should show search entrypoint in header', async ({ page }) => {
        const searchLink = page.getByRole('link', { name: /open search page/i });
        await expect(searchLink).toBeVisible();
    });

    test('should display hero section', async ({ page }) => {
        await expect(page.locator('h1, h2').first()).toBeVisible();
    });
});
