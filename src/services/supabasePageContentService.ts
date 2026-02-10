import { supabase } from './supabase';
import type { DatabasePageContent } from './supabase';

const PAGE_CONTENT_TABLE = 'page_content';

/**
 * Get all page content from Supabase, optionally filtered by page name
 */
export const getAllPageContent = async (pageName?: string): Promise<DatabasePageContent[]> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    let query = supabase
      .from(PAGE_CONTENT_TABLE)
      .select('*')
      .order('sort_order', { ascending: true });

    if (pageName) {
      query = query.eq('page_name', pageName);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching page content:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching page content:', error);
    throw error;
  }
};

/**
 * Get a single page content section by page name and section key
 */
export const getPageSection = async (
  pageName: string,
  sectionKey: string
): Promise<DatabasePageContent | null> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { data, error } = await supabase
      .from(PAGE_CONTENT_TABLE)
      .select('*')
      .eq('page_name', pageName)
      .eq('section_key', sectionKey)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      console.error('Error fetching page section:', error);
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching page section:', error);
    throw error;
  }
};

/**
 * Upsert a page content section (insert or update based on page_name + section_key)
 */
export const upsertPageSection = async (
  section: Omit<DatabasePageContent, 'id' | 'created_at' | 'updated_at'>
): Promise<DatabasePageContent> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { data, error } = await supabase
      .from(PAGE_CONTENT_TABLE)
      .upsert(section as any, { onConflict: 'page_name,section_key' })
      .select()
      .single();

    if (error) {
      console.error('Error upserting page section:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error upserting page section:', error);
    throw error;
  }
};

/**
 * Create a new page content section
 */
export const createPageSection = async (
  section: Omit<DatabasePageContent, 'id' | 'created_at' | 'updated_at'>
): Promise<DatabasePageContent> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { data, error } = await supabase
      .from(PAGE_CONTENT_TABLE)
      .insert(section as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating page section:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating page section:', error);
    throw error;
  }
};

/**
 * Update an existing page content section
 */
export const updatePageSection = async (
  id: string,
  section: Partial<Omit<DatabasePageContent, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const updateData: any = { ...section, updated_at: new Date().toISOString() };

    const { error } = await supabase
      .from(PAGE_CONTENT_TABLE)
      // @ts-expect-error - Supabase type inference issue with database types
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating page section:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating page section:', error);
    throw error;
  }
};

/**
 * Delete a page content section
 */
export const deletePageSection = async (id: string): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { error } = await supabase.from(PAGE_CONTENT_TABLE).delete().eq('id', id);

    if (error) {
      console.error('Error deleting page section:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting page section:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time page content updates
 */
export const subscribeToPageContentUpdates = (
  callback: (pageContent: DatabasePageContent[]) => void,
  onError?: (error: Error) => void,
  pageName?: string
) => {
  if (!supabase) {
    if (onError) {
      onError(new Error('Supabase is not initialized'));
    }
    return () => {}; // Return empty unsubscribe function
  }

  // Initial fetch
  getAllPageContent(pageName)
    .then(callback)
    .catch((error) => {
      if (onError) {
        onError(error);
      }
    });

  // Subscribe to changes
  const channel = supabase
    .channel('page-content-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: PAGE_CONTENT_TABLE,
      },
      () => {
        // Refetch all page content when any change occurs
        getAllPageContent(pageName)
          .then(callback)
          .catch((error) => {
            console.error('Error in page content subscription:', error);
            if (onError) {
              onError(error);
            }
          });
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};
