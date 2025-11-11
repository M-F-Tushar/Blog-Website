import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

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
  updateSettings: (newSettings: Partial<Omit<SiteSettings, 'categories'>>) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const getSettingsFromStorage = (): SiteSettings => {
  const defaults: SiteSettings = {
    siteName: 'Mahir Faysal Tushar',
    authorName: 'Mahir Faysal Tushar',
    authorTagline: 'AI & ML Enthusiast • Aspiring AI Agent Developer • LLM Explorer • Lifelong Learner',
    authorBio: `Hi, I’m Mahir Faysal Tushar — a passionate learner and developer exploring the world of Artificial Intelligence and Machine Learning.

I enjoy creating intelligent systems, experimenting with AI agents and language models, and sharing what I learn along the way. My goal is to contribute to building responsible, useful, and innovative AI technologies that make life better for people.`,
    siteDescription: 'A personal blog about my journey in AI, technology, and life.',
    socialLinks: {
      github: 'https://github.com/M-F-Tushar',
      linkedin: 'https://linkedin.com/in/mahir-faysal-tushar',
      email: 'mahirfaysaltushar@gmail.com',
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

  const updateSettings = useCallback((newSettings: Partial<Omit<SiteSettings, 'categories'>>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveSettingsToStorage(updated);
      return updated;
    });
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
  
  const value = useMemo(() => ({ ...settings, updateSettings, addCategory, deleteCategory }), [settings, updateSettings, addCategory, deleteCategory]);

  return React.createElement(SiteSettingsContext.Provider, { value }, children);
};

export const useSiteSettings = (): SiteSettingsContextType => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};