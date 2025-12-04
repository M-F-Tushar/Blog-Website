import { useState, useCallback } from 'react';
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

  const announce = useCallback((message: string, options: AnnounceOptions = {}) => {
    const { politeness = 'polite', timeout = 5000 } = options;

    setAnnouncement({
      message,
      politeness,
    });

    // Auto-clear the announcement after timeout
    if (timeout > 0) {
      setTimeout(() => {
        setAnnouncement({
          message: '',
          politeness: 'polite',
        });
      }, timeout);
    }
  }, []);

  const clearAnnouncement = useCallback(() => {
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
