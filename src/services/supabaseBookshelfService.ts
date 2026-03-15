import { getSupabaseClient, supabase } from '../supabase/client';
import { bookshelfEntryFromDatabase, bookshelfEntryToDatabase } from '../types/converters';
import type { Database } from '../types/database';
import type { BookshelfEntry } from '../types/types';

const TABLE = 'bookshelf_entries' as const;

export const getAllBookshelfEntries = async (): Promise<BookshelfEntry[]> => {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from(TABLE)
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(bookshelfEntryFromDatabase);
};

export const createBookshelfEntry = async (
  entry: Omit<BookshelfEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<BookshelfEntry> => {
  const client = getSupabaseClient();
  const payload: Database['public']['Tables']['bookshelf_entries']['Insert'] =
    bookshelfEntryToDatabase(entry);
  const { data, error } = await client
    .from(TABLE)
    .insert(payload as never)
    .select()
    .single();
  if (error) throw error;
  return bookshelfEntryFromDatabase(data);
};

export const updateBookshelfEntry = async (
  id: string,
  entry: Partial<BookshelfEntry>
): Promise<void> => {
  const client = getSupabaseClient();
  const updateData: Database['public']['Tables']['bookshelf_entries']['Update'] = {};
  if (entry.title !== undefined) updateData.title = entry.title;
  if (entry.slug !== undefined) updateData.slug = entry.slug;
  if (entry.entryType !== undefined) updateData.entry_type = entry.entryType;
  if (entry.bookTitle !== undefined) updateData.book_title = entry.bookTitle;
  if (entry.author !== undefined) updateData.author = entry.author || null;
  if (entry.coverImage !== undefined) updateData.cover_image = entry.coverImage || null;
  if (entry.summary !== undefined) updateData.summary = entry.summary || null;
  if (entry.body !== undefined) updateData.body = entry.body;
  if (entry.tags !== undefined) updateData.tags = entry.tags;
  if (entry.rating !== undefined) updateData.rating = entry.rating || null;
  if (entry.status !== undefined) updateData.status = entry.status;
  if (entry.isFeatured !== undefined) updateData.is_featured = entry.isFeatured;
  if (entry.isPinned !== undefined) updateData.is_pinned = entry.isPinned;
  if (entry.sortOrder !== undefined) updateData.sort_order = entry.sortOrder;
  if (entry.seoTitle !== undefined) updateData.seo_title = entry.seoTitle || null;
  if (entry.seoDescription !== undefined) updateData.seo_description = entry.seoDescription || null;
  if (entry.publishedAt !== undefined) updateData.published_at = entry.publishedAt || null;
  const { error } = await client.from(TABLE).update(updateData as never).eq('id', id);
  if (error) throw error;
};

export const deleteBookshelfEntry = async (id: string): Promise<void> => {
  const client = getSupabaseClient();
  const { error } = await client.from(TABLE).delete().eq('id', id);
  if (error) throw error;
};

export const subscribeToBookshelfUpdates = (
  callback: (entries: BookshelfEntry[]) => void,
  onError?: (error: Error) => void
) => {
  if (!supabase) {
    onError?.(new Error('Supabase is not initialized'));
    return () => {};
  }

  getAllBookshelfEntries().then(callback).catch((error) => onError?.(error));

  const client = getSupabaseClient();
  const channel = client
    .channel('bookshelf-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, () => {
      getAllBookshelfEntries().then(callback).catch((error) => onError?.(error));
    })
    .subscribe();

  return () => client.removeChannel(channel);
};
