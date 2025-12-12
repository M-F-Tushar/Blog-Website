import { supabase, isSupabaseConfigured } from './supabase';

export interface MediaFile {
    id: string;
    name: string;
    url: string;
    type: 'image' | 'file';
    size: number;
    mimeType: string;
    uploadedAt: string;
}

const STORAGE_BUCKET = 'media';

/**
 * Upload a file to Supabase Storage
 */
export async function uploadMedia(file: File): Promise<MediaFile | null> {
    if (!isSupabaseConfigured() || !supabase) {
        console.warn('Supabase not configured. Media upload not available.');
        return null;
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    try {
        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) {
            console.error('Error uploading file:', uploadError);
            throw new Error(uploadError.message);
        }

        // Get the public URL
        const { data: urlData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(filePath);

        const mimeType = file.type;
        const isImage = mimeType.startsWith('image/');

        return {
            id: filePath,
            name: file.name,
            url: urlData.publicUrl,
            type: isImage ? 'image' : 'file',
            size: file.size,
            mimeType,
            uploadedAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Error uploading media:', error);
        throw error;
    }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteMedia(filePath: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) {
        console.warn('Supabase not configured. Media delete not available.');
        return false;
    }

    try {
        const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([filePath]);

        if (error) {
            console.error('Error deleting file:', error);
            throw new Error(error.message);
        }

        return true;
    } catch (error) {
        console.error('Error deleting media:', error);
        throw error;
    }
}

/**
 * List all files in the media bucket
 */
export async function listMedia(): Promise<MediaFile[]> {
    if (!isSupabaseConfigured() || !supabase) {
        console.warn('Supabase not configured. Media list not available.');
        return [];
    }

    try {
        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .list('uploads', {
                limit: 100,
                sortBy: { column: 'created_at', order: 'desc' },
            });

        if (error) {
            console.error('Error listing files:', error);
            return [];
        }

        return (data || []).map((file) => {
            const { data: urlData } = supabase!.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(`uploads/${file.name}`);

            const mimeType = getMimeType(file.name);
            const isImage = mimeType.startsWith('image/');

            return {
                id: `uploads/${file.name}`,
                name: file.name,
                url: urlData.publicUrl,
                type: isImage ? 'image' : 'file',
                size: file.metadata?.size || 0,
                mimeType,
                uploadedAt: file.created_at || new Date().toISOString(),
            } as MediaFile;
        });
    } catch (error) {
        console.error('Error listing media:', error);
        return [];
    }
}

/**
 * Get MIME type from file extension
 */
function getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
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
    return mimeTypes[ext || ''] || 'application/octet-stream';
}

/**
 * Check if storage bucket exists, create if not
 */
export async function initializeMediaBucket(): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) {
        return false;
    }

    try {
        // Try to list the bucket to see if it exists
        const { error } = await supabase.storage.getBucket(STORAGE_BUCKET);

        if (error?.message?.includes('not found')) {
            // Bucket doesn't exist, user needs to create it in Supabase dashboard
            console.warn(`Storage bucket '${STORAGE_BUCKET}' not found. Please create it in Supabase dashboard.`);
            return false;
        }

        return !error;
    } catch (error) {
        console.error('Error checking storage bucket:', error);
        return false;
    }
}
