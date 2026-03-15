/**
 * Database row types — single source of truth for all Supabase table shapes.
 * Fields use snake_case to match PostgreSQL column names exactly.
 */

// ─── Utility ────────────────────────────────────────────────────────
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ─── Row types ──────────────────────────────────────────────────────

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
  site_title: string;
  site_name: string;
  site_description: string;
  author_name: string;
  author_tagline: string;
  author_bio: string;
  author_image?: string | null;
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
  slug: string | null;
  description: string;
  long_description: string | null;
  tags: string[] | null;
  tech_stack: string[];
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  problem: string | null;
  motivation: string | null;
  approach: string | null;
  architecture: string | null;
  implementation: string | null;
  challenges: string | null;
  lessons_learned: string | null;
  future_improvements: string | null;
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
  arxiv_url: string | null;
  pdf_url: string | null;
  code_url: string | null;
  slides_url: string | null;
  bibtex: string | null;
  type: string;
  is_featured: boolean;
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
  gpa: string | null;
  location: string | null;
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
  location: string | null;
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
  credential_id: string | null;
  credential_url: string | null;
  description: string | null;
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

export interface DatabaseCustomPage {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  layout: string;
  status: string;
  sort_order: number;
  show_in_navigation: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCustomPageSection {
  id: string;
  page_id: string;
  section_type: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  metadata: Json | null;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseNavigationItem {
  id: string;
  label: string;
  path: string;
  is_external: boolean;
  visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DatabasePageSection {
  id: string;
  page_key: string;
  section_key: string;
  section_type: string;
  preset_key: string | null;
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  primary_cta_label: string | null;
  primary_cta_url: string | null;
  secondary_cta_label: string | null;
  secondary_cta_url: string | null;
  layout_variant: string | null;
  visual_tone: string | null;
  density: string | null;
  background_treatment: string | null;
  content_alignment: string | null;
  media_mode: string | null;
  content_collection: string | null;
  content_source: string | null;
  kicker_style: string | null;
  section_role: string | null;
  animation_preset: string | null;
  content_grouping: string | null;
  content_emphasis: string | null;
  max_items: number | null;
  show_divider: boolean | null;
  featured_project_id: string | null;
  featured_post_id: string | null;
  featured_bookshelf_entry_id: string | null;
  manual_item_ids: string[] | null;
  metadata: Json | null;
  visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseStoryChapter {
  id: string;
  title: string;
  subtitle: string | null;
  body: string;
  period_label: string | null;
  featured_media: string | null;
  visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseStoryMilestone {
  id: string;
  chapter_id: string | null;
  title: string;
  description: string | null;
  period_label: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseBookshelfEntry {
  id: string;
  title: string;
  slug: string;
  entry_type: string;
  book_title: string;
  author: string | null;
  cover_image: string | null;
  summary: string | null;
  body: string;
  tags: string[] | null;
  rating: number | null;
  status: string;
  is_featured: boolean;
  is_pinned: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  updated_at: string;
  created_at: string;
}

export interface DatabaseContactLink {
  id: string;
  label: string;
  url: string;
  link_type: string;
  description: string | null;
  visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseAdminUser {
  user_id: string;
  email: string | null;
  is_active: boolean;
  created_at: string;
}

// ─── Supabase Database schema generic ───────────────────────────────

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
      custom_pages: {
        Row: DatabaseCustomPage;
        Insert: Omit<DatabaseCustomPage, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseCustomPage, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      custom_page_sections: {
        Row: DatabaseCustomPageSection;
        Insert: Omit<DatabaseCustomPageSection, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseCustomPageSection, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      navigation_items: {
        Row: DatabaseNavigationItem;
        Insert: Omit<DatabaseNavigationItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseNavigationItem, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      page_sections: {
        Row: DatabasePageSection;
        Insert: Omit<DatabasePageSection, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabasePageSection, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      story_chapters: {
        Row: DatabaseStoryChapter;
        Insert: Omit<DatabaseStoryChapter, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseStoryChapter, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      story_milestones: {
        Row: DatabaseStoryMilestone;
        Insert: Omit<DatabaseStoryMilestone, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseStoryMilestone, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      bookshelf_entries: {
        Row: DatabaseBookshelfEntry;
        Insert: Omit<DatabaseBookshelfEntry, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseBookshelfEntry, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      contact_links: {
        Row: DatabaseContactLink;
        Insert: Omit<DatabaseContactLink, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseContactLink, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      admin_users: {
        Row: DatabaseAdminUser;
        Insert: Omit<DatabaseAdminUser, 'created_at'>;
        Update: Partial<Omit<DatabaseAdminUser, 'created_at'>>;
        Relationships: [];
      };
      bookmarks: {
        Row: { id: string; user_id: string; post_id: string; created_at: string };
        Insert: { user_id: string; post_id: string };
        Update: { user_id?: string; post_id?: string };
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
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          {
            id: string;
            post_id: string;
            user_id: string;
            content: string;
            parent_id: string | null;
            created_at: string;
            updated_at: string;
          },
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<
          Omit<
            { post_id: string; user_id: string; content: string; parent_id: string | null },
            never
          >
        >;
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: { name: string; email: string; subject?: string | null; message: string };
        Update: { is_read?: boolean };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          subscribed_at: string;
          is_active: boolean;
        };
        Insert: { email: string };
        Update: { is_active?: boolean };
        Relationships: [];
      };
      post_views: {
        Row: {
          id: string;
          post_id: string;
          viewer_ip: string | null;
          user_agent: string | null;
          referrer: string | null;
          session_id: string | null;
          viewed_at: string;
        };
        Insert: {
          post_id: string;
          viewer_ip?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
          session_id?: string | null;
        };
        Update: never;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: { username?: string | null; full_name?: string | null; avatar_url?: string | null };
        Relationships: [];
      };
    };
    Views: {
      post_statistics: {
        Row: {
          post_id: string;
          title: string;
          category: string | null;
          status: string | null;
          total_views: number | null;
          unique_views: number | null;
          views_last_7_days: number | null;
          views_last_30_days: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      record_page_view: {
        Args: {
          p_post_id: string;
          p_session_id: string;
          p_referrer: string | null;
          p_user_agent: string | null;
        };
        Returns: void;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
