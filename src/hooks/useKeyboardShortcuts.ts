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
        // Check if the key matches
        if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) {
          continue;
        }

        // Check modifier keys
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : true;
        const metaMatch = shortcut.metaKey ? event.metaKey : true;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : true;

        // If any modifier is specified, only trigger if exact match
        const hasModifier = shortcut.ctrlKey || shortcut.metaKey || shortcut.shiftKey;
        const modifiersMatch =
          hasModifier &&
          (shortcut.ctrlKey === event.ctrlKey || shortcut.metaKey === event.metaKey) &&
          (!shortcut.shiftKey || shortcut.shiftKey === event.shiftKey);

        if (hasModifier ? modifiersMatch : ctrlMatch && metaMatch && shiftMatch) {
          // For shortcuts with modifiers, don't check if in input
          // For shortcuts without modifiers, check if in input
          if (hasModifier || !isInput) {
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
