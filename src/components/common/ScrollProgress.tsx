import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

interface ScrollProgressProps {
    totalWords?: number;
}

const ScrollProgress: React.FC<ScrollProgressProps> = ({ totalWords = 0 }) => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [percentage, setPercentage] = useState(0);
    const [showMilestone, setShowMilestone] = useState(false);
    const [milestoneText, setMilestoneText] = useState('');
    const [lastMilestone, setLastMilestone] = useState(0);

    useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            const percent = Math.round(latest * 100);
            setPercentage(percent);

            // Check for milestones
            const milestones = [25, 50, 75, 100];
            const currentMilestone = milestones.find(m =>
                percent >= m && m > lastMilestone
            );

            if (currentMilestone) {
                setLastMilestone(currentMilestone);
                setMilestoneText(
                    currentMilestone === 100
                        ? '🎉 Article Complete!'
                        : `${currentMilestone}% Complete`
                );
                setShowMilestone(true);
                setTimeout(() => setShowMilestone(false), 2000);
            }
        });

        return () => unsubscribe();
    }, [scrollYProgress, lastMilestone]);

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

    return (
        <>
            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent via-indigo-500 to-purple-600 origin-left z-[60] shadow-lg"
                style={{ scaleX }}
            />

            {/* Percentage and Time Indicator */}
            {percentage > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed top-4 right-4 z-[60] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center gap-2 text-xs font-medium">
                        <span className="text-accent dark:text-accent-light font-bold">
                            {percentage}%
                        </span>
                        {totalWords > 0 && (
                            <>
                                <span className="text-gray-300 dark:text-gray-600">|</span>
                                <span className="text-gray-600 dark:text-gray-400">
                                    {calculateTimeRemaining()}
                                </span>
                            </>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Milestone Celebration */}
            <AnimatePresence>
                {showMilestone && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: -50 }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[70] bg-accent text-white px-6 py-3 rounded-lg shadow-2xl font-bold text-lg"
                    >
                        {milestoneText}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ScrollProgress;
