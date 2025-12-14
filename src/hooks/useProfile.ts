import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface ProfileContextType {
  photoUrl: string;
  updateProfilePhoto: (newUrl: string) => void;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Fetch profile photo from Supabase on mount
  useEffect(() => {
    const fetchProfile = async () => {
      console.log('🔍 Fetching profile photo from Supabase...'); // eslint-disable-line no-console
      setLoading(true);

      if (!supabase) {
        console.warn('⚠️ Supabase is not configured, using localStorage for profile photo'); // eslint-disable-line no-console
        try {
          const stored = window.localStorage.getItem('profilePhotoUrl');
          setPhotoUrl(stored || '');
        } catch (error) {
          console.error('Failed to read profile photo URL from localStorage', error); // eslint-disable-line no-console
        }
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('photo_url')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        console.log('📦 Supabase photo_url data:', data); // eslint-disable-line no-console
        console.log('❌ Supabase error:', error); // eslint-disable-line no-console

        if (data && !error) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const url = (data as Record<string, any>).photo_url || '';
          console.log('✅ Profile photo fetched successfully:', url); // eslint-disable-line no-console
          setPhotoUrl(url);
          // Also save to localStorage
          try {
            window.localStorage.setItem('profilePhotoUrl', url);
          } catch (error) {
            console.error('Failed to save profile photo URL to localStorage', error); // eslint-disable-line no-console
          }
        } else if (error) {
          console.error('❌ Error fetching profile photo:', error); // eslint-disable-line no-console
        }
      } catch (error) {
        console.error('❌ Exception fetching profile photo:', error); // eslint-disable-line no-console
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateProfilePhoto = (newUrl: string) => {
    try {
      window.localStorage.setItem('profilePhotoUrl', newUrl);
      setPhotoUrl(newUrl);
    } catch (error) {
      console.error('Failed to save profile photo URL to localStorage', error); // eslint-disable-line no-console
    }
  };

  const value = useMemo(() => ({ photoUrl, updateProfilePhoto, loading }), [photoUrl, loading]);

  return React.createElement(ProfileContext.Provider, { value }, children);
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
