import { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react';

interface TypewriterEffectProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorColor?: string;
}

type Phase = 'typing' | 'pausing' | 'deleting';

export default function TypewriterEffect({
  texts,
  speed = 80,
  deleteSpeed = 40,
  pauseDuration = 2000,
  className = '',
  cursorColor = '#22d3ee',
}: TypewriterEffectProps) {
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<Phase>('typing');
  const textIndex = useRef(0);
  const charIndex = useRef(0);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const tickRef = useRef<() => void>(() => {});

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const tick = useCallback(() => {
    if (!texts.length) return;

    const currentText = texts[textIndex.current];

    if (phase === 'typing') {
      if (charIndex.current < currentText.length) {
        charIndex.current += 1;
        setDisplayed(currentText.slice(0, charIndex.current));
        timeoutId.current = setTimeout(() => tickRef.current(), speed);
      } else {
        setPhase('pausing');
        timeoutId.current = setTimeout(() => tickRef.current(), pauseDuration);
      }
    } else if (phase === 'pausing') {
      setPhase('deleting');
      timeoutId.current = setTimeout(() => tickRef.current(), deleteSpeed);
    } else if (phase === 'deleting') {
      if (charIndex.current > 0) {
        charIndex.current -= 1;
        setDisplayed(currentText.slice(0, charIndex.current));
        timeoutId.current = setTimeout(() => tickRef.current(), deleteSpeed);
      } else {
        textIndex.current = (textIndex.current + 1) % texts.length;
        setPhase('typing');
        timeoutId.current = setTimeout(() => tickRef.current(), speed);
      }
    }
  }, [texts, phase, speed, deleteSpeed, pauseDuration]);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  useEffect(() => {
    if (reducedMotion || !texts.length) return;

    timeoutId.current = setTimeout(tick, speed);

    return () => {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [tick, speed, reducedMotion, texts]);

  if (reducedMotion) {
    return <span className={className}>{texts[0] ?? ''}</span>;
  }

  const cursorStyle: CSSProperties = {
    display: 'inline-block',
    width: '2px',
    height: '1.1em',
    backgroundColor: cursorColor,
    marginLeft: '2px',
    verticalAlign: 'text-bottom',
    animation: 'typewriter-blink 1s step-end infinite',
  };

  return (
    <span className={className}>
      {displayed}
      <span style={cursorStyle} aria-hidden="true" />
      <style>{`
        @keyframes typewriter-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
