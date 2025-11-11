import React, { useMemo, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { marked } from 'marked';
import { usePosts } from '../hooks/usePosts';
import { useSiteSettings } from '../hooks/useSiteSettings';
import useSEO from '../hooks/useSEO';
import { SkeletonPost } from './common/LoadingSpinner';
import { EmptyState } from './common/EmptyState';
import { generateBlogPostSchema } from '../utils/structuredData';
import { calculateReadingTime, formatReadingTime } from '../utils/readingTime';
import ShareButtons from './common/ShareButtons';

const BlogPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { posts, loading } = usePosts();
  const { authorName } = useSiteSettings();

  const post = useMemo(() => {
    return posts.find(p => p.id === postId);
  }, [postId, posts]);
  
  useSEO({
    title: post?.title,
    description: post?.excerpt,
    image: post?.coverImage,
    type: 'article',
    author: authorName,
    publishedTime: post?.date,
    tags: post?.tags,
    canonicalUrl: `https://m-f-tushar.github.io/Blog-Website/#/blog/${postId}`
  });

  // Add structured data for blog post
  useEffect(() => {
    if (post) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(generateBlogPostSchema(post, authorName));
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    }
  }, [post, authorName]);

  const renderedContent = useMemo(() => {
    if (post?.content) {
        return { __html: marked.parse(post.content) };
    }
    return { __html: '<p>Content could not be rendered.</p>' };
  }, [post?.content]);

  if (loading) {
    return <SkeletonPost />;
  }

  if (!post) {
    return (
      <EmptyState
        icon="🔍"
        title="Post Not Found"
        description="The blog post you're looking for doesn't exist or has been removed."
        actionLabel="Back to Blog"
        actionLink="/blog"
      />
    );
  }

  const readingTime = calculateReadingTime(post.content);
  const currentUrl = window.location.href;

  return (
    <article className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="w-full h-64 md:h-80 object-cover" />
      )}
      <div className="p-8 md:p-12">
        <header className="mb-8">
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
            <span>{post.date}</span>
            <span>&bull;</span>
            <span>{post.category}</span>
            <span>&bull;</span>
            <span>{formatReadingTime(readingTime)}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 dark:text-white mt-2">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Link
                key={tag}
                to={`/tags/${tag}`}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </header>
        
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={renderedContent}
        />
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <ShareButtons 
            url={currentUrl}
            title={post.title}
            description={post.excerpt}
          />
        </div>
        
        <div className="mt-6">
            <Link to="/blog" className="text-accent hover:underline">
                &larr; Back to Blog
            </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
