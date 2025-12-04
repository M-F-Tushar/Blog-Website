import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to detect keyboard vs mouse focus
 * Returns true when user is navigating with keyboard (focus should be visible)
 * Returns false when user is navigating with mouse (focus can be hidden)
 *
 * @example
 * const isFocusVisible = useFocusVisible();
 * <button className={isFocusVisible ? 'show-focus' : 'hide-focus'}>Click me</button>
 */
export const useFocusVisible = (): boolean => {
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Tab, arrow keys, and other navigation keys indicate keyboard usage
    if (e.key === 'Tab' || e.key.startsWith('Arrow')) {
      setIsFocusVisible(true);
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsFocusVisible(false);
  }, []);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    // Only hide focus for mouse, not for touch or pen
    if (e.pointerType === 'mouse') {
      setIsFocusVisible(false);
    }
  }, []);

  useEffect(() => {
    // Listen for keyboard navigation
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [handleKeyDown, handleMouseDown, handlePointerDown]);

  return isFocusVisible;
};

export default useFocusVisible;
