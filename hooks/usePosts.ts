import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Post, PostStatus } from '../types';
import { POSTS as initialPostsData } from '../constants';

// A "user post" is now identical to Post, but without methods.
type UserPost = Post;

interface PostsContextType {
  posts: Post[];
  addPost: (postData: Omit<Post, 'id' | 'date' | 'isInitial'>) => Post;
  updatePost: (postId: string, postData: Omit<Post, 'id' | 'date' | 'isInitial'>) => Post | undefined;
  deletePost: (postId: string) => void;
  featuredPostId: string | null;
  setFeaturedPost: (postId: string | null) => void;
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
  const [posts, setPosts] = useState<Post[]>(() => {
    const userPosts = getUserPostsFromStorage();
    const initialPostsWithFlag = initialPostsData.map(p => ({...p, isInitial: true}));
    return [...initialPostsWithFlag, ...userPosts];
  });
  
  const [featuredPostId, setFeaturedPostIdState] = useState<string | null>(() => {
      return window.localStorage.getItem('featuredPostId');
  });

  const setFeaturedPost = (postId: string | null) => {
      if(postId) {
          window.localStorage.setItem('featuredPostId', postId);
      } else {
          window.localStorage.removeItem('featuredPostId');
      }
      setFeaturedPostIdState(postId);
  }

  const addPost = useCallback((postData: Omit<Post, 'id' | 'date' | 'isInitial'>): Post => {
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
  }, []);

  const updatePost = useCallback((postId: string, postData: Omit<Post, 'id' | 'date' | 'isInitial'>): Post | undefined => {
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
  }, []);
  
  const deletePost = useCallback((postId: string) => {
    const currentUserPosts = getUserPostsFromStorage();
    const updatedUserPosts = currentUserPosts.filter(p => p.id !== postId);
    saveUserPostsToStorage(updatedUserPosts);
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
    // Unfeature the post if it was featured
    if (featuredPostId === postId) {
      setFeaturedPost(null);
    }
  }, [featuredPostId]);

  const value = useMemo(() => ({
      posts,
      addPost,
      updatePost,
      deletePost,
      featuredPostId,
      setFeaturedPost
  }), [posts, addPost, updatePost, deletePost, featuredPostId, setFeaturedPost]);

  return React.createElement(PostsContext.Provider, { value }, children);
};

export const usePosts = (): PostsContextType => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};