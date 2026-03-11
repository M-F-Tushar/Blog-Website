import React from 'react';
import { RefreshCw } from 'lucide-react';

// Enhanced Loading Spinner with size options
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col justify-center items-center py-12 gap-4">
      <div className={`animate-spin rounded-full border-b-2 border-accent ${sizeClasses[size]}`} />
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

// Shimmer effect skeleton with gradient animation
const shimmerClass = `
  relative overflow-hidden
  before:absolute before:inset-0
  before:-translate-x-full
  before:animate-[shimmer_2s_infinite]
  before:bg-gradient-to-r
  before:from-transparent before:via-white/60 dark:before:via-gray-600/30 before:to-transparent
`;

export const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div className={`h-48 bg-gray-200 dark:bg-gray-700 ${shimmerClass}`} />
    <div className="p-6 space-y-3">
      <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 ${shimmerClass}`} />
      <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${shimmerClass}`} />
      <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 ${shimmerClass}`} />
    </div>
  </div>
);

export const SkeletonPost: React.FC = () => (
  <div className="space-y-4">
    <div className={`h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 ${shimmerClass}`} />
    <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 ${shimmerClass}`} />
    <div className={`h-64 bg-gray-200 dark:bg-gray-700 rounded ${shimmerClass}`} />
    <div className="space-y-2">
      <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${shimmerClass}`} />
      <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${shimmerClass}`} />
      <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 ${shimmerClass}`} />
    </div>
  </div>
);

// Error state with retry button
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong',
  onRetry
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="text-6xl mb-4">⚠️</div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      Oops!
    </h3>
    <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
      {message}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors"
      >
        <RefreshCw size={18} />
        Try Again
      </button>
    )}
  </div>
);

// Loading progress bar
interface LoadingProgressProps {
  progress: number; // 0-100
  message?: string;
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({ progress, message }) => (
  <div className="w-full max-w-md mx-auto py-8">
    <div className="mb-2 flex justify-between items-center">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {message || 'Loading...'}
      </span>
      <span className="text-sm font-medium text-accent">
        {Math.round(progress)}%
      </span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
      <div
        className="bg-accent h-2.5 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);
