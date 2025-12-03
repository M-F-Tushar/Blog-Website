import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { clsx } from 'clsx';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onDismiss]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = icons[toast.type];

  const colorClasses = {
    success:
      'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800 text-success-900 dark:text-success-100',
    error:
      'bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800 text-error-900 dark:text-error-100',
    warning:
      'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800 text-warning-900 dark:text-warning-100',
    info: 'bg-info-50 dark:bg-info-900/20 border-info-200 dark:border-info-800 text-info-900 dark:text-info-100',
  };

  const iconColorClasses = {
    success: 'text-success-600 dark:text-success-400',
    error: 'text-error-600 dark:text-error-400',
    warning: 'text-warning-600 dark:text-warning-400',
    info: 'text-info-600 dark:text-info-400',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={clsx(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md w-full pointer-events-auto',
        colorClasses[toast.type]
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', iconColorClasses[toast.type])} />

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold">{toast.title}</h3>
        {toast.message && <p className="mt-1 text-sm opacity-90">{toast.message}</p>}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none"
      aria-label="Notifications"
      role="region"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
