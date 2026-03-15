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
  DatabaseNavigationItem,
  DatabasePageSection,
  DatabaseStoryChapter,
  DatabaseStoryMilestone,
  DatabaseBookshelfEntry,
  DatabaseContactLink,
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
  PageSectionRecord,
  StoryChapter,
  StoryMilestone,
  BookshelfEntry,
  NavigationItem,
  ContactLink,
  PostStatus,
  RecommendationType,
  DifficultyLevel,
  PageSectionMetadata,
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

const toJsonValue = (value: unknown): Json => {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => toJsonValue(item));
  }

  if (typeof value === 'object') {
    const jsonObject: { [key: string]: Json | undefined } = {};

    for (const [key, entry] of Object.entries(value)) {
      if (entry !== undefined) {
        jsonObject[key] = toJsonValue(entry);
      }
    }

    return jsonObject;
  }

  return String(value);
};

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
  slug: db.slug || slugify(db.title),
  description: db.description,
  summary: db.description,
  longDescription: db.long_description || undefined,
  tags: db.tags || [],
  techStack: db.tech_stack || [],
  imageUrl: db.image_url || undefined,
  liveUrl: db.live_url || undefined,
  githubUrl: db.github_url || undefined,
  problem: db.problem || undefined,
  motivation: db.motivation || undefined,
  approach: db.approach || undefined,
  architecture: db.architecture || undefined,
  implementation: db.implementation || undefined,
  challenges: db.challenges || undefined,
  lessonsLearned: db.lessons_learned || undefined,
  futureImprovements: db.future_improvements || undefined,
  sortOrder: db.sort_order,
  isFeatured: db.is_featured,
  status: (db.status as Project['status']) || 'active',
  isInitial: db.is_initial,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
});

export const projectToDatabase = (
  project: Omit<Project, 'id'>
): Omit<DatabaseProject, 'id' | 'created_at' | 'updated_at'> => ({
  title: project.title,
  slug: project.slug || slugify(project.title),
  description: project.description,
  long_description: project.longDescription || null,
  tags: project.tags || [],
  tech_stack: project.techStack,
  image_url: project.imageUrl || null,
  live_url: project.liveUrl || null,
  github_url: project.githubUrl || null,
  problem: project.problem || null,
  motivation: project.motivation || null,
  approach: project.approach || null,
  architecture: project.architecture || null,
  implementation: project.implementation || null,
  challenges: project.challenges || null,
  lessons_learned: project.lessonsLearned || null,
  future_improvements: project.futureImprovements || null,
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
  type: db.type as Publication['type'],
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
  metadata: section.metadata ? toJsonValue(section.metadata) : null,
  sort_order: section.sortOrder,
  visible: section.visible,
});

export const navigationItemFromDatabase = (db: DatabaseNavigationItem): NavigationItem => ({
  id: db.id,
  label: db.label,
  path: db.path,
  isExternal: db.is_external,
  visible: db.visible,
  sortOrder: db.sort_order,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
});

export const navigationItemToDatabase = (
  item: Omit<NavigationItem, 'id' | 'createdAt' | 'updatedAt'>
): Omit<DatabaseNavigationItem, 'id' | 'created_at' | 'updated_at'> => ({
  label: item.label,
  path: item.path,
  is_external: item.isExternal,
  visible: item.visible,
  sort_order: item.sortOrder,
});

export const pageSectionRecordFromDatabase = (db: DatabasePageSection): PageSectionRecord => ({
  id: db.id,
  pageKey: db.page_key,
  sectionKey: db.section_key,
  sectionType: db.section_type,
  presetKey: db.preset_key || undefined,
  eyebrow: db.eyebrow || undefined,
  title: db.title || undefined,
  subtitle: db.subtitle || undefined,
  body: db.body || undefined,
  primaryCtaLabel: db.primary_cta_label || undefined,
  primaryCtaUrl: db.primary_cta_url || undefined,
  secondaryCtaLabel: db.secondary_cta_label || undefined,
  secondaryCtaUrl: db.secondary_cta_url || undefined,
  layoutVariant: (db.layout_variant as PageSectionRecord['layoutVariant']) || undefined,
  visualTone: (db.visual_tone as PageSectionRecord['visualTone']) || undefined,
  density: (db.density as PageSectionRecord['density']) || undefined,
  backgroundTreatment:
    (db.background_treatment as PageSectionRecord['backgroundTreatment']) || undefined,
  contentAlignment:
    (db.content_alignment as PageSectionRecord['contentAlignment']) || undefined,
  mediaMode: (db.media_mode as PageSectionRecord['mediaMode']) || undefined,
  contentCollection:
    (db.content_collection as PageSectionRecord['contentCollection']) || undefined,
  contentSource: (db.content_source as PageSectionRecord['contentSource']) || undefined,
  kickerStyle: (db.kicker_style as PageSectionRecord['kickerStyle']) || undefined,
  sectionRole: (db.section_role as PageSectionRecord['sectionRole']) || undefined,
  animationPreset: (db.animation_preset as PageSectionRecord['animationPreset']) || undefined,
  contentGrouping:
    (db.content_grouping as PageSectionRecord['contentGrouping']) || undefined,
  contentEmphasis:
    (db.content_emphasis as PageSectionRecord['contentEmphasis']) || undefined,
  maxItems: db.max_items ?? undefined,
  showDivider: db.show_divider ?? undefined,
  featuredProjectId: db.featured_project_id || undefined,
  featuredPostId: db.featured_post_id || undefined,
  featuredBookshelfEntryId: db.featured_bookshelf_entry_id || undefined,
  manualItemIds: db.manual_item_ids || undefined,
  metadata: (db.metadata as PageSectionRecord['metadata']) || undefined,
  visible: db.visible,
  sortOrder: db.sort_order,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
});

export const pageSectionRecordToDatabase = (
  section: Omit<PageSectionRecord, 'id' | 'createdAt' | 'updatedAt'>
): Omit<DatabasePageSection, 'id' | 'created_at' | 'updated_at'> => ({
  page_key: section.pageKey,
  section_key: section.sectionKey,
  section_type: section.sectionType,
  preset_key: section.presetKey || null,
  eyebrow: section.eyebrow || null,
  title: section.title || null,
  subtitle: section.subtitle || null,
  body: section.body || null,
  primary_cta_label: section.primaryCtaLabel || null,
  primary_cta_url: section.primaryCtaUrl || null,
  secondary_cta_label: section.secondaryCtaLabel || null,
  secondary_cta_url: section.secondaryCtaUrl || null,
  layout_variant: section.layoutVariant || null,
  visual_tone: section.visualTone || null,
  density: section.density || null,
  background_treatment: section.backgroundTreatment || null,
  content_alignment: section.contentAlignment || null,
  media_mode: section.mediaMode || null,
  content_collection: section.contentCollection || null,
  content_source: section.contentSource || null,
  kicker_style: section.kickerStyle || null,
  section_role: section.sectionRole || null,
  animation_preset: section.animationPreset || null,
  content_grouping: section.contentGrouping || null,
  content_emphasis: section.contentEmphasis || null,
  max_items: section.maxItems ?? null,
  show_divider: section.showDivider ?? false,
  featured_project_id: section.featuredProjectId || null,
  featured_post_id: section.featuredPostId || null,
  featured_bookshelf_entry_id: section.featuredBookshelfEntryId || null,
  manual_item_ids: section.manualItemIds || [],
  metadata: section.metadata ? toJsonValue(section.metadata as PageSectionMetadata) : null,
  visible: section.visible,
  sort_order: section.sortOrder,
});

export const storyChapterFromDatabase = (db: DatabaseStoryChapter): StoryChapter => ({
  id: db.id,
  title: db.title,
  subtitle: db.subtitle || undefined,
  body: db.body,
  periodLabel: db.period_label || undefined,
  featuredMedia: db.featured_media || undefined,
  visible: db.visible,
  sortOrder: db.sort_order,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
});

export const storyChapterToDatabase = (
  chapter: Omit<StoryChapter, 'id' | 'createdAt' | 'updatedAt'>
): Omit<DatabaseStoryChapter, 'id' | 'created_at' | 'updated_at'> => ({
  title: chapter.title,
  subtitle: chapter.subtitle || null,
  body: chapter.body,
  period_label: chapter.periodLabel || null,
  featured_media: chapter.featuredMedia || null,
  visible: chapter.visible,
  sort_order: chapter.sortOrder,
});

export const storyMilestoneFromDatabase = (db: DatabaseStoryMilestone): StoryMilestone => ({
  id: db.id,
  chapterId: db.chapter_id || undefined,
  title: db.title,
  description: db.description || undefined,
  periodLabel: db.period_label || undefined,
  sortOrder: db.sort_order,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
});

export const storyMilestoneToDatabase = (
  milestone: Omit<StoryMilestone, 'id' | 'createdAt' | 'updatedAt'>
): Omit<DatabaseStoryMilestone, 'id' | 'created_at' | 'updated_at'> => ({
  chapter_id: milestone.chapterId || null,
  title: milestone.title,
  description: milestone.description || null,
  period_label: milestone.periodLabel || null,
  sort_order: milestone.sortOrder,
});

export const bookshelfEntryFromDatabase = (db: DatabaseBookshelfEntry): BookshelfEntry => ({
  id: db.id,
  title: db.title,
  slug: db.slug,
  entryType: db.entry_type as BookshelfEntry['entryType'],
  bookTitle: db.book_title,
  author: db.author || undefined,
  coverImage: db.cover_image || undefined,
  summary: db.summary || undefined,
  body: db.body,
  tags: db.tags || [],
  rating: db.rating || undefined,
  status: db.status as BookshelfEntry['status'],
  isFeatured: db.is_featured,
  isPinned: db.is_pinned,
  sortOrder: db.sort_order,
  seoTitle: db.seo_title || undefined,
  seoDescription: db.seo_description || undefined,
  publishedAt: db.published_at || undefined,
  updatedAt: db.updated_at,
  createdAt: db.created_at,
});

export const bookshelfEntryToDatabase = (
  entry: Omit<BookshelfEntry, 'id' | 'createdAt' | 'updatedAt'>
): Omit<DatabaseBookshelfEntry, 'id' | 'created_at' | 'updated_at'> => ({
  title: entry.title,
  slug: entry.slug || slugify(entry.title),
  entry_type: entry.entryType,
  book_title: entry.bookTitle,
  author: entry.author || null,
  cover_image: entry.coverImage || null,
  summary: entry.summary || null,
  body: entry.body,
  tags: entry.tags || [],
  rating: entry.rating || null,
  status: entry.status,
  is_featured: entry.isFeatured,
  is_pinned: entry.isPinned,
  sort_order: entry.sortOrder,
  seo_title: entry.seoTitle || null,
  seo_description: entry.seoDescription || null,
  published_at: entry.publishedAt || null,
});

export const contactLinkFromDatabase = (db: DatabaseContactLink): ContactLink => ({
  id: db.id,
  label: db.label,
  url: db.url,
  linkType: db.link_type,
  description: db.description || undefined,
  visible: db.visible,
  sortOrder: db.sort_order,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
});

export const contactLinkToDatabase = (
  link: Omit<ContactLink, 'id' | 'createdAt' | 'updatedAt'>
): Omit<DatabaseContactLink, 'id' | 'created_at' | 'updated_at'> => ({
  label: link.label,
  url: link.url,
  link_type: link.linkType,
  description: link.description || null,
  visible: link.visible,
  sort_order: link.sortOrder,
});
