import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
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
        if (!user) {
            setBookmarks([]);
            setIsLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('bookmarks')
                .select('post_id')
                .eq('user_id', user.id);

            if (error) throw error;

            setBookmarks(data.map(b => b.post_id));
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

        const isBookmarked = bookmarks.includes(postId);

        try {
            if (isBookmarked) {
                const { error } = await supabase
                    .from('bookmarks')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('post_id', postId);

                if (error) throw error;
                setBookmarks(prev => prev.filter(id => id !== postId));
            } else {
                const { error } = await supabase
                    .from('bookmarks')
                    .insert({ user_id: user.id, post_id: postId });

                if (error) throw error;
                setBookmarks(prev => [...prev, postId]);
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
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
