import { getSupabaseClient, supabase } from '../supabase/client';
import { contactLinkFromDatabase, contactLinkToDatabase } from '../types/converters';
import type { Database } from '../types/database';
import type { ContactLink } from '../types/types';

const TABLE = 'contact_links' as const;

export const getAllContactLinks = async (): Promise<ContactLink[]> => {
  const client = getSupabaseClient();
  const { data, error } = await client.from(TABLE).select('*').order('sort_order');
  if (error) throw error;
  return (data || []).map(contactLinkFromDatabase);
};

export const createContactLink = async (
  link: Omit<ContactLink, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ContactLink> => {
  const client = getSupabaseClient();
  const payload: Database['public']['Tables']['contact_links']['Insert'] = contactLinkToDatabase(link);
  const { data, error } = await client
    .from(TABLE)
    .insert(payload as never)
    .select()
    .single();
  if (error) throw error;
  return contactLinkFromDatabase(data);
};

export const updateContactLink = async (
  id: string,
  link: Partial<ContactLink>
): Promise<void> => {
  const client = getSupabaseClient();
  const updateData: Database['public']['Tables']['contact_links']['Update'] = {};
  if (link.label !== undefined) updateData.label = link.label;
  if (link.url !== undefined) updateData.url = link.url;
  if (link.linkType !== undefined) updateData.link_type = link.linkType;
  if (link.description !== undefined) updateData.description = link.description || null;
  if (link.visible !== undefined) updateData.visible = link.visible;
  if (link.sortOrder !== undefined) updateData.sort_order = link.sortOrder;
  const { error } = await client.from(TABLE).update(updateData as never).eq('id', id);
  if (error) throw error;
};

export const deleteContactLink = async (id: string): Promise<void> => {
  const client = getSupabaseClient();
  const { error } = await client.from(TABLE).delete().eq('id', id);
  if (error) throw error;
};

export const subscribeToContactLinksUpdates = (
  callback: (links: ContactLink[]) => void,
  onError?: (error: Error) => void
) => {
  if (!supabase) {
    onError?.(new Error('Supabase is not initialized'));
    return () => {};
  }

  getAllContactLinks().then(callback).catch((error) => onError?.(error));

  const client = getSupabaseClient();
  const channel = client
    .channel('contact-links-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, () => {
      getAllContactLinks().then(callback).catch((error) => onError?.(error));
    })
    .subscribe();

  return () => client.removeChannel(channel);
};
