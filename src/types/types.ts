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
  author_image?: string | null;
  social_github: string;
  social_linkedin: string;
  social_email: string;
  social_twitter?: string;
  social_instagram?: string;
  social_youtube?: string;
  social_discord?: string;
  categories: string[];
  skills: Skill[];
  timeline: TimelineItem[];
  achievements: Achievement[];
  ui_text?: {
    home: {
      welcomeBadge: string;
      startReading: string;
      moreAboutMe: string;
      featuredStory: string;
      trendingTopics: string;
      latestArticles: string;
      newsletterTitle: string;
      newsletterDescription: string;
      subscribeButton: string;
    };
    footer: {
      tagline: string;
      exploreTitle: string;
      latestTitle: string;
      stayConnectedTitle: string;
      newsletterDescription: string;
      subscribeButton: string;
      copyrightText: string;
    };
    header: {
      home: string;
      about: string;
      blog: string;
      recommendations: string;
      bookmarks: string;
      contact: string;
      searchPlaceholder: string;
    };
  };
  homepage_layout?: {
    showHero: boolean;
    showFeaturedPost: boolean;
    showTrendingTopics: boolean;
    showLatestArticles: boolean;
    showNewsletter: boolean;
    sectionOrder?: string[];
    sectionConfig?: Record<string, Record<string, unknown>>;
  };
  appearance?: {
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
    logoUrl: string;
    faviconUrl: string;
    defaultTheme: 'light' | 'dark' | 'system';
  };
  navigation?: {
    menuItems: Array<{
      id: string;
      label: string;
      path: string;
      isExternal: boolean;
      visible: boolean;
      order: number;
    }>;
  };
  seo?: {
    defaultMetaTitle: string;
    defaultMetaDescription: string;
    ogImage: string;
    twitterHandle: string;
    pageMeta: Record<string, { title: string; description: string; ogImage?: string }>;
  };
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
  slug: string;
  description: string;
  summary?: string;
  longDescription?: string;
  tags?: string[];
  techStack: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  problem?: string;
  motivation?: string;
  approach?: string;
  architecture?: string;
  implementation?: string;
  challenges?: string;
  lessonsLearned?: string;
  futureImprovements?: string;
  sortOrder: number;
  isFeatured: boolean;
  status: 'active' | 'shipped' | 'tinkering';
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
  type: 'journal' | 'conference' | 'preprint' | 'thesis' | 'book_chapter';
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

export type GardenEntryType = 'Active Learning' | 'Knowledge Synthesized' | 'Thinking Notes';

export type BookshelfEntryType =
  | 'reflection'
  | 'review'
  | 'reading-log'
  | 'favorite'
  | 'essay';

export type PageSectionLayoutVariant =
  | 'hero-split'
  | 'hero-narrative'
  | 'feature-left'
  | 'feature-right'
  | 'cards-3'
  | 'cards-2'
  | 'stacked-story'
  | 'quote-band'
  | 'cta-band';

export type PageSectionVisualTone = 'default' | 'editorial' | 'quiet' | 'technical' | 'warm';

export type PageSectionDensity = 'airy' | 'balanced' | 'compact';

export type PageSectionBackgroundTreatment =
  | 'none'
  | 'gradient-soft'
  | 'panel'
  | 'panel-strong'
  | 'paper';

export type PageSectionContentAlignment = 'left' | 'center' | 'split';

export type PageSectionMediaMode = 'none' | 'portrait' | 'cover' | 'icon';

export type PageSectionContentCollection =
  | 'none'
  | 'projects'
  | 'posts'
  | 'bookshelf'
  | 'contact-links';

export type PageSectionContentSource = 'static' | 'featured' | 'latest' | 'pinned' | 'manual';

export type PageSectionKickerStyle = 'default' | 'soft' | 'strong';

export type PageSectionRole = 'entry' | 'proof' | 'guide' | 'archive' | 'reflection' | 'cta';

export type PageSectionAnimationPreset =
  | 'hero-rise'
  | 'stagger-cards'
  | 'chapter-reveal'
  | 'rail-slide'
  | 'quiet-fade'
  | 'scale-reveal'
  | 'cascade';

export type PageSectionContentGrouping = 'none' | 'status' | 'channel' | 'type' | 'theme';

export type PageSectionContentEmphasis = 'lead' | 'supporting' | 'dense';

export interface PageSectionMetadata {
  panelKicker?: string;
  panelTitle?: string;
  panelBody?: string;
  panelItems?: string[];
  quoteAttribution?: string;
  imageUrl?: string;
  badge?: string;
  [key: string]: unknown;
}

export interface PageSectionRecord {
  id: string;
  pageKey: string;
  sectionKey: string;
  sectionType: string;
  presetKey?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  layoutVariant?: PageSectionLayoutVariant;
  visualTone?: PageSectionVisualTone;
  density?: PageSectionDensity;
  backgroundTreatment?: PageSectionBackgroundTreatment;
  contentAlignment?: PageSectionContentAlignment;
  mediaMode?: PageSectionMediaMode;
  contentCollection?: PageSectionContentCollection;
  contentSource?: PageSectionContentSource;
  kickerStyle?: PageSectionKickerStyle;
  sectionRole?: PageSectionRole;
  animationPreset?: PageSectionAnimationPreset;
  contentGrouping?: PageSectionContentGrouping;
  contentEmphasis?: PageSectionContentEmphasis;
  maxItems?: number;
  showDivider?: boolean;
  featuredProjectId?: string;
  featuredPostId?: string;
  featuredBookshelfEntryId?: string;
  manualItemIds?: string[];
  metadata?: PageSectionMetadata;
  visible: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoryChapter {
  id: string;
  title: string;
  subtitle?: string;
  body: string;
  periodLabel?: string;
  featuredMedia?: string;
  visible: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoryMilestone {
  id: string;
  chapterId?: string;
  title: string;
  description?: string;
  periodLabel?: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookshelfEntry {
  id: string;
  title: string;
  slug: string;
  entryType: BookshelfEntryType;
  bookTitle: string;
  author?: string;
  coverImage?: string;
  summary?: string;
  body: string;
  tags: string[];
  rating?: number;
  status: 'draft' | 'published';
  isFeatured: boolean;
  isPinned: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  isExternal: boolean;
  visible: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactLink {
  id: string;
  label: string;
  url: string;
  linkType: string;
  description?: string;
  visible: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}
