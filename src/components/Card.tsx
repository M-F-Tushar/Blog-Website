import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Folder } from 'lucide-react';
import { Post } from '../types/types';
import { calculateReadingTime, formatReadingTime } from '../utils/readingTime';
import { useBookmarks } from '../hooks/useBookmarks';
import BookmarkButton from './common/BookmarkButton';
import ShareMenu from './common/ShareMenu';
import Highlighter from './common/Highlighter';

export type ViewMode = 'grid' | 'list' | 'compact';

interface CardProps {
  post: Post;
  viewMode?: ViewMode;
  highlight?: string;
  featured?: boolean;
}

const Card: React.FC<CardProps> = ({ post, viewMode = 'grid', highlight, featured = false }) => {
  const readingTime = calculateReadingTime(post.content);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [isHovered, setIsHovered] = useState(false);

  const bookmarked = isBookmarked(post.id);
  const postUrl = `${window.location.origin}${window.location.pathname}#/blog/${post.id}`;

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(post.id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Show max 3 tags
  const displayTags = post.tags.slice(0, 3);
  const hasMoreTags = post.tags.length > 3;

  // Layout Classes based on ViewMode
  const containerClasses = {
    grid: 'flex-col h-full',
    list: 'flex-col md:flex-row h-auto md:h-64',
    compact: 'flex-row h-auto items-center p-2 gap-4',
  };

  const imageContainerClasses = {
    grid: 'h-56 w-full',
    list: 'h-48 md:h-full w-full md:w-1/3 lg:w-1/4',
    compact: 'h-20 w-20 min-w-[5rem] rounded-lg',
  };

  const contentClasses = {
    grid: 'p-6 flex-col flex-grow',
    list: 'p-6 flex-col flex-grow justify-between w-full md:w-2/3 lg:w-3/4',
    compact: 'p-0 flex-col flex-grow justify-center',
  };

  return (
    <motion.article
      layout
      whileHover={{ y: viewMode === 'compact' ? -2 : -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden flex group border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 relative hover:scale-[1.02] ${containerClasses[viewMode]} ${featured ? 'md:flex-row md:h-96' : ''}`}
      aria-labelledby={`post-title-${post.id}`}
      aria-describedby={`post-excerpt-${post.id}`}
    >
      {/* Bookmark Button - Position varies by view */}
      <div
        className={`absolute z-10 ${viewMode === 'compact' ? 'right-2 top-1/2 -translate-y-1/2' : 'top-3 right-3'}`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered || bookmarked ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <BookmarkButton
            isBookmarked={bookmarked}
            onToggle={handleToggleBookmark}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
          />
        </motion.div>
      </div>

      {post.coverImage && (
        <Link
          to={`/blog/${post.id}`}
          className={`block overflow-hidden relative ${featured ? 'w-full md:w-1/2 h-64 md:h-full' : imageContainerClasses[viewMode]}`}
          aria-label={`View ${post.title}`}
          style={{ aspectRatio: viewMode === 'compact' ? '1/1' : featured ? '16/9' : '16/9' }}
        >
          <img
            src={post.coverImage}
            alt={`Cover image for ${post.title}`}
            className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
            loading={featured ? 'eager' : 'lazy'}
            decoding="async"
            width={featured ? 800 : viewMode === 'compact' ? 80 : 400}
            height={featured ? 450 : viewMode === 'compact' ? 80 : 225}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Category Badge - Only show in Grid/List */}
          {viewMode !== 'compact' && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: isHovered ? 0 : -100, opacity: isHovered ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="absolute top-3 left-3 bg-accent/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1"
            >
              <Folder size={12} />
              {post.category}
            </motion.div>
          )}
        </Link>
      )}

      <div
        className={`flex ${featured ? 'flex-col md:w-1/2 p-8 justify-center' : contentClasses[viewMode]}`}
      >
        <header className={viewMode === 'compact' ? 'flex-grow pr-12' : 'flex-grow'}>
          {/* Meta Info */}
          <div className="flex items-center flex-wrap gap-3 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            {viewMode === 'compact' && (
              <span className="text-accent font-semibold">{post.category}</span>
            )}
            <span
              className={`flex items-center ${viewMode !== 'compact' ? 'bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full' : ''}`}
            >
              <Calendar size={12} className="mr-1" />
              <time dateTime={post.date}>{post.date}</time>
            </span>
            {viewMode !== 'compact' && (
              <span className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                <Clock size={12} className="mr-1" />
                {formatReadingTime(readingTime)}
              </span>
            )}
          </div>

          <h2
            id={`post-title-${post.id}`}
            className={`${viewMode === 'compact' ? 'text-lg' : 'text-xl'} font-bold font-serif mb-2 text-gray-900 dark:text-white line-clamp-2`}
          >
            <Link
              to={`/blog/${post.id}`}
              className="hover:text-accent dark:hover:text-accent-light transition-colors"
              aria-label={`Read full article: ${post.title}`}
              title={post.title}
            >
              <Highlighter text={post.title} highlight={highlight || ''} />
            </Link>
          </h2>

          {viewMode !== 'compact' && (
            <p
              id={`post-excerpt-${post.id}`}
              className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4"
            >
              <Highlighter text={post.excerpt} highlight={highlight || ''} />
            </p>
          )}

          {/* Tags - Show on hover (Grid/List only) */}
          {viewMode !== 'compact' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                height: isHovered ? 'auto' : 0,
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-3"
            >
              <div className="flex flex-wrap gap-2">
                {displayTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent-light px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                {hasMoreTags && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                    +{post.tags.length - 3} more
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </header>

        {/* Footer (Read More & Share) - Hide in Compact */}
        {viewMode !== 'compact' && (
          <footer className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <Link
              to={`/blog/${post.id}`}
              className="inline-flex items-center text-sm font-semibold text-accent hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors group/link"
              aria-label={`Read more about ${post.title}`}
            >
              Read Article
              <ArrowRight
                size={16}
                className="ml-1 transform group-hover/link:translate-x-1 transition-transform"
              />
            </Link>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={handleShareClick}
            >
              <ShareMenu url={postUrl} title={post.title} />
            </motion.div>
          </footer>
        )}
      </div>
    </motion.article>
  );
};

export default Card;
