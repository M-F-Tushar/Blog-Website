import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';
import { Calendar, Clock, Tag, ChevronLeft, User } from 'lucide-react';
import { usePosts } from '../hooks/usePosts';
import { useSiteSettings } from '../hooks/useSiteSettings';
import SEO from './common/SEO';
import { SkeletonPost } from './common/LoadingSpinner';
import { EmptyState } from './common/EmptyState';
import { generateBlogPostSchema } from '../utils/seo';
import { siteConfig as centralSiteConfig } from '../config/site';
import { calculateReadingTime, formatReadingTime, getWordCount } from '../utils/readingTime';
import ShareButtons from './common/ShareButtons';
import ReadingProgress from './common/ReadingProgress';
import ReadingControls from './common/ReadingControls';
import RelatedPosts from './common/RelatedPosts';
import PostNavigation from './common/PostNavigation';
import { useReadingPreferences } from '../hooks/useReadingPreferences';
import CommentSection from './comments/CommentSection';
import TableOfContents from './blog/TableOfContents';
import { useReadingPosition } from '../hooks/useReadingPosition';
import ContinueReadingPrompt from './common/ContinueReadingPrompt';
import StructuredData from './common/StructuredData';
import { generateBlogPostingSchema } from '../utils/structuredData';
import { recordPageView } from '../services/analyticsService';

const BlogPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { posts, loading } = usePosts();
  const { authorName } = useSiteSettings();
  useReadingPreferences();

  const post = useMemo(() => {
    return posts.find((p) => p.id === postId);
  }, [postId, posts]);

  // Record page view when post is loaded
  useEffect(() => {
    if (post?.id) {
      recordPageView(post.id);
    }
  }, [post?.id]);

  const readingTime = useMemo(() => (post ? calculateReadingTime(post.content) : 0), [post]);
  const totalWords = useMemo(() => (post ? getWordCount(post.content) : 0), [post]);

  // Reading position hook
  const { position, restorePosition, clearPosition } = useReadingPosition(postId || '', totalWords);

  // Derive showContinuePrompt from position instead of using state
  const showContinuePrompt =
    position && position.scrollPercentage > 5 && position.scrollPercentage < 95;
  const [promptDismissed, setPromptDismissed] = useState(false);

  const structuredDataSchema = useMemo(() => {
    if (post) {
      return generateBlogPostingSchema(post, centralSiteConfig.url, centralSiteConfig.name, {
        name: authorName,
      });
    }
    return undefined;
  }, [post, authorName]);

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

  const currentUrl = window.location.href;

  const handleContinueReading = () => {
    restorePosition();
    setPromptDismissed(true);
  };

  const handleStartOver = () => {
    clearPosition();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPromptDismissed(true);
  };

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.coverImage || centralSiteConfig.ogImage}
        url={`/blog/${post.id}`}
        type="article"
        publishedTime={post.date}
        tags={post.tags}
      />
      {structuredDataSchema && <StructuredData data={structuredDataSchema} />}
      <ReadingProgress totalWords={totalWords} showPercentage={true} />

      {/* Continue Reading Prompt */}
      {showContinuePrompt && !promptDismissed && position && (
        <ContinueReadingPrompt
          percentage={position.scrollPercentage}
          onContinue={handleContinueReading}
          onStartOver={handleStartOver}
        />
      )}

      <article className="min-h-screen pb-20" aria-labelledby="post-title">
        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
          {post.coverImage ? (
            <>
              <div className="absolute inset-0 bg-black/50 z-10" />
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-secondary-900 to-black z-10" />
          )}

          <div className="absolute inset-0 z-20 flex flex-col justify-end pb-16 container mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/blog"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors w-fit"
            >
              <ChevronLeft size={20} className="mr-1" />
              Back to Blog
            </Link>

            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80 mb-4">
                <span className="bg-primary-600/90 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(post.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {formatReadingTime(readingTime)}
                </span>
              </div>

              <h1
                id="post-title"
                className="text-4xl md:text-6xl font-bold font-serif text-white mb-6 leading-tight"
              >
                {post.title}
              </h1>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-white font-medium">{authorName}</p>
                  <p className="text-white/60 text-xs">Author</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30">
          <div className="grid lg:grid-cols-[1fr_300px] gap-12">
            {/* Main Content */}
            <div
              className="bg-white dark:bg-secondary-900 rounded-2xl shadow-xl p-8 md:p-12"
              id="main-content"
            >
              <div className="-mx-8 -mt-8 md:-mx-12 md:-mt-12 mb-8 rounded-t-2xl overflow-hidden">
                <ReadingControls />
              </div>
              <div className="prose prose-reading-preferences dark:prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-img:rounded-xl prose-img:shadow-lg">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw, rehypeSlug]}
                  components={{
                    img: ({ ...props }) => (
                      <img {...props} className="rounded-xl shadow-lg my-8 w-full" loading="lazy" />
                    ),
                    a: ({ ...props }) => (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 dark:text-primary-400 hover:underline decoration-2 decoration-primary-200 dark:decoration-primary-800 underline-offset-2 transition-all"
                      />
                    ),
                    blockquote: ({ ...props }) => (
                      <blockquote
                        {...props}
                        className="border-l-4 border-primary-500 bg-primary-50 dark:bg-primary-900/20 p-4 rounded-r-lg italic"
                      />
                    ),
                    code: ({
                      inline,
                      className,
                      children,
                      ...props
                    }: {
                      inline?: boolean;
                      className?: string;
                      children?: React.ReactNode;
                    }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="relative group">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </div>
                      ) : (
                        <code
                          className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-sm font-mono text-secondary-800 dark:text-secondary-200"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-secondary-200 dark:border-secondary-800">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/tags/${tag}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 rounded-full text-sm hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <Tag size={14} />
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <ShareButtons url={currentUrl} title={post.title} description={post.excerpt} />
              </div>

              <PostNavigation currentPostId={post.id} allPosts={posts} />
              <RelatedPosts currentPost={post} allPosts={posts} />
              <CommentSection postId={post.id} />
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block space-y-8">
              <div className="sticky top-24 space-y-8">
                <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-lg p-6 border border-secondary-200 dark:border-secondary-800">
                  <h3 className="text-lg font-bold font-serif mb-4 text-secondary-900 dark:text-white">
                    Table of Contents
                  </h3>
                  <TableOfContents content={post.content} />
                </div>

                {/* Could add more sidebar widgets here like "About Author" or "Newsletter" */}
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPost;
