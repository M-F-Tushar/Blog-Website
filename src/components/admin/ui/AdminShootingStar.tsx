import { useEffect, useState, useRef } from 'react';

export default function AdminShootingStar() {
  const [star, setStar] = useState<{ x: number; y: number; id: number } | null>(null);
  const idRef = useRef(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const spawn = () => {
      const x = Math.random() * 80 + 10; // 10-90% from left
      const y = Math.random() * 40; // 0-40% from top
      idRef.current += 1;
      setStar({ x, y, id: idRef.current });

      // Clear after animation
      setTimeout(() => setStar(null), 1600);
    };

    // Spawn randomly every 8-20 seconds
    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 12000;
      return setTimeout(() => {
        spawn();
        timerRef = scheduleNext();
      }, delay);
    };

    let timerRef = scheduleNext();

    return () => clearTimeout(timerRef);
  }, []);

  if (!star) return null;

  return (
    <>
      <style>{`
        @keyframes adminShootingStar {
          0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 0; width: 0; }
          5% { opacity: 1; width: 80px; }
          80% { opacity: 1; }
          100% { transform: translateX(-300px) translateY(300px) rotate(-45deg); opacity: 0; width: 80px; }
        }
      `}</style>
      <div
        key={star.id}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: `${star.x}%`,
          top: `${star.y}%`,
          width: 0,
          height: '2px',
          background: 'linear-gradient(90deg, rgba(6,182,212,0.8), transparent)',
          borderRadius: '2px',
          pointerEvents: 'none',
          zIndex: 1,
          animation: 'adminShootingStar 1.5s ease-in forwards',
          boxShadow: '0 0 6px rgba(6,182,212,0.6)',
        }}
      />
    </>
  );
}
