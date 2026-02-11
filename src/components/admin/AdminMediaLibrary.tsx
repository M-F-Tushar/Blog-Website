import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { usePosts } from '../../hooks/usePosts';
import {
  Image,
  Upload,
  Trash2,
  Copy,
  Search,
  Grid,
  List,
  Check,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  uploadMedia,
  deleteMedia,
  listMedia,
  type MediaFile,
  initializeMediaBucket,
} from '../../services/storageService';
import { isSupabaseConfigured } from '../../supabase/client';
import { cosmic } from './ui/cosmicClassNames';

interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'file';
  size: number;
  uploadedAt: string;
  usedIn: string[];
  isUploaded?: boolean; // To distinguish between images from posts vs uploaded files
}

const AdminMediaLibrary: React.FC = () => {
  const { posts } = usePosts();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<MediaFile[]>([]);
  const [storageAvailable, setStorageAvailable] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract all images from posts
  const mediaItems = useMemo(() => {
    const items: MediaItem[] = [];
    const urlSet = new Set<string>();

    posts.forEach((post) => {
      // Extract cover image
      if (post.coverImage && !urlSet.has(post.coverImage)) {
        urlSet.add(post.coverImage);
        items.push({
          id: `cover-${post.id}`,
          url: post.coverImage,
          name: `Cover - ${post.title}`,
          type: 'image',
          size: Math.floor(Math.random() * 500000) + 100000,
          uploadedAt: post.date,
          usedIn: [post.title],
        });
      }

      // Extract images from content (markdown image pattern)
      const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
      let match;
      while ((match = imageRegex.exec(post.content)) !== null) {
        const url = match[2];
        if (!urlSet.has(url)) {
          urlSet.add(url);
          items.push({
            id: `content-${items.length}`,
            url,
            name: match[1] || `Image from ${post.title}`,
            type: 'image',
            size: Math.floor(Math.random() * 300000) + 50000,
            uploadedAt: post.date,
            usedIn: [post.title],
          });
        } else {
          // Add to usedIn if already exists
          const existing = items.find((item) => item.url === url);
          if (existing && !existing.usedIn.includes(post.title)) {
            existing.usedIn.push(post.title);
          }
        }
      }
    });

    return items;
  }, [posts]);

  // NOTE: Original filter kept for reference, but we now use filteredItemsAll
  // which includes both post images AND uploaded files

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedItems.size === filteredItemsAll.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItemsAll.map((item) => item.id)));
    }
  };

  const copyUrl = useCallback((url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setSuccessMessage('URL copied to clipboard!');
    setTimeout(() => {
      setCopiedUrl(null);
      setSuccessMessage('');
    }, 2000);
  }, []);

  // Initialize storage and load uploaded media on mount
  useEffect(() => {
    const init = async () => {
      if (isSupabaseConfigured()) {
        const available = await initializeMediaBucket();
        setStorageAvailable(available);
        if (available) {
          const media = await listMedia();
          setUploadedMedia(media);
        }
      }
    };
    init();
  }, []);

  // Combine post images with uploaded media
  const allMediaItems = useMemo(() => {
    const uploadedItems: MediaItem[] = uploadedMedia.map((m) => ({
      id: m.id,
      url: m.url,
      name: m.name,
      type: m.type,
      size: m.size,
      uploadedAt: m.uploadedAt,
      usedIn: [],
      isUploaded: true,
    }));
    return [...uploadedItems, ...mediaItems];
  }, [uploadedMedia, mediaItems]);

  // Filter by search - use allMediaItems
  const filteredItemsAll = useMemo(() => {
    if (!searchQuery) return allMediaItems;
    const query = searchQuery.toLowerCase();
    return allMediaItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.url.toLowerCase().includes(query) ||
        item.usedIn.some((post) => post.toLowerCase().includes(query))
    );
  }, [allMediaItems, searchQuery]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMessage('');

    try {
      for (const file of Array.from(files)) {
        const uploaded = await uploadMedia(file);
        if (uploaded) {
          setUploadedMedia((prev) => [uploaded, ...prev]);
        }
      }
      setSuccessMessage(`${files.length} file(s) uploaded successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to upload files');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (selectedItems.size === 0) return;

    // Only allow deleting uploaded files, not images extracted from posts
    const uploadedSelected = Array.from(selectedItems).filter(
      (id) => allMediaItems.find((item) => item.id === id)?.isUploaded
    );

    if (uploadedSelected.length === 0) {
      setErrorMessage('Cannot delete images that are part of posts. Edit the post to remove them.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    if (!window.confirm(`Delete ${uploadedSelected.length} file(s)? This cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage('');

    try {
      for (const id of uploadedSelected) {
        await deleteMedia(id);
        setUploadedMedia((prev) => prev.filter((m) => m.id !== id));
      }
      setSelectedItems(new Set());
      setSuccessMessage(`${uploadedSelected.length} file(s) deleted successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete files');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cosmic.container}>
      <div className="flex justify-between items-center mb-6 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <Image size={28} className="text-primary-400" />
          <div>
            <h1 className={cosmic.pageTitle}>Media Library</h1>
            <p className="text-sm text-secondary-400">
              {allMediaItems.length} items • {uploadedMedia.length} uploaded • {mediaItems.length}{' '}
              from posts
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="media-upload"
          />
          <label
            htmlFor="media-upload"
            className={`flex items-center gap-2 cursor-pointer ${
              storageAvailable && !isUploading
                ? cosmic.buttonPrimary
                : 'px-6 py-2.5 bg-elevated border border-white/10 text-secondary-500 rounded-lg cursor-not-allowed opacity-50'
            }`}
            title={
              storageAvailable
                ? 'Upload media files'
                : 'Configure Supabase Storage to enable uploads'
            }
          >
            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            {isUploading ? 'Uploading...' : 'Upload'}
          </label>
        </div>
      </div>

      {/* Storage not available warning */}
      {!storageAvailable && isSupabaseConfigured() && (
        <div className={`mb-4 ${cosmic.alertWarning}`}>
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            <span>
              Media storage not available. Create a &quot;media&quot; bucket in Supabase Storage to
              enable uploads.
            </span>
          </div>
        </div>
      )}

      {successMessage && (
        <div className={`mb-4 flex items-center gap-2 ${cosmic.alertSuccess}`}>
          <Check size={18} />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className={`mb-4 flex items-center gap-2 ${cosmic.alertError}`}>
          <X size={18} />
          {errorMessage}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, URL, or post..."
              className={`${cosmic.input} pl-10`}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={selectAll} className={cosmic.buttonSmall}>
            {selectedItems.size === filteredItemsAll.length ? 'Deselect All' : 'Select All'}
          </button>

          <div className="flex rounded-lg overflow-hidden border border-white/[0.06]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? cosmic.tabActive : cosmic.tabInactive} rounded-none border-0`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? cosmic.tabActive : cosmic.tabInactive} rounded-none border-0`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {selectedItems.size > 0 && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`flex items-center gap-2 ${cosmic.buttonDanger} disabled:opacity-50`}
            title="Delete selected uploaded files"
          >
            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            {isDeleting ? 'Deleting...' : `Delete (${selectedItems.size})`}
          </button>
        )}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItemsAll.map((item) => (
            <div
              key={item.id}
              className={`relative group cursor-pointer admin-glass rounded-xl overflow-hidden border-2 transition-all ${
                selectedItems.has(item.id)
                  ? 'border-primary-500 ring-2 ring-primary-500/30 shadow-glow-cyan'
                  : 'border-white/[0.06] hover:border-primary-500/30'
              }`}
              onClick={() => toggleSelect(item.id)}
            >
              <div className="aspect-square bg-elevated/50">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50" y="55" text-anchor="middle" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyUrl(item.url);
                    }}
                    className="p-1.5 bg-white/20 rounded-lg hover:bg-white/40 transition-colors"
                    title="Copy URL"
                  >
                    {copiedUrl === item.url ? (
                      <Check size={14} className="text-primary-400" />
                    ) : (
                      <Copy size={14} className="text-white" />
                    )}
                  </button>
                </div>
                <div>
                  <p className="text-white text-xs truncate">{item.name}</p>
                  <p className="text-secondary-400 text-xs">{formatSize(item.size)}</p>
                </div>
              </div>

              {/* Selection indicator */}
              {selectedItems.has(item.id) && (
                <div className="absolute top-2 left-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {filteredItemsAll.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-3 admin-glass rounded-xl cursor-pointer transition-all ${
                selectedItems.has(item.id)
                  ? 'border border-primary-500/20 shadow-glow-cyan'
                  : 'border border-white/[0.06] hover:border-white/10'
              }`}
              onClick={() => toggleSelect(item.id)}
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-elevated/50 flex-shrink-0">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-secondary-50 truncate">{item.name}</p>
                <p className="text-sm text-secondary-400 truncate">{item.url}</p>
                <p className="text-xs text-secondary-500">
                  Used in: {item.usedIn.slice(0, 2).join(', ')}
                  {item.usedIn.length > 2 ? ` +${item.usedIn.length - 2} more` : ''}
                </p>
              </div>

              <div className="text-right text-sm text-secondary-400">
                <p>{formatSize(item.size)}</p>
                <p>{item.uploadedAt}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyUrl(item.url);
                }}
                className={cosmic.buttonIcon}
                title="Copy URL"
              >
                {copiedUrl === item.url ? (
                  <Check size={18} className="text-primary-400" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {filteredItemsAll.length === 0 && (
        <div className={cosmic.emptyState}>
          <Image size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-secondary-400">
            {searchQuery
              ? 'No media found matching your search.'
              : 'No media found. Upload files or add images to your posts.'}
          </p>
          <p className="text-sm mt-2 text-secondary-500">
            Use the Upload button above or add images to your posts.
          </p>
        </div>
      )}

      <div className={`mt-6 ${cosmic.alertInfo}`}>
        <p className="text-sm">
          <strong>Media Library</strong>
          <br />• Images are automatically extracted from all your posts
          <br />• Click on an image to select, click the copy icon to copy its URL
          <br />• Use the copied URL in markdown:{' '}
          <code className="bg-elevated/80 px-2 py-1 rounded">![alt text](url)</code>
        </p>
      </div>
    </div>
  );
};

export default AdminMediaLibrary;
