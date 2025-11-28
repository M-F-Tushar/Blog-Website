import React, { useMemo } from 'react';
import { usePosts } from '../hooks/usePosts';
import { useBookmarks } from '../context/BookmarksContext';
import Card from './Card';
import { EmptyState } from './common/EmptyState';
import { LoadingSpinner } from './common/LoadingSpinner';
import useSEO from '../hooks/useSEO';

const ReadingList: React.FC = () => {
    const { posts, loading: postsLoading } = usePosts();
    const { bookmarks, isLoading: bookmarksLoading } = useBookmarks();

    useSEO({
        title: 'My Reading List',
        description: 'Your saved articles and bookmarks.',
    });

    const bookmarkedPosts = useMemo(() => {
        return posts.filter(post => bookmarks.includes(post.id));
    }, [posts, bookmarks]);

    if (postsLoading || bookmarksLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-white">
                    My Reading List
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                    You have saved <span className="font-semibold text-accent">{bookmarkedPosts.length}</span> articles.
                </p>
            </div>

            {bookmarkedPosts.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {bookmarkedPosts.map((post) => (
                        <Card key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="🔖"
                    title="No Bookmarks Yet"
                    description="Start saving articles you want to read later by clicking the bookmark icon on any post."
                    actionLabel="Explore Articles"
                    actionLink="/blog"
                />
            )}
        </div>
    );
};

export default ReadingList;
