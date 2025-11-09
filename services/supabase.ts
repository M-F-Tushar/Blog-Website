import { createClient } from '@supabase/supabase-js';
import { Post, Recommendation } from '../types';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Initialize Supabase client
let supabase: ReturnType<typeof createClient> | null = null;

if (isSupabaseConfigured()) {
  try {
    supabase = createClient(supabaseUrl!, supabaseAnonKey!);
    console.log('Supabase initialized successfully');
  } catch (error) {
    console.error('Error initializing Supabase:', error);
  }
} else {
  console.warn('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables to enable Supabase features.');
}

export { supabase };

// Database types for Supabase tables
export interface DatabasePost {
  id: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  status: string;
  cover_image: string | null;
  content: string;
  is_initial: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseRecommendation {
  id: string;
  title: string;
  url: string;
  description: string;
  type: string;
  is_initial: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSettings {
  id: string;
  featured_post_id: string | null;
  site_title: string;
  site_description: string;
}

// Helper functions to convert between camelCase (React) and snake_case (PostgreSQL)
export const postToDatabase = (post: Omit<Post, 'id'>): Omit<DatabasePost, 'id' | 'created_at' | 'updated_at'> => {
  return {
    title: post.title,
    date: post.date,
    category: post.category,
    tags: post.tags,
    excerpt: post.excerpt,
    status: post.status,
    cover_image: post.coverImage || null,
    content: post.content,
    is_initial: post.isInitial || false,
  };
};

export const postFromDatabase = (dbPost: DatabasePost): Post => {
  return {
    id: dbPost.id,
    title: dbPost.title,
    date: dbPost.date,
    category: dbPost.category,
    tags: dbPost.tags,
    excerpt: dbPost.excerpt,
    status: dbPost.status as any,
    coverImage: dbPost.cover_image || undefined,
    content: dbPost.content,
    isInitial: dbPost.is_initial,
  };
};

export const recommendationToDatabase = (rec: Omit<Recommendation, 'id'>): Omit<DatabaseRecommendation, 'id' | 'created_at' | 'updated_at'> => {
  return {
    title: rec.title,
    url: rec.url,
    description: rec.description,
    type: rec.type,
    is_initial: rec.isInitial || false,
  };
};

export const recommendationFromDatabase = (dbRec: DatabaseRecommendation): Recommendation => {
  return {
    id: dbRec.id,
    title: dbRec.title,
    url: dbRec.url,
    description: dbRec.description,
    type: dbRec.type as any,
    isInitial: dbRec.is_initial,
  };
};
