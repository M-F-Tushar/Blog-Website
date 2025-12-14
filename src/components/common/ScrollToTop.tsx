import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const updateScrollState = () => {
      const scrollY = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollableHeight = documentHeight - windowHeight;

      // Calculate scroll progress (0-100)
      const progress = (scrollY / scrollableHeight) * 100;
      setScrollProgress(progress);

      // Show button after scrolling 300px
      setIsVisible(scrollY > 300);

      // Show scroll to bottom only if not near bottom
      setShowScrollToBottom(scrollY < scrollableHeight - 500);
    };

    window.addEventListener('scroll', updateScrollState);
    updateScrollState(); // Initial call

    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Home') {
        e.preventDefault();
        scrollToTop();
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToBottom();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // SVG circle properties for progress ring
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
          {/* Scroll to Top with Progress Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="relative"
          >
            {/* Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 50 50">
              {/* Background circle */}
              <circle
                cx="25"
                cy="25"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-300 dark:text-gray-600"
              />
              {/* Progress circle */}
              <circle
                cx="25"
                cy="25"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-accent transition-all duration-300"
              />
            </svg>

            {/* Button */}
            <button
              onClick={scrollToTop}
              className="relative w-12 h-12 flex items-center justify-center bg-accent text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
              aria-label="Scroll to top (Home key)"
              title="Scroll to top (Home key)"
            >
              <ArrowUp size={20} />
            </button>

            {/* Scroll Progress Percentage */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {Math.round(scrollProgress)}%
            </div>
          </motion.div>

          {/* Scroll to Bottom Button */}
          {showScrollToBottom && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToBottom}
              className="w-12 h-12 flex items-center justify-center bg-gray-600 dark:bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
              aria-label="Scroll to bottom (End key)"
              title="Scroll to bottom (End key)"
            >
              <ArrowDown size={20} />
            </motion.button>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
