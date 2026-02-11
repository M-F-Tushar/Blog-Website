/**
 * Supabase client — single initialization shared by build-time and runtime code.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

let _supabase: SupabaseClient<Database> | null = null;

if (isSupabaseConfigured()) {
  try {
    _supabase = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
  }
}

export const supabase = _supabase;
