import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured } from '../supabase/client';
import {
  createNavigationItem,
  deleteNavigationItem,
  subscribeToNavigationUpdates,
  updateNavigationItem,
} from '../services/supabaseNavigationService';
import { FALLBACK_NAVIGATION_ITEMS } from '../data/fallback';
import type { NavigationItem } from '../types/types';

interface NavigationItemsContextType {
  items: NavigationItem[];
  addItem: (item: Omit<NavigationItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<NavigationItem>;
  updateItem: (id: string, item: Partial<NavigationItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const NavigationItemsContext = createContext<NavigationItemsContextType | undefined>(undefined);

export const NavigationItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const useSupabase = isSupabaseConfigured();
  const [items, setItems] = useState<NavigationItem[]>(useSupabase ? [] : FALLBACK_NAVIGATION_ITEMS);
  const [loading, setLoading] = useState(useSupabase);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!useSupabase) return;
    const unsubscribe = subscribeToNavigationUpdates(
      (nextItems) => {
        setItems(nextItems);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setItems(FALLBACK_NAVIGATION_ITEMS);
        setLoading(false);
        setError(err.message);
      }
    );
    return unsubscribe;
  }, [useSupabase]);

  const addItem = useCallback(async (item: Omit<NavigationItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await createNavigationItem(item);
    if (!useSupabase) setItems((prev) => [...prev, created]);
    return created;
  }, [useSupabase]);

  const updateItemHandler = useCallback(async (id: string, item: Partial<NavigationItem>) => {
    if (useSupabase) {
      await updateNavigationItem(id, item);
      return;
    }
    setItems((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...item } : entry)));
  }, [useSupabase]);

  const deleteItemHandler = useCallback(async (id: string) => {
    if (useSupabase) {
      await deleteNavigationItem(id);
      return;
    }
    setItems((prev) => prev.filter((entry) => entry.id !== id));
  }, [useSupabase]);

  const value = useMemo(
    () => ({ items, addItem, updateItem: updateItemHandler, deleteItem: deleteItemHandler, loading, error }),
    [items, addItem, updateItemHandler, deleteItemHandler, loading, error]
  );

  return React.createElement(NavigationItemsContext.Provider, { value }, children);
};

export const useNavigationItems = () => {
  const context = useContext(NavigationItemsContext);
  if (!context) throw new Error('useNavigationItems must be used within NavigationItemsProvider');
  return context;
};
