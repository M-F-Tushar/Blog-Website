import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { Save, Palette, Type, Image, Moon, Sun, Monitor } from 'lucide-react';
import { cosmic } from './ui/cosmicClassNames';

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather' },
];

const colorPresets = [
  { primary: '#6366f1', accent: '#8b5cf6', name: 'Indigo & Violet' },
  { primary: '#3b82f6', accent: '#06b6d4', name: 'Blue & Cyan' },
  { primary: '#10b981', accent: '#14b8a6', name: 'Emerald & Teal' },
  { primary: '#f59e0b', accent: '#f97316', name: 'Amber & Orange' },
  { primary: '#ef4444', accent: '#f43f5e', name: 'Red & Rose' },
  { primary: '#8b5cf6', accent: '#d946ef', name: 'Violet & Fuchsia' },
];

const AdminAppearanceSettings: React.FC = () => {
  const { appearance, updateSettings } = useSiteSettings();

  const [localAppearance, setLocalAppearance] = useState(
    appearance || {
      primaryColor: '#6366f1',
      accentColor: '#8b5cf6',
      fontFamily: 'Inter',
      logoUrl: '',
      faviconUrl: '',
      defaultTheme: 'system' as const,
    }
  );
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (appearance) {
      setLocalAppearance(appearance);
    }
  }, [appearance]);

  const handleChange = (field: string, value: string) => {
    setLocalAppearance((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyColorPreset = (preset: (typeof colorPresets)[0]) => {
    setLocalAppearance((prev) => ({
      ...prev,
      primaryColor: preset.primary,
      accentColor: preset.accent,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await updateSettings({ appearance: localAppearance });
      setSuccessMessage('Appearance settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save appearance settings:', error);
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
          <Palette size={28} className="text-primary-400" />
          <div>
            <h1 className={cosmic.sectionTitle}>Appearance Settings</h1>
            <p className="text-sm text-secondary-400">
              Customize colors, fonts, and theme preferences
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
        {/* Color Scheme */}
        <section>
          <h2 className={`${cosmic.subTitle} mb-4 flex items-center gap-2`}>
            <Palette size={20} /> Color Scheme
          </h2>

          {/* Color Presets */}
          <div className="mb-6">
            <label className={cosmic.label}>Quick Presets</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyColorPreset(preset)}
                  className="p-3 rounded-lg border-2 hover:border-primary-500/30 transition-colors flex items-center gap-3"
                  style={{
                    borderColor:
                      localAppearance.primaryColor === preset.primary
                        ? preset.primary
                        : 'transparent',
                    backgroundColor: `${preset.primary}10`,
                  }}
                >
                  <div className="flex gap-1">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <span className="text-sm font-medium text-secondary-200">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={cosmic.label}>Primary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localAppearance.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="w-12 h-10 rounded border border-white/[0.06] cursor-pointer"
                />
                <input
                  type="text"
                  value={localAppearance.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className={cosmic.input}
                  placeholder="#6366f1"
                />
              </div>
            </div>
            <div>
              <label className={cosmic.label}>Accent Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localAppearance.accentColor}
                  onChange={(e) => handleChange('accentColor', e.target.value)}
                  className="w-12 h-10 rounded border border-white/[0.06] cursor-pointer"
                />
                <input
                  type="text"
                  value={localAppearance.accentColor}
                  onChange={(e) => handleChange('accentColor', e.target.value)}
                  className={cosmic.input}
                  placeholder="#8b5cf6"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className={`${cosmic.subTitle} mb-4 flex items-center gap-2`}>
            <Type size={20} /> Typography
          </h2>
          <div>
            <label className={cosmic.label}>Font Family</label>
            <select
              value={localAppearance.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className={cosmic.select}
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-secondary-500">
              Preview:{' '}
              <span style={{ fontFamily: localAppearance.fontFamily }}>
                The quick brown fox jumps over the lazy dog.
              </span>
            </p>
          </div>
        </section>

        {/* Branding */}
        <section>
          <h2 className={`${cosmic.subTitle} mb-4 flex items-center gap-2`}>
            <Image size={20} /> Branding
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={cosmic.label}>Logo URL</label>
              <input
                type="url"
                value={localAppearance.logoUrl}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                className={cosmic.input}
                placeholder="https://example.com/logo.png"
              />
              {localAppearance.logoUrl && (
                <div className="mt-2">
                  <img
                    src={localAppearance.logoUrl}
                    alt="Logo preview"
                    className="h-12 object-contain"
                  />
                </div>
              )}
            </div>
            <div>
              <label className={cosmic.label}>Favicon URL</label>
              <input
                type="url"
                value={localAppearance.faviconUrl}
                onChange={(e) => handleChange('faviconUrl', e.target.value)}
                className={cosmic.input}
                placeholder="https://example.com/favicon.ico"
              />
              {localAppearance.faviconUrl && (
                <div className="mt-2">
                  <img
                    src={localAppearance.faviconUrl}
                    alt="Favicon preview"
                    className="h-8 w-8 object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Default Theme */}
        <section>
          <h2 className={`${cosmic.subTitle} mb-4`}>Default Theme</h2>
          <div className="flex gap-4">
            {[
              { value: 'light', icon: Sun, label: 'Light' },
              { value: 'dark', icon: Moon, label: 'Dark' },
              { value: 'system', icon: Monitor, label: 'System' },
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => handleChange('defaultTheme', value)}
                className={`flex-1 p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                  localAppearance.defaultTheme === value
                    ? 'border-primary-500/30 bg-primary-500/10'
                    : 'border-white/[0.06] hover:border-white/10'
                }`}
              >
                <Icon
                  size={24}
                  className={
                    localAppearance.defaultTheme === value
                      ? 'text-primary-400'
                      : 'text-secondary-500'
                  }
                />
                <span
                  className={`font-medium ${localAppearance.defaultTheme === value ? 'text-primary-300' : 'text-secondary-400'}`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className={`mt-6 ${cosmic.alertWarning}`}>
        <p className="text-sm">
          <strong>Note:</strong> Custom colors and fonts require CSS variable integration to take
          effect across the site. This will be applied after saving.
        </p>
      </div>
    </div>
  );
};

export default AdminAppearanceSettings;
