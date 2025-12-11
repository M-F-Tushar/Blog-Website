export type Category = string;

export enum PostStatus {
  PUBLISHED = 'Published',
  DRAFT = 'Draft',
}

export interface Post {
  id: string;
  title: string;
  date: string;
  category: Category;
  tags: string[];
  excerpt: string;
  status: PostStatus;
  coverImage?: string;
  content: string;
  isInitial?: boolean;
  author: {
    name: string;
    avatar: string;
  };
  readTime: string;
  commentCount?: number;
}

export enum RecommendationType {
  ARTICLE = 'Article',
  BOOK = 'Book',
  TOOL = 'Tool',
  VIDEO = 'Video',
  COURSE = 'Course',
  WEBSITE = 'website',
  DOCUMENTATION = 'documentation',
}

export interface Recommendation {
  id: string;
  title: string;
  url: string;
  description: string;
  type: RecommendationType;
  isInitial?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  user?: {
    full_name: string;
    avatar_url: string;
  };
}
