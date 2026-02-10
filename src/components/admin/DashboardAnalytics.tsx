import React, { useMemo } from 'react';
import { usePosts } from '../../hooks/usePosts';
import { useRecommendations } from '../../hooks/useRecommendations';
import { PostStatus } from '../../types/types';
import { useSiteSettings } from '../../hooks/useSiteSettings';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-surface p-6 rounded-lg shadow-md flex items-center">
    <div className="p-3 bg-accent/20 rounded-full mr-4 text-accent dark:text-accent-light">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-secondary-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-secondary-50">{value}</p>
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
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4m5 4v4m-2-2h4M17 3l-1.172 3.516a1 1 0 00.95 1.484h3.444"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 21l-1.172-3.516a1 1 0 00-.95-1.484H6.434"
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
      <StatCard title="Total Posts" value={stats.totalPosts} icon={<DocumentIcon />} />
      <StatCard title="Published Posts" value={stats.publishedPosts} icon={<DocumentIcon />} />
      <StatCard title="Drafts" value={stats.draftPosts} icon={<DocumentIcon />} />
      <StatCard
        title="Total Recommendations"
        value={stats.totalRecommendations}
        icon={<StarIcon />}
      />
      <StatCard title="Unique Tags" value={stats.totalTags} icon={<TagIcon />} />
      <StatCard title="Categories" value={stats.totalCategories} icon={<CategoryIcon />} />
    </div>
  );
};

export default DashboardAnalytics;
