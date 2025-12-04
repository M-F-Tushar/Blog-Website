import React, { useEffect, useRef } from 'react';

export type LiveRegionPoliteness = 'polite' | 'assertive' | 'off';

interface LiveRegionProps {
  /**
   * The message to announce to screen readers
   */
  message: string;
  /**
   * The politeness level for announcements
   * - 'polite': Wait for current speech to finish (default)
   * - 'assertive': Interrupt current speech
   * - 'off': Don't announce
   */
  politeness?: LiveRegionPoliteness;
  /**
   * Whether the message is about an atomic update
   */
  atomic?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * LiveRegion announces dynamic content changes to screen readers
 * Used for: search results count, form errors, loading states, etc.
 */
const LiveRegion: React.FC<LiveRegionProps> = ({
  message,
  politeness = 'polite',
  atomic = false,
  className = '',
}) => {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear and re-add message to ensure it's announced
    if (regionRef.current && message) {
      const region = regionRef.current;
      region.textContent = '';

      // Small delay to ensure screen readers pick up the change
      setTimeout(() => {
        region.textContent = message;
      }, 100);
    }
  }, [message]);

  return (
    <div
      ref={regionRef}
      role={politeness !== 'off' ? 'status' : undefined}
      aria-live={politeness}
      aria-atomic={atomic}
      className={`sr-only ${className}`}
    >
      {message}
    </div>
  );
};

export default LiveRegion;
