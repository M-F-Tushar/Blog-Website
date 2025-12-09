import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';

export interface PerformanceMetrics {
  CLS: number | null;
  FID: number | null;
  FCP: number | null;
  LCP: number | null;
  TTFB: number | null;
  INP: number | null;
}

type MetricCallback = (metrics: PerformanceMetrics) => void;

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    CLS: null,
    FID: null,
    FCP: null,
    LCP: null,
    TTFB: null,
    INP: null,
  };

  private callbacks: MetricCallback[] = [];

  /**
   * Initialize performance monitoring
   */
  public initPerformanceMonitoring(reportCallback?: MetricCallback): void {
    if (reportCallback) {
      this.callbacks.push(reportCallback);
    }

    // Collect all Core Web Vitals
    onCLS(this.handleMetric.bind(this));
    onFCP(this.handleMetric.bind(this));
    onLCP(this.handleMetric.bind(this));
    onTTFB(this.handleMetric.bind(this));
    onINP(this.handleMetric.bind(this));
  }

  private handleMetric(metric: Metric): void {
    // Update metrics
    this.metrics[metric.name as keyof PerformanceMetrics] = metric.value;

    // Notify callbacks
    this.callbacks.forEach((callback) => {
      callback(this.getPerformanceMetrics());
    });

    // Log in development
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`[Performance] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
      });
    }
  }

  /**
   * Get current metrics
   */
  public getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Performance budget alerts (console warnings in dev)
   */
  public checkPerformanceBudget(metrics: PerformanceMetrics): void {
    if (!import.meta.env.DEV) return;

    const budgets = {
      LCP: 2500, // 2.5s
      FID: 100, // 100ms
      INP: 200, // 200ms
      CLS: 0.1, // 0.1
      FCP: 1800, // 1.8s
      TTFB: 800, // 800ms
    };

    Object.entries(budgets).forEach(([key, budget]) => {
      const value = metrics[key as keyof PerformanceMetrics];
      if (value !== null && value > budget) {
        // eslint-disable-next-line no-console
        console.warn(
          `⚠️ Performance Budget Exceeded: ${key} is ${value.toFixed(2)} (budget: ${budget})`
        );
      }
    });
  }

  /**
   * Get navigation timing breakdown
   */
  public getNavigationTiming(): Record<string, number> | null {
    if (!performance.getEntriesByType) return null;

    const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (!entry) return null;

    return {
      dns: entry.domainLookupEnd - entry.domainLookupStart,
      tcp: entry.connectEnd - entry.connectStart,
      request: entry.responseStart - entry.requestStart,
      response: entry.responseEnd - entry.responseStart,
      domProcessing: entry.domComplete - entry.domInteractive,
      domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      onLoad: entry.loadEventEnd - entry.loadEventStart,
      total: entry.loadEventEnd - entry.fetchStart,
    };
  }

  /**
   * Get resource timing analysis
   */
  public getResourceTiming(): {
    total: number;
    byType: Record<string, number>;
    largest: PerformanceResourceTiming[];
  } {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    const byType: Record<string, number> = {};
    resources.forEach((resource) => {
      const type = this.getResourceType(resource.name);
      byType[type] = (byType[type] || 0) + 1;
    });

    const largest = resources
      .sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0))
      .slice(0, 10);

    return {
      total: resources.length,
      byType,
      largest,
    };
  }

  private getResourceType(url: string): string {
    if (url.match(/\.(css)$/)) return 'CSS';
    if (url.match(/\.(js)$/)) return 'JS';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp|avif)$/)) return 'Image';
    if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'Font';
    return 'Other';
  }

  /**
   * Calculate performance grade (A/B/C/D/F)
   */
  public getPerformanceGrade(metrics: PerformanceMetrics): string {
    let score = 0;
    let count = 0;

    const ratings = {
      LCP: { good: 2500, needsImprovement: 4000 },
      FID: { good: 100, needsImprovement: 300 },
      INP: { good: 200, needsImprovement: 500 },
      CLS: { good: 0.1, needsImprovement: 0.25 },
      FCP: { good: 1800, needsImprovement: 3000 },
      TTFB: { good: 800, needsImprovement: 1800 },
    };

    Object.entries(ratings).forEach(([key, thresholds]) => {
      const value = metrics[key as keyof PerformanceMetrics];
      if (value !== null) {
        count++;
        if (value <= thresholds.good) {
          score += 100;
        } else if (value <= thresholds.needsImprovement) {
          score += 50;
        } else {
          score += 0;
        }
      }
    });

    if (count === 0) return 'N/A';

    const average = score / count;
    if (average >= 90) return 'A';
    if (average >= 75) return 'B';
    if (average >= 60) return 'C';
    if (average >= 50) return 'D';
    return 'F';
  }
}

// Export singleton instance
const performanceMonitor = new PerformanceMonitor();

export const initPerformanceMonitoring =
  performanceMonitor.initPerformanceMonitoring.bind(performanceMonitor);
export const getPerformanceMetrics =
  performanceMonitor.getPerformanceMetrics.bind(performanceMonitor);
export const checkPerformanceBudget =
  performanceMonitor.checkPerformanceBudget.bind(performanceMonitor);
export const getNavigationTiming = performanceMonitor.getNavigationTiming.bind(performanceMonitor);
export const getResourceTiming = performanceMonitor.getResourceTiming.bind(performanceMonitor);
export const getPerformanceGrade = performanceMonitor.getPerformanceGrade.bind(performanceMonitor);
