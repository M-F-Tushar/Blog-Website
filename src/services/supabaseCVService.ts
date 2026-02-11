import { supabase } from '../supabase/client';
import type {
  DatabaseCVEducation,
  DatabaseCVExperience,
  DatabaseCVCertification,
} from '../types/database';

const CV_EDUCATION_TABLE = 'cv_education';
const CV_EXPERIENCE_TABLE = 'cv_experience';
const CV_CERTIFICATIONS_TABLE = 'cv_certifications';

// ==================== CV Education ====================

/**
 * Get all CV education entries from Supabase
 */
export const getAllCVEducation = async (): Promise<DatabaseCVEducation[]> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { data, error } = await supabase
      .from(CV_EDUCATION_TABLE)
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching CV education:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching CV education:', error);
    throw error;
  }
};

/**
 * Create a new CV education entry
 */
export const createCVEducation = async (
  education: Omit<DatabaseCVEducation, 'id' | 'created_at' | 'updated_at'>
): Promise<DatabaseCVEducation> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { data, error } = await supabase
      .from(CV_EDUCATION_TABLE)
      .insert(education as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating CV education:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating CV education:', error);
    throw error;
  }
};

/**
 * Update an existing CV education entry
 */
export const updateCVEducation = async (
  id: string,
  education: Partial<Omit<DatabaseCVEducation, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const updateData: any = { ...education, updated_at: new Date().toISOString() };

    const { error } = await supabase
      .from(CV_EDUCATION_TABLE)
      // @ts-expect-error - Supabase type inference issue with database types
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating CV education:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating CV education:', error);
    throw error;
  }
};

/**
 * Delete a CV education entry
 */
export const deleteCVEducation = async (id: string): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { error } = await supabase.from(CV_EDUCATION_TABLE).delete().eq('id', id);

    if (error) {
      console.error('Error deleting CV education:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting CV education:', error);
    throw error;
  }
};

// ==================== CV Experience ====================

/**
 * Get all CV experience entries from Supabase
 */
export const getAllCVExperience = async (): Promise<DatabaseCVExperience[]> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { data, error } = await supabase
      .from(CV_EXPERIENCE_TABLE)
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching CV experience:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching CV experience:', error);
    throw error;
  }
};

/**
 * Create a new CV experience entry
 */
export const createCVExperience = async (
  experience: Omit<DatabaseCVExperience, 'id' | 'created_at' | 'updated_at'>
): Promise<DatabaseCVExperience> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { data, error } = await supabase
      .from(CV_EXPERIENCE_TABLE)
      .insert(experience as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating CV experience:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating CV experience:', error);
    throw error;
  }
};

/**
 * Update an existing CV experience entry
 */
export const updateCVExperience = async (
  id: string,
  experience: Partial<Omit<DatabaseCVExperience, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const updateData: any = { ...experience, updated_at: new Date().toISOString() };

    const { error } = await supabase
      .from(CV_EXPERIENCE_TABLE)
      // @ts-expect-error - Supabase type inference issue with database types
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating CV experience:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating CV experience:', error);
    throw error;
  }
};

/**
 * Delete a CV experience entry
 */
export const deleteCVExperience = async (id: string): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { error } = await supabase.from(CV_EXPERIENCE_TABLE).delete().eq('id', id);

    if (error) {
      console.error('Error deleting CV experience:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting CV experience:', error);
    throw error;
  }
};

// ==================== CV Certifications ====================

/**
 * Get all CV certification entries from Supabase
 */
export const getAllCVCertifications = async (): Promise<DatabaseCVCertification[]> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { data, error } = await supabase
      .from(CV_CERTIFICATIONS_TABLE)
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching CV certifications:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching CV certifications:', error);
    throw error;
  }
};

/**
 * Create a new CV certification entry
 */
export const createCVCertification = async (
  certification: Omit<DatabaseCVCertification, 'id' | 'created_at' | 'updated_at'>
): Promise<DatabaseCVCertification> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { data, error } = await supabase
      .from(CV_CERTIFICATIONS_TABLE)
      .insert(certification as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating CV certification:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating CV certification:', error);
    throw error;
  }
};

/**
 * Update an existing CV certification entry
 */
export const updateCVCertification = async (
  id: string,
  certification: Partial<Omit<DatabaseCVCertification, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const updateData: any = { ...certification, updated_at: new Date().toISOString() };

    const { error } = await supabase
      .from(CV_CERTIFICATIONS_TABLE)
      // @ts-expect-error - Supabase type inference issue with database types
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating CV certification:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating CV certification:', error);
    throw error;
  }
};

/**
 * Delete a CV certification entry
 */
export const deleteCVCertification = async (id: string): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { error } = await supabase.from(CV_CERTIFICATIONS_TABLE).delete().eq('id', id);

    if (error) {
      console.error('Error deleting CV certification:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting CV certification:', error);
    throw error;
  }
};

// ==================== Combined CV Subscription ====================

export interface CVData {
  education: DatabaseCVEducation[];
  experience: DatabaseCVExperience[];
  certifications: DatabaseCVCertification[];
}

/**
 * Fetch all CV data (education, experience, certifications) in parallel
 */
const fetchAllCVData = async (): Promise<CVData> => {
  const [education, experience, certifications] = await Promise.all([
    getAllCVEducation(),
    getAllCVExperience(),
    getAllCVCertifications(),
  ]);
  return { education, experience, certifications };
};

/**
 * Subscribe to real-time CV updates across all three tables
 */
export const subscribeToCVUpdates = (
  callback: (cvData: CVData) => void,
  onError?: (error: Error) => void
) => {
  if (!supabase) {
    if (onError) {
      onError(new Error('Supabase is not initialized'));
    }
    return () => {}; // Return empty unsubscribe function
  }

  // Initial fetch
  fetchAllCVData()
    .then(callback)
    .catch((error) => {
      if (onError) {
        onError(error);
      }
    });

  const handleChange = () => {
    fetchAllCVData()
      .then(callback)
      .catch((error) => {
        console.error('Error in CV subscription:', error);
        if (onError) {
          onError(error);
        }
      });
  };

  // Subscribe to changes on all three CV tables
  const educationChannel = supabase
    .channel('cv-education-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: CV_EDUCATION_TABLE,
      },
      handleChange
    )
    .subscribe();

  const experienceChannel = supabase
    .channel('cv-experience-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: CV_EXPERIENCE_TABLE,
      },
      handleChange
    )
    .subscribe();

  const certificationsChannel = supabase
    .channel('cv-certifications-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: CV_CERTIFICATIONS_TABLE,
      },
      handleChange
    )
    .subscribe();

  // Return unsubscribe function that cleans up all three channels
  return () => {
    supabase.removeChannel(educationChannel);
    supabase.removeChannel(experienceChannel);
    supabase.removeChannel(certificationsChannel);
  };
};
