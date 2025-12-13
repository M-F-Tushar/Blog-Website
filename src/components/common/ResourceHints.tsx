import React, { useEffect } from 'react';

interface ResourceHintsProps {
  preconnect?: string[];
  dnsPrefetch?: string[];
  prefetch?: string[];
}

/**
 * Dynamic resource hints component
 * Adds hints for routes user is likely to visit
 */
export const ResourceHints: React.FC<ResourceHintsProps> = ({
  preconnect = [],
  dnsPrefetch = [],
  prefetch = [],
}) => {
  useEffect(() => {
    // Add preconnect hints
    preconnect.forEach((url) => {
      if (!document.querySelector(`link[rel="preconnect"][href="${url}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = url;
        document.head.appendChild(link);
      }
    });

    // Add DNS prefetch hints
    dnsPrefetch.forEach((url) => {
      if (!document.querySelector(`link[rel="dns-prefetch"][href="${url}"]`)) {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = url;
        document.head.appendChild(link);
      }
    });

    // Add prefetch hints
    prefetch.forEach((url) => {
      if (!document.querySelector(`link[rel="prefetch"][href="${url}"]`)) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
      }
    });
  }, [preconnect, dnsPrefetch, prefetch]);

  return null;
};

export default ResourceHints;
