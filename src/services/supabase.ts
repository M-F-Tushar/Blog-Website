import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Post, Recommendation, PostStatus, RecommendationType } from '../types/types';

// Supabase configuration from environment variables
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Define database schema type
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: DatabasePost;
        Insert: Omit<DatabasePost, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabasePost, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      recommendations: {
        Row: DatabaseRecommendation;
        Insert: Omit<DatabaseRecommendation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseRecommendation, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      site_settings: {
        Row: DatabaseSettings;
        Insert: Partial<DatabaseSettings>;
        Update: Partial<DatabaseSettings>;
        Relationships: [];
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          post_id: string;
        };
        Update: {
          user_id?: string;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookmarks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Initialize Supabase client with typed database
let supabase: SupabaseClient<Database> | null = null;

if (isSupabaseConfigured()) {
  try {
    supabase = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
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
  site_title: string; // Keep for backward compatibility if needed, or remove if unused
  site_name: string;
  site_description: string;
  author_name: string;
  author_tagline: string;
  author_bio: string;
  social_github: string;
  social_linkedin: string;
  social_email: string;
  social_twitter?: string;
  social_instagram?: string;
  social_youtube?: string;
  social_discord?: string;
  categories: string[];
  skills: Json[];
  timeline: Json[];
  achievements: Json[];
  ui_text?: {
    home: {
      welcomeBadge: string;
      startReading: string;
      moreAboutMe: string;
      featuredStory: string;
      trendingTopics: string;
      latestArticles: string;
      newsletterTitle: string;
      newsletterDescription: string;
      subscribeButton: string;
    };
    footer: {
      tagline: string;
      exploreTitle: string;
      latestTitle: string;
      stayConnectedTitle: string;
      newsletterDescription: string;
      subscribeButton: string;
      copyrightText: string;
    };
    header: {
      home: string;
      about: string;
      blog: string;
      recommendations: string;
      bookmarks: string;
      contact: string;
      searchPlaceholder: string;
    };
  };
  homepage_layout?: {
    showHero: boolean;
    showFeaturedPost: boolean;
    showTrendingTopics: boolean;
    showLatestArticles: boolean;
    showNewsletter: boolean;
  };
  appearance?: {
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
    logoUrl: string;
    faviconUrl: string;
    defaultTheme: 'light' | 'dark' | 'system';
  };
  created_at?: string;
  updated_at?: string;
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
    status: dbPost.status as PostStatus,
    coverImage: dbPost.cover_image || undefined,
    content: dbPost.content,
    isInitial: dbPost.is_initial,
    author: {
      name: 'Author',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    readTime: `${Math.ceil(dbPost.content.split(' ').length / 200)} min read`,
    commentCount: 0,
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
    type: dbRec.type as RecommendationType,
    isInitial: dbRec.is_initial,
  };
};
