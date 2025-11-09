import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'app_settings';

export interface AppSettings {
  featuredPostId: string | null;
  siteTitle?: string;
  siteDescription?: string;
}

// Get app settings
export const getSettings = async (): Promise<AppSettings> => {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      return settingsSnap.data() as AppSettings;
    }
    
    // Return default settings if document doesn't exist
    return {
      featuredPostId: null,
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

// Update featured post ID
export const setFeaturedPostId = async (postId: string | null): Promise<void> => {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }

  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      await updateDoc(settingsRef, { featuredPostId: postId });
    } else {
      // Create the document if it doesn't exist
      await setDoc(settingsRef, { featuredPostId: postId });
    }
  } catch (error) {
    console.error('Error updating featured post:', error);
    throw error;
  }
};

// Subscribe to settings updates
export const subscribeToSettingsUpdates = (
  callback: (settings: AppSettings) => void,
  onError?: (error: Error) => void
) => {
  if (!db) {
    if (onError) {
      onError(new Error('Firebase is not initialized'));
    }
    return () => {};
  }

  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    
    const unsubscribe = onSnapshot(
      settingsRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          callback(docSnapshot.data() as AppSettings);
        } else {
          callback({ featuredPostId: null });
        }
      },
      (error) => {
        console.error('Error in settings subscription:', error);
        if (onError) {
          onError(error as Error);
        }
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up settings subscription:', error);
    if (onError) {
      onError(error as Error);
    }
    return () => {};
  }
};
