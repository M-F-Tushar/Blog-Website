import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
  category?: string;
}

/**
 * Hook to register global keyboard shortcuts
 * @param shortcuts Array of keyboard shortcuts to register
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      for (const shortcut of shortcuts) {
        // Check if the key matches (with null safety)
        if (!shortcut.key || event.key.toLowerCase() !== shortcut.key.toLowerCase()) {
          continue;
        }

        // Check if modifiers match exactly
        const hasModifier = shortcut.ctrlKey || shortcut.metaKey || shortcut.shiftKey;

        // For shortcuts with modifiers, check exact match
        if (hasModifier) {
          const ctrlMatches = (shortcut.ctrlKey || false) === event.ctrlKey;
          const metaMatches = (shortcut.metaKey || false) === event.metaKey;
          const shiftMatches = (shortcut.shiftKey || false) === event.shiftKey;

          if (ctrlMatches && metaMatches && shiftMatches) {
            event.preventDefault();
            shortcut.action();
            break;
          }
        } else {
          // For shortcuts without modifiers, only trigger if no modifiers are pressed
          // and not in an input field
          if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !isInput) {
            event.preventDefault();
            shortcut.action();
            break;
          }
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export default useKeyboardShortcuts;
