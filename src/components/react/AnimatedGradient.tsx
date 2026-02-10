import { useId, useEffect, useState, type ReactNode } from 'react';

interface AnimatedGradientProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

export default function AnimatedGradient({
  children,
  className = '',
  colors = ['#06b6d4', '#8b5cf6', '#f59e0b'],
  speed = 8,
}: AnimatedGradientProps) {
  const id = useId();
  const animationName = `gradient-shift-${id.replace(/:/g, '')}`;
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefersReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const gradientStops = colors.join(', ');

  const keyframes = `
    @keyframes ${animationName} {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  return (
    <div className={`relative ${className}`}>
      {/* Inject keyframes */}
      <style>{keyframes}</style>

      {/* Gradient overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
          background: `linear-gradient(-45deg, ${gradientStops})`,
          backgroundSize: '300% 300%',
          animation: prefersReducedMotion ? 'none' : `${animationName} ${speed}s ease infinite`,
          borderRadius: 'inherit',
          pointerEvents: 'none',
        }}
      />

      {/* Content above gradient */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
