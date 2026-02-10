import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProjects, Project } from '../../hooks/useProjects';

const STATUS_BADGE_CLASSES: Record<Project['status'], string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-secondary-200',
};

const STATUS_LABELS: Record<Project['status'], string> = {
  active: 'Active',
  completed: 'Completed',
  archived: 'Archived',
};

const AdminProjects: React.FC = () => {
  const { projects, updateProject, deleteProject, loading, error } = useProjects();

  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    filtered.sort((a, b) => a.sort_order - b.sort_order);

    return filtered;
  }, [projects, statusFilter]);

  const handleDelete = async (projectId: string, projectTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${projectTitle}"?`)) {
      try {
        await deleteProject(projectId);
      } catch (err) {
        console.error('Failed to delete project:', err);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      await updateProject(project.id, { featured: !project.featured });
    } catch (err) {
      console.error('Failed to toggle featured status:', err);
      alert('Failed to update project. Please try again.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-surface rounded-lg shadow-lg p-8">
      {error && (
        <div className="mb-6 bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-white/[0.06] pb-6">
        <h1 className="text-3xl font-bold font-serif text-gray-900 dark:text-secondary-50">
          Manage Projects
        </h1>
        <Link
          to="/projects/create"
          className="px-5 py-2 bg-accent text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-offset-dark-gray transition-colors"
        >
          Add Project
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label
            htmlFor="statusFilter"
            className="block text-sm font-medium text-gray-700 dark:text-secondary-300 mb-1"
          >
            Status
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-gray-700 dark:text-secondary-200 bg-white dark:bg-elevated border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        {statusFilter !== 'all' && (
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className="px-3 py-2 text-sm text-gray-600 dark:text-secondary-400 hover:text-gray-900 dark:hover:text-gray-100 underline transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-secondary-400">
          <p className="text-lg">
            {projects.length === 0
              ? 'No projects yet. Click "Add Project" to create one.'
              : 'No projects match the selected filters.'}
          </p>
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
                  Tags
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-secondary-300 uppercase tracking-wider"
                >
                  Featured
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4">
                    <div
                      className="text-sm font-medium text-gray-900 dark:text-secondary-50 max-w-xs truncate"
                      title={project.title}
                    >
                      {project.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_BADGE_CLASSES[project.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-secondary-200'}`}
                    >
                      {STATUS_LABELS[project.status] || project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="text-sm text-gray-500 dark:text-secondary-400 max-w-xs truncate"
                      title={project.tags.join(', ')}
                    >
                      {project.tags.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleFeatured(project)}
                      className="focus:outline-none transition-colors"
                      title={project.featured ? 'Remove from featured' : 'Mark as featured'}
                      aria-label={project.featured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      {project.featured ? (
                        <svg
                          className="h-5 w-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-gray-300 dark:text-gray-500 hover:text-yellow-400 dark:hover:text-yellow-400"
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <Link
                        to={`/projects/edit/${project.id}`}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-sm text-gray-500 dark:text-secondary-400">
            Showing {filteredProjects.length} of {projects.length} project
            {projects.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
