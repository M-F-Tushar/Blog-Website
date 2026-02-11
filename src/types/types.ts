/**
 * App-side types — single source of truth for all application interfaces.
 * Fields use camelCase (except SiteSettings/PageContent which mirror DB shape for convenience).
 */

// ─── Post ───────────────────────────────────────────────────────────

export type Category = string;

export enum PostStatus {
  PUBLISHED = 'Published',
  DRAFT = 'Draft',
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: Category;
  tags: string[];
  excerpt: string;
  status: PostStatus;
  coverImage?: string;
  content: string;
  isInitial?: boolean;
  author?: { name: string; avatar: string };
  readTime?: string;
  commentCount?: number;
}

// ─── Recommendation ─────────────────────────────────────────────────

export enum RecommendationType {
  ARTICLE = 'Article',
  BOOK = 'Book',
  TOOL = 'Tool',
  VIDEO = 'Video',
  COURSE = 'Course',
  WEBSITE = 'website',
  DOCUMENTATION = 'documentation',
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Recommendation {
  id: string;
  title: string;
  url: string;
  description: string;
  type: RecommendationType;
  isInitial?: boolean;
  thumbnail?: string;
  difficulty?: DifficultyLevel;
  estimatedTime?: string;
  authorNote?: string;
  tags?: string[];
  isFeatured?: boolean;
}

// ─── Comment ────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  user?: { full_name: string; avatar_url: string };
}

// ─── Site Settings (mirrors DB shape — used everywhere as-is) ───────

export interface SiteSettings {
  id: string;
  featured_post_id: string | null;
  site_name: string;
  site_description: string;
  author_name: string;
  author_tagline: string;
  author_bio: string;
  social_github: string;
  social_linkedin: string;
  social_email: string;
  categories: string[];
  skills: Skill[];
  timeline: TimelineItem[];
  achievements: Achievement[];
}

export interface Skill {
  name: string;
  level: number;
  iconName?: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  organization: string;
  description: string;
  type: 'work' | 'education';
}

export interface Achievement {
  title: string;
  issuer: string;
  year: string;
}

export interface NavLink {
  path: string;
  label: string;
}

// ─── Project (camelCase) ────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  sortOrder: number;
  isFeatured: boolean;
  status: string;
  isInitial?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Publication (camelCase) ────────────────────────────────────────

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  abstract?: string;
  doiUrl?: string;
  arxivUrl?: string;
  pdfUrl?: string;
  codeUrl?: string;
  slidesUrl?: string;
  bibtex?: string;
  type: string;
  isFeatured?: boolean;
  sortOrder: number;
  isInitial?: boolean;
  createdAt?: string;
}

// ─── Page Content (mirrors DB shape for build-time simplicity) ──────

export interface PageContent {
  id: string;
  page_name: string;
  section_key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>;
  sort_order: number;
  is_visible: boolean;
  updated_at?: string;
}

// ─── CV Types (mirrors DB shape) ────────────────────────────────────

export interface CVEducation {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  start_year: number;
  end_year?: number;
  description?: string;
  courses?: string[];
  sort_order: number;
  created_at?: string;
}

export interface CVExperience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date?: string;
  description?: string;
  highlights?: string[];
  is_current: boolean;
  sort_order: number;
  created_at?: string;
}

export interface CVCertification {
  id: string;
  name: string;
  issuer: string;
  year: number;
  url?: string;
  sort_order: number;
  created_at?: string;
}

// ─── Custom Pages (camelCase) ───────────────────────────────────────

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  layout: string;
  status: 'draft' | 'published' | 'archived';
  sortOrder: number;
  showInNavigation: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomPageSection {
  id: string;
  pageId: string;
  sectionType: string;
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
  sortOrder: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}
