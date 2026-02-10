import { useMemo } from 'react';

interface AdminStarryBackgroundProps {
  density?: 'sparse' | 'normal' | 'dense';
  className?: string;
}

const STAR_COUNTS = {
  sparse: { small: 40, medium: 15, large: 5 },
  normal: { small: 80, medium: 30, large: 10 },
  dense: { small: 120, medium: 45, large: 15 },
};

/** Deterministic seeded PRNG (multiply-mod LCG from Numerical Recipes). */
function seededRandom(seed: number) {
  let state = seed >>> 0;
  return (): number => {
    state = (state * 1664525 + 1013904223) & 0xffffffff;
    return (state >>> 0) / 4294967296;
  };
}

function generateStarGradients(count: number, radiusPx: number, seed: number): string {
  const rand = seededRandom(seed);
  const gradients: string[] = [];

  for (let i = 0; i < count; i++) {
    const x = (rand() * 100).toFixed(2);
    const y = (rand() * 100).toFixed(2);
    const isBlueWhite = rand() > 0.55;
    const core = isBlueWhite ? 'rgba(210, 225, 255, 0.9)' : 'rgba(255, 255, 255, 0.85)';

    if (radiusPx <= 1) {
      gradients.push(
        `radial-gradient(circle at ${x}% ${y}%, ${core} 0px, transparent ${radiusPx}px)`
      );
    } else if (radiusPx <= 2) {
      gradients.push(
        `radial-gradient(circle at ${x}% ${y}%, ${core} 0px, transparent ${radiusPx}px)`
      );
    } else {
      gradients.push(
        `radial-gradient(circle at ${x}% ${y}%, white 0px, ${core} ${radiusPx * 0.4}px, transparent ${radiusPx}px)`
      );
    }
  }

  return gradients.join(', ');
}

function splitIntoLayers(
  count: number,
  groups: number,
  radius: number,
  baseSeed: number
): string[] {
  const layers: string[] = [];
  const perGroup = Math.ceil(count / groups);

  for (let g = 0; g < groups; g++) {
    const groupCount = Math.min(perGroup, count - g * perGroup);
    if (groupCount > 0) {
      layers.push(generateStarGradients(groupCount, radius, baseSeed + g * 7919));
    }
  }

  return layers;
}

type LayerMeta = {
  kind: 'small' | 'medium' | 'large';
  bg: string;
  delay: string;
  animation: string;
};

export default function AdminStarryBackground({
  density = 'sparse',
  className = '',
}: AdminStarryBackgroundProps) {
  const layers = useMemo(() => {
    const counts = STAR_COUNTS[density];
    const smallLayers = splitIntoLayers(counts.small, 3, 1, 31337);
    const mediumLayers = splitIntoLayers(counts.medium, 2, 2, 74521);
    const largeBg = generateStarGradients(counts.large, 3, 95173);

    const result: LayerMeta[] = [
      ...smallLayers.map(
        (bg, i): LayerMeta => ({
          kind: 'small',
          bg,
          delay: `${(i * 0.7).toFixed(1)}s`,
          animation: 'adminTwinkle 3s ease-in-out infinite',
        })
      ),
      ...mediumLayers.map(
        (bg, i): LayerMeta => ({
          kind: 'medium',
          bg,
          delay: `${(i * 1.4).toFixed(1)}s`,
          animation: 'adminTwinkleSlow 5s ease-in-out infinite',
        })
      ),
      {
        kind: 'large',
        bg: largeBg,
        delay: '0s',
        animation: 'adminPulseGlow 6s ease-in-out infinite',
      },
    ];

    return result;
  }, [density]);

  return (
    <>
      <style>{`
        @keyframes adminTwinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes adminTwinkleSlow {
          0%, 100% { opacity: 0.85; }
          35% { opacity: 0.15; }
          70% { opacity: 0.55; }
        }
        @keyframes adminPulseGlow {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.05); }
        }
        @media (prefers-reduced-motion: reduce) {
          .admin-star-layer { animation: none !important; }
        }
      `}</style>
      <div className={`fixed inset-0 pointer-events-none z-0 ${className}`} aria-hidden="true">
        {layers.map((layer, idx) => (
          <div
            key={idx}
            className="admin-star-layer absolute inset-0"
            style={{
              backgroundImage: layer.bg,
              animation: layer.animation,
              animationDelay: layer.delay,
            }}
          />
        ))}
      </div>
    </>
  );
}
