import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hash, ArrowLeft } from 'lucide-react';
import { usePosts } from '../hooks/usePosts';
import Card from './Card';
import { PostStatus } from '../types/types';
import useSEO from '../hooks/useSEO';
import { EmptyState } from './common/EmptyState';

const TagPage: React.FC = () => {
  const { tagName } = useParams<{ tagName: string }>();
  useSEO({
    title: `Posts tagged with "${tagName}"`,
    description: `Find all articles and posts tagged with "${tagName}".`
  });
  const { posts } = usePosts();

  const filteredPosts = useMemo(() => {
    if (!tagName) return [];
    return posts.filter(post =>
      post.status === PostStatus.PUBLISHED && post.tags.includes(tagName)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts, tagName]);

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <section className="relative py-16 md:py-20 bg-secondary-50 dark:bg-secondary-900/50 -mt-8 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto relative z-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-6">
            <Hash size={32} />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-serif text-secondary-900 dark:text-white mb-4">
            {tagName}
          </h1>

          <p className="text-lg text-secondary-600 dark:text-secondary-300">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found with this tag.
          </p>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/tags" className="inline-flex items-center text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <ArrowLeft size={18} className="mr-2" />
            Back to all tags
          </Link>
        </div>

        {filteredPosts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredPosts.map(post => (
              <Card key={post.id} post={post} />
            ))}
          </motion.div>
        ) : (
          <EmptyState
            icon="🔍"
            title="No posts found"
            description={`No articles found tagged with "#${tagName}".`}
            actionLabel="View all tags"
            actionLink="/tags"
          />
        )}
      </div>
    </div>
  );
};

export default TagPage;