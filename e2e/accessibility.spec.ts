import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('Home page should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Blog page should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('About page should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Contact page should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test.describe('Keyboard Navigation', () => {
    test('Skip links should be accessible and functional', async ({ page }) => {
      await page.goto('/');

      // Tab to skip link
      await page.keyboard.press('Tab');

      // Check if skip link is focused
      const skipLink = page.locator('a[href="#main-content"]').first();
      await expect(skipLink).toBeFocused();

      // Press Enter to activate skip link
      await page.keyboard.press('Enter');

      // Verify main content is in view
      const mainContent = page.locator('#main-content');
      await expect(mainContent).toBeInViewport();
    });

    test('All interactive elements should be keyboard accessible', async ({ page }) => {
      await page.goto('/blog');
      await page.waitForLoadState('networkidle');

      // Tab through interactive elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Verify focus is on an interactive element
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.tagName;
      });

      expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
    });

    test('Navigation menu should be keyboard navigable', async ({ page }) => {
      await page.goto('/');

      // Focus on first navigation link
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const navLink = page.locator('nav a').first();

      // Press Enter to navigate
      await navLink.press('Enter');

      // Verify navigation occurred
      await expect(page).toHaveURL(/\//);
    });
  });

  test.describe('Focus Management', () => {
    test('Focus should be visible when using keyboard', async ({ page }) => {
      await page.goto('/');

      // Tab to trigger focus
      await page.keyboard.press('Tab');

      // Check if focus styles are applied
      const focusedElement = page.locator(':focus-visible');
      await expect(focusedElement).toBeVisible();
    });

    test('Focus should return to trigger after modal closes', async ({ page }) => {
      await page.goto('/');

      // This test would be implemented when modals are present
      // For now, we skip it
      test.skip();
    });
  });

  test.describe('Screen Reader Support', () => {
    test('Page should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check for h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);

      // Verify headings are in order
      const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (elements) =>
        elements.map((el) => parseInt(el.tagName.charAt(1)))
      );

      // Check if headings follow logical order (should not skip levels)
      for (let i = 1; i < headings.length; i++) {
        expect(headings[i] - headings[i - 1]).toBeLessThanOrEqual(1);
      }
    });

    test('Images should have alt text', async ({ page }) => {
      await page.goto('/blog');
      await page.waitForLoadState('networkidle');

      const images = await page.locator('img').all();

      for (const img of images) {
        const alt = await img.getAttribute('alt');
        // Alt can be empty string for decorative images, but attribute must exist
        expect(alt).not.toBeNull();
      }
    });

    test('Forms should have proper labels', async ({ page }) => {
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');

      const inputs = await page.locator('input, textarea, select').all();

      for (const input of inputs) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');

        // Each input should have an id with a matching label, or aria-label
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const labelExists = (await label.count()) > 0;

          expect(labelExists || ariaLabel || ariaLabelledBy).toBeTruthy();
        } else {
          expect(ariaLabel || ariaLabelledBy).toBeTruthy();
        }
      }
    });

    test('Links should have descriptive text', async ({ page }) => {
      await page.goto('/blog');
      await page.waitForLoadState('networkidle');

      const links = await page.locator('a').all();

      for (const link of links) {
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        const title = await link.getAttribute('title');

        // Link should have text content, aria-label, or title
        expect(text?.trim() || ariaLabel || title).toBeTruthy();

        // Avoid generic link text
        const genericTexts = ['click here', 'read more', 'here', 'link'];
        if (text && !ariaLabel && !title) {
          expect(genericTexts.includes(text.toLowerCase().trim())).toBeFalsy();
        }
      }
    });
  });

  test.describe('Color Contrast', () => {
    test('Text should have sufficient color contrast', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .include('body')
        .analyze();

      // Check specifically for color-contrast violations
      const contrastViolations = accessibilityScanResults.violations.filter(
        (violation) => violation.id === 'color-contrast'
      );

      expect(contrastViolations).toEqual([]);
    });
  });

  test.describe('Responsive and Zoom', () => {
    test('Page should be usable at 200% zoom', async ({ page }) => {
      await page.goto('/');

      // Set zoom to 200%
      await page.evaluate(() => {
        document.body.style.zoom = '2';
      });

      await page.waitForLoadState('networkidle');

      // Check if main content is still visible
      const mainContent = page.locator('#main-content');
      await expect(mainContent).toBeVisible();

      // Reset zoom
      await page.evaluate(() => {
        document.body.style.zoom = '1';
      });
    });
  });
});
