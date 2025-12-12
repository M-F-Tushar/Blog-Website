import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { Save, Palette, Type, Image, Moon, Sun, Monitor } from 'lucide-react';

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

    const [localAppearance, setLocalAppearance] = useState(appearance || {
        primaryColor: '#6366f1',
        accentColor: '#8b5cf6',
        fontFamily: 'Inter',
        logoUrl: '',
        faviconUrl: '',
        defaultTheme: 'system' as const,
    });
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (appearance) {
            setLocalAppearance(appearance);
        }
    }, [appearance]);

    const handleChange = (field: string, value: string) => {
        setLocalAppearance(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const applyColorPreset = (preset: typeof colorPresets[0]) => {
        setLocalAppearance(prev => ({
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

    const inputClasses = "w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200";
    const labelClasses = "block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1";

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center gap-3">
                    <Palette size={28} className="text-accent" />
                    <div>
                        <h1 className="text-2xl font-bold font-serif text-gray-900 dark:text-white">
                            Appearance Settings
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Customize colors, fonts, and theme preferences
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
                {/* Color Scheme */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Palette size={20} /> Color Scheme
                    </h2>

                    {/* Color Presets */}
                    <div className="mb-6">
                        <label className={labelClasses}>Quick Presets</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {colorPresets.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => applyColorPreset(preset)}
                                    className="p-3 rounded-lg border-2 hover:border-accent transition-colors flex items-center gap-3"
                                    style={{
                                        borderColor: localAppearance.primaryColor === preset.primary ? preset.primary : 'transparent',
                                        backgroundColor: `${preset.primary}10`,
                                    }}
                                >
                                    <div className="flex gap-1">
                                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.primary }} />
                                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.accent }} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{preset.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Colors */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>Primary Color</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={localAppearance.primaryColor}
                                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={localAppearance.primaryColor}
                                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                                    className={inputClasses}
                                    placeholder="#6366f1"
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelClasses}>Accent Color</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={localAppearance.accentColor}
                                    onChange={(e) => handleChange('accentColor', e.target.value)}
                                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={localAppearance.accentColor}
                                    onChange={(e) => handleChange('accentColor', e.target.value)}
                                    className={inputClasses}
                                    placeholder="#8b5cf6"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Typography */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Type size={20} /> Typography
                    </h2>
                    <div>
                        <label className={labelClasses}>Font Family</label>
                        <select
                            value={localAppearance.fontFamily}
                            onChange={(e) => handleChange('fontFamily', e.target.value)}
                            className={inputClasses}
                        >
                            {fontOptions.map((font) => (
                                <option key={font.value} value={font.value}>
                                    {font.label}
                                </option>
                            ))}
                        </select>
                        <p className="mt-2 text-sm text-gray-500">
                            Preview: <span style={{ fontFamily: localAppearance.fontFamily }}>The quick brown fox jumps over the lazy dog.</span>
                        </p>
                    </div>
                </section>

                {/* Branding */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Image size={20} /> Branding
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>Logo URL</label>
                            <input
                                type="url"
                                value={localAppearance.logoUrl}
                                onChange={(e) => handleChange('logoUrl', e.target.value)}
                                className={inputClasses}
                                placeholder="https://example.com/logo.png"
                            />
                            {localAppearance.logoUrl && (
                                <div className="mt-2">
                                    <img src={localAppearance.logoUrl} alt="Logo preview" className="h-12 object-contain" />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className={labelClasses}>Favicon URL</label>
                            <input
                                type="url"
                                value={localAppearance.faviconUrl}
                                onChange={(e) => handleChange('faviconUrl', e.target.value)}
                                className={inputClasses}
                                placeholder="https://example.com/favicon.ico"
                            />
                            {localAppearance.faviconUrl && (
                                <div className="mt-2">
                                    <img src={localAppearance.faviconUrl} alt="Favicon preview" className="h-8 w-8 object-contain" />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Default Theme */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Default Theme</h2>
                    <div className="flex gap-4">
                        {[
                            { value: 'light', icon: Sun, label: 'Light' },
                            { value: 'dark', icon: Moon, label: 'Dark' },
                            { value: 'system', icon: Monitor, label: 'System' },
                        ].map(({ value, icon: Icon, label }) => (
                            <button
                                key={value}
                                onClick={() => handleChange('defaultTheme', value)}
                                className={`flex-1 p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${localAppearance.defaultTheme === value
                                        ? 'border-accent bg-accent/10'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon size={24} className={localAppearance.defaultTheme === value ? 'text-accent' : 'text-gray-500'} />
                                <span className={`font-medium ${localAppearance.defaultTheme === value ? 'text-accent' : 'text-gray-600 dark:text-gray-400'}`}>
                                    {label}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    <strong>Note:</strong> Custom colors and fonts require CSS variable integration to take effect across the site.
                    This will be applied after saving.
                </p>
            </div>
        </div>
    );
};

export default AdminAppearanceSettings;
