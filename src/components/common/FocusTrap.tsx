import React, { useEffect, useRef, RefObject } from 'react';

interface FocusTrapProps {
  active: boolean;
  children: React.ReactNode;
  returnFocus?: boolean;
  initialFocus?: RefObject<HTMLElement>;
}

/**
 * Component that traps focus within its children when active
 * Useful for modals, dialogs, and drawers
 */
const FocusTrap: React.FC<FocusTrapProps> = ({
  active,
  children,
  returnFocus = true,
  initialFocus,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;

    // Store the previously focused element
    if (returnFocus) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
    }

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

    // Focus initial element or first focusable element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      if (initialFocus?.current) {
        initialFocus.current.focus();
      } else {
        focusableElements[0].focus();
      }
    }

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

    // Add event listener
    container.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      container.removeEventListener('keydown', handleKeyDown);

      // Return focus to previously focused element
      if (returnFocus && previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [active, returnFocus, initialFocus]);

  return <div ref={containerRef}>{children}</div>;
};

export default FocusTrap;
