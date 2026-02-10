import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { isSupabaseConfigured } from '../services/supabase';
import {
  type CustomPage,
  type CustomPageSection,
  createCustomPage as createPageService,
  updateCustomPage as updatePageService,
  deleteCustomPage as deletePageService,
  getCustomPageSections,
  createCustomPageSection as createSectionService,
  updateCustomPageSection as updateSectionService,
  deleteCustomPageSection as deleteSectionService,
  subscribeToCustomPagesUpdates,
} from '../services/supabaseCustomPagesService';

export type { CustomPage, CustomPageSection };

interface CustomPagesContextType {
  pages: CustomPage[];
  loading: boolean;
  error: string | null;
  createPage: (page: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>) => Promise<CustomPage>;
  updatePage: (
    id: string,
    page: Partial<Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>>
  ) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  getSections: (pageId: string) => Promise<CustomPageSection[]>;
  createSection: (
    section: Omit<CustomPageSection, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<CustomPageSection>;
  updateSection: (
    id: string,
    section: Partial<Omit<CustomPageSection, 'id' | 'createdAt' | 'updatedAt'>>
  ) => Promise<void>;
  deleteSection: (id: string) => Promise<void>;
}

const CustomPagesContext = createContext<CustomPagesContextType | undefined>(undefined);

const getCustomPagesFromStorage = (): CustomPage[] => {
  try {
    const saved = window.localStorage.getItem('customPages');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCustomPagesToStorage = (pages: CustomPage[]) => {
  try {
    window.localStorage.setItem('customPages', JSON.stringify(pages));
  } catch {
    // ignore
  }
};

const getCustomPageSectionsFromStorage = (pageId: string): CustomPageSection[] => {
  try {
    const saved = window.localStorage.getItem(`customPageSections_${pageId}`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCustomPageSectionsToStorage = (pageId: string, sections: CustomPageSection[]) => {
  try {
    window.localStorage.setItem(`customPageSections_${pageId}`, JSON.stringify(sections));
  } catch {
    // ignore
  }
};

export const CustomPagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const useSupabase = isSupabaseConfigured();
  const [pages, setPages] = useState<CustomPage[]>(() =>
    useSupabase ? [] : getCustomPagesFromStorage()
  );
  const [loading, setLoading] = useState(useSupabase);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!useSupabase) return;

    let mounted = true;

    const unsubscribe = subscribeToCustomPagesUpdates(
      (fetchedPages) => {
        if (mounted) {
          setPages(fetchedPages);
          setLoading(false);
          setError(null);
        }
      },
      (err) => {
        console.error('Error loading custom pages:', err);
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [useSupabase]);

  const createPage = useCallback(
    async (pageData: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomPage> => {
      if (useSupabase) {
        const created = await createPageService(pageData);
        return created;
      }
      const newPage: CustomPage = {
        ...pageData,
        id: `page-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [...pages, newPage];
      saveCustomPagesToStorage(updated);
      setPages(updated);
      return newPage;
    },
    [useSupabase, pages]
  );

  const updatePage = useCallback(
    async (
      id: string,
      pageData: Partial<Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>>
    ): Promise<void> => {
      if (useSupabase) {
        await updatePageService(id, pageData);
        return;
      }
      const updated = pages.map((p) =>
        p.id === id ? { ...p, ...pageData, updatedAt: new Date().toISOString() } : p
      );
      saveCustomPagesToStorage(updated);
      setPages(updated);
    },
    [useSupabase, pages]
  );

  const deletePage = useCallback(
    async (id: string): Promise<void> => {
      if (useSupabase) {
        await deletePageService(id);
        return;
      }
      const updated = pages.filter((p) => p.id !== id);
      saveCustomPagesToStorage(updated);
      setPages(updated);
    },
    [useSupabase, pages]
  );

  const getSections = useCallback(
    async (pageId: string): Promise<CustomPageSection[]> => {
      if (useSupabase) {
        return getCustomPageSections(pageId);
      }
      return getCustomPageSectionsFromStorage(pageId);
    },
    [useSupabase]
  );

  const createSection = useCallback(
    async (
      sectionData: Omit<CustomPageSection, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<CustomPageSection> => {
      if (useSupabase) {
        return createSectionService(sectionData);
      }
      const newSection: CustomPageSection = {
        ...sectionData,
        id: `section-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const existing = getCustomPageSectionsFromStorage(sectionData.pageId);
      const updated = [...existing, newSection];
      saveCustomPageSectionsToStorage(sectionData.pageId, updated);
      return newSection;
    },
    [useSupabase]
  );

  const updateSection = useCallback(
    async (
      id: string,
      sectionData: Partial<Omit<CustomPageSection, 'id' | 'createdAt' | 'updatedAt'>>
    ): Promise<void> => {
      if (useSupabase) {
        await updateSectionService(id, sectionData);
        return;
      }
      // For localStorage, we need to find which page it belongs to
      // This is a simplified fallback
    },
    [useSupabase]
  );

  const deleteSection = useCallback(
    async (id: string): Promise<void> => {
      if (useSupabase) {
        await deleteSectionService(id);
        return;
      }
    },
    [useSupabase]
  );

  const value = useMemo(
    () => ({
      pages,
      loading,
      error,
      createPage,
      updatePage,
      deletePage,
      getSections,
      createSection,
      updateSection,
      deleteSection,
    }),
    [
      pages,
      loading,
      error,
      createPage,
      updatePage,
      deletePage,
      getSections,
      createSection,
      updateSection,
      deleteSection,
    ]
  );

  return React.createElement(CustomPagesContext.Provider, { value }, children);
};

export const useCustomPages = (): CustomPagesContextType => {
  const context = useContext(CustomPagesContext);
  if (!context) {
    throw new Error('useCustomPages must be used within a CustomPagesProvider');
  }
  return context;
};
