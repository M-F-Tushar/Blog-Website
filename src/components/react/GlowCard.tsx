import { useState, useRef, useCallback, useEffect, type ReactNode, type MouseEvent } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  glowSize?: number;
}

export default function GlowCard({
  children,
  className = '',
  glowColor = 'rgba(6,182,212,0.15)',
  glowSize = 300,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefersReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [prefersReducedMotion]
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative bg-surface border border-white/[0.06] rounded-2xl overflow-hidden ${className}`}
      style={{
        transition: 'transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 8px 30px rgba(0,0,0,0.12)' : '0 0 0 rgba(0,0,0,0)',
        borderColor: isHovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
      }}
    >
      {/* Radial glow overlay */}
      {!prefersReducedMotion && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 300ms ease',
            background: `radial-gradient(${glowSize}px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 65%)`,
            zIndex: 1,
          }}
        />
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </div>
  );
}
