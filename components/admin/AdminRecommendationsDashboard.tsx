import React from 'react';
import { Link } from 'react-router-dom';
import { useRecommendations } from '../../hooks/useRecommendations';

const AdminRecommendationsDashboard: React.FC = () => {
  const { recommendations, deleteRecommendation } = useRecommendations();

  const handleDelete = (recId: string, recTitle: string) => {
    if (window.confirm(`Are you sure you want to delete the recommendation "${recTitle}"?`)) {
      deleteRecommendation(recId);
    }
  };

  const sortedRecs = [...recommendations].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-3xl font-bold font-serif text-gray-900 dark:text-white">Manage Recommendations</h1>
        <Link
          to="/admin/recommendations/create"
          className="px-5 py-2 bg-accent text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-offset-dark-gray transition-colors"
        >
          Add New Recommendation
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedRecs.map((rec) => (
              <tr key={rec.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{rec.title}</div>
                   <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:underline truncate">{rec.url}</a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {rec.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  {!rec.isInitial ? (
                    <>
                      <Link to={`/admin/recommendations/edit/${rec.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(rec.id, rec.title)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                     <span className="text-gray-400 dark:text-gray-500 italic">Read-only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRecommendationsDashboard;