import { supabase, isSupabaseConfigured } from '../supabase/client';

export interface PostViewStats {
  postId: string;
  title: string;
  category: string;
  status: string;
  totalViews: number;
  uniqueViews: number;
  viewsLast7Days: number;
  viewsLast30Days: number;
}

export interface DashboardStats {
  totalViews: number;
  avgViewsPerPost: number;
  trendPercentage: number;
  trendPositive: boolean;
  postStats: PostViewStats[];
}

/**
 * Record a page view for a post
 * Should be called when a user views a blog post
 */
export async function recordPageView(postId: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    // Fallback: store in localStorage for development
    const key = `views_${postId}`;
    const currentViews = parseInt(localStorage.getItem(key) || '0', 10);
    localStorage.setItem(key, String(currentViews + 1));
    return;
  }

  try {
    // Generate a session ID for this browser session
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }

    // Use the Supabase function to record the view
    // @ts-expect-error - post_views table and record_page_view function may not be in generated types yet
    await supabase.rpc('record_page_view', {
      p_post_id: postId,
      p_session_id: sessionId,
      p_referrer: document.referrer || null,
      p_user_agent: navigator.userAgent || null,
    });
  } catch (error) {
    console.error('Error recording page view:', error);
    // Silently fail - don't break the user experience for analytics
  }
}

/**
 * Get aggregated view statistics for all posts
 */
export async function getPostViewStats(): Promise<PostViewStats[]> {
  if (!isSupabaseConfigured() || !supabase) {
    // Fallback: return empty stats for development
    return [];
  }

  // Interface for the post_statistics view row
  interface PostStatisticsRow {
    post_id: string;
    title: string;
    category: string | null;
    status: string | null;
    total_views: number | null;
    unique_views: number | null;
    views_last_7_days: number | null;
    views_last_30_days: number | null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).from('post_statistics').select('*');

    if (error) {
      console.error('Error fetching post statistics:', error);
      return [];
    }

    return ((data || []) as PostStatisticsRow[]).map((row) => ({
      postId: row.post_id,
      title: row.title,
      category: row.category || 'Uncategorized',
      status: row.status || 'draft',
      totalViews: row.total_views || 0,
      uniqueViews: row.unique_views || 0,
      viewsLast7Days: row.views_last_7_days || 0,
      viewsLast30Days: row.views_last_30_days || 0,
    }));
  } catch (error) {
    console.error('Error fetching post statistics:', error);
    return [];
  }
}

/**
 * Get dashboard statistics with trend calculation
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const postStats = await getPostViewStats();

  const totalViews = postStats.reduce((sum, p) => sum + p.totalViews, 0);
  const publishedPosts = postStats.filter((p) => p.status === 'Published');
  const avgViewsPerPost =
    publishedPosts.length > 0 ? Math.round(totalViews / publishedPosts.length) : 0;

  // Calculate trend: compare last 7 days vs previous 7 days
  const viewsLast7Days = postStats.reduce((sum, p) => sum + p.viewsLast7Days, 0);
  const viewsLast30Days = postStats.reduce((sum, p) => sum + p.viewsLast30Days, 0);
  const viewsPrev7Days = viewsLast30Days - viewsLast7Days;

  let trendPercentage = 0;
  let trendPositive = true;

  if (viewsPrev7Days > 0) {
    trendPercentage = Math.round(((viewsLast7Days - viewsPrev7Days) / viewsPrev7Days) * 100);
    trendPositive = trendPercentage >= 0;
  } else if (viewsLast7Days > 0) {
    trendPercentage = 100; // All new views
    trendPositive = true;
  }

  return {
    totalViews,
    avgViewsPerPost,
    trendPercentage: Math.abs(trendPercentage),
    trendPositive,
    postStats,
  };
}

/**
 * Get fallback stats using localStorage (for development without Supabase)
 */
export function getLocalStorageStats(
  posts: { id: string; title: string; category: string }[]
): PostViewStats[] {
  return posts.map((post) => {
    const views = parseInt(localStorage.getItem(`views_${post.id}`) || '0', 10);
    return {
      postId: post.id,
      title: post.title,
      category: post.category,
      status: 'Published',
      totalViews: views,
      uniqueViews: views,
      viewsLast7Days: Math.floor(views * 0.3), // Rough estimate
      viewsLast30Days: views,
    };
  });
}
