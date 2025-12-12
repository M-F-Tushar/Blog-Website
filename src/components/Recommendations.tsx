import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  Grid,
  List,
  BookOpen,
  Video,
  Wrench,
  GraduationCap,
  Globe,
  FileText,
  Tag,
  Filter,
} from 'lucide-react';
import { useRecommendations } from '../hooks/useRecommendations';
import { RecommendationType } from '../types/types';
import useSEO from '../hooks/useSEO';
import { LoadingSpinner } from './common/LoadingSpinner';
import { EmptyState } from './common/EmptyState';
import RecommendationCard from './common/RecommendationCard';

const Recommendations: React.FC = () => {
  useSEO({
    title: 'Recommendations',
    description:
      'A curated collection of my favorite tools, books, courses, and resources for developers.',
  });

  const { recommendations, loading, error } = useRecommendations();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Filter categories
  const filters = [
    { label: 'All', icon: null },
    { label: RecommendationType.ARTICLE, icon: <Newspaper size={16} /> },
    { label: RecommendationType.BOOK, icon: <BookOpen size={16} /> },
    { label: RecommendationType.COURSE, icon: <GraduationCap size={16} /> },
    { label: RecommendationType.TOOL, icon: <Wrench size={16} /> },
    { label: RecommendationType.VIDEO, icon: <Video size={16} /> },
    { label: RecommendationType.WEBSITE, icon: <Globe size={16} /> },
    { label: RecommendationType.DOCUMENTATION, icon: <FileText size={16} /> },
  ];

  // Filter and search logic
  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((item) => {
      const matchesSearch =
        (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags || []).some((tag) => (tag || '').toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFilter = activeFilter === 'All' || item.type === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [recommendations, searchQuery, activeFilter]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: recommendations.length,
      types: recommendations.reduce(
        (acc, curr) => {
          acc[curr.type] = (acc[curr.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
    };
  }, [recommendations]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="h-64 bg-secondary-100 dark:bg-secondary-800 rounded-3xl animate-pulse" />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-96 bg-secondary-100 dark:bg-secondary-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState icon="⚠️" title="Error Loading Recommendations" description={error} />
      </div>
    );
  }

  return (
    <div className="pb-12 space-y-12">
      {/* Hero Section */}
      <section className="relative py-16 px-4 -mt-8 overflow-hidden bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-950">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-blob" />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-accent-200/20 dark:bg-accent-900/10 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-secondary-800/50 backdrop-blur-sm border border-secondary-200 dark:border-secondary-700 mb-6 mx-auto">
              <Sparkles size={16} className="text-yellow-500" />
              <span className="text-sm font-medium text-secondary-600 dark:text-secondary-300">
                Curated Resources
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-serif text-secondary-900 dark:text-white mb-6">
              My Recommendations
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto leading-relaxed">
              A hand-picked collection of tools, books, courses, and resources that have helped me
              on my journey.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {Object.entries(stats.types)
                .slice(0, 4)
                .map(([type, count]) => (
                  <div
                    key={type}
                    className="flex items-center gap-2 px-3 py-1 bg-white/60 dark:bg-secondary-800/60 rounded-lg text-sm font-medium text-secondary-600 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-700"
                  >
                    <span className="w-5 h-5 flex items-center justify-center bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full text-xs">
                      {count}
                    </span>
                    {type}s
                  </div>
                ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-secondary-800 p-4 rounded-2xl shadow-sm border border-secondary-200 dark:border-secondary-700 sticky top-20 z-10 transition-shadow hover:shadow-md">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by title, description, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary-50 dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-secondary-50 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 rounded-xl font-medium border border-secondary-200 dark:border-secondary-700"
            >
              <Filter size={18} />
              Filters
            </button>

            {/* View Toggle */}
            <div className="flex bg-secondary-50 dark:bg-secondary-900 p-1 rounded-xl border border-secondary-200 dark:border-secondary-700 ml-auto md:ml-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                    ? 'bg-white dark:bg-secondary-800 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300'
                  }`}
                title="Grid View"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                    ? 'bg-white dark:bg-secondary-800 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300'
                  }`}
                title="List View"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs (Desktop) */}
        <div className="hidden md:flex flex-wrap gap-2 pb-2">
          {filters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => setActiveFilter(filter.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === filter.label
                  ? 'bg-secondary-900 dark:bg-white text-white dark:text-secondary-900 shadow-md transform scale-105'
                  : 'bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                }`}
            >
              {filter.icon}
              {filter.label}
            </button>
          ))}
        </div>

        {/* Filter Menu (Mobile) */}
        <AnimatePresence>
          {isFilterMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 p-2 bg-secondary-50 dark:bg-secondary-900 rounded-xl">
                {filters.map((filter) => (
                  <button
                    key={filter.label}
                    onClick={() => {
                      setActiveFilter(filter.label);
                      setIsFilterMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium w-full transition-all ${activeFilter === filter.label
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-secondary-600 dark:text-secondary-300 hover:bg-white dark:hover:bg-secondary-800'
                      }`}
                  >
                    {filter.icon}
                    {filter.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {filteredRecommendations.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No Results Found"
            description={`No recommendations match your search "${searchQuery}"`}
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setActiveFilter('All');
            }}
          />
        ) : (
          <motion.div
            layout
            className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              }`}
          >
            <AnimatePresence>
              {filteredRecommendations.map((item) => (
                <RecommendationCard key={item.id} item={item} viewMode={viewMode} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Simple wrapper component for icons that are not imported to avoid errors if lucide-react version is old
const Newspaper = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <path d="M18 14h-8" />
    <path d="M15 18h-5" />
    <path d="M10 6h8v4h-8V6Z" />
  </svg>
);

export default Recommendations;
