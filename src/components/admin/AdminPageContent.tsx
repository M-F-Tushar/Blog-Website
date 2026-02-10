import React, { useState } from 'react';
import { usePageContent, type PageSection } from '../../hooks/usePageContent';
import PageSectionEditor from './PageSectionEditor';
import { cosmic } from './ui/cosmicClassNames';
import {
  Plus,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
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
  Layers,
} from 'lucide-react';

const PAGES = [
  'home',
  'about',
  'contact',
  'cv',
  'projects',
  'publications',
  'playground',
  'error',
] as const;

const SECTION_TYPE_ICONS: Record<string, React.ElementType> = {
  hero: Layout,
  'text-block': Type,
  'image-banner': Image,
  'two-column': Columns,
  gallery: Grid,
  cta: MousePointer,
  stats: BarChart3,
  faq: HelpCircle,
  markdown: FileText,
};

const SECTION_TYPE_COLORS: Record<string, string> = {
  hero: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
  'text-block': 'text-secondary-300 bg-secondary-500/10 border-secondary-500/20',
  'image-banner': 'text-accent-400 bg-accent-500/10 border-accent-500/20',
  'two-column': 'text-info-400 bg-info-500/10 border-info-500/20',
  gallery: 'text-gold-400 bg-gold-500/10 border-gold-500/20',
  cta: 'text-success-400 bg-success-500/10 border-success-500/20',
  stats: 'text-primary-300 bg-primary-500/10 border-primary-500/20',
  faq: 'text-gold-300 bg-gold-500/10 border-gold-500/20',
  markdown: 'text-secondary-300 bg-secondary-500/10 border-secondary-500/20',
};

const getSectionType = (section: PageSection): string | null => {
  if (
    section.metadata &&
    typeof section.metadata === 'object' &&
    'section_type' in section.metadata
  ) {
    return section.metadata.section_type as string;
  }
  return null;
};

const AdminPageContent: React.FC = () => {
  const { sections, upsertSection, deleteSection, loading, error } = usePageContent();
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredSections = sections
    .filter((s) => s.page === selectedPage)
    .sort((a, b) => a.sort_order - b.sort_order);

  const isEditorOpen = isCreating || editingSection !== null;

  const handleSave = async (data: Omit<PageSection, 'id' | 'created_at' | 'updated_at'>) => {
    await upsertSection(data);
    setEditingSection(null);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingSection(null);
    setIsCreating(false);
  };

  const handleDelete = async (section: PageSection) => {
    if (
      !window.confirm(
        `Delete section "${section.title || section.section_key}"? This cannot be undone.`
      )
    ) {
      return;
    }
    try {
      await deleteSection(section.id);
    } catch (err) {
      console.error('Error deleting section:', err);
      alert('Failed to delete section. Please try again.');
    }
  };

  const handleToggleVisibility = async (section: PageSection) => {
    try {
      await upsertSection({
        page: section.page,
        section_key: section.section_key,
        title: section.title,
        subtitle: section.subtitle,
        content: section.content,
        image_url: section.image_url,
        metadata: section.metadata,
        sort_order: section.sort_order,
        visible: !section.visible,
      });
    } catch (err) {
      console.error('Error toggling visibility:', err);
      alert('Failed to update visibility. Please try again.');
    }
  };

  const handleMoveSection = async (section: PageSection, direction: 'up' | 'down') => {
    const index = filteredSections.findIndex((s) => s.id === section.id);
    if (index === -1) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= filteredSections.length) return;

    const other = filteredSections[swapIndex];

    try {
      // Swap sort_order values
      await Promise.all([
        upsertSection({
          page: section.page,
          section_key: section.section_key,
          title: section.title,
          subtitle: section.subtitle,
          content: section.content,
          image_url: section.image_url,
          metadata: section.metadata,
          sort_order: other.sort_order,
          visible: section.visible,
        }),
        upsertSection({
          page: other.page,
          section_key: other.section_key,
          title: other.title,
          subtitle: other.subtitle,
          content: other.content,
          image_url: other.image_url,
          metadata: other.metadata,
          sort_order: section.sort_order,
          visible: other.visible,
        }),
      ]);
    } catch (err) {
      console.error('Error reordering sections:', err);
      alert('Failed to reorder sections. Please try again.');
    }
  };

  return (
    <div className={cosmic.container}>
      <h2 className={`${cosmic.sectionTitle} mb-6`}>Page Content Manager</h2>

      {/* Page Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {PAGES.map((page) => (
          <button
            key={page}
            onClick={() => {
              setSelectedPage(page);
              setEditingSection(null);
              setIsCreating(false);
            }}
            className={`capitalize ${
              selectedPage === page ? cosmic.tabActive : cosmic.tabInactive
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className={`mb-6 ${cosmic.alertError}`}>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-primary-400"
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
          <span className="ml-3 text-secondary-300">Loading sections...</span>
        </div>
      )}

      {/* Editor View */}
      {!loading && isEditorOpen && (
        <PageSectionEditor
          section={editingSection ?? undefined}
          pageName={selectedPage}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Section List View */}
      {!loading && !isEditorOpen && (
        <>
          {/* Add Section Button */}
          <div className="mb-6">
            <button
              onClick={() => setIsCreating(true)}
              className={`${cosmic.buttonPrimary} flex items-center gap-2`}
            >
              <Plus size={16} />
              Add Section
            </button>
          </div>

          {/* Empty State */}
          {filteredSections.length === 0 && (
            <div className={cosmic.emptyState}>
              <Layers size={48} className="mx-auto mb-4 opacity-40" />
              <p className="text-lg">
                No sections found for the{' '}
                <span className="font-semibold capitalize">{selectedPage}</span> page.
              </p>
              <p className="text-secondary-500 text-sm mt-2">
                Click &quot;Add Section&quot; to create the first one.
              </p>
            </div>
          )}

          {/* Section Cards */}
          <div className="space-y-3">
            {filteredSections.map((section, index) => {
              const sectionType = getSectionType(section);
              const TypeIcon = sectionType ? SECTION_TYPE_ICONS[sectionType] || Layers : null;
              const typeColor = sectionType ? SECTION_TYPE_COLORS[sectionType] || '' : '';

              return (
                <div
                  key={section.id}
                  className={`${cosmic.card} ${!section.visible ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-0.5 flex-shrink-0 pt-1">
                      <button
                        onClick={() => handleMoveSection(section, 'up')}
                        disabled={index === 0}
                        title="Move up"
                        className={`p-1 rounded text-secondary-500 hover:text-primary-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() => handleMoveSection(section, 'down')}
                        disabled={index === filteredSections.length - 1}
                        title="Move down"
                        className={`p-1 rounded text-secondary-500 hover:text-primary-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    {/* Section Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h4 className="text-lg font-medium text-secondary-100 truncate">
                          {section.title || section.section_key}
                        </h4>
                        {/* Section Type Badge */}
                        {sectionType && (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeColor}`}
                          >
                            {TypeIcon && <TypeIcon size={12} />}
                            {sectionType}
                          </span>
                        )}
                        {/* Visibility Badge */}
                        <span
                          className={section.visible ? cosmic.badgeSuccess : cosmic.badgeDanger}
                        >
                          {section.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                      {section.title && (
                        <p className="text-sm text-secondary-400 font-mono">
                          {section.section_key}
                        </p>
                      )}
                      {section.subtitle && (
                        <p className="text-sm text-secondary-300 mt-1">{section.subtitle}</p>
                      )}
                      {section.content && (
                        <p className="text-sm text-secondary-400 mt-1 line-clamp-2">
                          {section.content}
                        </p>
                      )}
                      <p className="text-xs text-secondary-500 mt-2">
                        Sort order: {section.sort_order}
                        {section.updated_at && (
                          <>
                            {' '}
                            &middot; Updated: {new Date(section.updated_at).toLocaleDateString()}
                          </>
                        )}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Toggle Visibility */}
                      <button
                        onClick={() => handleToggleVisibility(section)}
                        title={section.visible ? 'Hide section' : 'Show section'}
                        className={cosmic.buttonIcon}
                      >
                        {section.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => setEditingSection(section)}
                        title="Edit section"
                        className={cosmic.buttonIcon}
                      >
                        <Edit3 size={18} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(section)}
                        title="Delete section"
                        className="p-2 rounded-lg bg-elevated/50 border border-white/[0.06] text-secondary-400 hover:text-error-400 hover:border-error-500/30 transition-all duration-200"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPageContent;
