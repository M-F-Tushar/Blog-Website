import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
}

interface SiteSettings {
  siteName: string;
  authorName: string;
  authorTagline: string;
  authorBio: string;
  siteDescription: string;
  socialLinks: SocialLinks;
  categories: string[];
}

interface SiteSettingsContextType extends SiteSettings {
  updateSettings: (newSettings: Partial<Omit<SiteSettings, 'categories'>>) => Promise<void>;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const getSettingsFromStorage = (): SiteSettings => {
  const defaults: SiteSettings = {
    siteName: '',
    authorName: '',
    authorTagline: '',
    authorBio: '',
    siteDescription: '',
    socialLinks: {
      github: '',
      linkedin: '',
      email: '',
    },
    categories: ['Life', 'Technology', 'Reflections'],
  };
  try {
    const savedSettings = window.localStorage.getItem('siteSettings');
    return savedSettings ? { ...defaults, ...JSON.parse(savedSettings) } : defaults;
  } catch (error) {
    console.error('Error reading site settings from localStorage', error);
    return defaults;
  }
};

const saveSettingsToStorage = (settings: SiteSettings) => {
  try {
    window.localStorage.setItem('siteSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving site settings to localStorage', error);
  }
};

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(getSettingsFromStorage);
  const [loading, setLoading] = useState(true);

  // Fetch settings from Supabase on mount
  useEffect(() => {
    const fetchSettings = async () => {
      console.log('🔍 Fetching site settings from Supabase...');
      setLoading(true);
      
      if (!supabase) {
        console.warn('⚠️ Supabase is not configured, using localStorage settings');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        console.log('📦 Supabase site_settings data:', data);
        console.log('❌ Supabase error:', error);

        if (data && !error) {
          const fetchedSettings: SiteSettings = {
            siteName: data.site_name || '',
            siteDescription: data.site_description || '',
            authorName: data.author_name || '',
            authorTagline: data.author_tagline || '',
            authorBio: data.author_bio || '',
            socialLinks: {
              github: data.social_github || '',
              linkedin: data.social_linkedin || '',
              email: data.social_email || '',
            },
            categories: settings.categories, // Keep categories from localStorage for now
          };
          console.log('✅ Settings fetched successfully:', fetchedSettings);
          setSettings(fetchedSettings);
          // Also save to localStorage for admin panel updates
          saveSettingsToStorage(fetchedSettings);
        } else if (error) {
          console.error('❌ Error fetching site settings:', error);
        }
      } catch (error) {
        console.error('❌ Exception fetching site settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<Omit<SiteSettings, 'categories'>>) => {
    console.log('💾 Updating site settings...', newSettings);
    
    if (!supabase) {
      console.warn('⚠️ Supabase is not configured, only saving to localStorage');
      setSettings(prev => {
        const updated = { ...prev, ...newSettings };
        saveSettingsToStorage(updated);
        return updated;
      });
      return;
    }

    try {
      // First, get the current site_settings row ID
      const { data: existingSettings, error: fetchError } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" error
        console.error('❌ Error fetching site settings ID:', fetchError);
        throw fetchError;
      }

      // Prepare the update data with snake_case field names
      const updateData: Record<string, any> = {};
      
      if (newSettings.siteName !== undefined) updateData.site_name = newSettings.siteName;
      if (newSettings.siteDescription !== undefined) updateData.site_description = newSettings.siteDescription;
      if (newSettings.authorName !== undefined) updateData.author_name = newSettings.authorName;
      if (newSettings.authorTagline !== undefined) updateData.author_tagline = newSettings.authorTagline;
      if (newSettings.authorBio !== undefined) updateData.author_bio = newSettings.authorBio;
      
      if (newSettings.socialLinks) {
        if (newSettings.socialLinks.github !== undefined) updateData.social_github = newSettings.socialLinks.github;
        if (newSettings.socialLinks.linkedin !== undefined) updateData.social_linkedin = newSettings.socialLinks.linkedin;
        if (newSettings.socialLinks.email !== undefined) updateData.social_email = newSettings.socialLinks.email;
      }

      console.log('📤 Sending update to Supabase:', updateData);

      if (existingSettings?.id) {
        // Update existing row
        const { error: updateError } = await supabase
          .from('site_settings')
          .update(updateData)
          .eq('id', existingSettings.id);

        if (updateError) {
          console.error('❌ Error updating site settings:', updateError);
          throw updateError;
        }

        console.log('✅ Site settings updated successfully in Supabase');
      } else {
        // Insert new row if none exists
        const { error: insertError } = await supabase
          .from('site_settings')
          .insert(updateData);

        if (insertError) {
          console.error('❌ Error inserting site settings:', insertError);
          throw insertError;
        }

        console.log('✅ Site settings inserted successfully in Supabase');
      }

      // After successful Supabase update, update local state and localStorage
      setSettings(prev => {
        const updated = { ...prev, ...newSettings };
        saveSettingsToStorage(updated);
        return updated;
      });

    } catch (error) {
      console.error('❌ Exception updating site settings:', error);
      // Still update localStorage even if Supabase fails
      setSettings(prev => {
        const updated = { ...prev, ...newSettings };
        saveSettingsToStorage(updated);
        return updated;
      });
      throw error; // Re-throw so the UI can handle the error
    }
  }, []);

  const addCategory = useCallback((category: string) => {
    if (!category.trim() || settings.categories.includes(category.trim())) return;
    setSettings(prev => {
        const updated = { ...prev, categories: [...prev.categories, category.trim()] };
        saveSettingsToStorage(updated);
        return updated;
    });
  }, [settings.categories]);

  const deleteCategory = useCallback((categoryToDelete: string) => {
    setSettings(prev => {
        const updated = { ...prev, categories: prev.categories.filter(c => c !== categoryToDelete) };
        saveSettingsToStorage(updated);
        return updated;
    });
  }, []);
  
  const value = useMemo(() => ({ ...settings, updateSettings, addCategory, deleteCategory, loading }), [settings, updateSettings, addCategory, deleteCategory, loading]);

  return React.createElement(SiteSettingsContext.Provider, { value }, children);
};

export const useSiteSettings = (): SiteSettingsContextType => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
