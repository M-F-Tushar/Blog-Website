import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Database, Wifi, Shield, X, ChevronDown, ChevronUp } from 'lucide-react';
import { getEnvironmentConfig } from '../../config/environment';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface HealthCheckProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * HealthCheck component displays system status information
 * Only visible in development or with ?debug=true query parameter
 */
const HealthCheck: React.FC<HealthCheckProps> = ({ isOpen, onClose }) => {
  const [expanded, setExpanded] = useState(true);
  const isOnline = useOnlineStatus();
  const config = getEnvironmentConfig();

  const checks = [
    {
      name: 'Network Connection',
      status: isOnline ? 'online' : 'offline',
      icon: Wifi,
      details: isOnline ? 'Connected to internet' : 'No internet connection',
      color: isOnline ? 'green' : 'red',
    },
    {
      name: 'Supabase Backend',
      status: config.supabase.isConfigured ? 'configured' : 'not-configured',
      icon: Database,
      details: config.supabase.isConfigured
        ? `Connected to ${config.supabase.url?.split('.')[0]}...`
        : 'Using fallback data (demo mode)',
      color: config.supabase.isConfigured ? 'green' : 'yellow',
    },
    {
      name: 'Contact Form',
      status: config.contact.useSupabase
        ? 'database'
        : config.contact.formspreeEndpoint
          ? 'configured'
          : 'fallback',
      icon: Shield,
      details: config.contact.useSupabase
        ? 'Connected to Supabase Messages'
        : config.contact.formspreeEndpoint
          ? 'Formspree integration active'
          : 'Using mailto fallback',
      color: config.contact.useSupabase || config.contact.formspreeEndpoint ? 'green' : 'yellow',
    },
    {
      name: 'Error Tracking',
      status: config.tracking.errorTrackingEnabled ? 'enabled' : 'disabled',
      icon: Activity,
      details: config.tracking.errorTrackingEnabled
        ? config.tracking.analyticsEndpoint
          ? `Sending to ${config.tracking.analyticsEndpoint}`
          : 'Console logging only'
        : 'Disabled',
      color: config.tracking.errorTrackingEnabled ? 'green' : 'gray',
    },
  ];

  const getStatusColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'yellow':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'red':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-primary-600 dark:text-primary-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">System Health</h3>
              {config.deployment.isDevelopment && (
                <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                  DEV
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                aria-label={expanded ? 'Collapse' : 'Expand'}
              >
                {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Content */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  {checks.map((check) => {
                    const Icon = check.icon;
                    return (
                      <div
                        key={check.name}
                        className={`p-3 rounded-lg ${getStatusColor(check.color)}`}
                      >
                        <div className="flex items-start gap-3">
                          <Icon size={18} className="flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm">{check.name}</h4>
                              <span className="text-xs font-semibold uppercase">
                                {check.status}
                              </span>
                            </div>
                            <p className="text-xs opacity-80 break-words">{check.details}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Environment info */}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Environment:</span>
                        <span className="font-medium">
                          {config.deployment.isDevelopment ? 'Development' : 'Production'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Base URL:</span>
                        <span className="font-medium truncate ml-2">
                          {config.deployment.baseUrl}
                        </span>
                      </div>
                      {config.deployment.isGitHubPages && (
                        <div className="flex justify-between">
                          <span>Deployment:</span>
                          <span className="font-medium">GitHub Pages</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer hint */}
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Press{' '}
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
                Shift+H
              </kbd>{' '}
              to toggle
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HealthCheck;
