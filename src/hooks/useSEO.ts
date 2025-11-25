import { useEffect } from 'react';
import { useSiteSettings } from './useSiteSettings';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  tags?: string[];
  canonicalUrl?: string;
  schema?: object;
}

const useSEO = (props?: SEOProps) => {
  const { siteName, siteDescription } = useSiteSettings();

  const {
    title,
    description = siteDescription,
    image = 'https://m-f-tushar.github.io/Blog-Website/images/og-image.jpg',
    type = 'website',
    author,
    publishedTime,
    tags = [],
    canonicalUrl,
    schema
  } = props || {};

  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const url = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');

  useEffect(() => {
    // Update title
    document.title = fullTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    if (author) updateMetaTag('author', author);
    if (tags.length > 0) updateMetaTag('keywords', tags.join(', '));

    // Open Graph tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', siteName, true);
    if (publishedTime) updateMetaTag('article:published_time', publishedTime, true);
    if (author) updateMetaTag('article:author', author, true);
    if (tags.length > 0) {
      tags.forEach(tag => {
        updateMetaTag('article:tag', tag, true);
      });
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', fullTitle, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image, true);

    // Canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', url);

    // JSON-LD Schema
    if (schema) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    }
  }, [fullTitle, description, image, url, type, author, publishedTime, tags, siteName, schema]);
};

export default useSEO;
