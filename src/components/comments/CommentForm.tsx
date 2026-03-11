import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
  placeholder?: string;
  buttonText?: string;
  onCancel?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  isSubmitting,
  placeholder = 'Write a comment...',
  buttonText = 'Post Comment',
  onCancel,
}) => {
  const [content, setContent] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await onSubmit(content);
    setContent('');
  };

  if (!user) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
        <p className="text-gray-600 dark:text-gray-300 mb-2">Please sign in to leave a comment.</p>
        <a
          href="/admin/login"
          className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-4">
        <label htmlFor="comment" className="sr-only">
          {placeholder}
        </label>
        <textarea
          id="comment"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? 'Posting...' : buttonText}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
