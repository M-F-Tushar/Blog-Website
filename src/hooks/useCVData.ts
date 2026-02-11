import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { isSupabaseConfigured } from '../supabase/client';
import {
  createCVEducation as createEducationSupabase,
  updateCVEducation as updateEducationSupabase,
  deleteCVEducation as deleteEducationSupabase,
  createCVExperience as createExperienceSupabase,
  updateCVExperience as updateExperienceSupabase,
  deleteCVExperience as deleteExperienceSupabase,
  createCVCertification as createCertificationSupabase,
  updateCVCertification as updateCertificationSupabase,
  deleteCVCertification as deleteCertificationSupabase,
  subscribeToCVUpdates,
} from '../services/supabaseCVService';
import {
  FALLBACK_CV_EDUCATION as FALLBACK_EDUCATION,
  FALLBACK_CV_EXPERIENCE as FALLBACK_EXPERIENCE,
  FALLBACK_CV_CERTIFICATIONS as FALLBACK_CERTIFICATIONS,
} from '../data/fallback';

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description?: string;
  gpa?: string;
  location?: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description?: string;
  location?: string;
  skills: string[];
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  description?: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

interface CVDataContextType {
  education: Education[];
  experience: Experience[];
  certifications: Certification[];
  addEducation: (
    eduData: Omit<Education, 'id' | 'created_at' | 'updated_at'>
  ) => Promise<Education>;
  updateEducation: (
    eduId: string,
    eduData: Partial<Omit<Education, 'id' | 'created_at' | 'updated_at'>>
  ) => Promise<Education | undefined>;
  deleteEducation: (eduId: string) => Promise<void>;
  addExperience: (
    expData: Omit<Experience, 'id' | 'created_at' | 'updated_at'>
  ) => Promise<Experience>;
  updateExperience: (
    expId: string,
    expData: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>
  ) => Promise<Experience | undefined>;
  deleteExperience: (expId: string) => Promise<void>;
  addCertification: (
    certData: Omit<Certification, 'id' | 'created_at' | 'updated_at'>
  ) => Promise<Certification>;
  updateCertification: (
    certId: string,
    certData: Partial<Omit<Certification, 'id' | 'created_at' | 'updated_at'>>
  ) => Promise<Certification | undefined>;
  deleteCertification: (certId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const CVDataContext = createContext<CVDataContextType | undefined>(undefined);

const getFromStorage = <T>(key: string): T[] => {
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error);
    return [];
  }
};

const saveToStorage = <T>(key: string, data: T[]) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage`, error);
  }
};

const EDUCATION_STORAGE_KEY = 'userEducation';
const EXPERIENCE_STORAGE_KEY = 'userExperience';
const CERTIFICATIONS_STORAGE_KEY = 'userCertifications';

export const CVDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const useSupabase = isSupabaseConfigured();

  const [education, setEducation] = useState<Education[]>(() => {
    if (!useSupabase) {
      const userEducation = getFromStorage<Education>(EDUCATION_STORAGE_KEY);
      const initialEducation = FALLBACK_EDUCATION || [];
      return [...initialEducation, ...userEducation];
    }
    return [];
  });

  const [experience, setExperience] = useState<Experience[]>(() => {
    if (!useSupabase) {
      const userExperience = getFromStorage<Experience>(EXPERIENCE_STORAGE_KEY);
      const initialExperience = FALLBACK_EXPERIENCE || [];
      return [...initialExperience, ...userExperience];
    }
    return [];
  });

  const [certifications, setCertifications] = useState<Certification[]>(() => {
    if (!useSupabase) {
      const userCertifications = getFromStorage<Certification>(CERTIFICATIONS_STORAGE_KEY);
      const initialCertifications = FALLBACK_CERTIFICATIONS || [];
      return [...initialCertifications, ...userCertifications];
    }
    return [];
  });

  const [loading, setLoading] = useState(useSupabase); // Start as loading if using Supabase
  const [error, setError] = useState<string | null>(null);

  // Subscribe to Supabase updates if Supabase is configured
  useEffect(() => {
    if (!useSupabase) {
      // eslint-disable-next-line no-console
      console.log('Supabase not configured, using fallback CV data');
      return;
    }

    let mounted = true;

    const unsubscribe = subscribeToCVUpdates(
      (cvData) => {
        if (mounted) {
          setEducation(cvData.education);
          setExperience(cvData.experience);
          setCertifications(cvData.certifications);
          setLoading(false);
          setError(null);
        }
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.error('Error loading CV data from Supabase, falling back to local data:', err);
        if (mounted) {
          setError(err.message);
          setLoading(false);
          // On error, fall back to fallback data if none loaded
          setEducation((prev) => (prev.length === 0 ? FALLBACK_EDUCATION : prev));
          setExperience((prev) => (prev.length === 0 ? FALLBACK_EXPERIENCE : prev));
          setCertifications((prev) => (prev.length === 0 ? FALLBACK_CERTIFICATIONS : prev));
        }
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [useSupabase]);

  // --- Education CRUD ---

  const addEducation = useCallback(
    async (eduData: Omit<Education, 'id' | 'created_at' | 'updated_at'>): Promise<Education> => {
      if (useSupabase) {
        try {
          const created = await createEducationSupabase(eduData);
          // The subscription will update the state
          return created;
        } catch (err) {
          console.error('Error creating education:', err);
          setError(err instanceof Error ? err.message : 'Failed to create education');
          throw err;
        }
      } else {
        const newEducation: Education = {
          ...eduData,
          id: `edu-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const current = getFromStorage<Education>(EDUCATION_STORAGE_KEY);
        const updated = [newEducation, ...current];
        saveToStorage(EDUCATION_STORAGE_KEY, updated);

        setEducation((prev) => [newEducation, ...prev]);
        return newEducation;
      }
    },
    [useSupabase]
  );

  const updateEducation = useCallback(
    async (
      eduId: string,
      eduData: Partial<Omit<Education, 'id' | 'created_at' | 'updated_at'>>
    ): Promise<Education | undefined> => {
      if (useSupabase) {
        try {
          await updateEducationSupabase(eduId, eduData);
          return education.find((e) => e.id === eduId);
        } catch (err) {
          console.error('Error updating education:', err);
          setError(err instanceof Error ? err.message : 'Failed to update education');
          throw err;
        }
      } else {
        const current = getFromStorage<Education>(EDUCATION_STORAGE_KEY);
        const index = current.findIndex((e) => e.id === eduId);

        if (index === -1) return undefined;

        const updatedItem: Education = {
          ...current[index],
          ...eduData,
          updated_at: new Date().toISOString(),
        };

        current[index] = updatedItem;
        saveToStorage(EDUCATION_STORAGE_KEY, current);

        setEducation((prev) => prev.map((e) => (e.id === eduId ? updatedItem : e)));
        return updatedItem;
      }
    },
    [useSupabase, education]
  );

  const deleteEducation = useCallback(
    async (eduId: string) => {
      if (useSupabase) {
        try {
          await deleteEducationSupabase(eduId);
        } catch (err) {
          console.error('Error deleting education:', err);
          setError(err instanceof Error ? err.message : 'Failed to delete education');
          throw err;
        }
      } else {
        const current = getFromStorage<Education>(EDUCATION_STORAGE_KEY);
        const updated = current.filter((e) => e.id !== eduId);
        saveToStorage(EDUCATION_STORAGE_KEY, updated);
        setEducation((prev) => prev.filter((e) => e.id !== eduId));
      }
    },
    [useSupabase]
  );

  // --- Experience CRUD ---

  const addExperience = useCallback(
    async (expData: Omit<Experience, 'id' | 'created_at' | 'updated_at'>): Promise<Experience> => {
      if (useSupabase) {
        try {
          const created = await createExperienceSupabase(expData);
          return created;
        } catch (err) {
          console.error('Error creating experience:', err);
          setError(err instanceof Error ? err.message : 'Failed to create experience');
          throw err;
        }
      } else {
        const newExperience: Experience = {
          ...expData,
          id: `exp-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const current = getFromStorage<Experience>(EXPERIENCE_STORAGE_KEY);
        const updated = [newExperience, ...current];
        saveToStorage(EXPERIENCE_STORAGE_KEY, updated);

        setExperience((prev) => [newExperience, ...prev]);
        return newExperience;
      }
    },
    [useSupabase]
  );

  const updateExperience = useCallback(
    async (
      expId: string,
      expData: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>
    ): Promise<Experience | undefined> => {
      if (useSupabase) {
        try {
          await updateExperienceSupabase(expId, expData);
          return experience.find((e) => e.id === expId);
        } catch (err) {
          console.error('Error updating experience:', err);
          setError(err instanceof Error ? err.message : 'Failed to update experience');
          throw err;
        }
      } else {
        const current = getFromStorage<Experience>(EXPERIENCE_STORAGE_KEY);
        const index = current.findIndex((e) => e.id === expId);

        if (index === -1) return undefined;

        const updatedItem: Experience = {
          ...current[index],
          ...expData,
          updated_at: new Date().toISOString(),
        };

        current[index] = updatedItem;
        saveToStorage(EXPERIENCE_STORAGE_KEY, current);

        setExperience((prev) => prev.map((e) => (e.id === expId ? updatedItem : e)));
        return updatedItem;
      }
    },
    [useSupabase, experience]
  );

  const deleteExperience = useCallback(
    async (expId: string) => {
      if (useSupabase) {
        try {
          await deleteExperienceSupabase(expId);
        } catch (err) {
          console.error('Error deleting experience:', err);
          setError(err instanceof Error ? err.message : 'Failed to delete experience');
          throw err;
        }
      } else {
        const current = getFromStorage<Experience>(EXPERIENCE_STORAGE_KEY);
        const updated = current.filter((e) => e.id !== expId);
        saveToStorage(EXPERIENCE_STORAGE_KEY, updated);
        setExperience((prev) => prev.filter((e) => e.id !== expId));
      }
    },
    [useSupabase]
  );

  // --- Certifications CRUD ---

  const addCertification = useCallback(
    async (
      certData: Omit<Certification, 'id' | 'created_at' | 'updated_at'>
    ): Promise<Certification> => {
      if (useSupabase) {
        try {
          const created = await createCertificationSupabase(certData);
          return created;
        } catch (err) {
          console.error('Error creating certification:', err);
          setError(err instanceof Error ? err.message : 'Failed to create certification');
          throw err;
        }
      } else {
        const newCertification: Certification = {
          ...certData,
          id: `cert-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const current = getFromStorage<Certification>(CERTIFICATIONS_STORAGE_KEY);
        const updated = [newCertification, ...current];
        saveToStorage(CERTIFICATIONS_STORAGE_KEY, updated);

        setCertifications((prev) => [newCertification, ...prev]);
        return newCertification;
      }
    },
    [useSupabase]
  );

  const updateCertification = useCallback(
    async (
      certId: string,
      certData: Partial<Omit<Certification, 'id' | 'created_at' | 'updated_at'>>
    ): Promise<Certification | undefined> => {
      if (useSupabase) {
        try {
          await updateCertificationSupabase(certId, certData);
          return certifications.find((c) => c.id === certId);
        } catch (err) {
          console.error('Error updating certification:', err);
          setError(err instanceof Error ? err.message : 'Failed to update certification');
          throw err;
        }
      } else {
        const current = getFromStorage<Certification>(CERTIFICATIONS_STORAGE_KEY);
        const index = current.findIndex((c) => c.id === certId);

        if (index === -1) return undefined;

        const updatedItem: Certification = {
          ...current[index],
          ...certData,
          updated_at: new Date().toISOString(),
        };

        current[index] = updatedItem;
        saveToStorage(CERTIFICATIONS_STORAGE_KEY, current);

        setCertifications((prev) => prev.map((c) => (c.id === certId ? updatedItem : c)));
        return updatedItem;
      }
    },
    [useSupabase, certifications]
  );

  const deleteCertification = useCallback(
    async (certId: string) => {
      if (useSupabase) {
        try {
          await deleteCertificationSupabase(certId);
        } catch (err) {
          console.error('Error deleting certification:', err);
          setError(err instanceof Error ? err.message : 'Failed to delete certification');
          throw err;
        }
      } else {
        const current = getFromStorage<Certification>(CERTIFICATIONS_STORAGE_KEY);
        const updated = current.filter((c) => c.id !== certId);
        saveToStorage(CERTIFICATIONS_STORAGE_KEY, updated);
        setCertifications((prev) => prev.filter((c) => c.id !== certId));
      }
    },
    [useSupabase]
  );

  const value = useMemo(
    () => ({
      education,
      experience,
      certifications,
      addEducation,
      updateEducation,
      deleteEducation,
      addExperience,
      updateExperience,
      deleteExperience,
      addCertification,
      updateCertification,
      deleteCertification,
      loading,
      error,
    }),
    [
      education,
      experience,
      certifications,
      addEducation,
      updateEducation,
      deleteEducation,
      addExperience,
      updateExperience,
      deleteExperience,
      addCertification,
      updateCertification,
      deleteCertification,
      loading,
      error,
    ]
  );

  return React.createElement(CVDataContext.Provider, { value }, children);
};

export const useCVData = (): CVDataContextType => {
  const context = useContext(CVDataContext);
  if (!context) {
    throw new Error('useCVData must be used within a CVDataProvider');
  }
  return context;
};
