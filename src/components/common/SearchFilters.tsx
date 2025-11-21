import React from 'react';
import { X, Folder, Tag, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterState {
    categories: string[];
    tags: string[];
    dateRange?: 'all' | 'week' | 'month' | 'year';
}

interface SearchFiltersProps {
    filters: FilterState;
    availableCategories: string[];
    availableTags: string[];
    onFilterChange: (filters: FilterState) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    filters,
    availableCategories,
    availableTags,
    onFilterChange
}) => {
    const toggleCategory = (category: string) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];
        onFilterChange({ ...filters, categories: newCategories });
    };

    const toggleTag = (tag: string) => {
        const newTags = filters.tags.includes(tag)
            ? filters.tags.filter(t => t !== tag)
            : [...filters.tags, tag];
        onFilterChange({ ...filters, tags: newTags });
    };

    const setDateRange = (range: FilterState['dateRange']) => {
        onFilterChange({ ...filters, dateRange: range });
    };

    const clearAllFilters = () => {
        onFilterChange({ categories: [], tags: [], dateRange: 'all' });
    };

    const hasActiveFilters = filters.categories.length > 0 ||
        filters.tags.length > 0 ||
        (filters.dateRange && filters.dateRange !== 'all');

    return (
        <div className="space-y-4">
            {/* Active Filters Summary */}
            <AnimatePresence>
                {hasActiveFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap items-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-700"
                    >
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Active Filters:
                        </span>

                        {filters.categories.map(category => (
                            <motion.button
                                key={category}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                onClick={() => toggleCategory(category)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            >
                                <Folder size={14} />
                                {category}
                                <X size={14} />
                            </motion.button>
                        ))}

                        {filters.tags.map(tag => (
                            <motion.button
                                key={tag}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                onClick={() => toggleTag(tag)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                            >
                                <Tag size={14} />
                                {tag}
                                <X size={14} />
                            </motion.button>
                        ))}

                        {filters.dateRange && filters.dateRange !== 'all' && (
                            <motion.button
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                onClick={() => setDateRange('all')}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                            >
                                <Calendar size={14} />
                                {filters.dateRange}
                                <X size={14} />
                            </motion.button>
                        )}

                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline ml-2"
                        >
                            Clear all
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filter Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Categories */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <Folder size={16} />
                        Categories
                    </h3>
                    <div className="space-y-2">
                        {availableCategories.map(category => (
                            <label
                                key={category}
                                className="flex items-center gap-2 cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={filters.categories.includes(category)}
                                    onChange={() => toggleCategory(category)}
                                    className="w-4 h-4 text-accent border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-accent"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                                    {category}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <Tag size={16} />
                        Tags
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {availableTags.slice(0, 10).map(tag => (
                            <label
                                key={tag}
                                className="flex items-center gap-2 cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={filters.tags.includes(tag)}
                                    onChange={() => toggleTag(tag)}
                                    className="w-4 h-4 text-accent border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-accent"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                                    #{tag}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Date Range */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <Calendar size={16} />
                        Date Range
                    </h3>
                    <div className="space-y-2">
                        {(['all', 'week', 'month', 'year'] as const).map(range => (
                            <label
                                key={range}
                                className="flex items-center gap-2 cursor-pointer group"
                            >
                                <input
                                    type="radio"
                                    name="dateRange"
                                    checked={filters.dateRange === range}
                                    onChange={() => setDateRange(range)}
                                    className="w-4 h-4 text-accent border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors capitalize">
                                    {range === 'all' ? 'All Time' : `Past ${range}`}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchFilters;
