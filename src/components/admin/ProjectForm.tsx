import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjects, type Project } from '../../hooks/useProjects';
import { slugify } from '../../types/converters';
import { cosmic } from './ui/cosmicClassNames';

type ProjectStatus = Project['status'];

const PROJECT_STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'tinkering', label: 'Tinkering' },
];

const parseCommaSeparatedList = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const ProjectForm: React.FC = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const isEditMode = Boolean(projectId);
  const { projects, addProject, updateProject } = useProjects();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [techStackText, setTechStackText] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [problem, setProblem] = useState('');
  const [motivation, setMotivation] = useState('');
  const [approach, setApproach] = useState('');
  const [architecture, setArchitecture] = useState('');
  const [implementation, setImplementation] = useState('');
  const [challenges, setChallenges] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [futureImprovements, setFutureImprovements] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('active');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEditMode || !projectId) return;

    const projectToEdit = projects.find((project) => project.id === projectId);
    if (!projectToEdit) return;

    setTitle(projectToEdit.title);
    setSlug(projectToEdit.slug);
    setDescription(projectToEdit.description);
    setTechStackText(projectToEdit.techStack.join(', '));
    setTagsText((projectToEdit.tags || []).join(', '));
    setGithubUrl(projectToEdit.githubUrl || '');
    setLiveUrl(projectToEdit.liveUrl || '');
    setImageUrl(projectToEdit.imageUrl || '');
    setProblem(projectToEdit.problem || '');
    setMotivation(projectToEdit.motivation || '');
    setApproach(projectToEdit.approach || '');
    setArchitecture(projectToEdit.architecture || '');
    setImplementation(projectToEdit.implementation || '');
    setChallenges(projectToEdit.challenges || '');
    setLessonsLearned(projectToEdit.lessonsLearned || '');
    setFutureImprovements(projectToEdit.futureImprovements || '');
    setStatus(projectToEdit.status);
    setIsFeatured(projectToEdit.isFeatured);
  }, [isEditMode, projectId, projects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      alert('Please fill in all required fields (Title and Summary).');
      return;
    }

    const existingProject = projects.find((project) => project.id === projectId);

    const projectData = {
      title,
      slug: slug || slugify(title),
      description,
      techStack: parseCommaSeparatedList(techStackText),
      tags: parseCommaSeparatedList(tagsText),
      githubUrl: githubUrl || undefined,
      liveUrl: liveUrl || undefined,
      imageUrl: imageUrl || undefined,
      problem: problem || undefined,
      motivation: motivation || undefined,
      approach: approach || undefined,
      architecture: architecture || undefined,
      implementation: implementation || undefined,
      challenges: challenges || undefined,
      lessonsLearned: lessonsLearned || undefined,
      futureImprovements: futureImprovements || undefined,
      status,
      isFeatured,
      sortOrder: existingProject?.sortOrder ?? projects.length,
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

  return (
    <div className={cosmic.containerSm}>
      <h1 className={`${cosmic.pageTitle} mb-6 text-center`}>
        {isEditMode ? 'Edit Project' : 'Add New Project'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className={cosmic.card}>
          <h2 className={cosmic.sectionTitle}>Project Identity</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="title" className={cosmic.label}>
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => {
                  const nextTitle = e.target.value;
                  setTitle(nextTitle);
                  if (!isEditMode || slug === '' || slug === slugify(title)) {
                    setSlug(slugify(nextTitle));
                  }
                }}
                className={cosmic.input}
                placeholder="Universal AI Chatbot"
                required
              />
            </div>
            <div>
              <label htmlFor="slug" className={cosmic.label}>
                Slug
              </label>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className={cosmic.input}
                placeholder="universal-ai-chatbot"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="description" className={cosmic.label}>
              Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${cosmic.textarea} h-24`}
              placeholder="A concise summary for the Lab overview and project hero."
              required
            />
          </div>
        </section>

        <section className={cosmic.card}>
          <h2 className={cosmic.sectionTitle}>Links and Metadata</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="github_url" className={cosmic.label}>
                GitHub URL
              </label>
              <input
                type="text"
                id="github_url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className={cosmic.input}
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label htmlFor="live_url" className={cosmic.label}>
                Demo URL
              </label>
              <input
                type="text"
                id="live_url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className={cosmic.input}
                placeholder="https://example.com/demo"
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="image_url" className={cosmic.label}>
              Cover Image URL
            </label>
            <input
              type="text"
              id="image_url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={cosmic.input}
              placeholder="https://example.com/project-cover.png"
            />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="tech_stack" className={cosmic.label}>
                Tech Stack
              </label>
              <input
                type="text"
                id="tech_stack"
                value={techStackText}
                onChange={(e) => setTechStackText(e.target.value)}
                className={cosmic.input}
                placeholder="Astro, React, Supabase"
              />
              <p className="mt-1 text-xs text-secondary-400">Separate multiple items with commas</p>
            </div>
            <div>
              <label htmlFor="tags" className={cosmic.label}>
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                className={cosmic.input}
                placeholder="LLM, chat UX, student tools"
              />
              <p className="mt-1 text-xs text-secondary-400">Separate multiple tags with commas</p>
            </div>
            <div>
              <label htmlFor="status" className={cosmic.label}>
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className={cosmic.select}
                required
              >
                {PROJECT_STATUSES.map((projectStatus) => (
                  <option key={projectStatus.value} value={projectStatus.value}>
                    {projectStatus.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-white/10 accent-primary-500"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-secondary-300">
              Feature this project on the site
            </label>
          </div>
        </section>

        <section className={cosmic.card}>
          <h2 className={cosmic.sectionTitle}>Case Study</h2>
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="problem" className={cosmic.label}>
                Problem
              </label>
              <textarea
                id="problem"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className={`${cosmic.textarea} h-28`}
                placeholder="What problem was this project trying to solve?"
              />
            </div>
            <div>
              <label htmlFor="motivation" className={cosmic.label}>
                Motivation
              </label>
              <textarea
                id="motivation"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                className={`${cosmic.textarea} h-28`}
                placeholder="Why this project mattered to you at this stage."
              />
            </div>
            <div>
              <label htmlFor="approach" className={cosmic.label}>
                Approach
              </label>
              <textarea
                id="approach"
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                className={`${cosmic.textarea} h-28`}
                placeholder="How you framed the solution."
              />
            </div>
            <div>
              <label htmlFor="architecture" className={cosmic.label}>
                Architecture
              </label>
              <textarea
                id="architecture"
                value={architecture}
                onChange={(e) => setArchitecture(e.target.value)}
                className={`${cosmic.textarea} h-28`}
                placeholder="System architecture, components, and data flow."
              />
            </div>
            <div>
              <label htmlFor="implementation" className={cosmic.label}>
                Implementation
              </label>
              <textarea
                id="implementation"
                value={implementation}
                onChange={(e) => setImplementation(e.target.value)}
                className={`${cosmic.textarea} h-32`}
                placeholder="How you actually implemented the project."
              />
            </div>
            <div>
              <label htmlFor="challenges" className={cosmic.label}>
                Challenges
              </label>
              <textarea
                id="challenges"
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                className={`${cosmic.textarea} h-28`}
                placeholder="What was difficult, messy, or surprising."
              />
            </div>
            <div>
              <label htmlFor="lessons_learned" className={cosmic.label}>
                Lessons Learned
              </label>
              <textarea
                id="lessons_learned"
                value={lessonsLearned}
                onChange={(e) => setLessonsLearned(e.target.value)}
                className={`${cosmic.textarea} h-28`}
                placeholder="What this project taught you."
              />
            </div>
            <div>
              <label htmlFor="future_improvements" className={cosmic.label}>
                Future Improvements
              </label>
              <textarea
                id="future_improvements"
                value={futureImprovements}
                onChange={(e) => setFutureImprovements(e.target.value)}
                className={`${cosmic.textarea} h-28`}
                placeholder="What you would improve or explore next."
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            disabled={isSaving}
            className={`${cosmic.buttonSecondary} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className={`${cosmic.buttonPrimary} flex items-center disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isSaving && (
              <svg
                className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
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
