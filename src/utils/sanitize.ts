import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (dirty: string): string => {
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'span', 'div', 'style', 'sup', 'sub', 'mark', 'abbr', 'kbd',
            'details', 'summary', 'figure', 'figcaption', 'caption', 'colgroup', 'col',
            'dl', 'dt', 'dd', 'small', 'b', 'i', 'hr',
            'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'text',
        ],
        ALLOWED_ATTR: [
            'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel',
            'style', 'width', 'height', 'colspan', 'rowspan', 'scope',
            'viewBox', 'd', 'fill', 'stroke', 'stroke-width', 'cx', 'cy', 'r',
            'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points', 'transform',
        ],
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
 * Sanitize markdown source that may include embedded HTML.
 * We intentionally keep markdown control characters untouched so downstream
 * renderers can still interpret formatting, while stripping unsafe HTML.
 */
export const sanitizeMarkdown = (dirty: string): string => {
    return sanitizeHtml(dirty);
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
