import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../types/types';
import { Clock } from 'lucide-react';
import { calculateReadingTime } from '../../utils/readingTime';

interface RelatedPostsProps {
  currentPost: Post;
  allPosts: Post[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPost, allPosts }) => {
  const relatedPosts = useMemo(() => {
    // Find posts with matching tags
    const related = allPosts
      .filter((post) => post.id !== currentPost.id)
      .map((post) => {
        // Calculate relevance score based on shared tags
        const sharedTags = post.tags.filter((tag) => currentPost.tags.includes(tag));
        return {
          post,
          score: sharedTags.length,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.post);

    // If less than 3 related posts, fill with recent posts
    if (related.length < 3) {
      const recentPosts = allPosts
        .filter((post) => post.id !== currentPost.id && !related.includes(post))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3 - related.length);

      return [...related, ...recentPosts];
    }

    return related;
  }, [currentPost, allPosts]);

  if (relatedPosts.length === 0) return null;

  return (
    <div className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold font-serif text-gray-900 dark:text-white mb-8">
        Related Articles
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            {post.coverImage && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span className="px-2 py-1 bg-accent/10 text-accent rounded">{post.category}</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {calculateReadingTime(post.content)} min read
                </span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-accent transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
