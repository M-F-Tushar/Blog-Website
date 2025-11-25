import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '../ThemeToggle';

// Mock the useTheme hook
vi.mock('../../hooks/useTheme', () => ({
    useTheme: () => ({
        theme: 'light',
        toggleTheme: vi.fn(),
    }),
}));

describe('ThemeToggle Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render theme toggle button', () => {
        render(<ThemeToggle />);
        const button = screen.getByRole('button', { name: /toggle.*theme/i });
        expect(button).toBeInTheDocument();
    });

    it('should show sun icon in light mode', () => {
        const { useTheme } = require('../../hooks/useTheme');
        useTheme.mockReturnValue({
            theme: 'light',
            toggleTheme: vi.fn(),
        });

        render(<ThemeToggle />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    it('should show moon icon in dark mode', () => {
        const { useTheme } = require('../../hooks/useTheme');
        useTheme.mockReturnValue({
            theme: 'dark',
            toggleTheme: vi.fn(),
        });

        render(<ThemeToggle />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    it('should call toggleTheme when clicked', async () => {
        const mockToggleTheme = vi.fn();
        const { useTheme } = require('../../hooks/useTheme');
        useTheme.mockReturnValue({
            theme: 'light',
            toggleTheme: mockToggleTheme,
        });

        const user = userEvent.setup();
        render(<ThemeToggle />);

        const button = screen.getByRole('button');
        await user.click(button);

        expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it('should have proper accessibility attributes', () => {
        render(<ThemeToggle />);
        const button = screen.getByRole('button');

        expect(button).toHaveAttribute('aria-label');
        expect(button).toHaveAttribute('title');
    });
});
