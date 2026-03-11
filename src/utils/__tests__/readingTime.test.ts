import { describe, it, expect } from 'vitest';
import { calculateReadingTime, formatReadingTime } from '../readingTime';

describe('calculateReadingTime', () => {
  it('should calculate reading time for short content', () => {
    const content = 'This is a short test content with about ten words here.';
    const time = calculateReadingTime(content);
    expect(time).toBe(1); // Minimum 1 minute
  });

  it('should calculate reading time for medium content', () => {
    const content = Array(500).fill('word').join(' '); // ~500 words
    const time = calculateReadingTime(content);
    expect(time).toBeGreaterThanOrEqual(2);
    expect(time).toBeLessThanOrEqual(3);
  });

  it('should calculate reading time for long content', () => {
    const content = Array(1000).fill('word').join(' '); // ~1000 words
    const time = calculateReadingTime(content);
    expect(time).toBeGreaterThanOrEqual(4);
    expect(time).toBeLessThanOrEqual(6);
  });

  it('should handle empty content', () => {
    const time = calculateReadingTime('');
    expect(time).toBe(1); // Minimum 1 minute
  });

  it('should handle markdown syntax', () => {
    const content = '# Heading\n\n**Bold text** and *italic text* with [links](url)';
    const time = calculateReadingTime(content);
    expect(time).toBeGreaterThanOrEqual(1);
  });
});

describe('formatReadingTime', () => {
  it('should format single minute', () => {
    expect(formatReadingTime(1)).toBe('1 min read');
  });

  it('should format multiple minutes', () => {
    expect(formatReadingTime(5)).toBe('5 min read');
  });

  it('should handle zero minutes', () => {
    expect(formatReadingTime(0)).toBe('1 min read'); // Minimum display
  });
});
