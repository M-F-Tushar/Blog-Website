import React from 'react';
import { RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col justify-center items-center py-12 gap-4">
      <div className={`animate-spin rounded-full border-b-2 border-accent ${sizeClasses[size]}`} />
      {message && <p className="text-sm text-secondary-500 animate-pulse">{message}</p>}
    </div>
  );
};

const shimmerClass = `
  relative overflow-hidden
  before:absolute before:inset-0
  before:-translate-x-full
  before:animate-[shimmer_2s_infinite]
  before:bg-gradient-to-r
  before:from-transparent before:via-white/30 before:to-transparent
`;

export const SkeletonCard: React.FC = () => (
  <div className="bg-surface border border-white/10 rounded-xl shadow-md overflow-hidden">
    <div className={`h-48 bg-secondary-800 ${shimmerClass}`} />
    <div className="p-6 space-y-3">
      <div className={`h-4 bg-secondary-800 rounded w-3/4 ${shimmerClass}`} />
      <div className={`h-4 bg-secondary-800 rounded ${shimmerClass}`} />
      <div className={`h-4 bg-secondary-800 rounded w-5/6 ${shimmerClass}`} />
    </div>
  </div>
);

export const SkeletonPost: React.FC = () => (
  <div className="space-y-4">
    <div className={`h-8 bg-secondary-800 rounded w-3/4 ${shimmerClass}`} />
    <div className={`h-4 bg-secondary-800 rounded w-1/4 ${shimmerClass}`} />
    <div className={`h-64 bg-secondary-800 rounded ${shimmerClass}`} />
    <div className="space-y-2">
      <div className={`h-4 bg-secondary-800 rounded ${shimmerClass}`} />
      <div className={`h-4 bg-secondary-800 rounded ${shimmerClass}`} />
      <div className={`h-4 bg-secondary-800 rounded w-5/6 ${shimmerClass}`} />
    </div>
  </div>
);

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="mb-4 rounded-full bg-error-500/10 p-3 text-error-400">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-secondary-50 mb-2">Oops!</h3>
    <p className="text-secondary-400 text-center mb-6 max-w-md">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-600 text-white font-semibold rounded-xl shadow-md transition-colors"
      >
        <RefreshCw size={18} />
        Try Again
      </button>
    )}
  </div>
);

interface LoadingProgressProps {
  progress: number;
  message?: string;
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({ progress, message }) => (
  <div className="w-full max-w-md mx-auto py-8">
    <div className="mb-2 flex justify-between items-center">
      <span className="text-sm font-medium text-secondary-300">{message || 'Loading...'}</span>
      <span className="text-sm font-medium text-accent">{Math.round(progress)}%</span>
    </div>
    <div className="w-full bg-secondary-800 rounded-full h-2.5 overflow-hidden">
      <div
        className="bg-accent h-2.5 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);
