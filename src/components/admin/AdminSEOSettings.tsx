import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { Save, Search, Globe, Image, Twitter } from 'lucide-react';

const pages = [
    { id: 'home', label: 'Homepage', path: '/' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'blog', label: 'Blog', path: '/blog' },
    { id: 'contact', label: 'Contact', path: '/contact' },
    { id: 'recommendations', label: 'Recommendations', path: '/recommendations' },
];

const AdminSEOSettings: React.FC = () => {
    const { seo, updateSettings } = useSiteSettings();

    const [localSeo, setLocalSeo] = useState(seo || {
        defaultMetaTitle: '',
        defaultMetaDescription: '',
        ogImage: '',
        twitterHandle: '',
        pageMeta: {},
    });
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
        setLocalSeo(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handlePageMetaChange = (pageId: string, field: string, value: string) => {
        setLocalSeo(prev => ({
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

    const inputClasses = "w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200";
    const labelClasses = "block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1";

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center gap-3">
                    <Search size={28} className="text-accent" />
                    <div>
                        <h1 className="text-2xl font-bold font-serif text-gray-900 dark:text-white">
                            SEO Settings
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Manage meta titles, descriptions, and social sharing
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-accent text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {successMessage && (
                <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
                    {errorMessage}
                </div>
            )}

            <div className="space-y-8">
                {/* Default SEO Settings */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Globe size={20} /> Default SEO Settings
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className={labelClasses}>Default Meta Title</label>
                            <input
                                type="text"
                                value={localSeo.defaultMetaTitle}
                                onChange={(e) => handleDefaultsChange('defaultMetaTitle', e.target.value)}
                                className={inputClasses}
                                placeholder="My Blog - Personal Blog"
                            />
                            <p className="mt-1 text-xs text-gray-500">Used when a page doesn&apos;t have a custom title</p>
                        </div>
                        <div>
                            <label className={labelClasses}>Default Meta Description</label>
                            <textarea
                                value={localSeo.defaultMetaDescription}
                                onChange={(e) => handleDefaultsChange('defaultMetaDescription', e.target.value)}
                                className={`${inputClasses} h-20 resize-none`}
                                placeholder="A brief description of your blog..."
                            />
                            <p className="mt-1 text-xs text-gray-500">150-160 characters recommended</p>
                        </div>
                    </div>
                </section>

                {/* Social Sharing */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Image size={20} /> Social Sharing
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>Default OG Image URL</label>
                            <input
                                type="url"
                                value={localSeo.ogImage}
                                onChange={(e) => handleDefaultsChange('ogImage', e.target.value)}
                                className={inputClasses}
                                placeholder="https://example.com/og-image.jpg"
                            />
                            {localSeo.ogImage && (
                                <div className="mt-2">
                                    <img src={localSeo.ogImage} alt="OG preview" className="h-20 rounded object-cover" />
                                </div>
                            )}
                            <p className="mt-1 text-xs text-gray-500">1200x630px recommended</p>
                        </div>
                        <div>
                            <label className={labelClasses}>
                                <Twitter size={16} className="inline mr-1" /> Twitter/X Handle
                            </label>
                            <input
                                type="text"
                                value={localSeo.twitterHandle}
                                onChange={(e) => handleDefaultsChange('twitterHandle', e.target.value)}
                                className={inputClasses}
                                placeholder="@username"
                            />
                        </div>
                    </div>
                </section>

                {/* Per-Page SEO */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                        Page-Specific SEO
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {pages.map((page) => (
                            <button
                                key={page.id}
                                onClick={() => setSelectedPage(selectedPage === page.id ? null : page.id)}
                                className={`px-4 py-2 rounded-lg transition-colors ${selectedPage === page.id
                                        ? 'bg-accent text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {page.label}
                            </button>
                        ))}
                    </div>

                    {selectedPage && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-lg space-y-4">
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">
                                {pages.find(p => p.id === selectedPage)?.label} Page
                            </h3>
                            <div>
                                <label className={labelClasses}>Meta Title</label>
                                <input
                                    type="text"
                                    value={localSeo.pageMeta?.[selectedPage]?.title || ''}
                                    onChange={(e) => handlePageMetaChange(selectedPage, 'title', e.target.value)}
                                    className={inputClasses}
                                    placeholder={`Custom title for ${selectedPage} page...`}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Meta Description</label>
                                <textarea
                                    value={localSeo.pageMeta?.[selectedPage]?.description || ''}
                                    onChange={(e) => handlePageMetaChange(selectedPage, 'description', e.target.value)}
                                    className={`${inputClasses} h-20 resize-none`}
                                    placeholder={`Custom description for ${selectedPage} page...`}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>OG Image (optional)</label>
                                <input
                                    type="url"
                                    value={localSeo.pageMeta?.[selectedPage]?.ogImage || ''}
                                    onChange={(e) => handlePageMetaChange(selectedPage, 'ogImage', e.target.value)}
                                    className={inputClasses}
                                    placeholder="Custom OG image URL..."
                                />
                            </div>
                        </div>
                    )}
                </section>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
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
