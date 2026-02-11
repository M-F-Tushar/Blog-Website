/**
 * Type converters — single source of truth for mapping between
 * database (snake_case) and app-side (camelCase) representations.
 */

import type {
  DatabasePost,
  DatabaseRecommendation,
  DatabaseProject,
  DatabasePublication,
  DatabasePageContent,
  DatabaseCustomPage,
  DatabaseCustomPageSection,
  Json,
} from './database';
import type {
  Post,
  Recommendation,
  Project,
  Publication,
  PageContent,
  CustomPage,
  CustomPageSection,
  PostStatus,
  RecommendationType,
  DifficultyLevel,
} from './types';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop';

// ─── Utility ────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ─── Post ───────────────────────────────────────────────────────────

export const postFromDatabase = (dbPost: DatabasePost): Post => ({
  id: dbPost.id,
  title: dbPost.title,
  slug: slugify(dbPost.title),
  date: dbPost.date,
  category: dbPost.category,
  tags: dbPost.tags,
  excerpt: dbPost.excerpt,
  status: dbPost.status as PostStatus,
  coverImage: dbPost.cover_image || undefined,
  content: dbPost.content,
  isInitial: dbPost.is_initial,
  author: { name: 'Author', avatar: DEFAULT_AVATAR },
  readTime: `${Math.ceil(dbPost.content.split(' ').length / 200)} min read`,
  commentCount: 0,
});

export const postToDatabase = (
  post: Omit<Post, 'id'>
): Omit<DatabasePost, 'id' | 'created_at' | 'updated_at'> => ({
  title: post.title,
  date: post.date,
  category: post.category,
  tags: post.tags,
  excerpt: post.excerpt,
  status: post.status,
  cover_image: post.coverImage || null,
  content: post.content,
  is_initial: post.isInitial || false,
});

// ─── Recommendation ─────────────────────────────────────────────────

export const recommendationFromDatabase = (dbRec: DatabaseRecommendation): Recommendation => ({
  id: dbRec.id,
  title: dbRec.title,
  url: dbRec.url,
  description: dbRec.description,
  type: dbRec.type as RecommendationType,
  thumbnail: dbRec.thumbnail || undefined,
  difficulty: (dbRec.difficulty as DifficultyLevel) || undefined,
  estimatedTime: dbRec.estimated_time || undefined,
  authorNote: dbRec.author_note || undefined,
  tags: dbRec.tags || undefined,
  isFeatured: dbRec.is_featured,
  isInitial: dbRec.is_initial,
});

export const recommendationToDatabase = (
  rec: Omit<Recommendation, 'id'>
): Omit<DatabaseRecommendation, 'id' | 'created_at' | 'updated_at'> => ({
  title: rec.title,
  url: rec.url,
  description: rec.description,
  type: rec.type,
  thumbnail: rec.thumbnail || null,
  difficulty: rec.difficulty || null,
  estimated_time: rec.estimatedTime || null,
  author_note: rec.authorNote || null,
  tags: rec.tags || null,
  is_featured: rec.isFeatured || false,
  is_initial: rec.isInitial || false,
});

// ─── Project ────────────────────────────────────────────────────────

export const projectFromDatabase = (db: DatabaseProject): Project => ({
  id: db.id,
  title: db.title,
  description: db.description,
  longDescription: db.long_description || undefined,
  techStack: db.tech_stack || [],
  imageUrl: db.image_url || undefined,
  liveUrl: db.live_url || undefined,
  githubUrl: db.github_url || undefined,
  sortOrder: db.sort_order,
  isFeatured: db.is_featured,
  status: db.status,
  isInitial: db.is_initial,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
});

export const projectToDatabase = (
  project: Omit<Project, 'id'>
): Omit<DatabaseProject, 'id' | 'created_at' | 'updated_at'> => ({
  title: project.title,
  description: project.description,
  long_description: project.longDescription || null,
  tech_stack: project.techStack,
  image_url: project.imageUrl || null,
  live_url: project.liveUrl || null,
  github_url: project.githubUrl || null,
  sort_order: project.sortOrder,
  is_featured: project.isFeatured,
  status: project.status,
  is_initial: project.isInitial || false,
});

// ─── Publication ────────────────────────────────────────────────────

export const publicationFromDatabase = (db: DatabasePublication): Publication => ({
  id: db.id,
  title: db.title,
  authors: db.authors,
  venue: db.venue,
  year: db.year,
  abstract: db.abstract || undefined,
  doiUrl: db.doi_url || undefined,
  arxivUrl: db.arxiv_url || undefined,
  pdfUrl: db.pdf_url || undefined,
  codeUrl: db.code_url || undefined,
  slidesUrl: db.slides_url || undefined,
  bibtex: db.bibtex || undefined,
  type: db.type,
  isFeatured: db.is_featured,
  sortOrder: db.sort_order,
  isInitial: db.is_initial,
  createdAt: db.created_at,
});

export const publicationToDatabase = (
  pub: Omit<Publication, 'id'>
): Omit<DatabasePublication, 'id' | 'created_at' | 'updated_at'> => ({
  title: pub.title,
  authors: pub.authors,
  venue: pub.venue,
  year: pub.year,
  abstract: pub.abstract || null,
  doi_url: pub.doiUrl || null,
  arxiv_url: pub.arxivUrl || null,
  pdf_url: pub.pdfUrl || null,
  code_url: pub.codeUrl || null,
  slides_url: pub.slidesUrl || null,
  bibtex: pub.bibtex || null,
  type: pub.type,
  is_featured: pub.isFeatured || false,
  sort_order: pub.sortOrder,
  is_initial: pub.isInitial || false,
});

// ─── Page Content ───────────────────────────────────────────────────
// Build-time: DB → PageContent (retains snake_case for Astro pages)

export const pageContentFromDatabase = (db: DatabasePageContent): PageContent => ({
  id: db.id,
  page_name: db.page_name,
  section_key: db.section_key,
  content: (db.content
    ? typeof db.content === 'string'
      ? JSON.parse(db.content)
      : db.content
    : {}) as Record<string, unknown>,
  sort_order: db.sort_order,
  is_visible: true,
  updated_at: db.updated_at,
});

// Admin: DB → PageSection (used by usePageContent hook)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pageSectionFromDatabase = (db: any) => ({
  id: db.id,
  page: db.page_name || db.page,
  section_key: db.section_key,
  title: db.title || undefined,
  subtitle: db.subtitle || undefined,
  content: db.content || undefined,
  image_url: db.image_url || undefined,
  metadata: db.metadata || undefined,
  sort_order: db.sort_order ?? 0,
  visible: db.visible !== undefined ? db.visible : true,
  created_at: db.created_at,
  updated_at: db.updated_at,
});

// Admin: PageSection → DB format for upsert
export const pageSectionToDatabase = (section: {
  page: string;
  section_key: string;
  title?: string;
  content?: unknown;
  metadata?: unknown;
  sort_order: number;
}) => ({
  page_name: section.page,
  section_key: section.section_key,
  title: section.title || null,
  content: section.content || null,
  metadata: section.metadata || null,
  sort_order: section.sort_order,
  is_initial: false,
});

// ─── Custom Page ────────────────────────────────────────────────────

export const customPageFromDatabase = (db: DatabaseCustomPage): CustomPage => ({
  id: db.id,
  title: db.title,
  slug: db.slug,
  description: db.description || undefined,
  metaTitle: db.meta_title || undefined,
  metaDescription: db.meta_description || undefined,
  ogImage: db.og_image || undefined,
  layout: db.layout,
  status: db.status as CustomPage['status'],
  sortOrder: db.sort_order,
  showInNavigation: db.show_in_navigation,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
});

export const customPageToDatabase = (
  page: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>
): Omit<DatabaseCustomPage, 'id' | 'created_at' | 'updated_at'> => ({
  title: page.title,
  slug: page.slug,
  description: page.description || null,
  meta_title: page.metaTitle || null,
  meta_description: page.metaDescription || null,
  og_image: page.ogImage || null,
  layout: page.layout,
  status: page.status,
  sort_order: page.sortOrder,
  show_in_navigation: page.showInNavigation,
});

export const customPageSectionFromDatabase = (
  db: DatabaseCustomPageSection
): CustomPageSection => ({
  id: db.id,
  pageId: db.page_id,
  sectionType: db.section_type,
  title: db.title || undefined,
  subtitle: db.subtitle || undefined,
  content: db.content || undefined,
  imageUrl: db.image_url || undefined,
  metadata: (db.metadata as Record<string, unknown>) || undefined,
  sortOrder: db.sort_order,
  visible: db.visible,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
});

export const customPageSectionToDatabase = (
  section: Omit<CustomPageSection, 'id' | 'createdAt' | 'updatedAt'>
): Omit<DatabaseCustomPageSection, 'id' | 'created_at' | 'updated_at'> => ({
  page_id: section.pageId,
  section_type: section.sectionType,
  title: section.title || null,
  subtitle: section.subtitle || null,
  content: section.content || null,
  image_url: section.imageUrl || null,
  metadata: (section.metadata as Json) || null,
  sort_order: section.sortOrder,
  visible: section.visible,
});
