// FIX: Replaced placeholder content with a functional AdminDashboard component.
import React from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts';
import { Post } from '../../types/types';
import DashboardAnalytics from './DashboardAnalytics';

const AdminDashboard: React.FC = () => {
  const { posts, deletePost, featuredPostId, setFeaturedPost, loading, error } = usePosts();

  const handleDelete = async (postId: string, postTitle: string) => {
    if (window.confirm(`Are you sure you want to delete the post "${postTitle}"?`)) {
      try {
        await deletePost(postId);
      } catch (err) {
        console.error('Failed to delete post:', err);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const handleToggleFeatured = async (postId: string) => {
    try {
      await setFeaturedPost(featuredPostId === postId ? null : postId);
    } catch (err) {
      console.error('Failed to update featured post:', err);
      alert('Failed to update featured post. Please try again.');
    }
  };

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold font-serif text-gray-900 dark:text-secondary-50">
        Admin Dashboard
      </h1>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <DashboardAnalytics />

      <div className="max-w-7xl mx-auto bg-white dark:bg-surface rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-white/[0.06] pb-4">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-secondary-50">
            Manage Posts
          </h2>
          <Link
            to="/posts/create"
            className="px-5 py-2 bg-accent text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-offset-dark-gray transition-colors"
          >
            Create New Post
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-elevated">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-secondary-300 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-secondary-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-secondary-300 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-surface divide-y divide-gray-200 dark:divide-gray-700">
                {sortedPosts.map((post: Post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-secondary-50">
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-secondary-400">
                        {post.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          post.status === 'Published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-secondary-400">
                      {post.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 md:space-x-4">
                      <button
                        onClick={() => handleToggleFeatured(post.id)}
                        className={`text-sm ${
                          featuredPostId === post.id
                            ? 'text-yellow-500 hover:text-yellow-700'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={featuredPostId === post.id ? 'Unfeature Post' : 'Feature Post'}
                      >
                        &#9733; {/* Star Icon */}
                      </button>
                      {!post.isInitial ? (
                        <>
                          <Link
                            to={`/posts/edit/${post.id}`}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 italic text-xs">
                          Read-only
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
