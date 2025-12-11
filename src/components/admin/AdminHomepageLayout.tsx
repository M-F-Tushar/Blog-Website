import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { Save, Layout, Eye, EyeOff, Home, Star, TrendingUp, FileText, Mail } from 'lucide-react';

interface SectionConfig {
    key: keyof typeof defaultLayout;
    label: string;
    description: string;
    icon: React.ReactNode;
}

const defaultLayout = {
    showHero: true,
    showFeaturedPost: true,
    showTrendingTopics: true,
    showLatestArticles: true,
    showNewsletter: true,
};

const sections: SectionConfig[] = [
    {
        key: 'showHero',
        label: 'Hero Section',
        description: 'Main welcome banner with your name, tagline, and call-to-action buttons',
        icon: <Home size={20} />,
    },
    {
        key: 'showFeaturedPost',
        label: 'Featured Post',
        description: 'Highlight your best or most recent post prominently',
        icon: <Star size={20} />,
    },
    {
        key: 'showTrendingTopics',
        label: 'Trending Topics',
        description: 'Display popular tags to help visitors discover content',
        icon: <TrendingUp size={20} />,
    },
    {
        key: 'showLatestArticles',
        label: 'Latest Articles',
        description: 'Grid of your most recent blog posts',
        icon: <FileText size={20} />,
    },
    {
        key: 'showNewsletter',
        label: 'Newsletter Signup',
        description: 'Email subscription form to grow your audience',
        icon: <Mail size={20} />,
    },
];

const AdminHomepageLayout: React.FC = () => {
    const { homepageLayout, updateSettings } = useSiteSettings();

    const [localLayout, setLocalLayout] = useState(homepageLayout || defaultLayout);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (homepageLayout) {
            setLocalLayout(homepageLayout);
        }
    }, [homepageLayout]);

    const toggleSection = (key: keyof typeof defaultLayout) => {
        setLocalLayout(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await updateSettings({ homepageLayout: localLayout });
            setSuccessMessage('Homepage layout saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Failed to save homepage layout:', error);
            setErrorMessage('Failed to save layout. Please try again.');
            setTimeout(() => setErrorMessage(''), 5000);
        } finally {
            setSaving(false);
        }
    };

    const enabledCount = Object.values(localLayout).filter(Boolean).length;

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center gap-3">
                    <Layout size={28} className="text-accent" />
                    <div>
                        <h1 className="text-2xl font-bold font-serif text-gray-900 dark:text-white">
                            Homepage Layout
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Control which sections appear on your homepage
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-accent text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Layout'}
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

            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>{enabledCount}</strong> of {sections.length} sections enabled
                </p>
            </div>

            <div className="space-y-4">
                {sections.map((section) => {
                    const isEnabled = localLayout[section.key];

                    return (
                        <div
                            key={section.key}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${isEnabled
                                    ? 'border-accent bg-accent/5 dark:bg-accent/10'
                                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${isEnabled
                                            ? 'bg-accent/10 text-accent'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                                        }`}>
                                        {section.icon}
                                    </div>
                                    <div>
                                        <h3 className={`font-medium ${isEnabled
                                                ? 'text-gray-900 dark:text-white'
                                                : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {section.label}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {section.description}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleSection(section.key)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isEnabled
                                            ? 'bg-accent text-white hover:bg-indigo-700'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {isEnabled ? (
                                        <>
                                            <Eye size={18} />
                                            <span>Visible</span>
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff size={18} />
                                            <span>Hidden</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Tip:</strong> Hidden sections are completely removed from the homepage.
                    Visitors won&apos;t see placeholder content for hidden sections.
                </p>
            </div>
        </div>
    );
};

export default AdminHomepageLayout;
