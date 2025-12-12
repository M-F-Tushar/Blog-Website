import React from 'react';
import { Post, Recommendation, RecommendationType, PostStatus, Category } from '../types/types';

/**
 * Default author avatar fallback URL
 * Used when no custom avatar is configured
 */
export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

/**
 * IMPORTANT: These constants serve as fallback data when Supabase is not configured.
 * 
 * All content is now managed through Supabase. These arrays are intentionally empty.
 * 
 * To add new content:
 * 1. Ensure Supabase is configured (see SUPABASE_SETUP.md)
 * 2. Use the admin dashboard at /admin to create posts and recommendations
 * 3. All content will be stored in and served from Supabase
 * 
 * DO NOT add hardcoded data here. Use the admin dashboard instead.
 */

export const POSTS: Post[] = [];

export const RECOMMENDATIONS: Recommendation[] = [];