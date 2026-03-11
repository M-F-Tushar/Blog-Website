import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeMarkdown } from '../sanitize';

describe('sanitizeHtml', () => {
  it('should allow safe HTML tags', () => {
    const input = '<p>Hello <strong>world</strong></p>';
    const output = sanitizeHtml(input);
    expect(output).toContain('<p>');
    expect(output).toContain('<strong>');
    expect(output).toContain('Hello');
  });

  it('should remove script tags', () => {
    const input = '<p>Safe content</p><script>alert("XSS")</script>';
    const output = sanitizeHtml(input);
    expect(output).not.toContain('<script>');
    expect(output).not.toContain('alert');
    expect(output).toContain('Safe content');
  });

  it('should remove onclick handlers', () => {
    const input = '<button onclick="alert(\'XSS\')">Click me</button>';
    const output = sanitizeHtml(input);
    expect(output).not.toContain('onclick');
    expect(output).not.toContain('alert');
  });

  it('should remove javascript: URLs', () => {
    const input = '<a href="javascript:alert(\'XSS\')">Link</a>';
    const output = sanitizeHtml(input);
    expect(output).not.toContain('javascript:');
  });

  it('should preserve safe links', () => {
    const input = '<a href="https://example.com">Safe Link</a>';
    const output = sanitizeHtml(input);
    expect(output).toContain('href="https://example.com"');
    expect(output).toContain('Safe Link');
  });

  it('should handle empty input', () => {
    const output = sanitizeHtml('');
    expect(output).toBe('');
  });
});

describe('sanitizeMarkdown', () => {
  it('should sanitize markdown-rendered HTML', () => {
    const input = '# Heading\n\n<script>alert("XSS")</script>\n\nSafe content';
    const output = sanitizeMarkdown(input);
    expect(output).not.toContain('<script>');
    expect(output).toContain('Safe content');
  });

  it('should preserve markdown formatting', () => {
    const input = '**Bold** and *italic*';
    const output = sanitizeMarkdown(input);
    expect(output).toContain('Bold');
    expect(output).toContain('italic');
  });
});
