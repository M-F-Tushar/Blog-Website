/**
 * Fallback/Mock data for when Supabase is not configured
 * This ensures the site still works in demo mode without a backend
 */

import { Post, Recommendation, PostStatus, RecommendationType } from '../types/types';
import type { DatabaseSettings } from './supabase';
import { DEFAULT_AVATAR } from '../constants/constants';

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
      avatar: DEFAULT_AVATAR,
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
      avatar: DEFAULT_AVATAR,
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
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
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
    description:
      'The official React documentation with comprehensive guides, API reference, and interactive examples. Perfect for learning React from the ground up.',
    type: RecommendationType.WEBSITE,
    isInitial: true,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    difficulty: 'beginner',
    estimatedTime: '2-3 hours',
    authorNote:
      'The best starting point for anyone learning React. The new docs are incredibly well-designed with interactive examples.',
    tags: ['React', 'Frontend', 'JavaScript', 'Official Docs'],
    isFeatured: true,
  },
  {
    id: 'rec-2',
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    description:
      'Comprehensive guide to TypeScript fundamentals and advanced features. Learn type safety, interfaces, generics, and more.',
    type: RecommendationType.DOCUMENTATION,
    isInitial: true,
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
    difficulty: 'intermediate',
    estimatedTime: '4-5 hours',
    authorNote:
      'Essential reading for any JavaScript developer looking to level up. TypeScript has transformed how I write code.',
    tags: ['TypeScript', 'JavaScript', 'Type Safety', 'Programming'],
    isFeatured: true,
  },
  {
    id: 'rec-3',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    description:
      'The most comprehensive web development documentation resource. Covers HTML, CSS, JavaScript, Web APIs, and more.',
    type: RecommendationType.WEBSITE,
    isInitial: true,
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    difficulty: 'beginner',
    estimatedTime: 'Reference',
    authorNote: 'My go-to reference for everything web. Bookmark this and use it daily!',
    tags: ['Web Development', 'HTML', 'CSS', 'JavaScript', 'Reference'],
    isFeatured: false,
  },
  {
    id: 'rec-4',
    title: 'Vite Guide',
    url: 'https://vitejs.dev/guide/',
    description:
      'Next generation frontend tooling for fast development. Lightning-fast hot module replacement and optimized builds.',
    type: RecommendationType.DOCUMENTATION,
    isInitial: true,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    difficulty: 'intermediate',
    estimatedTime: '1 hour',
    authorNote:
      'Vite has completely changed my development workflow. The speed improvement over webpack is incredible.',
    tags: ['Vite', 'Build Tools', 'Frontend', 'Development'],
    isFeatured: false,
  },
  {
    id: 'rec-5',
    title: 'Clean Code by Robert C. Martin',
    url: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
    description:
      'A handbook of agile software craftsmanship. Learn principles, patterns, and practices for writing clean, maintainable code.',
    type: RecommendationType.BOOK,
    isInitial: true,
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
    difficulty: 'intermediate',
    estimatedTime: '8-10 hours',
    authorNote:
      'Every developer should read this at least once. It fundamentally changed how I approach writing code.',
    tags: ['Clean Code', 'Best Practices', 'Software Engineering', 'Book'],
    isFeatured: true,
  },
  {
    id: 'rec-6',
    title: 'VS Code',
    url: 'https://code.visualstudio.com/',
    description:
      'Free, powerful code editor with excellent TypeScript support, extensions, and integrated terminal.',
    type: RecommendationType.TOOL,
    isInitial: true,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    difficulty: 'beginner',
    estimatedTime: '30 min setup',
    authorNote: 'The best code editor available today. The extension ecosystem is unmatched.',
    tags: ['Editor', 'IDE', 'Development Tools', 'Productivity'],
    isFeatured: false,
  },
  {
    id: 'rec-7',
    title: 'Fireship YouTube Channel',
    url: 'https://www.youtube.com/@Fireship',
    description:
      'Fast-paced, entertaining tech tutorials covering modern web development, frameworks, and programming concepts.',
    type: RecommendationType.VIDEO,
    isInitial: true,
    thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=300&fit=crop',
    difficulty: 'intermediate',
    estimatedTime: '5-10 min/video',
    authorNote:
      'The most entertaining way to learn about new tech. Perfect for staying up-to-date with the industry.',
    tags: ['YouTube', 'Tutorials', 'Web Development', 'Programming'],
    isFeatured: false,
  },
  {
    id: 'rec-8',
    title: 'The Complete Web Developer Course',
    url: 'https://www.udemy.com/course/the-complete-web-developer-course-2/',
    description:
      'Comprehensive course covering HTML, CSS, JavaScript, React, Node.js, and more. Perfect for beginners.',
    type: RecommendationType.COURSE,
    isInitial: true,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    difficulty: 'beginner',
    estimatedTime: '60+ hours',
    authorNote:
      'Great structured learning path for those starting from scratch. Covers everything you need to become a web developer.',
    tags: ['Course', 'Web Development', 'Full Stack', 'Beginner Friendly'],
    isFeatured: false,
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
  social_twitter: '',
  social_instagram: '',
  social_youtube: '',
  social_discord: '',
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
      newsletterDescription:
        'Get the latest articles, tutorials, and insights delivered straight to your inbox. No spam, just quality content.',
      subscribeButton: 'Subscribe',
    },
    footer: {
      tagline:
        'Exploring the frontiers of web development, computer science, and technology. Join me on this journey of continuous learning and creation.',
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
  appearance: {
    primaryColor: '#6366f1',
    accentColor: '#8b5cf6',
    fontFamily: 'Inter',
    logoUrl: '',
    faviconUrl: '',
    defaultTheme: 'system',
  },
  navigation: {
    menuItems: [
      { id: 'home', label: 'Home', path: '/', isExternal: false, visible: true, order: 1 },
      { id: 'about', label: 'About', path: '/about', isExternal: false, visible: true, order: 2 },
      { id: 'blog', label: 'Blog', path: '/blog', isExternal: false, visible: true, order: 3 },
      {
        id: 'recommendations',
        label: 'Recommendations',
        path: '/recommendations',
        isExternal: false,
        visible: true,
        order: 4,
      },
      {
        id: 'contact',
        label: 'Contact',
        path: '/contact',
        isExternal: false,
        visible: true,
        order: 5,
      },
    ],
  },
  seo: {
    defaultMetaTitle: 'My Blog - Personal Blog',
    defaultMetaDescription: 'A modern personal blog built with React and TypeScript.',
    ogImage: '',
    twitterHandle: '',
    pageMeta: {},
  },
};

// Re-export isSupabaseConfigured for convenience
export { isSupabaseConfigured as isSupabaseAvailable } from './supabase';
