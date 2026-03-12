import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import type { Database } from '../services/supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from '../hooks/useAuth';

interface BookmarksContextType {
  bookmarks: string[];
  isLoading: boolean;
  toggleBookmark: (postId: string) => Promise<void>;
  isBookmarked: (postId: string) => boolean;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export const BookmarksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchBookmarks = useCallback(async () => {
    if (!user || !supabase) {
      setBookmarks([]);
      setIsLoading(false);
      return;
    }

    const client = supabase as SupabaseClient<Database>;

    try {
      const { data, error } = await client
        .from('bookmarks')
        .select('post_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setBookmarks((data as Array<{ post_id: string }>).map((b) => b.post_id));
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const toggleBookmark = async (postId: string) => {
    if (!user) {
      alert('Please sign in to bookmark posts.');
      return;
    }

    if (!supabase) {
      console.error('Supabase client not initialized');
      return;
    }

    const client = supabase as SupabaseClient<Database>;

    const isBookmarked = bookmarks.includes(postId);

    // Optimistic update
    setBookmarks((prev) => (isBookmarked ? prev.filter((id) => id !== postId) : [...prev, postId]));

    try {
      if (isBookmarked) {
        const { error } = await client
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);

        if (error) throw error;
      } else {
        const { error } = await client
          .from('bookmarks')
          .insert({ user_id: user.id, post_id: postId });

        if (error) {
          // Ignore unique constraint violation (race condition)
          if (error.code === '23505') {
            // unique_violation
            return;
          }
          throw error;
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      // Revert optimistic update on error
      setBookmarks((prev) =>
        isBookmarked ? [...prev, postId] : prev.filter((id) => id !== postId)
      );
      alert('Failed to update bookmark. Please try again.');
    }
  };

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        isLoading,
        toggleBookmark,
        isBookmarked: (postId: string) => bookmarks.includes(postId),
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
};
