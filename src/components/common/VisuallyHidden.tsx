import React from 'react';

interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: React.ElementType;
}

/**
 * Component that hides content visually but keeps it accessible to screen readers
 * Useful for providing additional context to assistive technologies
 */
export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  children,
  as: Component = 'span',
}) => {
  return <Component className="sr-only">{children}</Component>;
};

export default VisuallyHidden;
