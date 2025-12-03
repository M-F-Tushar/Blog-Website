import React from 'react';
import { Skeleton } from './Skeleton';
import { clsx } from 'clsx';

export type ViewMode = 'grid' | 'list' | 'compact';

export interface CardSkeletonProps {
  viewMode?: ViewMode;
  count?: number;
}

const SingleCardSkeleton: React.FC<{ viewMode: ViewMode }> = ({ viewMode }) => {
  const containerClasses = {
    grid: 'flex-col h-full',
    list: 'flex-col md:flex-row h-auto md:h-64',
    compact: 'flex-row h-auto items-center p-2 gap-4',
  };

  const imageContainerClasses = {
    grid: 'h-56 w-full',
    list: 'h-48 md:h-full w-full md:w-1/3 lg:w-1/4',
    compact: 'h-20 w-20 min-w-[5rem]',
  };

  const contentClasses = {
    grid: 'p-6 flex-col flex-grow space-y-3',
    list: 'p-6 flex-col flex-grow space-y-3 w-full md:w-2/3 lg:w-3/4',
    compact: 'p-0 flex-col flex-grow justify-center space-y-2',
  };

  return (
    <div
      className={clsx(
        'bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex border border-gray-100 dark:border-gray-700',
        containerClasses[viewMode]
      )}
    >
      {/* Image Skeleton */}
      <div className={imageContainerClasses[viewMode]}>
        <Skeleton
          variant="rectangular"
          className={clsx('w-full h-full', viewMode === 'compact' && 'rounded-lg')}
          animation="shimmer"
        />
      </div>

      {/* Content Skeleton */}
      <div className={clsx('flex', contentClasses[viewMode])}>
        {/* Category badge */}
        {viewMode !== 'compact' && <Skeleton variant="rectangular" width="80px" height="20px" />}

        {/* Title */}
        <Skeleton
          variant="text"
          className={clsx(
            viewMode === 'grid' ? 'h-7 w-4/5' : 'h-6 w-3/4',
            viewMode === 'compact' && 'h-5 w-full'
          )}
        />

        {/* Excerpt - not shown in compact mode */}
        {viewMode !== 'compact' && (
          <div className="space-y-2">
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-5/6" />
            {viewMode === 'grid' && <Skeleton variant="text" className="w-4/5" />}
          </div>
        )}

        {/* Tags and metadata */}
        <div className={clsx('flex', viewMode === 'compact' ? 'gap-2' : 'gap-3 mt-auto pt-4')}>
          {viewMode !== 'compact' ? (
            <>
              <Skeleton variant="rectangular" width="60px" height="24px" className="rounded-full" />
              <Skeleton variant="rectangular" width="60px" height="24px" className="rounded-full" />
              <Skeleton variant="rectangular" width="60px" height="24px" className="rounded-full" />
            </>
          ) : (
            <>
              <Skeleton variant="text" width="80px" height="14px" />
              <Skeleton variant="text" width="60px" height="14px" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ viewMode = 'grid', count = 1 }) => {
  if (count === 1) {
    return <SingleCardSkeleton viewMode={viewMode} />;
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SingleCardSkeleton key={index} viewMode={viewMode} />
      ))}
    </>
  );
};

export default CardSkeleton;
