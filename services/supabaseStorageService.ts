import { supabase } from './supabase';

const STORAGE_BUCKET = 'blog-images';

export interface UploadProgress {
  progress: number;
  state: 'running' | 'paused' | 'success' | 'error';
  url?: string;
  error?: Error;
}

/**
 * Upload an image file to Supabase Storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'posts/filename.jpg')
 * @param onProgress - Optional callback to track upload progress
 * @returns Promise that resolves with the public URL
 */
export const uploadImage = async (
  file: File,
  path: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  if (!supabase) {
    throw new Error('Supabase Storage is not initialized');
  }

  try {
    // Notify upload start
    if (onProgress) {
      onProgress({
        progress: 0,
        state: 'running',
      });
    }

    // Upload the file
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      if (onProgress) {
        onProgress({
          progress: 0,
          state: 'error',
          error: error as Error,
        });
      }
      throw error;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    const publicUrl = urlData.publicUrl;

    if (onProgress) {
      onProgress({
        progress: 100,
        state: 'success',
        url: publicUrl,
      });
    }

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    if (onProgress) {
      onProgress({
        progress: 0,
        state: 'error',
        error: error as Error,
      });
    }
    throw error;
  }
};

/**
 * Delete an image from Supabase Storage
 * @param path - The storage path of the file to delete
 */
export const deleteImage = async (path: string): Promise<void> => {
  if (!supabase) {
    throw new Error('Supabase Storage is not initialized');
  }

  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path]);

    if (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * Get the public URL for a file
 * @param path - The storage path of the file
 * @returns The public URL
 */
export const getImageUrl = (path: string): string => {
  if (!supabase) {
    throw new Error('Supabase Storage is not initialized');
  }

  try {
    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(path);

    return data.publicUrl;
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
