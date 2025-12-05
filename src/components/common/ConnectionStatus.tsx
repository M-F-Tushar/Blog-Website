import React from 'react';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConnectionStatusProps {
  isConnected: boolean;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  serviceName?: string;
}

/**
 * ConnectionStatus component displays the connection status for a service
 * Shows loading, error, or success states
 */
const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isLoading = false,
  errorMessage = null,
  onRetry,
  serviceName = 'Service',
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm">
        <RefreshCw size={16} className="animate-spin" />
        <span>Connecting to {serviceName}...</span>
      </div>
    );
  }

  if (!isConnected || errorMessage) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
      >
        <AlertCircle
          size={20}
          className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
            {serviceName} Unavailable
          </p>
          {errorMessage && (
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">{errorMessage}</p>
          )}
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
            Using cached or fallback data
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-xs font-medium text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 underline"
            >
              Try Again
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
      <CheckCircle size={16} />
      <span>Connected to {serviceName}</span>
    </div>
  );
};

export default ConnectionStatus;
