import { supabase } from './supabase';

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

// Helper to bypass strict typing for new tables
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const safeSupabase = supabase as any;

export const messageService = {
  // --- Public Methods (Unauthenticated) ---

  async sendMessage(data: MessageFormData): Promise<void> {
    if (!safeSupabase) throw new Error('Supabase client not initialized');

    const { error } = await safeSupabase.from('messages').insert([
      {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      },
    ]);

    if (error) throw error;
  },

  async subscribeToNewsletter(email: string): Promise<void> {
    if (!safeSupabase) throw new Error('Supabase client not initialized');

    const { error } = await safeSupabase.from('newsletter_subscribers').insert([{ email }]);

    if (error) {
      // Ignore unique constraint violation (already subscribed)
      if (error.code === '23505') return;
      throw error;
    }
  },

  // --- Admin Methods (Authenticated) ---

  async getMessages(): Promise<Message[]> {
    if (!safeSupabase) return [];

    const { data, error } = await safeSupabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async markAsRead(id: string): Promise<void> {
    if (!safeSupabase) return;

    const { error } = await safeSupabase.from('messages').update({ read: true }).eq('id', id);

    if (error) throw error;
  },

  async deleteMessage(id: string): Promise<void> {
    if (!safeSupabase) return;

    const { error } = await safeSupabase.from('messages').delete().eq('id', id);

    if (error) throw error;
  },

  async getSubscribers(): Promise<Subscriber[]> {
    if (!safeSupabase) return [];

    const { data, error } = await safeSupabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async deleteSubscriber(id: string): Promise<void> {
    if (!safeSupabase) return;

    const { error } = await safeSupabase.from('newsletter_subscribers').delete().eq('id', id);

    if (error) throw error;
  },

  async getUnreadCount(): Promise<number> {
    if (!safeSupabase) return 0;

    const { count, error } = await safeSupabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  },
};
