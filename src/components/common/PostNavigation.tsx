import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Post, PostStatus } from '../../types/types';

interface PostNavigationProps {
    currentPostId: string;
    allPosts: Post[];
}

const PostNavigation: React.FC<PostNavigationProps> = ({ currentPostId, allPosts }) => {
    const { previousPost, nextPost } = useMemo(() => {
        const publishedPosts = allPosts
            .filter(p => p.status === PostStatus.PUBLISHED)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const currentIndex = publishedPosts.findIndex(p => p.id === currentPostId);

        return {
            previousPost: currentIndex > 0 ? publishedPosts[currentIndex - 1] : null,
            nextPost: currentIndex < publishedPosts.length - 1 ? publishedPosts[currentIndex + 1] : null
        };
    }, [currentPostId, allPosts]);

    if (!previousPost && !nextPost) return null;

    return (
        <div className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-700">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Previous Post */}
                {previousPost ? (
                    <Link
                        to={`/blog/${previousPost.id}`}
                        className="group flex items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-accent"
                    >
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-accent group-hover:text-white transition-colors">
                            <ChevronLeft size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                Previous Article
                            </div>
                            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-accent transition-colors line-clamp-2">
                                {previousPost.title}
                            </div>
                        </div>
                    </Link>
                ) : (
                    <div />
                )}

                {/* Next Post */}
                {nextPost ? (
                    <Link
                        to={`/blog/${nextPost.id}`}
                        className="group flex items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-accent"
                    >
                        <div className="flex-1 min-w-0 text-right">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                Next Article
                            </div>
                            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-accent transition-colors line-clamp-2">
                                {nextPost.title}
                            </div>
                        </div>
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-accent group-hover:text-white transition-colors">
                            <ChevronRight size={24} />
                        </div>
                    </Link>
                ) : (
                    <div />
                )}
            </div>
        </div>
    );
};

export default PostNavigation;
