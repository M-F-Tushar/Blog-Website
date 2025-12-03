import { useState, useEffect } from 'react';
import { preloadImage } from '../utils/imageUtils';

/**
 * Hook for tracking image loading state
 */
export function useImageLoad(src: string) {
  const [state, setState] = useState(() => ({
    isLoading: !!src,
    isError: !src,
    isLoaded: false,
  }));

  useEffect(() => {
    if (!src) {
      return;
    }

    let cancelled = false;

    // Load image asynchronously
    const loadImage = async () => {
      try {
        await preloadImage(src);
        if (!cancelled) {
          setState({
            isLoading: false,
            isError: false,
            isLoaded: true,
          });
        }
      } catch {
        if (!cancelled) {
          setState({
            isLoading: false,
            isError: true,
            isLoaded: false,
          });
        }
      }
    };

    void loadImage();

    return () => {
      cancelled = true;
    };
  }, [src]);

  return state;
}
