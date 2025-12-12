import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, Search, Hash } from 'lucide-react';
import { usePosts } from '../hooks/usePosts';
import { PostStatus } from '../types/types';
import useSEO from '../hooks/useSEO';
import { LoadingSpinner } from './common/LoadingSpinner';
import { EmptyState } from './common/EmptyState';

const Tags: React.FC = () => {
    useSEO({
        title: 'All Tags',
        description: 'Browse all tags used in the blog posts.'
    });
    const { posts, loading, error } = usePosts();
    const [searchQuery, setSearchQuery] = useState('');

    const allTags = useMemo(() => {
        const publishedPosts = posts.filter(p => p.status === PostStatus.PUBLISHED);
        const tagCounts: { [key: string]: number } = {};

        publishedPosts.forEach(post => {
            post.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

        return Object.entries(tagCounts)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count); // Sort by count descending
    }, [posts]);

    const filteredTags = useMemo(() => {
        if (!searchQuery) return allTags;
        return allTags.filter(t => (t.tag || '').toLowerCase().includes(searchQuery.toLowerCase()));
    }, [allTags, searchQuery]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 space-y-8">
                <div className="h-12 w-48 bg-secondary-200 dark:bg-secondary-800 rounded-full mx-auto animate-pulse" />
                <div className="flex flex-wrap justify-center gap-4">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="h-10 w-24 bg-secondary-100 dark:bg-secondary-800 rounded-full animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <EmptyState
                icon="⚠️"
                title="Error Loading Tags"
                description={error}
            />
        );
    }

    return (
        <div className="space-y-12 pb-12">
            {/* Header */}
            <section className="relative py-16 md:py-24 bg-secondary-50 dark:bg-secondary-900/50 -mt-8 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 mb-6 shadow-sm">
                        <Hash size={16} className="text-accent-500" />
                        <span className="text-sm font-medium text-secondary-600 dark:text-secondary-300">Topics & Categories</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold font-serif text-secondary-900 dark:text-white mb-6">
                        Explore by <span className="text-gradient">Topic</span>
                    </h1>

                    <p className="text-lg text-secondary-600 dark:text-secondary-300 mb-8">
                        Find articles that match your interests.
                    </p>

                    <div className="relative max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Search tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-full bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                    </div>
                </motion.div>

                {/* Background Decor */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-10 right-10 w-64 h-64 bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent-200/20 dark:bg-accent-900/10 rounded-full blur-3xl" />
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                {filteredTags.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        {filteredTags.map(({ tag, count }) => (
                            <Link
                                key={tag}
                                to={`/tags/${tag}`}
                                className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-full text-secondary-700 dark:text-secondary-200 hover:border-primary-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <Tag size={16} className="text-secondary-400 group-hover:text-primary-500 transition-colors" />
                                <span className="font-medium">{tag}</span>
                                <span className="bg-secondary-100 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400 text-xs px-2 py-0.5 rounded-full group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {count}
                                </span>
                            </Link>
                        ))}
                    </motion.div>
                ) : (
                    <EmptyState
                        icon="🏷️"
                        title="No Tags Found"
                        description={searchQuery ? `No tags match "${searchQuery}"` : "No tags available yet."}
                        actionLabel={searchQuery ? "Clear Search" : "Go Home"}
                        onAction={searchQuery ? () => setSearchQuery('') : undefined}
                        actionLink={!searchQuery ? "/" : undefined}
                    />
                )}
            </div>
        </div>
    );
};

export default Tags;
