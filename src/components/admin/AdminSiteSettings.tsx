import React, { useState, useEffect } from 'react';
import { useSiteSettings, Skill, TimelineItem, Achievement } from '../../hooks/useSiteSettings';
import { Plus, Trash2, Save } from 'lucide-react';
import { cosmic } from './ui/cosmicClassNames';

const AdminSiteSettings: React.FC = () => {
  const {
    siteName,
    authorName,
    authorTagline,
    authorBio,
    siteDescription,
    socialLinks,
    categories,
    skills,
    timeline,
    achievements,
    updateSettings,
    addCategory,
    deleteCategory,
  } = useSiteSettings();

  const [formState, setFormState] = useState({
    siteName,
    authorName,
    authorTagline,
    authorBio,
    siteDescription,
    socialLinks,
  });

  // Local state for dynamic lists to allow editing before saving
  const [localSkills, setLocalSkills] = useState<Skill[]>([]);
  const [localTimeline, setLocalTimeline] = useState<TimelineItem[]>([]);
  const [localAchievements, setLocalAchievements] = useState<Achievement[]>([]);

  const [newCategory, setNewCategory] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync local state with context when it loads
  useEffect(() => {
    setFormState({ siteName, authorName, authorTagline, authorBio, siteDescription, socialLinks });
    setLocalSkills(skills || []);
    setLocalTimeline(timeline || []);
    setLocalAchievements(achievements || []);
  }, [
    siteName,
    authorName,
    authorTagline,
    authorBio,
    siteDescription,
    socialLinks,
    skills,
    timeline,
    achievements,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  // --- Skills Management ---
  const addSkill = () => {
    setLocalSkills([...localSkills, { name: '', level: 3, iconName: 'Code' }]);
  };

  const updateSkill = (index: number, field: keyof Skill, value: any) => {
    const updated = [...localSkills];
    updated[index] = { ...updated[index], [field]: value };
    setLocalSkills(updated);
  };

  const removeSkill = (index: number) => {
    setLocalSkills(localSkills.filter((_, i) => i !== index));
  };

  // --- Timeline Management ---
  const addTimelineItem = () => {
    setLocalTimeline([
      ...localTimeline,
      {
        year: new Date().getFullYear().toString(),
        title: '',
        organization: '',
        description: '',
        type: 'work',
      },
    ]);
  };

  const updateTimelineItem = (index: number, field: keyof TimelineItem, value: any) => {
    const updated = [...localTimeline];
    updated[index] = { ...updated[index], [field]: value };
    setLocalTimeline(updated);
  };

  const removeTimelineItem = (index: number) => {
    setLocalTimeline(localTimeline.filter((_, i) => i !== index));
  };

  // --- Achievements Management ---
  const addAchievement = () => {
    setLocalAchievements([
      ...localAchievements,
      { title: '', issuer: '', year: new Date().getFullYear().toString() },
    ]);
  };

  const updateAchievement = (index: number, field: keyof Achievement, value: any) => {
    const updated = [...localAchievements];
    updated[index] = { ...updated[index], [field]: value };
    setLocalAchievements(updated);
  };

  const removeAchievement = (index: number) => {
    setLocalAchievements(localAchievements.filter((_, i) => i !== index));
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await updateSettings({
        ...formState,
        skills: localSkills,
        timeline: localTimeline,
        achievements: localAchievements,
      });
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

  return (
    <div className={`${cosmic.containerSm} space-y-10`}>
      <div className="flex justify-between items-center">
        <h1 className={cosmic.pageTitle}>Site Settings</h1>
        <button
          onClick={handleSettingsSubmit}
          disabled={saving}
          className={`flex items-center gap-2 ${cosmic.buttonPrimary}`}
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {successMessage && <div className={cosmic.alertSuccess}>{successMessage}</div>}
      {errorMessage && <div className={cosmic.alertError}>{errorMessage}</div>}

      <form onSubmit={handleSettingsSubmit} className="space-y-8">
        {/* General Settings */}
        <section>
          <h2 className={`${cosmic.subTitle} border-b border-white/[0.06] pb-2 pt-6 mb-4`}>
            General Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="siteName" className={cosmic.label}>
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                value={formState.siteName}
                onChange={handleChange}
                className={cosmic.input}
              />
            </div>
            <div>
              <label htmlFor="authorName" className={cosmic.label}>
                Author Name
              </label>
              <input
                type="text"
                name="authorName"
                value={formState.authorName}
                onChange={handleChange}
                className={cosmic.input}
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="authorTagline" className={cosmic.label}>
              Author Tagline
            </label>
            <input
              type="text"
              name="authorTagline"
              value={formState.authorTagline}
              onChange={handleChange}
              className={cosmic.input}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="siteDescription" className={cosmic.label}>
              Site SEO Description
            </label>
            <textarea
              name="siteDescription"
              value={formState.siteDescription}
              onChange={handleChange}
              className={`${cosmic.textarea} h-24`}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="authorBio" className={cosmic.label}>
              Author Bio (Markdown Supported)
            </label>
            <textarea
              name="authorBio"
              value={formState.authorBio}
              onChange={handleChange}
              className={`${cosmic.textarea} h-32 font-mono text-sm`}
            />
          </div>
        </section>

        {/* Social Links */}
        <section>
          <h2 className={`${cosmic.subTitle} border-b border-white/[0.06] pb-2 pt-6 mb-4`}>
            Social Links
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="github" className={cosmic.label}>
                GitHub URL
              </label>
              <input
                type="url"
                name="github"
                value={formState.socialLinks.github}
                onChange={handleSocialChange}
                className={cosmic.input}
              />
            </div>
            <div>
              <label htmlFor="linkedin" className={cosmic.label}>
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedin"
                value={formState.socialLinks.linkedin}
                onChange={handleSocialChange}
                className={cosmic.input}
              />
            </div>
            <div>
              <label htmlFor="email" className={cosmic.label}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formState.socialLinks.email}
                onChange={handleSocialChange}
                className={cosmic.input}
              />
            </div>
          </div>
        </section>

        {/* Skills */}
        <section>
          <div className="flex justify-between items-center mb-4 border-b border-white/[0.06] pb-2 pt-6">
            <h2 className={cosmic.subTitle}>Skills & Technologies</h2>
            <button
              type="button"
              onClick={addSkill}
              className={`flex items-center gap-1 ${cosmic.buttonSmall}`}
            >
              <Plus size={16} /> Add Skill
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {localSkills.map((skill, index) => (
              <div
                key={index}
                className="flex gap-2 items-end bg-elevated/50 border border-white/[0.06] rounded-xl p-3"
              >
                <div className="flex-1">
                  <label className="text-xs text-secondary-500">Skill Name</label>
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                    className={cosmic.input}
                    placeholder="e.g. React"
                  />
                </div>
                <div className="w-20">
                  <label className="text-xs text-secondary-500">Level (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={skill.level}
                    onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value))}
                    className={cosmic.input}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="p-2 text-error-400 hover:bg-error-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            {localSkills.length === 0 && (
              <p className="text-secondary-500 italic col-span-2 text-center py-4">
                No skills added yet.
              </p>
            )}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <div className="flex justify-between items-center mb-4 border-b border-white/[0.06] pb-2 pt-6">
            <h2 className={cosmic.subTitle}>Journey / Timeline</h2>
            <button
              type="button"
              onClick={addTimelineItem}
              className={`flex items-center gap-1 ${cosmic.buttonSmall}`}
            >
              <Plus size={16} /> Add Item
            </button>
          </div>
          <div className="space-y-4">
            {localTimeline.map((item, index) => (
              <div
                key={index}
                className="bg-elevated/50 border border-white/[0.06] rounded-xl p-4 relative"
              >
                <button
                  type="button"
                  onClick={() => removeTimelineItem(index)}
                  className="absolute top-4 right-4 text-error-400 hover:bg-error-500/10 rounded-lg p-1 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <div className="grid md:grid-cols-12 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs text-secondary-500">Year</label>
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => updateTimelineItem(index, 'year', e.target.value)}
                      className={cosmic.input}
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="text-xs text-secondary-500">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateTimelineItem(index, 'title', e.target.value)}
                      className={cosmic.input}
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="text-xs text-secondary-500">Organization</label>
                    <input
                      type="text"
                      value={item.organization}
                      onChange={(e) => updateTimelineItem(index, 'organization', e.target.value)}
                      className={cosmic.input}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-secondary-500">Type</label>
                    <select
                      value={item.type}
                      onChange={(e) => updateTimelineItem(index, 'type', e.target.value)}
                      className={cosmic.select}
                    >
                      <option value="work">Work</option>
                      <option value="education">Education</option>
                    </select>
                  </div>
                  <div className="md:col-span-12">
                    <label className="text-xs text-secondary-500">Description</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateTimelineItem(index, 'description', e.target.value)}
                      className={`${cosmic.textarea} h-20`}
                    />
                  </div>
                </div>
              </div>
            ))}
            {localTimeline.length === 0 && (
              <p className="text-secondary-500 italic text-center py-4">
                No timeline items added yet.
              </p>
            )}
          </div>
        </section>

        {/* Achievements */}
        <section>
          <div className="flex justify-between items-center mb-4 border-b border-white/[0.06] pb-2 pt-6">
            <h2 className={cosmic.subTitle}>Achievements & Certifications</h2>
            <button
              type="button"
              onClick={addAchievement}
              className={`flex items-center gap-1 ${cosmic.buttonSmall}`}
            >
              <Plus size={16} /> Add Achievement
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {localAchievements.map((item, index) => (
              <div
                key={index}
                className="bg-elevated/50 border border-white/[0.06] rounded-xl p-3 relative"
              >
                <button
                  type="button"
                  onClick={() => removeAchievement(index)}
                  className="absolute top-2 right-2 text-error-400 hover:bg-error-500/10 rounded-lg p-1 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-secondary-500">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                      className={cosmic.input}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-secondary-500">Issuer</label>
                      <input
                        type="text"
                        value={item.issuer}
                        onChange={(e) => updateAchievement(index, 'issuer', e.target.value)}
                        className={cosmic.input}
                      />
                    </div>
                    <div className="w-24">
                      <label className="text-xs text-secondary-500">Year</label>
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => updateAchievement(index, 'year', e.target.value)}
                        className={cosmic.input}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {localAchievements.length === 0 && (
              <p className="text-secondary-500 italic col-span-2 text-center py-4">
                No achievements added yet.
              </p>
            )}
          </div>
        </section>

        {/* Category Management */}
        <section>
          <h2 className={`${cosmic.subTitle} border-b border-white/[0.06] pb-2 pt-6 mb-4`}>
            Manage Categories
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name"
                className={cosmic.input}
              />
              <button type="button" onClick={handleAddCategory} className={cosmic.buttonPrimary}>
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span key={cat} className={cosmic.tag}>
                  {cat}
                  <button
                    type="button"
                    onClick={() => deleteCategory(cat)}
                    className="text-error-400 hover:text-error-300 font-bold ml-1"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </section>
      </form>
    </div>
  );
};

export default AdminSiteSettings;
