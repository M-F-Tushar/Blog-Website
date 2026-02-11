import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';

const ADMIN_EMAIL = import.meta.env.PUBLIC_ADMIN_EMAIL;

export const authService = {
  // Sign in with email and password (admin-only when PUBLIC_ADMIN_EMAIL is set)
  async signIn(email: string, password: string) {
    if (!supabase)
      throw new Error(
        'Supabase is not configured. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY environment variables.'
      );
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Reject non-admin users
    if (ADMIN_EMAIL && data.user?.email !== ADMIN_EMAIL) {
      await supabase.auth.signOut();
      throw new Error('Access denied. This admin panel is restricted.');
    }

    return data;
  },

  // Sign out
  async signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  async getSession() {
    if (!supabase) return null;
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Get current user
  async getCurrentUser() {
    if (!supabase) return null;
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
    return supabase.auth.onAuthStateChange(callback);
  },
};
