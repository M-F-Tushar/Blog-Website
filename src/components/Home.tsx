import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { PostStatus } from '../types/types';
import Card from './Card';
import useSEO from '../hooks/useSEO';
import { SkeletonCard } from './common/LoadingSpinner';
import { EmptyState } from './common/EmptyState';

const Home: React.FC = () => {
  const { posts, featuredPostId, loading, error } = usePosts();
  const { authorName, authorTagline, siteDescription } = useSiteSettings();
  useSEO({
    description: siteDescription,
    image: 'https://m-f-tushar.github.io/Blog-Website/images/og-image.jpg'
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
          <Link to="/blog" className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-md shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors">
            Read the Blog
          </Link>
        </div>
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
