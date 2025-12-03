// React import for lazy components
import React from 'react';

/**
 * Lazy loading utilities with preload hints and retry logic
 */

/**
 * Preload a component on hover/focus without rendering
 * Triggers the import to start loading the chunk
 */
export function preloadComponent(importFn: () => Promise<unknown>): void {
  // Trigger import without rendering
  importFn().catch(() => {
    // Silent fail for preload
  });
}

/**
 * Lazy load with retry logic for chunk loading failures
 * Useful for handling network errors or temporary CDN issues
 */
export function lazyWithRetry<T extends React.ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  retries = 3,
  delay = 1000
): React.LazyExoticComponent<T> {
  return React.lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      const attemptImport = (retriesLeft: number) => {
        importFn()
          .then(resolve)
          .catch((error) => {
            if (retriesLeft === 0) {
              reject(error);
              return;
            }

            // Retry after delay
            setTimeout(() => {
              attemptImport(retriesLeft - 1);
            }, delay);
          });
      };

      attemptImport(retries);
    });
  });
}

/**
 * Preload multiple components at once
 */
export function preloadComponents(importFns: Array<() => Promise<unknown>>): void {
  importFns.forEach((importFn) => {
    preloadComponent(importFn);
  });
}

/**
 * Create a lazy component with automatic preloading on hover
 */
export function lazyWithPreload<T extends React.ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> & { preload: () => void } {
  const LazyComponent = React.lazy(importFn);

  return Object.assign(LazyComponent, {
    preload: () => preloadComponent(importFn),
  });
}
