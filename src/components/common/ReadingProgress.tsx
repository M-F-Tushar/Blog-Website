import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface ReadingProgressProps {
  position?: 'top' | 'bottom';
  height?: number;
  showPercentage?: boolean;
  color?: string;
  hideOnComplete?: boolean;
  totalWords?: number;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({
  position = 'top',
  height = 3,
  showPercentage = true,
  color = 'from-primary-500 via-primary-600 to-accent',
  hideOnComplete = false,
  totalWords = 0,
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [percentage, setPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const percent = Math.round(latest * 100);
      setPercentage(percent);

      // Hide when at top
      setIsVisible(percent > 0);

      // Hide when complete
      if (hideOnComplete && percent >= 100) {
        setTimeout(() => setIsVisible(false), 1000);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, hideOnComplete]);

  // Calculate time remaining
  const calculateTimeRemaining = () => {
    if (!totalWords || percentage === 0) return '';

    const WORDS_PER_MINUTE = 200;
    const scrollDecimal = percentage / 100;
    const wordsRead = Math.floor(totalWords * scrollDecimal);
    const wordsRemaining = totalWords - wordsRead;
    const minutesRemaining = Math.ceil(wordsRemaining / WORDS_PER_MINUTE);

    if (minutesRemaining === 0 || percentage >= 95) return 'Almost done!';
    if (minutesRemaining === 1) return '1 min left';
    return `${minutesRemaining} min left`;
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-[60] shadow-lg origin-left`}
        style={{ height: `${height}px`, scaleX }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Reading progress: ${percentage}%`}
      >
        <div className={`w-full h-full bg-gradient-to-r ${color}`} />
      </motion.div>

      {/* Percentage Indicator */}
      {showPercentage && percentage > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed ${position === 'top' ? 'top-4' : 'bottom-4'} right-4 z-[60] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-primary-600 dark:text-primary-400 font-bold">{percentage}%</span>
            {totalWords > 0 && (
              <>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <span className="text-gray-600 dark:text-gray-400">{calculateTimeRemaining()}</span>
              </>
            )}
          </div>

          {/* Tooltip on hover */}
          {showTooltip && totalWords > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap"
            >
              {Math.floor((totalWords * percentage) / 100)} of {totalWords} words read
              <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45" />
            </motion.div>
          )}
        </motion.div>
      )}
    </>
  );
};

export default ReadingProgress;
