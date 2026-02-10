import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjects, Project } from '../../hooks/useProjects';

type ProjectStatus = Project['status'];

const PROJECT_STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

const ProjectForm: React.FC = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const isEditMode = Boolean(projectId);
  const { projects, addProject, updateProject } = useProjects();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('active');
  const [featured, setFeatured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode && projectId) {
      const projectToEdit = projects.find((p) => p.id === projectId);
      if (projectToEdit) {
        setTitle(projectToEdit.title);
        setDescription(projectToEdit.description);
        setLongDescription(projectToEdit.long_description || '');
        setGithubUrl(projectToEdit.github_url || '');
        setDemoUrl(projectToEdit.demo_url || '');
        setImageUrl(projectToEdit.image_url || '');
        setTagsText(projectToEdit.tags.join(', '));
        setStatus(projectToEdit.status);
        setFeatured(projectToEdit.featured);
      }
    }
  }, [projectId, isEditMode, projects]);

  const parseTags = (text: string): string[] => {
    return text
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      alert('Please fill in all required fields (Title, Description).');
      return;
    }

    const tags = parseTags(tagsText);

    const projectData = {
      title,
      description,
      long_description: longDescription || undefined,
      github_url: githubUrl || undefined,
      demo_url: demoUrl || undefined,
      image_url: imageUrl || undefined,
      tags,
      status,
      featured,
      sort_order: 0,
    };

    try {
      setIsSaving(true);
      if (isEditMode && projectId) {
        await updateProject(projectId, projectData);
      } else {
        await addProject(projectData);
      }
      navigate('/projects');
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Failed to save project. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClasses =
    'w-full px-3 py-2 text-gray-700 dark:text-secondary-200 bg-white dark:bg-elevated border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200';
  const labelClasses = 'block text-sm font-medium text-gray-700 dark:text-secondary-300 mb-1';

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-surface rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold font-serif text-center mb-6 text-gray-900 dark:text-secondary-50">
        {isEditMode ? 'Edit Project' : 'Add New Project'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className={labelClasses}>
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClasses}
            placeholder="Project title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelClasses}>
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClasses} h-24`}
            placeholder="Short project description"
            required
          />
        </div>

        {/* Long Description */}
        <div>
          <label htmlFor="long_description" className={labelClasses}>
            Long Description
          </label>
          <textarea
            id="long_description"
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            className={`${inputClasses} h-40`}
            placeholder="Detailed project description..."
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-secondary-400">Supports markdown</p>
        </div>

        {/* GitHub URL and Demo URL row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="github_url" className={labelClasses}>
              GitHub URL
            </label>
            <input
              type="text"
              id="github_url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className={inputClasses}
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label htmlFor="demo_url" className={labelClasses}>
              Demo URL
            </label>
            <input
              type="text"
              id="demo_url"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              className={inputClasses}
              placeholder="https://example.com/demo"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="image_url" className={labelClasses}>
            Image URL
          </label>
          <input
            type="text"
            id="image_url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={inputClasses}
            placeholder="https://example.com/image.png"
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className={labelClasses}>
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            className={inputClasses}
            placeholder="React, TypeScript, Firebase"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-secondary-400">
            Separate multiple tags with commas
          </p>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className={labelClasses}>
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            className={inputClasses}
            required
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Featured */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 text-accent focus:ring-accent border-gray-300 dark:border-white/10 rounded"
          />
          <label htmlFor="featured" className="ml-2 text-sm text-gray-700 dark:text-secondary-300">
            Featured project
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            disabled={isSaving}
            className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-secondary-50 dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-accent text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-offset-dark-gray transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSaving && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isSaving ? 'Saving...' : isEditMode ? 'Update Project' : 'Save Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
