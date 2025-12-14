import React, { useMemo, useState } from 'react';
import { usePosts } from '../../hooks/usePosts';
import { useRecommendations } from '../../hooks/useRecommendations';
import { PostStatus } from '../../types/types';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useDashboardAnalytics } from '../../hooks/useDashboardAnalytics';
import {
  Eye,
  TrendingUp,
  FileText,
  Tag,
  Star,
  FolderOpen,
  BarChart2,
  Clock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  isFallback?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, isFallback }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
    <div className="p-3 bg-accent/20 rounded-full mr-4 text-accent dark:text-accent-light">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
        {isFallback && (
          <span className="ml-1 text-xs text-yellow-500" title="Using local data">
            (local)
          </span>
        )}
      </p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
    {trend && trend.value > 0 && (
      <div className={`text-sm font-medium ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
        {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
      </div>
    )}
  </div>
);

const DashboardAnalytics: React.FC = () => {
  const { posts } = usePosts();
  const { recommendations } = useRecommendations();
  const { categories } = useSiteSettings();
  const {
    stats: analyticsStats,
    isUsingFallback,
    refresh,
    loading: analyticsLoading,
  } = useDashboardAnalytics();
  const [activeTab, setActiveTab] = useState<'overview' | 'popular' | 'activity'>('overview');

  const stats = useMemo(() => {
    const publishedPosts = posts.filter((p) => p.status === PostStatus.PUBLISHED);
    const draftPosts = posts.filter((p) => p.status === PostStatus.DRAFT);

    // Use real analytics data if available
    const totalViews = analyticsStats?.totalViews || 0;
    const avgViews = analyticsStats?.avgViewsPerPost || 0;
    const trendPercentage = analyticsStats?.trendPercentage || 0;
    const trendPositive = analyticsStats?.trendPositive ?? true;

    // Get top performing posts from analytics or compute from posts
    const popularPosts = (analyticsStats?.postStats || [])
      .filter((p) => p.status === 'Published')
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, 5)
      .map((p) => ({
        id: p.postId,
        title: p.title,
        category: p.category,
        views: p.totalViews,
      }));

    // Category distribution
    const categoryStats = categories.reduce(
      (acc, cat) => {
        acc[cat] = posts.filter((p) => p.category === cat).length;
        return acc;
      },
      {} as Record<string, number>
    );

    // Recent activity (posts from last 30 days)
    // eslint-disable-next-line
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentPosts = posts.filter((p) => new Date(p.date).getTime() > thirtyDaysAgo);

    return {
      publishedCount: publishedPosts.length,
      draftCount: draftPosts.length,
      totalPosts: posts.length,
      totalTags: new Set(posts.flatMap((p) => p.tags)).size,
      totalRecommendations: recommendations.length,
      totalCategories: categories.length,
      totalViews,
      avgViews,
      trendPercentage,
      trendPositive,
      popularPosts,
      categoryStats,
      recentPosts,
    };
  }, [posts, recommendations, categories, analyticsStats]);

  // Generate mock activity log
  const activityLog = useMemo(() => {
    const activities: Array<{
      action: string;
      item: string;
      time: string;
      type: 'post' | 'setting' | 'user';
    }> = [];

    posts.slice(0, 5).forEach((post) => {
      activities.push({
        action: 'Published',
        item: post.title,
        time: post.date,
        type: 'post',
      });
    });

    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 8);
  }, [posts]);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart2 },
          { id: 'popular', label: 'Popular Content', icon: TrendingUp },
          { id: 'activity', label: 'Activity', icon: Clock },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === id
                ? 'bg-accent text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Fallback notice */}
          {isUsingFallback && (
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300 text-sm">
                <AlertCircle size={16} />
                <span>
                  View statistics are using local data. Run the SQL migration to enable real
                  analytics.
                </span>
              </div>
              <button
                onClick={refresh}
                disabled={analyticsLoading}
                className="flex items-center gap-1 px-3 py-1 text-sm text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-800 rounded transition-colors"
              >
                <RefreshCw size={14} className={analyticsLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Views"
              value={stats.totalViews.toLocaleString()}
              icon={<Eye size={24} />}
              trend={{ value: stats.trendPercentage, positive: stats.trendPositive }}
              isFallback={isUsingFallback}
            />
            <StatCard
              title="Avg. Views/Post"
              value={stats.avgViews.toLocaleString()}
              icon={<TrendingUp size={24} />}
              isFallback={isUsingFallback}
            />
            <StatCard title="Total Posts" value={stats.totalPosts} icon={<FileText size={24} />} />
            <StatCard
              title="Published"
              value={stats.publishedCount}
              icon={<FileText size={24} />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Drafts" value={stats.draftCount} icon={<FileText size={24} />} />
            <StatCard title="Unique Tags" value={stats.totalTags} icon={<Tag size={24} />} />
            <StatCard
              title="Categories"
              value={stats.totalCategories}
              icon={<FolderOpen size={24} />}
            />
            <StatCard
              title="Recommendations"
              value={stats.totalRecommendations}
              icon={<Star size={24} />}
            />
          </div>

          {/* Category Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Posts by Category
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.categoryStats).map(([category, count]) => (
                <div key={category} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-32 truncate">
                    {category}
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-accent h-full rounded-full transition-all"
                      style={{ width: `${(count / stats.totalPosts) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Popular Content Tab */}
      {activeTab === 'popular' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Performing Posts
          </h3>
          <div className="space-y-4">
            {stats.popularPosts.map((post, index) => (
              <div
                key={post.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-750"
              >
                <span
                  className={`text-2xl font-bold ${
                    index === 0
                      ? 'text-yellow-500'
                      : index === 1
                        ? 'text-gray-400'
                        : index === 2
                          ? 'text-amber-600'
                          : 'text-gray-500'
                  }`}
                >
                  #{index + 1}
                </span>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{post.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{post.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent">{post.views.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">views</p>
                </div>
              </div>
            ))}
            {stats.popularPosts.length === 0 && (
              <p className="text-gray-500 text-center py-4">No published posts yet</p>
            )}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {activityLog.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 border-l-4 border-accent bg-gray-50 dark:bg-gray-750 rounded-r-lg"
              >
                <div
                  className={`p-2 rounded-full ${
                    activity.type === 'post'
                      ? 'bg-blue-100 text-blue-600'
                      : activity.type === 'setting'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-green-100 text-green-600'
                  }`}
                >
                  {activity.type === 'post' ? (
                    <FileText size={16} />
                  ) : activity.type === 'setting' ? (
                    <FolderOpen size={16} />
                  ) : (
                    <Star size={16} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.action}</span>: {activity.item}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
            {activityLog.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAnalytics;
