import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorTracker } from '../../utils/errorTracking';
import { AlertCircle, RefreshCw, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  maxRetries?: number;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  isRetrying: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeout?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
      isRetrying: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    // Track error
    errorTracker.captureError(error, 'error', errorInfo.componentStack || undefined);

    this.setState({ errorInfo });
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  handleReset = () => {
    const { onReset } = this.props;
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: 0,
      isRetrying: false,
    });
    onReset?.();
  };

  handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      return;
    }

    this.setState({ isRetrying: true });

    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.min(1000 * Math.pow(2, retryCount), 8000);

    this.retryTimeout = setTimeout(() => {
      this.setState((prevState) => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1,
        isRetrying: false,
      }));
    }, delay);
  };

  handleReportIssue = () => {
    const { error, errorInfo } = this.state;
    const repoUrl = import.meta.env.VITE_REPO_URL || 'https://github.com/M-F-Tushar/Blog-Website';
    const issueTitle = encodeURIComponent(`Bug: ${error?.message || 'Error'}`);
    const issueBody = encodeURIComponent(
      `## Description\nAn error occurred in the application.\n\n` +
        `## Error Message\n\`\`\`\n${error?.message || 'Unknown error'}\n\`\`\`\n\n` +
        `## Stack Trace\n\`\`\`\n${error?.stack || 'No stack trace available'}\n\`\`\`\n\n` +
        `## Component Stack\n\`\`\`\n${errorInfo?.componentStack || 'No component stack available'}\n\`\`\`\n\n` +
        `## Browser Info\n- User Agent: ${navigator.userAgent}\n` +
        `- URL: ${window.location.href}\n`
    );
    window.open(`${repoUrl}/issues/new?title=${issueTitle}&body=${issueBody}`, '_blank');
  };

  render() {
    const { hasError, error, isRetrying, retryCount } = this.state;
    const { fallback, children, maxRetries = 3 } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="w-16 h-16 text-error-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error?.message || 'An unexpected error occurred'}
              </p>

              {import.meta.env.DEV && (
                <details className="w-full mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    Error Details
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto max-h-40">
                    {error?.stack}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {retryCount < maxRetries && (
                  <button
                    onClick={this.handleRetry}
                    disabled={isRetrying}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                    {isRetrying ? 'Retrying...' : 'Try Again'}
                  </button>
                )}

                <button
                  onClick={this.handleReportIssue}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <Bug className="w-4 h-4" />
                  Report Issue
                </button>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Or reload the page
              </button>

              {retryCount > 0 && (
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  Retry attempt {retryCount} of {maxRetries}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}
