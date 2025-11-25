/**
 * Privacy-focused analytics utility
 * Tracks page views and events without cookies or PII
 */

interface AnalyticsEvent {
    name: string;
    properties?: Record<string, string | number | boolean>;
}

class Analytics {
    private enabled: boolean;
    private endpoint: string;

    constructor() {
        this.enabled = import.meta.env.VITE_ANALYTICS_ENABLED === 'true';
        this.endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT || '/api/analytics';
    }

    /**
     * Track a page view
     */
    trackPageView(path: string, title?: string): void {
        if (!this.enabled) return;

        this.sendEvent({
            name: 'pageview',
            properties: {
                path,
                title: title || document.title,
                referrer: document.referrer,
                screen: `${window.screen.width}x${window.screen.height}`,
            },
        });
    }

    /**
     * Track a custom event
     */
    trackEvent(name: string, properties?: Record<string, string | number | boolean>): void {
        if (!this.enabled) return;

        this.sendEvent({
            name,
            properties,
        });
    }

    /**
     * Track search queries
     */
    trackSearch(query: string, resultsCount: number): void {
        this.trackEvent('search', {
            query: query.substring(0, 100), // Limit length for privacy
            resultsCount,
        });
    }

    /**
     * Track bookmark actions
     */
    trackBookmark(action: 'add' | 'remove', postId: string): void {
        this.trackEvent('bookmark', {
            action,
            postId,
        });
    }

    /**
     * Track comment actions
     */
    trackComment(action: 'post' | 'reply' | 'delete'): void {
        this.trackEvent('comment', {
            action,
        });
    }

    /**
     * Track theme changes
     */
    trackThemeChange(theme: 'light' | 'dark'): void {
        this.trackEvent('theme_change', {
            theme,
        });
    }

    /**
     * Send event to analytics endpoint
     */
    private async sendEvent(event: AnalyticsEvent): Promise<void> {
        try {
            // Use sendBeacon for better reliability
            if (navigator.sendBeacon) {
                const data = JSON.stringify({
                    ...event,
                    timestamp: new Date().toISOString(),
                    url: window.location.href,
                    userAgent: navigator.userAgent,
                });

                navigator.sendBeacon(this.endpoint, data);
            } else {
                // Fallback to fetch
                await fetch(this.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...event,
                        timestamp: new Date().toISOString(),
                        url: window.location.href,
                    }),
                    keepalive: true,
                });
            }
        } catch (error) {
            // Silently fail - don't break the app for analytics
            console.debug('Analytics error:', error);
        }
    }
}

// Export singleton instance
export const analytics = new Analytics();

// Export for testing
export { Analytics };
