import React, { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface FocusRingProps {
  /**
   * Child elements to wrap with focus ring
   */
  children: ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to use a larger offset for the focus ring
   */
  offset?: 'sm' | 'md' | 'lg';
  /**
   * Color variant for the focus ring
   */
  variant?: 'primary' | 'secondary' | 'error' | 'success';
  /**
   * Whether the focus ring is visible (for manual control)
   */
  visible?: boolean;
}

/**
 * FocusRing provides a customizable, accessible focus indicator
 * Supports high contrast mode and both light/dark themes
 */
const FocusRing: React.FC<FocusRingProps> = ({
  children,
  className = '',
  offset = 'md',
  variant = 'primary',
  visible,
}) => {
  const offsetClasses = {
    sm: 'focus-visible:outline-offset-1',
    md: 'focus-visible:outline-offset-2',
    lg: 'focus-visible:outline-offset-4',
  };

  const variantClasses = {
    primary: 'focus-visible:outline-primary-500 dark:focus-visible:outline-primary-400',
    secondary: 'focus-visible:outline-secondary-500 dark:focus-visible:outline-secondary-400',
    error: 'focus-visible:outline-error-500 dark:focus-visible:outline-error-400',
    success: 'focus-visible:outline-success-500 dark:focus-visible:outline-success-400',
  };

  const focusClasses = cn(
    'focus-visible:outline',
    'focus-visible:outline-2',
    offsetClasses[offset],
    variantClasses[variant],
    // High contrast mode support
    'forced-colors:focus-visible:outline-[Highlight]',
    visible && 'outline outline-2',
    className
  );

  return <div className={focusClasses}>{children}</div>;
};

export default FocusRing;
