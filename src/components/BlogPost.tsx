import React, { useMemo, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';
import { usePosts } from '../hooks/usePosts';
import { useSiteSettings } from '../hooks/useSiteSettings';
import useSEO from '../hooks/useSEO';
import { SkeletonPost } from './common/LoadingSpinner';
import { EmptyState } from './common/EmptyState';
import { generateBlogPostSchema } from '../utils/seo';
import { calculateReadingTime, formatReadingTime, getWordCount } from '../utils/readingTime';
import ShareButtons from './common/ShareButtons';
import ScrollProgress from './common/ScrollProgress';
import ReadingControls from './common/ReadingControls';
import RelatedPosts from './common/RelatedPosts';
import PostNavigation from './common/PostNavigation';
import { useReadingPreferences } from '../hooks/useReadingPreferences';
import CommentSection from './comments/CommentSection';
import TableOfContents from './blog/TableOfContents';

const BlogPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { posts, loading } = usePosts();
  const { authorName } = useSiteSettings();
  useReadingPreferences(); // This hook now injects styles dynamically

  const post = useMemo(() => {
    return posts.find(p => p.id === postId);
  }, [postId, posts]);

  const schema = useMemo(() => {
    if (post) {
      return generateBlogPostSchema(post);
    }
    return undefined;
  }, [post]);

  useSEO({
    title: post?.title,
    description: post?.excerpt,
    image: post?.coverImage,
    type: 'article',
    author: authorName,
    publishedTime: post?.date,
    tags: post?.tags,
    canonicalUrl: `https://m-f-tushar.github.io/Blog-Website/#/blog/${postId}`,
    schema
  });



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
  const totalWords = getWordCount(post.content);
  const currentUrl = window.location.href;

  return (
    <>
      <ScrollProgress totalWords={totalWords} />
      <ReadingControls />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[1fr_300px] gap-8 items-start">
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden min-w-0">
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

              <div className="prose dark:prose-invert max-w-none prose-reading-preferences">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[
                    rehypeKatex,
                    rehypeHighlight,
                    rehypeRaw,
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: 'wrap' }]
                  ]}
                  components={{
                    img: ({ node, ...props }) => (
                      <img {...props} className="rounded-lg shadow-md my-8" loading="lazy" />
                    ),
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline" />
                    )
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <ShareButtons
                  url={currentUrl}
                  title={post.title}
                  description={post.excerpt}
                />
              </div>

              {/* Post Navigation */}
              <PostNavigation currentPostId={post.id} allPosts={posts} />

              {/* Related Posts */}
              <RelatedPosts currentPost={post} allPosts={posts} />

              {/* Comments Section */}
              <CommentSection postId={post.id} />

              <div className="mt-6">
                <Link to="/blog" className="text-accent hover:underline">
                  &larr; Back to Blog
                </Link>
              </div>
            </div>
          </article>

          <aside className="hidden lg:block sticky top-24">
            <TableOfContents content={post.content} />
          </aside>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
