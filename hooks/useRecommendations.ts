import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { Recommendation } from '../types';
import { RECOMMENDATIONS as initialRecommendationsData } from '../constants';
import { isFirebaseConfigured } from '../services/firebase';
import {
  createRecommendation as createRecommendationFirebase,
  updateRecommendation as updateRecommendationFirebase,
  deleteRecommendation as deleteRecommendationFirebase,
  subscribeToRecommendationsUpdates
} from '../services/recommendationsService';

interface RecommendationsContextType {
  recommendations: Recommendation[];
  addRecommendation: (recData: Omit<Recommendation, 'id'>) => Promise<Recommendation>;
  updateRecommendation: (recId: string, recData: Omit<Recommendation, 'id'>) => Promise<Recommendation | undefined>;
  deleteRecommendation: (recId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const RecommendationsContext = createContext<RecommendationsContextType | undefined>(undefined);

const getUserRecsFromStorage = (): Recommendation[] => {
    try {
        const savedUserRecs = window.localStorage.getItem('userRecommendations');
        return savedUserRecs ? JSON.parse(savedUserRecs) : [];
    } catch (error) {
        console.error('Error reading recommendations from localStorage', error);
        return [];
    }
};

const saveUserRecsToStorage = (recs: Recommendation[]) => {
    try {
        window.localStorage.setItem('userRecommendations', JSON.stringify(recs));
    } catch (error) {
        console.error('Error saving recommendations to localStorage', error);
    }
}

export const RecommendationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const useFirebase = isFirebaseConfigured();
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => {
    const userRecs = getUserRecsFromStorage();
    return [...initialRecommendationsData, ...userRecs];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to Firebase updates if Firebase is configured
  useEffect(() => {
    if (!useFirebase) {
      return;
    }

    setLoading(true);
    
    const unsubscribe = subscribeToRecommendationsUpdates(
      (firebaseRecs) => {
        setRecommendations(firebaseRecs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [useFirebase]);

  const addRecommendation = useCallback(async (recData: Omit<Recommendation, 'id'>): Promise<Recommendation> => {
    if (useFirebase) {
      try {
        const createdRec = await createRecommendationFirebase(recData);
        // The subscription will update the state
        return createdRec;
      } catch (err) {
        console.error('Error creating recommendation:', err);
        setError(err instanceof Error ? err.message : 'Failed to create recommendation');
        throw err;
      }
    } else {
      // Fallback to localStorage
      const newRec: Recommendation = {
        ...recData,
        id: `${recData.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').slice(0, 50)}-${Date.now()}`,
      };

      const currentUserRecs = getUserRecsFromStorage();
      const updatedUserRecs = [newRec, ...currentUserRecs];
      saveUserRecsToStorage(updatedUserRecs);
      
      setRecommendations(prevRecs => [newRec, ...prevRecs]);
      return newRec;
    }
  }, [useFirebase]);

  const updateRecommendation = useCallback(async (recId: string, recData: Omit<Recommendation, 'id'>): Promise<Recommendation | undefined> => {
    if (useFirebase) {
      try {
        await updateRecommendationFirebase(recId, recData);
        // The subscription will update the state
        return recommendations.find(r => r.id === recId);
      } catch (err) {
        console.error('Error updating recommendation:', err);
        setError(err instanceof Error ? err.message : 'Failed to update recommendation');
        throw err;
      }
    } else {
      // Fallback to localStorage
      const currentUserRecs = getUserRecsFromStorage();
      const recIndex = currentUserRecs.findIndex(r => r.id === recId);

      if (recIndex === -1) return undefined;
      
      const originalRec = currentUserRecs[recIndex];
      const updatedRec: Recommendation = {
          ...originalRec,
          ...recData,
      };
      
      currentUserRecs[recIndex] = updatedRec;
      saveUserRecsToStorage(currentUserRecs);

      setRecommendations(prevRecs => prevRecs.map(r => r.id === recId ? updatedRec : r));
      return updatedRec;
    }
  }, [useFirebase, recommendations]);
  
  const deleteRecommendation = useCallback(async (recId: string) => {
    if (useFirebase) {
      try {
        await deleteRecommendationFirebase(recId);
        // The subscription will update the state
      } catch (err) {
        console.error('Error deleting recommendation:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete recommendation');
        throw err;
      }
    } else {
      // Fallback to localStorage
      const currentUserRecs = getUserRecsFromStorage();
      const updatedUserRecs = currentUserRecs.filter(r => r.id !== recId);
      saveUserRecsToStorage(updatedUserRecs);
      setRecommendations(prevRecs => prevRecs.filter(r => r.id !== recId));
    }
  }, [useFirebase]);
  
  const value = useMemo(() => ({
      recommendations, addRecommendation, updateRecommendation, deleteRecommendation, loading, error
  }), [recommendations, addRecommendation, updateRecommendation, deleteRecommendation, loading, error]);

  return React.createElement(RecommendationsContext.Provider, { value }, children);
};

export const useRecommendations = (): RecommendationsContextType => {
  const context = useContext(RecommendationsContext);
  if (!context) {
    throw new Error('useRecommendations must be used within a RecommendationsProvider');
  }
  return context;
};