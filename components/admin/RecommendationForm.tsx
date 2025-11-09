import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecommendations } from '../../hooks/useRecommendations';
import { RecommendationType, Recommendation } from '../../types';

const RecommendationForm: React.FC = () => {
  const { recId } = useParams<{ recId?: string }>();
  const isEditMode = Boolean(recId);
  const { recommendations, addRecommendation, updateRecommendation } = useRecommendations();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<RecommendationType>(RecommendationType.ARTICLE);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url || !description || !type) {
        alert('Please fill in all fields.');
        return;
    }

    const recData = { title, url, description, type };
    
    if (isEditMode && recId) {
      updateRecommendation(recId, recData);
    } else {
      addRecommendation(recData);
    }

    navigate('/admin/recommendations');
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
        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-accent text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-offset-dark-gray transition-colors"
          >
            {isEditMode ? 'Update Recommendation' : 'Save Recommendation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecommendationForm;