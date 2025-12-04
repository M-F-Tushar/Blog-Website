import React, { useEffect } from 'react';

interface SEOHeadProps {
  /**
   * Page title
   */
  title: string;
  /**
   * Page description
   */
  description: string;
  /**
   * Canonical URL
   */
  canonicalUrl?: string;
  /**
   * Open Graph image
   */
  image?: string;
  /**
   * Page type (website, article, etc.)
   */
  type?: 'website' | 'article';
  /**
   * Keywords for SEO
   */
  keywords?: string[];
  /**
   * Author name
   */
  author?: string;
  /**
   * Article publish time (ISO 8601)
   */
  publishedTime?: string;
  /**
   * Article modified time (ISO 8601)
   */
  modifiedTime?: string;
  /**
   * Robots meta tag value
   */
  robots?: string;
  /**
   * Twitter card type
   */
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
}

/**
 * Component that manages all head meta tags for SEO
 * Cleans up on unmount to prevent duplicate tags
 */
const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  image = 'https://m-f-tushar.github.io/Blog-Website/images/og-image.jpg',
  type = 'website',
  keywords = [],
  author,
  publishedTime,
  modifiedTime,
  robots = 'index, follow',
  twitterCard = 'summary_large_image',
}) => {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper to update or create meta tags
    const updateMetaTag = (selector: string, content: string, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${selector}"]`) as HTMLMetaElement;

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, selector);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
      return element;
    };

    const createdElements: HTMLElement[] = [];

    // Basic meta tags
    createdElements.push(updateMetaTag('description', description));
    createdElements.push(updateMetaTag('robots', robots));

    if (keywords.length > 0) {
      createdElements.push(updateMetaTag('keywords', keywords.join(', ')));
    }

    if (author) {
      createdElements.push(updateMetaTag('author', author));
    }

    // Open Graph tags
    createdElements.push(updateMetaTag('og:title', title, 'property'));
    createdElements.push(updateMetaTag('og:description', description, 'property'));
    createdElements.push(updateMetaTag('og:type', type, 'property'));
    createdElements.push(updateMetaTag('og:image', image, 'property'));

    if (canonicalUrl) {
      createdElements.push(updateMetaTag('og:url', canonicalUrl, 'property'));
    }

    // Article-specific Open Graph tags
    if (type === 'article') {
      if (publishedTime) {
        createdElements.push(updateMetaTag('article:published_time', publishedTime, 'property'));
      }
      if (modifiedTime) {
        createdElements.push(updateMetaTag('article:modified_time', modifiedTime, 'property'));
      }
      if (author) {
        createdElements.push(updateMetaTag('article:author', author, 'property'));
      }
    }

    // Twitter Card tags
    createdElements.push(updateMetaTag('twitter:card', twitterCard, 'property'));
    createdElements.push(updateMetaTag('twitter:title', title, 'property'));
    createdElements.push(updateMetaTag('twitter:description', description, 'property'));
    createdElements.push(updateMetaTag('twitter:image', image, 'property'));

    // Canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalUrl) {
      if (!canonicalElement) {
        canonicalElement = document.createElement('link');
        canonicalElement.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalElement);
        createdElements.push(canonicalElement);
      }
      canonicalElement.setAttribute('href', canonicalUrl);
    }
  }, [
    title,
    description,
    canonicalUrl,
    image,
    type,
    keywords,
    author,
    publishedTime,
    modifiedTime,
    robots,
    twitterCard,
  ]);

  return null;
};

export default SEOHead;
