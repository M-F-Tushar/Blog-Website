import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePosts } from '../../hooks/usePosts';
import { Image, Upload, Trash2, Copy, Search, Grid, List, Check, X } from 'lucide-react';

interface MediaItem {
    id: string;
    url: string;
    name: string;
    type: 'image' | 'file';
    size: number;
    uploadedAt: string;
    usedIn: string[];
}

const AdminMediaLibrary: React.FC = () => {
    const { posts } = usePosts();
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Extract all images from posts
    const mediaItems = useMemo(() => {
        const items: MediaItem[] = [];
        const urlSet = new Set<string>();

        posts.forEach(post => {
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
                    const existing = items.find(item => item.url === url);
                    if (existing && !existing.usedIn.includes(post.title)) {
                        existing.usedIn.push(post.title);
                    }
                }
            }
        });

        return items;
    }, [posts]);

    // Filter by search
    const filteredItems = useMemo(() => {
        if (!searchQuery) return mediaItems;
        const query = searchQuery.toLowerCase();
        return mediaItems.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.url.toLowerCase().includes(query) ||
            item.usedIn.some(post => post.toLowerCase().includes(query))
        );
    }, [mediaItems, searchQuery]);

    const toggleSelect = (id: string) => {
        setSelectedItems(prev => {
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
        if (selectedItems.size === filteredItems.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(filteredItems.map(item => item.id)));
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

    const formatSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const inputClasses = "w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200";

    return (
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center gap-3">
                    <Image size={28} className="text-accent" />
                    <div>
                        <h1 className="text-2xl font-bold font-serif text-gray-900 dark:text-white">
                            Media Library
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {mediaItems.length} items • Extracted from {posts.length} posts
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="Upload new media (coming soon)"
                        disabled
                    >
                        <Upload size={18} />
                        Upload
                    </button>
                </div>
            </div>

            {successMessage && (
                <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md flex items-center gap-2">
                    <Check size={18} />
                    {successMessage}
                </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, URL, or post..."
                            className={`${inputClasses} pl-10`}
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={selectAll}
                        className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        {selectedItems.size === filteredItems.length ? 'Deselect All' : 'Select All'}
                    </button>

                    <div className="flex border rounded-md overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 ${viewMode === 'grid' ? 'bg-accent text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 ${viewMode === 'list' ? 'bg-accent text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>

                {selectedItems.size > 0 && (
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        title="Delete selected (coming soon)"
                        disabled
                    >
                        <Trash2 size={18} />
                        Delete ({selectedItems.size})
                    </button>
                )}
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredItems.map(item => (
                        <div
                            key={item.id}
                            className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedItems.has(item.id)
                                    ? 'border-accent ring-2 ring-accent/50'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                                }`}
                            onClick={() => toggleSelect(item.id)}
                        >
                            <div className="aspect-square bg-gray-100 dark:bg-gray-700">
                                <img
                                    src={item.url}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50" y="55" text-anchor="middle" fill="%23999" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                                    }}
                                />
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                <div className="flex justify-end">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); copyUrl(item.url); }}
                                        className="p-1.5 bg-white/20 rounded hover:bg-white/40 transition-colors"
                                        title="Copy URL"
                                    >
                                        {copiedUrl === item.url ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-white" />}
                                    </button>
                                </div>
                                <div>
                                    <p className="text-white text-xs truncate">{item.name}</p>
                                    <p className="text-gray-300 text-xs">{formatSize(item.size)}</p>
                                </div>
                            </div>

                            {/* Selection indicator */}
                            {selectedItems.has(item.id) && (
                                <div className="absolute top-2 left-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
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
                    {filteredItems.map(item => (
                        <div
                            key={item.id}
                            className={`flex items-center gap-4 p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedItems.has(item.id)
                                    ? 'border-accent bg-accent/5'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 bg-white dark:bg-gray-800'
                                }`}
                            onClick={() => toggleSelect(item.id)}
                        >
                            <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                <img
                                    src={item.url}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E';
                                    }}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{item.url}</p>
                                <p className="text-xs text-gray-400">
                                    Used in: {item.usedIn.slice(0, 2).join(', ')}{item.usedIn.length > 2 ? ` +${item.usedIn.length - 2} more` : ''}
                                </p>
                            </div>

                            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                                <p>{formatSize(item.size)}</p>
                                <p>{item.uploadedAt}</p>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); copyUrl(item.url); }}
                                className="p-2 text-gray-400 hover:text-accent transition-colors"
                                title="Copy URL"
                            >
                                {copiedUrl === item.url ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {filteredItems.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <Image size={48} className="mx-auto mb-4 opacity-30" />
                    <p>{searchQuery ? 'No media found matching your search.' : 'No media found in your posts.'}</p>
                    <p className="text-sm mt-2">Add images to your posts and they will appear here.</p>
                </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Media Library</strong>
                    <br />• Images are automatically extracted from all your posts
                    <br />• Click on an image to select, click the copy icon to copy its URL
                    <br />• Use the copied URL in markdown: <code>![alt text](url)</code>
                </p>
            </div>
        </div>
    );
};

export default AdminMediaLibrary;
