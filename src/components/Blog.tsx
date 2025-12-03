import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Sparkles } from 'lucide-react';
import Card from './Card';
import { usePosts } from '../hooks/usePosts';
import { PostStatus } from '../types/types';
import Pagination from './Pagination';
import useSEO from '../hooks/useSEO';
import { CardSkeleton } from './ui/CardSkeleton';
import { EmptyState } from './common/EmptyState';
import ViewToggle, { ViewMode, SortOption } from './common/ViewToggle';
import { useLocalStorage } from '../hooks/useLocalStorage';

const POSTS_PER_PAGE = 9;

const Blog: React.FC = () => {
  useSEO({
    title: 'Blog',
    description: 'Read my latest articles about web development, programming, and technology.',
  });

  const { posts, loading, error } = usePosts();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // View and Sort Preferences
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('blog-view-mode', 'grid');
  const [sortBy, setSortBy] = useLocalStorage<SortOption>('blog-sort-by', 'newest');

  const publishedPosts = useMemo(() => {
    let filtered = posts.filter((p) => p.status === PostStatus.PUBLISHED);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.excerpt.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Sorting Logic
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'popular':
          return b.content.length - a.content.length;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [posts, sortBy, searchQuery]);

  const totalPages = Math.ceil(publishedPosts.length / POSTS_PER_PAGE);

  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return publishedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [currentPage, publishedPosts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Container classes based on ViewMode
  const gridClasses = {
    grid: 'grid gap-8 md:grid-cols-2 lg:grid-cols-3',
    list: 'flex flex-col gap-8 max-w-4xl mx-auto',
    compact: 'flex flex-col gap-4 max-w-3xl mx-auto',
  };

  if (loading) {
    return (
      <div className="space-y-12 container-padding py-12">
        <div className="text-center space-y-4">
          <div className="h-12 w-48 bg-secondary-200 dark:bg-secondary-800 rounded-full mx-auto animate-pulse" />
          <div className="h-6 w-96 bg-secondary-100 dark:bg-secondary-800 rounded-full mx-auto animate-pulse" />
        </div>
        <div className={gridClasses[viewMode]}>
          <CardSkeleton viewMode={viewMode} count={POSTS_PER_PAGE} />
        </div>
      </div>
    );
  }

  if (error) {
    return <EmptyState icon="⚠️" title="Error Loading Posts" description={error} />;
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Header Section */}
      <section className="relative py-12 md:py-16 bg-secondary-50 dark:bg-secondary-900/50 -mt-8 px-4">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 mb-6 shadow-sm">
              <Sparkles size={16} className="text-accent-500" />
              <span className="text-sm font-medium text-secondary-600 dark:text-secondary-300">
                Explore my thoughts & tutorials
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold font-serif text-secondary-900 dark:text-white mb-6">
              The <span className="text-gradient">Blog</span>
            </h1>

            <p className="text-lg md:text-xl text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto leading-relaxed">
              Discover articles on web development, software engineering, and the latest tech
              trends.
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-xl mx-auto relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-lg shadow-secondary-200/50 dark:shadow-none transition-all"
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400"
                size={20}
              />
            </div>
          </motion.div>
        </div>

        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-200/20 dark:bg-accent-900/10 rounded-full blur-3xl" />
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 sticky top-20 z-30 bg-white/80 dark:bg-secondary-950/80 backdrop-blur-md p-4 rounded-2xl border border-secondary-200 dark:border-secondary-800 shadow-sm">
          <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400">
            <Filter size={18} />
            <span className="font-medium">
              Showing {publishedPosts.length} {publishedPosts.length === 1 ? 'post' : 'posts'}
            </span>
          </div>

          <ViewToggle
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>

        {/* Posts Grid */}
        {currentPosts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={gridClasses[viewMode]}
          >
            {currentPosts.map((post) => (
              <Card key={post.id} post={post} viewMode={viewMode} />
            ))}
          </motion.div>
        ) : (
          <EmptyState
            icon="🔍"
            title="No posts found"
            description={
              searchQuery
                ? `No results found for "${searchQuery}"`
                : 'No posts available at the moment.'
            }
            actionLabel={searchQuery ? 'Clear Search' : 'Go Home'}
            onAction={searchQuery ? () => setSearchQuery('') : undefined}
            actionLink={!searchQuery ? '/' : undefined}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalResults={publishedPosts.length}
              resultsPerPage={POSTS_PER_PAGE}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
