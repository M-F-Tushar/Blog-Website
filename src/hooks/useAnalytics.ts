import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../utils/analytics';

/**
 * Hook for analytics tracking
 * Automatically tracks page views on route changes
 */
export const useAnalytics = () => {
    const location = useLocation();

    // Track page views on route change
    useEffect(() => {
        analytics.trackPageView(location.pathname + location.search);
    }, [location]);

    return {
        trackEvent: analytics.trackEvent.bind(analytics),
        trackSearch: analytics.trackSearch.bind(analytics),
        trackBookmark: analytics.trackBookmark.bind(analytics),
        trackComment: analytics.trackComment.bind(analytics),
        trackThemeChange: analytics.trackThemeChange.bind(analytics),
    };
};
