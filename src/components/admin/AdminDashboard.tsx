import React from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts';
import type { Post } from '../../types/types';
import DashboardAnalytics from './DashboardAnalytics';
import { cosmic } from './ui/cosmicClassNames';

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
      <h1 className={cosmic.pageTitle}>Dashboard</h1>

      {error && (
        <div className={cosmic.alertError}>
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <DashboardAnalytics />

      <div className={cosmic.container}>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/[0.06]">
          <h2 className={cosmic.sectionTitle}>Garden Entries</h2>
          <Link to="/garden/create" className={cosmic.buttonPrimary}>
            Create New Entry
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-2 border-primary-500/30 border-t-primary-400 rounded-full animate-spin" />
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
                    Status
                  </th>
                  <th scope="col" className={cosmic.tableHeadCell}>
                    Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className={cosmic.tableBody}>
                {sortedPosts.map((post: Post) => (
                  <tr key={post.id} className={cosmic.tableRow}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-secondary-100">{post.title}</div>
                      <div className="text-sm text-secondary-500">{post.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={
                          post.status === 'Published' ? cosmic.badgeSuccess : cosmic.badgeWarning
                        }
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className={cosmic.tableCell}>{post.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => handleToggleFeatured(post.id)}
                        className={`text-base transition-all duration-200 ${
                          featuredPostId === post.id ? cosmic.starActive : cosmic.starInactive
                        }`}
                        title={featuredPostId === post.id ? 'Unfeature Post' : 'Feature Post'}
                      >
                        &#9733;
                      </button>
                      {!post.isInitial ? (
                        <>
                          <Link to={`/garden/edit/${post.id}`} className={cosmic.linkEdit}>
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className={cosmic.linkDelete}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span className="text-secondary-600 italic text-xs">Read-only</span>
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
