import React, { Component, ErrorInfo, ReactNode, Suspense } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { errorTracker } from '../../utils/errorTracking';
import { Skeleton } from '../ui/Skeleton';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  isRetrying: boolean;
}

class AsyncErrorBoundaryInner extends Component<Props, State> {
  private retryTimeout?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      isRetrying: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Async error caught:', error, errorInfo);
    errorTracker.captureError(error, 'error', errorInfo.componentStack || undefined);
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  handleRetry = () => {
    this.setState({ isRetrying: true });

    this.retryTimeout = setTimeout(() => {
      this.setState({
        hasError: false,
        error: undefined,
        isRetrying: false,
      });
      this.props.onReset?.();
    }, 1000);
  };

  render() {
    const { hasError, error, isRetrying } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      if (isRetrying) {
        // Show skeleton during retry
        return (
          <div className="space-y-4 p-6 animate-pulse">
            <Skeleton variant="rectangular" className="w-full h-32" />
            <div className="space-y-2">
              <Skeleton variant="text" className="w-full" />
              <Skeleton variant="text" className="w-5/6" />
              <Skeleton variant="text" className="w-4/5" />
            </div>
          </div>
        );
      }

      return (
        <div className="flex items-center justify-center p-8">
          <div className="max-w-sm w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-error-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Failed to Load
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {error?.message || 'Content could not be loaded'}
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

// Wrap with Suspense to handle async loading states
export const AsyncErrorBoundary: React.FC<Props> = ({ children, ...props }) => {
  return (
    <AsyncErrorBoundaryInner {...props}>
      <Suspense
        fallback={
          <div className="space-y-4 p-6 animate-pulse">
            <Skeleton variant="rectangular" className="w-full h-32" />
            <div className="space-y-2">
              <Skeleton variant="text" className="w-full" />
              <Skeleton variant="text" className="w-5/6" />
              <Skeleton variant="text" className="w-4/5" />
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
    </AsyncErrorBoundaryInner>
  );
};
