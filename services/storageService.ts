import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTask,
} from 'firebase/storage';
import { storage } from './firebase';

export interface UploadProgress {
  progress: number;
  state: 'running' | 'paused' | 'success' | 'error';
  url?: string;
  error?: Error;
}

/**
 * Upload an image file to Firebase Storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'images/posts/filename.jpg')
 * @param onProgress - Optional callback to track upload progress
 * @returns Promise that resolves with the download URL
 */
export const uploadImage = async (
  file: File,
  path: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized');
  }

  // Create a storage reference
  const storageRef = ref(storage, path);

  // Create upload task
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Calculate progress percentage
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        
        if (onProgress) {
          onProgress({
            progress,
            state: snapshot.state as 'running' | 'paused',
          });
        }
      },
      (error) => {
        // Handle upload errors
        console.error('Upload error:', error);
        if (onProgress) {
          onProgress({
            progress: 0,
            state: 'error',
            error,
          });
        }
        reject(error);
      },
      async () => {
        // Upload completed successfully, get download URL
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          if (onProgress) {
            onProgress({
              progress: 100,
              state: 'success',
              url: downloadURL,
            });
          }
          resolve(downloadURL);
        } catch (error) {
          console.error('Error getting download URL:', error);
          reject(error);
        }
      }
    );
  });
};

/**
 * Delete an image from Firebase Storage
 * @param path - The storage path of the file to delete
 */
export const deleteImage = async (path: string): Promise<void> => {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized');
  }

  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * Get the public download URL for a file
 * @param path - The storage path of the file
 * @returns Promise that resolves with the download URL
 */
export const getImageUrl = async (path: string): Promise<string> => {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized');
  }

  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error getting image URL:', error);
    throw error;
  }
};

/**
 * Generate a unique filename for an uploaded image
 * @param originalFilename - The original filename
 * @returns A unique filename with timestamp
 */
export const generateUniqueFilename = (originalFilename: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalFilename.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
};
