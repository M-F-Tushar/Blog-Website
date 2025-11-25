import { useEffect, useRef } from 'react';

/**
 * Custom hook to trap focus within a container (e.g., modal dialogs)
 * @param isActive - Whether the focus trap is active
 * @returns Ref to attach to the container element
 */
export const useFocusTrap = <T extends HTMLElement>(isActive: boolean) => {
    const containerRef = useRef<T>(null);
    const previouslyFocusedElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!isActive || !containerRef.current) return;

        // Store the currently focused element
        previouslyFocusedElement.current = document.activeElement as HTMLElement;

        const container = containerRef.current;

        // Get all focusable elements
        const getFocusableElements = (): HTMLElement[] => {
            const selector = [
                'a[href]',
                'button:not([disabled])',
                'textarea:not([disabled])',
                'input:not([disabled])',
                'select:not([disabled])',
                '[tabindex]:not([tabindex="-1"])',
            ].join(',');

            return Array.from(container.querySelectorAll(selector));
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            const focusableElements = getFocusableElements();
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            // Shift + Tab
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            }
            // Tab
            else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        // Focus first element
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        // Add event listener
        container.addEventListener('keydown', handleKeyDown);

        // Cleanup
        return () => {
            container.removeEventListener('keydown', handleKeyDown);

            // Return focus to previously focused element
            if (previouslyFocusedElement.current) {
                previouslyFocusedElement.current.focus();
            }
        };
    }, [isActive]);

    return containerRef;
};

export default useFocusTrap;
