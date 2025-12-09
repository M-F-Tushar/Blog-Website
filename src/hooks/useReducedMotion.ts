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
  // Use function initializer for SSR safety
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

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
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      mediaQuery.addListener(handleChange);
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
};

export default useReducedMotion;
