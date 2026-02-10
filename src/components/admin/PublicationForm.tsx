import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePublications, Publication } from '../../hooks/usePublications';

type PublicationType = Publication['type'];

const PUBLICATION_TYPES: { value: PublicationType; label: string }[] = [
  { value: 'conference', label: 'Conference' },
  { value: 'journal', label: 'Journal' },
  { value: 'preprint', label: 'Preprint' },
  { value: 'thesis', label: 'Thesis' },
  { value: 'book_chapter', label: 'Book Chapter' },
];

const PublicationForm: React.FC = () => {
  const { pubId } = useParams<{ pubId?: string }>();
  const isEditMode = Boolean(pubId);
  const { publications, addPublication, updatePublication } = usePublications();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [authorsText, setAuthorsText] = useState('');
  const [venue, setVenue] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [type, setType] = useState<PublicationType>('conference');
  const [abstract, setAbstract] = useState('');
  const [doi, setDoi] = useState('');
  const [arxivUrl, setArxivUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [codeUrl, setCodeUrl] = useState('');
  const [slidesUrl, setSlidesUrl] = useState('');
  const [bibtex, setBibtex] = useState('');
  const [featured, setFeatured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode && pubId) {
      const pubToEdit = publications.find((p) => p.id === pubId);
      if (pubToEdit) {
        setTitle(pubToEdit.title);
        setAuthorsText(pubToEdit.authors.join(', '));
        setVenue(pubToEdit.venue);
        setYear(pubToEdit.year);
        setType(pubToEdit.type);
        setAbstract(pubToEdit.abstract || '');
        setDoi(pubToEdit.doi || '');
        setArxivUrl(pubToEdit.arxiv_url || '');
        setPdfUrl(pubToEdit.pdf_url || '');
        setCodeUrl(pubToEdit.code_url || '');
        setSlidesUrl(pubToEdit.slides_url || '');
        setBibtex(pubToEdit.bibtex || '');
        setFeatured(pubToEdit.featured);
      }
    }
  }, [pubId, isEditMode, publications]);

  const parseAuthors = (text: string): string[] => {
    return text
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const authors = parseAuthors(authorsText);
    if (!title || authors.length === 0 || !venue || !year) {
      alert('Please fill in all required fields (Title, Authors, Venue, Year).');
      return;
    }

    const pubData = {
      title,
      authors,
      venue,
      year,
      type,
      abstract: abstract || undefined,
      doi: doi || undefined,
      arxiv_url: arxivUrl || undefined,
      pdf_url: pdfUrl || undefined,
      code_url: codeUrl || undefined,
      slides_url: slidesUrl || undefined,
      bibtex: bibtex || undefined,
      featured,
      sort_order: 0,
    };

    try {
      setIsSaving(true);
      if (isEditMode && pubId) {
        await updatePublication(pubId, pubData);
      } else {
        await addPublication(pubData);
      }
      navigate('/publications');
    } catch (err) {
      console.error('Error saving publication:', err);
      alert('Failed to save publication. Please try again.');
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
        {isEditMode ? 'Edit Publication' : 'Add New Publication'}
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
            placeholder="Publication title"
            required
          />
        </div>

        {/* Authors */}
        <div>
          <label htmlFor="authors" className={labelClasses}>
            Authors <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="authors"
            value={authorsText}
            onChange={(e) => setAuthorsText(e.target.value)}
            className={inputClasses}
            placeholder="Author One, Author Two, Author Three"
            required
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-secondary-400">
            Separate multiple authors with commas
          </p>
        </div>

        {/* Venue and Year row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="venue" className={labelClasses}>
              Venue <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className={inputClasses}
              placeholder="e.g., NeurIPS 2024, Nature, arXiv"
              required
            />
          </div>
          <div>
            <label htmlFor="year" className={labelClasses}>
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className={inputClasses}
              min={1900}
              max={2100}
              required
            />
          </div>
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className={labelClasses}>
            Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as PublicationType)}
            className={inputClasses}
            required
          >
            {PUBLICATION_TYPES.map((pt) => (
              <option key={pt.value} value={pt.value}>
                {pt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Abstract */}
        <div>
          <label htmlFor="abstract" className={labelClasses}>
            Abstract
          </label>
          <textarea
            id="abstract"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            className={`${inputClasses} h-32`}
            placeholder="Publication abstract..."
          />
        </div>

        {/* DOI and arXiv URL row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="doi" className={labelClasses}>
              DOI
            </label>
            <input
              type="text"
              id="doi"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              className={inputClasses}
              placeholder="10.1000/example"
            />
          </div>
          <div>
            <label htmlFor="arxiv_url" className={labelClasses}>
              arXiv URL
            </label>
            <input
              type="text"
              id="arxiv_url"
              value={arxivUrl}
              onChange={(e) => setArxivUrl(e.target.value)}
              className={inputClasses}
              placeholder="https://arxiv.org/abs/..."
            />
          </div>
        </div>

        {/* PDF and Code URL row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pdf_url" className={labelClasses}>
              PDF URL
            </label>
            <input
              type="text"
              id="pdf_url"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              className={inputClasses}
              placeholder="https://example.com/paper.pdf"
            />
          </div>
          <div>
            <label htmlFor="code_url" className={labelClasses}>
              Code URL
            </label>
            <input
              type="text"
              id="code_url"
              value={codeUrl}
              onChange={(e) => setCodeUrl(e.target.value)}
              className={inputClasses}
              placeholder="https://github.com/..."
            />
          </div>
        </div>

        {/* Slides URL */}
        <div>
          <label htmlFor="slides_url" className={labelClasses}>
            Slides URL
          </label>
          <input
            type="text"
            id="slides_url"
            value={slidesUrl}
            onChange={(e) => setSlidesUrl(e.target.value)}
            className={inputClasses}
            placeholder="https://example.com/slides"
          />
        </div>

        {/* BibTeX */}
        <div>
          <label htmlFor="bibtex" className={labelClasses}>
            BibTeX
          </label>
          <textarea
            id="bibtex"
            value={bibtex}
            onChange={(e) => setBibtex(e.target.value)}
            className={`${inputClasses} h-40 font-mono text-sm`}
            placeholder={'@article{key,\n  title={...},\n  author={...},\n  year={...}\n}'}
          />
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
            Featured publication
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/publications')}
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
            {isSaving ? 'Saving...' : isEditMode ? 'Update Publication' : 'Save Publication'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublicationForm;
