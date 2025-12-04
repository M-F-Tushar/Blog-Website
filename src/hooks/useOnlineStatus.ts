import { useState, useEffect } from 'react';

/**
 * Hook to detect online/offline network status
 * @returns boolean indicating if the user is online
 */
export const useOnlineStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    // Handler for online event
    const handleOnline = () => {
      // eslint-disable-next-line no-console
      console.log('Network status: Online');
      setIsOnline(true);
    };

    // Handler for offline event
    const handleOffline = () => {
      // eslint-disable-next-line no-console
      console.log('Network status: Offline');
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
