/**
 * Announce a message to screen readers using ARIA live regions
 * @param message - The message to announce
 * @param priority - 'polite' (default) or 'assertive'
 */
export const announceToScreenReader = (
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void => {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.textContent = message;

  document.body.appendChild(liveRegion);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(liveRegion);
  }, 1000);
};

/**
 * Generate a unique ID for ARIA relationships
 * @param prefix - Optional prefix for the ID
 * @returns A unique ID string
 */
export const generateAriaId = (prefix = 'aria'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Common ARIA label patterns
 */
export const ariaLabels = {
  // Navigation
  mainNav: 'Main navigation',
  skipToContent: 'Skip to main content',
  breadcrumb: 'Breadcrumb navigation',

  // Actions
  close: 'Close',
  menu: 'Menu',
  search: 'Search',
  filter: 'Filter',
  sort: 'Sort',

  // Status
  loading: 'Loading...',
  error: 'Error',
  success: 'Success',

  // Forms
  required: 'Required field',
  optional: 'Optional field',

  // Social
  shareOn: (platform: string) => `Share on ${platform}`,

  // Blog specific
  readMore: (title: string) => `Read more about ${title}`,
  viewPost: (title: string) => `View post: ${title}`,
  editPost: (title: string) => `Edit post: ${title}`,
  deletePost: (title: string) => `Delete post: ${title}`,
};

/**
 * Get ARIA attributes for a button that controls another element
 * @param targetId - ID of the controlled element
 * @param expanded - Whether the controlled element is expanded
 * @returns Object with ARIA attributes
 */
export const getAriaControls = (targetId: string, expanded: boolean) => ({
  'aria-controls': targetId,
  'aria-expanded': expanded,
});

/**
 * Get ARIA attributes for a form field
 * @param id - Field ID
 * @param options - Field options
 * @returns Object with ARIA attributes
 */
export const getAriaField = (
  id: string,
  options: {
    required?: boolean;
    invalid?: boolean;
    describedBy?: string;
    errorId?: string;
  } = {}
) => {
  const attrs: Record<string, string | boolean> = {
    id,
  };

  if (options.required) {
    attrs['aria-required'] = true;
  }

  if (options.invalid) {
    attrs['aria-invalid'] = true;
  }

  const describedByIds: string[] = [];
  if (options.describedBy) {
    describedByIds.push(options.describedBy);
  }
  if (options.invalid && options.errorId) {
    describedByIds.push(options.errorId);
  }

  if (describedByIds.length > 0) {
    attrs['aria-describedby'] = describedByIds.join(' ');
  }

  return attrs;
};
