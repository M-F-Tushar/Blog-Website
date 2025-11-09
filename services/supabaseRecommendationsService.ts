import { supabase, recommendationToDatabase, recommendationFromDatabase } from './supabase';
import { Recommendation } from '../types';

const RECOMMENDATIONS_TABLE = 'recommendations';

/**
 * Get all recommendations from Supabase
 */
export const getAllRecommendations = async (): Promise<Recommendation[]> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { data, error } = await supabase
      .from(RECOMMENDATIONS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }

    return (data || []).map(recommendationFromDatabase);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

/**
 * Get a single recommendation by ID
 */
export const getRecommendationById = async (id: string): Promise<Recommendation | null> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { data, error } = await supabase
      .from(RECOMMENDATIONS_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      console.error('Error fetching recommendation:', error);
      throw error;
    }

    return data ? recommendationFromDatabase(data) : null;
  } catch (error) {
    console.error('Error fetching recommendation:', error);
    throw error;
  }
};

/**
 * Create a new recommendation
 */
export const createRecommendation = async (
  recommendation: Omit<Recommendation, 'id'>
): Promise<Recommendation> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const dbRec = recommendationToDatabase(recommendation);
    const { data, error } = await supabase
      .from(RECOMMENDATIONS_TABLE)
      .insert(dbRec)
      .select()
      .single();

    if (error) {
      console.error('Error creating recommendation:', error);
      throw error;
    }

    return recommendationFromDatabase(data);
  } catch (error) {
    console.error('Error creating recommendation:', error);
    throw error;
  }
};

/**
 * Update an existing recommendation
 */
export const updateRecommendation = async (
  id: string,
  recommendation: Partial<Recommendation>
): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const updateData: any = {};
    
    if (recommendation.title !== undefined) updateData.title = recommendation.title;
    if (recommendation.url !== undefined) updateData.url = recommendation.url;
    if (recommendation.description !== undefined) updateData.description = recommendation.description;
    if (recommendation.type !== undefined) updateData.type = recommendation.type;
    
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from(RECOMMENDATIONS_TABLE)
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating recommendation:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating recommendation:', error);
    throw error;
  }
};

/**
 * Delete a recommendation
 */
export const deleteRecommendation = async (id: string): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { error } = await supabase
      .from(RECOMMENDATIONS_TABLE)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting recommendation:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting recommendation:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time recommendations updates
 */
export const subscribeToRecommendationsUpdates = (
  callback: (recommendations: Recommendation[]) => void,
  onError?: (error: Error) => void
) => {
  if (!supabase) {
    if (onError) {
      onError(new Error('Supabase is not initialized'));
    }
    return () => {}; // Return empty unsubscribe function
  }

  // Initial fetch
  getAllRecommendations()
    .then(callback)
    .catch((error) => {
      if (onError) {
        onError(error);
      }
    });

  // Subscribe to changes
  const channel = supabase
    .channel('recommendations-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: RECOMMENDATIONS_TABLE,
      },
      () => {
        // Refetch all recommendations when any change occurs
        getAllRecommendations()
          .then(callback)
          .catch((error) => {
            console.error('Error in recommendations subscription:', error);
            if (onError) {
              onError(error);
            }
          });
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};
