import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { Recommendation } from '../types/types';
import { RECOMMENDATIONS as initialRecommendationsData } from '../constants/constants';
import { isSupabaseConfigured } from '../services/supabase';
import {
  createRecommendation as createRecommendationSupabase,
  updateRecommendation as updateRecommendationSupabase,
  deleteRecommendation as deleteRecommendationSupabase,
  subscribeToRecommendationsUpdates,
} from '../services/supabaseRecommendationsService';
import { FALLBACK_RECOMMENDATIONS } from '../services/fallbackData';

interface RecommendationsContextType {
  recommendations: Recommendation[];
  addRecommendation: (recData: Omit<Recommendation, 'id'>) => Promise<Recommendation>;
  updateRecommendation: (
    recId: string,
    recData: Omit<Recommendation, 'id'>
  ) => Promise<Recommendation | undefined>;
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
};

export const RecommendationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const useSupabase = isSupabaseConfigured();
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => {
    if (!useSupabase) {
      const userRecs = getUserRecsFromStorage();
      // Use fallback recommendations if no initial recommendations
      const initialRecs =
        initialRecommendationsData.length > 0
          ? initialRecommendationsData
          : FALLBACK_RECOMMENDATIONS;
      return [...initialRecs, ...userRecs];
    }
    // If Supabase is configured, start empty and load via useEffect
    return [];
  });
  const [loading, setLoading] = useState(useSupabase); // Start as loading if using Supabase
  const [error, setError] = useState<string | null>(null);

  // Subscribe to Supabase updates if Supabase is configured
  useEffect(() => {
    if (!useSupabase) {
      // eslint-disable-next-line no-console
      console.log('Supabase not configured, using fallback recommendations data');
      return;
    }

    let mounted = true;

    const unsubscribe = subscribeToRecommendationsUpdates(
      (supabaseRecs) => {
        if (mounted) {
          setRecommendations(supabaseRecs);
          setLoading(false);
          setError(null);
        }
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.error(
          'Error loading recommendations from Supabase, falling back to local data:',
          err
        );
        if (mounted) {
          setError(err.message);
          setLoading(false);
          // On error, fall back to fallback recommendations if none loaded
          setRecommendations((prev) => (prev.length === 0 ? FALLBACK_RECOMMENDATIONS : prev));
        }
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [useSupabase]);

  const addRecommendation = useCallback(
    async (recData: Omit<Recommendation, 'id'>): Promise<Recommendation> => {
      if (useSupabase) {
        try {
          const createdRec = await createRecommendationSupabase(recData);
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
          id: `${recData.title
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-')
            .slice(0, 50)}-${Date.now()}`,
        };

        const currentUserRecs = getUserRecsFromStorage();
        const updatedUserRecs = [newRec, ...currentUserRecs];
        saveUserRecsToStorage(updatedUserRecs);

        setRecommendations((prevRecs) => [newRec, ...prevRecs]);
        return newRec;
      }
    },
    [useSupabase]
  );

  const updateRecommendation = useCallback(
    async (
      recId: string,
      recData: Omit<Recommendation, 'id'>
    ): Promise<Recommendation | undefined> => {
      if (useSupabase) {
        try {
          await updateRecommendationSupabase(recId, recData);
          // The subscription will update the state
          return recommendations.find((r) => r.id === recId);
        } catch (err) {
          console.error('Error updating recommendation:', err);
          setError(err instanceof Error ? err.message : 'Failed to update recommendation');
          throw err;
        }
      } else {
        // Fallback to localStorage
        const currentUserRecs = getUserRecsFromStorage();
        const recIndex = currentUserRecs.findIndex((r) => r.id === recId);

        if (recIndex === -1) return undefined;

        const originalRec = currentUserRecs[recIndex];
        const updatedRec: Recommendation = {
          ...originalRec,
          ...recData,
        };

        currentUserRecs[recIndex] = updatedRec;
        saveUserRecsToStorage(currentUserRecs);

        setRecommendations((prevRecs) => prevRecs.map((r) => (r.id === recId ? updatedRec : r)));
        return updatedRec;
      }
    },
    [useSupabase, recommendations]
  );

  const deleteRecommendation = useCallback(
    async (recId: string) => {
      if (useSupabase) {
        try {
          await deleteRecommendationSupabase(recId);
          // The subscription will update the state
        } catch (err) {
          console.error('Error deleting recommendation:', err);
          setError(err instanceof Error ? err.message : 'Failed to delete recommendation');
          throw err;
        }
      } else {
        // Fallback to localStorage
        const currentUserRecs = getUserRecsFromStorage();
        const updatedUserRecs = currentUserRecs.filter((r) => r.id !== recId);
        saveUserRecsToStorage(updatedUserRecs);
        setRecommendations((prevRecs) => prevRecs.filter((r) => r.id !== recId));
      }
    },
    [useSupabase]
  );

  const value = useMemo(
    () => ({
      recommendations,
      addRecommendation,
      updateRecommendation,
      deleteRecommendation,
      loading,
      error,
    }),
    [recommendations, addRecommendation, updateRecommendation, deleteRecommendation, loading, error]
  );

  return React.createElement(RecommendationsContext.Provider, { value }, children);
};

export const useRecommendations = (): RecommendationsContextType => {
  const context = useContext(RecommendationsContext);
  if (!context) {
    throw new Error('useRecommendations must be used within a RecommendationsProvider');
  }
  return context;
};
