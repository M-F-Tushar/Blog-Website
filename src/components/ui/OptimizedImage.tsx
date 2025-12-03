import React, { useState, useEffect, useRef } from 'react';
import { useImageLoad } from '../../hooks/useImageLoad';
import { generateSrcSet } from '../../utils/imageUtils';

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean; // For above-the-fold images
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized image component with lazy loading, blur placeholders, and responsive images
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  className = '',
  onLoad,
  onError,
}) => {
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onLoadCalledRef = useRef(false);
  const onErrorCalledRef = useRef(false);

  const { isLoading, isError, isLoaded } = useImageLoad(isInView || priority ? src : '');

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip lazy loading for priority images

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  // Handle callbacks after render
  useEffect(() => {
    if (isLoaded && onLoad && !onLoadCalledRef.current) {
      onLoadCalledRef.current = true;
      onLoad();
    }
  }, [isLoaded, onLoad]);

  useEffect(() => {
    if (isError && onError && !onErrorCalledRef.current) {
      onErrorCalledRef.current = true;
      onError();
    }
  }, [isError, onError]);

  // Generate responsive srcset
  const srcSet = width ? generateSrcSet(src, [width, width * 1.5, width * 2]) : undefined;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : 'auto' }}
    >
      {/* Loading skeleton */}
      {isLoading && !isError && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}

      {/* Blur placeholder */}
      {placeholder === 'blur' && blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-110"
          aria-hidden="true"
        />
      )}

      {/* Main image */}
      {(isInView || priority) && !isError && (
        <img
          ref={imgRef}
          src={src}
          srcSet={srcSet}
          sizes={width ? `${width}px` : '100vw'}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Error fallback */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg
              className="mx-auto h-12 w-12 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
