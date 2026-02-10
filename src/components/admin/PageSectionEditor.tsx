import React, { useState, useEffect } from 'react';
import type { PageSection } from '../../hooks/usePageContent';
import { cosmic } from './ui/cosmicClassNames';
import { Plus, Trash2, ImageIcon } from 'lucide-react';

const SECTION_TYPES = [
  { value: '', label: 'None (Generic)' },
  { value: 'hero', label: 'Hero Banner' },
  { value: 'text-block', label: 'Text Block' },
  { value: 'image-banner', label: 'Image Banner' },
  { value: 'two-column', label: 'Two Column' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'cta', label: 'Call to Action' },
  { value: 'stats', label: 'Stats / Numbers' },
  { value: 'faq', label: 'FAQ' },
  { value: 'markdown', label: 'Markdown Content' },
] as const;

// Which fields are relevant per section type
const TYPE_FIELDS: Record<string, string[]> = {
  '': ['title', 'subtitle', 'content', 'image_url', 'metadata'],
  hero: ['title', 'subtitle', 'content', 'image_url', 'metadata'],
  'text-block': ['title', 'subtitle', 'content'],
  'image-banner': ['title', 'subtitle', 'image_url', 'metadata'],
  'two-column': ['title', 'content', 'image_url', 'metadata'],
  gallery: ['title', 'subtitle', 'metadata'],
  cta: ['title', 'subtitle', 'content', 'metadata'],
  stats: ['title', 'metadata'],
  faq: ['title', 'metadata'],
  markdown: ['title', 'content'],
};

// Metadata field hints per section type
const TYPE_METADATA_HINTS: Record<string, string> = {
  hero: 'e.g. buttonText, buttonLink, overlayOpacity',
  'image-banner': 'e.g. alt, caption, objectFit',
  'two-column': 'e.g. imagePosition (left/right), imageAlt',
  gallery: 'e.g. images: [{url, alt, caption}]',
  cta: 'e.g. buttonText, buttonLink, variant',
  stats: 'e.g. items: [{label, value, icon}]',
  faq: 'e.g. items: [{question, answer}]',
};

interface Props {
  section?: PageSection;
  pageName: string;
  onSave: (data: Omit<PageSection, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

interface MetadataEntry {
  key: string;
  value: string;
}

const PageSectionEditor: React.FC<Props> = ({ section, pageName, onSave, onCancel }) => {
  const isEdit = Boolean(section);
  const [sectionKey, setSectionKey] = useState('');
  const [sectionType, setSectionType] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Metadata editor: key-value pairs mode vs raw JSON
  const [metadataMode, setMetadataMode] = useState<'pairs' | 'json'>('pairs');
  const [metadataEntries, setMetadataEntries] = useState<MetadataEntry[]>([]);
  const [metadataText, setMetadataText] = useState('');
  const [metadataError, setMetadataError] = useState('');

  useEffect(() => {
    if (section) {
      setSectionKey(section.section_key);
      setTitle(section.title || '');
      setSubtitle(section.subtitle || '');
      setContent(section.content || '');
      setImageUrl(section.image_url || '');
      setSortOrder(section.sort_order);
      setVisible(section.visible);

      // Extract section_type from metadata
      const meta = section.metadata || {};
      const type = (meta.section_type as string) || '';
      setSectionType(type);

      // Build metadata entries (excluding section_type)
      const entries: MetadataEntry[] = [];
      for (const [k, v] of Object.entries(meta)) {
        if (k === 'section_type') continue;
        entries.push({ key: k, value: typeof v === 'string' ? v : JSON.stringify(v) });
      }
      setMetadataEntries(entries.length > 0 ? entries : []);

      // Also set raw JSON (excluding section_type)
      const metaWithoutType = { ...meta };
      delete metaWithoutType.section_type;
      setMetadataText(
        Object.keys(metaWithoutType).length > 0 ? JSON.stringify(metaWithoutType, null, 2) : ''
      );
    }
  }, [section]);

  const visibleFields = TYPE_FIELDS[sectionType] || TYPE_FIELDS[''];
  const metadataHint = TYPE_METADATA_HINTS[sectionType] || '';

  const addMetadataEntry = () => {
    setMetadataEntries([...metadataEntries, { key: '', value: '' }]);
  };

  const removeMetadataEntry = (index: number) => {
    setMetadataEntries(metadataEntries.filter((_, i) => i !== index));
  };

  const updateMetadataEntry = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...metadataEntries];
    updated[index] = { ...updated[index], [field]: val };
    setMetadataEntries(updated);
  };

  const buildMetadata = (): Record<string, unknown> | undefined => {
    const result: Record<string, unknown> = {};

    // Always include section_type if set
    if (sectionType) {
      result.section_type = sectionType;
    }

    if (metadataMode === 'pairs') {
      for (const entry of metadataEntries) {
        const key = entry.key.trim();
        if (!key) continue;
        // Try to parse JSON values (arrays, objects, numbers, booleans)
        try {
          result[key] = JSON.parse(entry.value);
        } catch {
          result[key] = entry.value;
        }
      }
    } else {
      // Raw JSON mode
      if (metadataText.trim()) {
        try {
          const parsed = JSON.parse(metadataText);
          setMetadataError('');
          Object.assign(result, parsed);
        } catch {
          setMetadataError('Invalid JSON. Please fix the metadata field.');
          return undefined;
        }
      }
    }

    return Object.keys(result).length > 0 ? result : undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionKey.trim()) {
      alert('Section key is required.');
      return;
    }

    const metadata = buildMetadata();
    // If buildMetadata returned undefined due to JSON parse error, metadataError is set
    if (metadataMode === 'json' && metadataError) return;

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

  // Sync pairs <-> json when switching modes
  const switchMetadataMode = (mode: 'pairs' | 'json') => {
    if (mode === 'json' && metadataMode === 'pairs') {
      // Convert pairs to JSON
      const obj: Record<string, unknown> = {};
      for (const entry of metadataEntries) {
        const key = entry.key.trim();
        if (!key) continue;
        try {
          obj[key] = JSON.parse(entry.value);
        } catch {
          obj[key] = entry.value;
        }
      }
      setMetadataText(Object.keys(obj).length > 0 ? JSON.stringify(obj, null, 2) : '');
    } else if (mode === 'pairs' && metadataMode === 'json') {
      // Convert JSON to pairs
      if (metadataText.trim()) {
        try {
          const parsed = JSON.parse(metadataText);
          const entries: MetadataEntry[] = Object.entries(parsed)
            .filter(([k]) => k !== 'section_type')
            .map(([k, v]) => ({
              key: k,
              value: typeof v === 'string' ? v : JSON.stringify(v),
            }));
          setMetadataEntries(entries);
          setMetadataError('');
        } catch {
          // Keep raw text, show error
          setMetadataError('Cannot parse JSON into key-value pairs.');
          return; // Don't switch
        }
      } else {
        setMetadataEntries([]);
      }
    }
    setMetadataMode(mode);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className={cosmic.subTitle}>
        {isEdit ? 'Edit Section' : 'Create Section'} —{' '}
        <span className="text-primary-400">{pageName}</span>
      </h3>

      {/* Section Key + Type Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section Key */}
        <div>
          <label htmlFor="sectionKey" className={cosmic.label}>
            Section Key <span className="text-error-400">*</span>
          </label>
          <input
            id="sectionKey"
            type="text"
            value={sectionKey}
            onChange={(e) => setSectionKey(e.target.value)}
            readOnly={isEdit}
            placeholder="e.g. hero, about-intro, contact-form"
            className={`${cosmic.input} ${isEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
          {isEdit && (
            <p className="mt-1 text-xs text-secondary-400">
              Section key cannot be changed after creation.
            </p>
          )}
        </div>

        {/* Section Type */}
        <div>
          <label htmlFor="sectionType" className={cosmic.label}>
            Section Type
          </label>
          <select
            id="sectionType"
            value={sectionType}
            onChange={(e) => setSectionType(e.target.value)}
            className={cosmic.select}
          >
            {SECTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-secondary-500">
            Controls which fields are shown and how the section renders.
          </p>
        </div>
      </div>

      {/* Title */}
      {visibleFields.includes('title') && (
        <div>
          <label htmlFor="title" className={cosmic.label}>
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Section title"
            className={cosmic.input}
          />
        </div>
      )}

      {/* Subtitle */}
      {visibleFields.includes('subtitle') && (
        <div>
          <label htmlFor="subtitle" className={cosmic.label}>
            Subtitle
          </label>
          <input
            id="subtitle"
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Section subtitle"
            className={cosmic.input}
          />
        </div>
      )}

      {/* Content */}
      {visibleFields.includes('content') && (
        <div>
          <label htmlFor="content" className={cosmic.label}>
            Content {sectionType === 'markdown' ? '(Markdown)' : ''}
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              sectionType === 'markdown'
                ? 'Write your markdown content here...'
                : 'Main content for this section...'
            }
            className={`${cosmic.textarea} ${sectionType === 'markdown' ? 'h-48 font-mono text-sm' : 'h-32'}`}
          />
        </div>
      )}

      {/* Image URL with preview */}
      {visibleFields.includes('image_url') && (
        <div>
          <label htmlFor="imageUrl" className={cosmic.label}>
            Image URL
          </label>
          <input
            id="imageUrl"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className={cosmic.input}
          />
          {imageUrl && (
            <div className="mt-3 relative inline-block">
              <div className="rounded-lg overflow-hidden border border-white/[0.06] bg-elevated/50">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-h-40 max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                  onLoad={(e) => {
                    (e.target as HTMLImageElement).style.display = 'block';
                  }}
                />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <ImageIcon size={12} className="text-secondary-500" />
                <span className="text-xs text-secondary-500">Image preview</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Metadata Editor */}
      {visibleFields.includes('metadata') && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={cosmic.label + ' mb-0'}>
              Additional Data
              {metadataHint && (
                <span className="font-normal text-secondary-500 ml-2">({metadataHint})</span>
              )}
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => switchMetadataMode('pairs')}
                className={`px-2.5 py-1 text-xs rounded-l-lg transition-colors ${
                  metadataMode === 'pairs'
                    ? 'bg-primary-500/15 text-primary-300 border border-primary-500/30'
                    : 'bg-elevated/50 text-secondary-400 border border-white/[0.06] hover:text-secondary-200'
                }`}
              >
                Key-Value
              </button>
              <button
                type="button"
                onClick={() => switchMetadataMode('json')}
                className={`px-2.5 py-1 text-xs rounded-r-lg transition-colors ${
                  metadataMode === 'json'
                    ? 'bg-primary-500/15 text-primary-300 border border-primary-500/30'
                    : 'bg-elevated/50 text-secondary-400 border border-white/[0.06] hover:text-secondary-200'
                }`}
              >
                Raw JSON
              </button>
            </div>
          </div>

          {metadataMode === 'pairs' ? (
            <div className="space-y-2">
              {metadataEntries.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={entry.key}
                    onChange={(e) => updateMetadataEntry(i, 'key', e.target.value)}
                    placeholder="key"
                    className={`${cosmic.input} flex-[2] font-mono text-sm`}
                  />
                  <input
                    type="text"
                    value={entry.value}
                    onChange={(e) => updateMetadataEntry(i, 'value', e.target.value)}
                    placeholder="value (string or JSON)"
                    className={`${cosmic.input} flex-[3] text-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => removeMetadataEntry(i)}
                    className="p-2 text-secondary-500 hover:text-error-400 transition-colors flex-shrink-0"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addMetadataEntry}
                className={`${cosmic.buttonSmall} flex items-center gap-1.5`}
              >
                <Plus size={14} />
                Add Field
              </button>
            </div>
          ) : (
            <div>
              <textarea
                value={metadataText}
                onChange={(e) => {
                  setMetadataText(e.target.value);
                  if (metadataError) setMetadataError('');
                }}
                placeholder='{ "key": "value" }'
                className={`${cosmic.textarea} h-32 font-mono text-sm`}
              />
              {metadataError && <p className="mt-1 text-sm text-error-400">{metadataError}</p>}
            </div>
          )}
        </div>
      )}

      {/* Sort Order + Visible Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        {/* Sort Order */}
        <div>
          <label htmlFor="sortOrder" className={cosmic.label}>
            Sort Order
          </label>
          <input
            id="sortOrder"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
            className={cosmic.input}
          />
        </div>

        {/* Visible */}
        <div className="flex items-center gap-3 pb-2">
          <input
            id="visible"
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            className="h-4 w-4 rounded border-white/10 accent-primary-500"
          />
          <label htmlFor="visible" className="text-sm font-medium text-secondary-300">
            Visible on page
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`flex items-center gap-3 pt-4 ${cosmic.divider}`}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className={`${cosmic.buttonSecondary} disabled:opacity-50`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className={`${cosmic.buttonPrimary} flex items-center gap-2`}
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
