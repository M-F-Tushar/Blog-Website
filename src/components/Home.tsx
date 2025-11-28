import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Mail, Tag } from 'lucide-react';
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
    return postsWithoutFeatured.slice(0, 6);
  }, [publishedPosts, featuredPost]);

  // Extract popular tags (naive implementation based on frequency)
  const popularTags = useMemo(() => {
    const tags = publishedPosts.flatMap(p => p.tags || []);
    const tagCounts = tags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag]) => tag);
  }, [publishedPosts]);

  if (loading) {
    return (
      <div className="space-y-16 container-padding">
        <div className="h-96 bg-secondary-100 dark:bg-secondary-800 rounded-3xl animate-pulse" />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

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

  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative -mt-8 py-24 md:py-32 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-blob" />
          <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-accent-200/30 dark:bg-accent-900/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-secondary-800/50 backdrop-blur-sm border border-secondary-200 dark:border-secondary-700 mb-8">
              <Sparkles size={16} className="text-accent-500" />
              <span className="text-sm font-medium text-secondary-600 dark:text-secondary-300">Welcome to my digital garden</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold font-serif text-secondary-900 dark:text-white mb-8 tracking-tight leading-tight">
              Hi, I'm <span className="text-gradient">{authorName}</span>
            </h1>

            <p className="text-xl md:text-2xl text-secondary-600 dark:text-secondary-300 mb-12 max-w-2xl mx-auto leading-relaxed h-20 md:h-auto">
              {typedTagline}
              <span className="animate-pulse text-primary-500">|</span>
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/blog"
                className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-full shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Reading
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white font-semibold rounded-full shadow-md hover:shadow-lg border border-secondary-200 dark:border-secondary-700 hover:-translate-y-1 transition-all duration-300"
              >
                More About Me
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="text-accent-500" />
            <h2 className="text-3xl font-bold font-serif text-secondary-900 dark:text-white">Featured Story</h2>
          </div>
          <div className="transform hover:-translate-y-1 transition-transform duration-300">
            <Card post={featuredPost} featured />
          </div>
        </section>
      )}

      {/* Popular Tags */}
      {popularTags.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <Tag className="text-primary-500" />
            <h2 className="text-2xl font-bold font-serif text-secondary-900 dark:text-white">Trending Topics</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {popularTags.map(tag => (
              <Link
                key={tag}
                to={`/tags/${tag}`}
                className="px-4 py-2 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-full text-secondary-600 dark:text-secondary-300 hover:border-primary-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-green-500" />
              <h2 className="text-3xl font-bold font-serif text-secondary-900 dark:text-white">Latest Articles</h2>
            </div>
            <Link to="/blog" className="hidden md:flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <Card key={post.id} post={post} />
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-white rounded-full font-medium">
              View all articles <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-secondary-900 px-6 py-16 md:px-16 md:py-20 text-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500/20 text-primary-400 mb-4">
              <Mail size={32} />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold font-serif text-white">
              Subscribe to my newsletter
            </h2>

            <p className="text-lg text-secondary-300">
              Get the latest articles, tutorials, and insights delivered straight to your inbox. No spam, just quality content.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3.5 rounded-full bg-white/10 border border-white/10 text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 backdrop-blur-sm"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/20"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
