import React, { useState, useEffect } from 'react';
import {
  type CustomPage,
  type CustomPageSection,
  useCustomPages,
} from '../../hooks/useCustomPages';
import { cosmic } from './ui/cosmicClassNames';
import {
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Layout,
  Type,
  Image,
  Columns,
  Grid,
  MousePointer,
  BarChart3,
  HelpCircle,
  FileText,
} from 'lucide-react';

const SECTION_TYPES = [
  { value: 'text-block', label: 'Text Block', icon: Type },
  { value: 'hero', label: 'Hero Banner', icon: Layout },
  { value: 'image-banner', label: 'Image Banner', icon: Image },
  { value: 'two-column', label: 'Two Column', icon: Columns },
  { value: 'gallery', label: 'Gallery', icon: Grid },
  { value: 'cta', label: 'Call to Action', icon: MousePointer },
  { value: 'stats', label: 'Stats / Numbers', icon: BarChart3 },
  { value: 'faq', label: 'FAQ', icon: HelpCircle },
  { value: 'markdown', label: 'Markdown Content', icon: FileText },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

interface Props {
  page?: CustomPage;
  onSave: (data: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
}

const CustomPageEditor: React.FC<Props> = ({ page, onSave, onCancel }) => {
  const { getSections, createSection, updateSection, deleteSection } = useCustomPages();
  const isEdit = Boolean(page);

  // Page metadata
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [sortOrder, setSortOrder] = useState(0);
  const [showInNavigation, setShowInNavigation] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Sections
  const [sections, setSections] = useState<CustomPageSection[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);

  // UI state
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'sections'>('settings');

  // Inline section editor state
  const [newSectionType, setNewSectionType] = useState('text-block');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionSubtitle, setNewSectionSubtitle] = useState('');
  const [newSectionContent, setNewSectionContent] = useState('');
  const [newSectionImageUrl, setNewSectionImageUrl] = useState('');
  const [addingSectionIndex, setAddingSectionIndex] = useState<number | null>(null);

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setSlug(page.slug);
      setDescription(page.description || '');
      setMetaTitle(page.metaTitle || '');
      setMetaDescription(page.metaDescription || '');
      setOgImage(page.ogImage || '');
      setStatus(page.status);
      setSortOrder(page.sortOrder);
      setShowInNavigation(page.showInNavigation);
      setSlugManuallyEdited(true);

      // Load sections
      setSectionsLoading(true);
      getSections(page.id)
        .then(setSections)
        .catch((err) => console.error('Error loading sections:', err))
        .finally(() => setSectionsLoading(false));
    }
  }, [page, getSections]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && title) {
      setSlug(slugify(title));
    }
  }, [title, slugManuallyEdited]);

  const handleSavePage = async () => {
    if (!title.trim()) {
      alert('Page title is required.');
      return;
    }
    if (!slug.trim()) {
      alert('Page slug is required.');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        slug: slug.trim(),
        description: description || undefined,
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
        ogImage: ogImage || undefined,
        layout: 'default',
        status,
        sortOrder,
        showInNavigation,
      });
    } catch (err) {
      console.error('Error saving page:', err);
      alert('Failed to save page. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSection = async () => {
    if (!page) return;

    try {
      const newSection = await createSection({
        pageId: page.id,
        sectionType: newSectionType,
        title: newSectionTitle || undefined,
        subtitle: newSectionSubtitle || undefined,
        content: newSectionContent || undefined,
        imageUrl: newSectionImageUrl || undefined,
        sortOrder: addingSectionIndex !== null ? addingSectionIndex : sections.length,
        visible: true,
      });
      setSections((prev) => [...prev, newSection].sort((a, b) => a.sortOrder - b.sortOrder));
      resetNewSectionForm();
    } catch (err) {
      console.error('Error adding section:', err);
      alert('Failed to add section.');
    }
  };

  const resetNewSectionForm = () => {
    setNewSectionType('text-block');
    setNewSectionTitle('');
    setNewSectionSubtitle('');
    setNewSectionContent('');
    setNewSectionImageUrl('');
    setAddingSectionIndex(null);
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!window.confirm('Delete this section? This cannot be undone.')) return;
    try {
      await deleteSection(sectionId);
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
    } catch (err) {
      console.error('Error deleting section:', err);
      alert('Failed to delete section.');
    }
  };

  const handleToggleSectionVisibility = async (section: CustomPageSection) => {
    try {
      await updateSection(section.id, { visible: !section.visible });
      setSections((prev) =>
        prev.map((s) => (s.id === section.id ? { ...s, visible: !s.visible } : s))
      );
    } catch (err) {
      console.error('Error toggling visibility:', err);
    }
  };

  const handleMoveSection = async (section: CustomPageSection, direction: 'up' | 'down') => {
    const index = sections.findIndex((s) => s.id === section.id);
    if (index === -1) return;
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sections.length) return;

    const other = sections[swapIndex];
    try {
      await Promise.all([
        updateSection(section.id, { sortOrder: other.sortOrder }),
        updateSection(other.id, { sortOrder: section.sortOrder }),
      ]);
      setSections((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], sortOrder: other.sortOrder };
        updated[swapIndex] = { ...updated[swapIndex], sortOrder: section.sortOrder };
        return updated.sort((a, b) => a.sortOrder - b.sortOrder);
      });
    } catch (err) {
      console.error('Error reordering sections:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={cosmic.subTitle}>
          {isEdit ? 'Edit Page' : 'Create Page'}
          {isEdit && <span className="text-primary-400 ml-2">{page!.title}</span>}
        </h3>
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className={cosmic.buttonSecondary}>
            Cancel
          </button>
          <button
            onClick={handleSavePage}
            disabled={saving}
            className={`${cosmic.buttonPrimary} flex items-center gap-2`}
          >
            <Save size={16} />
            {saving ? 'Saving...' : isEdit ? 'Update Page' : 'Create Page'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      {isEdit && (
        <div className="flex gap-2 border-b border-white/[0.06] pb-0">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'text-primary-300 border-primary-400'
                : 'text-secondary-400 border-transparent hover:text-secondary-200'
            }`}
          >
            Page Settings
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'sections'
                ? 'text-primary-300 border-primary-400'
                : 'text-secondary-400 border-transparent hover:text-secondary-200'
            }`}
          >
            Sections ({sections.length})
          </button>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Title + Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="pageTitle" className={cosmic.label}>
                Page Title <span className="text-error-400">*</span>
              </label>
              <input
                id="pageTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Custom Page"
                className={cosmic.input}
              />
            </div>
            <div>
              <label htmlFor="pageSlug" className={cosmic.label}>
                URL Slug <span className="text-error-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary-500">/p/</span>
                <input
                  id="pageSlug"
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugManuallyEdited(true);
                  }}
                  placeholder="my-custom-page"
                  className={`${cosmic.input} flex-1 font-mono text-sm`}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="pageDesc" className={cosmic.label}>
              Description
            </label>
            <textarea
              id="pageDesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this page..."
              className={`${cosmic.textarea} h-20`}
            />
          </div>

          {/* Status + Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label htmlFor="pageStatus" className={cosmic.label}>
                Status
              </label>
              <select
                id="pageStatus"
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className={cosmic.select}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label htmlFor="pageSortOrder" className={cosmic.label}>
                Sort Order
              </label>
              <input
                id="pageSortOrder"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                className={cosmic.input}
              />
            </div>
            <div className="flex items-center gap-3 pb-2">
              <input
                id="showInNav"
                type="checkbox"
                checked={showInNavigation}
                onChange={(e) => setShowInNavigation(e.target.checked)}
                className="h-4 w-4 rounded border-white/10 accent-primary-500"
              />
              <label htmlFor="showInNav" className="text-sm font-medium text-secondary-300">
                Show in navigation
              </label>
            </div>
          </div>

          {/* SEO */}
          <div className="border-t border-white/[0.06] pt-6">
            <h4 className="text-sm font-semibold text-secondary-300 uppercase tracking-wider mb-4">
              SEO Settings
            </h4>
            <div className="space-y-4">
              <div>
                <label htmlFor="metaTitle" className={cosmic.label}>
                  Meta Title
                </label>
                <input
                  id="metaTitle"
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Defaults to page title"
                  className={cosmic.input}
                />
              </div>
              <div>
                <label htmlFor="metaDesc" className={cosmic.label}>
                  Meta Description
                </label>
                <textarea
                  id="metaDesc"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="SEO description for this page..."
                  className={`${cosmic.textarea} h-20`}
                />
              </div>
              <div>
                <label htmlFor="ogImg" className={cosmic.label}>
                  OG Image URL
                </label>
                <input
                  id="ogImg"
                  type="text"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://example.com/og-image.jpg"
                  className={cosmic.input}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sections Tab (only for editing existing pages) */}
      {isEdit && activeTab === 'sections' && (
        <div className="space-y-4">
          {sectionsLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500/20 border-t-primary-400" />
              <span className="ml-3 text-secondary-300 text-sm">Loading sections...</span>
            </div>
          )}

          {!sectionsLoading && sections.length === 0 && addingSectionIndex === null && (
            <div className={cosmic.emptyState}>
              <FileText size={36} className="mx-auto mb-3 opacity-40" />
              <p>No sections yet. Add your first section.</p>
            </div>
          )}

          {/* Section list */}
          {!sectionsLoading &&
            sections.map((section, index) => {
              const typeInfo = SECTION_TYPES.find((t) => t.value === section.sectionType);
              const TypeIcon = typeInfo?.icon || FileText;
              return (
                <div
                  key={section.id}
                  className={`${cosmic.card} ${!section.visible ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => handleMoveSection(section, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded text-secondary-500 hover:text-primary-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() => handleMoveSection(section, 'down')}
                        disabled={index === sections.length - 1}
                        className="p-1 rounded text-secondary-500 hover:text-primary-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    {/* Type icon */}
                    <div className="p-2 rounded-lg bg-primary-500/10 text-primary-300 border border-primary-500/20 flex-shrink-0">
                      <TypeIcon size={18} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-secondary-100 truncate">
                          {section.title || `${typeInfo?.label || section.sectionType} section`}
                        </span>
                        <span className="text-xs text-secondary-500 bg-elevated/50 px-2 py-0.5 rounded">
                          {typeInfo?.label || section.sectionType}
                        </span>
                      </div>
                      {section.subtitle && (
                        <p className="text-sm text-secondary-400 truncate">{section.subtitle}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleToggleSectionVisibility(section)}
                        title={section.visible ? 'Hide' : 'Show'}
                        className={cosmic.buttonIcon}
                      >
                        {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        title="Delete"
                        className="p-2 rounded-lg bg-elevated/50 border border-white/[0.06] text-secondary-400 hover:text-error-400 hover:border-error-500/30 transition-all duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* Add Section Form */}
          {addingSectionIndex !== null ? (
            <div className={`${cosmic.card} border-primary-500/30`}>
              <h4 className="text-sm font-semibold text-secondary-200 mb-4">Add New Section</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={cosmic.label}>Section Type</label>
                    <select
                      value={newSectionType}
                      onChange={(e) => setNewSectionType(e.target.value)}
                      className={cosmic.select}
                    >
                      {SECTION_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={cosmic.label}>Title</label>
                    <input
                      type="text"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      placeholder="Section title"
                      className={cosmic.input}
                    />
                  </div>
                </div>
                <div>
                  <label className={cosmic.label}>Content</label>
                  <textarea
                    value={newSectionContent}
                    onChange={(e) => setNewSectionContent(e.target.value)}
                    placeholder="Section content..."
                    className={`${cosmic.textarea} h-24`}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handleAddSection} className={cosmic.buttonPrimary}>
                    Add Section
                  </button>
                  <button onClick={resetNewSectionForm} className={cosmic.buttonSecondary}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingSectionIndex(sections.length)}
              className={`w-full py-3 border-2 border-dashed border-white/10 rounded-xl text-secondary-400 hover:text-primary-300 hover:border-primary-500/30 transition-all flex items-center justify-center gap-2`}
            >
              <Plus size={18} />
              Add Section
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomPageEditor;
