import React, { useState, useMemo } from 'react';
import Card from './Card';
import { usePosts } from '../hooks/usePosts';
import { PostStatus } from '../types/types';
import Pagination from './Pagination';
import useSEO from '../hooks/useSEO';
import { SkeletonCard } from './common/LoadingSpinner';
import { EmptyState } from './common/EmptyState';
import ViewToggle, { ViewMode, SortOption } from './common/ViewToggle';
import { useLocalStorage } from '../hooks/useLocalStorage';

const POSTS_PER_PAGE = 6;

const Blog: React.FC = () => {
  useSEO({
    title: 'Blog',
    description: 'Read my latest articles about web development, programming, and technology.'
  });

  const { posts, loading, error } = usePosts();
  const [currentPage, setCurrentPage] = useState(1);

  // View and Sort Preferences
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('blog-view-mode', 'grid');
  const [sortBy, setSortBy] = useLocalStorage<SortOption>('blog-sort-by', 'newest');

  const publishedPosts = useMemo(() => {
    let filtered = posts.filter(p => p.status === PostStatus.PUBLISHED);

    // Sorting Logic
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'popular':
          // Mock popularity based on reading time or random for now since we don't have views
          return (b.content.length) - (a.content.length);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [posts, sortBy]);

  const totalPages = Math.ceil(publishedPosts.length / POSTS_PER_PAGE);

  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return publishedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [currentPage, publishedPosts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Container classes based on ViewMode
  const gridClasses = {
    grid: "grid gap-8 md:grid-cols-2 lg:grid-cols-3",
    list: "flex flex-col gap-8 max-w-4xl mx-auto",
    compact: "flex flex-col gap-4 max-w-3xl mx-auto"
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-white">Blog</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Error Loading Posts"
        description={error}
      />
    );
  }

  if (publishedPosts.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-white">Blog</h1>
        <EmptyState
          icon="📝"
          title="No Blog Posts Yet"
          description="New content is coming soon! Check back later for interesting articles and tutorials."
          actionLabel="Go Home"
          actionLink="/"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-white">From the Blog</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          My latest thoughts on technology, student life, and personal growth.
        </p>
      </div>

      {/* View Controls */}
      <ViewToggle
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {currentPosts.length > 0 ? (
        <div className={gridClasses[viewMode]}>
          {currentPosts.map((post) => (
            <Card key={post.id} post={post} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No posts found.</p>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalResults={publishedPosts.length}
          resultsPerPage={POSTS_PER_PAGE}
        />
      )}
    </div>
  );
};

export default Blog;
