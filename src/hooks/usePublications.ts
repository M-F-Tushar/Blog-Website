import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { isSupabaseConfigured } from '../services/supabase';
import {
  createPublication as createPublicationSupabase,
  updatePublication as updatePublicationSupabase,
  deletePublication as deletePublicationSupabase,
  subscribeToPublicationsUpdates,
} from '../services/supabasePublicationsService';
import { FALLBACK_PUBLICATIONS } from '../services/fallbackData';

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: 'journal' | 'conference' | 'preprint' | 'thesis' | 'book_chapter';
  abstract?: string;
  doi?: string;
  arxiv_url?: string;
  pdf_url?: string;
  code_url?: string;
  slides_url?: string;
  bibtex?: string;
  featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

interface PublicationsContextType {
  publications: Publication[];
  addPublication: (
    pubData: Omit<Publication, 'id' | 'created_at' | 'updated_at'>
  ) => Promise<Publication>;
  updatePublication: (
    pubId: string,
    pubData: Partial<Omit<Publication, 'id' | 'created_at' | 'updated_at'>>
  ) => Promise<Publication | undefined>;
  deletePublication: (pubId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const PublicationsContext = createContext<PublicationsContextType | undefined>(undefined);

const getUserPublicationsFromStorage = (): Publication[] => {
  try {
    const savedUserPublications = window.localStorage.getItem('userPublications');
    return savedUserPublications ? JSON.parse(savedUserPublications) : [];
  } catch (error) {
    console.error('Error reading publications from localStorage', error);
    return [];
  }
};

const saveUserPublicationsToStorage = (publications: Publication[]) => {
  try {
    window.localStorage.setItem('userPublications', JSON.stringify(publications));
  } catch (error) {
    console.error('Error saving publications to localStorage', error);
  }
};

export const PublicationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const useSupabase = isSupabaseConfigured();
  const [publications, setPublications] = useState<Publication[]>(() => {
    if (!useSupabase) {
      const userPublications = getUserPublicationsFromStorage();
      const initialPublications = FALLBACK_PUBLICATIONS || [];
      return [...initialPublications, ...userPublications];
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
      console.log('Supabase not configured, using fallback publications data');
      return;
    }

    let mounted = true;

    const unsubscribe = subscribeToPublicationsUpdates(
      (supabasePublications) => {
        if (mounted) {
          setPublications(supabasePublications);
          setLoading(false);
          setError(null);
        }
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.error('Error loading publications from Supabase, falling back to local data:', err);
        if (mounted) {
          setError(err.message);
          setLoading(false);
          // On error, fall back to fallback publications if none loaded
          setPublications((prev) => (prev.length === 0 ? FALLBACK_PUBLICATIONS : prev));
        }
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [useSupabase]);

  const addPublication = useCallback(
    async (
      pubData: Omit<Publication, 'id' | 'created_at' | 'updated_at'>
    ): Promise<Publication> => {
      if (useSupabase) {
        try {
          const createdPublication = await createPublicationSupabase(pubData);
          // The subscription will update the state
          return createdPublication;
        } catch (err) {
          console.error('Error creating publication:', err);
          setError(err instanceof Error ? err.message : 'Failed to create publication');
          throw err;
        }
      } else {
        // Fallback to localStorage
        const newPublication: Publication = {
          ...pubData,
          id: `${pubData.title
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-')
            .slice(0, 50)}-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const currentUserPublications = getUserPublicationsFromStorage();
        const updatedUserPublications = [newPublication, ...currentUserPublications];
        saveUserPublicationsToStorage(updatedUserPublications);

        setPublications((prevPublications) => [newPublication, ...prevPublications]);
        return newPublication;
      }
    },
    [useSupabase]
  );

  const updatePublication = useCallback(
    async (
      pubId: string,
      pubData: Partial<Omit<Publication, 'id' | 'created_at' | 'updated_at'>>
    ): Promise<Publication | undefined> => {
      if (useSupabase) {
        try {
          await updatePublicationSupabase(pubId, pubData);
          // The subscription will update the state
          return publications.find((p) => p.id === pubId);
        } catch (err) {
          console.error('Error updating publication:', err);
          setError(err instanceof Error ? err.message : 'Failed to update publication');
          throw err;
        }
      } else {
        // Fallback to localStorage
        const currentUserPublications = getUserPublicationsFromStorage();
        const pubIndex = currentUserPublications.findIndex((p) => p.id === pubId);

        if (pubIndex === -1) return undefined;

        const originalPublication = currentUserPublications[pubIndex];
        const updatedPublication: Publication = {
          ...originalPublication,
          ...pubData,
          updated_at: new Date().toISOString(),
        };

        currentUserPublications[pubIndex] = updatedPublication;
        saveUserPublicationsToStorage(currentUserPublications);

        setPublications((prevPublications) =>
          prevPublications.map((p) => (p.id === pubId ? updatedPublication : p))
        );
        return updatedPublication;
      }
    },
    [useSupabase, publications]
  );

  const deletePublication = useCallback(
    async (pubId: string) => {
      if (useSupabase) {
        try {
          await deletePublicationSupabase(pubId);
          // The subscription will update the state
        } catch (err) {
          console.error('Error deleting publication:', err);
          setError(err instanceof Error ? err.message : 'Failed to delete publication');
          throw err;
        }
      } else {
        // Fallback to localStorage
        const currentUserPublications = getUserPublicationsFromStorage();
        const updatedUserPublications = currentUserPublications.filter((p) => p.id !== pubId);
        saveUserPublicationsToStorage(updatedUserPublications);
        setPublications((prevPublications) => prevPublications.filter((p) => p.id !== pubId));
      }
    },
    [useSupabase]
  );

  const value = useMemo(
    () => ({
      publications,
      addPublication,
      updatePublication,
      deletePublication,
      loading,
      error,
    }),
    [publications, addPublication, updatePublication, deletePublication, loading, error]
  );

  return React.createElement(PublicationsContext.Provider, { value }, children);
};

export const usePublications = (): PublicationsContextType => {
  const context = useContext(PublicationsContext);
  if (!context) {
    throw new Error('usePublications must be used within a PublicationsProvider');
  }
  return context;
};
