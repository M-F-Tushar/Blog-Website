import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { Save, Menu, Plus, Trash2, Eye, EyeOff, ExternalLink, GripVertical } from 'lucide-react';
import { cosmic } from './ui/cosmicClassNames';

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
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const deleteMenuItem = (id: string) => {
    const protectedIds = ['home', 'blog'];
    if (protectedIds.includes(id)) {
      setErrorMessage('Home and Blog pages cannot be deleted.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleVisibility = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item))
    );
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...menuItems];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= menuItems.length) return;

    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    newItems.forEach((item, i) => (item.order = i + 1));
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

  return (
    <div className={cosmic.containerSm}>
      <div className="flex justify-between items-center mb-6 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <Menu size={28} className="text-primary-400" />
          <div>
            <h1 className={cosmic.sectionTitle}>Navigation Settings</h1>
            <p className="text-sm text-secondary-400">Manage menu items and navigation links</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={addMenuItem}
            className={`flex items-center gap-2 ${cosmic.buttonSecondary}`}
          >
            <Plus size={18} />
            Add Link
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 ${cosmic.buttonPrimary}`}
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {successMessage && <div className={`mb-4 ${cosmic.alertSuccess}`}>{successMessage}</div>}
      {errorMessage && <div className={`mb-4 ${cosmic.alertError}`}>{errorMessage}</div>}

      <div className="space-y-4">
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              item.visible
                ? 'border-white/[0.06] bg-elevated/50'
                : 'border-white/[0.03] bg-elevated/30 opacity-60'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Drag Handle / Reorder */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-secondary-500 hover:text-secondary-200 disabled:opacity-30"
                  title="Move up"
                >
                  ▲
                </button>
                <GripVertical size={16} className="text-secondary-500 mx-auto" />
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === menuItems.length - 1}
                  className="p-1 text-secondary-500 hover:text-secondary-200 disabled:opacity-30"
                  title="Move down"
                >
                  ▼
                </button>
              </div>

              {/* Label */}
              <div className="flex-1">
                <label className="block text-xs text-secondary-500 mb-1">Label</label>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateMenuItem(item.id, 'label', e.target.value)}
                  className={cosmic.input}
                  placeholder="Link Label"
                />
              </div>

              {/* Path */}
              <div className="flex-1">
                <label className="block text-xs text-secondary-500 mb-1">Path/URL</label>
                <input
                  type="text"
                  value={item.path}
                  onChange={(e) => updateMenuItem(item.id, 'path', e.target.value)}
                  className={cosmic.input}
                  placeholder="/page or https://..."
                />
              </div>

              {/* External Toggle */}
              <div className="flex flex-col items-center">
                <label className="block text-xs text-secondary-500 mb-1">External</label>
                <button
                  onClick={() => updateMenuItem(item.id, 'isExternal', !item.isExternal)}
                  className={`p-2 rounded-lg transition-colors ${
                    item.isExternal
                      ? 'bg-primary-500/10 text-primary-300 border border-primary-500/20'
                      : 'bg-elevated text-secondary-500'
                  }`}
                  title={item.isExternal ? 'External link' : 'Internal link'}
                >
                  <ExternalLink size={18} />
                </button>
              </div>

              {/* Visibility Toggle */}
              <button
                onClick={() => toggleVisibility(item.id)}
                className={`p-2 rounded-lg transition-colors ${
                  item.visible
                    ? 'bg-primary-500/10 text-primary-300 border border-primary-500/20'
                    : 'bg-elevated text-secondary-500'
                }`}
                title={item.visible ? 'Visible' : 'Hidden'}
              >
                {item.visible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>

              {/* Delete Button */}
              <button
                onClick={() => deleteMenuItem(item.id)}
                className="p-2 rounded-lg text-error-400 hover:bg-error-500/10 transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {menuItems.length === 0 && (
        <div className={cosmic.emptyState}>
          <Menu size={48} className="mx-auto mb-4 opacity-30" />
          <p>No menu items yet. Click &quot;Add Link&quot; to create one.</p>
        </div>
      )}

      <div className={`mt-6 ${cosmic.alertInfo}`}>
        <p className="text-sm">
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
