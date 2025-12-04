import React, { ReactNode, useId } from 'react';
import { cn } from '../../utils/cn';

interface FormFieldProps {
  /**
   * Label text for the input
   */
  label: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Hint text to help users
   */
  hint?: string;
  /**
   * The input element
   */
  children: ReactNode;
  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

/**
 * Accessible form field wrapper with:
 * - Associated label
 * - Error messages with aria-describedby
 * - Hint text support
 * - Required field indication
 */
const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  hint,
  children,
  className = '',
}) => {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  // Clone children to add proper ARIA attributes
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const describedBy = [error ? errorId : '', hint ? hintId : ''].filter(Boolean).join(' ');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return React.cloneElement(child as React.ReactElement<any>, {
        id: fieldId,
        'aria-invalid': error ? 'true' : 'false',
        'aria-describedby': describedBy || undefined,
        'aria-required': required ? 'true' : undefined,
      });
    }
    return child;
  });

  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
      >
        {label}
        {required && (
          <span className="text-error-500 dark:text-error-400 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-sm text-secondary-600 dark:text-secondary-400">
          {hint}
        </p>
      )}

      {childrenWithProps}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-error-600 dark:text-error-400 flex items-start gap-1"
        >
          <span aria-hidden="true">⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default FormField;
