import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useNavigationItems } from '../../hooks/useNavigationItems';
import { cosmic } from './ui/cosmicClassNames';
import { uploadFile, generateUniqueFilename } from '../../services/storageService';
import { isSupabaseConfigured } from '../../supabase/client';

const AdminSiteConfiguration: React.FC = () => {
  const {
    siteName,
    authorName,
    authorTagline,
    authorBio,
    authorImage,
    siteDescription,
    updateSettings,
  } = useSiteSettings();
  const { items, addItem, updateItem, deleteItem } = useNavigationItems();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({
    siteName,
    authorName,
    authorTagline,
    authorBio,
    authorImage,
    siteDescription,
  });

  useEffect(() => {
    setForm({
      siteName,
      authorName,
      authorTagline,
      authorBio,
      authorImage,
      siteDescription,
    });
  }, [siteName, authorName, authorTagline, authorBio, authorImage, siteDescription]);

  const sortedItems = useMemo(() => [...items].sort((a, b) => a.sortOrder - b.sortOrder), [items]);
  const canUploadMedia = isSupabaseConfigured();
  const initials =
    (form.authorName || 'You')
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'Y';

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatusMessage(null);
    setIsUploadingImage(true);

    try {
      const url = await uploadFile(file, `profiles/${generateUniqueFilename(file.name)}`);
      setForm((prev) => ({ ...prev, authorImage: url }));
      setStatusMessage({
        type: 'success',
        text: 'Portrait uploaded. Save configuration to publish it on the homepage.',
      });
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to upload portrait.',
      });
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  };

  return (
    <div className={cosmic.container}>
      <div className="mb-8 border-b border-white/[0.06] pb-6">
        <h1 className={cosmic.pageTitle}>Site Configuration</h1>
        <p className="mt-2 text-sm text-secondary-400">
          Control the core identity, mission, navigation, and portrait used across the site.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await updateSettings(form);
            setStatusMessage({ type: 'success', text: 'Site configuration saved.' });
          }}
          className={cosmic.card}
        >
          <h2 className={cosmic.sectionTitle}>Identity</h2>
          <div className="mt-6 space-y-4">
            <div>
              <label className={cosmic.label}>Site Name</label>
              <input
                className={cosmic.input}
                value={form.siteName}
                onChange={(e) => setForm((prev) => ({ ...prev, siteName: e.target.value }))}
              />
            </div>
            <div>
              <label className={cosmic.label}>Author Name</label>
              <input
                className={cosmic.input}
                value={form.authorName}
                onChange={(e) => setForm((prev) => ({ ...prev, authorName: e.target.value }))}
              />
            </div>
            <div>
              <label className={cosmic.label}>Tagline</label>
              <input
                className={cosmic.input}
                value={form.authorTagline}
                onChange={(e) => setForm((prev) => ({ ...prev, authorTagline: e.target.value }))}
              />
            </div>
            <div>
              <label className={cosmic.label}>Portrait Image</label>
              <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 md:flex-row md:items-center">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-elevated/80 shadow-[0_12px_36px_rgba(0,0,0,0.25)]">
                  {form.authorImage ? (
                    <img
                      src={form.authorImage}
                      alt={form.authorName || 'Author portrait'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-serif text-3xl font-bold text-secondary-300">
                      {initials}
                    </span>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className={cosmic.buttonSecondary}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={!canUploadMedia || isUploadingImage}
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Upload portrait
                        </>
                      )}
                    </button>
                    {form.authorImage && (
                      <button
                        type="button"
                        className={cosmic.buttonSmall}
                        onClick={() => setForm((prev) => ({ ...prev, authorImage: '' }))}
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <input
                    className={cosmic.input}
                    placeholder="https://example.com/portrait.jpg"
                    value={form.authorImage}
                    onChange={(e) => setForm((prev) => ({ ...prev, authorImage: e.target.value }))}
                  />
                  <p className="text-sm text-secondary-500">
                    Upload from the admin panel or paste an existing public image URL.
                    {!canUploadMedia && ' Configure Supabase Storage to enable uploads.'}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label className={cosmic.label}>Site Description</label>
              <textarea
                className={cosmic.textarea}
                value={form.siteDescription}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, siteDescription: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={cosmic.label}>Mission / Bio</label>
              <textarea
                className={`${cosmic.textarea} min-h-[180px]`}
                value={form.authorBio}
                onChange={(e) => setForm((prev) => ({ ...prev, authorBio: e.target.value }))}
              />
            </div>
            <button type="submit" className={cosmic.buttonPrimary}>
              Save Configuration
            </button>
            {statusMessage && (
              <p
                className={
                  statusMessage.type === 'error'
                    ? 'text-sm text-error-300'
                    : 'text-sm text-success-300'
                }
              >
                {statusMessage.text}
              </p>
            )}
          </div>
        </form>

        <div className={cosmic.card}>
          <div className="flex items-center justify-between">
            <h2 className={cosmic.sectionTitle}>Navigation</h2>
            <button
              className={cosmic.buttonSmall}
              onClick={() =>
                addItem({
                  label: 'New Item',
                  path: '/new-path',
                  isExternal: false,
                  visible: true,
                  sortOrder: items.length,
                })
              }
            >
              Add Item
            </button>
          </div>
          <div className="mt-6 space-y-4">
            {sortedItems.map((item, index) => (
              <div
                key={item.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <input
                    className={cosmic.input}
                    value={item.label}
                    onChange={(e) => updateItem(item.id, { label: e.target.value })}
                  />
                  <input
                    className={cosmic.input}
                    value={item.path}
                    onChange={(e) => updateItem(item.id, { path: e.target.value })}
                  />
                  <button className={cosmic.linkDelete} onClick={() => deleteItem(item.id)}>
                    Delete
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    className={cosmic.buttonSmall}
                    onClick={() => updateItem(item.id, { visible: !item.visible })}
                  >
                    {item.visible ? 'Hide' : 'Show'}
                  </button>
                  {index > 0 && (
                    <button
                      className={cosmic.buttonSmall}
                      onClick={() => updateItem(item.id, { sortOrder: item.sortOrder - 1 })}
                    >
                      Move Up
                    </button>
                  )}
                  {index < sortedItems.length - 1 && (
                    <button
                      className={cosmic.buttonSmall}
                      onClick={() => updateItem(item.id, { sortOrder: item.sortOrder + 1 })}
                    >
                      Move Down
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSiteConfiguration;
