import React, { ReactElement, cloneElement } from 'react';

interface AccessibleIconProps {
  /**
   * The icon element (from lucide-react or similar)
   */
  icon: ReactElement;
  /**
   * Label for the icon. If provided, icon is meaningful; if not, it's decorative
   */
  label?: string;
  /**
   * Whether to hide the icon from screen readers (for decorative icons)
   */
  decorative?: boolean;
}

/**
 * AccessibleIcon wraps icon components with proper accessibility attributes
 * - Decorative icons: aria-hidden="true"
 * - Meaningful icons: aria-label with description
 */
const AccessibleIcon: React.FC<AccessibleIconProps> = ({ icon, label, decorative = false }) => {
  const isDecorative = decorative || !label;

  return cloneElement(icon, {
    'aria-hidden': isDecorative ? 'true' : undefined,
    'aria-label': !isDecorative && label ? label : undefined,
    role: !isDecorative && label ? 'img' : undefined,
  });
};

export default AccessibleIcon;
