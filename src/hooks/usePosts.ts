import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { Post, PostStatus } from '../types/types';
import { POSTS as initialPostsData } from '../constants/constants';
import { isSupabaseConfigured } from '../services/supabase';
import { 
  createPost as createPostSupabase, 
  updatePost as updatePostSupabase, 
  deletePost as deletePostSupabase,
  subscribeToPostsUpdates
} from '../services/supabasePostsService';
import { 
  setFeaturedPostId as setFeaturedPostSupabase,
  subscribeToSettingsUpdates
} from '../services/supabaseSettingsService';

// A "user post" is now identical to Post, but without methods.
type UserPost = Post;

interface PostsContextType {
  posts: Post[];
  addPost: (postData: Omit<Post, 'id' | 'date' | 'isInitial'>) => Promise<Post>;
  updatePost: (postId: string, postData: Omit<Post, 'id' | 'date' | 'isInitial'>) => Promise<Post | undefined>;
  deletePost: (postId: string) => Promise<void>;
  featuredPostId: string | null;
  setFeaturedPost: (postId: string | null) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

const getUserPostsFromStorage = (): UserPost[] => {
    try {
        const savedUserPosts = window.localStorage.getItem('userBlogPosts');
        return savedUserPosts ? JSON.parse(savedUserPosts) : [];
    } catch (error) {
        console.error('Error reading user posts from localStorage', error);
        return [];
    }
};

const saveUserPostsToStorage = (posts: UserPost[]) => {
    try {
        window.localStorage.setItem('userBlogPosts', JSON.stringify(posts));
    } catch (error) {
        console.error('Error saving user posts to localStorage', error);
    }
}

export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const useSupabase = isSupabaseConfigured();
  const [posts, setPosts] = useState<Post[]>(() => {
    // Initialize with localStorage data or initial data
    const userPosts = getUserPostsFromStorage();
    const initialPostsWithFlag = initialPostsData.map(p => ({...p, isInitial: true}));
    return [...initialPostsWithFlag, ...userPosts];
  });
  
  const [featuredPostId, setFeaturedPostIdState] = useState<string | null>(() => {
      return window.localStorage.getItem('featuredPostId');
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to Supabase updates if Supabase is configured
  useEffect(() => {
    if (!useSupabase) {
      return;
    }

    setLoading(true);
    
    // Subscribe to posts
    const unsubscribePosts = subscribeToPostsUpdates(
      (supabasePosts) => {
        setPosts(supabasePosts);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    // Subscribe to settings (for featured post)
    const unsubscribeSettings = subscribeToSettingsUpdates(
      (settings) => {
        setFeaturedPostIdState(settings.featuredPostId);
      },
      (err) => {
        console.error('Error subscribing to settings:', err);
      }
    );

    return () => {
      unsubscribePosts();
      unsubscribeSettings();
    };
  }, [useSupabase]);

  const setFeaturedPost = useCallback(async (postId: string | null) => {
    if (useSupabase) {
      try {
        await setFeaturedPostSupabase(postId);
        // The subscription will update the state
      } catch (err) {
        console.error('Error setting featured post:', err);
        setError(err instanceof Error ? err.message : 'Failed to set featured post');
      }
    } else {
      // Fallback to localStorage
      if(postId) {
          window.localStorage.setItem('featuredPostId', postId);
      } else {
          window.localStorage.removeItem('featuredPostId');
      }
      setFeaturedPostIdState(postId);
    }
  }, [useSupabase]);

  const addPost = useCallback(async (postData: Omit<Post, 'id' | 'date' | 'isInitial'>): Promise<Post> => {
    if (useSupabase) {
      try {
        const newPost: Post = {
          ...postData,
          id: '', // Supabase will generate the ID
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        };
        const createdPost = await createPostSupabase(newPost);
        // The subscription will update the state
        return createdPost;
      } catch (err) {
        console.error('Error creating post:', err);
        setError(err instanceof Error ? err.message : 'Failed to create post');
        throw err;
      }
    } else {
      // Fallback to localStorage
      const newPost: UserPost = {
        ...postData,
        id: `${postData.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').slice(0, 50)}-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };

      const currentUserPosts = getUserPostsFromStorage();
      const updatedUserPosts = [newPost, ...currentUserPosts];
      saveUserPostsToStorage(updatedUserPosts);
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      
      return newPost;
    }
  }, [useSupabase]);

  const updatePost = useCallback(async (postId: string, postData: Omit<Post, 'id' | 'date' | 'isInitial'>): Promise<Post | undefined> => {
    if (useSupabase) {
      try {
        await updatePostSupabase(postId, postData);
        // The subscription will update the state
        // Return the updated post from current state
        return posts.find(p => p.id === postId);
      } catch (err) {
        console.error('Error updating post:', err);
        setError(err instanceof Error ? err.message : 'Failed to update post');
        throw err;
      }
    } else {
      // Fallback to localStorage
      const currentUserPosts = getUserPostsFromStorage();
      const postIndex = currentUserPosts.findIndex(p => p.id === postId);

      if (postIndex === -1) return undefined;
      
      const originalPost = currentUserPosts[postIndex];
      const updatedPost: UserPost = {
          ...originalPost,
          ...postData,
          tags: postData.tags,
      };
      
      currentUserPosts[postIndex] = updatedPost;
      saveUserPostsToStorage(currentUserPosts);
      
      setPosts(prevPosts => prevPosts.map(p => p.id === postId ? updatedPost : p));
      return updatedPost;
    }
  }, [useSupabase, posts]);
  
  const deletePost = useCallback(async (postId: string) => {
    if (useSupabase) {
      try {
        await deletePostSupabase(postId);
        // The subscription will update the state
        // Unfeature if needed
        if (featuredPostId === postId) {
          await setFeaturedPost(null);
        }
      } catch (err) {
        console.error('Error deleting post:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete post');
        throw err;
      }
    } else {
      // Fallback to localStorage
      const currentUserPosts = getUserPostsFromStorage();
      const updatedUserPosts = currentUserPosts.filter(p => p.id !== postId);
      saveUserPostsToStorage(updatedUserPosts);
      setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
      // Unfeature the post if it was featured
      if (featuredPostId === postId) {
        await setFeaturedPost(null);
      }
    }
  }, [useSupabase, featuredPostId, setFeaturedPost]);

  const value = useMemo(() => ({
      posts,
      addPost,
      updatePost,
      deletePost,
      featuredPostId,
      setFeaturedPost,
      loading,
      error
  }), [posts, addPost, updatePost, deletePost, featuredPostId, setFeaturedPost, loading, error]);

  return React.createElement(PostsContext.Provider, { value }, children);
};

export const usePosts = (): PostsContextType => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};