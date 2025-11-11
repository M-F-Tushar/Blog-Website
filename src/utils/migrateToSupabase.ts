import { supabase } from '../services/supabase';
import { POSTS, RECOMMENDATIONS } from '../constants/constants';

export interface MigrationProgress {
  status: 'idle' | 'checking' | 'migrating' | 'success' | 'error';
  message: string;
  postsCount?: number;
  recommendationsCount?: number;
  error?: string;
}

/**
 * Check if Supabase already has data
 */
const checkIfDataExists = async (): Promise<{ 
  hasPosts: boolean; 
  hasRecommendations: boolean;
  postsCount: number;
  recommendationsCount: number;
}> => {
  if (!supabase) {
    throw new Error('Supabase is not initialized');
  }

  try {
    const { count: postsCount, error: postsError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    const { count: recsCount, error: recsError } = await supabase
      .from('recommendations')
      .select('*', { count: 'exact', head: true });

    if (postsError) throw postsError;
    if (recsError) throw recsError;
    
    return {
      hasPosts: (postsCount || 0) > 0,
      hasRecommendations: (recsCount || 0) > 0,
      postsCount: postsCount || 0,
      recommendationsCount: recsCount || 0,
    };
  } catch (error) {
    console.error('Error checking for existing data:', error);
    throw error;
  }
};

/**
 * Migrate data from constants.ts to Supabase
 * This should be a one-time operation
 */
export const migrateDataToSupabase = async (
  onProgress?: (progress: MigrationProgress) => void
): Promise<void> => {
  if (!supabase) {
    const error = 'Supabase is not initialized. Please configure Supabase environment variables.';
    if (onProgress) {
      onProgress({
        status: 'error',
        message: error,
        error,
      });
    }
    throw new Error(error);
  }

  try {
    // Update progress: Checking for existing data
    if (onProgress) {
      onProgress({
        status: 'checking',
        message: 'Checking for existing data in Supabase...',
      });
    }

    const existingData = await checkIfDataExists();

    if (existingData.hasPosts && existingData.hasRecommendations) {
      const message = `Data already exists in Supabase (${existingData.postsCount} posts, ${existingData.recommendationsCount} recommendations). Migration skipped.`;
      if (onProgress) {
        onProgress({
          status: 'success',
          message,
          postsCount: existingData.postsCount,
          recommendationsCount: existingData.recommendationsCount,
        });
      }
      return;
    }

    // Update progress: Starting migration
    if (onProgress) {
      onProgress({
        status: 'migrating',
        message: 'Starting data migration...',
      });
    }

    let migratedPosts = 0;
    let migratedRecs = 0;

    // Migrate posts
    if (!existingData.hasPosts) {
      if (onProgress) {
        onProgress({
          status: 'migrating',
          message: `Migrating ${POSTS.length} posts...`,
        });
      }

      const postsToInsert = POSTS.map((post) => ({
        title: post.title,
        date: post.date,
        category: post.category,
        tags: post.tags,
        excerpt: post.excerpt,
        status: post.status,
        cover_image: post.coverImage || null,
        content: post.content,
        is_initial: true, // Mark as initial/read-only
      }));

      const { error: postsError } = await supabase
        .from('posts')
        .insert(postsToInsert as any);

      if (postsError) {
        console.error('Error migrating posts:', postsError);
        throw postsError;
      }

      migratedPosts = POSTS.length;
    }

    // Migrate recommendations
    if (!existingData.hasRecommendations) {
      if (onProgress) {
        onProgress({
          status: 'migrating',
          message: `Migrating ${RECOMMENDATIONS.length} recommendations...`,
        });
      }

      const recsToInsert = RECOMMENDATIONS.map((rec) => ({
        title: rec.title,
        url: rec.url,
        description: rec.description,
        type: rec.type,
        is_initial: true, // Mark as initial/read-only
      }));

      const { error: recsError } = await supabase
        .from('recommendations')
        .insert(recsToInsert as any);

      if (recsError) {
        console.error('Error migrating recommendations:', recsError);
        throw recsError;
      }

      migratedRecs = RECOMMENDATIONS.length;
    }

    // Update progress: Success
    if (onProgress) {
      onProgress({
        status: 'success',
        message: `Migration completed successfully! Migrated ${migratedPosts} posts and ${migratedRecs} recommendations.`,
        postsCount: existingData.postsCount + migratedPosts,
        recommendationsCount: existingData.recommendationsCount + migratedRecs,
      });
    }

    console.log('Data migration completed successfully');
  } catch (error) {
    console.error('Error migrating data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    if (onProgress) {
      onProgress({
        status: 'error',
        message: 'Migration failed',
        error: errorMessage,
      });
    }
    
    throw error;
  }
};

/**
 * Get migration status
 */
export const getMigrationStatus = async (): Promise<{
  isComplete: boolean;
  postsCount: number;
  recommendationsCount: number;
}> => {
  if (!supabase) {
    return {
      isComplete: false,
      postsCount: 0,
      recommendationsCount: 0,
    };
  }

  try {
    const data = await checkIfDataExists();
    return {
      isComplete: data.hasPosts && data.hasRecommendations,
      postsCount: data.postsCount,
      recommendationsCount: data.recommendationsCount,
    };
  } catch (error) {
    console.error('Error checking migration status:', error);
    return {
      isComplete: false,
      postsCount: 0,
      recommendationsCount: 0,
    };
  }
};
