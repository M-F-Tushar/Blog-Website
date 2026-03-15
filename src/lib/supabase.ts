/**
 * Re-export shim — maintains backward compatibility for Astro page imports.
 * All canonical code lives in src/supabase/queries.ts and src/types/.
 */

export { isSupabaseConfigured } from '../supabase/client';
export { slugify } from '../types/converters';

// Build-time queries
export {
  getAllPosts,
  getPublishedPosts,
  getPostBySlug,
  getSiteSettings,
  isPageVisible,
  getRecommendations,
  getProjects,
  getProjectBySlug,
  getFeaturedProjects,
  getPublications,
  getPageContent,
  getPageSection,
  getPageSections,
  getPageSectionRecord,
  getCVEducation,
  getCVExperience,
  getCVCertifications,
  getCustomPages,
  getCustomPageBySlug,
  getCustomPageSections,
  getNavigationCustomPages,
  getNavigationItems,
  getStoryChapters,
  getStoryMilestones,
  getBookshelfEntries,
  getBookshelfEntryBySlug,
  getContactLinks,
} from '../supabase/queries';

// Build-time types used by Astro components
export type { CustomPageData, CustomPageSectionData } from '../supabase/queries';
