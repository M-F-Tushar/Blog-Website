import React, { useMemo, useState } from 'react';
import { useContactLinks } from '../../hooks/useContactLinks';
import {
  CONTACT_LINK_TYPE_OPTIONS,
  formatCustomLinkType,
  getContactLinkDisplayValue,
  getContactLinkMeta,
  normalizeContactLinkType,
  normalizeContactLinkUrl,
} from '../../lib/contactLinks';
import { cosmic } from './ui/cosmicClassNames';

interface ContactLinkEditorDraft {
  label: string;
  url: string;
  linkType: string;
  customType: string;
  description: string;
  visible: boolean;
  sortOrder: number;
}

const createEmptyDraft = (): ContactLinkEditorDraft => ({
  label: '',
  url: '',
  linkType: 'email',
  customType: '',
  description: '',
  visible: true,
  sortOrder: 0,
});

const presetTypes = new Set(
  CONTACT_LINK_TYPE_OPTIONS.map((option) => option.value).filter((value) => value !== 'custom')
);

const toEditorDraft = (link: {
  label: string;
  url: string;
  linkType: string;
  description?: string;
  visible: boolean;
  sortOrder: number;
}): ContactLinkEditorDraft => {
  const normalizedType = normalizeContactLinkType(link.linkType);
  const isPreset = presetTypes.has(normalizedType);

  return {
    label: link.label,
    url: link.url,
    linkType: isPreset ? normalizedType : 'custom',
    customType: isPreset ? '' : link.linkType,
    description: link.description || '',
    visible: link.visible,
    sortOrder: link.sortOrder,
  };
};

const resolveDraftType = (draft: ContactLinkEditorDraft) =>
  normalizeContactLinkType(draft.linkType === 'custom' ? draft.customType : draft.linkType);

const getTypeOption = (draft: ContactLinkEditorDraft) =>
  CONTACT_LINK_TYPE_OPTIONS.find((option) => option.value === draft.linkType);

const AdminContactLinks: React.FC = () => {
  const { links, addLink, updateLink, deleteLink, loading, error } = useContactLinks();
  const [draftsById, setDraftsById] = useState<Record<string, Partial<ContactLinkEditorDraft>>>({});
  const [newDraft, setNewDraft] = useState<ContactLinkEditorDraft>(createEmptyDraft);

  const sortedLinks = useMemo(
    () => [...links].sort((a, b) => a.sortOrder - b.sortOrder),
    [links]
  );

  const buildDraftForLink = (link: (typeof links)[number]): ContactLinkEditorDraft => ({
    ...toEditorDraft(link),
    ...(draftsById[link.id] || {}),
  });

  const updateExistingDraft = (id: string, patch: Partial<ContactLinkEditorDraft>) => {
    setDraftsById((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        ...patch,
      },
    }));
  };

  const updateNewDraft = (patch: Partial<ContactLinkEditorDraft>) => {
    setNewDraft((prev) => ({ ...prev, ...patch }));
  };

  const saveExistingLink = async (id: string) => {
    const link = links.find((entry) => entry.id === id);
    if (!link) return;
    const draft = buildDraftForLink(link);

    const resolvedType = resolveDraftType(draft);
    if (!resolvedType || !draft.url.trim()) return;

    const meta = getContactLinkMeta(resolvedType);

    await updateLink(id, {
      label: draft.label.trim() || meta.label,
      url: normalizeContactLinkUrl(resolvedType, draft.url),
      linkType: resolvedType,
      description: draft.description.trim(),
      visible: draft.visible,
      sortOrder: draft.sortOrder,
    });

    setDraftsById((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const createNewLink = async (e: React.FormEvent) => {
    e.preventDefault();

    const resolvedType = resolveDraftType(newDraft);
    if (!resolvedType || !newDraft.url.trim()) return;

    const meta = getContactLinkMeta(resolvedType);

    await addLink({
      label: newDraft.label.trim() || meta.label,
      url: normalizeContactLinkUrl(resolvedType, newDraft.url),
      linkType: resolvedType,
      description: newDraft.description.trim(),
      visible: newDraft.visible,
      sortOrder: newDraft.sortOrder || links.length,
    });

    setNewDraft({
      ...createEmptyDraft(),
      sortOrder: links.length + 1,
    });
  };

  return (
    <div className={cosmic.container}>
      <div className="mb-8 border-b border-white/[0.06] pb-6">
        <h1 className={cosmic.pageTitle}>Contact Links</h1>
        <p className="mt-2 text-sm text-secondary-400">
          Manage the dynamic links used on the contact page, the homepage preview, and the footer.
        </p>
      </div>

      {error && <div className={`${cosmic.alertError} mb-6`}>{error}</div>}

      <div className="mb-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-secondary-300">
        Add Email, LinkedIn, X, Facebook, GitHub, or any custom link type now. If you need a new
        platform later, use the custom type option and it will still appear on the public page.
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className={cosmic.card}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className={cosmic.sectionTitle}>Existing Links</h2>
              <p className="mt-2 text-sm text-secondary-400">
                Edit labels, URLs, descriptions, visibility, and sort order.
              </p>
            </div>
            {loading && (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500/20 border-t-primary-400" />
            )}
          </div>

          <div className="mt-6 space-y-5">
            {sortedLinks.length === 0 ? (
              <div className={cosmic.emptyState}>No contact links yet.</div>
            ) : (
              sortedLinks.map((link) => {
                const draft = buildDraftForLink(link);
                const resolvedType = resolveDraftType(draft);
                const typeMeta = getContactLinkMeta(resolvedType);
                const typeOption = getTypeOption(draft);
                const previewLabel = draft.label.trim() || typeMeta.label;
                const previewUrl = draft.url.trim()
                  ? getContactLinkDisplayValue({
                      url: normalizeContactLinkUrl(resolvedType, draft.url),
                      linkType: resolvedType,
                    })
                  : 'Add a URL to preview this link.';

                return (
                  <div key={link.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-secondary-500">
                          {typeMeta.channelLabel}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-secondary-50">
                          {previewLabel}
                        </h3>
                        <p className="mt-2 text-sm text-secondary-400">{previewUrl}</p>
                      </div>
                      <span className={draft.visible ? cosmic.badgeSuccess : cosmic.badgeWarning}>
                        {draft.visible ? 'visible' : 'hidden'}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div>
                        <label className={cosmic.label}>Link Type</label>
                        <select
                          className={cosmic.select}
                          value={draft.linkType}
                          onChange={(e) => updateExistingDraft(link.id, { linkType: e.target.value })}
                        >
                          {CONTACT_LINK_TYPE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      {draft.linkType === 'custom' ? (
                        <div>
                          <label className={cosmic.label}>Custom Type</label>
                          <input
                            className={cosmic.input}
                            placeholder="mastodon, portfolio, calendar..."
                            value={draft.customType}
                            onChange={(e) => updateExistingDraft(link.id, { customType: e.target.value })}
                          />
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-secondary-400">
                          <span className="block text-xs uppercase tracking-[0.18em] text-secondary-500">
                            Suggested Input
                          </span>
                          <span className="mt-2 block">{typeOption?.placeholder}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.3fr]">
                      <div>
                        <label className={cosmic.label}>Label</label>
                        <input
                          className={cosmic.input}
                          value={draft.label}
                          onChange={(e) => updateExistingDraft(link.id, { label: e.target.value })}
                          placeholder={typeMeta.label}
                        />
                      </div>
                      <div>
                        <label className={cosmic.label}>URL</label>
                        <input
                          className={cosmic.input}
                          value={draft.url}
                          onChange={(e) => updateExistingDraft(link.id, { url: e.target.value })}
                          placeholder={typeOption?.placeholder || 'https://example.com'}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className={cosmic.label}>Description</label>
                      <textarea
                        className={cosmic.textarea}
                        value={draft.description}
                        onChange={(e) => updateExistingDraft(link.id, { description: e.target.value })}
                        placeholder={typeMeta.helperText}
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-5">
                      <label className="inline-flex items-center gap-2 text-sm text-secondary-300">
                        <input
                          type="checkbox"
                          checked={draft.visible}
                          onChange={(e) => updateExistingDraft(link.id, { visible: e.target.checked })}
                        />
                        Visible on site
                      </label>

                      <div className="flex items-center gap-3">
                        <label className={cosmic.label}>Sort Order</label>
                        <input
                          className={`${cosmic.input} w-24`}
                          type="number"
                          value={draft.sortOrder}
                          onChange={(e) =>
                            updateExistingDraft(link.id, {
                              sortOrder: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        className={cosmic.buttonPrimary}
                        onClick={() => saveExistingLink(link.id)}
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className={cosmic.buttonSmall}
                        onClick={() =>
                          setDraftsById((prev) => {
                            const next = { ...prev };
                            delete next[link.id];
                            return next;
                          })
                        }
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        className={cosmic.linkDelete}
                        onClick={() => deleteLink(link.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <form onSubmit={createNewLink} className={cosmic.card}>
          <h2 className={cosmic.sectionTitle}>Add New Link</h2>
          <p className="mt-2 text-sm text-secondary-400">
            Start with a common preset or choose custom for any future platform.
          </p>

          <div className="mt-6 grid gap-4">
            <div>
              <label className={cosmic.label}>Link Type</label>
              <select
                className={cosmic.select}
                value={newDraft.linkType}
                onChange={(e) => updateNewDraft({ linkType: e.target.value })}
              >
                {CONTACT_LINK_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {newDraft.linkType === 'custom' && (
              <div>
                <label className={cosmic.label}>Custom Type</label>
                <input
                  className={cosmic.input}
                  placeholder="mastodon, portfolio, calendar..."
                  value={newDraft.customType}
                  onChange={(e) => updateNewDraft({ customType: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-secondary-400">
              <span className="block text-xs uppercase tracking-[0.18em] text-secondary-500">
                Suggested Format
              </span>
              <span className="mt-2 block">
                {getTypeOption(newDraft)?.placeholder || 'https://example.com'}
              </span>
              <span className="mt-3 block">
                {getContactLinkMeta(resolveDraftType(newDraft)).helperText}
              </span>
            </div>

            <div>
              <label className={cosmic.label}>Label</label>
              <input
                className={cosmic.input}
                placeholder={getContactLinkMeta(resolveDraftType(newDraft)).label}
                value={newDraft.label}
                onChange={(e) => updateNewDraft({ label: e.target.value })}
              />
            </div>

            <div>
              <label className={cosmic.label}>URL</label>
              <input
                className={cosmic.input}
                placeholder={getTypeOption(newDraft)?.placeholder || 'https://example.com'}
                value={newDraft.url}
                onChange={(e) => updateNewDraft({ url: e.target.value })}
                required
              />
            </div>

            <div>
              <label className={cosmic.label}>Description</label>
              <textarea
                className={cosmic.textarea}
                placeholder={getContactLinkMeta(resolveDraftType(newDraft)).helperText}
                value={newDraft.description}
                onChange={(e) => updateNewDraft({ description: e.target.value })}
              />
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <label className="inline-flex items-center gap-2 text-sm text-secondary-300">
                <input
                  type="checkbox"
                  checked={newDraft.visible}
                  onChange={(e) => updateNewDraft({ visible: e.target.checked })}
                />
                Visible on site
              </label>

              <div className="flex items-center gap-3">
                <label className={cosmic.label}>Sort Order</label>
                <input
                  className={`${cosmic.input} w-24`}
                  type="number"
                  value={newDraft.sortOrder}
                  onChange={(e) =>
                    updateNewDraft({
                      sortOrder: Number(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-secondary-400">
              <span className="block text-xs uppercase tracking-[0.18em] text-secondary-500">
                Preview
              </span>
              <span className="mt-2 block font-medium text-secondary-100">
                {newDraft.label.trim() ||
                  formatCustomLinkType(resolveDraftType(newDraft))}
              </span>
              <span className="mt-2 block">
                {newDraft.url.trim()
                  ? getContactLinkDisplayValue({
                      url: normalizeContactLinkUrl(resolveDraftType(newDraft), newDraft.url),
                      linkType: resolveDraftType(newDraft),
                    })
                  : 'Add a URL to see a preview.'}
              </span>
            </div>

            <button type="submit" className={cosmic.buttonPrimary}>
              Add Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminContactLinks;
