import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import {
  Save,
  ChevronDown,
  ChevronRight,
  Type,
  Home,
  FileText,
  Menu,
  AlertTriangle,
  User,
  Phone,
} from 'lucide-react';
import { cosmic } from './ui/cosmicClassNames';

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
  {
    key: 'about',
    label: 'About Page',
    icon: <User size={18} />,
    fields: [
      { key: 'pageTitle', label: 'Page Title', type: 'text' },
      { key: 'subtitle', label: 'Page Subtitle', type: 'text' },
      { key: 'skillsTitle', label: 'Skills Section Title', type: 'text' },
      { key: 'timelineTitle', label: 'Timeline Section Title', type: 'text' },
      { key: 'achievementsTitle', label: 'Achievements Section Title', type: 'text' },
      { key: 'statsTitle', label: 'Stats Section Title', type: 'text' },
    ],
  },
  {
    key: 'contact',
    label: 'Contact Page',
    icon: <Phone size={18} />,
    fields: [
      { key: 'pageTitle', label: 'Page Title', type: 'text' },
      { key: 'subtitle', label: 'Page Subtitle', type: 'textarea' },
      { key: 'formTitle', label: 'Contact Form Title', type: 'text' },
      { key: 'availabilityTitle', label: 'Availability Section Title', type: 'text' },
      { key: 'availabilityText', label: 'Availability Text', type: 'textarea' },
      { key: 'faqTitle', label: 'FAQ Section Title', type: 'text' },
    ],
  },
  {
    key: 'error',
    label: '404 Error Page',
    icon: <AlertTriangle size={18} />,
    fields: [
      { key: 'code', label: 'Error Code', type: 'text' },
      { key: 'title', label: 'Error Title', type: 'text' },
      { key: 'description', label: 'Error Description', type: 'textarea' },
      { key: 'primaryButtonText', label: 'Primary Button Text', type: 'text' },
      { key: 'secondaryButtonText', label: 'Secondary Button Text', type: 'text' },
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
    about: false,
    contact: false,
    error: false,
  });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setLocalUIText(uiText);
  }, [uiText]);

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleFieldChange = (sectionKey: string, fieldKey: string, value: string) => {
    setLocalUIText((prev) => ({
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

  return (
    <div className={cosmic.containerSm}>
      <div className="flex justify-between items-center mb-6 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <Type size={28} className="text-primary-400" />
          <div>
            <h1 className={cosmic.sectionTitle}>UI Text Settings</h1>
            <p className="text-sm text-secondary-400">
              Customize all text displayed on your website
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 ${cosmic.buttonPrimary}`}
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {successMessage && <div className={`mb-4 ${cosmic.alertSuccess}`}>{successMessage}</div>}
      {errorMessage && <div className={`mb-4 ${cosmic.alertError}`}>{errorMessage}</div>}

      <div className="space-y-4">
        {uiTextSections.map((section) => (
          <div key={section.key} className="border border-white/[0.06] rounded-lg overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.key)}
              className="w-full flex items-center justify-between p-4 bg-elevated/50 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-primary-400">{section.icon}</span>
                <span className="font-medium text-secondary-200">{section.label}</span>
                <span className="text-xs text-secondary-500">({section.fields.length} fields)</span>
              </div>
              {expandedSections[section.key] ? (
                <ChevronDown size={20} className="text-secondary-500" />
              ) : (
                <ChevronRight size={20} className="text-secondary-500" />
              )}
            </button>

            {/* Section Content */}
            {expandedSections[section.key] && (
              <div className="p-4 space-y-4">
                {section.fields.map((field) => {
                  const sectionData = localUIText[section.key as keyof typeof localUIText];
                  const value = sectionData?.[field.key as keyof typeof sectionData] || '';

                  return (
                    <div key={field.key}>
                      <label className={cosmic.label}>{field.label}</label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={value}
                          onChange={(e) =>
                            handleFieldChange(section.key, field.key, e.target.value)
                          }
                          className={`${cosmic.textarea} h-20 resize-none`}
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                        />
                      ) : (
                        <input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            handleFieldChange(section.key, field.key, e.target.value)
                          }
                          className={cosmic.input}
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

      <div className={`mt-6 ${cosmic.alertInfo}`}>
        <p className="text-sm">
          <strong>Tip:</strong> Changes will take effect immediately after saving. Refresh your
          website to see the updated text.
        </p>
      </div>
    </div>
  );
};

export default AdminUITextSettings;
