import { useRef, useEffect, RefObject } from 'react';

/**
 * Hook to return focus to the trigger element when a modal closes
 * @param isOpen Whether the modal/drawer is currently open
 * @returns Ref to attach to the trigger element
 */
export function useFocusReturn<T extends HTMLElement>(isOpen: boolean): RefObject<T> {
  const triggerRef = useRef<T>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element when opening
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
    } else {
      // Return focus when closing
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
        previouslyFocusedElement.current = null;
      }
    }
  }, [isOpen]);

  return triggerRef;
}

export default useFocusReturn;
