import { useState, useEffect } from 'react';

/**
 * Hook to detect if the user prefers reduced motion
 * Uses the prefers-reduced-motion media query
 *
 * @returns true if user prefers reduced motion, false otherwise
 *
 * @example
 * const prefersReducedMotion = useReducedMotion();
 * <motion.div animate={prefersReducedMotion ? {} : { scale: 1.2 }}>
 *   Content
 * </motion.div>
 */
export const useReducedMotion = (): boolean => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(mediaQuery.matches);

  useEffect(() => {
    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Older browsers (deprecated but still supported)
    else {
      // @ts-expect-error - addListener is deprecated but we keep for backwards compatibility
      mediaQuery.addListener(handleChange);
      // @ts-expect-error - removeListener is deprecated but we keep for backwards compatibility
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
};

export default useReducedMotion;
