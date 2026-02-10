import { useEffect, useState, useRef, useCallback } from 'react';

interface CursorGlowProps {
  color?: string;
  size?: number;
}

export default function CursorGlow({
  color = 'rgba(6,182,212,0.07)',
  size = 600,
}: CursorGlowProps) {
  const [visible, setVisible] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const updatePosition = useCallback(() => {
    const el = glowRef.current;
    if (el) {
      const halfSize = size / 2;
      el.style.transform = `translate(${posRef.current.x - halfSize}px, ${posRef.current.y - halfSize}px)`;
    }
    rafRef.current = 0;
  }, [size]);

  useEffect(() => {
    // Check pointer:fine
    const pointerFine = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!pointerFine || reducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updatePosition);
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Listen for changes in media queries
    const mqlMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionHandler = (e: MediaQueryListEvent) => {
      if (e.matches) setVisible(false);
      else setVisible(true);
    };
    mqlMotion.addEventListener('change', motionHandler);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      mqlMotion.removeEventListener('change', motionHandler);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updatePosition]);

  if (!visible) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: size,
        height: size,
        pointerEvents: 'none',
        zIndex: 1,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        borderRadius: '50%',
        willChange: 'transform',
        transform: 'translate(-100%, -100%)',
      }}
    />
  );
}
