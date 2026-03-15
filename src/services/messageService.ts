import { getSupabaseClient, supabase } from '../supabase/client';
import type { Database } from '../types/database';

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

export interface MessageFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const messageService = {
  // --- Public Methods (Unauthenticated) ---

  async sendMessage(data: MessageFormData): Promise<void> {
    const client = getSupabaseClient();
    const payload: Database['public']['Tables']['contact_messages']['Insert'] = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    };

    const { error } = await client.from('contact_messages').insert([payload] as never);

    if (error) throw error;
  },

  async subscribeToNewsletter(email: string): Promise<void> {
    const client = getSupabaseClient();
    const payload: Database['public']['Tables']['newsletter_subscribers']['Insert'] = { email };

    const { error } = await client.from('newsletter_subscribers').insert([payload] as never);

    if (error) {
      // Ignore unique constraint violation (already subscribed)
      if (error.code === '23505') return;
      throw error;
    }
  },

  // --- Admin Methods (Authenticated) ---

  async getMessages(): Promise<Message[]> {
    if (!supabase) return [];

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return ((data || []) as Database['public']['Tables']['contact_messages']['Row'][]).map(
      (message) => ({
        id: message.id,
        name: message.name,
        email: message.email,
        subject: message.subject || '',
        message: message.message,
        read: message.is_read,
        created_at: message.created_at,
      })
    );
  },

  async markAsRead(id: string): Promise<void> {
    if (!supabase) return;

    const client = getSupabaseClient();
    const payload: Database['public']['Tables']['contact_messages']['Update'] = {
      is_read: true,
    };
    const { error } = await client
      .from('contact_messages')
      .update(payload as never)
      .eq('id', id);

    if (error) throw error;
  },

  async deleteMessage(id: string): Promise<void> {
    if (!supabase) return;

    const { error } = await supabase.from('contact_messages').delete().eq('id', id);

    if (error) throw error;
  },

  async getSubscribers(): Promise<Subscriber[]> {
    if (!supabase) return [];

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) throw error;
    return ((data || []) as Database['public']['Tables']['newsletter_subscribers']['Row'][]).map(
      (subscriber) => ({
        id: subscriber.id,
        email: subscriber.email,
        subscribed_at: subscriber.subscribed_at,
      })
    );
  },

  async deleteSubscriber(id: string): Promise<void> {
    if (!supabase) return;

    const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);

    if (error) throw error;
  },

  async getUnreadCount(): Promise<number> {
    if (!supabase) return 0;

    const { count, error } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  },
};
