import { supabase } from '../supabase/client';

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
    if (!supabase) throw new Error('Supabase client not initialized');

    const { error } = await supabase.from('contact_messages').insert([
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
    if (!supabase) throw new Error('Supabase client not initialized');

    const { error } = await supabase.from('newsletter_subscribers').insert([{ email }]);

    if (error) {
      // Ignore unique constraint violation (already subscribed)
      if (error.code === '23505') return;
      throw error;
    }
  },

  // --- Admin Methods (Authenticated) ---

  async getMessages(): Promise<Message[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async markAsRead(id: string): Promise<void> {
    if (!supabase) return;

    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
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

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) throw error;
    return data || [];
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
