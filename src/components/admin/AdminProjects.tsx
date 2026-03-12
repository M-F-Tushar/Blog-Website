import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProjects, type Project } from '../../hooks/useProjects';
import { cosmic } from './ui/cosmicClassNames';

const STATUS_BADGE_CLASSES: Record<Project['status'], string> = {
  active: cosmic.badgeSuccess,
  completed: cosmic.badgeAccent,
  archived: cosmic.badgeNeutral,
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
    <div className={cosmic.container}>
      {error && (
        <div className={`mb-6 ${cosmic.alertError}`}>
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-8 border-b border-white/[0.06] pb-6">
        <h1 className={cosmic.pageTitle}>Manage Projects</h1>
        <Link to="/projects/create" className={cosmic.buttonPrimary}>
          Add Project
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label htmlFor="statusFilter" className={cosmic.label}>
            Status
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={cosmic.select}
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
      ) : filteredProjects.length === 0 ? (
        <div className={cosmic.emptyState}>
          <p className="text-lg">
            {projects.length === 0
              ? 'No projects yet. Click "Add Project" to create one.'
              : 'No projects match the selected filters.'}
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
                  Status
                </th>
                <th scope="col" className={cosmic.tableHeadCell}>
                  Tags
                </th>
                <th scope="col" className={cosmic.tableHeadCell}>
                  Featured
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className={cosmic.tableBody}>
              {filteredProjects.map((project) => (
                <tr key={project.id} className={cosmic.tableRow}>
                  <td className={cosmic.tableCell}>
                    <div
                      className="text-sm font-medium text-secondary-50 max-w-xs truncate"
                      title={project.title}
                    >
                      {project.title}
                    </div>
                  </td>
                  <td className={cosmic.tableCell}>
                    <span className={STATUS_BADGE_CLASSES[project.status] || cosmic.badgeNeutral}>
                      {STATUS_LABELS[project.status] || project.status}
                    </span>
                  </td>
                  <td className={cosmic.tableCell}>
                    <div
                      className="text-sm text-secondary-400 max-w-xs truncate"
                      title={project.tags.join(', ')}
                    >
                      {project.tags.join(', ')}
                    </div>
                  </td>
                  <td className={cosmic.tableCell}>
                    <button
                      onClick={() => handleToggleFeatured(project)}
                      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 rounded transition-colors"
                      title={project.featured ? 'Remove from featured' : 'Mark as featured'}
                      aria-label={project.featured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      {project.featured ? (
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
                  </td>
                  <td className={`${cosmic.tableCell} text-right text-sm font-medium`}>
                    <div className="flex items-center justify-end space-x-3">
                      <Link to={`/projects/edit/${project.id}`} className={cosmic.linkEdit}>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
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
            Showing {filteredProjects.length} of {projects.length} project
            {projects.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
