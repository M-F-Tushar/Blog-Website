/**
 * Fallback/Mock data for when Supabase is not configured
 * This ensures the site still works in demo mode without a backend
 */

import { Post, Recommendation, PostStatus } from '../types/types';
import type { DatabaseSettings } from './supabase';

/**
 * Mock posts for demo/fallback mode
 */
export const FALLBACK_POSTS: Post[] = [
  {
    id: 'welcome-post',
    title: 'Welcome to My Blog',
    date: 'December 1, 2024',
    category: 'General',
    tags: ['welcome', 'introduction'],
    excerpt:
      'Welcome to my personal blog! This is a demo post showing how the site works without a backend.',
    status: 'published' as PostStatus,
    content: `# Welcome to My Blog

This is a demo post that appears when Supabase is not configured. 

## Features

This blog includes:
- Modern React architecture with TypeScript
- Progressive Web App (PWA) support
- Dark mode
- Markdown rendering with syntax highlighting
- Responsive design

## Getting Started

To see your own content, configure Supabase following the setup guide in the repository.

Thank you for visiting!`,
    isInitial: true,
  },
  {
    id: 'demo-post-2',
    title: 'Setting Up Your Development Environment',
    date: 'November 28, 2024',
    category: 'Technology',
    tags: ['development', 'setup', 'tutorial'],
    excerpt:
      'Learn how to set up a modern web development environment with all the tools you need.',
    status: 'published' as PostStatus,
    content: `# Setting Up Your Development Environment

A well-configured development environment is essential for productive coding.

## Essential Tools

1. **Code Editor**: VS Code, WebStorm, or Sublime Text
2. **Version Control**: Git and GitHub
3. **Package Manager**: npm or yarn
4. **Terminal**: iTerm2, Hyper, or Windows Terminal

## Configuration

Make sure to install the necessary extensions and configure your tools properly.

Happy coding!`,
    isInitial: true,
  },
  {
    id: 'demo-post-3',
    title: 'Introduction to TypeScript',
    date: 'November 25, 2024',
    category: 'Technology',
    tags: ['typescript', 'javascript', 'programming'],
    excerpt:
      'Discover the benefits of TypeScript and how it can improve your JavaScript development.',
    status: 'published' as PostStatus,
    content: `# Introduction to TypeScript

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.

## Why TypeScript?

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Autocomplete and intelligent refactoring
- **Modern Features**: Use the latest ECMAScript features
- **Scalability**: Great for large codebases

## Example

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}!\`;
}
\`\`\`

TypeScript helps you write more maintainable and robust code.`,
    isInitial: true,
  },
];

/**
 * Mock recommendations for demo/fallback mode
 */
export const FALLBACK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'React Documentation',
    url: 'https://react.dev',
    description: 'The official React documentation with guides and API reference.',
    type: 'website',
    isInitial: true,
  },
  {
    id: 'rec-2',
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    description: 'Comprehensive guide to TypeScript fundamentals and advanced features.',
    type: 'documentation',
    isInitial: true,
  },
  {
    id: 'rec-3',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    description: 'The most comprehensive web development documentation resource.',
    type: 'website',
    isInitial: true,
  },
  {
    id: 'rec-4',
    title: 'Vite Guide',
    url: 'https://vitejs.dev/guide/',
    description: 'Next generation frontend tooling for fast development.',
    type: 'documentation',
    isInitial: true,
  },
];

/**
 * Mock site settings for demo/fallback mode
 */
export const FALLBACK_SETTINGS: Omit<DatabaseSettings, 'id' | 'created_at' | 'updated_at'> = {
  featured_post_id: 'welcome-post',
  site_name: 'My Blog',
  site_description: 'A modern personal blog built with React and TypeScript',
  author_name: 'Blog Author',
  author_tagline: 'Web Developer & Technology Enthusiast',
  author_bio:
    'Passionate about building modern web applications and sharing knowledge through writing.',
  social_github: 'https://github.com',
  social_linkedin: 'https://linkedin.com',
  social_email: 'contact@example.com',
  categories: ['Technology', 'General', 'Reflections'],
  skills: [
    { name: 'React', level: 4, iconName: 'react' },
    { name: 'TypeScript', level: 4, iconName: 'typescript' },
    { name: 'JavaScript', level: 5, iconName: 'javascript' },
    { name: 'Node.js', level: 3, iconName: 'nodejs' },
    { name: 'CSS', level: 4, iconName: 'css' },
  ],
  timeline: [
    {
      year: '2024',
      title: 'Full Stack Developer',
      organization: 'Tech Company',
      description: 'Building modern web applications',
      type: 'work',
    },
    {
      year: '2023',
      title: 'Bachelor of Science',
      organization: 'University',
      description: 'Computer Science',
      type: 'education',
    },
  ],
  achievements: [
    {
      title: 'Web Development Certificate',
      issuer: 'Online Learning Platform',
      year: '2023',
    },
  ],
};

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseAvailable = (): boolean => {
  const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
  const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
  return Boolean(supabaseUrl && supabaseAnonKey);
};
