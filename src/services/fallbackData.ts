/**
 * Fallback/Mock data for when Supabase is not configured
 * This ensures the site still works in demo mode without a backend
 */

import { Post, Recommendation, PostStatus, RecommendationType } from '../types/types';
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
    author: {
      name: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    readTime: '2 min read',
    commentCount: 0,
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
    author: {
      name: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    readTime: '3 min read',
    commentCount: 2,
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
    author: {
      name: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    readTime: '4 min read',
    commentCount: 5,
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
    type: RecommendationType.WEBSITE,
    isInitial: true,
  },
  {
    id: 'rec-2',
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    description: 'Comprehensive guide to TypeScript fundamentals and advanced features.',
    type: RecommendationType.DOCUMENTATION,
    isInitial: true,
  },
  {
    id: 'rec-3',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    description: 'The most comprehensive web development documentation resource.',
    type: RecommendationType.WEBSITE,
    isInitial: true,
  },
  {
    id: 'rec-4',
    title: 'Vite Guide',
    url: 'https://vitejs.dev/guide/',
    description: 'Next generation frontend tooling for fast development.',
    type: RecommendationType.DOCUMENTATION,
    isInitial: true,
  },
];

/**
 * Mock site settings for demo/fallback mode
 */
export const FALLBACK_SETTINGS: Omit<DatabaseSettings, 'id' | 'created_at' | 'updated_at'> = {
  featured_post_id: 'welcome-post',
  site_title: 'My Blog',
  site_name: 'My Blog',
  site_description: 'A modern personal blog built with React and TypeScript',
  author_name: 'Your Name',
  author_tagline: 'Web Developer & Technology Enthusiast',
  author_bio:
    'Passionate about building modern web applications and sharing knowledge through writing.',
  social_github: 'https://github.com/yourusername',
  social_linkedin: 'https://linkedin.com/in/yourprofile',
  social_email: 'your-email@example.com',
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
  ui_text: {
    home: {
      welcomeBadge: 'Welcome to my digital garden',
      startReading: 'Start Reading',
      moreAboutMe: 'More About Me',
      featuredStory: 'Featured Story',
      trendingTopics: 'Trending Topics',
      latestArticles: 'Latest Articles',
      newsletterTitle: 'Subscribe to my newsletter',
      newsletterDescription: 'Get the latest articles, tutorials, and insights delivered straight to your inbox. No spam, just quality content.',
      subscribeButton: 'Subscribe',
    },
    footer: {
      tagline: 'Exploring the frontiers of web development, computer science, and technology. Join me on this journey of continuous learning and creation.',
      exploreTitle: 'Explore',
      latestTitle: 'Latest Articles',
      stayConnectedTitle: 'Stay Connected',
      newsletterDescription: 'Get the latest posts and updates delivered straight to your inbox.',
      subscribeButton: 'Subscribe',
      copyrightText: 'Made with Heart in React.',
    },
    header: {
      home: 'Home',
      about: 'About',
      blog: 'Blog',
      recommendations: 'Recommendations',
      bookmarks: 'Bookmarks',
      contact: 'Contact',
      searchPlaceholder: 'Search...',
    },
  },
  homepage_layout: {
    showHero: true,
    showFeaturedPost: true,
    showTrendingTopics: true,
    showLatestArticles: true,
    showNewsletter: true,
  },
};

// Re-export isSupabaseConfigured for convenience
export { isSupabaseConfigured as isSupabaseAvailable } from './supabase';
