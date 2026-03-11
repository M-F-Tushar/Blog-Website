const WORDS_PER_MINUTE = 200;

export const calculateReadingTime = (content: string): number => {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / WORDS_PER_MINUTE);
  return minutes;
};

export const formatReadingTime = (minutes: number): string => {
  return `${minutes} min read`;
};

export const getWordCount = (content: string): number => {
  return content.trim().split(/\s+/).length;
};

export const calculateRemainingTime = (totalWords: number, scrollPercentage: number): number => {
  const wordsRead = Math.floor(totalWords * scrollPercentage);
  const wordsRemaining = totalWords - wordsRead;
  const minutesRemaining = Math.ceil(wordsRemaining / WORDS_PER_MINUTE);
  return Math.max(0, minutesRemaining);
};

export const formatRemainingTime = (minutes: number): string => {
  if (minutes === 0) return 'Almost done!';
  if (minutes === 1) return '1 min left';
  return `${minutes} min left`;
};
