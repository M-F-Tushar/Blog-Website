import { supabase } from '../supabase/client';
import { recommendationToDatabase, recommendationFromDatabase } from '../types/converters';
import type { Recommendation } from '../types/types';
import { RecommendationSchema } from '../utils/validation';
import DOMPurify from 'dompurify';

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
    // Validate input
    const validatedRec = RecommendationSchema.parse({
      title: recommendation.title,
      description: recommendation.description,
      url: recommendation.url,
      type: recommendation.type,
      tags: recommendation.tags || [],
      imageUrl: recommendation.thumbnail,
    });

    // Sanitize content
    const sanitizedRec = {
      ...recommendation,
      title: DOMPurify.sanitize(validatedRec.title, { ALLOWED_TAGS: [] }),
      description: DOMPurify.sanitize(validatedRec.description, { ALLOWED_TAGS: [] }),
    };

    const dbRec = recommendationToDatabase(sanitizedRec);
    const { data, error } = await supabase
      .from(RECOMMENDATIONS_TABLE)
      .insert(dbRec as any) // eslint-disable-line @typescript-eslint/no-explicit-any
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
    // Partial validation for provided fields
    if (Object.keys(recommendation).length > 0) {
      const validationData: Record<string, unknown> = {};
      if (recommendation.title !== undefined) validationData.title = recommendation.title;
      if (recommendation.description !== undefined)
        validationData.description = recommendation.description;
      if (recommendation.url !== undefined) validationData.url = recommendation.url;
      if (recommendation.type !== undefined) validationData.type = recommendation.type;
      if (recommendation.tags !== undefined) validationData.tags = recommendation.tags;
      if (recommendation.thumbnail !== undefined)
        validationData.imageUrl = recommendation.thumbnail;

      RecommendationSchema.partial().parse(validationData);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (recommendation.title !== undefined)
      updateData.title = DOMPurify.sanitize(recommendation.title, { ALLOWED_TAGS: [] });
    if (recommendation.url !== undefined) updateData.url = recommendation.url;
    if (recommendation.description !== undefined)
      updateData.description = DOMPurify.sanitize(recommendation.description, { ALLOWED_TAGS: [] });
    if (recommendation.type !== undefined) updateData.type = recommendation.type;

    // Updated fields
    if (recommendation.thumbnail !== undefined) updateData.thumbnail = recommendation.thumbnail;
    if (recommendation.difficulty !== undefined) updateData.difficulty = recommendation.difficulty;
    if (recommendation.estimatedTime !== undefined)
      updateData.estimated_time = recommendation.estimatedTime;
    if (recommendation.authorNote !== undefined) updateData.author_note = recommendation.authorNote;
    if (recommendation.tags !== undefined) updateData.tags = recommendation.tags;
    if (recommendation.isFeatured !== undefined) updateData.is_featured = recommendation.isFeatured;

    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from(RECOMMENDATIONS_TABLE)
      // @ts-expect-error - Supabase type inference issue with database types
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
    const { error } = await supabase.from(RECOMMENDATIONS_TABLE).delete().eq('id', id);

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
    supabase!.removeChannel(channel);
  };
};
