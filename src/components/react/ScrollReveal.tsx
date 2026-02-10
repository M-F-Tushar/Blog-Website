import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}

const translationMap: Record<string, string> = {
  up: 'translate3d(0, 40px, 0)',
  down: 'translate3d(0, -40px, 0)',
  left: 'translate3d(40px, 0, 0)',
  right: 'translate3d(-40px, 0, 0)',
};

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  threshold = 0.1,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefersReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, prefersReducedMotion]);

  const hiddenStyle: CSSProperties = {
    opacity: 0,
    transform: translationMap[direction],
    willChange: 'opacity, transform',
  };

  const visibleStyle: CSSProperties = {
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
    willChange: 'auto',
  };

  const style: CSSProperties = prefersReducedMotion
    ? visibleStyle
    : {
        ...(isVisible ? visibleStyle : hiddenStyle),
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
      };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
