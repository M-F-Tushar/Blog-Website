import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePosts } from '../hooks/usePosts';
import { PostStatus } from '../types/types';
import Card from './Card';
import useSEO from '../hooks/useSEO';
import { EmptyState } from './common/EmptyState';
import SearchFilters, { FilterState } from './common/SearchFilters';
import { SlidersHorizontal, ArrowUpDown, Search as SearchIcon, Sparkles } from 'lucide-react';

type SortOption = 'relevance' | 'newest' | 'oldest';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { posts } = usePosts();

  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    tags: [],
    dateRange: 'all'
  });

  useSEO({
    title: `Search results for "${query}"`,
    description: `Find posts related to your search query: ${query}.`
  });

  // Get unique categories and tags
  const { availableCategories, availableTags } = useMemo(() => {
    const publishedPosts = posts.filter(p => p.status === PostStatus.PUBLISHED);
    const categories = Array.from(new Set(publishedPosts.map(p => p.category)));
    const tags = Array.from(new Set(publishedPosts.flatMap(p => p.tags)));
    return { availableCategories: categories, availableTags: tags };
  }, [posts]);

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const lowerCaseQuery = query.toLowerCase();
    const now = new Date();

    return posts.filter((post) => {
      // Text search
      const matchesQuery =
        post.title.toLowerCase().includes(lowerCaseQuery) ||
        post.excerpt.toLowerCase().includes(lowerCaseQuery) ||
        post.content.toLowerCase().includes(lowerCaseQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));

      if (!matchesQuery) return false;

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(post.category)) {
        return false;
      }

      // Tag filter
      if (filters.tags.length > 0 && !filters.tags.some(tag => post.tags.includes(tag))) {
        return false;
      }

      // Date filter
      if (filters.dateRange && filters.dateRange !== 'all') {
        const postDate = new Date(post.date);
        const daysDiff = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));

        switch (filters.dateRange) {
          case 'week':
            if (daysDiff > 7) return false;
            break;
          case 'month':
            if (daysDiff > 30) return false;
            break;
          case 'year':
            if (daysDiff > 365) return false;
            break;
        }
      }

      return true;
    });
  }, [query, posts, filters]);

  // Sort posts
  const sortedPosts = useMemo(() => {
    const sorted = [...filteredPosts];

    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'relevance':
      default:
        // Simple relevance: title matches rank higher
        return sorted.sort((a, b) => {
          const aInTitle = a.title.toLowerCase().includes(query.toLowerCase());
          const bInTitle = b.title.toLowerCase().includes(query.toLowerCase());
          if (aInTitle && !bInTitle) return -1;
          if (!aInTitle && bInTitle) return 1;
          return 0;
        });
    }
  }, [filteredPosts, sortBy, query]);

  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery });
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Header Section */}
      <section className="relative py-16 md:py-24 bg-secondary-50 dark:bg-secondary-900/50 -mt-8 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 mb-6 shadow-sm">
            <SearchIcon size={16} className="text-accent-500" />
            <span className="text-sm font-medium text-secondary-600 dark:text-secondary-300">Search Archives</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-serif text-secondary-900 dark:text-white mb-6">
            Find what you&apos;re <span className="text-gradient">looking for</span>
          </h1>

          <div className="relative max-w-xl mx-auto mt-8">
            <input
              type="text"
              placeholder="Search articles, topics, or keywords..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-lg shadow-secondary-200/50 dark:shadow-none transition-all text-lg"
            />
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
          </div>
        </motion.div>

        {/* Background Decor */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-accent-200/20 dark:bg-accent-900/10 rounded-full blur-3xl" />
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {query.trim() ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
              <p className="text-lg text-secondary-600 dark:text-secondary-300">
                Found <span className="font-semibold text-primary-600 dark:text-primary-400">{sortedPosts.length}</span> results for &quot;{query}&quot;
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${showFilters
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700'
                    }`}
                >
                  <SlidersHorizontal size={18} />
                  Filters
                  {(filters.categories.length > 0 || filters.tags.length > 0) && (
                    <span className="ml-1 px-2 py-0.5 bg-primary-500 text-white rounded-full text-xs">
                      {filters.categories.length + filters.tags.length}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1">
                  <ArrowUpDown size={16} className="text-secondary-500 ml-2" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-transparent border-none text-sm font-medium text-secondary-700 dark:text-secondary-300 focus:ring-0 cursor-pointer py-1 pr-8"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 border border-secondary-200 dark:border-secondary-700 shadow-sm">
                  <SearchFilters
                    filters={filters}
                    availableCategories={availableCategories}
                    availableTags={availableTags}
                    onFilterChange={setFilters}
                  />
                </div>
              </motion.div>
            )}

            {/* Results Grid */}
            {sortedPosts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {sortedPosts.map((post) => (
                  <Card key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="🔍"
                title="No Results Found"
                description={
                  filters.categories.length > 0 || filters.tags.length > 0
                    ? `No posts found matching "${query}" with the selected filters.`
                    : `No posts found for "${query}". Try searching for something else.`
                }
                actionLabel="Clear Filters"
                onAction={() => setFilters({ categories: [], tags: [], dateRange: 'all' })}
              />
            )}
          </>
        ) : (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="w-24 h-24 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchIcon size={40} className="text-secondary-400" />
            </div>
            <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
              Start Searching
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              Type in the search bar above to find articles, tutorials, and more.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;