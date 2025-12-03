import React from 'react';
import { Skeleton } from './Skeleton';

export const PostSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 space-y-6">
          {/* Category badge */}
          <Skeleton variant="rectangular" width="100px" height="24px" className="rounded-full" />

          {/* Title */}
          <div className="space-y-3">
            <Skeleton variant="text" className="h-10 w-5/6" />
            <Skeleton variant="text" className="h-10 w-4/5" />
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Skeleton variant="circular" width="40px" height="40px" />
              <div className="space-y-2">
                <Skeleton variant="text" width="120px" height="16px" />
                <Skeleton variant="text" width="100px" height="14px" />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Skeleton variant="rectangular" width="70px" height="28px" className="rounded-full" />
            <Skeleton variant="rectangular" width="80px" height="28px" className="rounded-full" />
            <Skeleton variant="rectangular" width="75px" height="28px" className="rounded-full" />
            <Skeleton variant="rectangular" width="90px" height="28px" className="rounded-full" />
          </div>
        </div>

        {/* Cover Image */}
        <Skeleton variant="rectangular" className="w-full h-96" />

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Paragraph 1 */}
          <div className="space-y-3">
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-5/6" />
          </div>

          {/* Heading */}
          <Skeleton variant="text" className="h-8 w-3/5 mt-8" />

          {/* Paragraph 2 */}
          <div className="space-y-3">
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-4/5" />
          </div>

          {/* Subheading */}
          <Skeleton variant="text" className="h-7 w-2/5 mt-6" />

          {/* Paragraph 3 */}
          <div className="space-y-3">
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-5/6" />
          </div>

          {/* Code block placeholder */}
          <Skeleton variant="rectangular" className="w-full h-32 mt-6" />

          {/* Paragraph 4 */}
          <div className="space-y-3 mt-6">
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-3/4" />
          </div>
        </div>
      </article>

      {/* Sidebar placeholder */}
      <div className="mt-8 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
          <Skeleton variant="text" className="h-6 w-1/3" />
          <div className="space-y-3">
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-4/5" />
            <Skeleton variant="text" className="w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
