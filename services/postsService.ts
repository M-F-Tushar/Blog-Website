import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Post } from '../types';

const POSTS_COLLECTION = 'posts';

// Convert Firestore data to Post type
const convertFirestorePost = (id: string, data: any): Post => {
  return {
    id,
    title: data.title || '',
    date: data.date || '',
    category: data.category || '',
    tags: data.tags || [],
    excerpt: data.excerpt || '',
    status: data.status || 'Draft',
    coverImage: data.coverImage || '',
    content: data.content || '',
    isInitial: data.isInitial || false,
  };
};

// Get all posts from Firestore
export const getAllPosts = async (): Promise<Post[]> => {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      posts.push(convertFirestorePost(doc.id, doc.data()));
    });
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Get a single post by ID
export const getPostById = async (id: string): Promise<Post | null> => {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const postRef = doc(db, POSTS_COLLECTION, id);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      return convertFirestorePost(postSnap.id, postSnap.data());
    }
    return null;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

// Create a new post
export const createPost = async (post: Omit<Post, 'id'>): Promise<Post> => {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const postData = {
      ...post,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(postsRef, postData);
    return {
      ...post,
      id: docRef.id,
    };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Update an existing post
export const updatePost = async (id: string, post: Partial<Post>): Promise<void> => {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const postRef = doc(db, POSTS_COLLECTION, id);
    const updateData = {
      ...post,
      updatedAt: serverTimestamp(),
    };
    delete updateData.id; // Remove id from update data
    
    await updateDoc(postRef, updateData);
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (id: string): Promise<void> => {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const postRef = doc(db, POSTS_COLLECTION, id);
    await deleteDoc(postRef);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Subscribe to real-time posts updates
export const subscribeToPostsUpdates = (
  callback: (posts: Post[]) => void,
  onError?: (error: Error) => void
) => {
  if (!db) {
    if (onError) {
      onError(new Error('Firebase is not initialized'));
    }
    return () => {}; // Return empty unsubscribe function
  }

  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const posts: Post[] = [];
        querySnapshot.forEach((doc) => {
          posts.push(convertFirestorePost(doc.id, doc.data()));
        });
        callback(posts);
      },
      (error) => {
        console.error('Error in posts subscription:', error);
        if (onError) {
          onError(error as Error);
        }
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up posts subscription:', error);
    if (onError) {
      onError(error as Error);
    }
    return () => {};
  }
};
