import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecommendations } from '../../hooks/useRecommendations';
import { RecommendationType, Recommendation } from '../../types/types';

const RecommendationForm: React.FC = () => {
  const { recId } = useParams<{ recId?: string }>();
  const isEditMode = Boolean(recId);
  const { recommendations, addRecommendation, updateRecommendation } = useRecommendations();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<RecommendationType>(RecommendationType.ARTICLE);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const recToEdit = recommendations.find(r => r.id === recId);
      if (recToEdit) {
        setTitle(recToEdit.title);
        setUrl(recToEdit.url);
        setDescription(recToEdit.description);
        setType(recToEdit.type);
      }
    }
  }, [recId, isEditMode, recommendations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url || !description || !type) {
        alert('Please fill in all fields.');
        return;
    }

    const recData = { title, url, description, type };
    
    try {
      setIsSaving(true);
      if (isEditMode && recId) {
        await updateRecommendation(recId, recData);
      } else {
        await addRecommendation(recData);
      }
      navigate('/admin/recommendations');
    } catch (error) {
      console.error('Error saving recommendation:', error);
      alert('Failed to save recommendation. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClasses = "w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold font-serif text-center mb-6 text-gray-900 dark:text-white">
        {isEditMode ? 'Edit Recommendation' : 'Add New Recommendation'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className={labelClasses}>Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClasses} required />
        </div>
         <div>
          <label htmlFor="url" className={labelClasses}>URL</label>
          <input type="url" id="url" value={url} onChange={(e) => setUrl(e.target.value)} className={inputClasses} placeholder="https://example.com" required />
        </div>
        <div>
          <label htmlFor="type" className={labelClasses}>Type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value as RecommendationType)} className={inputClasses} required>
            {Object.values(RecommendationType).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="description" className={labelClasses}>Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClasses} h-32`} required />
        </div>
        <div className="flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={() => navigate('/admin/recommendations')} 
            disabled={isSaving}
            className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-accent text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-offset-dark-gray transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSaving && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSaving ? 'Saving...' : (isEditMode ? 'Update Recommendation' : 'Save Recommendation')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecommendationForm;