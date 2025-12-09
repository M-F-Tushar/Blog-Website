import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { FALLBACK_SETTINGS } from '../services/fallbackData';

interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
}

export interface Skill {
  name: string;
  level: number; // 1-5
  iconName: string; // Store icon name as string
}

export interface TimelineItem {
  year: string;
  title: string;
  organization: string;
  description: string;
  type: 'work' | 'education';
}

export interface Achievement {
  title: string;
  issuer: string;
  year: string;
}

interface SiteSettings {
  siteName: string;
  authorName: string;
  authorTagline: string;
  authorBio: string;
  siteDescription: string;
  socialLinks: SocialLinks;
  categories: string[];
  skills: Skill[];
  timeline: TimelineItem[];
  achievements: Achievement[];
}

interface SiteSettingsContextType extends SiteSettings {
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const getSettingsFromStorage = (): SiteSettings => {
  const defaults: SiteSettings = {
    siteName: FALLBACK_SETTINGS.site_name,
    authorName: FALLBACK_SETTINGS.author_name,
    authorTagline: FALLBACK_SETTINGS.author_tagline,
    authorBio: FALLBACK_SETTINGS.author_bio,
    siteDescription: FALLBACK_SETTINGS.site_description,
    socialLinks: {
      github: FALLBACK_SETTINGS.social_github,
      linkedin: FALLBACK_SETTINGS.social_linkedin,
      email: FALLBACK_SETTINGS.social_email,
    },
    categories: FALLBACK_SETTINGS.categories,
    skills: FALLBACK_SETTINGS.skills,
    timeline: FALLBACK_SETTINGS.timeline,
    achievements: FALLBACK_SETTINGS.achievements,
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
      /* eslint-disable no-console */
      console.log('🔍 Fetching site settings from Supabase...');
      setLoading(true);

      if (!isSupabaseConfigured() || !supabase) {
        console.warn('⚠️ Supabase is not configured, using fallback/localStorage settings');
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

        if (data && !error) {
          const settingsData = data as Record<string, any>;
          const fetchedSettings: SiteSettings = {
            siteName: settingsData.site_name || FALLBACK_SETTINGS.site_name,
            siteDescription: settingsData.site_description || FALLBACK_SETTINGS.site_description,
            authorName: settingsData.author_name || FALLBACK_SETTINGS.author_name,
            authorTagline: settingsData.author_tagline || FALLBACK_SETTINGS.author_tagline,
            authorBio: settingsData.author_bio || FALLBACK_SETTINGS.author_bio,
            socialLinks: {
              github: settingsData.social_github || FALLBACK_SETTINGS.social_github,
              linkedin: settingsData.social_linkedin || FALLBACK_SETTINGS.social_linkedin,
              email: settingsData.social_email || FALLBACK_SETTINGS.social_email,
            },
            categories: settingsData.categories || FALLBACK_SETTINGS.categories,
            skills: settingsData.skills || FALLBACK_SETTINGS.skills,
            timeline: settingsData.timeline || FALLBACK_SETTINGS.timeline,
            achievements: settingsData.achievements || FALLBACK_SETTINGS.achievements,
          };
          console.log('✅ Settings fetched successfully:', fetchedSettings);
          setSettings(fetchedSettings);
          saveSettingsToStorage(fetchedSettings);
        } else if (error) {
          console.error('❌ Error fetching site settings:', error);
          console.log('Using fallback settings due to error');
        }
      } catch (error) {
        console.error('❌ Exception fetching site settings:', error);
        console.log('Using fallback settings due to exception');
      } finally {
        setLoading(false);
      }
      /* eslint-enable no-console */
    };

    fetchSettings();
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    /* eslint-disable no-console */
    console.log('💾 Updating site settings...', newSettings);

    if (!supabase) {
      console.warn('⚠️ Supabase is not configured, only saving to localStorage');
      setSettings((prev) => {
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
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Error fetching site settings ID:', fetchError);
        throw fetchError;
      }

      // Prepare the update data with snake_case field names
      const updateData: Record<
        string,
        string | string[] | Skill[] | TimelineItem[] | Achievement[]
      > = {};

      if (newSettings.siteName !== undefined) updateData.site_name = newSettings.siteName;
      if (newSettings.siteDescription !== undefined)
        updateData.site_description = newSettings.siteDescription;
      if (newSettings.authorName !== undefined) updateData.author_name = newSettings.authorName;
      if (newSettings.authorTagline !== undefined)
        updateData.author_tagline = newSettings.authorTagline;
      if (newSettings.authorBio !== undefined) updateData.author_bio = newSettings.authorBio;

      if (newSettings.socialLinks) {
        if (newSettings.socialLinks.github !== undefined)
          updateData.social_github = newSettings.socialLinks.github;
        if (newSettings.socialLinks.linkedin !== undefined)
          updateData.social_linkedin = newSettings.socialLinks.linkedin;
        if (newSettings.socialLinks.email !== undefined)
          updateData.social_email = newSettings.socialLinks.email;
      }

      if (newSettings.categories !== undefined) updateData.categories = newSettings.categories;
      if (newSettings.skills !== undefined) updateData.skills = newSettings.skills;
      if (newSettings.timeline !== undefined) updateData.timeline = newSettings.timeline;
      if (newSettings.achievements !== undefined)
        updateData.achievements = newSettings.achievements;

      console.log('📤 Sending update to Supabase:', updateData);

      if (existingSettings) {
        const settingsId = (existingSettings as Record<string, any>).id;
        // Update existing row
        const { error: updateError } = await supabase
          .from('site_settings')
          // @ts-expect-error - Supabase type inference issue
          .update(updateData)
          .eq('id', settingsId);

        if (updateError) {
          console.error('❌ Error updating site settings:', updateError);
          throw updateError;
        }

        console.log('✅ Site settings updated successfully in Supabase');
      } else {
        // Insert new row if none exists
        // @ts-expect-error - Supabase type inference issue
        const { error: insertError } = await supabase.from('site_settings').insert(updateData);

        if (insertError) {
          console.error('❌ Error inserting site settings:', insertError);
          throw insertError;
        }

        console.log('✅ Site settings inserted successfully in Supabase');
      }

      // After successful Supabase update, update local state and localStorage
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        saveSettingsToStorage(updated);
        return updated;
      });
    } catch (error) {
      console.error('❌ Exception updating site settings:', error);
      // Still update localStorage even if Supabase fails
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        saveSettingsToStorage(updated);
        return updated;
      });
      throw error;
    }
    /* eslint-enable no-console */
  }, []);

  const addCategory = useCallback(
    (category: string) => {
      if (!category.trim() || settings.categories.includes(category.trim())) return;
      const newCategories = [...settings.categories, category.trim()];
      updateSettings({ categories: newCategories });
    },
    [settings.categories, updateSettings]
  );

  const deleteCategory = useCallback(
    (categoryToDelete: string) => {
      const newCategories = settings.categories.filter((c) => c !== categoryToDelete);
      updateSettings({ categories: newCategories });
    },
    [settings.categories, updateSettings]
  );

  const value = useMemo(
    () => ({ ...settings, updateSettings, addCategory, deleteCategory, loading }),
    [settings, updateSettings, addCategory, deleteCategory, loading]
  );

  return React.createElement(SiteSettingsContext.Provider, { value }, children);
};

export const useSiteSettings = (): SiteSettingsContextType => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
