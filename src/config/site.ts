/**
 * Centralized site configuration
 * Single source of truth for site URLs and metadata
 */
export const siteConfig = {
  url: 'https://mahirfaysaltusherblog.is-a.dev',
  name: 'M-F-Tushar Blog',
  description: 'Personal blog about web development, computer science, and technology.',
  author: {
    name: 'M-F-Tushar',
    github: 'https://github.com/M-F-Tushar',
  },
  ogImage: '/images/og-image.jpg',
} as const;
