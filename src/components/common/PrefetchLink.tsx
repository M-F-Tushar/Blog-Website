import React, { useCallback, useRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { preloadComponent } from '../../utils/lazyImports';

export interface PrefetchLinkProps extends Omit<LinkProps, 'prefetch'> {
  prefetch?: 'hover' | 'visible' | 'none';
  prefetchRoute?: () => Promise<unknown>;
}

/**
 * Link component that prefetches on hover/focus or when visible
 */
export const PrefetchLink: React.FC<PrefetchLinkProps> = ({
  prefetch = 'hover',
  prefetchRoute,
  children,
  onMouseEnter,
  onFocus,
  ...props
}) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const prefetchedRef = useRef(false);

  const handlePrefetch = useCallback(() => {
    if (!prefetchRoute || prefetchedRef.current) return;

    prefetchedRef.current = true;
    preloadComponent(prefetchRoute);
  }, [prefetchRoute]);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (prefetch === 'hover') {
        handlePrefetch();
      }
      onMouseEnter?.(e);
    },
    [prefetch, handlePrefetch, onMouseEnter]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLAnchorElement>) => {
      if (prefetch === 'hover') {
        handlePrefetch();
      }
      onFocus?.(e);
    },
    [prefetch, handlePrefetch, onFocus]
  );

  // Intersection Observer for 'visible' prefetch
  React.useEffect(() => {
    if (prefetch !== 'visible' || !linkRef.current || !prefetchRoute) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handlePrefetch();
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    observer.observe(linkRef.current);

    return () => {
      observer.disconnect();
    };
  }, [prefetch, handlePrefetch, prefetchRoute]);

  if (prefetch === 'none' || !prefetchRoute) {
    return <Link {...props}>{children}</Link>;
  }

  return (
    <Link ref={linkRef} onMouseEnter={handleMouseEnter} onFocus={handleFocus} {...props}>
      {children}
    </Link>
  );
};

export default PrefetchLink;
