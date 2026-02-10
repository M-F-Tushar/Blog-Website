import React, { useState, useEffect } from 'react';
import { Education } from '../../hooks/useCVData';

interface Props {
  education?: Education;
  onSave: (data: Omit<Education, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

const inputClasses =
  'w-full px-3 py-2 text-gray-700 dark:text-secondary-200 bg-white dark:bg-elevated border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200';
const labelClasses = 'block text-sm font-medium text-gray-700 dark:text-secondary-300 mb-1';

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
      <h3 className="text-lg font-semibold text-gray-900 dark:text-secondary-50">
        {education ? 'Edit Education' : 'Add Education'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>
            Institution <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className={inputClasses}
            placeholder="e.g. MIT"
            required
          />
        </div>

        <div>
          <label className={labelClasses}>
            Degree <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className={inputClasses}
            placeholder="e.g. Bachelor of Science"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>
            Field of Study <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={fieldOfStudy}
            onChange={(e) => setFieldOfStudy(e.target.value)}
            className={inputClasses}
            placeholder="e.g. Computer Science"
            required
          />
        </div>

        <div>
          <label className={labelClasses}>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputClasses}
            placeholder="e.g. Cambridge, MA"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClasses}>
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label className={labelClasses}>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputClasses}
            disabled={current}
          />
        </div>

        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={current}
              onChange={(e) => setCurrent(e.target.checked)}
              className="w-4 h-4 text-accent border-gray-300 dark:border-white/10 rounded focus:ring-accent"
            />
            <span className="text-sm text-gray-700 dark:text-secondary-300">
              Currently studying here
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>GPA</label>
          <input
            type="text"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            className={inputClasses}
            placeholder="e.g. 3.8/4.0"
          />
        </div>

        <div>
          <label className={labelClasses}>Sort Order</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClasses} min-h-[100px]`}
          placeholder="Describe your studies, achievements, activities..."
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/[0.06]">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-secondary-300 bg-white dark:bg-elevated border border-gray-300 dark:border-white/10 rounded-md hover:bg-gray-50 dark:hover:bg-elevated transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
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
