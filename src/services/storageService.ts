/**
 * Unified Storage Service — single source of truth for all Supabase Storage operations.
 * Uses a single "media" bucket with path prefixes for organization.
 */

import { supabase, isSupabaseConfigured } from '../supabase/client';

// ─── Types ──────────────────────────────────────────────────────────

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'file';
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface UploadProgress {
  progress: number;
  state: 'running' | 'paused' | 'success' | 'error';
  url?: string;
  error?: Error;
}

// ─── Constants ──────────────────────────────────────────────────────

const STORAGE_BUCKET = 'media';

const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  return MIME_TYPES[ext || ''] || 'application/octet-stream';
}

// ─── Core Functions ─────────────────────────────────────────────────

export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 11);
  const extension = originalFilename.split('.').pop()?.toLowerCase();
  return `${timestamp}-${randomString}.${extension}`;
}

export function getPublicUrl(path: string): string {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Upload a file to Supabase Storage.
 * @param file     The File to upload
 * @param path     Storage path (e.g. "uploads/abc.jpg" or "posts/xyz.png")
 * @param onProgress  Optional progress callback
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  path?: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured. Media upload not available.');
  }

  const filePath = path || `uploads/${generateUniqueFilename(file.name)}`;

  if (onProgress) {
    onProgress({ progress: 0, state: 'running' });
  }

  try {
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      if (onProgress) {
        onProgress({ progress: 0, state: 'error', error: error as Error });
      }
      throw error;
    }

    const publicUrl = getPublicUrl(data.path);

    if (onProgress) {
      onProgress({ progress: 100, state: 'success', url: publicUrl });
    }

    return publicUrl;
  } catch (error) {
    if (onProgress) {
      onProgress({ progress: 0, state: 'error', error: error as Error });
    }
    throw error;
  }
}

/**
 * Upload a file and return a full MediaFile object (used by Media Library).
 */
export async function uploadMedia(file: File): Promise<MediaFile | null> {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('Supabase not configured. Media upload not available.');
    return null;
  }

  const filePath = `uploads/${generateUniqueFilename(file.name)}`;
  const publicUrl = await uploadFile(file, filePath);

  const mimeType = file.type;
  const isImage = mimeType.startsWith('image/');

  return {
    id: filePath,
    name: file.name,
    url: publicUrl,
    type: isImage ? 'image' : 'file',
    size: file.size,
    mimeType,
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Delete a file from Supabase Storage.
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('Supabase not configured. Media delete not available.');
    return false;
  }

  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);

  if (error) {
    console.error('Error deleting file:', error);
    throw error;
  }

  return true;
}

/**
 * List all files in the uploads directory.
 */
export async function listFiles(prefix: string = 'uploads'): Promise<MediaFile[]> {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('Supabase not configured. Media list not available.');
    return [];
  }

  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).list(prefix, {
    limit: 100,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error) {
    console.error('Error listing files:', error);
    return [];
  }

  return (data || []).map((file) => {
    const fullPath = `${prefix}/${file.name}`;
    const { data: urlData } = supabase!.storage.from(STORAGE_BUCKET).getPublicUrl(fullPath);
    const mimeType = getMimeType(file.name);
    const isImage = mimeType.startsWith('image/');

    return {
      id: fullPath,
      name: file.name,
      url: urlData.publicUrl,
      type: isImage ? 'image' : 'file',
      size: file.metadata?.size || 0,
      mimeType,
      uploadedAt: file.created_at || new Date().toISOString(),
    } as MediaFile;
  });
}

/**
 * Check if the storage bucket exists and is accessible.
 */
export async function initializeBucket(): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const { error } = await supabase.storage.getBucket(STORAGE_BUCKET);
    if (error?.message?.includes('not found')) {
      console.warn(
        `Storage bucket '${STORAGE_BUCKET}' not found. Create it in Supabase dashboard.`
      );
      return false;
    }
    return !error;
  } catch (error) {
    console.error('Error checking storage bucket:', error);
    return false;
  }
}

// ─── Backward-compatible aliases ────────────────────────────────────

/** @deprecated Use deleteFile */
export const deleteMedia = deleteFile;
/** @deprecated Use listFiles */
export const listMedia = listFiles;
/** @deprecated Use initializeBucket */
export const initializeMediaBucket = initializeBucket;
/** @deprecated Use uploadFile */
export const uploadImage = uploadFile;
/** @deprecated Use deleteFile */
export const deleteImage = deleteFile;
/** @deprecated Use getPublicUrl */
export const getImageUrl = getPublicUrl;
