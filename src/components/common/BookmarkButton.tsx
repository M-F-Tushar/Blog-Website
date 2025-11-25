import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface BookmarkButtonProps {
    isBookmarked: boolean;
    onToggle: (e: React.MouseEvent) => void;
    className?: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ isBookmarked, onToggle, className = '' }) => {
    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            className={`p-2 rounded-full shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            title={isBookmarked ? "Remove bookmark" : "Save for later"}
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
