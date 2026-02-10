import { useRef, useEffect, useCallback } from 'react';

interface ParticleFieldProps {
  particleCount?: number;
  color?: string;
  maxSize?: number;
  speed?: number;
  connectDistance?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const stripped = hex.replace('#', '');
  const num = parseInt(stripped, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export default function ParticleField({
  particleCount = 80,
  color = '#22d3ee',
  maxSize = 2,
  speed = 0.3,
  connectDistance = 100,
  className = '',
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });

  const createParticles = useCallback(
    (width: number, height: number): Particle[] => {
      return Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * 2,
        vy: (Math.random() - 0.5) * speed * 2,
        size: Math.random() * maxSize + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
      }));
    },
    [particleCount, maxSize, speed]
  );

  const drawFrame = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      particles: Particle[],
      animate: boolean
    ) => {
      const rgb = hexToRgb(color);

      ctx.clearRect(0, 0, width, height);

      // Draw connection lines
      const distSq = connectDistance * connectDistance;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < distSq) {
            const alpha = (1 - Math.sqrt(d2) / connectDistance) * 0.15;
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update positions if animating
      if (animate) {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          else if (p.x > width) p.x = 0;

          if (p.y < 0) p.y = height;
          else if (p.y > height) p.y = 0;
        }
      }
    },
    [color, connectDistance]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const applySize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sizeRef.current = { width: w, height: h };
      return { w, h };
    };

    const { w, h } = applySize();
    particlesRef.current = createParticles(w, h);

    if (reducedMotion) {
      drawFrame(ctx, w, h, particlesRef.current, false);
      return;
    }

    let paused = false;

    const loop = () => {
      if (!paused) {
        const { width, height } = sizeRef.current;
        drawFrame(ctx, width, height, particlesRef.current, true);
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    // Page Visibility API — pause when tab hidden
    const onVisibilityChange = () => {
      paused = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // ResizeObserver for responsive canvas
    const resizeObserver = new ResizeObserver(() => {
      const prev = sizeRef.current;
      const { w: nw, h: nh } = applySize();

      // Rescale particle positions proportionally
      if (prev.width > 0 && prev.height > 0) {
        const sx = nw / prev.width;
        const sy = nh / prev.height;
        for (const p of particlesRef.current) {
          p.x *= sx;
          p.y *= sy;
        }
      }
    });

    resizeObserver.observe(canvas);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      document.removeEventListener('visibilitychange', onVisibilityChange);
      resizeObserver.disconnect();
    };
  }, [createParticles, drawFrame]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
