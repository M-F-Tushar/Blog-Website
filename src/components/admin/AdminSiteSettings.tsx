import React, { useState } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const AdminSiteSettings: React.FC = () => {
  const { 
    siteName, authorName, authorTagline, authorBio, siteDescription, socialLinks, categories,
    updateSettings, addCategory, deleteCategory
  } = useSiteSettings();

  const [formState, setFormState] = useState({
    siteName, authorName, authorTagline, authorBio, siteDescription, socialLinks
  });
  const [newCategory, setNewCategory] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
        ...prev,
        socialLinks: {
            ...prev.socialLinks,
            [name]: value
        }
    }));
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      await updateSettings(formState);
      setSuccessMessage('Site settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update settings:', error);
      setErrorMessage('Failed to update site settings. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSaving(false);
    }
  };
  
  const handleAddCategory = (e: React.FormEvent) => {
      e.preventDefault();
      if (newCategory.trim()) {
          addCategory(newCategory.trim());
          setNewCategory('');
      }
  };

  const inputClasses = "w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-10">
      <h1 className="text-3xl font-bold font-serif text-center text-gray-900 dark:text-white">
        Site Settings
      </h1>
      
      {/* General Settings Form */}
      <form onSubmit={handleSettingsSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">General</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div><label htmlFor="siteName" className={labelClasses}>Site Name</label><input type="text" name="siteName" value={formState.siteName} onChange={handleChange} className={inputClasses} /></div>
          <div><label htmlFor="authorName" className={labelClasses}>Author Name</label><input type="text" name="authorName" value={formState.authorName} onChange={handleChange} className={inputClasses} /></div>
        </div>
        <div><label htmlFor="authorTagline" className={labelClasses}>Author Tagline</label><input type="text" name="authorTagline" value={formState.authorTagline} onChange={handleChange} className={inputClasses} /></div>
        <div><label htmlFor="siteDescription" className={labelClasses}>Site SEO Description</label><textarea name="siteDescription" value={formState.siteDescription} onChange={handleChange} className={`${inputClasses} h-24`} /></div>
        <div><label htmlFor="authorBio" className={labelClasses}>Author Bio (About Page)</label><textarea name="authorBio" value={formState.authorBio} onChange={handleChange} className={`${inputClasses} h-32`} /></div>

        <h2 className="text-xl font-semibold border-b pb-2 pt-4">Social Links</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div><label htmlFor="github" className={labelClasses}>GitHub URL</label><input type="url" name="github" value={formState.socialLinks.github} onChange={handleSocialChange} className={inputClasses} /></div>
          <div><label htmlFor="linkedin" className={labelClasses}>LinkedIn URL</label><input type="url" name="linkedin" value={formState.socialLinks.linkedin} onChange={handleSocialChange} className={inputClasses} /></div>
          <div><label htmlFor="email" className={labelClasses}>Email Address</label><input type="email" name="email" value={formState.socialLinks.email} onChange={handleSocialChange} className={inputClasses} /></div>
        </div>
        
        <div className="text-right">
          <button 
            type="submit" 
            disabled={saving}
            className="px-6 py-2 bg-accent text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
        {successMessage && <p className="text-green-600 text-center mt-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-600 text-center mt-4">{errorMessage}</p>}
      </form>
      
      {/* Category Management */}
      <div>
        <h2 className="text-xl font-semibold border-b pb-2">Manage Categories</h2>
        <div className="mt-4 space-y-4">
            <form onSubmit={handleAddCategory} className="flex items-center gap-4">
                <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New category name" className={inputClasses} />
                <button type="submit" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">Add</button>
            </form>
            <ul className="space-y-2">
                {categories.map(cat => (
                    <li key={cat} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                        <span>{cat}</span>
                        <button onClick={() => deleteCategory(cat)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSiteSettings;
