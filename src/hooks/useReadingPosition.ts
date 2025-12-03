import { useState, useEffect, useCallback, useMemo } from 'react';
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
  // Derive current position from positions and postId
  const currentPosition = useMemo(() => {
    const position = positions[postId];
    if (!position) return null;

    // Check if position is expired (older than 30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    if (new Date(position.lastRead).getTime() < thirtyDaysAgo) {
      return null;
    }

    return position;
  }, [positions, postId]);

  // Clean up expired positions on mount
  useEffect(() => {
    const position = positions[postId];
    if (!position) return;

    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    if (new Date(position.lastRead).getTime() < thirtyDaysAgo) {
      // Remove expired position
      setPositions((prev) => {
        const newPositions = { ...prev };
        delete newPositions[postId];
        return newPositions;
      });
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clear position function
  const clearPosition = useCallback(() => {
    setPositions((prev) => {
      const newPositions = { ...prev };
      delete newPositions[postId];
      return newPositions;
    });
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
