import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

/**
 * OfflineIndicator component displays a banner when the user is offline
 */
const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [wasOffline, setWasOffline] = React.useState(false);
  const [showReconnected, setShowReconnected] = React.useState(false);

  React.useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline && isOnline) {
      // Show "reconnected" message briefly
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-3 shadow-lg"
          role="alert"
          aria-live="assertive"
        >
          <div className="container mx-auto flex items-center justify-center gap-2">
            <WifiOff size={20} />
            <span className="font-medium">You are currently offline</span>
            <span className="text-sm opacity-90">• Some features may be unavailable</span>
          </div>
        </motion.div>
      )}
      {showReconnected && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white px-4 py-3 shadow-lg"
          role="alert"
          aria-live="polite"
        >
          <div className="container mx-auto flex items-center justify-center gap-2">
            <Wifi size={20} />
            <span className="font-medium">Back online!</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineIndicator;
