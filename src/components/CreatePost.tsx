import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, Edit, Save, X } from 'lucide-react';
import { usePosts } from '../hooks/usePosts';
import { PostStatus } from '../types/types';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { isSupabaseConfigured } from '../services/supabase';
import { uploadImage, generateUniqueFilename } from '../services/supabaseStorageService';
import MarkdownToolbar from './admin/MarkdownToolbar';
import MarkdownRenderer from './markdown/MarkdownRenderer';

const CreatePost: React.FC = () => {
  const { postId } = useParams<{ postId?: string }>();
  const isEditMode = Boolean(postId);
  const { posts, addPost, updatePost } = usePosts();
  const { categories, authorName } = useSiteSettings();
  const navigate = useNavigate();
  const supabaseEnabled = isSupabaseConfigured();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0] || '');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<PostStatus>(PostStatus.DRAFT);
  const [coverImage, setCoverImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditMode && postId) {
      const postToEdit = posts.find(p => p.id === postId);
      if (postToEdit) {
        setTitle(postToEdit.title);
        setContent(postToEdit.content);
        setCategory(postToEdit.category);
        setTags(postToEdit.tags.join(', '));
        setStatus(postToEdit.status);
        setCoverImage(postToEdit.coverImage || '');
      }
    } else {
      // Reset form for new post
      setTitle('');
      setContent('');
      setCategory(categories[0] || '');
      setTags('');
      setStatus(PostStatus.DRAFT);
      setCoverImage('');
    }
  }, [postId, isEditMode, posts, categories]);

  const isValidImageUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      // Only allow http, https, and data URLs for images
      return ['http:', 'https:', 'data:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!supabaseEnabled) {
      alert('Supabase is not configured. Please use image URLs instead.');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB.');
      return;
    }

    try {
      setIsUploading(true);
      const filename = generateUniqueFilename(file.name);
      const path = `posts/${filename}`;

      const publicURL = await uploadImage(file, path, (progress) => {
        setUploadProgress(progress.progress);
      });

      setCoverImage(publicURL);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInsert = (text: string) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const currentContent = content;
    const newContent = currentContent.substring(0, start) + text + currentContent.substring(end);

    setContent(newContent);

    // Restore focus and selection
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + text.length, start + text.length);
      }
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category) {
      alert('Please fill in Title, Content, and Category.');
      return;
    }

    const postData = {
      title,
      content,
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      status,
      coverImage,
      excerpt: content.substring(0, 150) + '...',
      author: {
        name: authorName || 'Admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      readTime: `${Math.ceil(content.split(' ').length / 200)} min read`,
    };

    try {
      setIsSaving(true);
      if (isEditMode && postId) {
        await updatePost(postId, postData);
      } else {
        await addPost(postData);
      }
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClasses = "w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-serif text-gray-900 dark:text-white">
          {isEditMode ? 'Edit Post' : 'Create New Post'}
        </h1>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {isPreview ? <><Edit size={18} className="mr-2" /> Edit</> : <><Eye size={18} className="mr-2" /> Preview</>}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label htmlFor="title" className={labelClasses}>Title</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClasses} required />
            </div>

            <div>
              <label htmlFor="content" className={labelClasses}>Content</label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                {!isPreview ? (
                  <>
                    <MarkdownToolbar onInsert={handleInsert} />
                    <textarea
                      ref={textareaRef}
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full h-[500px] p-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none resize-y font-mono"
                      required
                    />
                  </>
                ) : (
                  <div className="h-[500px] overflow-y-auto p-8 bg-white dark:bg-gray-800">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <MarkdownRenderer content={content} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="coverImage" className={labelClasses}>Cover Image</label>
              <div className="space-y-3">
                <input
                  type="url"
                  id="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className={inputClasses}
                  placeholder="https://images.unsplash.com/..."
                />

                {supabaseEnabled && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Or upload an image:
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-accent file:text-white
                          hover:file:bg-indigo-700
                          file:cursor-pointer
                          disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {isUploading && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>Uploading...</span>
                          <span>{Math.round(uploadProgress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-accent h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {coverImage && isValidImageUrl(coverImage) && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="max-w-full h-48 object-cover rounded-md"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                      }}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="category" className={labelClasses}>Category</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClasses} required>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="tags" className={labelClasses}>Tags (comma-separated)</label>
              <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="status" className={labelClasses}>Status</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value as PostStatus)} className={inputClasses} required>
                <option value={PostStatus.DRAFT}>Draft</option>
                <option value={PostStatus.PUBLISHED}>Published</option>
              </select>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col space-y-3">
              <button
                type="submit"
                disabled={isSaving || isUploading}
                className="w-full px-6 py-3 bg-accent text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-offset-dark-gray transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSaving && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <Save size={18} className="mr-2" />
                {isSaving ? 'Saving...' : (isEditMode ? 'Update Post' : 'Save Post')}
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                disabled={isSaving || isUploading}
                className="w-full px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <X size={18} className="mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
