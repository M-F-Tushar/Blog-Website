import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecommendations } from '../../hooks/useRecommendations';
import { RecommendationType, type Recommendation } from '../../types/types';
import { cosmic } from './ui/cosmicClassNames';

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
      const recToEdit = recommendations.find((r) => r.id === recId);
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
      navigate('/recommendations');
    } catch (error) {
      console.error('Error saving recommendation:', error);
      alert('Failed to save recommendation. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={cosmic.containerSm}>
      <h1 className={`${cosmic.pageTitle} text-center mb-6`}>
        {isEditMode ? 'Edit Recommendation' : 'Add New Recommendation'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className={cosmic.label}>
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={cosmic.input}
            required
          />
        </div>
        <div>
          <label htmlFor="url" className={cosmic.label}>
            URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={cosmic.input}
            placeholder="https://example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="type" className={cosmic.label}>
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as RecommendationType)}
            className={cosmic.select}
            required
          >
            {Object.values(RecommendationType).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="description" className={cosmic.label}>
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${cosmic.textarea} h-32`}
            required
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/recommendations')}
            disabled={isSaving}
            className={`${cosmic.buttonSecondary} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className={`${cosmic.buttonPrimary} flex items-center disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSaving && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isSaving ? 'Saving...' : isEditMode ? 'Update Recommendation' : 'Save Recommendation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecommendationForm;
