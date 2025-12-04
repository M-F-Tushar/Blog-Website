/**
 * Error tracking utility
 * Captures and logs errors for monitoring
 */

interface ErrorReport {
  message: string;
  stack?: string;
  componentStack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  severity: 'error' | 'warning' | 'info';
}

class ErrorTracker {
  private enabled: boolean;
  private endpoint: string | null;
  private errorCount: number = 0;
  private maxErrors: number = 10; // Prevent flooding

  constructor() {
    // Disable error tracking by default for static hosting (GitHub Pages)
    // Only enable if explicitly configured
    this.enabled = import.meta.env.VITE_ERROR_TRACKING_ENABLED === 'true';
    this.endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT || null;

    // Warn if enabled but no endpoint configured
    if (this.enabled && !this.endpoint) {
      console.warn(
        '[Error Tracker] Error tracking is enabled but no VITE_ANALYTICS_ENDPOINT is configured. Errors will only be logged to console.'
      );
    }
  }

  /**
   * Initialize error tracking
   */
  init(): void {
    if (!this.enabled) return;

    // Capture unhandled errors
    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), 'error');
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(new Error(`Unhandled Promise Rejection: ${event.reason}`), 'error');
    });
  }

  /**
   * Capture and report an error
   */
  captureError(
    error: Error,
    severity: 'error' | 'warning' | 'info' = 'error',
    componentStack?: string
  ): void {
    if (!this.enabled || this.errorCount >= this.maxErrors) return;

    this.errorCount++;

    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      severity,
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('[Error Tracker]', errorReport);
    }

    // Send to endpoint
    this.reportError(errorReport);
  }

  /**
   * Capture a warning
   */
  captureWarning(message: string, context?: Record<string, unknown>): void {
    this.captureError(new Error(message), 'warning');

    if (import.meta.env.DEV && context) {
      console.warn('[Warning]', message, context);
    }
  }

  /**
   * Capture info message
   */
  captureInfo(message: string, context?: Record<string, unknown>): void {
    this.captureError(new Error(message), 'info');

    if (import.meta.env.DEV && context) {
      console.info('[Info]', message, context);
    }
  }

  /**
   * Report error to endpoint
   */
  private async reportError(errorReport: ErrorReport): Promise<void> {
    // If no endpoint configured, only log to console
    if (!this.endpoint) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[Error Tracker] No endpoint configured, error logged above');
      }
      return;
    }

    try {
      const data = JSON.stringify({
        name: 'error',
        properties: {
          message: errorReport.message,
          stack: errorReport.stack?.substring(0, 500), // Limit stack trace length
          severity: errorReport.severity,
          url: errorReport.url,
        },
        timestamp: errorReport.timestamp,
      });

      // Check if endpoint is reachable before trying to send
      if (navigator.sendBeacon) {
        navigator.sendBeacon(this.endpoint, data);
      } else {
        await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: data,
          keepalive: true,
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(5000),
        });
      }
    } catch (error) {
      // Silently fail - don't create error loops
      // Only log in development
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.debug('[Error Tracker] Failed to send error to endpoint:', error);
      }
    }
  }

  /**
   * Reset error count (useful for testing)
   */
  reset(): void {
    this.errorCount = 0;
  }
}

// Export singleton instance
export const errorTracker = new ErrorTracker();

// Export for testing
export { ErrorTracker };
export type { ErrorReport };
