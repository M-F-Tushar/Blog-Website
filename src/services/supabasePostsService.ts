import { supabase, postToDatabase, postFromDatabase } from './supabase';
import { Post } from '../types/types';
import { PostSchema } from '../utils/validation';
import DOMPurify from 'dompurify';

const POSTS_TABLE = 'posts';

/**
 * Get all posts from Supabase
 */
export const getAllPosts = async (): Promise<Post[]> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { data, error } = await supabase
      .from(POSTS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }

    return (data || []).map(postFromDatabase);
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

/**
 * Get a single post by ID
 */
export const getPostById = async (id: string): Promise<Post | null> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { data, error } = await supabase.from(POSTS_TABLE).select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      console.error('Error fetching post:', error);
      throw error;
    }

    return data ? postFromDatabase(data) : null;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

/**
 * Create a new post
 */
export const createPost = async (post: Omit<Post, 'id'>): Promise<Post> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    // Validate input
    const validatedPost = PostSchema.parse({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags,
      status: post.status,
      coverImage: post.coverImage,
    });

    // Sanitize content
    const sanitizedPost = {
      ...post,
      title: DOMPurify.sanitize(validatedPost.title, { ALLOWED_TAGS: [] }),
      content: DOMPurify.sanitize(validatedPost.content),
      excerpt: validatedPost.excerpt
        ? DOMPurify.sanitize(validatedPost.excerpt, { ALLOWED_TAGS: [] })
        : undefined,
    };

    const dbPost = postToDatabase(sanitizedPost);
    const { data, error } = await supabase
      .from(POSTS_TABLE)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(dbPost as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      throw error;
    }

    return postFromDatabase(data);
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

/**
 * Update an existing post
 */
export const updatePost = async (id: string, post: Partial<Post>): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    // Validate input if provided fields
    if (Object.keys(post).length > 0) {
      const validationData: Record<string, unknown> = {};
      if (post.title !== undefined) validationData.title = post.title;
      if (post.content !== undefined) validationData.content = post.content;
      if (post.excerpt !== undefined) validationData.excerpt = post.excerpt;
      if (post.category !== undefined) validationData.category = post.category;
      if (post.tags !== undefined) validationData.tags = post.tags;
      if (post.status !== undefined) validationData.status = post.status;
      if (post.coverImage !== undefined) validationData.coverImage = post.coverImage;

      // Partial validation - only validate fields that are present
      PostSchema.partial().parse(validationData);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (post.title !== undefined)
      updateData.title = DOMPurify.sanitize(post.title, { ALLOWED_TAGS: [] });
    if (post.date !== undefined) updateData.date = post.date;
    if (post.category !== undefined) updateData.category = post.category;
    if (post.tags !== undefined) updateData.tags = post.tags;
    if (post.excerpt !== undefined)
      updateData.excerpt = DOMPurify.sanitize(post.excerpt, { ALLOWED_TAGS: [] });
    if (post.status !== undefined) updateData.status = post.status;
    if (post.coverImage !== undefined) updateData.cover_image = post.coverImage || null;
    if (post.content !== undefined) updateData.content = DOMPurify.sanitize(post.content);

    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from(POSTS_TABLE)
      // @ts-expect-error - Supabase type inference issue with database types
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

/**
 * Delete a post
 */
export const deletePost = async (id: string): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { error } = await supabase.from(POSTS_TABLE).delete().eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time posts updates
 */
export const subscribeToPostsUpdates = (
  callback: (posts: Post[]) => void,
  onError?: (error: Error) => void
) => {
  if (!supabase) {
    if (onError) {
      onError(new Error('Supabase is not initialized'));
    }
    return () => {}; // Return empty unsubscribe function
  }

  // Initial fetch
  getAllPosts()
    .then(callback)
    .catch((error) => {
      if (onError) {
        onError(error);
      }
    });

  // Subscribe to changes
  const channel = supabase
    .channel('posts-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: POSTS_TABLE,
      },
      () => {
        // Refetch all posts when any change occurs
        getAllPosts()
          .then(callback)
          .catch((error) => {
            console.error('Error in posts subscription:', error);
            if (onError) {
              onError(error);
            }
          });
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase!.removeChannel(channel);
  };
};
