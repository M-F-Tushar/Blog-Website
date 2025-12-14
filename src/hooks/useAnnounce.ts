import React, { useState, useCallback } from 'react';
import { LiveRegionPoliteness } from '../components/common/LiveRegion';

interface AnnounceOptions {
  politeness?: LiveRegionPoliteness;
  timeout?: number;
}

interface AnnouncementState {
  message: string;
  politeness: LiveRegionPoliteness;
}

/**
 * Hook for announcing messages to screen readers via live regions
 *
 * @example
 * const { announce, announcement } = useAnnounce();
 *
 * // Announce a message
 * announce('Form submitted successfully', { politeness: 'assertive' });
 *
 * // Render the live region
 * <LiveRegion message={announcement.message} politeness={announcement.politeness} />
 */
export const useAnnounce = () => {
  const [announcement, setAnnouncement] = useState<AnnouncementState>({
    message: '',
    politeness: 'polite',
  });

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const announce = useCallback((message: string, options: AnnounceOptions = {}) => {
    const { politeness = 'polite', timeout = 5000 } = options;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setAnnouncement({
      message,
      politeness,
    });

    // Auto-clear the announcement after timeout
    if (timeout > 0) {
      timeoutRef.current = setTimeout(() => {
        setAnnouncement({
          message: '',
          politeness: 'polite',
        });
        timeoutRef.current = null;
      }, timeout);
    }
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const clearAnnouncement = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setAnnouncement({
      message: '',
      politeness: 'polite',
    });
  }, []);

  return {
    announce,
    clearAnnouncement,
    announcement,
  };
};

export default useAnnounce;
