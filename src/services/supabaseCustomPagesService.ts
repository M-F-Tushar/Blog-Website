import { supabase } from '../supabase/client';
import type { Json } from '../types/database';

// ---------- Database types ----------

export interface DatabaseCustomPage {
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
  created_at: string;
  updated_at: string;
}

export interface DatabaseCustomPageSection {
  id: string;
  page_id: string;
  section_type: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  metadata: Json | null;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

// ---------- App types ----------

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

// ---------- Converters ----------

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

// ---------- Page CRUD ----------

const PAGES_TABLE = 'custom_pages';
const SECTIONS_TABLE = 'custom_page_sections';

export const getAllCustomPages = async (): Promise<CustomPage[]> => {
  if (!supabase) throw new Error('Supabase is not initialized');

  const { data, error } = await supabase
    .from(PAGES_TABLE)
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching custom pages:', error);
    throw error;
  }
  return (data || []).map(customPageFromDatabase);
};

export const getCustomPageById = async (id: string): Promise<CustomPage | null> => {
  if (!supabase) throw new Error('Supabase is not initialized');

  const { data, error } = await supabase.from(PAGES_TABLE).select('*').eq('id', id).single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching custom page:', error);
    throw error;
  }
  return data ? customPageFromDatabase(data) : null;
};

export const createCustomPage = async (
  page: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CustomPage> => {
  if (!supabase) throw new Error('Supabase is not initialized');

  const dbPage = customPageToDatabase(page);
  const { data, error } = await supabase
    .from(PAGES_TABLE)
    .insert(dbPage as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating custom page:', error);
    throw error;
  }
  return customPageFromDatabase(data);
};

export const updateCustomPage = async (
  id: string,
  page: Partial<Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  if (!supabase) throw new Error('Supabase is not initialized');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: Record<string, any> = {};
  if (page.title !== undefined) updateData.title = page.title;
  if (page.slug !== undefined) updateData.slug = page.slug;
  if (page.description !== undefined) updateData.description = page.description || null;
  if (page.metaTitle !== undefined) updateData.meta_title = page.metaTitle || null;
  if (page.metaDescription !== undefined)
    updateData.meta_description = page.metaDescription || null;
  if (page.ogImage !== undefined) updateData.og_image = page.ogImage || null;
  if (page.layout !== undefined) updateData.layout = page.layout;
  if (page.status !== undefined) updateData.status = page.status;
  if (page.sortOrder !== undefined) updateData.sort_order = page.sortOrder;
  if (page.showInNavigation !== undefined) updateData.show_in_navigation = page.showInNavigation;

  const { error } = await supabase
    .from(PAGES_TABLE)
    // @ts-expect-error - Supabase type inference issue
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error updating custom page:', error);
    throw error;
  }
};

export const deleteCustomPage = async (id: string): Promise<void> => {
  if (!supabase) throw new Error('Supabase is not initialized');

  const { error } = await supabase.from(PAGES_TABLE).delete().eq('id', id);
  if (error) {
    console.error('Error deleting custom page:', error);
    throw error;
  }
};

// ---------- Section CRUD ----------

export const getCustomPageSections = async (pageId: string): Promise<CustomPageSection[]> => {
  if (!supabase) throw new Error('Supabase is not initialized');

  const { data, error } = await supabase
    .from(SECTIONS_TABLE)
    .select('*')
    .eq('page_id', pageId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching custom page sections:', error);
    throw error;
  }
  return (data || []).map(customPageSectionFromDatabase);
};

export const createCustomPageSection = async (
  section: Omit<CustomPageSection, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CustomPageSection> => {
  if (!supabase) throw new Error('Supabase is not initialized');

  const dbSection = customPageSectionToDatabase(section);
  const { data, error } = await supabase
    .from(SECTIONS_TABLE)
    .insert(dbSection as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating custom page section:', error);
    throw error;
  }
  return customPageSectionFromDatabase(data);
};

export const updateCustomPageSection = async (
  id: string,
  section: Partial<Omit<CustomPageSection, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  if (!supabase) throw new Error('Supabase is not initialized');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: Record<string, any> = {};
  if (section.sectionType !== undefined) updateData.section_type = section.sectionType;
  if (section.title !== undefined) updateData.title = section.title || null;
  if (section.subtitle !== undefined) updateData.subtitle = section.subtitle || null;
  if (section.content !== undefined) updateData.content = section.content || null;
  if (section.imageUrl !== undefined) updateData.image_url = section.imageUrl || null;
  if (section.metadata !== undefined) updateData.metadata = section.metadata || null;
  if (section.sortOrder !== undefined) updateData.sort_order = section.sortOrder;
  if (section.visible !== undefined) updateData.visible = section.visible;

  const { error } = await supabase
    .from(SECTIONS_TABLE)
    // @ts-expect-error - Supabase type inference issue
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error updating custom page section:', error);
    throw error;
  }
};

export const deleteCustomPageSection = async (id: string): Promise<void> => {
  if (!supabase) throw new Error('Supabase is not initialized');

  const { error } = await supabase.from(SECTIONS_TABLE).delete().eq('id', id);
  if (error) {
    console.error('Error deleting custom page section:', error);
    throw error;
  }
};

// ---------- Real-time subscriptions ----------

export const subscribeToCustomPagesUpdates = (
  callback: (pages: CustomPage[]) => void,
  onError?: (error: Error) => void
) => {
  if (!supabase) {
    if (onError) onError(new Error('Supabase is not initialized'));
    return () => {};
  }

  getAllCustomPages()
    .then(callback)
    .catch((error) => {
      if (onError) onError(error);
    });

  const channel = supabase
    .channel('custom-pages-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: PAGES_TABLE }, () => {
      getAllCustomPages()
        .then(callback)
        .catch((error) => {
          console.error('Error in custom pages subscription:', error);
          if (onError) onError(error);
        });
    })
    .subscribe();

  return () => {
    supabase!.removeChannel(channel);
  };
};

export const subscribeToCustomPageSectionsUpdates = (
  pageId: string,
  callback: (sections: CustomPageSection[]) => void,
  onError?: (error: Error) => void
) => {
  if (!supabase) {
    if (onError) onError(new Error('Supabase is not initialized'));
    return () => {};
  }

  getCustomPageSections(pageId)
    .then(callback)
    .catch((error) => {
      if (onError) onError(error);
    });

  const channel = supabase
    .channel(`custom-page-sections-${pageId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: SECTIONS_TABLE }, () => {
      getCustomPageSections(pageId)
        .then(callback)
        .catch((error) => {
          console.error('Error in custom page sections subscription:', error);
          if (onError) onError(error);
        });
    })
    .subscribe();

  return () => {
    supabase!.removeChannel(channel);
  };
};
