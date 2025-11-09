import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import useSEO from '../hooks/useSEO';

declare global {
    interface Window {
        marked: any;
    }
}

const BlogPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { posts } = usePosts();

  const post = useMemo(() => {
    return posts.find(p => p.id === postId);
  }, [postId, posts]);
  
  useSEO(post?.title || 'Post Not Found', post?.excerpt || '');

  const renderedContent = useMemo(() => {
    if (post?.content && window.marked) {
        return { __html: window.marked.parse(post.content) };
    }
    return { __html: '<p>Content could not be rendered.</p>' };
  }, [post?.content]);

  if (!post) {
    return <Navigate to="/404" replace />; // Or render a "Not Found" component
  }

  return (
    <article className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="w-full h-64 md:h-80 object-cover" />
      )}
      <div className="p-8 md:p-12">
        <header className="mb-8">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span>{post.date}</span> &bull; <span>{post.category}</span>
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
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Link to="/blog" className="text-accent hover:underline">
                &larr; Back to Blog
            </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
