import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { PostStatus } from '../types/types';
import Card from './Card';
import useSEO from '../hooks/useSEO';
import { EmptyState } from './common/EmptyState';
import SearchFilters, { FilterState } from './common/SearchFilters';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

type SortOption = 'relevance' | 'newest' | 'oldest';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-white">
          Search Results
        </h1>
        {query && (
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Found <span className="font-semibold text-accent">{sortedPosts.length}</span> results for:{' '}
            <span className="font-semibold text-accent">"{query}"</span>
          </p>
        )}
      </div>

      {query.trim() ? (
        <>
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
            >
              <SlidersHorizontal size={18} />
              {showFilters ? 'Hide' : 'Show'} Filters
              {(filters.categories.length > 0 || filters.tags.length > 0) && (
                <span className="ml-1 px-2 py-0.5 bg-accent text-white rounded-full text-xs">
                  {filters.categories.length + filters.tags.length}
                </span>
              )}
            </button>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={18} className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border-none focus:ring-2 focus:ring-accent text-sm font-medium cursor-pointer"
              >
                <option value="relevance">Most Relevant</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <SearchFilters
                filters={filters}
                availableCategories={availableCategories}
                availableTags={availableTags}
                onFilterChange={setFilters}
              />
            </div>
          )}

          {/* Results */}
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
                  ? `No posts found matching "${query}" with the selected filters. Try removing some filters.`
                  : `No posts found for "${query}". Try a different search term.`
              }
              actionLabel="Clear Search"
              actionLink="/search"
            />
          )}
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            Please enter a term in the search bar to begin.
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;