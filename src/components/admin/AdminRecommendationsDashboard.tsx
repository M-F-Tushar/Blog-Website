import React from 'react';
import { Link } from 'react-router-dom';
import { useRecommendations } from '../../hooks/useRecommendations';
import { cosmic } from './ui/cosmicClassNames';

const AdminRecommendationsDashboard: React.FC = () => {
  const { recommendations, deleteRecommendation, loading, error } = useRecommendations();

  const handleDelete = async (recId: string, recTitle: string) => {
    if (window.confirm(`Are you sure you want to delete the recommendation "${recTitle}"?`)) {
      try {
        await deleteRecommendation(recId);
      } catch (err) {
        console.error('Failed to delete recommendation:', err);
        alert('Failed to delete recommendation. Please try again.');
      }
    }
  };

  const sortedRecs = [...recommendations].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className={cosmic.container}>
      {error && (
        <div className={`mb-6 ${cosmic.alertError}`}>
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-8 border-b border-white/[0.06] pb-6">
        <h1 className={cosmic.pageTitle}>Manage Recommendations</h1>
        <Link to="/recommendations/create" className={cosmic.buttonPrimary}>
          Add New Recommendation
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
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
                  Type
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className={cosmic.tableBody}>
              {sortedRecs.map((rec) => (
                <tr key={rec.id} className={cosmic.tableRow}>
                  <td className={`${cosmic.tableCell} whitespace-nowrap`}>
                    <div className="text-sm font-medium text-secondary-50">{rec.title}</div>
                    <a
                      href={rec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-secondary-500 hover:underline truncate"
                    >
                      {rec.url}
                    </a>
                  </td>
                  <td className={`${cosmic.tableCell} whitespace-nowrap`}>
                    <span className={cosmic.badgeAccent}>{rec.type}</span>
                  </td>
                  <td
                    className={`${cosmic.tableCell} whitespace-nowrap text-right text-sm font-medium space-x-4`}
                  >
                    {!rec.isInitial ? (
                      <>
                        <Link to={`/recommendations/edit/${rec.id}`} className={cosmic.linkEdit}>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(rec.id, rec.title)}
                          className={cosmic.linkDelete}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <span className="text-secondary-500 italic">Read-only</span>
                    )}
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

export default AdminRecommendationsDashboard;
