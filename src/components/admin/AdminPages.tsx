import React, { useMemo, useState } from 'react';
import { usePageSections } from '../../hooks/usePageSections';
import { useProjects } from '../../hooks/useProjects';
import { usePosts } from '../../hooks/usePosts';
import { useBookshelf } from '../../hooks/useBookshelf';
import { useContactLinks } from '../../hooks/useContactLinks';
import { cosmic } from './ui/cosmicClassNames';
import type { PageSectionRecord } from '../../types/types';
import {
  PAGE_KEYS,
  PAGE_SECTION_ALIGNMENT_OPTIONS,
  PAGE_SECTION_ANIMATION_OPTIONS,
  PAGE_SECTION_BACKGROUND_OPTIONS,
  PAGE_SECTION_COLLECTION_OPTIONS,
  PAGE_SECTION_DENSITY_OPTIONS,
  PAGE_SECTION_EMPHASIS_OPTIONS,
  PAGE_SECTION_GROUPING_OPTIONS,
  PAGE_SECTION_KICKER_OPTIONS,
  PAGE_SECTION_LAYOUT_OPTIONS,
  PAGE_SECTION_MEDIA_OPTIONS,
  PAGE_SECTION_PRESETS,
  PAGE_SECTION_ROLE_OPTIONS,
  PAGE_SECTION_SOURCE_OPTIONS,
  PAGE_SECTION_TONE_OPTIONS,
  PAGE_SECTION_TYPE_OPTIONS,
  applyPresetToSection,
  describePageSection,
  getDefaultPageSection,
  getPageBlueprint,
} from '../../lib/pageSections';

type ComposerDraft = Omit<PageSectionRecord, 'id' | 'createdAt' | 'updatedAt'>;

const createDraft = (pageKey: string): ComposerDraft => getDefaultPageSection({ pageKey });

const AdminPages: React.FC = () => {
  const { sections, addSection, updateSection, deleteSection, loading, error } = usePageSections();
  const { projects } = useProjects();
  const { posts } = usePosts();
  const { entries } = useBookshelf();
  const { links } = useContactLinks();

  const [selectedPage, setSelectedPage] = useState<(typeof PAGE_KEYS)[number]>('home');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ComposerDraft>(() => createDraft('home'));
  const [panelItemsText, setPanelItemsText] = useState('');

  const filteredSections = useMemo(
    () =>
      sections
        .filter((section) => section.pageKey === selectedPage)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [sections, selectedPage]
  );

  const collectionItems = useMemo(() => {
    if (draft.contentCollection === 'projects') {
      return projects.map((project) => ({
        id: project.id,
        label: project.title,
        detail: `/lab/${project.slug}`,
      }));
    }

    if (draft.contentCollection === 'posts') {
      return posts.map((post) => ({
        id: post.id,
        label: post.title,
        detail: post.category,
      }));
    }

    if (draft.contentCollection === 'bookshelf') {
      return entries.map((entry) => ({
        id: entry.id,
        label: entry.title,
        detail: entry.bookTitle,
      }));
    }

    if (draft.contentCollection === 'contact-links') {
      return links.map((link) => ({
        id: link.id,
        label: link.label,
        detail: link.url,
      }));
    }

    return [];
  }, [draft.contentCollection, entries, links, posts, projects]);

  const featuredField =
    draft.contentCollection === 'projects'
      ? 'featuredProjectId'
      : draft.contentCollection === 'posts'
        ? 'featuredPostId'
        : draft.contentCollection === 'bookshelf'
          ? 'featuredBookshelfEntryId'
          : null;

  const updateDraft = (patch: Partial<ComposerDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const resetComposer = (pageKey: (typeof PAGE_KEYS)[number] = selectedPage) => {
    setEditingId(null);
    setDraft(createDraft(pageKey));
    setPanelItemsText('');
  };

  const handlePageSelect = (pageKey: (typeof PAGE_KEYS)[number]) => {
    setSelectedPage(pageKey);
    resetComposer(pageKey);
  };

  const startEditing = (section: PageSectionRecord) => {
    setEditingId(section.id);
    setSelectedPage(section.pageKey as (typeof PAGE_KEYS)[number]);
    setDraft({
      ...createDraft(section.pageKey as (typeof PAGE_KEYS)[number]),
      ...section,
      manualItemIds: section.manualItemIds || [],
      metadata: section.metadata || {},
    });
    setPanelItemsText((section.metadata?.panelItems as string[] | undefined)?.join('\n') || '');
  };

  const handlePresetChange = (presetKey: string) => {
    setDraft((prev) => applyPresetToSection({ ...prev, pageKey: selectedPage }, presetKey));
  };

  const handleManualToggle = (id: string) => {
    setDraft((prev) => {
      const current = prev.manualItemIds || [];
      return {
        ...prev,
        manualItemIds: current.includes(id)
          ? current.filter((itemId) => itemId !== id)
          : [...current, id],
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const panelItems = panelItemsText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    const nextDraft: ComposerDraft = {
      ...draft,
      pageKey: selectedPage,
      manualItemIds: draft.manualItemIds || [],
      metadata: {
        ...(draft.metadata || {}),
        panelItems,
      },
      sortOrder: Number.isFinite(draft.sortOrder) ? draft.sortOrder : filteredSections.length,
    };

    if (featuredField === 'featuredProjectId') {
      nextDraft.featuredPostId = '';
      nextDraft.featuredBookshelfEntryId = '';
    } else if (featuredField === 'featuredPostId') {
      nextDraft.featuredProjectId = '';
      nextDraft.featuredBookshelfEntryId = '';
    } else if (featuredField === 'featuredBookshelfEntryId') {
      nextDraft.featuredProjectId = '';
      nextDraft.featuredPostId = '';
    } else {
      nextDraft.featuredProjectId = '';
      nextDraft.featuredPostId = '';
      nextDraft.featuredBookshelfEntryId = '';
    }

    if (editingId) {
      await updateSection(editingId, nextDraft);
    } else {
      await addSection(nextDraft);
    }

    resetComposer();
  };

  return (
    <div className={cosmic.container}>
      <div className="mb-8 border-b border-white/[0.06] pb-6">
        <h1 className={cosmic.pageTitle}>Pages</h1>
        <p className="mt-2 text-sm text-secondary-400">
          Compose narrative blueprints with curated section presets, pacing roles, and motion rails.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {PAGE_KEYS.map((page) => (
          <button
            key={page}
            type="button"
            className={selectedPage === page ? cosmic.tabActive : cosmic.tabInactive}
            onClick={() => handlePageSelect(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <div className="mb-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-secondary-300">
        <span className="text-xs uppercase tracking-[0.18em] text-secondary-500">Blueprint</span>
        <p className="mt-2 font-medium text-secondary-100">{getPageBlueprint(selectedPage)}</p>
      </div>

      {error && <div className={`${cosmic.alertError} mb-6`}>{error}</div>}

      <div className="grid gap-8 xl:grid-cols-[1.05fr_1fr]">
        <div className={cosmic.card}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className={cosmic.sectionTitle}>Section Stack</h2>
              <p className="mt-2 text-sm text-secondary-400">
                Order, visibility, and section purpose for `{selectedPage}`.
              </p>
            </div>
            {editingId && (
              <button type="button" className={cosmic.buttonSmall} onClick={() => resetComposer()}>
                New Section
              </button>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <div className={cosmic.loadingOverlay}>
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-500/20 border-t-primary-400" />
              </div>
            ) : filteredSections.length === 0 ? (
              <div className={cosmic.emptyState}>No sections yet for this page.</div>
            ) : (
              filteredSections.map((section) => (
                <div
                  key={section.id}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-secondary-500">
                        {section.sectionKey}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-secondary-50">
                        {section.title || 'Untitled section'}
                      </h3>
                      <p className="mt-2 text-sm text-secondary-400">
                        {describePageSection(section)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-secondary-500">
                        {section.sectionRole && <span>{section.sectionRole}</span>}
                        {section.animationPreset && <span>{section.animationPreset}</span>}
                        {section.contentEmphasis && <span>{section.contentEmphasis}</span>}
                      </div>
                    </div>
                    <span className={section.visible ? cosmic.badgeSuccess : cosmic.badgeWarning}>
                      {section.visible ? 'visible' : 'hidden'}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className={cosmic.buttonSmall}
                      onClick={() => startEditing(section)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={cosmic.buttonSmall}
                      onClick={() => updateSection(section.id, { visible: !section.visible })}
                    >
                      Toggle Visibility
                    </button>
                    <button
                      type="button"
                      className={cosmic.buttonSmall}
                      onClick={() =>
                        updateSection(section.id, {
                          sortOrder: Math.max(0, section.sortOrder - 1),
                        })
                      }
                    >
                      Move Up
                    </button>
                    <button
                      type="button"
                      className={cosmic.buttonSmall}
                      onClick={() => updateSection(section.id, { sortOrder: section.sortOrder + 1 })}
                    >
                      Move Down
                    </button>
                    <button
                      type="button"
                      className={cosmic.linkDelete}
                      onClick={() => deleteSection(section.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className={cosmic.card}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className={cosmic.sectionTitle}>
                {editingId ? 'Edit Section' : 'Compose Section'}
              </h2>
              <p className="mt-2 text-sm text-secondary-400">
                Choose a preset, then tune tone, layout, and content source.
              </p>
            </div>
            {editingId && (
              <button type="button" className={cosmic.buttonSmall} onClick={() => resetComposer()}>
                Cancel
              </button>
            )}
          </div>

          <div className="mt-6 grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cosmic.label}>Section Key</label>
                <input
                  className={cosmic.input}
                  value={draft.sectionKey}
                  onChange={(e) => updateDraft({ sectionKey: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className={cosmic.label}>Preset</label>
                <select
                  className={cosmic.select}
                  value={draft.presetKey || ''}
                  onChange={(e) => handlePresetChange(e.target.value)}
                >
                  <option value="">Custom</option>
                  {PAGE_SECTION_PRESETS.map((preset) => (
                    <option key={preset.key} value={preset.key}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-secondary-300">
              {describePageSection(draft)}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cosmic.label}>Section Type</label>
                <select
                  className={cosmic.select}
                  value={draft.sectionType}
                  onChange={(e) => updateDraft({ sectionType: e.target.value })}
                >
                  {PAGE_SECTION_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={cosmic.label}>Sort Order</label>
                <input
                  className={cosmic.input}
                  type="number"
                  value={draft.sortOrder}
                  onChange={(e) => updateDraft({ sortOrder: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cosmic.label}>Eyebrow</label>
                <input
                  className={cosmic.input}
                  value={draft.eyebrow || ''}
                  onChange={(e) => updateDraft({ eyebrow: e.target.value })}
                />
              </div>
              <div>
                <label className={cosmic.label}>Title</label>
                <input
                  className={cosmic.input}
                  value={draft.title || ''}
                  onChange={(e) => updateDraft({ title: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className={cosmic.label}>Subtitle</label>
              <textarea
                className={cosmic.textarea}
                value={draft.subtitle || ''}
                onChange={(e) => updateDraft({ subtitle: e.target.value })}
              />
            </div>

            <div>
              <label className={cosmic.label}>Body</label>
              <textarea
                className={`${cosmic.textarea} min-h-[140px]`}
                value={draft.body || ''}
                onChange={(e) => updateDraft({ body: e.target.value })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cosmic.label}>Primary CTA Label</label>
                <input
                  className={cosmic.input}
                  value={draft.primaryCtaLabel || ''}
                  onChange={(e) => updateDraft({ primaryCtaLabel: e.target.value })}
                />
              </div>
              <div>
                <label className={cosmic.label}>Primary CTA URL</label>
                <input
                  className={cosmic.input}
                  value={draft.primaryCtaUrl || ''}
                  onChange={(e) => updateDraft({ primaryCtaUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={cosmic.label}>Secondary CTA Label</label>
                <input
                  className={cosmic.input}
                  value={draft.secondaryCtaLabel || ''}
                  onChange={(e) => updateDraft({ secondaryCtaLabel: e.target.value })}
                />
              </div>
              <div>
                <label className={cosmic.label}>Secondary CTA URL</label>
                <input
                  className={cosmic.input}
                  value={draft.secondaryCtaUrl || ''}
                  onChange={(e) => updateDraft({ secondaryCtaUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className={cosmic.subTitle}>Presentation</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className={cosmic.label}>Section Purpose</label>
                  <select
                    className={cosmic.select}
                    value={draft.sectionRole}
                    onChange={(e) => updateDraft({ sectionRole: e.target.value as ComposerDraft['sectionRole'] })}
                  >
                    {PAGE_SECTION_ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={cosmic.label}>Layout Variant</label>
                  <select
                    className={cosmic.select}
                    value={draft.layoutVariant}
                    onChange={(e) => updateDraft({ layoutVariant: e.target.value as ComposerDraft['layoutVariant'] })}
                  >
                    {PAGE_SECTION_LAYOUT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={cosmic.label}>Visual Tone</label>
                  <select
                    className={cosmic.select}
                    value={draft.visualTone}
                    onChange={(e) => updateDraft({ visualTone: e.target.value as ComposerDraft['visualTone'] })}
                  >
                    {PAGE_SECTION_TONE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={cosmic.label}>Density</label>
                  <select
                    className={cosmic.select}
                    value={draft.density}
                    onChange={(e) => updateDraft({ density: e.target.value as ComposerDraft['density'] })}
                  >
                    {PAGE_SECTION_DENSITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={cosmic.label}>Background Treatment</label>
                  <select
                    className={cosmic.select}
                    value={draft.backgroundTreatment}
                    onChange={(e) =>
                      updateDraft({
                        backgroundTreatment:
                          e.target.value as ComposerDraft['backgroundTreatment'],
                      })
                    }
                  >
                    {PAGE_SECTION_BACKGROUND_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={cosmic.label}>Content Alignment</label>
                  <select
                    className={cosmic.select}
                    value={draft.contentAlignment}
                    onChange={(e) =>
                      updateDraft({
                        contentAlignment: e.target.value as ComposerDraft['contentAlignment'],
                      })
                    }
                  >
                    {PAGE_SECTION_ALIGNMENT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={cosmic.label}>Media Mode</label>
                  <select
                    className={cosmic.select}
                    value={draft.mediaMode}
                    onChange={(e) => updateDraft({ mediaMode: e.target.value as ComposerDraft['mediaMode'] })}
                  >
                    {PAGE_SECTION_MEDIA_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={cosmic.label}>Kicker Style</label>
                  <select
                    className={cosmic.select}
                    value={draft.kickerStyle}
                    onChange={(e) => updateDraft({ kickerStyle: e.target.value as ComposerDraft['kickerStyle'] })}
                  >
                    {PAGE_SECTION_KICKER_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={cosmic.label}>Animation Preset</label>
                  <select
                    className={cosmic.select}
                    value={draft.animationPreset}
                    onChange={(e) =>
                      updateDraft({ animationPreset: e.target.value as ComposerDraft['animationPreset'] })
                    }
                  >
                    {PAGE_SECTION_ANIMATION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={cosmic.label}>Content Emphasis</label>
                  <select
                    className={cosmic.select}
                    value={draft.contentEmphasis}
                    onChange={(e) =>
                      updateDraft({ contentEmphasis: e.target.value as ComposerDraft['contentEmphasis'] })
                    }
                  >
                    {PAGE_SECTION_EMPHASIS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={cosmic.label}>Maximum Items</label>
                  <input
                    className={cosmic.input}
                    type="number"
                    min="1"
                    value={draft.maxItems || 1}
                    onChange={(e) => updateDraft({ maxItems: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-secondary-300">
                  <input
                    type="checkbox"
                    checked={draft.visible}
                    onChange={(e) => updateDraft({ visible: e.target.checked })}
                  />
                  Visible
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-secondary-300">
                  <input
                    type="checkbox"
                    checked={draft.showDivider || false}
                    onChange={(e) => updateDraft({ showDivider: e.target.checked })}
                  />
                  Show divider
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className={cosmic.subTitle}>Content Source</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className={cosmic.label}>Collection</label>
                  <select
                    className={cosmic.select}
                    value={draft.contentCollection}
                    onChange={(e) =>
                      updateDraft({
                        contentCollection: e.target.value as ComposerDraft['contentCollection'],
                        manualItemIds: [],
                      })
                    }
                  >
                    {PAGE_SECTION_COLLECTION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={cosmic.label}>Source Mode</label>
                  <select
                    className={cosmic.select}
                    value={draft.contentSource}
                    onChange={(e) =>
                      updateDraft({ contentSource: e.target.value as ComposerDraft['contentSource'] })
                    }
                  >
                    {PAGE_SECTION_SOURCE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={cosmic.label}>Grouping</label>
                  <select
                    className={cosmic.select}
                    value={draft.contentGrouping}
                    onChange={(e) =>
                      updateDraft({ contentGrouping: e.target.value as ComposerDraft['contentGrouping'] })
                    }
                  >
                    {PAGE_SECTION_GROUPING_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {featuredField && draft.contentSource === 'featured' && (
                <div className="mt-4">
                  <label className={cosmic.label}>Featured Item Override</label>
                  <select
                    className={cosmic.select}
                    value={(draft[featuredField] as string | undefined) || ''}
                    onChange={(e) => updateDraft({ [featuredField]: e.target.value } as Partial<ComposerDraft>)}
                  >
                    <option value="">Use collection default featured item</option>
                    {collectionItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {draft.contentSource === 'manual' && collectionItems.length > 0 && (
                <div className="mt-4">
                  <label className={cosmic.label}>Manual Selection</label>
                  <div className="grid gap-2">
                    {collectionItems.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-secondary-300"
                      >
                        <span>
                          <span className="font-medium text-secondary-100">{item.label}</span>
                          {item.detail && (
                            <span className="ml-2 text-secondary-500">{item.detail}</span>
                          )}
                        </span>
                        <input
                          type="checkbox"
                          checked={(draft.manualItemIds || []).includes(item.id)}
                          onChange={() => handleManualToggle(item.id)}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className={cosmic.subTitle}>Side Panel / Supporting Copy</h3>
              <div className="mt-4 grid gap-4">
                <div>
                  <label className={cosmic.label}>Panel Kicker</label>
                  <input
                    className={cosmic.input}
                    value={(draft.metadata?.panelKicker as string | undefined) || ''}
                    onChange={(e) =>
                      updateDraft({
                        metadata: { ...(draft.metadata || {}), panelKicker: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className={cosmic.label}>Panel Title</label>
                  <input
                    className={cosmic.input}
                    value={(draft.metadata?.panelTitle as string | undefined) || ''}
                    onChange={(e) =>
                      updateDraft({
                        metadata: { ...(draft.metadata || {}), panelTitle: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className={cosmic.label}>Panel Body</label>
                  <textarea
                    className={cosmic.textarea}
                    value={(draft.metadata?.panelBody as string | undefined) || ''}
                    onChange={(e) =>
                      updateDraft({
                        metadata: { ...(draft.metadata || {}), panelBody: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className={cosmic.label}>Panel Items</label>
                  <textarea
                    className={cosmic.textarea}
                    placeholder="One item per line"
                    value={panelItemsText}
                    onChange={(e) => setPanelItemsText(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className={cosmic.buttonPrimary}>
              {editingId ? 'Save Section' : 'Create Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPages;
