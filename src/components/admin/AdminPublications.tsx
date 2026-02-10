import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePublications, Publication } from '../../hooks/usePublications';
import { cosmic } from './ui/cosmicClassNames';

const TYPE_BADGE_CLASSES: Record<Publication['type'], string> = {
  conference: cosmic.badgeAccent,
  journal: cosmic.badgeSuccess,
  preprint: cosmic.badgeWarning,
  thesis: cosmic.badgeNeutral,
  book_chapter: cosmic.badgeDanger,
};

const TYPE_LABELS: Record<Publication['type'], string> = {
  conference: 'Conference',
  journal: 'Journal',
  preprint: 'Preprint',
  thesis: 'Thesis',
  book_chapter: 'Book Chapter',
};

const AdminPublications: React.FC = () => {
  const { publications, updatePublication, deletePublication, loading, error } = usePublications();

  const [yearFilter, setYearFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const availableYears = useMemo(() => {
    const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a);
    return years;
  }, [publications]);

  const availableTypes = useMemo(() => {
    const types = [...new Set(publications.map((p) => p.type))].sort();
    return types;
  }, [publications]);

  const filteredPublications = useMemo(() => {
    let filtered = [...publications];

    if (yearFilter !== 'all') {
      filtered = filtered.filter((p) => p.year === Number(yearFilter));
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((p) => p.type === typeFilter);
    }

    filtered.sort((a, b) => b.year - a.year);

    return filtered;
  }, [publications, yearFilter, typeFilter]);

  const handleDelete = async (pubId: string, pubTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${pubTitle}"?`)) {
      try {
        await deletePublication(pubId);
      } catch (err) {
        console.error('Failed to delete publication:', err);
        alert('Failed to delete publication. Please try again.');
      }
    }
  };

  const handleToggleFeatured = async (pub: Publication) => {
    try {
      await updatePublication(pub.id, { featured: !pub.featured });
    } catch (err) {
      console.error('Failed to toggle featured status:', err);
      alert('Failed to update publication. Please try again.');
    }
  };

  return (
    <div className={cosmic.container}>
      {error && (
        <div className={`mb-6 ${cosmic.alertError}`}>
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-8 border-b border-white/[0.06] pb-6">
        <h1 className={cosmic.pageTitle}>Manage Publications</h1>
        <Link to="/publications/create" className={cosmic.buttonPrimary}>
          Add Publication
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label htmlFor="yearFilter" className={cosmic.label}>
            Year
          </label>
          <select
            id="yearFilter"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className={cosmic.select}
          >
            <option value="all">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="typeFilter" className={cosmic.label}>
            Type
          </label>
          <select
            id="typeFilter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={cosmic.select}
          >
            <option value="all">All Types</option>
            {availableTypes.map((t) => (
              <option key={t} value={t}>
                {TYPE_LABELS[t] || t}
              </option>
            ))}
          </select>
        </div>
        {(yearFilter !== 'all' || typeFilter !== 'all') && (
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setYearFilter('all');
                setTypeFilter('all');
              }}
              className="px-3 py-2 text-sm text-secondary-400 hover:text-secondary-200 underline transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
        </div>
      ) : filteredPublications.length === 0 ? (
        <div className={cosmic.emptyState}>
          <p className="text-lg">
            {publications.length === 0
              ? 'No publications yet. Click "Add Publication" to create one.'
              : 'No publications match the selected filters.'}
          </p>
        </div>
      ) : (
        <div className={cosmic.tableWrapper}>
          <table className={cosmic.table}>
            <thead className={cosmic.tableHead}>
              <tr>
                <th scope="col" className={cosmic.tableHeadCell}>
                  Title
                </th>
                <th scope="col" className={cosmic.tableHeadCell}>
                  Authors
                </th>
                <th scope="col" className={cosmic.tableHeadCell}>
                  Year
                </th>
                <th scope="col" className={cosmic.tableHeadCell}>
                  Type
                </th>
                <th scope="col" className={cosmic.tableHeadCell}>
                  Venue
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className={cosmic.tableBody}>
              {filteredPublications.map((pub) => (
                <tr key={pub.id} className={cosmic.tableRow}>
                  <td className={cosmic.tableCell}>
                    <div
                      className="text-sm font-medium text-secondary-50 max-w-xs truncate"
                      title={pub.title}
                    >
                      {pub.title}
                    </div>
                  </td>
                  <td className={cosmic.tableCell}>
                    <div
                      className="text-sm text-secondary-400 max-w-xs truncate"
                      title={pub.authors.join(', ')}
                    >
                      {pub.authors.join(', ')}
                    </div>
                  </td>
                  <td className={cosmic.tableCell}>
                    <div className="text-sm text-secondary-50">{pub.year}</div>
                  </td>
                  <td className={cosmic.tableCell}>
                    <span className={TYPE_BADGE_CLASSES[pub.type] || cosmic.badgeNeutral}>
                      {TYPE_LABELS[pub.type] || pub.type}
                    </span>
                  </td>
                  <td className={cosmic.tableCell}>
                    <div className="text-sm text-secondary-400 max-w-xs truncate" title={pub.venue}>
                      {pub.venue}
                    </div>
                  </td>
                  <td className={`${cosmic.tableCell} text-right text-sm font-medium`}>
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => handleToggleFeatured(pub)}
                        className="focus:outline-none transition-colors"
                        title={pub.featured ? 'Remove from featured' : 'Mark as featured'}
                        aria-label={pub.featured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        {pub.featured ? (
                          <svg
                            className={`h-5 w-5 ${cosmic.starActive}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ) : (
                          <svg
                            className={`h-5 w-5 ${cosmic.starInactive}`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        )}
                      </button>
                      <Link to={`/publications/edit/${pub.id}`} className={cosmic.linkEdit}>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(pub.id, pub.title)}
                        className={cosmic.linkDelete}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-sm text-secondary-400">
            Showing {filteredPublications.length} of {publications.length} publication
            {publications.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPublications;
