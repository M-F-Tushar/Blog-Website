import React from 'react';
import { LayoutGrid, List, AlignJustify, ArrowDownUp } from 'lucide-react';
import { motion } from 'framer-motion';

export type ViewMode = 'grid' | 'list' | 'compact';
export type SortOption = 'newest' | 'oldest' | 'popular' | 'alphabetical';

interface ViewToggleProps {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    sortBy: SortOption;
    setSortBy: (sort: SortOption) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
}) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
            {/* View Mode Toggles */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                            ? 'bg-accent text-white shadow-sm'
                            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    aria-label="Grid view"
                    title="Grid view"
                >
                    <LayoutGrid size={20} />
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list'
                            ? 'bg-accent text-white shadow-sm'
                            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    aria-label="List view"
                    title="List view"
                >
                    <List size={20} />
                </button>
                <button
                    onClick={() => setViewMode('compact')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'compact'
                            ? 'bg-accent text-white shadow-sm'
                            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    aria-label="Compact view"
                    title="Compact view"
                >
                    <AlignJustify size={20} />
                </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <ArrowDownUp size={16} />
                    Sort by:
                </span>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg focus:ring-accent focus:border-accent block p-2.5 outline-none transition-colors cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="alphabetical">Alphabetical (A-Z)</option>
                </select>
            </div>
        </div>
    );
};

export default ViewToggle;
