import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Mail, Tag } from 'lucide-react';
import { usePosts } from '../hooks/usePosts';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { PostStatus } from '../types/types';
import Card from './Card';
import useSEO from '../hooks/useSEO';
import { generateWebSiteSchema } from '../utils/seo';
import { CardSkeleton } from './ui/CardSkeleton';
import { EmptyState } from './common/EmptyState';
import StructuredData from './common/StructuredData';
import { generateWebSiteSchema as generateJsonLdWebSite } from '../utils/structuredData';

const Home: React.FC = () => {
  const { posts, featuredPostId, loading, error } = usePosts();
  const { authorName, authorTagline, siteDescription, siteName, uiText, homepageLayout } = useSiteSettings();
  const { displayedText: typedTagline, isTyping } = useTypingEffect(authorTagline, 50, 1000);

  // Safe defaults for uiText.home to prevent undefined errors
  const homeText = uiText?.home ?? {
    welcomeBadge: '✨ Welcome to my blog',
    startReading: 'Start Reading',
    moreAboutMe: 'More About Me',
    featuredStory: 'Featured Story',
    trendingTopics: 'Trending Topics',
    latestArticles: 'Latest Articles',
    newsletterTitle: 'Stay Updated',
    newsletterDescription: 'Subscribe to get notified about new posts.',
    subscribeButton: 'Subscribe',
  };

  const schema = useMemo(() => generateWebSiteSchema(), []);

  const structuredDataSchema = useMemo(
    () =>
      generateJsonLdWebSite(
        siteName,
        'https://m-f-tushar.github.io/Blog-Website',
        siteDescription,
        { name: authorName }
      ),
    [siteName, siteDescription, authorName]
  );

  useSEO({
    description: siteDescription,
    image: 'https://m-f-tushar.github.io/Blog-Website/images/og-image.jpg',
    schema,
  });

  const publishedPosts = useMemo(() => {
    return posts
      .filter((p) => p.status === PostStatus.PUBLISHED)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts]);

  const featuredPost = useMemo(() => {
    return featuredPostId ? publishedPosts.find((p) => p.id === featuredPostId) : publishedPosts[0];
  }, [featuredPostId, publishedPosts]);

  const recentPosts = useMemo(() => {
    const postsWithoutFeatured = featuredPost
      ? publishedPosts.filter((p) => p.id !== featuredPost.id)
      : publishedPosts;
    return postsWithoutFeatured.slice(0, 6);
  }, [publishedPosts, featuredPost]);

  // Extract popular tags (naive implementation based on frequency)
  const popularTags = useMemo(() => {
    const tags = publishedPosts.flatMap((p) => p.tags || []);
    const tagCounts = tags.reduce(
      (acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag]) => tag);
  }, [publishedPosts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 50,
        damping: 15
      },
    },
  };

  if (loading) {
    return (
      <div className="space-y-16 container-padding py-12">
        {/* Hero skeleton */}
        <div className="h-96 bg-secondary-100 dark:bg-secondary-800 rounded-3xl animate-pulse" />

        {/* Featured post skeleton */}
        <div className="space-y-6">
          <div className="h-8 w-48 bg-secondary-200 dark:bg-secondary-800 rounded-full animate-pulse" />
          <CardSkeleton viewMode="grid" count={1} />
        </div>

        {/* Recent posts skeleton */}
        <div className="space-y-6">
          <div className="h-8 w-48 bg-secondary-200 dark:bg-secondary-800 rounded-full animate-pulse" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <CardSkeleton viewMode="grid" count={6} />
          </div>
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
    <>
      <StructuredData data={structuredDataSchema} />
      <motion.div
        className="space-y-16 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        {homepageLayout?.showHero !== false && (
          <section
            className="hero-container relative -mt-8 py-12 md:py-16 px-4 overflow-hidden"
            style={{ minHeight: '500px' }}
          >
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-blob" />
              <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-accent-200/30 dark:bg-accent-900/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
              <div className="absolute top-40 left-20 w-[600px] h-[600px] bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl opacity-40 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
            </div>

            <div className="container mx-auto max-w-5xl text-center relative z-10">
              <motion.div
                variants={itemVariants}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-secondary-800/50 backdrop-blur-sm border border-secondary-200 dark:border-secondary-700 mb-8 hover:scale-105 transition-transform duration-300 cursor-default shadow-sm hover:shadow-md">
                  <Sparkles size={16} className="text-accent-500 animate-pulse" />
                  <span className="text-sm font-medium text-secondary-600 dark:text-secondary-300">
                    {homeText.welcomeBadge}
                  </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold font-serif text-secondary-900 dark:text-white mb-8 tracking-tight leading-tight drop-shadow-sm">
                  Hi, I&apos;m <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400">{authorName}</span>
                </h1>

                <p
                  className="text-xl md:text-2xl text-secondary-600 dark:text-secondary-300 mb-10 max-w-2xl mx-auto leading-relaxed"
                  style={{ minHeight: '5rem' }}
                >
                  {typedTagline}
                  <span
                    className={`opacity-75 text-primary-500 animate-[fade_1s_ease-in-out_infinite] ${!isTyping ? 'hidden' : ''}`}
                  >
                    |
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    to="/blog"
                    className="group px-8 py-4 bg-primary-600 text-white font-semibold rounded-full shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:shadow-primary-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {homeText.startReading}
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/about"
                    className="px-8 py-4 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm text-secondary-900 dark:text-white font-semibold rounded-full shadow-md hover:shadow-lg border border-secondary-200 dark:border-secondary-700 hover:-translate-y-1 transition-all duration-300"
                  >
                    {homeText.moreAboutMe}
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Featured Post */}
        {homepageLayout?.showFeaturedPost !== false && featuredPost && (
          <motion.section
            className="container mx-auto px-4 sm:px-6 lg:px-8"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="text-accent-500" />
              <h2 className="text-3xl font-bold font-serif text-secondary-900 dark:text-white">
                {homeText.featuredStory}
              </h2>
            </div>
            <div className="transform hover:-translate-y-1 transition-transform duration-300">
              <Card post={featuredPost} featured />
            </div>
          </motion.section>
        )}

        {/* Popular Tags */}
        {homepageLayout?.showTrendingTopics !== false && popularTags.length > 0 && (
          <motion.section
            className="container mx-auto px-4 sm:px-6 lg:px-8"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 mb-6">
              <Tag className="text-primary-500" />
              <h2 className="text-2xl font-bold font-serif text-secondary-900 dark:text-white">
                {homeText.trendingTopics}
              </h2>
            </div>
            <div className="relative">
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-secondary-300 dark:scrollbar-thumb-secondary-700 scrollbar-track-transparent hover:scrollbar-thumb-secondary-400 dark:hover:scrollbar-thumb-secondary-600 md:flex-wrap md:overflow-x-visible">
                {popularTags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/tags/${tag}`}
                    className="group relative px-4 py-2 bg-white/50 dark:bg-secondary-800/50 backdrop-blur-sm border border-secondary-200 dark:border-secondary-700 rounded-full text-secondary-600 dark:text-secondary-300 hover:border-primary-500 hover:text-primary-500 dark:hover:text-primary-400 hover:shadow-md transition-all duration-300 whitespace-nowrap flex-shrink-0"
                  >
                    <span className="relative z-10 flex items-center gap-1">
                      <span className="opacity-50 group-hover:opacity-100 transition-opacity">#</span>{tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Recent Posts */}
        {homepageLayout?.showLatestArticles !== false && recentPosts.length > 0 && (
          <motion.section
            className="container mx-auto px-4 sm:px-6 lg:px-8"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-green-500" />
                <h2 className="text-3xl font-bold font-serif text-secondary-900 dark:text-white">
                  {homeText.latestArticles}
                </h2>
              </div>
              <Link
                to="/blog"
                className="hidden md:flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors group"
              >
                View all <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <Card key={post.id} post={post} />
              ))}
            </div>

            <div className="mt-12 text-center md:hidden">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-white rounded-full font-medium hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors"
              >
                View all articles <ArrowRight size={16} />
              </Link>
            </div>
          </motion.section>
        )}

        {/* Newsletter CTA */}
        {homepageLayout?.showNewsletter !== false && (
          <motion.section
            className="container mx-auto px-4 sm:px-6 lg:px-8"
            variants={itemVariants}
          >
            <div className="relative rounded-3xl overflow-hidden bg-secondary-900 px-6 py-16 md:px-16 md:py-20 text-center shadow-2xl shadow-secondary-900/50">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 mb-4 shadow-inner">
                  <Mail size={32} />
                </div>

                <h2 className="text-3xl md:text-4xl font-bold font-serif text-white">
                  {homeText.newsletterTitle}
                </h2>

                <p className="text-lg text-secondary-300 leading-relaxed">
                  {homeText.newsletterDescription}
                </p>

                <form
                  className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-3.5 rounded-full bg-white/10 border border-white/10 text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm transition-all hover:bg-white/15"
                  />
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/30 hover:shadow-primary-600/40 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {homeText.subscribeButton}
                  </button>
                </form>
              </div>
            </div>
          </motion.section>
        )}
      </motion.div>
    </>
  );
};

export default Home;
