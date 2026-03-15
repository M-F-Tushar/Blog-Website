import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured } from '../supabase/client';
import {
  createPageSection,
  deletePageSection,
  subscribeToPageSectionsUpdates,
  updatePageSection,
} from '../services/supabasePageSectionsService';
import { FALLBACK_PAGE_SECTIONS } from '../data/fallback';
import type { PageSectionRecord } from '../types/types';

interface PageSectionsContextType {
  sections: PageSectionRecord[];
  addSection: (
    section: Omit<PageSectionRecord, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<PageSectionRecord>;
  updateSection: (id: string, section: Partial<PageSectionRecord>) => Promise<void>;
  deleteSection: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const PageSectionsContext = createContext<PageSectionsContextType | undefined>(undefined);

export const PageSectionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const useSupabase = isSupabaseConfigured();
  const [sections, setSections] = useState<PageSectionRecord[]>(useSupabase ? [] : FALLBACK_PAGE_SECTIONS);
  const [loading, setLoading] = useState(useSupabase);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!useSupabase) return;
    const unsubscribe = subscribeToPageSectionsUpdates(
      (nextSections) => {
        setSections(nextSections);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setSections(FALLBACK_PAGE_SECTIONS);
        setLoading(false);
        setError(err.message);
      }
    );
    return unsubscribe;
  }, [useSupabase]);

  const addSection = useCallback(async (section: Omit<PageSectionRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await createPageSection(section);
    if (!useSupabase) setSections((prev) => [...prev, created]);
    return created;
  }, [useSupabase]);

  const updateSectionHandler = useCallback(async (id: string, section: Partial<PageSectionRecord>) => {
    if (useSupabase) {
      await updatePageSection(id, section);
      return;
    }
    setSections((prev) => prev.map((item) => (item.id === id ? { ...item, ...section } : item)));
  }, [useSupabase]);

  const deleteSectionHandler = useCallback(async (id: string) => {
    if (useSupabase) {
      await deletePageSection(id);
      return;
    }
    setSections((prev) => prev.filter((item) => item.id !== id));
  }, [useSupabase]);

  const value = useMemo(
    () => ({
      sections,
      addSection,
      updateSection: updateSectionHandler,
      deleteSection: deleteSectionHandler,
      loading,
      error,
    }),
    [sections, addSection, updateSectionHandler, deleteSectionHandler, loading, error]
  );

  return React.createElement(PageSectionsContext.Provider, { value }, children);
};

export const usePageSections = () => {
  const context = useContext(PageSectionsContext);
  if (!context) throw new Error('usePageSections must be used within PageSectionsProvider');
  return context;
};
