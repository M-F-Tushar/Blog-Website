import React, { useMemo } from 'react';
import { usePosts } from '../../hooks/usePosts';
import { useRecommendations } from '../../hooks/useRecommendations';
import { PostStatus } from '../../types/types';
import { useSiteSettings } from '../../hooks/useSiteSettings';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  glowColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, glowColor }) => (
  <div className="admin-glass-cosmic rounded-2xl p-6 flex items-center hover:shadow-cosmic-card hover:-translate-y-0.5 transition-all duration-300 group">
    <div
      className="p-3 rounded-xl mr-4"
      style={{ background: `${glowColor}15`, boxShadow: `0 0 20px ${glowColor}20` }}
    >
      <div style={{ color: glowColor }}>{icon}</div>
    </div>
    <div>
      <p className="text-sm font-medium text-secondary-400">{title}</p>
      <p className="text-2xl font-bold text-secondary-50">{value}</p>
    </div>
  </div>
);

const DocumentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const TagIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 15h2v2H7v-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 15h2v2h-2v-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20h10a2 2 0 002-2V7" />
  </svg>
);

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

const CategoryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    />
  </svg>
);

const DashboardAnalytics: React.FC = () => {
  const { posts } = usePosts();
  const { recommendations } = useRecommendations();
  const { categories } = useSiteSettings();

  const stats = useMemo(() => {
    const publishedPosts = posts.filter((p) => p.status === PostStatus.PUBLISHED).length;
    const draftPosts = posts.filter((p) => p.status === PostStatus.DRAFT).length;
    const totalPosts = posts.length;
    const totalTags = new Set(posts.flatMap((p) => p.tags)).size;

    return {
      publishedPosts,
      draftPosts,
      totalPosts,
      totalTags,
      totalRecommendations: recommendations.length,
      totalCategories: categories.length,
    };
  }, [posts, recommendations, categories]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Total Posts"
        value={stats.totalPosts}
        icon={<DocumentIcon />}
        glowColor="#06b6d4"
      />
      <StatCard
        title="Published"
        value={stats.publishedPosts}
        icon={<DocumentIcon />}
        glowColor="#22c55e"
      />
      <StatCard
        title="Drafts"
        value={stats.draftPosts}
        icon={<DocumentIcon />}
        glowColor="#f59e0b"
      />
      <StatCard
        title="Recommendations"
        value={stats.totalRecommendations}
        icon={<StarIcon />}
        glowColor="#8b5cf6"
      />
      <StatCard
        title="Unique Tags"
        value={stats.totalTags}
        icon={<TagIcon />}
        glowColor="#ec4899"
      />
      <StatCard
        title="Categories"
        value={stats.totalCategories}
        icon={<CategoryIcon />}
        glowColor="#14b8a6"
      />
    </div>
  );
};

export default DashboardAnalytics;
