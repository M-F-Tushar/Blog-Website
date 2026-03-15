import { getSupabaseClient, supabase } from '../supabase/client';
import { navigationItemFromDatabase, navigationItemToDatabase } from '../types/converters';
import type { Database } from '../types/database';
import type { NavigationItem } from '../types/types';

const TABLE = 'navigation_items' as const;

export const getAllNavigationItems = async (): Promise<NavigationItem[]> => {
  const client = getSupabaseClient();
  const { data, error } = await client.from(TABLE).select('*').order('sort_order');
  if (error) throw error;
  return (data || []).map(navigationItemFromDatabase);
};

export const createNavigationItem = async (
  item: Omit<NavigationItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<NavigationItem> => {
  const client = getSupabaseClient();
  const payload: Database['public']['Tables']['navigation_items']['Insert'] =
    navigationItemToDatabase(item);
  const { data, error } = await client
    .from(TABLE)
    .insert(payload as never)
    .select()
    .single();
  if (error) throw error;
  return navigationItemFromDatabase(data);
};

export const updateNavigationItem = async (
  id: string,
  item: Partial<NavigationItem>
): Promise<void> => {
  const client = getSupabaseClient();
  const updateData: Database['public']['Tables']['navigation_items']['Update'] = {};
  if (item.label !== undefined) updateData.label = item.label;
  if (item.path !== undefined) updateData.path = item.path;
  if (item.isExternal !== undefined) updateData.is_external = item.isExternal;
  if (item.visible !== undefined) updateData.visible = item.visible;
  if (item.sortOrder !== undefined) updateData.sort_order = item.sortOrder;
  const { error } = await client.from(TABLE).update(updateData as never).eq('id', id);
  if (error) throw error;
};

export const deleteNavigationItem = async (id: string): Promise<void> => {
  const client = getSupabaseClient();
  const { error } = await client.from(TABLE).delete().eq('id', id);
  if (error) throw error;
};

export const subscribeToNavigationUpdates = (
  callback: (items: NavigationItem[]) => void,
  onError?: (error: Error) => void
) => {
  if (!supabase) {
    onError?.(new Error('Supabase is not initialized'));
    return () => {};
  }

  getAllNavigationItems().then(callback).catch((error) => onError?.(error));

  const client = getSupabaseClient();
  const channel = client
    .channel('navigation-items-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, () => {
      getAllNavigationItems().then(callback).catch((error) => onError?.(error));
    })
    .subscribe();

  return () => client.removeChannel(channel);
};
