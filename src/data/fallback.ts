/**
 * Fallback/demo data — used when Supabase is not configured.
 * Kept intentionally minimal. Full content lives in the database.
 */

import type {
  Post,
  Recommendation,
  SiteSettings,
  Project,
  Publication,
  PageContent,
  CVEducation,
  CVExperience,
  CVCertification,
} from '../types/types';
import { PostStatus, RecommendationType } from '../types/types';
import type {
  DatabaseCVEducation,
  DatabaseCVExperience,
  DatabaseCVCertification,
  DatabasePageContent,
  DatabaseSettings,
} from '../types/database';

// ─── Posts ───────────────────────────────────────────────────────────

export const FALLBACK_POSTS: Post[] = [
  {
    id: 'welcome-post',
    title: 'Welcome to Your Blog',
    slug: 'welcome-to-your-blog',
    date: 'January 1, 2025',
    category: 'General',
    tags: ['welcome', 'getting-started'],
    excerpt:
      'This is a sample post. Configure Supabase to manage your content from the admin panel.',
    status: PostStatus.PUBLISHED,
    content:
      '# Welcome\n\nThis is a sample post shown when the database is not connected.\n\nConfigure Supabase and use the admin panel at `/admin` to create and manage your posts.',
    isInitial: true,
    author: {
      name: 'Author',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop',
    },
    readTime: '1 min read',
  },
];

// ─── Recommendations ────────────────────────────────────────────────

export const FALLBACK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'React Documentation',
    url: 'https://react.dev',
    description: 'The official React documentation with guides and API reference.',
    type: RecommendationType.ARTICLE,
    isInitial: true,
  },
];

// ─── Settings ───────────────────────────────────────────────────────

export const FALLBACK_SETTINGS: SiteSettings = {
  id: 'default',
  featured_post_id: null,
  site_name: 'Mahir Faysal Tushar',
  site_description:
    'AI/ML Enthusiast & CS Student — Exploring the frontiers of artificial intelligence, machine learning, and technology.',
  author_name: 'Mahir Faysal Tushar',
  author_tagline: 'CS Student | AI/ML Enthusiast | Aspiring Researcher',
  author_bio:
    'Passionate about artificial intelligence, machine learning, and building intelligent systems.',
  social_github: 'https://github.com/M-F-Tushar',
  social_linkedin: 'https://linkedin.com/in/',
  social_email: 'contact@example.com',
  categories: [
    'AI & ML',
    'Web Development',
    'Quantum Computing',
    'AI Ethics',
    'Space Science',
    'MLOps',
  ],
  skills: [
    { name: 'Python', level: 4 },
    { name: 'Machine Learning', level: 3 },
    { name: 'React', level: 4 },
    { name: 'TypeScript', level: 4 },
  ],
  timeline: [
    {
      year: '2024',
      title: 'CS Student & Researcher',
      organization: 'University',
      description: 'Studying Computer Science with focus on AI/ML research.',
      type: 'education',
    },
  ],
  achievements: [{ title: 'Research Blog Launch', issuer: 'Self', year: '2024' }],
};

/**
 * FALLBACK_SETTINGS extended with fields the DatabaseSettings type expects
 * (navigation, appearance, etc.). Used by the admin panel hooks.
 */
export const FALLBACK_DB_SETTINGS: DatabaseSettings = {
  ...FALLBACK_SETTINGS,
  site_title: FALLBACK_SETTINGS.site_name,
  categories: FALLBACK_SETTINGS.categories,
  skills: FALLBACK_SETTINGS.skills as unknown as DatabaseSettings['skills'],
  timeline: FALLBACK_SETTINGS.timeline as unknown as DatabaseSettings['timeline'],
  achievements: FALLBACK_SETTINGS.achievements as unknown as DatabaseSettings['achievements'],
  navigation: {
    menuItems: [
      { id: 'home', label: 'Home', path: '/', isExternal: false, visible: true, order: 1 },
      { id: 'about', label: 'About', path: '/about', isExternal: false, visible: true, order: 2 },
      { id: 'blog', label: 'Blog', path: '/blog', isExternal: false, visible: true, order: 3 },
      {
        id: 'publications',
        label: 'Publications',
        path: '/publications',
        isExternal: false,
        visible: true,
        order: 4,
      },
      {
        id: 'projects',
        label: 'Projects',
        path: '/projects',
        isExternal: false,
        visible: true,
        order: 5,
      },
      {
        id: 'playground',
        label: 'Playground',
        path: '/playground',
        isExternal: false,
        visible: true,
        order: 6,
      },
      { id: 'cv', label: 'CV', path: '/cv', isExternal: false, visible: true, order: 7 },
      {
        id: 'contact',
        label: 'Contact',
        path: '/contact',
        isExternal: false,
        visible: true,
        order: 8,
      },
    ],
  },
};

// ─── Projects ───────────────────────────────────────────────────────

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Blog Website',
    description: 'A modern, full-featured blog platform built with Astro, React, and Tailwind CSS.',
    techStack: ['Astro', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    githubUrl: 'https://github.com/M-F-Tushar/Blog-Website',
    liveUrl: 'https://mahirfaysaltusherblog.is-a.dev',
    sortOrder: 0,
    isFeatured: true,
    status: 'active',
    isInitial: true,
  },
];

// ─── Publications ───────────────────────────────────────────────────

export const FALLBACK_PUBLICATIONS: Publication[] = [
  {
    id: 'pub-1',
    title: 'Exploring Large Language Models for Code Generation: A Comprehensive Survey',
    authors: ['Mahir Faysal Tushar'],
    venue: 'arXiv Preprint',
    year: 2025,
    type: 'preprint',
    abstract:
      'A comprehensive survey of recent advances in large language models for automated code generation.',
    sortOrder: 0,
    isInitial: true,
  },
];

// ─── Page Content ───────────────────────────────────────────────────

export const FALLBACK_PAGE_CONTENT: DatabasePageContent[] = [
  {
    id: 'pc-home-hero',
    page_name: 'home',
    section_key: 'hero',
    title: null,
    content: JSON.stringify({
      title: 'Mahir Faysal Tushar',
      taglines: ['AI/ML Enthusiast', 'CS Student', 'Open Source Contributor', 'Tech Blogger'],
      description:
        'Exploring the frontiers of artificial intelligence, machine learning, and technology.',
    }),
    metadata: null,
    sort_order: 0,
    is_initial: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pc-about-intro',
    page_name: 'about',
    section_key: 'intro',
    title: null,
    content: JSON.stringify({
      heading: 'About Me',
      text: 'Passionate about artificial intelligence, machine learning, and building intelligent systems.',
    }),
    metadata: null,
    sort_order: 0,
    is_initial: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pc-contact-info',
    page_name: 'contact',
    section_key: 'info',
    title: null,
    content: JSON.stringify({
      heading: 'Get in Touch',
      availability: 'Available for collaborations and research opportunities',
    }),
    metadata: null,
    sort_order: 0,
    is_initial: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ─── CV Data ────────────────────────────────────────────────────────

export const FALLBACK_CV_EDUCATION: CVEducation[] = [
  {
    id: 'edu-1',
    institution: 'University (placeholder)',
    degree: 'B.Sc. in Computer Science and Engineering',
    field: 'Computer Science',
    start_year: 2022,
    description: 'Focused on AI/ML, data structures, algorithms, and software engineering.',
    sort_order: 0,
  },
];

export const FALLBACK_CV_EXPERIENCE: CVExperience[] = [
  {
    id: 'exp-1',
    company: 'Various Projects',
    role: 'Open Source Contributor',
    start_date: '2023',
    description: 'Contributing to open-source ML/AI projects and building research tools.',
    highlights: ['Developed ML pipeline automation tools', 'Built data visualization dashboards'],
    is_current: true,
    sort_order: 0,
  },
];

export const FALLBACK_CV_CERTIFICATIONS: CVCertification[] = [
  {
    id: 'cert-1',
    name: 'Research Blog Launch',
    issuer: 'Self',
    year: 2024,
    sort_order: 0,
  },
];
