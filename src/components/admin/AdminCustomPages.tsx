import React, { useState } from 'react';
import { useCustomPages, type CustomPage } from '../../hooks/useCustomPages';
import { cosmic } from './ui/cosmicClassNames';
import {
  Plus,
  FileText,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  Archive,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import CustomPageEditor from './CustomPageEditor';

const STATUS_BADGES: Record<string, string> = {
  draft: 'bg-gold-500/10 text-gold-400 border border-gold-500/20',
  published: 'bg-success-500/10 text-success-400 border border-success-500/20',
  archived: 'bg-secondary-500/10 text-secondary-400 border border-secondary-500/20',
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  draft: EyeOff,
  published: Globe,
  archived: Archive,
};

const AdminCustomPages: React.FC = () => {
  const { pages, loading, error, createPage, updatePage, deletePage } = useCustomPages();
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const isEditorOpen = isCreating || editingPage !== null;

  const handleCreate = async (pageData: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>) => {
    await createPage(pageData);
    setIsCreating(false);
  };

  const handleUpdate = async (pageData: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingPage) {
      await updatePage(editingPage.id, pageData);
      setEditingPage(null);
    }
  };

  const handleDelete = async (page: CustomPage) => {
    if (
      !window.confirm(
        `Delete page "${page.title}"? This will also delete all its sections. This cannot be undone.`
      )
    ) {
      return;
    }
    try {
      await deletePage(page.id);
    } catch (err) {
      console.error('Error deleting page:', err);
      alert('Failed to delete page. Please try again.');
    }
  };

  const handleToggleStatus = async (page: CustomPage) => {
    const newStatus = page.status === 'published' ? 'draft' : 'published';
    try {
      await updatePage(page.id, { status: newStatus });
    } catch (err) {
      console.error('Error toggling page status:', err);
      alert('Failed to update page status.');
    }
  };

  const handleCancel = () => {
    setEditingPage(null);
    setIsCreating(false);
  };

  const sortedPages = [...pages].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className={cosmic.container}>
      <h2 className={`${cosmic.sectionTitle} mb-6`}>Custom Pages</h2>

      {error && (
        <div className={`mb-6 ${cosmic.alertError}`}>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500/20 border-t-primary-400" />
          <span className="ml-3 text-secondary-300">Loading pages...</span>
        </div>
      )}

      {!loading && isEditorOpen && (
        <CustomPageEditor
          page={editingPage ?? undefined}
          onSave={editingPage ? handleUpdate : handleCreate}
          onCancel={handleCancel}
        />
      )}

      {!loading && !isEditorOpen && (
        <>
          <div className="mb-6">
            <button
              onClick={() => setIsCreating(true)}
              className={`${cosmic.buttonPrimary} flex items-center gap-2`}
            >
              <Plus size={16} />
              Create Page
            </button>
          </div>

          {sortedPages.length === 0 && (
            <div className={cosmic.emptyState}>
              <FileText size={48} className="mx-auto mb-4 opacity-40" />
              <p className="text-lg">No custom pages yet.</p>
              <p className="text-secondary-500 text-sm mt-2">
                Create your first custom page to extend your site.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {sortedPages.map((page) => {
              const StatusIcon = STATUS_ICONS[page.status] || FileText;
              return (
                <div
                  key={page.id}
                  className={`${cosmic.card} ${page.status === 'archived' ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h4 className="text-lg font-medium text-secondary-100 truncate">
                          {page.title}
                        </h4>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGES[page.status] || ''}`}
                        >
                          <StatusIcon size={12} />
                          {page.status}
                        </span>
                        {page.showInNavigation && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20">
                            <Navigation size={10} />
                            In Nav
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-secondary-400 font-mono">/p/{page.slug}</p>
                      {page.description && (
                        <p className="text-sm text-secondary-300 mt-1 line-clamp-2">
                          {page.description}
                        </p>
                      )}
                      <p className="text-xs text-secondary-500 mt-2">
                        Sort order: {page.sortOrder}
                        {page.updatedAt && (
                          <> &middot; Updated: {new Date(page.updatedAt).toLocaleDateString()}</>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {page.status === 'published' && (
                        <a
                          href={`/p/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View page"
                          className={cosmic.buttonIcon}
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                      <button
                        onClick={() => handleToggleStatus(page)}
                        title={page.status === 'published' ? 'Unpublish' : 'Publish'}
                        className={cosmic.buttonIcon}
                      >
                        {page.status === 'published' ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button
                        onClick={() => setEditingPage(page)}
                        title="Edit page"
                        className={cosmic.buttonIcon}
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(page)}
                        title="Delete page"
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

          <div className={`mt-6 ${cosmic.alertInfo}`}>
            <p className="text-sm">
              <strong>Tip:</strong> Custom pages are accessible at{' '}
              <code className="text-primary-300">/p/your-slug</code>. Enable &quot;Show in
              Navigation&quot; to add pages to your site header and footer automatically.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCustomPages;
