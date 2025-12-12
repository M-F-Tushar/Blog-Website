import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Clock,
  ChevronDown,
  ChevronUp,
  Star,
  BookOpen,
  Wrench,
  Video,
  GraduationCap,
  Globe,
  FileText,
  Newspaper,
} from 'lucide-react';
import { Recommendation, RecommendationType, DifficultyLevel } from '../../types/types';

interface RecommendationCardProps {
  item: Recommendation;
  viewMode: 'grid' | 'list';
}

// Type icon mapping
const typeIconMap: Record<string, React.ReactNode> = {
  [RecommendationType.ARTICLE]: <Newspaper size={16} />,
  [RecommendationType.BOOK]: <BookOpen size={16} />,
  [RecommendationType.TOOL]: <Wrench size={16} />,
  [RecommendationType.VIDEO]: <Video size={16} />,
  [RecommendationType.COURSE]: <GraduationCap size={16} />,
  [RecommendationType.WEBSITE]: <Globe size={16} />,
  [RecommendationType.DOCUMENTATION]: <FileText size={16} />,
};

// Type color mapping
const typeColorMap: Record<string, { bg: string; text: string; border: string }> = {
  [RecommendationType.ARTICLE]: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  [RecommendationType.BOOK]: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
  },
  [RecommendationType.TOOL]: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
  },
  [RecommendationType.VIDEO]: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
  [RecommendationType.COURSE]: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  [RecommendationType.WEBSITE]: {
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-200 dark:border-cyan-800',
  },
  [RecommendationType.DOCUMENTATION]: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
};

// Difficulty indicator component
const DifficultyIndicator: React.FC<{ level?: DifficultyLevel }> = ({ level }) => {
  if (!level) return null;

  const config: Record<DifficultyLevel, { dots: number; color: string; label: string }> = {
    beginner: { dots: 1, color: 'bg-green-500', label: 'Beginner' },
    intermediate: { dots: 2, color: 'bg-yellow-500', label: 'Intermediate' },
    advanced: { dots: 3, color: 'bg-red-500', label: 'Advanced' },
  };

  const { dots, color, label } = config[level];

  return (
    <div className="flex items-center gap-1.5" title={label}>
      <div className="flex gap-0.5">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i < dots ? color : 'bg-secondary-200 dark:bg-secondary-700'}`}
          />
        ))}
      </div>
      <span className="text-xs text-secondary-500 dark:text-secondary-400">{label}</span>
    </div>
  );
};

// Default gradient thumbnails as fallback
const getGradientFallback = (type: RecommendationType): string => {
  const gradients: Record<string, string> = {
    [RecommendationType.ARTICLE]: 'from-blue-500 to-blue-600',
    [RecommendationType.BOOK]: 'from-green-500 to-green-600',
    [RecommendationType.TOOL]: 'from-purple-500 to-purple-600',
    [RecommendationType.VIDEO]: 'from-red-500 to-red-600',
    [RecommendationType.COURSE]: 'from-yellow-500 to-yellow-600',
    [RecommendationType.WEBSITE]: 'from-cyan-500 to-cyan-600',
    [RecommendationType.DOCUMENTATION]: 'from-indigo-500 to-indigo-600',
  };
  return gradients[type] || 'from-secondary-500 to-secondary-600';
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ item, viewMode }) => {
  const [showAuthorNote, setShowAuthorNote] = useState(false);
  const [imageError, setImageError] = useState(false);

  const colors = typeColorMap[item.type] || typeColorMap[RecommendationType.ARTICLE];
  const icon = typeIconMap[item.type] || <Globe size={16} />;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        variants={cardVariants}
        className="group bg-white dark:bg-secondary-800 rounded-2xl shadow-sm border border-secondary-100 dark:border-secondary-700 overflow-hidden hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Thumbnail */}
          <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
            {item.thumbnail && !imageError ? (
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${getGradientFallback(item.type)} flex items-center justify-center`}
              >
                <div className="text-white/80 scale-150">{icon}</div>
              </div>
            )}
            {item.isFeatured && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                <Star size={12} fill="currentColor" /> Featured
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}
              >
                {icon} {item.type}
              </span>
              <DifficultyIndicator level={item.difficulty} />
              {item.estimatedTime && (
                <span className="inline-flex items-center gap-1 text-xs text-secondary-500 dark:text-secondary-400">
                  <Clock size={14} /> {item.estimatedTime}
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold font-serif text-secondary-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {item.title}
            </h3>
            <p className="text-secondary-600 dark:text-secondary-300 text-sm mb-4 line-clamp-2">
              {item.description}
            </p>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author Note */}
            {item.authorNote && (
              <div className="mb-4">
                <button
                  onClick={() => setShowAuthorNote(!showAuthorNote)}
                  className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  {showAuthorNote ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  Why I recommend this
                </button>
                {showAuthorNote && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-sm text-secondary-600 dark:text-secondary-400 italic pl-4 border-l-2 border-primary-300 dark:border-primary-700"
                  >
                    &quot;{item.authorNote}&quot;
                  </motion.p>
                )}
              </div>
            )}

            <div className="mt-auto">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Visit Resource <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      variants={cardVariants}
      className="group bg-white dark:bg-secondary-800 rounded-2xl shadow-sm border border-secondary-100 dark:border-secondary-700 overflow-hidden hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-700 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden">
        {item.thumbnail && !imageError ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${getGradientFallback(item.type)} flex items-center justify-center`}
          >
            <div className="text-white/80 scale-[2]">{icon}</div>
          </div>
        )}
        {item.isFeatured && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1 shadow-lg">
            <Star size={12} fill="currentColor" /> Featured
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}
          >
            {icon} {item.type}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <DifficultyIndicator level={item.difficulty} />
          {item.estimatedTime && (
            <span className="inline-flex items-center gap-1 text-xs text-secondary-500 dark:text-secondary-400">
              <Clock size={12} /> {item.estimatedTime}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold font-serif text-secondary-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-secondary-600 dark:text-secondary-300 text-sm mb-4 line-clamp-3 flex-grow">
          {item.description}
        </p>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 text-xs rounded-full hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="px-2 py-0.5 text-secondary-500 dark:text-secondary-400 text-xs">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Author Note Preview */}
        {item.authorNote && (
          <div className="mb-4">
            <button
              onClick={() => setShowAuthorNote(!showAuthorNote)}
              className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              {showAuthorNote ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              Why I recommend this
            </button>
            {showAuthorNote && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-xs text-secondary-600 dark:text-secondary-400 italic pl-3 border-l-2 border-primary-300 dark:border-primary-700"
              >
                &quot;{item.authorNote}&quot;
              </motion.p>
            )}
          </div>
        )}

        <div className="mt-auto pt-2">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-secondary-100 dark:bg-secondary-700 text-secondary-900 dark:text-white font-medium rounded-lg hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 transition-all duration-300 group/btn"
          >
            Visit Resource{' '}
            <ExternalLink
              size={16}
              className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
            />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
