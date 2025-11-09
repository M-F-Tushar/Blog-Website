import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { PostStatus } from '../types';
import { useSiteSettings } from '../hooks/useSiteSettings';

const CreatePost: React.FC = () => {
  const { postId } = useParams<{ postId?: string }>();
  const isEditMode = Boolean(postId);
  const { posts, addPost, updatePost } = usePosts();
  const { categories } = useSiteSettings();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0] || '');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<PostStatus>(PostStatus.DRAFT);
  const [coverImage, setCoverImage] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
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
    };

    if (isEditMode && postId) {
      updatePost(postId, postData);
    } else {
      addPost(postData);
    }

    navigate('/admin/dashboard');
  };
  
  const inputClasses = "w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold font-serif text-center mb-8 text-gray-900 dark:text-white">
        {isEditMode ? 'Edit Post' : 'Create New Post'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className={labelClasses}>Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClasses} required />
        </div>
        <div>
          <label htmlFor="content" className={labelClasses}>Content (Markdown)</label>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className={`${inputClasses} h-64`} required />
        </div>
        <div>
            <label htmlFor="coverImage" className={labelClasses}>Cover Image URL (Optional)</label>
            <input type="url" id="coverImage" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className={inputClasses} placeholder="https://images.unsplash.com/..."/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>
        <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => navigate('/admin/dashboard')} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition-colors">
                Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-accent text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-offset-dark-gray transition-colors">
                {isEditMode ? 'Update Post' : 'Save Post'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
