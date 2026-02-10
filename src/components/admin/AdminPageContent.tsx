import React, { useState } from 'react';
import { usePageContent, PageSection } from '../../hooks/usePageContent';
import PageSectionEditor from './PageSectionEditor';

const PAGES = ['home', 'about', 'contact', 'cv', 'projects', 'publications'] as const;

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

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-surface rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Page Content Manager
      </h2>

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
            className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors duration-200 ${
              selectedPage === page
                ? 'bg-accent text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-secondary-200 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-accent"
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
          <span className="ml-3 text-gray-600 dark:text-secondary-300">Loading sections...</span>
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
              className="px-5 py-2 text-sm font-medium text-white bg-accent rounded-md hover:opacity-90 transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Section
            </button>
          </div>

          {/* Empty State */}
          {filteredSections.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-secondary-400 text-lg">
                No sections found for the{' '}
                <span className="font-semibold capitalize">{selectedPage}</span> page.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                Click &quot;Add Section&quot; to create the first one.
              </p>
            </div>
          )}

          {/* Section Cards */}
          <div className="space-y-4">
            {filteredSections.map((section) => (
              <div
                key={section.id}
                className="bg-gray-50 dark:bg-elevated rounded-lg p-4 border border-gray-200 dark:border-white/10"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Section Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 truncate">
                        {section.title || section.section_key}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          section.visible
                            ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {section.visible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                    {section.title && (
                      <p className="text-sm text-gray-500 dark:text-secondary-400 font-mono">
                        {section.section_key}
                      </p>
                    )}
                    {section.subtitle && (
                      <p className="text-sm text-gray-600 dark:text-secondary-300 mt-1">
                        {section.subtitle}
                      </p>
                    )}
                    {section.content && (
                      <p className="text-sm text-gray-500 dark:text-secondary-400 mt-1 line-clamp-2">
                        {section.content}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      Sort order: {section.sort_order}
                      {section.updated_at && (
                        <> &middot; Updated: {new Date(section.updated_at).toLocaleDateString()}</>
                      )}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Toggle Visibility */}
                    <button
                      onClick={() => handleToggleVisibility(section)}
                      title={section.visible ? 'Hide section' : 'Show section'}
                      className="p-2 text-gray-500 dark:text-secondary-400 hover:text-accent dark:hover:text-accent rounded-md hover:bg-gray-200 dark:hover:bg-elevated transition-colors duration-200"
                    >
                      {section.visible ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => setEditingSection(section)}
                      title="Edit section"
                      className="p-2 text-gray-500 dark:text-secondary-400 hover:text-accent dark:hover:text-accent rounded-md hover:bg-gray-200 dark:hover:bg-elevated transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(section)}
                      title="Delete section"
                      className="p-2 text-gray-500 dark:text-secondary-400 hover:text-red-500 dark:hover:text-red-400 rounded-md hover:bg-gray-200 dark:hover:bg-elevated transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPageContent;
