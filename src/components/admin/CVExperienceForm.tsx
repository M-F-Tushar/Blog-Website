import React, { useState, useEffect } from 'react';
import { Experience } from '../../hooks/useCVData';
import { cosmic } from './ui/cosmicClassNames';

interface Props {
  experience?: Experience;
  onSave: (data: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

const CVExperienceForm: React.FC<Props> = ({ experience, onSave, onCancel }) => {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [current, setCurrent] = useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (experience) {
      setCompany(experience.company);
      setPosition(experience.position);
      setStartDate(experience.start_date);
      setEndDate(experience.end_date || '');
      setCurrent(experience.current);
      setDescription(experience.description || '');
      setLocation(experience.location || '');
      setSkills(experience.skills.join(', '));
      setSortOrder(experience.sort_order);
    }
  }, [experience]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !position || !startDate) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      setIsSaving(true);
      const parsedSkills = skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      await onSave({
        company,
        position,
        start_date: startDate,
        end_date: current ? undefined : endDate || undefined,
        current,
        description: description || undefined,
        location: location || undefined,
        skills: parsedSkills,
        sort_order: sortOrder,
      });
    } catch (err) {
      console.error('Error saving experience:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className={cosmic.subTitle}>{experience ? 'Edit Experience' : 'Add Experience'}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={cosmic.label}>
            Company <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={cosmic.input}
            placeholder="e.g. Google"
            required
          />
        </div>

        <div>
          <label className={cosmic.label}>
            Position <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className={cosmic.input}
            placeholder="e.g. Senior Software Engineer"
            required
          />
        </div>
      </div>

      <div>
        <label className={cosmic.label}>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={cosmic.input}
          placeholder="e.g. Mountain View, CA"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={cosmic.label}>
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={cosmic.input}
            required
          />
        </div>

        <div>
          <label className={cosmic.label}>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={cosmic.input}
            disabled={current}
          />
        </div>

        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={current}
              onChange={(e) => setCurrent(e.target.checked)}
              className="w-4 h-4 border-white/10 rounded accent-primary-500"
            />
            <span className="text-sm text-secondary-300">Currently working here</span>
          </label>
        </div>
      </div>

      <div>
        <label className={cosmic.label}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${cosmic.textarea} min-h-[100px]`}
          placeholder="Describe your responsibilities, achievements, projects..."
          rows={4}
        />
      </div>

      <div>
        <label className={cosmic.label}>Skills</label>
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className={cosmic.input}
          placeholder="e.g. React, TypeScript, Node.js (comma-separated)"
        />
        <p className="mt-1 text-xs text-secondary-400">Enter skills separated by commas</p>
      </div>

      <div>
        <label className={cosmic.label}>Sort Order</label>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
          className={cosmic.input}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
        <button type="button" onClick={onCancel} className={cosmic.buttonSecondary}>
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className={`${cosmic.buttonPrimary} flex items-center gap-2`}
        >
          {isSaving && (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default CVExperienceForm;
