import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import {
  Save,
  Layout,
  Eye,
  EyeOff,
  Home,
  Star,
  TrendingUp,
  FileText,
  Mail,
  BarChart3,
  ChevronUp,
  ChevronDown,
  Settings2,
} from 'lucide-react';
import { cosmic } from './ui/cosmicClassNames';

interface HomepageSectionDef {
  id: string;
  showKey: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  configFields?: ConfigField[];
}

interface ConfigField {
  key: string;
  label: string;
  type: 'number';
  defaultValue: number;
  min?: number;
  max?: number;
}

const DEFAULT_ORDER = ['hero', 'stats', 'featured', 'trending', 'articles', 'newsletter'];

const SECTION_DEFS: HomepageSectionDef[] = [
  {
    id: 'hero',
    showKey: 'showHero',
    label: 'Hero Section',
    description: 'Main welcome banner with your name, tagline, and call-to-action buttons',
    icon: <Home size={20} />,
  },
  {
    id: 'stats',
    showKey: 'showStats',
    label: 'Stats Bar',
    description: 'Display article count, word count, years active, and topic count',
    icon: <BarChart3 size={20} />,
  },
  {
    id: 'featured',
    showKey: 'showFeaturedPost',
    label: 'Featured Post',
    description: 'Highlight your best or most recent post prominently',
    icon: <Star size={20} />,
  },
  {
    id: 'trending',
    showKey: 'showTrendingTopics',
    label: 'Trending Topics',
    description: 'Display popular tags to help visitors discover content',
    icon: <TrendingUp size={20} />,
    configFields: [
      { key: 'maxTags', label: 'Max Tags', type: 'number', defaultValue: 8, min: 3, max: 20 },
    ],
  },
  {
    id: 'articles',
    showKey: 'showLatestArticles',
    label: 'Latest Articles',
    description: 'Grid of your most recent blog posts',
    icon: <FileText size={20} />,
    configFields: [
      { key: 'count', label: 'Number of Posts', type: 'number', defaultValue: 6, min: 3, max: 12 },
    ],
  },
  {
    id: 'newsletter',
    showKey: 'showNewsletter',
    label: 'Newsletter Signup',
    description: 'Email subscription form to grow your audience',
    icon: <Mail size={20} />,
  },
];

const defaultLayout: Record<string, boolean> = {
  showHero: true,
  showStats: true,
  showFeaturedPost: true,
  showTrendingTopics: true,
  showLatestArticles: true,
  showNewsletter: true,
};

const AdminHomepageLayout: React.FC = () => {
  const { homepageLayout, updateSettings } = useSiteSettings();

  const [visibility, setVisibility] = useState<Record<string, boolean>>(defaultLayout);
  const [sectionOrder, setSectionOrder] = useState<string[]>(DEFAULT_ORDER);
  const [sectionConfig, setSectionConfig] = useState<Record<string, Record<string, unknown>>>({});
  const [expandedConfig, setExpandedConfig] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (homepageLayout) {
      const vis: Record<string, boolean> = { ...defaultLayout };
      for (const def of SECTION_DEFS) {
        const key = def.showKey;
        if (key in homepageLayout) {
          vis[key] = (homepageLayout as any)[key];
        }
      }
      setVisibility(vis);
      setSectionOrder(homepageLayout.sectionOrder || DEFAULT_ORDER);
      setSectionConfig(homepageLayout.sectionConfig || {});
    }
  }, [homepageLayout]);

  // Get ordered sections based on sectionOrder
  const orderedSections = sectionOrder
    .map((id) => SECTION_DEFS.find((d) => d.id === id))
    .filter(Boolean) as HomepageSectionDef[];

  // Include any sections not in the order array
  const remainingSections = SECTION_DEFS.filter((d) => !sectionOrder.includes(d.id));
  const allOrderedSections = [...orderedSections, ...remainingSections];

  const toggleSection = (showKey: string) => {
    setVisibility((prev) => ({ ...prev, [showKey]: !prev[showKey] }));
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    setSectionOrder((prev) => {
      const idx = prev.indexOf(sectionId);
      if (idx === -1) return prev;
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= prev.length) return prev;
      const newOrder = [...prev];
      [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];
      return newOrder;
    });
  };

  const updateSectionConfig = (sectionId: string, key: string, value: unknown) => {
    setSectionConfig((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [key]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const layout: Record<string, unknown> = { ...visibility, sectionOrder, sectionConfig };
      await updateSettings({ homepageLayout: layout as any });
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

  const enabledCount = allOrderedSections.filter((s) => visibility[s.showKey]).length;

  return (
    <div className={cosmic.containerSm}>
      <div className="flex justify-between items-center mb-6 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <Layout size={28} className="text-primary-400" />
          <div>
            <h1 className={cosmic.sectionTitle}>Homepage Layout</h1>
            <p className="text-sm text-secondary-400">
              Control section visibility, order, and configuration
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 ${cosmic.buttonPrimary}`}
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Layout'}
        </button>
      </div>

      {successMessage && <div className={`mb-4 ${cosmic.alertSuccess}`}>{successMessage}</div>}
      {errorMessage && <div className={`mb-4 ${cosmic.alertError}`}>{errorMessage}</div>}

      <div className="mb-4 p-3 bg-elevated/50 border border-white/[0.06] rounded-xl">
        <p className="text-sm text-secondary-400">
          <strong>{enabledCount}</strong> of {allOrderedSections.length} sections enabled. Use the
          arrows to reorder sections on the homepage.
        </p>
      </div>

      <div className="space-y-3">
        {allOrderedSections.map((section, index) => {
          const isEnabled = visibility[section.showKey];
          const isConfigExpanded = expandedConfig === section.id;
          const hasConfig = section.configFields && section.configFields.length > 0;

          return (
            <div
              key={section.id}
              className={`rounded-xl border-2 transition-all duration-200 ${
                isEnabled
                  ? 'border-primary-500/30 bg-primary-500/5'
                  : 'border-white/[0.06] bg-elevated/50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 p-4">
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => moveSection(section.id, 'up')}
                    disabled={index === 0}
                    title="Move up"
                    className="p-1 rounded text-secondary-500 hover:text-primary-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => moveSection(section.id, 'down')}
                    disabled={index === allOrderedSections.length - 1}
                    title="Move down"
                    className="p-1 rounded text-secondary-500 hover:text-primary-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                {/* Order Number */}
                <span className="text-xs font-mono text-secondary-500 w-5 text-center flex-shrink-0">
                  {index + 1}
                </span>

                {/* Icon */}
                <div
                  className={`p-2 rounded-lg flex-shrink-0 ${
                    isEnabled
                      ? 'bg-primary-500/10 text-primary-300 border border-primary-500/20'
                      : 'bg-elevated text-secondary-500'
                  }`}
                >
                  {section.icon}
                </div>

                {/* Label + Description */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-medium ${
                      isEnabled ? 'text-secondary-50' : 'text-secondary-400'
                    }`}
                  >
                    {section.label}
                  </h3>
                  <p className="text-sm text-secondary-500 truncate">{section.description}</p>
                </div>

                {/* Config Toggle */}
                {hasConfig && isEnabled && (
                  <button
                    onClick={() => setExpandedConfig(isConfigExpanded ? null : section.id)}
                    title="Configure section"
                    className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                      isConfigExpanded
                        ? 'bg-primary-500/15 text-primary-300 border border-primary-500/30'
                        : 'bg-elevated/50 border border-white/[0.06] text-secondary-400 hover:text-primary-300'
                    }`}
                  >
                    <Settings2 size={16} />
                  </button>
                )}

                {/* Visibility Toggle */}
                <button
                  onClick={() => toggleSection(section.showKey)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all flex-shrink-0 ${
                    isEnabled
                      ? 'bg-primary-500/15 text-primary-300 border border-primary-500/30'
                      : 'bg-elevated border border-white/[0.06] text-secondary-500 hover:bg-white/[0.04]'
                  }`}
                >
                  {isEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
                  <span className="hidden sm:inline">{isEnabled ? 'Visible' : 'Hidden'}</span>
                </button>
              </div>

              {/* Expanded Config Panel */}
              {hasConfig && isConfigExpanded && isEnabled && (
                <div className="px-4 pb-4 pt-2 border-t border-white/[0.06] ml-[76px]">
                  <div className="flex flex-wrap gap-4">
                    {section.configFields!.map((field) => {
                      const currentValue =
                        (sectionConfig[section.id]?.[field.key] as number) ?? field.defaultValue;
                      return (
                        <div key={field.key} className="flex items-center gap-3">
                          <label className="text-sm text-secondary-300 whitespace-nowrap">
                            {field.label}:
                          </label>
                          <input
                            type="number"
                            value={currentValue}
                            onChange={(e) =>
                              updateSectionConfig(
                                section.id,
                                field.key,
                                parseInt(e.target.value, 10) || field.defaultValue
                              )
                            }
                            min={field.min}
                            max={field.max}
                            className="w-20 px-3 py-1.5 bg-elevated/80 border border-white/10 rounded-lg text-secondary-200 text-sm focus:border-primary-500/50 focus:outline-none transition-all"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={`mt-6 ${cosmic.alertInfo}`}>
        <p className="text-sm">
          <strong>Tip:</strong> Drag sections up and down to control the display order on your
          homepage. Hidden sections are completely removed from the page. Click the gear icon to
          configure section-specific options.
        </p>
      </div>
    </div>
  );
};

export default AdminHomepageLayout;
