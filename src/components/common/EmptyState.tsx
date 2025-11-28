import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📝',
  title,
  description,
  actionLabel,
  actionLink,
  onAction,
}) => (
  <div className="text-center py-16">
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
      {description}
    </p>
    {actionLabel && (
      actionLink ? (
        <Link
          to={actionLink}
          className="inline-block px-6 py-3 bg-accent text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
        >
          {actionLabel}
        </Link>
      ) : onAction ? (
        <button
          onClick={onAction}
          className="inline-block px-6 py-3 bg-accent text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
        >
          {actionLabel}
        </button>
      ) : null
    )}
  </div>
);
