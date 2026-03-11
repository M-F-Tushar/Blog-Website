import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'a',
      'img',
      'blockquote',
      'code',
      'pre',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
};

/**
 * Sanitize text content (strips all HTML)
 * @param dirty - The text to sanitize
 * @returns Plain text with HTML stripped
 */
export const sanitizeText = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
};

/**
 * Check if a string contains potentially dangerous content
 * @param content - The content to check
 * @returns true if content appears safe, false otherwise
 */
export const isSafeContent = (content: string): boolean => {
  const sanitized = DOMPurify.sanitize(content);
  return sanitized === content;
};
