import React from 'react';
import { Link } from 'react-router-dom';
import { useBookshelf } from '../../hooks/useBookshelf';
import { cosmic } from './ui/cosmicClassNames';

const AdminBookshelf: React.FC = () => {
  const { entries, deleteEntry, updateEntry, loading, error } = useBookshelf();

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    await deleteEntry(id);
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    await updateEntry(id, { isFeatured: !isFeatured });
  };

  return (
    <div className={cosmic.container}>
      <div className="mb-8 flex items-center justify-between border-b border-white/[0.06] pb-6">
        <div>
          <h1 className={cosmic.pageTitle}>Bookshelf</h1>
          <p className="mt-2 text-sm text-secondary-400">
            Manage reflections, reading logs, favorites, and book essays.
          </p>
        </div>
        <Link to="/bookshelf/create" className={cosmic.buttonPrimary}>
          New Entry
        </Link>
      </div>

      {error && <div className={cosmic.alertError}>{error}</div>}

      {loading ? (
        <div className={cosmic.loadingOverlay}>
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-500/20 border-t-primary-400" />
        </div>
      ) : (
        <div className={cosmic.tableWrapper}>
          <table className={cosmic.table}>
            <thead className={cosmic.tableHead}>
              <tr>
                <th className={cosmic.tableHeadCell}>Title</th>
                <th className={cosmic.tableHeadCell}>Book</th>
                <th className={cosmic.tableHeadCell}>Type</th>
                <th className={cosmic.tableHeadCell}>Status</th>
                <th className={cosmic.tableHeadCell}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className={cosmic.tableBody}>
              {entries.map((entry) => (
                <tr key={entry.id} className={cosmic.tableRow}>
                  <td className={cosmic.tableCell}>
                    <div className="font-medium text-secondary-50">{entry.title}</div>
                    <div className="text-xs text-secondary-500">{entry.slug}</div>
                  </td>
                  <td className={cosmic.tableCell}>{entry.bookTitle}</td>
                  <td className={cosmic.tableCell}>{entry.entryType}</td>
                  <td className={cosmic.tableCell}>
                    <span
                      className={
                        entry.status === 'published' ? cosmic.badgeSuccess : cosmic.badgeWarning
                      }
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td className={`${cosmic.tableCell} text-right`}>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleToggleFeatured(entry.id, entry.isFeatured)}
                        className={entry.isFeatured ? cosmic.starActive : cosmic.starInactive}
                        title="Toggle featured"
                      >
                        &#9733;
                      </button>
                      <Link to={`/bookshelf/edit/${entry.id}`} className={cosmic.linkEdit}>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(entry.id, entry.title)}
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
        </div>
      )}
    </div>
  );
};

export default AdminBookshelf;
