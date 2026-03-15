import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured } from '../supabase/client';
import {
  createBookshelfEntry,
  deleteBookshelfEntry,
  subscribeToBookshelfUpdates,
  updateBookshelfEntry,
} from '../services/supabaseBookshelfService';
import { FALLBACK_BOOKSHELF } from '../data/fallback';
import type { BookshelfEntry } from '../types/types';

interface BookshelfContextType {
  entries: BookshelfEntry[];
  addEntry: (entry: Omit<BookshelfEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<BookshelfEntry>;
  updateEntry: (id: string, entry: Partial<BookshelfEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const BookshelfContext = createContext<BookshelfContextType | undefined>(undefined);

export const BookshelfProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const useSupabase = isSupabaseConfigured();
  const [entries, setEntries] = useState<BookshelfEntry[]>(useSupabase ? [] : FALLBACK_BOOKSHELF);
  const [loading, setLoading] = useState(useSupabase);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!useSupabase) return;
    const unsubscribe = subscribeToBookshelfUpdates(
      (nextEntries) => {
        setEntries(nextEntries);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setEntries(FALLBACK_BOOKSHELF);
        setLoading(false);
        setError(err.message);
      }
    );
    return unsubscribe;
  }, [useSupabase]);

  const addEntry = useCallback(async (entry: Omit<BookshelfEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await createBookshelfEntry(entry);
    if (!useSupabase) setEntries((prev) => [created, ...prev]);
    return created;
  }, [useSupabase]);

  const updateEntryHandler = useCallback(async (id: string, entry: Partial<BookshelfEntry>) => {
    if (useSupabase) {
      await updateBookshelfEntry(id, entry);
      return;
    }
    setEntries((prev) => prev.map((item) => (item.id === id ? { ...item, ...entry } : item)));
  }, [useSupabase]);

  const deleteEntryHandler = useCallback(async (id: string) => {
    if (useSupabase) {
      await deleteBookshelfEntry(id);
      return;
    }
    setEntries((prev) => prev.filter((item) => item.id !== id));
  }, [useSupabase]);

  const value = useMemo(
    () => ({
      entries,
      addEntry,
      updateEntry: updateEntryHandler,
      deleteEntry: deleteEntryHandler,
      loading,
      error,
    }),
    [entries, addEntry, updateEntryHandler, deleteEntryHandler, loading, error]
  );

  return React.createElement(BookshelfContext.Provider, { value }, children);
};

export const useBookshelf = () => {
  const context = useContext(BookshelfContext);
  if (!context) throw new Error('useBookshelf must be used within BookshelfProvider');
  return context;
};
