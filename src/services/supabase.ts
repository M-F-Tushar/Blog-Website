import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type {
  Post,
  Recommendation,
  PostStatus,
  RecommendationType,
  DifficultyLevel,
} from '../types/types';
import { DEFAULT_AVATAR } from '../constants/constants';

// Supabase configuration from environment variables
// Astro exposes client-side env vars with PUBLIC_ prefix, fall back to VITE_ for compatibility
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Define database schema type
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: DatabasePost;
        Insert: Omit<DatabasePost, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabasePost, 'id' | 'created_at'>>;
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
            foreignKeyName: 'bookmarks_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      projects: {
        Row: DatabaseProject;
        Insert: Omit<DatabaseProject, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseProject, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      publications: {
        Row: DatabasePublication;
        Insert: Omit<DatabasePublication, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabasePublication, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      cv_education: {
        Row: DatabaseCVEducation;
        Insert: Omit<DatabaseCVEducation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseCVEducation, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      cv_experience: {
        Row: DatabaseCVExperience;
        Insert: Omit<DatabaseCVExperience, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseCVExperience, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      cv_certifications: {
        Row: DatabaseCVCertification;
        Insert: Omit<DatabaseCVCertification, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseCVCertification, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      page_content: {
        Row: DatabasePageContent;
        Insert: Omit<DatabasePageContent, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabasePageContent, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
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
        detectSessionInUrl: true,
      },
    });
  } catch (error) {
    console.error('Error initializing Supabase:', error);
  }
} else {
  console.warn(
    'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables to enable Supabase features.'
  );
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
  thumbnail: string | null;
  difficulty: string | null;
  estimated_time: string | null;
  author_note: string | null;
  tags: string[] | null;
  is_featured: boolean;
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
  navigation?: {
    menuItems: Array<{
      id: string;
      label: string;
      path: string;
      isExternal: boolean;
      visible: boolean;
      order: number;
    }>;
  };
  seo?: {
    defaultMetaTitle: string;
    defaultMetaDescription: string;
    ogImage: string;
    twitterHandle: string;
    pageMeta: Record<string, { title: string; description: string; ogImage?: string }>;
  };
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseProject {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  sort_order: number;
  is_featured: boolean;
  status: string;
  is_initial: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabasePublication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  abstract: string | null;
  doi_url: string | null;
  pdf_url: string | null;
  type: string;
  sort_order: number;
  is_initial: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCVEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  sort_order: number;
  is_initial: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCVExperience {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description: string;
  responsibilities: string[];
  sort_order: number;
  is_initial: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCVCertification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_url: string | null;
  sort_order: number;
  is_initial: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabasePageContent {
  id: string;
  page_name: string;
  section_key: string;
  title: string | null;
  content: string | null;
  metadata: Json | null;
  sort_order: number;
  is_initial: boolean;
  created_at: string;
  updated_at: string;
}

// App-side types for Projects and Publications (camelCase)
export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  sortOrder: number;
  isFeatured: boolean;
  status: string;
  isInitial?: boolean;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  abstract?: string;
  doiUrl?: string;
  pdfUrl?: string;
  type: string;
  sortOrder: number;
  isInitial?: boolean;
}

// Helper functions to convert between camelCase (React) and snake_case (PostgreSQL)
export const postToDatabase = (
  post: Omit<Post, 'id'>
): Omit<DatabasePost, 'id' | 'created_at' | 'updated_at'> => {
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
      avatar: DEFAULT_AVATAR,
    },
    readTime: `${Math.ceil(dbPost.content.split(' ').length / 200)} min read`,
    commentCount: 0,
  };
};

export const recommendationToDatabase = (
  rec: Omit<Recommendation, 'id'>
): Omit<DatabaseRecommendation, 'id' | 'created_at' | 'updated_at'> => {
  return {
    title: rec.title,
    url: rec.url,
    description: rec.description,
    type: rec.type,
    thumbnail: rec.thumbnail || null,
    difficulty: rec.difficulty || null,
    estimated_time: rec.estimatedTime || null,
    author_note: rec.authorNote || null,
    tags: rec.tags || null,
    is_featured: rec.isFeatured || false,
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
    thumbnail: dbRec.thumbnail || undefined,
    difficulty: (dbRec.difficulty as DifficultyLevel) || undefined,
    estimatedTime: dbRec.estimated_time || undefined,
    authorNote: dbRec.author_note || undefined,
    tags: dbRec.tags || undefined,
    isFeatured: dbRec.is_featured,
    isInitial: dbRec.is_initial,
  };
};

export const projectToDatabase = (
  project: Omit<Project, 'id'>
): Omit<DatabaseProject, 'id' | 'created_at' | 'updated_at'> => {
  return {
    title: project.title,
    description: project.description,
    tech_stack: project.techStack,
    image_url: project.imageUrl || null,
    live_url: project.liveUrl || null,
    github_url: project.githubUrl || null,
    sort_order: project.sortOrder,
    is_featured: project.isFeatured,
    status: project.status,
    is_initial: project.isInitial || false,
  };
};

export const projectFromDatabase = (dbProject: DatabaseProject): Project => {
  return {
    id: dbProject.id,
    title: dbProject.title,
    description: dbProject.description,
    techStack: dbProject.tech_stack,
    imageUrl: dbProject.image_url || undefined,
    liveUrl: dbProject.live_url || undefined,
    githubUrl: dbProject.github_url || undefined,
    sortOrder: dbProject.sort_order,
    isFeatured: dbProject.is_featured,
    status: dbProject.status,
    isInitial: dbProject.is_initial,
  };
};

export const publicationToDatabase = (
  pub: Omit<Publication, 'id'>
): Omit<DatabasePublication, 'id' | 'created_at' | 'updated_at'> => {
  return {
    title: pub.title,
    authors: pub.authors,
    venue: pub.venue,
    year: pub.year,
    abstract: pub.abstract || null,
    doi_url: pub.doiUrl || null,
    pdf_url: pub.pdfUrl || null,
    type: pub.type,
    sort_order: pub.sortOrder,
    is_initial: pub.isInitial || false,
  };
};

export const publicationFromDatabase = (dbPub: DatabasePublication): Publication => {
  return {
    id: dbPub.id,
    title: dbPub.title,
    authors: dbPub.authors,
    venue: dbPub.venue,
    year: dbPub.year,
    abstract: dbPub.abstract || undefined,
    doiUrl: dbPub.doi_url || undefined,
    pdfUrl: dbPub.pdf_url || undefined,
    type: dbPub.type,
    sortOrder: dbPub.sort_order,
    isInitial: dbPub.is_initial,
  };
};
