import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Recommendation } from '../types';
import { RECOMMENDATIONS as initialRecommendationsData } from '../constants';

interface RecommendationsContextType {
  recommendations: Recommendation[];
  addRecommendation: (recData: Omit<Recommendation, 'id'>) => Recommendation;
  updateRecommendation: (recId: string, recData: Omit<Recommendation, 'id'>) => Recommendation | undefined;
  deleteRecommendation: (recId: string) => void;
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
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => {
    const userRecs = getUserRecsFromStorage();
    return [...initialRecommendationsData, ...userRecs];
  });

  const addRecommendation = useCallback((recData: Omit<Recommendation, 'id'>): Recommendation => {
    const newRec: Recommendation = {
      ...recData,
      id: `${recData.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').slice(0, 50)}-${Date.now()}`,
    };

    const currentUserRecs = getUserRecsFromStorage();
    const updatedUserRecs = [newRec, ...currentUserRecs];
    saveUserRecsToStorage(updatedUserRecs);
    
    setRecommendations(prevRecs => [newRec, ...prevRecs]);
    return newRec;
  }, []);

  const updateRecommendation = useCallback((recId: string, recData: Omit<Recommendation, 'id'>): Recommendation | undefined => {
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
  }, []);
  
  const deleteRecommendation = useCallback((recId: string) => {
    const currentUserRecs = getUserRecsFromStorage();
    const updatedUserRecs = currentUserRecs.filter(r => r.id !== recId);
    saveUserRecsToStorage(updatedUserRecs);
    setRecommendations(prevRecs => prevRecs.filter(r => r.id !== recId));
  }, []);
  
  const value = useMemo(() => ({
      recommendations, addRecommendation, updateRecommendation, deleteRecommendation
  }), [recommendations, addRecommendation, updateRecommendation, deleteRecommendation]);

  return React.createElement(RecommendationsContext.Provider, { value }, children);
};

export const useRecommendations = (): RecommendationsContextType => {
  const context = useContext(RecommendationsContext);
  if (!context) {
    throw new Error('useRecommendations must be used within a RecommendationsProvider');
  }
  return context;
};