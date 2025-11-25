import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

/**
 * Web Vitals monitoring utility
 * Tracks Core Web Vitals and reports to analytics
 */

interface VitalsMetric {
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    delta: number;
    id: string;
}

class WebVitalsMonitor {
    private enabled: boolean;
    private metrics: Map<string, VitalsMetric> = new Map();

    constructor() {
        this.enabled = import.meta.env.VITE_ANALYTICS_ENABLED === 'true';
    }

    /**
     * Initialize Web Vitals monitoring
     */
    init(): void {
        if (!this.enabled) return;

        // Track all Core Web Vitals
        onCLS(this.handleMetric.bind(this));
        onINP(this.handleMetric.bind(this)); // INP replaces FID
        onFCP(this.handleMetric.bind(this));
        onLCP(this.handleMetric.bind(this));
        onTTFB(this.handleMetric.bind(this));
    }

    /**
     * Handle metric updates
     */
    private handleMetric(metric: Metric): void {
        const vitalsMetric: VitalsMetric = {
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            id: metric.id,
        };

        this.metrics.set(metric.name, vitalsMetric);

        // Log in development
        if (import.meta.env.DEV) {
            console.log(`[Web Vitals] ${metric.name}:`, {
                value: metric.value,
                rating: metric.rating,
            });
        }

        // Send to analytics
        this.reportMetric(vitalsMetric);
    }

    /**
     * Report metric to analytics endpoint
     */
    private async reportMetric(metric: VitalsMetric): Promise<void> {
        try {
            const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT || '/api/analytics';

            const data = JSON.stringify({
                name: 'web_vitals',
                properties: {
                    metric: metric.name,
                    value: Math.round(metric.value),
                    rating: metric.rating,
                    url: window.location.pathname,
                },
                timestamp: new Date().toISOString(),
            });

            if (navigator.sendBeacon) {
                navigator.sendBeacon(endpoint, data);
            } else {
                await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: data,
                    keepalive: true,
                });
            }
        } catch (error) {
            console.debug('Web Vitals reporting error:', error);
        }
    }

    /**
     * Get all collected metrics
     */
    getMetrics(): Map<string, VitalsMetric> {
        return this.metrics;
    }

    /**
     * Get a specific metric
     */
    getMetric(name: string): VitalsMetric | undefined {
        return this.metrics.get(name);
    }
}

// Export singleton instance
export const webVitalsMonitor = new WebVitalsMonitor();

// Export for testing
export { WebVitalsMonitor };
export type { VitalsMetric };
