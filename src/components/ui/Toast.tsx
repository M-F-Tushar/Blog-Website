import React, { useEffect, useState, useCallback } from 'react';
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
  const [isExiting, setIsExiting] = useState(false);

  const dismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 200);
  }, [toast.id, onDismiss]);

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(dismiss, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, dismiss]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = icons[toast.type];

  const colorClasses = {
    success:
      'bg-success-900/30 border-success-500/20 text-success-100 shadow-[0_0_20px_rgba(16,185,129,0.1)]',
    error:
      'bg-error-900/30 border-error-500/20 text-error-100 shadow-[0_0_20px_rgba(239,68,68,0.1)]',
    warning:
      'bg-warning-900/30 border-warning-500/20 text-warning-100 shadow-[0_0_20px_rgba(245,158,11,0.1)]',
    info: 'bg-info-900/30 border-info-500/20 text-info-100 shadow-[0_0_20px_rgba(59,130,246,0.1)]',
  };

  const iconColorClasses = {
    success: 'text-success-400',
    error: 'text-error-400',
    warning: 'text-warning-400',
    info: 'text-info-400',
  };

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl max-w-md w-full pointer-events-auto transition-all duration-200',
        isExiting ? 'opacity-0 scale-50' : 'animate-toast-in',
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
        onClick={dismiss}
        className="flex-shrink-0 p-1 rounded-md hover:bg-white/10 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
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
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export default Toast;
