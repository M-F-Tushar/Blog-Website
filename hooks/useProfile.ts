import React, { createContext, useContext, useState, useMemo } from 'react';

interface ProfileContextType {
  photoUrl: string;
  updateProfilePhoto: (newUrl: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const DEFAULT_PHOTO_URL = 'https://avatars.githubusercontent.com/u/81184131?v=4';

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photoUrl, setPhotoUrl] = useState<string>(() => {
    try {
      return window.localStorage.getItem('profilePhotoUrl') || DEFAULT_PHOTO_URL;
    } catch (error) {
      console.error('Failed to read profile photo URL from localStorage', error);
      return DEFAULT_PHOTO_URL;
    }
  });

  const updateProfilePhoto = (newUrl: string) => {
    try {
      window.localStorage.setItem('profilePhotoUrl', newUrl);
      setPhotoUrl(newUrl);
    } catch (error) {
      console.error('Failed to save profile photo URL to localStorage', error);
    }
  };
  
  const value = useMemo(() => ({ photoUrl, updateProfilePhoto }), [photoUrl]);

  return React.createElement(ProfileContext.Provider, { value }, children);
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
