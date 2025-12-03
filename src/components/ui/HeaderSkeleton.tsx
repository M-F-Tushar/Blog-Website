import React from 'react';
import { Skeleton } from './Skeleton';

export const HeaderSkeleton: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo skeleton */}
          <Skeleton variant="text" width="120px" height="24px" />

          {/* Navigation skeleton */}
          <nav className="hidden md:flex items-center gap-6">
            <Skeleton variant="text" width="60px" height="20px" />
            <Skeleton variant="text" width="60px" height="20px" />
            <Skeleton variant="text" width="80px" height="20px" />
            <Skeleton variant="text" width="70px" height="20px" />
          </nav>

          {/* Actions skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" width="36px" height="36px" />
            <Skeleton variant="circular" width="36px" height="36px" className="md:hidden" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSkeleton;
