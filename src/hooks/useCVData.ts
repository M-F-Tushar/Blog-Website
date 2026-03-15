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
import type {
  DatabaseCVEducation,
  DatabaseCVExperience,
  DatabaseCVCertification,
} from '../types/database';

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

const EDUCATION_STORAGE_KEY = 'userEducation';
const EXPERIENCE_STORAGE_KEY = 'userExperience';
const CERTIFICATIONS_STORAGE_KEY = 'userCertifications';

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

const toInputDate = (value: string | number | null | undefined): string | undefined => {
  if (value === null || value === undefined || value === '') return undefined;
  if (typeof value === 'number') return `${value}-01-01`;
  if (/^\d{4}$/.test(value)) return `${value}-01-01`;
  return value;
};

const educationFromDatabase = (education: DatabaseCVEducation): Education => ({
  id: education.id,
  institution: education.institution,
  degree: education.degree,
  field_of_study: education.field,
  start_date: education.start_date,
  end_date: education.end_date || undefined,
  current: !education.end_date,
  description: education.description || undefined,
  gpa: education.gpa || undefined,
  location: education.location || undefined,
  sort_order: education.sort_order,
  created_at: education.created_at,
  updated_at: education.updated_at,
});

const experienceFromDatabase = (experience: DatabaseCVExperience): Experience => ({
  id: experience.id,
  company: experience.company,
  position: experience.position,
  start_date: experience.start_date,
  end_date: experience.end_date || undefined,
  current: !experience.end_date,
  description: experience.description || undefined,
  location: experience.location || undefined,
  skills: experience.responsibilities || [],
  sort_order: experience.sort_order,
  created_at: experience.created_at,
  updated_at: experience.updated_at,
});

const certificationFromDatabase = (
  certification: DatabaseCVCertification
): Certification => ({
  id: certification.id,
  name: certification.name,
  issuer: certification.issuer,
  issue_date: certification.issue_date,
  expiry_date: certification.expiry_date || undefined,
  credential_id: certification.credential_id || undefined,
  credential_url: certification.credential_url || undefined,
  description: certification.description || undefined,
  sort_order: certification.sort_order,
  created_at: certification.created_at,
  updated_at: certification.updated_at,
});

const educationToDatabase = (
  education: Omit<Education, 'id' | 'created_at' | 'updated_at'>
): Omit<DatabaseCVEducation, 'id' | 'created_at' | 'updated_at'> => ({
  institution: education.institution,
  degree: education.degree,
  field: education.field_of_study,
  start_date: education.start_date,
  end_date: education.current ? null : education.end_date || null,
  description: education.description || null,
  gpa: education.gpa || null,
  location: education.location || null,
  sort_order: education.sort_order,
  is_initial: false,
});

const experienceToDatabase = (
  experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>
): Omit<DatabaseCVExperience, 'id' | 'created_at' | 'updated_at'> => ({
  company: experience.company,
  position: experience.position,
  start_date: experience.start_date,
  end_date: experience.current ? null : experience.end_date || null,
  description: experience.description || '',
  location: experience.location || null,
  responsibilities: experience.skills,
  sort_order: experience.sort_order,
  is_initial: false,
});

const certificationToDatabase = (
  certification: Omit<Certification, 'id' | 'created_at' | 'updated_at'>
): Omit<DatabaseCVCertification, 'id' | 'created_at' | 'updated_at'> => ({
  name: certification.name,
  issuer: certification.issuer,
  issue_date: certification.issue_date,
  expiry_date: certification.expiry_date || null,
  credential_id: certification.credential_id || null,
  credential_url: certification.credential_url || null,
  description: certification.description || null,
  sort_order: certification.sort_order,
  is_initial: false,
});

const fallbackEducation = FALLBACK_EDUCATION.map((item) =>
  educationFromDatabase({
    id: item.id,
    institution: item.institution,
    degree: item.degree,
    field: item.field || '',
    start_date: toInputDate(item.start_year)!,
    end_date: toInputDate(item.end_year) || null,
    description: item.description || null,
    gpa: null,
    location: null,
    sort_order: item.sort_order,
    is_initial: true,
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.created_at || new Date().toISOString(),
  })
);

const fallbackExperience = FALLBACK_EXPERIENCE.map((item) =>
  experienceFromDatabase({
    id: item.id,
    company: item.company,
    position: item.role,
    start_date: item.start_date,
    end_date: item.end_date || null,
    description: item.description || '',
    location: null,
    responsibilities: item.highlights || [],
    sort_order: item.sort_order,
    is_initial: true,
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.created_at || new Date().toISOString(),
  })
);

const fallbackCertifications = FALLBACK_CERTIFICATIONS.map((item) =>
  certificationFromDatabase({
    id: item.id,
    name: item.name,
    issuer: item.issuer,
    issue_date: toInputDate(item.year)!,
    expiry_date: null,
    credential_id: null,
    credential_url: item.url || null,
    description: null,
    sort_order: item.sort_order,
    is_initial: true,
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.created_at || new Date().toISOString(),
  })
);

export const CVDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const useSupabase = isSupabaseConfigured();

  const [education, setEducation] = useState<Education[]>(() => {
    if (!useSupabase) {
      const userEducation = getFromStorage<Education>(EDUCATION_STORAGE_KEY);
      return [...fallbackEducation, ...userEducation];
    }
    return [];
  });

  const [experience, setExperience] = useState<Experience[]>(() => {
    if (!useSupabase) {
      const userExperience = getFromStorage<Experience>(EXPERIENCE_STORAGE_KEY);
      return [...fallbackExperience, ...userExperience];
    }
    return [];
  });

  const [certifications, setCertifications] = useState<Certification[]>(() => {
    if (!useSupabase) {
      const userCertifications = getFromStorage<Certification>(CERTIFICATIONS_STORAGE_KEY);
      return [...fallbackCertifications, ...userCertifications];
    }
    return [];
  });

  const [loading, setLoading] = useState(useSupabase);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!useSupabase) {
      console.log('Supabase not configured, using fallback CV data');
      return;
    }

    let mounted = true;

    const unsubscribe = subscribeToCVUpdates(
      (cvData) => {
        if (mounted) {
          setEducation(cvData.education.map(educationFromDatabase));
          setExperience(cvData.experience.map(experienceFromDatabase));
          setCertifications(cvData.certifications.map(certificationFromDatabase));
          setLoading(false);
          setError(null);
        }
      },
      (err) => {
        console.error('Error loading CV data from Supabase, falling back to local data:', err);
        if (mounted) {
          setError(err.message);
          setLoading(false);
          setEducation((prev) => (prev.length === 0 ? fallbackEducation : prev));
          setExperience((prev) => (prev.length === 0 ? fallbackExperience : prev));
          setCertifications((prev) => (prev.length === 0 ? fallbackCertifications : prev));
        }
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [useSupabase]);

  const addEducation = useCallback(
    async (eduData: Omit<Education, 'id' | 'created_at' | 'updated_at'>): Promise<Education> => {
      if (useSupabase) {
        try {
          return educationFromDatabase(await createEducationSupabase(educationToDatabase(eduData)));
        } catch (err) {
          console.error('Error creating education:', err);
          setError(err instanceof Error ? err.message : 'Failed to create education');
          throw err;
        }
      }

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
          const existing = education.find((item) => item.id === eduId);
          if (!existing) return undefined;
          const merged = { ...existing, ...eduData };
          await updateEducationSupabase(eduId, educationToDatabase(merged));
          return merged;
        } catch (err) {
          console.error('Error updating education:', err);
          setError(err instanceof Error ? err.message : 'Failed to update education');
          throw err;
        }
      }

      const current = getFromStorage<Education>(EDUCATION_STORAGE_KEY);
      const index = current.findIndex((item) => item.id === eduId);
      if (index === -1) return undefined;

      const updatedItem: Education = {
        ...current[index],
        ...eduData,
        updated_at: new Date().toISOString(),
      };

      current[index] = updatedItem;
      saveToStorage(EDUCATION_STORAGE_KEY, current);
      setEducation((prev) => prev.map((item) => (item.id === eduId ? updatedItem : item)));
      return updatedItem;
    },
    [education, useSupabase]
  );

  const deleteEducation = useCallback(
    async (eduId: string) => {
      if (useSupabase) {
        try {
          await deleteEducationSupabase(eduId);
          return;
        } catch (err) {
          console.error('Error deleting education:', err);
          setError(err instanceof Error ? err.message : 'Failed to delete education');
          throw err;
        }
      }

      const current = getFromStorage<Education>(EDUCATION_STORAGE_KEY);
      const updated = current.filter((item) => item.id !== eduId);
      saveToStorage(EDUCATION_STORAGE_KEY, updated);
      setEducation((prev) => prev.filter((item) => item.id !== eduId));
    },
    [useSupabase]
  );

  const addExperience = useCallback(
    async (expData: Omit<Experience, 'id' | 'created_at' | 'updated_at'>): Promise<Experience> => {
      if (useSupabase) {
        try {
          return experienceFromDatabase(
            await createExperienceSupabase(experienceToDatabase(expData))
          );
        } catch (err) {
          console.error('Error creating experience:', err);
          setError(err instanceof Error ? err.message : 'Failed to create experience');
          throw err;
        }
      }

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
          const existing = experience.find((item) => item.id === expId);
          if (!existing) return undefined;
          const merged = { ...existing, ...expData };
          await updateExperienceSupabase(expId, experienceToDatabase(merged));
          return merged;
        } catch (err) {
          console.error('Error updating experience:', err);
          setError(err instanceof Error ? err.message : 'Failed to update experience');
          throw err;
        }
      }

      const current = getFromStorage<Experience>(EXPERIENCE_STORAGE_KEY);
      const index = current.findIndex((item) => item.id === expId);
      if (index === -1) return undefined;

      const updatedItem: Experience = {
        ...current[index],
        ...expData,
        updated_at: new Date().toISOString(),
      };

      current[index] = updatedItem;
      saveToStorage(EXPERIENCE_STORAGE_KEY, current);
      setExperience((prev) => prev.map((item) => (item.id === expId ? updatedItem : item)));
      return updatedItem;
    },
    [experience, useSupabase]
  );

  const deleteExperience = useCallback(
    async (expId: string) => {
      if (useSupabase) {
        try {
          await deleteExperienceSupabase(expId);
          return;
        } catch (err) {
          console.error('Error deleting experience:', err);
          setError(err instanceof Error ? err.message : 'Failed to delete experience');
          throw err;
        }
      }

      const current = getFromStorage<Experience>(EXPERIENCE_STORAGE_KEY);
      const updated = current.filter((item) => item.id !== expId);
      saveToStorage(EXPERIENCE_STORAGE_KEY, updated);
      setExperience((prev) => prev.filter((item) => item.id !== expId));
    },
    [useSupabase]
  );

  const addCertification = useCallback(
    async (
      certData: Omit<Certification, 'id' | 'created_at' | 'updated_at'>
    ): Promise<Certification> => {
      if (useSupabase) {
        try {
          return certificationFromDatabase(
            await createCertificationSupabase(certificationToDatabase(certData))
          );
        } catch (err) {
          console.error('Error creating certification:', err);
          setError(err instanceof Error ? err.message : 'Failed to create certification');
          throw err;
        }
      }

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
          const existing = certifications.find((item) => item.id === certId);
          if (!existing) return undefined;
          const merged = { ...existing, ...certData };
          await updateCertificationSupabase(certId, certificationToDatabase(merged));
          return merged;
        } catch (err) {
          console.error('Error updating certification:', err);
          setError(err instanceof Error ? err.message : 'Failed to update certification');
          throw err;
        }
      }

      const current = getFromStorage<Certification>(CERTIFICATIONS_STORAGE_KEY);
      const index = current.findIndex((item) => item.id === certId);
      if (index === -1) return undefined;

      const updatedItem: Certification = {
        ...current[index],
        ...certData,
        updated_at: new Date().toISOString(),
      };

      current[index] = updatedItem;
      saveToStorage(CERTIFICATIONS_STORAGE_KEY, current);
      setCertifications((prev) => prev.map((item) => (item.id === certId ? updatedItem : item)));
      return updatedItem;
    },
    [certifications, useSupabase]
  );

  const deleteCertification = useCallback(
    async (certId: string) => {
      if (useSupabase) {
        try {
          await deleteCertificationSupabase(certId);
          return;
        } catch (err) {
          console.error('Error deleting certification:', err);
          setError(err instanceof Error ? err.message : 'Failed to delete certification');
          throw err;
        }
      }

      const current = getFromStorage<Certification>(CERTIFICATIONS_STORAGE_KEY);
      const updated = current.filter((item) => item.id !== certId);
      saveToStorage(CERTIFICATIONS_STORAGE_KEY, updated);
      setCertifications((prev) => prev.filter((item) => item.id !== certId));
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
