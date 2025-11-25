import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { usePosts } from '../hooks/usePosts';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { PostStatus } from '../types/types';
import Card from './Card';
import useSEO from '../hooks/useSEO';
import { generateWebSiteSchema } from '../utils/seo';
import { SkeletonCard } from './common/LoadingSpinner';
import { EmptyState } from './common/EmptyState';

const Home: React.FC = () => {
  const { posts, featuredPostId, loading, error } = usePosts();
  const { authorName, authorTagline, siteDescription } = useSiteSettings();
  const typedTagline = useTypingEffect(authorTagline, 50, 1000);

  const schema = useMemo(() => generateWebSiteSchema(), []);

  useSEO({
    description: siteDescription,
    image: 'https://m-f-tushar.github.io/Blog-Website/images/og-image.jpg',
    schema
  });

  const publishedPosts = useMemo(() => {
    return posts
      .filter(p => p.status === PostStatus.PUBLISHED)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts]);

  const featuredPost = useMemo(() => {
    return featuredPostId ? publishedPosts.find(p => p.id === featuredPostId) : publishedPosts[0];
  }, [featuredPostId, publishedPosts]);

  const recentPosts = useMemo(() => {
    const postsWithoutFeatured = featuredPost ? publishedPosts.filter(p => p.id !== featuredPost.id) : publishedPosts;
    return postsWithoutFeatured.slice(0, 3);
  }, [publishedPosts, featuredPost]);

  // Add loading state
  if (loading) {
    return (
      <div className="space-y-16">
        <section className="text-center py-10 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 dark:text-white">
            Hi, I'm {authorName}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {authorTagline}
          </p>
        </section>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Add error state
  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Failed to Load Posts"
        description={error}
        actionLabel="Try Again"
        actionLink="/"
      />
    );
  }

  // Add empty state
  if (publishedPosts.length === 0) {
    return (
      <div className="space-y-16">
        <section className="text-center py-10 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 dark:text-white">
            Hi, I'm {authorName}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {authorTagline}
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link to="/about" className="px-6 py-3 bg-accent text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition-colors">
              About Me
            </Link>
          </div>
        </section>

        <EmptyState
          icon="✍️"
          title="No Posts Yet"
          description="I'm working on my first blog post. Check back soon for exciting content!"
        />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative -mt-8 mb-16 py-20 md:py-32 px-4 rounded-3xl overflow-hidden text-center">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 animate-gradient-slow -z-10" />

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 dark:opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold font-serif text-gray-900 dark:text-white mb-6 tracking-tight">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-600">{authorName}</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 h-8">
            {typedTagline}
            <span className="animate-pulse text-accent">|</span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/blog"
              className="px-8 py-4 bg-accent text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start Reading
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-full shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1 transition-all duration-300"
            >
              More About Me
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section>
          <h2 className="text-3xl font-bold font-serif text-center text-gray-900 dark:text-white mb-8">Featured Post</h2>
          <Card post={featuredPost} />
        </section>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold font-serif text-center text-gray-900 dark:text-white mb-8">Latest Articles</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <Card key={post.id} post={post} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/blog" className="font-semibold text-accent hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors text-lg">
              View All Posts &rarr;
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
