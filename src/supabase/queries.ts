/**
 * Build-time data fetching — read-only queries used by Astro pages at SSG time.
 * Also used at runtime via re-exports when needed.
 */

import { supabase, isSupabaseConfigured } from './client';
import {
  slugify,
  postFromDatabase,
  projectFromDatabase,
  publicationFromDatabase,
  pageContentFromDatabase,
  pageSectionRecordFromDatabase,
  storyChapterFromDatabase,
  storyMilestoneFromDatabase,
  bookshelfEntryFromDatabase,
  navigationItemFromDatabase,
  contactLinkFromDatabase,
} from '../types/converters';
import type {
  Post,
  Recommendation,
  Project,
  Publication,
  PageContent,
  CVEducation,
  CVExperience,
  CVCertification,
  PageSectionRecord,
  StoryChapter,
  StoryMilestone,
  BookshelfEntry,
  NavigationItem,
  ContactLink,
} from '../types/types';
import type { PostStatus, RecommendationType, SiteSettings } from '../types/types';
import type { DatabaseRecommendation } from '../types/database';
import {
  FALLBACK_POSTS,
  FALLBACK_RECOMMENDATIONS,
  FALLBACK_SETTINGS,
  FALLBACK_PROJECTS,
  FALLBACK_PUBLICATIONS,
  FALLBACK_PAGE_CONTENT,
  FALLBACK_CV_EDUCATION,
  FALLBACK_CV_EXPERIENCE,
  FALLBACK_CV_CERTIFICATIONS,
  FALLBACK_PAGE_SECTIONS,
  FALLBACK_STORY_CHAPTERS,
  FALLBACK_STORY_MILESTONES,
  FALLBACK_BOOKSHELF,
  FALLBACK_NAVIGATION_ITEMS,
  FALLBACK_CONTACT_LINKS,
} from '../data/fallback';

export { slugify };

// ─── Posts ───────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured() || !supabase) return FALLBACK_POSTS;
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('date', { ascending: false });
  if (error || !data) {
    console.error('Error fetching posts:', error);
    return FALLBACK_POSTS;
  }
  return data.map(postFromDatabase);
}

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.status === 'Published');
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug || p.id === slug);
}

// ─── Site Settings ──────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured() || !supabase) return FALLBACK_SETTINGS;
  const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
  if (error || !data) {
    console.error('Error fetching site settings:', error);
    return FALLBACK_SETTINGS;
  }
  return data as unknown as SiteSettings;
}

/**
 * Check if a page is visible based on navigation settings.
 */
export function isPageVisible(settings: SiteSettings, pagePath: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav = (settings as any).navigation;
  if (!nav?.menuItems || !Array.isArray(nav.menuItems)) return true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const item = nav.menuItems.find((i: any) => i.path === pagePath);
  return !item || item.visible !== false;
}

// ─── Recommendations ────────────────────────────────────────────────

export async function getRecommendations(): Promise<Recommendation[]> {
  if (!isSupabaseConfigured() || !supabase) return FALLBACK_RECOMMENDATIONS;
  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) {
    console.error('Error fetching recommendations:', error);
    return FALLBACK_RECOMMENDATIONS;
  }
  const recommendations = data as DatabaseRecommendation[];
  return recommendations.map((r) => ({
    id: r.id,
    title: r.title,
    url: r.url,
    description: r.description,
    type: r.type as RecommendationType,
    thumbnail: r.thumbnail || undefined,
    difficulty: r.difficulty as any,
    estimatedTime: r.estimated_time || undefined,
    authorNote: r.author_note || undefined,
    tags: r.tags || undefined,
    isFeatured: r.is_featured,
    isInitial: r.is_initial,
  }));
}

// ─── Projects ───────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured() || !supabase) return FALLBACK_PROJECTS;
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error || !data) {
    console.error('Error fetching projects:', error);
    return FALLBACK_PROJECTS;
  }
  return data.map(projectFromDatabase);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.isFeatured);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

// ─── Publications ───────────────────────────────────────────────────

export async function getPublications(): Promise<Publication[]> {
  if (!isSupabaseConfigured() || !supabase) return FALLBACK_PUBLICATIONS;
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .order('year', { ascending: false })
    .order('sort_order', { ascending: true });
  if (error || !data) {
    console.error('Error fetching publications:', error);
    return FALLBACK_PUBLICATIONS;
  }
  return data.map(publicationFromDatabase);
}

// ─── Page Content ───────────────────────────────────────────────────

export async function getPageContent(pageName: string): Promise<PageContent[]> {
  const fallback = FALLBACK_PAGE_CONTENT.filter((c) => c.page_name === pageName).map(
    pageContentFromDatabase
  );
  if (!isSupabaseConfigured() || !supabase) return fallback;
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('page_name', pageName)
    .order('sort_order', { ascending: true });
  if (error || !data) {
    console.error('Error fetching page content:', error);
    return fallback;
  }
  return data.map(pageContentFromDatabase);
}

export async function getPageSection(
  pageName: string,
  sectionKey: string
): Promise<PageContent | undefined> {
  const sections = await getPageContent(pageName);
  return sections.find((s) => s.section_key === sectionKey);
}

// ─── CV Data ────────────────────────────────────────────────────────

export async function getCVEducation(): Promise<CVEducation[]> {
  if (!isSupabaseConfigured() || !supabase) return FALLBACK_CV_EDUCATION;
  const { data, error } = await supabase
    .from('cv_education')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error || !data) return FALLBACK_CV_EDUCATION;
  return data as CVEducation[];
}

export async function getCVExperience(): Promise<CVExperience[]> {
  if (!isSupabaseConfigured() || !supabase) return FALLBACK_CV_EXPERIENCE;
  const { data, error } = await supabase
    .from('cv_experience')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error || !data) return FALLBACK_CV_EXPERIENCE;
  return data as CVExperience[];
}

export async function getCVCertifications(): Promise<CVCertification[]> {
  if (!isSupabaseConfigured() || !supabase) return FALLBACK_CV_CERTIFICATIONS;
  const { data, error } = await supabase
    .from('cv_certifications')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error || !data) return FALLBACK_CV_CERTIFICATIONS;
  return data as CVCertification[];
}

// ─── Custom Pages ───────────────────────────────────────────────────

export interface CustomPageData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  layout: string;
  status: string;
  sort_order: number;
  show_in_navigation: boolean;
}

export interface CustomPageSectionData {
  id: string;
  page_id: string;
  section_type: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any> | null;
  sort_order: number;
  visible: boolean;
}

export async function getCustomPages(): Promise<CustomPageData[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  const { data, error } = await supabase
    .from('custom_pages')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true });
  if (error || !data) return [];
  return data as CustomPageData[];
}

export async function getCustomPageBySlug(slug: string): Promise<CustomPageData | undefined> {
  if (!isSupabaseConfigured() || !supabase) return undefined;
  const { data, error } = await supabase
    .from('custom_pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error || !data) return undefined;
  return data as CustomPageData;
}

export async function getCustomPageSections(pageId: string): Promise<CustomPageSectionData[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  const { data, error } = await supabase
    .from('custom_page_sections')
    .select('*')
    .eq('page_id', pageId)
    .eq('visible', true)
    .order('sort_order', { ascending: true });
  if (error || !data) return [];
  return data as CustomPageSectionData[];
}

export async function getNavigationCustomPages(): Promise<CustomPageData[]> {
  if (!isSupabaseConfigured() || !supabase) return [];
  const { data, error } = await supabase
    .from('custom_pages')
    .select('*')
    .eq('status', 'published')
    .eq('show_in_navigation', true)
    .order('sort_order', { ascending: true });
  if (error || !data) return [];
  return data as CustomPageData[];
}

export async function getNavigationItems(): Promise<NavigationItem[]> {
  if (!isSupabaseConfigured() || !supabase) return FALLBACK_NAVIGATION_ITEMS;
  const { data, error } = await supabase
    .from('navigation_items')
    .select('*')
    .eq('visible', true)
    .order('sort_order', { ascending: true });
  if (error || !data) return FALLBACK_NAVIGATION_ITEMS;
  return data.map(navigationItemFromDatabase);
}

export async function getPageSections(pageKey: string): Promise<PageSectionRecord[]> {
  const fallback = FALLBACK_PAGE_SECTIONS.filter((section) => section.pageKey === pageKey).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
  if (!isSupabaseConfigured() || !supabase) return fallback;
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_key', pageKey)
    .eq('visible', true)
    .order('sort_order', { ascending: true });
  if (error || !data) return fallback;
  return data.map(pageSectionRecordFromDatabase);
}

export async function getPageSectionRecord(
  pageKey: string,
  sectionKey: string
): Promise<PageSectionRecord | undefined> {
  const sections = await getPageSections(pageKey);
  return sections.find((section) => section.sectionKey === sectionKey);
}

export async function getStoryChapters(): Promise<StoryChapter[]> {
  if (!isSupabaseConfigured() || !supabase) return FALLBACK_STORY_CHAPTERS;
  const { data, error } = await supabase
    .from('story_chapters')
    .select('*')
    .eq('visible', true)
    .order('sort_order', { ascending: true });
  if (error || !data) return FALLBACK_STORY_CHAPTERS;
  return data.map(storyChapterFromDatabase);
}

export async function getStoryMilestones(): Promise<StoryMilestone[]> {
  if (!isSupabaseConfigured() || !supabase) return FALLBACK_STORY_MILESTONES;
  const { data, error } = await supabase
    .from('story_milestones')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error || !data) return FALLBACK_STORY_MILESTONES;
  return data.map(storyMilestoneFromDatabase);
}

export async function getBookshelfEntries(): Promise<BookshelfEntry[]> {
  if (!isSupabaseConfigured() || !supabase) return FALLBACK_BOOKSHELF;
  const { data, error } = await supabase
    .from('bookshelf_entries')
    .select('*')
    .eq('status', 'published')
    .order('is_pinned', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false });
  if (error || !data) return FALLBACK_BOOKSHELF;
  return data.map(bookshelfEntryFromDatabase);
}

export async function getBookshelfEntryBySlug(slug: string): Promise<BookshelfEntry | undefined> {
  const entries = await getBookshelfEntries();
  return entries.find((entry) => entry.slug === slug);
}

export async function getContactLinks(): Promise<ContactLink[]> {
  if (!isSupabaseConfigured() || !supabase) return FALLBACK_CONTACT_LINKS;
  const { data, error } = await supabase
    .from('contact_links')
    .select('*')
    .eq('visible', true)
    .order('sort_order', { ascending: true });
  if (error || !data) return FALLBACK_CONTACT_LINKS;
  return data.map(contactLinkFromDatabase);
}
