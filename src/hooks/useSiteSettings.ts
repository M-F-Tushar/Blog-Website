import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { FALLBACK_SETTINGS } from '../data/fallback';

interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  discord?: string;
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
  authorImage: string;
  siteDescription: string;
  socialLinks: SocialLinks;
  categories: string[];
  skills: Skill[];
  timeline: TimelineItem[];
  achievements: Achievement[];
  uiText: {
    home: {
      welcomeBadge: string;
      startReading: string;
      moreAboutMe: string;
      featuredStory: string;
      trendingTopics: string;
      latestArticles: string;
      newsletterTitle: string;
      newsletterDescription: string;
      subscribeButton: string;
    };
    footer: {
      tagline: string;
      exploreTitle: string;
      latestTitle: string;
      stayConnectedTitle: string;
      newsletterDescription: string;
      subscribeButton: string;
      copyrightText: string;
    };
    header: {
      home: string;
      about: string;
      blog: string;
      recommendations: string;
      bookmarks: string;
      contact: string;
      searchPlaceholder: string;
    };
  };
  homepageLayout: {
    showHero: boolean;
    showFeaturedPost: boolean;
    showTrendingTopics: boolean;
    showLatestArticles: boolean;
    showNewsletter: boolean;
    sectionOrder?: string[];
    sectionConfig?: Record<string, Record<string, unknown>>;
  };
  appearance: {
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
    logoUrl: string;
    faviconUrl: string;
    defaultTheme: 'light' | 'dark' | 'system';
  };
  navigation: {
    menuItems: Array<{
      id: string;
      label: string;
      path: string;
      isExternal: boolean;
      visible: boolean;
      order: number;
    }>;
  };
  seo: {
    defaultMetaTitle: string;
    defaultMetaDescription: string;
    ogImage: string;
    twitterHandle: string;
    pageMeta: Record<string, { title: string; description: string; ogImage?: string }>;
  };
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
    authorImage: FALLBACK_SETTINGS.author_image || '',
    siteDescription: FALLBACK_SETTINGS.site_description,
    socialLinks: {
      github: FALLBACK_SETTINGS.social_github,
      linkedin: FALLBACK_SETTINGS.social_linkedin,
      email: FALLBACK_SETTINGS.social_email,
      twitter: FALLBACK_SETTINGS.social_twitter || '',
      instagram: FALLBACK_SETTINGS.social_instagram || '',
      youtube: FALLBACK_SETTINGS.social_youtube || '',
      discord: FALLBACK_SETTINGS.social_discord || '',
    },
    categories: FALLBACK_SETTINGS.categories,
    skills: FALLBACK_SETTINGS.skills as unknown as Skill[],
    timeline: FALLBACK_SETTINGS.timeline as unknown as TimelineItem[],
    achievements: FALLBACK_SETTINGS.achievements as unknown as Achievement[],
    uiText: FALLBACK_SETTINGS.ui_text || {
      home: {
        welcomeBadge: 'Welcome to my digital garden',
        startReading: 'Start Reading',
        moreAboutMe: 'More About Me',
        featuredStory: 'Featured Story',
        trendingTopics: 'Trending Topics',
        latestArticles: 'Latest Articles',
        newsletterTitle: 'Subscribe to my newsletter',
        newsletterDescription:
          'Get the latest articles, tutorials, and insights delivered straight to your inbox. No spam, just quality content.',
        subscribeButton: 'Subscribe',
      },
      footer: {
        tagline:
          'Exploring the frontiers of web development, computer science, and technology. Join me on this journey of continuous learning and creation.',
        exploreTitle: 'Explore',
        latestTitle: 'Latest Articles',
        stayConnectedTitle: 'Stay Connected',
        newsletterDescription: 'Get the latest posts and updates delivered straight to your inbox.',
        subscribeButton: 'Subscribe',
        copyrightText: 'Made with Heart in React.',
      },
      header: {
        home: 'Home',
        about: 'About',
        blog: 'Blog',
        recommendations: 'Recommendations',
        bookmarks: 'Bookmarks',
        contact: 'Contact',
        searchPlaceholder: 'Search...',
      },
    },
    homepageLayout: FALLBACK_SETTINGS.homepage_layout || {
      showHero: true,
      showFeaturedPost: true,
      showTrendingTopics: true,
      showLatestArticles: true,
      showNewsletter: true,
    },
    appearance: FALLBACK_SETTINGS.appearance || {
      primaryColor: '#6366f1',
      accentColor: '#8b5cf6',
      fontFamily: 'Inter',
      logoUrl: '',
      faviconUrl: '',
      defaultTheme: 'system' as const,
    },
    navigation: FALLBACK_SETTINGS.navigation || {
      menuItems: [
        { id: 'home', label: 'Home', path: '/', isExternal: false, visible: true, order: 1 },
        { id: 'about', label: 'About', path: '/about', isExternal: false, visible: true, order: 2 },
        { id: 'blog', label: 'Blog', path: '/blog', isExternal: false, visible: true, order: 3 },
        {
          id: 'publications',
          label: 'Publications',
          path: '/publications',
          isExternal: false,
          visible: true,
          order: 4,
        },
        {
          id: 'projects',
          label: 'Projects',
          path: '/projects',
          isExternal: false,
          visible: true,
          order: 5,
        },
        {
          id: 'playground',
          label: 'Playground',
          path: '/playground',
          isExternal: false,
          visible: true,
          order: 6,
        },
        { id: 'cv', label: 'CV', path: '/cv', isExternal: false, visible: true, order: 7 },
        {
          id: 'contact',
          label: 'Contact',
          path: '/contact',
          isExternal: false,
          visible: true,
          order: 8,
        },
      ],
    },
    seo: FALLBACK_SETTINGS.seo || {
      defaultMetaTitle: 'My Blog - Personal Blog',
      defaultMetaDescription: 'A modern personal blog built with React and TypeScript.',
      ogImage: '',
      twitterHandle: '',
      pageMeta: {},
    },
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const settingsData = data as Record<string, any>;
          const fetchedSettings: SiteSettings = {
            siteName: settingsData.site_name || FALLBACK_SETTINGS.site_name,
            siteDescription: settingsData.site_description || FALLBACK_SETTINGS.site_description,
            authorName: settingsData.author_name || FALLBACK_SETTINGS.author_name,
            authorTagline: settingsData.author_tagline || FALLBACK_SETTINGS.author_tagline,
            authorBio: settingsData.author_bio || FALLBACK_SETTINGS.author_bio,
            authorImage: settingsData.author_image || FALLBACK_SETTINGS.author_image || '',
            socialLinks: {
              github: settingsData.social_github || FALLBACK_SETTINGS.social_github,
              linkedin: settingsData.social_linkedin || FALLBACK_SETTINGS.social_linkedin,
              email: settingsData.social_email || FALLBACK_SETTINGS.social_email,
              twitter: settingsData.social_twitter || '',
              instagram: settingsData.social_instagram || '',
              youtube: settingsData.social_youtube || '',
              discord: settingsData.social_discord || '',
            },
            categories: settingsData.categories || FALLBACK_SETTINGS.categories,
            skills: (settingsData.skills || FALLBACK_SETTINGS.skills) as unknown as Skill[],
            timeline: (settingsData.timeline ||
              FALLBACK_SETTINGS.timeline) as unknown as TimelineItem[],
            achievements: (settingsData.achievements ||
              FALLBACK_SETTINGS.achievements) as unknown as Achievement[],
            uiText: settingsData.ui_text || settings.uiText,
            homepageLayout: settingsData.homepage_layout || settings.homepageLayout,
            appearance: settingsData.appearance || settings.appearance,
            navigation:
              settingsData.navigation?.menuItems?.length > 0
                ? settingsData.navigation
                : settings.navigation,
            seo: settingsData.seo || settings.seo,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: Record<string, any> = {};

      if (newSettings.siteName !== undefined) updateData.site_name = newSettings.siteName;
      if (newSettings.siteDescription !== undefined)
        updateData.site_description = newSettings.siteDescription;
      if (newSettings.authorName !== undefined) updateData.author_name = newSettings.authorName;
      if (newSettings.authorTagline !== undefined)
        updateData.author_tagline = newSettings.authorTagline;
      if (newSettings.authorBio !== undefined) updateData.author_bio = newSettings.authorBio;
      if (newSettings.authorImage !== undefined) updateData.author_image = newSettings.authorImage;

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
      if (newSettings.uiText !== undefined) updateData.ui_text = newSettings.uiText;

      // FIX: Add missing settings that were only saved to localStorage before
      if (newSettings.appearance !== undefined) updateData.appearance = newSettings.appearance;
      if (newSettings.navigation !== undefined) updateData.navigation = newSettings.navigation;
      if (newSettings.seo !== undefined) updateData.seo = newSettings.seo;
      if (newSettings.homepageLayout !== undefined)
        updateData.homepage_layout = newSettings.homepageLayout;

      console.log('📤 Sending update to Supabase:', updateData);

      if (existingSettings) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
