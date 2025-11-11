import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { PostStatus } from '../types/types';
import useSEO from '../hooks/useSEO';
import { LoadingSpinner } from './common/LoadingSpinner';
import { EmptyState } from './common/EmptyState';

const Tags: React.FC = () => {
    useSEO('All Tags', 'Browse all tags used in the blog posts.');
    const { posts, loading, error } = usePosts();
    
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
            .sort((a, b) => a.tag.localeCompare(b.tag));
    }, [posts]);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-white">All Tags</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                        Explore content based on topics that interest you.
                    </p>
                </div>
                <LoadingSpinner />
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
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-white">All Tags</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                    Explore content based on topics that interest you.
                </p>
            </div>

            {allTags.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-4">
                    {allTags.map(({ tag, count }) => (
                        <Link
                            key={tag}
                            to={`/tags/${tag}`}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-lg font-medium hover:bg-accent hover:text-white dark:hover:bg-accent-light dark:hover:text-gray-900 transition-colors"
                        >
                            #{tag} <span className="text-sm font-normal opacity-75">({count})</span>
                        </Link>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="🏷️"
                    title="No Tags Yet"
                    description="Tags will appear here once blog posts are published with tags."
                    actionLabel="Go Home"
                    actionLink="/"
                />
            )}
        </div>
    );
};

export default Tags;
