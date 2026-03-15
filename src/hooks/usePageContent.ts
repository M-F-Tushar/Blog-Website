import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { isSupabaseConfigured } from '../supabase/client';
import {
  upsertPageSection as upsertSectionSupabase,
  deletePageSection as deleteSectionSupabase,
  subscribeToPageContentUpdates,
} from '../services/supabasePageContentService';
import { FALLBACK_PAGE_CONTENT } from '../data/fallback';
import type { Json } from '../types/database';

export interface PageSection {
  id: string;
  page: string;
  section_key: string;
  title?: string;
  subtitle?: string;
  content?: string;
  image_url?: string;
  metadata?: Record<string, unknown>;
  sort_order: number;
  visible: boolean;
  created_at?: string;
  updated_at?: string;
}

// Map DB format (page_name, is_initial) to PageSection format (page, visible)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDbToSection = (db: any): PageSection => ({
  id: db.id,
  page: db.page_name || db.page,
  section_key: db.section_key,
  title: db.title || undefined,
  subtitle: db.subtitle || undefined,
  content: db.content || undefined,
  image_url: db.image_url || undefined,
  metadata: db.metadata || undefined,
  sort_order: db.sort_order ?? 0,
  visible: db.visible !== undefined ? db.visible : true,
  created_at: db.created_at,
  updated_at: db.updated_at,
});

const toJsonValue = (value: unknown): Json => {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => toJsonValue(item));
  }

  if (typeof value === 'object') {
    const result: { [key: string]: Json | undefined } = {};

    for (const [key, entry] of Object.entries(value)) {
      if (entry !== undefined) {
        result[key] = toJsonValue(entry);
      }
    }

    return result;
  }

  return String(value);
};

// Map PageSection format back to DB format for Supabase upsert
const mapSectionToDb = (section: Omit<PageSection, 'id' | 'created_at' | 'updated_at'>) => ({
  page_name: section.page,
  section_key: section.section_key,
  title: section.title || null,
  content: section.content || null,
  metadata: section.metadata ? toJsonValue(section.metadata) : null,
  sort_order: section.sort_order,
  is_initial: false,
});

const DEFAULT_SECTIONS: PageSection[] = FALLBACK_PAGE_CONTENT.map(mapDbToSection);

interface PageContentContextType {
  sections: PageSection[];
  getSection: (page: string, sectionKey: string) => PageSection | undefined;
  upsertSection: (
    sectionData: Omit<PageSection, 'id' | 'created_at' | 'updated_at'>
  ) => Promise<PageSection>;
  deleteSection: (sectionId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const PageContentContext = createContext<PageContentContextType | undefined>(undefined);

const getPageContentFromStorage = (): PageSection[] => {
  try {
    const saved = window.localStorage.getItem('userPageContent');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error reading page content from localStorage', error);
    return [];
  }
};

const savePageContentToStorage = (sections: PageSection[]) => {
  try {
    window.localStorage.setItem('userPageContent', JSON.stringify(sections));
  } catch (error) {
    console.error('Error saving page content to localStorage', error);
  }
};

export const PageContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const useSupabase = isSupabaseConfigured();
  const [sections, setSections] = useState<PageSection[]>(() => {
    if (!useSupabase) {
      const userSections = getPageContentFromStorage();
      // Merge: user sections override default sections with same page+section_key
      const mergedSections = [...DEFAULT_SECTIONS];
      for (const userSection of userSections) {
        const existingIndex = mergedSections.findIndex(
          (s) => s.page === userSection.page && s.section_key === userSection.section_key
        );
        if (existingIndex !== -1) {
          mergedSections[existingIndex] = userSection;
        } else {
          mergedSections.push(userSection);
        }
      }
      return mergedSections;
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
      console.log('Supabase not configured, using fallback page content data');
      return;
    }

    let mounted = true;

    const unsubscribe = subscribeToPageContentUpdates(
      (supabaseSections) => {
        if (mounted) {
          const mapped = supabaseSections.map(mapDbToSection);
          setSections(mapped.length > 0 ? mapped : DEFAULT_SECTIONS);
          setLoading(false);
          setError(null);
        }
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.error('Error loading page content from Supabase, falling back to local data:', err);
        if (mounted) {
          setError(err.message);
          setLoading(false);
          // On error, fall back to default sections if none loaded
          setSections((prev) => (prev.length === 0 ? DEFAULT_SECTIONS : prev));
        }
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [useSupabase]);

  const getSection = useCallback(
    (page: string, sectionKey: string): PageSection | undefined => {
      return sections.find((s) => s.page === page && s.section_key === sectionKey);
    },
    [sections]
  );

  const upsertSection = useCallback(
    async (
      sectionData: Omit<PageSection, 'id' | 'created_at' | 'updated_at'>
    ): Promise<PageSection> => {
      if (useSupabase) {
        try {
          const dbData = mapSectionToDb(sectionData);
          const upserted = await upsertSectionSupabase(dbData);
          // The subscription will update the state
          return mapDbToSection(upserted);
        } catch (err) {
          console.error('Error upserting page section:', err);
          setError(err instanceof Error ? err.message : 'Failed to upsert page section');
          throw err;
        }
      } else {
        // Fallback to localStorage
        const currentSections = getPageContentFromStorage();
        const existingIndex = currentSections.findIndex(
          (s) => s.page === sectionData.page && s.section_key === sectionData.section_key
        );

        let resultSection: PageSection;

        if (existingIndex !== -1) {
          // Update existing section
          resultSection = {
            ...currentSections[existingIndex],
            ...sectionData,
            updated_at: new Date().toISOString(),
          };
          currentSections[existingIndex] = resultSection;
        } else {
          // Insert new section
          resultSection = {
            ...sectionData,
            id: `section-${sectionData.page}-${sectionData.section_key}-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          currentSections.push(resultSection);
        }

        savePageContentToStorage(currentSections);

        setSections((prevSections) => {
          const prevIndex = prevSections.findIndex(
            (s) => s.page === sectionData.page && s.section_key === sectionData.section_key
          );
          if (prevIndex !== -1) {
            return prevSections.map((s, i) => (i === prevIndex ? resultSection : s));
          }
          return [...prevSections, resultSection];
        });

        return resultSection;
      }
    },
    [useSupabase]
  );

  const deleteSection = useCallback(
    async (sectionId: string) => {
      if (useSupabase) {
        try {
          await deleteSectionSupabase(sectionId);
          // The subscription will update the state
        } catch (err) {
          console.error('Error deleting page section:', err);
          setError(err instanceof Error ? err.message : 'Failed to delete page section');
          throw err;
        }
      } else {
        // Fallback to localStorage
        const currentSections = getPageContentFromStorage();
        const updatedSections = currentSections.filter((s) => s.id !== sectionId);
        savePageContentToStorage(updatedSections);
        setSections((prevSections) => prevSections.filter((s) => s.id !== sectionId));
      }
    },
    [useSupabase]
  );

  const value = useMemo(
    () => ({
      sections,
      getSection,
      upsertSection,
      deleteSection,
      loading,
      error,
    }),
    [sections, getSection, upsertSection, deleteSection, loading, error]
  );

  return React.createElement(PageContentContext.Provider, { value }, children);
};

export const usePageContent = (): PageContentContextType => {
  const context = useContext(PageContentContext);
  if (!context) {
    throw new Error('usePageContent must be used within a PageContentProvider');
  }
  return context;
};
