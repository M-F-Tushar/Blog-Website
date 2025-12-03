import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface ReadingPosition {
  postId: string;
  scrollPercentage: number;
  lastRead: string;
  estimatedTimeLeft: number;
}

/**
 * Hook to save and restore reading position for a blog post
 * @param postId The unique identifier for the post
 * @returns Object with position data and control functions
 */
export function useReadingPosition(postId: string, totalWords: number = 0) {
  const [positions, setPositions] = useLocalStorage<Record<string, ReadingPosition>>(
    'reading-positions',
    {}
  );
  const [currentPosition, setCurrentPosition] = useState<ReadingPosition | null>(null);

  // Load position on mount - using useMemo to avoid synchronous setState in effect
  useEffect(() => {
    const position = positions[postId];
    if (!position) return;

    // Clean up old positions (older than 30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    // Defer state update to next tick to avoid synchronous setState
    const timer = setTimeout(() => {
      if (new Date(position.lastRead).getTime() < thirtyDaysAgo) {
        setPositions((prev) => {
          const newPositions = { ...prev };
          delete newPositions[postId];
          return newPositions;
        });
        setCurrentPosition(null);
      } else {
        setCurrentPosition(position);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [postId, positions, setPositions]);

  // Clear position function
  const clearPosition = useCallback(() => {
    setPositions((prev) => {
      const newPositions = { ...prev };
      delete newPositions[postId];
      return newPositions;
    });
    setCurrentPosition(null);
  }, [postId, setPositions]);

  // Calculate estimated time left
  const calculateTimeLeft = useCallback(
    (scrollPercentage: number): number => {
      if (!totalWords || scrollPercentage === 0) return 0;

      const WORDS_PER_MINUTE = 200;
      const scrollDecimal = scrollPercentage / 100;
      const wordsRemaining = Math.floor(totalWords * (1 - scrollDecimal));
      const minutesRemaining = Math.ceil(wordsRemaining / WORDS_PER_MINUTE);

      return minutesRemaining;
    },
    [totalWords]
  );

  // Save position
  const savePosition = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);

    // Only save if scrolled past 5% and before 95%
    if (scrollPercentage > 5 && scrollPercentage < 95) {
      const estimatedTimeLeft = calculateTimeLeft(scrollPercentage);

      const newPosition: ReadingPosition = {
        postId,
        scrollPercentage,
        lastRead: new Date().toISOString(),
        estimatedTimeLeft,
      };

      setPositions((prev) => ({
        ...prev,
        [postId]: newPosition,
      }));

      setCurrentPosition(newPosition);
    }
  }, [postId, setPositions, calculateTimeLeft]);

  // Restore position
  const restorePosition = useCallback(() => {
    const position = positions[postId];
    if (position) {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTo = (position.scrollPercentage / 100) * scrollHeight;

      window.scrollTo({
        top: scrollTo,
        behavior: 'smooth',
      });
    }
  }, [postId, positions]);

  // Auto-save on scroll (debounced)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        savePosition();
      }, 500); // Debounce 500ms
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [savePosition]);

  return {
    position: currentPosition,
    savePosition,
    restorePosition,
    clearPosition,
  };
}

export default useReadingPosition;
