import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { POSTS, RECOMMENDATIONS } from '../constants';

export interface MigrationProgress {
  status: 'idle' | 'checking' | 'migrating' | 'success' | 'error';
  message: string;
  postsCount?: number;
  recommendationsCount?: number;
  error?: string;
}

/**
 * Check if Firebase already has data
 */
const checkIfDataExists = async (): Promise<{ 
  hasPosts: boolean; 
  hasRecommendations: boolean;
  postsCount: number;
  recommendationsCount: number;
}> => {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const postsSnapshot = await getDocs(collection(db, 'posts'));
    const recsSnapshot = await getDocs(collection(db, 'recommendations'));
    
    return {
      hasPosts: !postsSnapshot.empty,
      hasRecommendations: !recsSnapshot.empty,
      postsCount: postsSnapshot.size,
      recommendationsCount: recsSnapshot.size,
    };
  } catch (error) {
    console.error('Error checking for existing data:', error);
    throw error;
  }
};

/**
 * Migrate data from constants.ts to Firebase
 * This should be a one-time operation
 */
export const migrateDataToFirebase = async (
  onProgress?: (progress: MigrationProgress) => void
): Promise<void> => {
  if (!db) {
    const error = 'Firebase is not initialized. Please configure Firebase environment variables.';
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
        message: 'Checking for existing data in Firebase...',
      });
    }

    const existingData = await checkIfDataExists();

    if (existingData.hasPosts && existingData.hasRecommendations) {
      const message = `Data already exists in Firebase (${existingData.postsCount} posts, ${existingData.recommendationsCount} recommendations). Migration skipped.`;
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

    const batch = writeBatch(db);

    // Migrate posts
    if (!existingData.hasPosts) {
      if (onProgress) {
        onProgress({
          status: 'migrating',
          message: `Migrating ${POSTS.length} posts...`,
        });
      }

      POSTS.forEach((post) => {
        const postRef = doc(collection(db, 'posts'));
        batch.set(postRef, {
          ...post,
          isInitial: true, // Mark as initial/read-only
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    }

    // Migrate recommendations
    if (!existingData.hasRecommendations) {
      if (onProgress) {
        onProgress({
          status: 'migrating',
          message: `Migrating ${RECOMMENDATIONS.length} recommendations...`,
        });
      }

      RECOMMENDATIONS.forEach((rec) => {
        const recRef = doc(collection(db, 'recommendations'));
        batch.set(recRef, {
          ...rec,
          isInitial: true, // Mark as initial/read-only
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    }

    // Commit the batch
    await batch.commit();

    // Update progress: Success
    const migratedPosts = existingData.hasPosts ? 0 : POSTS.length;
    const migratedRecs = existingData.hasRecommendations ? 0 : RECOMMENDATIONS.length;
    
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
  if (!db) {
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
