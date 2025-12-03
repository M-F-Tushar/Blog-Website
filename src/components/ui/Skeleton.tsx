import React from 'react';
import { clsx } from 'clsx';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'card';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer' | 'none';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'shimmer',
  className,
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    shimmer:
      'relative overflow-hidden after:absolute after:inset-0 after:translate-x-[-100%] after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) {
    style.width = typeof width === 'number' ? `${width}px` : width;
  }
  if (height) {
    style.height = typeof height === 'number' ? `${height}px` : height;
  }

  return (
    <div
      className={clsx(baseClasses, variantClasses[variant], animationClasses[animation], className)}
      style={style}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
