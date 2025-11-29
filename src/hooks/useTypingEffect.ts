import { useState, useEffect } from 'react';

export const useTypingEffect = (
  text: string,
  speed: number = 100,
  delay: number = 500
): { displayedText: string; isTyping: boolean } => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDelaying, setIsDelaying] = useState(true);

  useEffect(() => {
    // Initial delay before typing starts
    if (isDelaying) {
      const delayTimer = setTimeout(() => {
        setIsDelaying(false);
      }, delay);
      return () => clearTimeout(delayTimer);
    }

    // Typing effect
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed, delay, isDelaying]);

  return {
    displayedText,
    isTyping: currentIndex < text.length,
  };
};
