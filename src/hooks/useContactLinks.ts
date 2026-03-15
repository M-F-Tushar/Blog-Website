import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured } from '../supabase/client';
import {
  createContactLink,
  deleteContactLink,
  subscribeToContactLinksUpdates,
  updateContactLink,
} from '../services/supabaseContactLinksService';
import { FALLBACK_CONTACT_LINKS } from '../data/fallback';
import type { ContactLink } from '../types/types';

interface ContactLinksContextType {
  links: ContactLink[];
  addLink: (link: Omit<ContactLink, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ContactLink>;
  updateLink: (id: string, link: Partial<ContactLink>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ContactLinksContext = createContext<ContactLinksContextType | undefined>(undefined);

export const ContactLinksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const useSupabase = isSupabaseConfigured();
  const [links, setLinks] = useState<ContactLink[]>(useSupabase ? [] : FALLBACK_CONTACT_LINKS);
  const [loading, setLoading] = useState(useSupabase);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!useSupabase) return;
    const unsubscribe = subscribeToContactLinksUpdates(
      (nextLinks) => {
        setLinks(nextLinks);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setLinks(FALLBACK_CONTACT_LINKS);
        setLoading(false);
        setError(err.message);
      }
    );
    return unsubscribe;
  }, [useSupabase]);

  const addLink = useCallback(async (link: Omit<ContactLink, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await createContactLink(link);
    if (!useSupabase) setLinks((prev) => [...prev, created]);
    return created;
  }, [useSupabase]);

  const updateLinkHandler = useCallback(async (id: string, link: Partial<ContactLink>) => {
    if (useSupabase) {
      await updateContactLink(id, link);
      return;
    }
    setLinks((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...link } : entry)));
  }, [useSupabase]);

  const deleteLinkHandler = useCallback(async (id: string) => {
    if (useSupabase) {
      await deleteContactLink(id);
      return;
    }
    setLinks((prev) => prev.filter((entry) => entry.id !== id));
  }, [useSupabase]);

  const value = useMemo(
    () => ({ links, addLink, updateLink: updateLinkHandler, deleteLink: deleteLinkHandler, loading, error }),
    [links, addLink, updateLinkHandler, deleteLinkHandler, loading, error]
  );

  return React.createElement(ContactLinksContext.Provider, { value }, children);
};

export const useContactLinks = () => {
  const context = useContext(ContactLinksContext);
  if (!context) throw new Error('useContactLinks must be used within ContactLinksProvider');
  return context;
};
