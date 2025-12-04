import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FormErrorProps {
  /**
   * Error message to display
   */
  message: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to show an icon
   */
  showIcon?: boolean;
}

/**
 * Accessible error message component with role="alert"
 * Automatically announced to screen readers
 */
const FormError: React.FC<FormErrorProps> = ({ message, className = '', showIcon = true }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex items-start gap-2 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-xl',
        className
      )}
    >
      {showIcon && (
        <AlertCircle
          size={20}
          className="text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
      )}
      <div className="flex-1">
        <p className="text-sm font-medium text-error-900 dark:text-error-100">{message}</p>
      </div>
    </div>
  );
};

export default FormError;
