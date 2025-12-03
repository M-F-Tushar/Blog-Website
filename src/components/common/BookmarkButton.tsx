import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: (e: React.MouseEvent) => void;
  className?: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked,
  onToggle,
  className = '',
}) => {
  const { showToast } = useToast();

  const handleToggle = (e: React.MouseEvent) => {
    onToggle(e);

    if (isBookmarked) {
      showToast('info', 'Bookmark removed');
    } else {
      showToast('success', 'Post bookmarked!', 'Added to your reading list');
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className={`p-2 rounded-full shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      title={isBookmarked ? 'Remove bookmark' : 'Save for later'}
    >
      {isBookmarked ? (
        <BookmarkCheck size={18} className="text-accent" />
      ) : (
        <Bookmark size={18} className="text-gray-600 dark:text-gray-400" />
      )}
    </motion.button>
  );
};

export default BookmarkButton;
