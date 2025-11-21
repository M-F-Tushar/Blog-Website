import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, TrendingUp } from 'lucide-react';
import { Post } from '../../types/types';

interface SearchSuggestionsProps {
    query: string;
    posts: Post[];
    recentSearches: string[];
    isOpen: boolean;
    onSelect: (query: string) => void;
    onClose: () => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
    query,
    posts,
    recentSearches,
    isOpen,
    onSelect,
    onClose
}) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Generate suggestions based on query
    const suggestions = React.useMemo(() => {
        if (!query.trim()) {
            return recentSearches.slice(0, 5).map(search => ({
                text: search,
                type: 'recent' as const
            }));
        }

        const lowerQuery = query.toLowerCase();
        const titleMatches = posts
            .filter(post => post.title.toLowerCase().includes(lowerQuery))
            .slice(0, 5)
            .map(post => ({
                text: post.title,
                type: 'post' as const,
                postId: post.id
            }));

        const tagMatches = Array.from(
            new Set(
                posts
                    .flatMap(post => post.tags)
                    .filter(tag => tag.toLowerCase().includes(lowerQuery))
            )
        )
            .slice(0, 3)
            .map(tag => ({
                text: tag,
                type: 'tag' as const
            }));

        return [...titleMatches, ...tagMatches];
    }, [query, posts, recentSearches]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev =>
                        prev < suggestions.length - 1 ? prev + 1 : prev
                    );
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (suggestions[selectedIndex]) {
                        onSelect(suggestions[selectedIndex].text);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    onClose();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex, suggestions, onSelect, onClose]);

    // Reset selected index when suggestions change
    useEffect(() => {
        setSelectedIndex(0);
    }, [suggestions]);

    if (!isOpen || suggestions.length === 0) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-30"
                onClick={onClose}
            />

            {/* Suggestions Dropdown */}
            <AnimatePresence>
                <motion.div
                    ref={suggestionsRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-40 max-h-96 overflow-y-auto"
                >
                    {!query.trim() && recentSearches.length > 0 && (
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                            Recent Searches
                        </div>
                    )}

                    <div className="py-2">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={`${suggestion.type}-${suggestion.text}`}
                                onClick={() => onSelect(suggestion.text)}
                                className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors ${index === selectedIndex
                                        ? 'bg-accent/10 dark:bg-accent/20'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {suggestion.type === 'recent' && (
                                    <Clock size={16} className="text-gray-400 flex-shrink-0" />
                                )}
                                {suggestion.type === 'post' && (
                                    <Search size={16} className="text-accent flex-shrink-0" />
                                )}
                                {suggestion.type === 'tag' && (
                                    <TrendingUp size={16} className="text-green-500 flex-shrink-0" />
                                )}

                                <div className="flex-1 min-w-0">
                                    <div className="text-sm text-gray-900 dark:text-gray-100 truncate">
                                        {suggestion.text}
                                    </div>
                                    {suggestion.type === 'tag' && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Tag
                                        </div>
                                    )}
                                </div>

                                {index === selectedIndex && (
                                    <div className="text-xs text-gray-400">
                                        ↵
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        Use ↑↓ to navigate, ↵ to select, ESC to close
                    </div>
                </motion.div>
            </AnimatePresence>
        </>
    );
};

export default SearchSuggestions;
