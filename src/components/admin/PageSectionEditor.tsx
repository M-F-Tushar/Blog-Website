import React, { useState, useEffect } from 'react';
import { PageSection } from '../../hooks/usePageContent';

interface Props {
  section?: PageSection;
  pageName: string;
  onSave: (data: Omit<PageSection, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

const inputClasses =
  'w-full px-3 py-2 text-gray-700 dark:text-secondary-200 bg-white dark:bg-elevated border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200';
const labelClasses = 'block text-sm font-medium text-gray-700 dark:text-secondary-300 mb-1';

const PageSectionEditor: React.FC<Props> = ({ section, pageName, onSave, onCancel }) => {
  const isEdit = Boolean(section);
  const [sectionKey, setSectionKey] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [metadataText, setMetadataText] = useState('');
  const [metadataError, setMetadataError] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (section) {
      setSectionKey(section.section_key);
      setTitle(section.title || '');
      setSubtitle(section.subtitle || '');
      setContent(section.content || '');
      setImageUrl(section.image_url || '');
      setMetadataText(section.metadata ? JSON.stringify(section.metadata, null, 2) : '');
      setSortOrder(section.sort_order);
      setVisible(section.visible);
    }
  }, [section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionKey.trim()) {
      alert('Section key is required.');
      return;
    }

    let metadata: Record<string, unknown> | undefined;
    if (metadataText.trim()) {
      try {
        metadata = JSON.parse(metadataText);
        setMetadataError('');
      } catch {
        setMetadataError('Invalid JSON. Please fix the metadata field.');
        return;
      }
    }

    try {
      setIsSaving(true);
      await onSave({
        page: pageName,
        section_key: sectionKey,
        title: title || undefined,
        subtitle: subtitle || undefined,
        content: content || undefined,
        image_url: imageUrl || undefined,
        metadata,
        sort_order: sortOrder,
        visible,
      });
    } catch (err) {
      console.error('Error saving section:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        {isEdit ? 'Edit Section' : 'Create Section'} —{' '}
        <span className="text-accent">{pageName}</span>
      </h3>

      {/* Section Key */}
      <div>
        <label htmlFor="sectionKey" className={labelClasses}>
          Section Key <span className="text-red-500">*</span>
        </label>
        <input
          id="sectionKey"
          type="text"
          value={sectionKey}
          onChange={(e) => setSectionKey(e.target.value)}
          readOnly={isEdit}
          placeholder="e.g. hero, about-intro, contact-form"
          className={`${inputClasses} ${isEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
        />
        {isEdit && (
          <p className="mt-1 text-xs text-gray-500 dark:text-secondary-400">
            Section key cannot be changed after creation.
          </p>
        )}
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className={labelClasses}>
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Section title"
          className={inputClasses}
        />
      </div>

      {/* Subtitle */}
      <div>
        <label htmlFor="subtitle" className={labelClasses}>
          Subtitle
        </label>
        <input
          id="subtitle"
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Section subtitle"
          className={inputClasses}
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className={labelClasses}>
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Main content for this section..."
          className={`${inputClasses} h-32 resize-y`}
        />
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="imageUrl" className={labelClasses}>
          Image URL
        </label>
        <input
          id="imageUrl"
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className={inputClasses}
        />
      </div>

      {/* Metadata (JSON) */}
      <div>
        <label htmlFor="metadata" className={labelClasses}>
          Metadata (JSON)
        </label>
        <textarea
          id="metadata"
          value={metadataText}
          onChange={(e) => {
            setMetadataText(e.target.value);
            if (metadataError) setMetadataError('');
          }}
          placeholder='{ "key": "value" }'
          className={`${inputClasses} h-32 resize-y font-mono text-sm`}
        />
        {metadataError && <p className="mt-1 text-sm text-red-500">{metadataError}</p>}
      </div>

      {/* Sort Order */}
      <div>
        <label htmlFor="sortOrder" className={labelClasses}>
          Sort Order
        </label>
        <input
          id="sortOrder"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
          className={inputClasses}
        />
      </div>

      {/* Visible */}
      <div className="flex items-center gap-3">
        <input
          id="visible"
          type="checkbox"
          checked={visible}
          onChange={(e) => setVisible(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
        />
        <label
          htmlFor="visible"
          className="text-sm font-medium text-gray-700 dark:text-secondary-300"
        >
          Visible
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-secondary-200 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2 text-sm font-medium text-white bg-accent rounded-md hover:opacity-90 transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving && (
            <svg
              className="animate-spin h-4 w-4 text-white"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {isSaving ? 'Saving...' : isEdit ? 'Update Section' : 'Create Section'}
        </button>
      </div>
    </form>
  );
};

export default PageSectionEditor;
