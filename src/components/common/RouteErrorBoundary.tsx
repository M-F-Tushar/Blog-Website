import React, { ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';
import { errorTracker } from '../../utils/errorTracking';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  is404: boolean;
}

export class RouteErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    is404: false,
  };

  constructor(props: Props) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Check if it's a 404 error
    const is404 = error.message.includes('404') || error.message.includes('not found');
    return { hasError: true, error, is404 };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Route error caught:', error, errorInfo);
    errorTracker.captureError(error, 'error', errorInfo.componentStack || undefined);
  }

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    const { hasError, error, is404 } = this.state;
    const { children } = this.props;

    if (hasError) {
      if (is404) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full text-center">
              <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                404
              </h1>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Page Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleGoBack}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="w-16 h-16 text-warning-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Route Error</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error?.message || 'An error occurred while loading this page'}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={this.handleGoBack}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </button>
                <Link
                  to="/"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}
