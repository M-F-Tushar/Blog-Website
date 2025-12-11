import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { Save, ChevronDown, ChevronRight, Type, Home, FileText, Menu } from 'lucide-react';

interface UITextSection {
    key: string;
    label: string;
    icon: React.ReactNode;
    fields: { key: string; label: string; type: 'text' | 'textarea' }[];
}

const uiTextSections: UITextSection[] = [
    {
        key: 'home',
        label: 'Homepage',
        icon: <Home size={18} />,
        fields: [
            { key: 'welcomeBadge', label: 'Welcome Badge Text', type: 'text' },
            { key: 'startReading', label: 'Start Reading Button', type: 'text' },
            { key: 'moreAboutMe', label: 'More About Me Button', type: 'text' },
            { key: 'featuredStory', label: 'Featured Story Section Title', type: 'text' },
            { key: 'trendingTopics', label: 'Trending Topics Section Title', type: 'text' },
            { key: 'latestArticles', label: 'Latest Articles Section Title', type: 'text' },
            { key: 'newsletterTitle', label: 'Newsletter Section Title', type: 'text' },
            { key: 'newsletterDescription', label: 'Newsletter Description', type: 'textarea' },
            { key: 'subscribeButton', label: 'Subscribe Button Text', type: 'text' },
        ],
    },
    {
        key: 'header',
        label: 'Navigation Menu',
        icon: <Menu size={18} />,
        fields: [
            { key: 'home', label: 'Home Link', type: 'text' },
            { key: 'about', label: 'About Link', type: 'text' },
            { key: 'blog', label: 'Blog Link', type: 'text' },
            { key: 'recommendations', label: 'Recommendations Link', type: 'text' },
            { key: 'bookmarks', label: 'Bookmarks Link', type: 'text' },
            { key: 'contact', label: 'Contact Link', type: 'text' },
            { key: 'searchPlaceholder', label: 'Search Placeholder', type: 'text' },
        ],
    },
    {
        key: 'footer',
        label: 'Footer',
        icon: <FileText size={18} />,
        fields: [
            { key: 'tagline', label: 'Footer Tagline', type: 'textarea' },
            { key: 'exploreTitle', label: 'Explore Section Title', type: 'text' },
            { key: 'latestTitle', label: 'Latest Articles Title', type: 'text' },
            { key: 'stayConnectedTitle', label: 'Stay Connected Title', type: 'text' },
            { key: 'newsletterDescription', label: 'Newsletter Description', type: 'textarea' },
            { key: 'subscribeButton', label: 'Subscribe Button', type: 'text' },
            { key: 'copyrightText', label: 'Copyright Text', type: 'text' },
        ],
    },
];

const AdminUITextSettings: React.FC = () => {
    const { uiText, updateSettings } = useSiteSettings();

    const [localUIText, setLocalUIText] = useState(uiText);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        home: true,
        header: false,
        footer: false,
    });
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setLocalUIText(uiText);
    }, [uiText]);

    const toggleSection = (sectionKey: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey],
        }));
    };

    const handleFieldChange = (
        sectionKey: string,
        fieldKey: string,
        value: string
    ) => {
        setLocalUIText(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey as keyof typeof prev],
                [fieldKey]: value,
            },
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await updateSettings({ uiText: localUIText });
            setSuccessMessage('UI Text settings saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Failed to save UI text:', error);
            setErrorMessage('Failed to save UI text settings. Please try again.');
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
                    <Type size={28} className="text-accent" />
                    <div>
                        <h1 className="text-2xl font-bold font-serif text-gray-900 dark:text-white">
                            UI Text Settings
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Customize all text displayed on your website
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-accent text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save All Changes'}
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

            <div className="space-y-4">
                {uiTextSections.map((section) => (
                    <div
                        key={section.key}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                        {/* Section Header */}
                        <button
                            onClick={() => toggleSection(section.key)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-accent">{section.icon}</span>
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                    {section.label}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    ({section.fields.length} fields)
                                </span>
                            </div>
                            {expandedSections[section.key] ? (
                                <ChevronDown size={20} className="text-gray-500" />
                            ) : (
                                <ChevronRight size={20} className="text-gray-500" />
                            )}
                        </button>

                        {/* Section Content */}
                        {expandedSections[section.key] && (
                            <div className="p-4 space-y-4 bg-white dark:bg-gray-800">
                                {section.fields.map((field) => {
                                    const sectionData = localUIText[section.key as keyof typeof localUIText];
                                    const value = sectionData?.[field.key as keyof typeof sectionData] || '';

                                    return (
                                        <div key={field.key}>
                                            <label className={labelClasses}>{field.label}</label>
                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    value={value}
                                                    onChange={(e) =>
                                                        handleFieldChange(section.key, field.key, e.target.value)
                                                    }
                                                    className={`${inputClasses} h-20 resize-none`}
                                                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) =>
                                                        handleFieldChange(section.key, field.key, e.target.value)
                                                    }
                                                    className={inputClasses}
                                                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Tip:</strong> Changes will take effect immediately after saving.
                    Refresh your website to see the updated text.
                </p>
            </div>
        </div>
    );
};

export default AdminUITextSettings;
