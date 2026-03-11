import { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../../services/supabase';

interface StatusItem {
  label: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
}

/**
 * ConfigStatus Component
 *
 * Displays configuration status for debugging purposes.
 * Only visible in development mode or when ?debug=true query parameter is present.
 *
 * Shows:
 * - Supabase connection status
 * - Formspree configuration status
 * - PWA status
 * - Demo mode indicator
 */
export default function ConfigStatus() {
  // Determine visibility based on environment
  const isDev = import.meta.env.DEV;
  const debugMode = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('debug') === 'true';
  }, []);
  const shouldShow = isDev || debugMode;

  const [visible, setVisible] = useState(shouldShow);

  // Compute statuses directly without using an effect
  const statuses = useMemo<StatusItem[]>(() => {
    if (!shouldShow) {
      return [];
    }

    // Check Supabase configuration
    const supabaseConfigured = isSupabaseConfigured();
    const supabaseStatus: StatusItem = {
      label: 'Supabase',
      status: supabaseConfigured ? 'ok' : 'warning',
      message: supabaseConfigured
        ? 'Connected'
        : 'Not configured - using demo mode',
    };

    // Check Formspree configuration
    const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
    const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
    const formspreeStatus: StatusItem = {
      label: 'Formspree',
      status: formspreeEndpoint ? 'ok' : contactEmail ? 'warning' : 'error',
      message: formspreeEndpoint
        ? 'Configured'
        : contactEmail
          ? 'Using mailto fallback'
          : 'Not configured',
    };

    // Check PWA status
    const pwaStatus: StatusItem = {
      label: 'PWA',
      status: 'serviceWorker' in navigator ? 'ok' : 'error',
      message:
        'serviceWorker' in navigator ? 'Service Worker available' : 'Not supported',
    };

    // Check demo mode
    const demoModeStatus: StatusItem = {
      label: 'Mode',
      status: supabaseConfigured ? 'ok' : 'warning',
      message: supabaseConfigured ? 'Production mode' : 'Demo mode (fallback data)',
    };

    return [supabaseStatus, formspreeStatus, pwaStatus, demoModeStatus];
  }, [shouldShow]);

  if (!visible) {
    return null;
  }

  const getStatusIcon = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Configuration Status
          </h3>
          <button
            onClick={() => setVisible(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close configuration status"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {statuses.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 p-2 rounded border ${getStatusColor(item.status)}`}
            >
              {getStatusIcon(item.status)}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-900 dark:text-white">
                  {item.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {item.message}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This panel is only visible in development or with ?debug=true
          </p>
        </div>
      </div>
    </div>
  );
}
