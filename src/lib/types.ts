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
}

export enum RecommendationType {
  ARTICLE = 'Article',
  BOOK = 'Book',
  TOOL = 'Tool',
  VIDEO = 'Video',
  COURSE = 'Course',
}

export interface Recommendation {
  id: string;
  title: string;
  url: string;
  description: string;
  type: RecommendationType;
  isInitial?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  user?: {
    full_name: string;
    avatar_url: string;
  };
}

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

export interface Project {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  github_url?: string;
  demo_url?: string;
  image_url?: string;
  tags: string[];
  status: 'active' | 'archived' | 'experimental';
  featured: boolean;
  sort_order: number;
  isInitial?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue?: string;
  year: number;
  type: 'conference' | 'journal' | 'preprint' | 'thesis' | 'workshop';
  abstract?: string;
  doi?: string;
  arxiv_url?: string;
  pdf_url?: string;
  code_url?: string;
  slides_url?: string;
  bibtex?: string;
  featured?: boolean;
  sort_order: number;
  isInitial?: boolean;
  created_at?: string;
}

export interface PageContent {
  id: string;
  page_name: string;
  section_key: string;
  content: Record<string, any>;
  sort_order: number;
  is_visible: boolean;
  updated_at?: string;
}

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
