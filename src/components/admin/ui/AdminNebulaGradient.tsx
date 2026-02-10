import React from 'react';

interface AdminNebulaGradientProps {
  variant?: 'hero' | 'section' | 'subtle';
  className?: string;
}

const CONFIG = {
  hero: {
    blob1Opacity: 0.15,
    blob2Opacity: 0.13,
    blob3Opacity: 0.12,
    blur: 64,
    size: '24rem',
  },
  section: {
    blob1Opacity: 0.1,
    blob2Opacity: 0.09,
    blob3Opacity: 0.08,
    blur: 40,
    size: '18rem',
  },
  subtle: {
    blob1Opacity: 0.06,
    blob2Opacity: 0.05,
    blob3Opacity: 0.04,
    blur: 24,
    size: '12rem',
  },
};

export default function AdminNebulaGradient({
  variant = 'subtle',
  className = '',
}: AdminNebulaGradientProps) {
  const c = CONFIG[variant];

  const blobBase: React.CSSProperties = {
    position: 'absolute',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <>
      <style>{`
        @keyframes adminBlob {
          0%, 100% { transform: translate(-50%, -50%) scale(1) translate(0, 0); }
          33% { transform: translate(-50%, -50%) scale(1.15) translate(30px, -40px); }
          66% { transform: translate(-50%, -50%) scale(0.9) translate(-20px, 20px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .admin-nebula-blob { animation: none !important; }
        }
      `}</style>
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        aria-hidden="true"
      >
        {/* Violet blob */}
        <div
          className="admin-nebula-blob"
          style={{
            ...blobBase,
            left: '30%',
            top: '40%',
            width: c.size,
            height: c.size,
            background: `radial-gradient(circle, rgba(139, 92, 246, ${c.blob1Opacity}) 0%, transparent 70%)`,
            filter: `blur(${c.blur}px)`,
            animation: 'adminBlob 14s ease-in-out infinite',
            animationDelay: '0s',
          }}
        />
        {/* Cyan blob */}
        <div
          className="admin-nebula-blob"
          style={{
            ...blobBase,
            left: '70%',
            top: '60%',
            width: c.size,
            height: c.size,
            background: `radial-gradient(circle, rgba(6, 182, 212, ${c.blob2Opacity}) 0%, transparent 70%)`,
            filter: `blur(${c.blur}px)`,
            animation: 'adminBlob 14s ease-in-out infinite',
            animationDelay: '2s',
          }}
        />
        {/* Pink blob */}
        <div
          className="admin-nebula-blob"
          style={{
            ...blobBase,
            left: '50%',
            top: '80%',
            width: c.size,
            height: c.size,
            background: `radial-gradient(circle, rgba(236, 72, 153, ${c.blob3Opacity}) 0%, transparent 70%)`,
            filter: `blur(${c.blur}px)`,
            animation: 'adminBlob 14s ease-in-out infinite',
            animationDelay: '4s',
          }}
        />
      </div>
    </>
  );
}
