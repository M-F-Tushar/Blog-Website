const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / WORDS_PER_MINUTE);
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}

export function getWordCount(content: string): number {
  return content.trim().split(/\s+/).length;
}
