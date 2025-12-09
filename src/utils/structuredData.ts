import { Post } from '../types/types';

/**
 * Utility functions to generate JSON-LD structured data for SEO
 */

interface Author {
  name: string;
  email?: string;
  url?: string;
}

interface WebSiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description?: string;
  author?: {
    '@type': string;
    name: string;
  };
}

interface BlogPostingSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': string;
    name: string;
  };
  publisher?: {
    '@type': string;
    name: string;
    logo?: {
      '@type': string;
      url: string;
    };
  };
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
  keywords?: string[];
  articleSection?: string;
}

interface PersonSchema {
  '@context': string;
  '@type': string;
  name: string;
  email?: string;
  url?: string;
  jobTitle?: string;
  description?: string;
  sameAs?: string[];
}

interface BreadcrumbListSchema {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item?: string;
  }>;
}

/**
 * Generate WebSite schema for the homepage
 */
export const generateWebSiteSchema = (
  siteName: string,
  siteUrl: string,
  description?: string,
  author?: Author
): WebSiteSchema => {
  const schema: WebSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
  };

  if (description) {
    schema.description = description;
  }

  if (author) {
    schema.author = {
      '@type': 'Person',
      name: author.name,
    };
  }

  return schema;
};

/**
 * Generate BlogPosting schema for blog articles
 */
export const generateBlogPostingSchema = (
  post: Post,
  siteUrl: string,
  siteName: string,
  author: Author
): BlogPostingSchema => {
  const schema: BlogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: author.name,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.id}`,
    },
  };

  if (post.coverImage) {
    schema.image = post.coverImage;
  }

  // Note: Post type doesn't have updatedAt, so we skip dateModified

  if (post.tags && post.tags.length > 0) {
    schema.keywords = post.tags;
  }

  if (post.category) {
    schema.articleSection = post.category;
  }

  schema.publisher = {
    '@type': 'Organization',
    name: siteName,
  };

  return schema;
};

/**
 * Generate Person schema for author pages
 */
export const generatePersonSchema = (
  author: Author,
  jobTitle?: string,
  description?: string,
  socialLinks?: string[]
): PersonSchema => {
  const schema: PersonSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
  };

  if (author.email) {
    schema.email = author.email;
  }

  if (author.url) {
    schema.url = author.url;
  }

  if (jobTitle) {
    schema.jobTitle = jobTitle;
  }

  if (description) {
    schema.description = description;
  }

  if (socialLinks && socialLinks.length > 0) {
    schema.sameAs = socialLinks;
  }

  return schema;
};

/**
 * Generate BreadcrumbList schema for navigation
 */
export const generateBreadcrumbSchema = (
  items: Array<{ name: string; url?: string }>
): BreadcrumbListSchema => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
};
