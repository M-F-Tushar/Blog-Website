import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { Save, Search, Globe, Image, Twitter } from 'lucide-react';
import { cosmic } from './ui/cosmicClassNames';

const pages = [
  { id: 'home', label: 'Homepage', path: '/' },
  { id: 'about', label: 'About', path: '/about' },
  { id: 'blog', label: 'Blog', path: '/blog' },
  { id: 'contact', label: 'Contact', path: '/contact' },
  { id: 'recommendations', label: 'Recommendations', path: '/recommendations' },
];

const AdminSEOSettings: React.FC = () => {
  const { seo, updateSettings } = useSiteSettings();

  const [localSeo, setLocalSeo] = useState(
    seo || {
      defaultMetaTitle: '',
      defaultMetaDescription: '',
      ogImage: '',
      twitterHandle: '',
      pageMeta: {},
    }
  );
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (seo) {
      setLocalSeo(seo);
    }
  }, [seo]);

  const handleDefaultsChange = (field: string, value: string) => {
    setLocalSeo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePageMetaChange = (pageId: string, field: string, value: string) => {
    setLocalSeo((prev) => ({
      ...prev,
      pageMeta: {
        ...prev.pageMeta,
        [pageId]: {
          ...prev.pageMeta?.[pageId],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await updateSettings({ seo: localSeo });
      setSuccessMessage('SEO settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save SEO settings:', error);
      setErrorMessage('Failed to save settings. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={cosmic.containerSm}>
      <div className="flex justify-between items-center mb-6 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <Search size={28} className="text-primary-400" />
          <div>
            <h1 className={cosmic.sectionTitle}>SEO Settings</h1>
            <p className="text-sm text-secondary-400">
              Manage meta titles, descriptions, and social sharing
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 ${cosmic.buttonPrimary}`}
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {successMessage && <div className={`mb-4 ${cosmic.alertSuccess}`}>{successMessage}</div>}
      {errorMessage && <div className={`mb-4 ${cosmic.alertError}`}>{errorMessage}</div>}

      <div className="space-y-8">
        {/* Default SEO Settings */}
        <section>
          <h2 className={`${cosmic.subTitle} mb-4 flex items-center gap-2`}>
            <Globe size={20} /> Default SEO Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className={cosmic.label}>Default Meta Title</label>
              <input
                type="text"
                value={localSeo.defaultMetaTitle}
                onChange={(e) => handleDefaultsChange('defaultMetaTitle', e.target.value)}
                className={cosmic.input}
                placeholder="My Blog - Personal Blog"
              />
              <p className="mt-1 text-xs text-secondary-500">
                Used when a page doesn&apos;t have a custom title
              </p>
            </div>
            <div>
              <label className={cosmic.label}>Default Meta Description</label>
              <textarea
                value={localSeo.defaultMetaDescription}
                onChange={(e) => handleDefaultsChange('defaultMetaDescription', e.target.value)}
                className={`${cosmic.textarea} h-20 resize-none`}
                placeholder="A brief description of your blog..."
              />
              <p className="mt-1 text-xs text-secondary-500">150-160 characters recommended</p>
            </div>
          </div>
        </section>

        {/* Social Sharing */}
        <section>
          <h2 className={`${cosmic.subTitle} mb-4 flex items-center gap-2`}>
            <Image size={20} /> Social Sharing
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={cosmic.label}>Default OG Image URL</label>
              <input
                type="url"
                value={localSeo.ogImage}
                onChange={(e) => handleDefaultsChange('ogImage', e.target.value)}
                className={cosmic.input}
                placeholder="https://example.com/og-image.jpg"
              />
              {localSeo.ogImage && (
                <div className="mt-2">
                  <img
                    src={localSeo.ogImage}
                    alt="OG preview"
                    className="h-20 rounded object-cover"
                  />
                </div>
              )}
              <p className="mt-1 text-xs text-secondary-500">1200x630px recommended</p>
            </div>
            <div>
              <label className={cosmic.label}>
                <Twitter size={16} className="inline mr-1" /> Twitter/X Handle
              </label>
              <input
                type="text"
                value={localSeo.twitterHandle}
                onChange={(e) => handleDefaultsChange('twitterHandle', e.target.value)}
                className={cosmic.input}
                placeholder="@username"
              />
            </div>
          </div>
        </section>

        {/* Per-Page SEO */}
        <section>
          <h2 className={`${cosmic.subTitle} mb-4`}>Page-Specific SEO</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setSelectedPage(selectedPage === page.id ? null : page.id)}
                className={selectedPage === page.id ? cosmic.tabActive : cosmic.tabInactive}
              >
                {page.label}
              </button>
            ))}
          </div>

          {selectedPage && (
            <div className="p-4 bg-elevated/50 border border-white/[0.06] rounded-xl space-y-4">
              <h3 className="font-medium text-secondary-200">
                {pages.find((p) => p.id === selectedPage)?.label} Page
              </h3>
              <div>
                <label className={cosmic.label}>Meta Title</label>
                <input
                  type="text"
                  value={localSeo.pageMeta?.[selectedPage]?.title || ''}
                  onChange={(e) => handlePageMetaChange(selectedPage, 'title', e.target.value)}
                  className={cosmic.input}
                  placeholder={`Custom title for ${selectedPage} page...`}
                />
              </div>
              <div>
                <label className={cosmic.label}>Meta Description</label>
                <textarea
                  value={localSeo.pageMeta?.[selectedPage]?.description || ''}
                  onChange={(e) =>
                    handlePageMetaChange(selectedPage, 'description', e.target.value)
                  }
                  className={`${cosmic.textarea} h-20 resize-none`}
                  placeholder={`Custom description for ${selectedPage} page...`}
                />
              </div>
              <div>
                <label className={cosmic.label}>OG Image (optional)</label>
                <input
                  type="url"
                  value={localSeo.pageMeta?.[selectedPage]?.ogImage || ''}
                  onChange={(e) => handlePageMetaChange(selectedPage, 'ogImage', e.target.value)}
                  className={cosmic.input}
                  placeholder="Custom OG image URL..."
                />
              </div>
            </div>
          )}
        </section>
      </div>

      <div className={`mt-6 ${cosmic.alertInfo}`}>
        <p className="text-sm">
          <strong>Tips:</strong>
          <br />• Meta titles should be 50-60 characters
          <br />• Meta descriptions should be 150-160 characters
          <br />• OG images should be 1200x630 pixels
        </p>
      </div>
    </div>
  );
};

export default AdminSEOSettings;
