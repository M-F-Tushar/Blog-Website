import type { Post } from './types';

interface Author {
  name: string;
  email?: string;
  url?: string;
}

export function generateWebSiteSchema(
  siteName: string,
  siteUrl: string,
  description?: string,
  author?: Author
) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
  };
  if (description) schema.description = description;
  if (author) schema.author = { '@type': 'Person', name: author.name };
  return schema;
}

export function generateBlogPostingSchema(
  post: Post,
  siteUrl: string,
  siteName: string,
  author: Author
) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Person', name: author.name },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/${post.slug}` },
  };
  if (post.coverImage) schema.image = post.coverImage;
  if (post.tags?.length) schema.keywords = post.tags;
  if (post.category) schema.articleSection = post.category;
  schema.publisher = { '@type': 'Organization', name: siteName };
  return schema;
}

export function generatePersonSchema(
  author: Author,
  jobTitle?: string,
  description?: string,
  socialLinks?: string[]
) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
  };
  if (author.email) schema.email = author.email;
  if (author.url) schema.url = author.url;
  if (jobTitle) schema.jobTitle = jobTitle;
  if (description) schema.description = description;
  if (socialLinks?.length) schema.sameAs = socialLinks;
  return schema;
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url?: string }>) {
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
}
