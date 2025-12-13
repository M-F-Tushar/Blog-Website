import { Post } from '../types/types';

export const siteConfig = {
  title: 'M-F-Tushar Blog',
  description: 'Personal tech blog covering web development, AI, and software engineering.',
  url: 'https://mahirfaysaltusherblog.is-a.dev',
  author: {
    name: 'M-F-Tushar',
    twitter: '@your_twitter_handle', // Update with actual handle
    image: 'https://m-f-tushar.github.io/Blog-Website/images/profile.jpg', // Update with actual profile image
  },
  social: {
    twitter: 'https://twitter.com/your_twitter_handle',
    github: 'https://github.com/M-F-Tushar',
    linkedin: 'https://linkedin.com/in/your_profile',
  },
};

export const generateWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.title,
  url: siteConfig.url,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteConfig.url}/#/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});

export const generatePersonSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.author.name,
  url: siteConfig.url,
  image: siteConfig.author.image,
  sameAs: [siteConfig.social.twitter, siteConfig.social.github, siteConfig.social.linkedin],
});

export const generateBreadcrumbSchema = (items: { name: string; item: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${siteConfig.url}${item.item}`,
  })),
});

export const generateBlogSchema = (posts: Post[]) => ({
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: siteConfig.title,
  description: siteConfig.description,
  url: `${siteConfig.url}/#/blog`,
  author: {
    '@type': 'Person',
    name: siteConfig.author.name,
  },
  blogPost: posts.map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date, // Assuming modified date is same for now, update if available
    url: `${siteConfig.url}/#/blog/${post.id}`,
    image: post.coverImage,
  })),
});

export const generateBlogPostSchema = (post: Post) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.excerpt,
  image: post.coverImage ? [post.coverImage] : [],
  datePublished: post.date,
  dateModified: post.date,
  author: {
    '@type': 'Person',
    name: siteConfig.author.name,
    url: siteConfig.url,
  },
  publisher: {
    '@type': 'Organization',
    name: siteConfig.title,
    logo: {
      '@type': 'ImageObject',
      url: siteConfig.author.image,
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${siteConfig.url}/#/blog/${post.id}`,
  },
  keywords: post.tags.join(', '),
});
