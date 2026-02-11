import { useState, useEffect, useCallback } from 'react';
import {
  getDashboardStats,
  getLocalStorageStats,
  DashboardStats,
} from '../services/analyticsService';
import { isSupabaseConfigured } from '../supabase/client';
import { usePosts } from './usePosts';

interface UseDashboardAnalyticsReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  isUsingFallback: boolean;
}

/**
 * Hook to fetch and manage analytics data for the admin dashboard
 */
export function useDashboardAnalytics(): UseDashboardAnalyticsReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const { posts } = usePosts();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (isSupabaseConfigured()) {
        const dashboardStats = await getDashboardStats();

        // If no stats from Supabase (table might not exist yet), use fallback
        if (dashboardStats.postStats.length === 0 && posts.length > 0) {
          const fallbackStats = getLocalStorageStats(
            posts.map((p) => ({ id: p.id, title: p.title, category: p.category }))
          );

          const totalViews = fallbackStats.reduce((sum, p) => sum + p.totalViews, 0);
          const publishedPosts = posts.filter((p) => p.status === 'Published');

          setStats({
            totalViews,
            avgViewsPerPost:
              publishedPosts.length > 0 ? Math.round(totalViews / publishedPosts.length) : 0,
            trendPercentage: 0,
            trendPositive: true,
            postStats: fallbackStats,
          });
          setIsUsingFallback(true);
        } else {
          setStats(dashboardStats);
          setIsUsingFallback(false);
        }
      } else {
        // No Supabase, use localStorage fallback
        const fallbackStats = getLocalStorageStats(
          posts.map((p) => ({ id: p.id, title: p.title, category: p.category }))
        );

        const totalViews = fallbackStats.reduce((sum, p) => sum + p.totalViews, 0);
        const publishedPosts = posts.filter((p) => p.status === 'Published');

        setStats({
          totalViews,
          avgViewsPerPost:
            publishedPosts.length > 0 ? Math.round(totalViews / publishedPosts.length) : 0,
          trendPercentage: 0,
          trendPositive: true,
          postStats: fallbackStats,
        });
        setIsUsingFallback(true);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');

      // Fall back to localStorage on error
      const fallbackStats = getLocalStorageStats(
        posts.map((p) => ({ id: p.id, title: p.title, category: p.category }))
      );

      const totalViews = fallbackStats.reduce((sum, p) => sum + p.totalViews, 0);
      const publishedPosts = posts.filter((p) => p.status === 'Published');

      setStats({
        totalViews,
        avgViewsPerPost:
          publishedPosts.length > 0 ? Math.round(totalViews / publishedPosts.length) : 0,
        trendPercentage: 0,
        trendPositive: true,
        postStats: fallbackStats,
      });
      setIsUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, [posts]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
    isUsingFallback,
  };
}
