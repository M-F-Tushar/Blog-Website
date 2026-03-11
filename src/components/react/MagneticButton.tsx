import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
  type MouseEvent,
  type ComponentPropsWithoutRef,
} from 'react';
import type React from 'react';

type BaseButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>;
type BaseAnchorProps = Omit<ComponentPropsWithoutRef<'a'>, 'className' | 'children'>;

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  href?: string;
  /** Pass-through props for <a> or <button> */
  buttonProps?: BaseButtonProps;
  anchorProps?: BaseAnchorProps;
}

export default function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  href,
  buttonProps,
  anchorProps,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);
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
    (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setOffset({
        x: (e.clientX - centerX) * strength,
        y: (e.clientY - centerY) * strength,
      });
    },
    [prefersReducedMotion, strength]
  );

  const handleMouseEnter = useCallback(() => setIsInside(true), []);

  const handleMouseLeave = useCallback(() => {
    setIsInside(false);
    setOffset({ x: 0, y: 0 });
  }, []);

  const style: import('react').CSSProperties = {
    display: 'inline-block',
    transform:
      !prefersReducedMotion && isInside
        ? `translate(${offset.x}px, ${offset.y}px)`
        : 'translate(0px, 0px)',
    transition: isInside
      ? 'transform 150ms ease-out'
      : 'transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    willChange: 'transform',
  };

  const sharedProps = {
    ref: ref as unknown as React.Ref<HTMLAnchorElement & HTMLButtonElement>,
    className,
    style,
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  if (href) {
    return (
      <a href={href} {...anchorProps} {...sharedProps}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" {...buttonProps} {...sharedProps}>
      {children}
    </button>
  );
}
