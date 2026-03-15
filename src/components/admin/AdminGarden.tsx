import React from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts';
import type { Post } from '../../types/types';
import { cosmic } from './ui/cosmicClassNames';

const AdminGarden: React.FC = () => {
  const { posts, deletePost, featuredPostId, setFeaturedPost, loading, error } = usePosts();

  const handleDelete = async (postId: string, postTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${postTitle}"?`)) return;

    try {
      await deletePost(postId);
    } catch (err) {
      console.error('Failed to delete garden entry:', err);
      alert('Failed to delete garden entry. Please try again.');
    }
  };

  const handleToggleFeatured = async (postId: string) => {
    try {
      await setFeaturedPost(featuredPostId === postId ? null : postId);
    } catch (err) {
      console.error('Failed to update featured garden entry:', err);
      alert('Failed to update featured garden entry. Please try again.');
    }
  };

  const sortedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const publishedCount = sortedPosts.filter((post) => post.status === 'Published').length;
  const draftCount = sortedPosts.length - publishedCount;

  return (
    <div className={cosmic.container}>
      <div className="mb-8 border-b border-white/[0.06] pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className={cosmic.pageTitle}>Garden</h1>
            <p className="mt-2 text-sm text-secondary-400">
              Manage active learning notes, synthesized explanations, and thinking notes.
            </p>
          </div>
          <Link to="/garden/create" className={cosmic.buttonPrimary}>
            New Garden Entry
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-secondary-500">
          <span>{sortedPosts.length} total</span>
          <span>{publishedCount} published</span>
          <span>{draftCount} drafts</span>
          <span>{featuredPostId ? '1 featured signal' : 'No featured signal'}</span>
        </div>
      </div>

      {error && (
        <div className={`${cosmic.alertError} mb-6`}>
          <p className="font-semibold">Unable to load garden entries</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {loading ? (
        <div className={cosmic.loadingOverlay}>
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-500/20 border-t-primary-400" />
        </div>
      ) : sortedPosts.length === 0 ? (
        <div className={cosmic.emptyState}>No garden entries yet.</div>
      ) : (
        <div className={cosmic.tableWrapper}>
          <table className={cosmic.table}>
            <thead className={cosmic.tableHead}>
              <tr>
                <th scope="col" className={cosmic.tableHeadCell}>
                  Entry
                </th>
                <th scope="col" className={cosmic.tableHeadCell}>
                  Status
                </th>
                <th scope="col" className={cosmic.tableHeadCell}>
                  Date
                </th>
                <th scope="col" className={cosmic.tableHeadCell}>
                  Signal
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
                    <span className={post.status === 'Published' ? cosmic.badgeSuccess : cosmic.badgeWarning}>
                      {post.status}
                    </span>
                  </td>
                  <td className={cosmic.tableCell}>{post.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(post.id)}
                      className={`text-base transition-all duration-200 ${
                        featuredPostId === post.id ? cosmic.starActive : cosmic.starInactive
                      }`}
                      title={featuredPostId === post.id ? 'Remove featured signal' : 'Set as featured signal'}
                    >
                      &#9733;
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    {!post.isInitial ? (
                      <>
                        <Link to={`/garden/edit/${post.id}`} className={cosmic.linkEdit}>
                          Edit
                        </Link>
                        <button
                          type="button"
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
  );
};

export default AdminGarden;
