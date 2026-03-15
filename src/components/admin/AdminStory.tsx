import React, { useMemo, useState } from 'react';
import { useStory } from '../../hooks/useStory';
import { cosmic } from './ui/cosmicClassNames';

const AdminStory: React.FC = () => {
  const {
    chapters,
    milestones,
    addChapter,
    updateChapter,
    deleteChapter,
    addMilestone,
    deleteMilestone,
    loading,
    error,
  } = useStory();
  const [chapterDraft, setChapterDraft] = useState({
    title: '',
    subtitle: '',
    body: '',
    periodLabel: '',
  });
  const [milestoneDraft, setMilestoneDraft] = useState({
    chapterId: '',
    title: '',
    description: '',
    periodLabel: '',
  });

  const sortedChapters = useMemo(
    () => [...chapters].sort((a, b) => a.sortOrder - b.sortOrder),
    [chapters]
  );

  return (
    <div className={cosmic.container}>
      <div className="mb-8 border-b border-white/[0.06] pb-6">
        <h1 className={cosmic.pageTitle}>Story</h1>
        <p className="mt-2 text-sm text-secondary-400">
          Build the narrative page through chapters and milestones instead of resume bullets.
        </p>
      </div>

      {error && <div className={`${cosmic.alertError} mb-6`}>{error}</div>}

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className={cosmic.card}>
          <h2 className={cosmic.sectionTitle}>Chapters</h2>
          {loading ? (
            <div className={cosmic.loadingOverlay}>
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-500/20 border-t-primary-400" />
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {sortedChapters.map((chapter) => (
                <div key={chapter.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="editorial-kicker">{chapter.periodLabel}</p>
                      <h3 className="mt-2 text-xl font-semibold text-secondary-50">
                        {chapter.title}
                      </h3>
                      {chapter.subtitle && (
                        <p className="mt-2 text-sm text-secondary-400">{chapter.subtitle}</p>
                      )}
                    </div>
                    <button className={cosmic.linkDelete} onClick={() => deleteChapter(chapter.id)}>
                      Delete
                    </button>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-secondary-300">{chapter.body}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      className={cosmic.buttonSmall}
                      onClick={() => updateChapter(chapter.id, { visible: !chapter.visible })}
                    >
                      {chapter.visible ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {milestones
                      .filter((milestone) => milestone.chapterId === chapter.id)
                      .map((milestone) => (
                        <div
                          key={milestone.id}
                          className="rounded-xl border border-white/[0.06] bg-[#07111f]/60 p-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-medium text-secondary-50">{milestone.title}</p>
                              {milestone.description && (
                                <p className="mt-1 text-sm text-secondary-400">
                                  {milestone.description}
                                </p>
                              )}
                            </div>
                            <button
                              className={cosmic.linkDelete}
                              onClick={() => deleteMilestone(milestone.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await addChapter({
                title: chapterDraft.title,
                subtitle: chapterDraft.subtitle || undefined,
                body: chapterDraft.body,
                periodLabel: chapterDraft.periodLabel || undefined,
                visible: true,
                sortOrder: chapters.length,
              });
              setChapterDraft({ title: '', subtitle: '', body: '', periodLabel: '' });
            }}
            className={cosmic.card}
          >
            <h2 className={cosmic.sectionTitle}>Add Chapter</h2>
            <div className="mt-6 space-y-4">
              <input
                className={cosmic.input}
                placeholder="Title"
                value={chapterDraft.title}
                onChange={(e) => setChapterDraft((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
              <input
                className={cosmic.input}
                placeholder="Period label"
                value={chapterDraft.periodLabel}
                onChange={(e) =>
                  setChapterDraft((prev) => ({ ...prev, periodLabel: e.target.value }))
                }
              />
              <input
                className={cosmic.input}
                placeholder="Subtitle"
                value={chapterDraft.subtitle}
                onChange={(e) =>
                  setChapterDraft((prev) => ({ ...prev, subtitle: e.target.value }))
                }
              />
              <textarea
                className={cosmic.textarea}
                placeholder="Chapter body"
                value={chapterDraft.body}
                onChange={(e) => setChapterDraft((prev) => ({ ...prev, body: e.target.value }))}
                required
              />
              <button type="submit" className={cosmic.buttonPrimary}>
                Save Chapter
              </button>
            </div>
          </form>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await addMilestone({
                chapterId: milestoneDraft.chapterId || undefined,
                title: milestoneDraft.title,
                description: milestoneDraft.description || undefined,
                periodLabel: milestoneDraft.periodLabel || undefined,
                sortOrder: milestones.length,
              });
              setMilestoneDraft({ chapterId: '', title: '', description: '', periodLabel: '' });
            }}
            className={cosmic.card}
          >
            <h2 className={cosmic.sectionTitle}>Add Milestone</h2>
            <div className="mt-6 space-y-4">
              <select
                className={cosmic.select}
                value={milestoneDraft.chapterId}
                onChange={(e) =>
                  setMilestoneDraft((prev) => ({ ...prev, chapterId: e.target.value }))
                }
              >
                <option value="">Select chapter</option>
                {sortedChapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
              <input
                className={cosmic.input}
                placeholder="Milestone title"
                value={milestoneDraft.title}
                onChange={(e) =>
                  setMilestoneDraft((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
              <input
                className={cosmic.input}
                placeholder="Period label"
                value={milestoneDraft.periodLabel}
                onChange={(e) =>
                  setMilestoneDraft((prev) => ({ ...prev, periodLabel: e.target.value }))
                }
              />
              <textarea
                className={cosmic.textarea}
                placeholder="Description"
                value={milestoneDraft.description}
                onChange={(e) =>
                  setMilestoneDraft((prev) => ({ ...prev, description: e.target.value }))
                }
              />
              <button type="submit" className={cosmic.buttonPrimary}>
                Save Milestone
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminStory;
