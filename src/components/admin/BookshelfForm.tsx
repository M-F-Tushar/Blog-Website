import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBookshelf } from '../../hooks/useBookshelf';
import { slugify } from '../../types/converters';
import { cosmic } from './ui/cosmicClassNames';
import type { BookshelfEntry } from '../../types/types';

const ENTRY_TYPES: BookshelfEntry['entryType'][] = [
  'reflection',
  'review',
  'reading-log',
  'favorite',
  'essay',
];

type BookshelfFormState = {
  title: string;
  slug: string;
  entryType: BookshelfEntry['entryType'];
  bookTitle: string;
  author: string;
  coverImage: string;
  summary: string;
  body: string;
  tags: string;
  rating: string;
  status: BookshelfEntry['status'];
  isFeatured: boolean;
  isPinned: boolean;
};

const createEmptyFormState = (): BookshelfFormState => ({
  title: '',
  slug: '',
  entryType: 'reflection',
  bookTitle: '',
  author: '',
  coverImage: '',
  summary: '',
  body: '',
  tags: '',
  rating: '',
  status: 'draft',
  isFeatured: false,
  isPinned: false,
});

const createFormStateFromEntry = (entry: BookshelfEntry): BookshelfFormState => ({
  title: entry.title,
  slug: entry.slug,
  entryType: entry.entryType,
  bookTitle: entry.bookTitle,
  author: entry.author || '',
  coverImage: entry.coverImage || '',
  summary: entry.summary || '',
  body: entry.body,
  tags: entry.tags.join(', '),
  rating: entry.rating?.toString() || '',
  status: entry.status,
  isFeatured: entry.isFeatured,
  isPinned: entry.isPinned,
});

interface BookshelfFormFieldsProps {
  initialState: BookshelfFormState;
  isEditMode: boolean;
  onSubmit: (
    payload: Omit<BookshelfEntry, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'> & {
      publishedAt?: string;
    }
  ) => Promise<void>;
}

const BookshelfFormFields: React.FC<BookshelfFormFieldsProps> = ({
  initialState,
  isEditMode,
  onSubmit,
}) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<BookshelfFormState>(initialState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      entryType: form.entryType,
      bookTitle: form.bookTitle,
      author: form.author || undefined,
      coverImage: form.coverImage || undefined,
      summary: form.summary || undefined,
      body: form.body,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      rating: form.rating ? Number(form.rating) : undefined,
      status: form.status,
      isFeatured: form.isFeatured,
      isPinned: form.isPinned,
      sortOrder: 0,
      seoTitle: undefined,
      seoDescription: undefined,
      publishedAt: form.status === 'published' ? new Date().toISOString() : undefined,
    };

    await onSubmit(payload);
  };

  return (
    <div className={cosmic.containerSm}>
      <h1 className={`${cosmic.pageTitle} mb-6 text-center`}>
        {isEditMode ? 'Edit Bookshelf Entry' : 'New Bookshelf Entry'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={cosmic.label}>Title</label>
            <input
              className={cosmic.input}
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                  slug: slugify(e.target.value),
                }))
              }
              required
            />
          </div>
          <div>
            <label className={cosmic.label}>Slug</label>
            <input
              className={cosmic.input}
              value={form.slug}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))
              }
              required
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className={cosmic.label}>Entry Type</label>
            <select
              className={cosmic.select}
              value={form.entryType}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  entryType: e.target.value as BookshelfEntry['entryType'],
                }))
              }
            >
              {ENTRY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={cosmic.label}>Book Title</label>
            <input
              className={cosmic.input}
              value={form.bookTitle}
              onChange={(e) => setForm((prev) => ({ ...prev, bookTitle: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className={cosmic.label}>Author</label>
            <input
              className={cosmic.input}
              value={form.author}
              onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label className={cosmic.label}>Summary</label>
          <textarea
            className={cosmic.textarea}
            value={form.summary}
            onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
          />
        </div>
        <div>
          <label className={cosmic.label}>Body</label>
          <textarea
            className={`${cosmic.textarea} min-h-[240px]`}
            value={form.body}
            onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className={cosmic.label}>Tags</label>
            <input
              className={cosmic.input}
              value={form.tags}
              onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
            />
          </div>
          <div>
            <label className={cosmic.label}>Rating</label>
            <input
              className={cosmic.input}
              value={form.rating}
              onChange={(e) => setForm((prev) => ({ ...prev, rating: e.target.value }))}
            />
          </div>
          <div>
            <label className={cosmic.label}>Status</label>
            <select
              className={cosmic.select}
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value as BookshelfEntry['status'] }))
              }
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </div>
        </div>
        <div>
          <label className={cosmic.label}>Cover Image URL</label>
          <input
            className={cosmic.input}
            value={form.coverImage}
            onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-secondary-300">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
            />
            Featured entry
          </label>
          <label className="flex items-center gap-2 text-sm text-secondary-300">
            <input
              type="checkbox"
              checked={form.isPinned}
              onChange={(e) => setForm((prev) => ({ ...prev, isPinned: e.target.checked }))}
            />
            Pinned entry
          </label>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className={cosmic.buttonSecondary}
            onClick={() => navigate('/bookshelf')}
          >
            Cancel
          </button>
          <button type="submit" className={cosmic.buttonPrimary}>
            Save Entry
          </button>
        </div>
      </form>
    </div>
  );
};

const BookshelfForm: React.FC = () => {
  const { entryId } = useParams<{ entryId?: string }>();
  const { entries, addEntry, updateEntry } = useBookshelf();
  const navigate = useNavigate();
  const isEditMode = Boolean(entryId);
  const entry = entryId ? entries.find((candidate) => candidate.id === entryId) : undefined;

  if (isEditMode && entryId && !entry && entries.length > 0) {
    return (
      <div className={cosmic.containerSm}>
        <div className={cosmic.alertError}>That bookshelf entry could not be found.</div>
      </div>
    );
  }

  return (
    <BookshelfFormFields
      key={entry?.id || 'new-bookshelf-entry'}
      initialState={entry ? createFormStateFromEntry(entry) : createEmptyFormState()}
      isEditMode={isEditMode}
      onSubmit={async (payload) => {
        if (isEditMode && entryId) await updateEntry(entryId, payload);
        else await addEntry(payload);
        navigate('/bookshelf');
      }}
    />
  );
};

export default BookshelfForm;
