import { supabase, publicationToDatabase, publicationFromDatabase } from './supabase';
import type { Publication } from './supabase';

const PUBLICATIONS_TABLE = 'publications';

/**
 * Get all publications from Supabase
 */
export const getAllPublications = async (): Promise<Publication[]> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { data, error } = await supabase
      .from(PUBLICATIONS_TABLE)
      .select('*')
      .order('year', { ascending: false })
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching publications:', error);
      throw error;
    }

    return (data || []).map(publicationFromDatabase);
  } catch (error) {
    console.error('Error fetching publications:', error);
    throw error;
  }
};

/**
 * Get a single publication by ID
 */
export const getPublicationById = async (id: string): Promise<Publication | null> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { data, error } = await supabase
      .from(PUBLICATIONS_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      console.error('Error fetching publication:', error);
      throw error;
    }

    return data ? publicationFromDatabase(data) : null;
  } catch (error) {
    console.error('Error fetching publication:', error);
    throw error;
  }
};

/**
 * Create a new publication
 */
export const createPublication = async (
  publication: Omit<Publication, 'id'>
): Promise<Publication> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const dbPub = publicationToDatabase(publication);
    const { data, error } = await supabase
      .from(PUBLICATIONS_TABLE)
      .insert(dbPub as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating publication:', error);
      throw error;
    }

    return publicationFromDatabase(data);
  } catch (error) {
    console.error('Error creating publication:', error);
    throw error;
  }
};

/**
 * Update an existing publication
 */
export const updatePublication = async (
  id: string,
  publication: Partial<Publication>
): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const updateData: any = {};

    if (publication.title !== undefined) updateData.title = publication.title;
    if (publication.authors !== undefined) updateData.authors = publication.authors;
    if (publication.venue !== undefined) updateData.venue = publication.venue;
    if (publication.year !== undefined) updateData.year = publication.year;
    if (publication.abstract !== undefined) updateData.abstract = publication.abstract || null;
    if (publication.doiUrl !== undefined) updateData.doi_url = publication.doiUrl || null;
    if (publication.pdfUrl !== undefined) updateData.pdf_url = publication.pdfUrl || null;
    if (publication.type !== undefined) updateData.type = publication.type;
    if (publication.sortOrder !== undefined) updateData.sort_order = publication.sortOrder;

    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from(PUBLICATIONS_TABLE)
      // @ts-expect-error - Supabase type inference issue with database types
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating publication:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating publication:', error);
    throw error;
  }
};

/**
 * Delete a publication
 */
export const deletePublication = async (id: string): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { error } = await supabase.from(PUBLICATIONS_TABLE).delete().eq('id', id);

    if (error) {
      console.error('Error deleting publication:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting publication:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time publications updates
 */
export const subscribeToPublicationsUpdates = (
  callback: (publications: Publication[]) => void,
  onError?: (error: Error) => void
) => {
  if (!supabase) {
    if (onError) {
      onError(new Error('Supabase is not initialized'));
    }
    return () => {}; // Return empty unsubscribe function
  }

  // Initial fetch
  getAllPublications()
    .then(callback)
    .catch((error) => {
      if (onError) {
        onError(error);
      }
    });

  // Subscribe to changes
  const channel = supabase
    .channel('publications-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: PUBLICATIONS_TABLE,
      },
      () => {
        // Refetch all publications when any change occurs
        getAllPublications()
          .then(callback)
          .catch((error) => {
            console.error('Error in publications subscription:', error);
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
