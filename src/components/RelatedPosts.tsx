import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types/types';

interface RelatedPostsProps {
  currentPost: Post;
  allPosts: Post[];
  maxPosts?: number;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPost, allPosts, maxPosts = 3 }) => {
  const relatedPosts = useMemo(() => {
    return allPosts
      .filter((p) => p.id !== currentPost.id && p.status === 'Published')
      .map((p) => ({
        ...p,
        relevanceScore: calculateRelevance(currentPost, p),
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxPosts);
  }, [currentPost, allPosts, maxPosts]);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-secondary-200 dark:border-secondary-700">
      <h2 className="text-2xl font-bold font-serif mb-6">Related Posts</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="group block p-4 rounded-xl bg-secondary-50 dark:bg-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
          >
            <h3 className="font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2">
              {post.title}
            </h3>
            <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2">
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

function calculateRelevance(current: Post, other: Post): number {
  let score = 0;
  if (current.category === other.category) score += 3;
  const sharedTags = current.tags.filter((t) => other.tags.includes(t));
  score += sharedTags.length * 2;
  return score;
}

export default RelatedPosts;
