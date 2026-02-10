import React, { Suspense, lazy, useRef, useEffect, useState, useCallback } from 'react';

const StarfieldScene = lazy(() => import('./StarfieldScene'));

interface CosmicStarfieldProps {
  starCount?: number;
  depth?: number;
  speed?: number;
  className?: string;
}

function StaticFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.6), transparent), radial-gradient(1px 1px at 60% 20%, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 80% 50%, rgba(255,255,255,0.5), transparent), radial-gradient(2px 2px at 10% 60%, rgba(210,225,255,0.6), transparent), radial-gradient(2px 2px at 70% 80%, rgba(210,225,255,0.5), transparent), radial-gradient(1px 1px at 50% 10%, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.6), transparent)',
        backgroundSize: '100% 100%',
      }}
    />
  );
}

export default function CosmicStarfield({
  starCount = 2500,
  depth = 50,
  speed = 0.2,
  className = '',
}: CosmicStarfieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(entry.isIntersecting);
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersection]);

  const effectiveStarCount = isMobile ? Math.min(starCount, 1000) : starCount;

  return (
    <div ref={containerRef} className={`absolute inset-0 z-0 ${className}`} aria-hidden="true">
      <Suspense fallback={<StaticFallback />}>
        {isVisible && (
          <StarfieldScene
            starCount={effectiveStarCount}
            depth={depth}
            speed={prefersReducedMotion ? 0 : speed}
            paused={!isVisible || prefersReducedMotion}
          />
        )}
      </Suspense>
      {!isVisible && <StaticFallback />}
    </div>
  );
}
