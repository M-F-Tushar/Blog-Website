import React, { useState, useEffect } from 'react';
import { Education } from '../../hooks/useCVData';
import { cosmic } from './ui/cosmicClassNames';

interface Props {
  education?: Education;
  onSave: (data: Omit<Education, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

const CVEducationForm: React.FC<Props> = ({ education, onSave, onCancel }) => {
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [current, setCurrent] = useState(false);
  const [description, setDescription] = useState('');
  const [gpa, setGpa] = useState('');
  const [location, setLocation] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (education) {
      setInstitution(education.institution);
      setDegree(education.degree);
      setFieldOfStudy(education.field_of_study);
      setStartDate(education.start_date);
      setEndDate(education.end_date || '');
      setCurrent(education.current);
      setDescription(education.description || '');
      setGpa(education.gpa || '');
      setLocation(education.location || '');
      setSortOrder(education.sort_order);
    }
  }, [education]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution || !degree || !fieldOfStudy || !startDate) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      setIsSaving(true);
      await onSave({
        institution,
        degree,
        field_of_study: fieldOfStudy,
        start_date: startDate,
        end_date: current ? undefined : endDate || undefined,
        current,
        description: description || undefined,
        gpa: gpa || undefined,
        location: location || undefined,
        sort_order: sortOrder,
      });
    } catch (err) {
      console.error('Error saving education:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className={cosmic.subTitle}>{education ? 'Edit Education' : 'Add Education'}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={cosmic.label}>
            Institution <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className={cosmic.input}
            placeholder="e.g. MIT"
            required
          />
        </div>

        <div>
          <label className={cosmic.label}>
            Degree <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className={cosmic.input}
            placeholder="e.g. Bachelor of Science"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={cosmic.label}>
            Field of Study <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={fieldOfStudy}
            onChange={(e) => setFieldOfStudy(e.target.value)}
            className={cosmic.input}
            placeholder="e.g. Computer Science"
            required
          />
        </div>

        <div>
          <label className={cosmic.label}>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={cosmic.input}
            placeholder="e.g. Cambridge, MA"
          />
        </div>
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
            <span className="text-sm text-secondary-300">Currently studying here</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={cosmic.label}>GPA</label>
          <input
            type="text"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            className={cosmic.input}
            placeholder="e.g. 3.8/4.0"
          />
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
      </div>

      <div>
        <label className={cosmic.label}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${cosmic.textarea} min-h-[100px]`}
          placeholder="Describe your studies, achievements, activities..."
          rows={4}
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

export default CVEducationForm;
