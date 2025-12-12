import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { Save, Menu, Plus, Trash2, Eye, EyeOff, ExternalLink, GripVertical } from 'lucide-react';

interface MenuItem {
    id: string;
    label: string;
    path: string;
    isExternal: boolean;
    visible: boolean;
    order: number;
}

const AdminNavigationSettings: React.FC = () => {
    const { navigation, updateSettings } = useSiteSettings();

    const [menuItems, setMenuItems] = useState<MenuItem[]>(navigation?.menuItems || []);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (navigation?.menuItems) {
            setMenuItems([...navigation.menuItems].sort((a, b) => a.order - b.order));
        }
    }, [navigation]);

    const addMenuItem = () => {
        const newItem: MenuItem = {
            id: `custom-${Date.now()}`,
            label: 'New Link',
            path: '/new-page',
            isExternal: false,
            visible: true,
            order: menuItems.length + 1,
        };
        setMenuItems([...menuItems, newItem]);
    };

    const updateMenuItem = (id: string, field: keyof MenuItem, value: string | boolean | number) => {
        setMenuItems(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const deleteMenuItem = (id: string) => {
        const protectedIds = ['home', 'blog'];
        if (protectedIds.includes(id)) {
            setErrorMessage('Home and Blog pages cannot be deleted.');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }
        setMenuItems(prev => prev.filter(item => item.id !== id));
    };

    const toggleVisibility = (id: string) => {
        setMenuItems(prev => prev.map(item =>
            item.id === id ? { ...item, visible: !item.visible } : item
        ));
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newItems = [...menuItems];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= menuItems.length) return;

        [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
        newItems.forEach((item, i) => item.order = i + 1);
        setMenuItems(newItems);
    };

    const handleSave = async () => {
        setSaving(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await updateSettings({ navigation: { menuItems } });
            setSuccessMessage('Navigation settings saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Failed to save navigation settings:', error);
            setErrorMessage('Failed to save settings. Please try again.');
            setTimeout(() => setErrorMessage(''), 5000);
        } finally {
            setSaving(false);
        }
    };

    const inputClasses = "w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200";

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center gap-3">
                    <Menu size={28} className="text-accent" />
                    <div>
                        <h1 className="text-2xl font-bold font-serif text-gray-900 dark:text-white">
                            Navigation Settings
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Manage menu items and navigation links
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={addMenuItem}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <Plus size={18} />
                        Add Link
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-accent text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Save size={20} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
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
                {menuItems.map((item, index) => (
                    <div
                        key={item.id}
                        className={`p-4 rounded-lg border-2 transition-all ${item.visible
                                ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 opacity-60'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            {/* Drag Handle / Reorder */}
                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => moveItem(index, 'up')}
                                    disabled={index === 0}
                                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                    title="Move up"
                                >
                                    ▲
                                </button>
                                <GripVertical size={16} className="text-gray-400 mx-auto" />
                                <button
                                    onClick={() => moveItem(index, 'down')}
                                    disabled={index === menuItems.length - 1}
                                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                    title="Move down"
                                >
                                    ▼
                                </button>
                            </div>

                            {/* Label */}
                            <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">Label</label>
                                <input
                                    type="text"
                                    value={item.label}
                                    onChange={(e) => updateMenuItem(item.id, 'label', e.target.value)}
                                    className={inputClasses}
                                    placeholder="Link Label"
                                />
                            </div>

                            {/* Path */}
                            <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">Path/URL</label>
                                <input
                                    type="text"
                                    value={item.path}
                                    onChange={(e) => updateMenuItem(item.id, 'path', e.target.value)}
                                    className={inputClasses}
                                    placeholder="/page or https://..."
                                />
                            </div>

                            {/* External Toggle */}
                            <div className="flex flex-col items-center">
                                <label className="block text-xs text-gray-500 mb-1">External</label>
                                <button
                                    onClick={() => updateMenuItem(item.id, 'isExternal', !item.isExternal)}
                                    className={`p-2 rounded-lg transition-colors ${item.isExternal
                                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
                                        }`}
                                    title={item.isExternal ? 'External link' : 'Internal link'}
                                >
                                    <ExternalLink size={18} />
                                </button>
                            </div>

                            {/* Visibility Toggle */}
                            <button
                                onClick={() => toggleVisibility(item.id)}
                                className={`p-2 rounded-lg transition-colors ${item.visible
                                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
                                    }`}
                                title={item.visible ? 'Visible' : 'Hidden'}
                            >
                                {item.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>

                            {/* Delete Button */}
                            <button
                                onClick={() => deleteMenuItem(item.id)}
                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {menuItems.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <Menu size={48} className="mx-auto mb-4 opacity-30" />
                    <p>No menu items yet. Click &quot;Add Link&quot; to create one.</p>
                </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Tips:</strong>
                    <br />• Home and Blog pages cannot be deleted
                    <br />• Use external links for social profiles or external sites
                    <br />• Hidden items won&apos;t appear in the navigation menu
                </p>
            </div>
        </div>
    );
};

export default AdminNavigationSettings;
