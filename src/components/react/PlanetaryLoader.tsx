import React from 'react';

interface PlanetaryLoaderProps {
  size?: 'sm' | 'lg';
  label?: string;
  className?: string;
}

export default function PlanetaryLoader({
  size = 'sm',
  label = 'Loading...',
  className = '',
}: PlanetaryLoaderProps) {
  const planetSize = size === 'lg' ? 24 : 12;
  const orbitSize = size === 'lg' ? 56 : 28;
  const moonSize = size === 'lg' ? 6 : 3;

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div
        className="relative"
        style={{ width: orbitSize, height: orbitSize }}
        role="status"
        aria-label={label}
      >
        {/* Planet */}
        <div
          className="absolute rounded-full"
          style={{
            width: planetSize,
            height: planetSize,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle at 35% 35%, #22d3ee, #0891b2, #0F1629)',
          }}
        />
        {/* Orbit ring with moon */}
        <div
          className="absolute inset-0 rounded-full animate-orbit"
          style={{
            border: '1px solid rgba(6, 182, 212, 0.2)',
          }}
        >
          {/* Moon */}
          <div
            className="absolute rounded-full"
            style={{
              width: moonSize,
              height: moonSize,
              top: -moonSize / 2,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'radial-gradient(circle at 40% 40%, #a78bfa, #7c3aed)',
            }}
          />
        </div>
      </div>
      {label && (
        <span className={`text-secondary-400 ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
          {label}
        </span>
      )}
    </div>
  );
}
