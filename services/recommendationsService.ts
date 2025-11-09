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
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Recommendation } from '../types';

const RECOMMENDATIONS_COLLECTION = 'recommendations';

// Convert Firestore data to Recommendation type
const convertFirestoreRecommendation = (id: string, data: any): Recommendation => {
  return {
    id,
    title: data.title || '',
    url: data.url || '',
    description: data.description || '',
    type: data.type || 'Article',
    isInitial: data.isInitial || false,
  };
};

// Get all recommendations from Firestore
export const getAllRecommendations = async (): Promise<Recommendation[]> => {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const recsRef = collection(db, RECOMMENDATIONS_COLLECTION);
    const q = query(recsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const recommendations: Recommendation[] = [];
    querySnapshot.forEach((doc) => {
      recommendations.push(convertFirestoreRecommendation(doc.id, doc.data()));
    });
    
    return recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

// Get a single recommendation by ID
export const getRecommendationById = async (id: string): Promise<Recommendation | null> => {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const recRef = doc(db, RECOMMENDATIONS_COLLECTION, id);
    const recSnap = await getDoc(recRef);
    
    if (recSnap.exists()) {
      return convertFirestoreRecommendation(recSnap.id, recSnap.data());
    }
    return null;
  } catch (error) {
    console.error('Error fetching recommendation:', error);
    throw error;
  }
};

// Create a new recommendation
export const createRecommendation = async (
  recommendation: Omit<Recommendation, 'id'>
): Promise<Recommendation> => {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const recsRef = collection(db, RECOMMENDATIONS_COLLECTION);
    const recData = {
      ...recommendation,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(recsRef, recData);
    return {
      ...recommendation,
      id: docRef.id,
    };
  } catch (error) {
    console.error('Error creating recommendation:', error);
    throw error;
  }
};

// Update an existing recommendation
export const updateRecommendation = async (
  id: string,
  recommendation: Partial<Recommendation>
): Promise<void> => {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const recRef = doc(db, RECOMMENDATIONS_COLLECTION, id);
    const updateData = {
      ...recommendation,
      updatedAt: serverTimestamp(),
    };
    delete updateData.id; // Remove id from update data
    
    await updateDoc(recRef, updateData);
  } catch (error) {
    console.error('Error updating recommendation:', error);
    throw error;
  }
};

// Delete a recommendation
export const deleteRecommendation = async (id: string): Promise<void> => {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const recRef = doc(db, RECOMMENDATIONS_COLLECTION, id);
    await deleteDoc(recRef);
  } catch (error) {
    console.error('Error deleting recommendation:', error);
    throw error;
  }
};

// Subscribe to real-time recommendations updates
export const subscribeToRecommendationsUpdates = (
  callback: (recommendations: Recommendation[]) => void,
  onError?: (error: Error) => void
) => {
  if (!db) {
    if (onError) {
      onError(new Error('Firebase is not initialized'));
    }
    return () => {}; // Return empty unsubscribe function
  }

  try {
    const recsRef = collection(db, RECOMMENDATIONS_COLLECTION);
    const q = query(recsRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const recommendations: Recommendation[] = [];
        querySnapshot.forEach((doc) => {
          recommendations.push(convertFirestoreRecommendation(doc.id, doc.data()));
        });
        callback(recommendations);
      },
      (error) => {
        console.error('Error in recommendations subscription:', error);
        if (onError) {
          onError(error as Error);
        }
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up recommendations subscription:', error);
    if (onError) {
      onError(error as Error);
    }
    return () => {};
  }
};
