import React, { useState, useEffect } from 'react';
import { Certification } from '../../hooks/useCVData';

interface Props {
  certification?: Certification;
  onSave: (data: Omit<Certification, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

const inputClasses =
  'w-full px-3 py-2 text-gray-700 dark:text-secondary-200 bg-white dark:bg-elevated border border-gray-300 dark:border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200';
const labelClasses = 'block text-sm font-medium text-gray-700 dark:text-secondary-300 mb-1';

const CVCertificationForm: React.FC<Props> = ({ certification, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (certification) {
      setName(certification.name);
      setIssuer(certification.issuer);
      setIssueDate(certification.issue_date);
      setExpiryDate(certification.expiry_date || '');
      setCredentialId(certification.credential_id || '');
      setCredentialUrl(certification.credential_url || '');
      setDescription(certification.description || '');
      setSortOrder(certification.sort_order);
    }
  }, [certification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !issuer || !issueDate) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      setIsSaving(true);
      await onSave({
        name,
        issuer,
        issue_date: issueDate,
        expiry_date: expiryDate || undefined,
        credential_id: credentialId || undefined,
        credential_url: credentialUrl || undefined,
        description: description || undefined,
        sort_order: sortOrder,
      });
    } catch (err) {
      console.error('Error saving certification:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-secondary-50">
        {certification ? 'Edit Certification' : 'Add Certification'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>
            Certification Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClasses}
            placeholder="e.g. AWS Solutions Architect"
            required
          />
        </div>

        <div>
          <label className={labelClasses}>
            Issuer <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            className={inputClasses}
            placeholder="e.g. Amazon Web Services"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>
            Issue Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label className={labelClasses}>Expiry Date</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Credential ID</label>
          <input
            type="text"
            value={credentialId}
            onChange={(e) => setCredentialId(e.target.value)}
            className={inputClasses}
            placeholder="e.g. ABC123XYZ"
          />
        </div>

        <div>
          <label className={labelClasses}>Credential URL</label>
          <input
            type="url"
            value={credentialUrl}
            onChange={(e) => setCredentialUrl(e.target.value)}
            className={inputClasses}
            placeholder="e.g. https://verify.example.com/cert/123"
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClasses} min-h-[100px]`}
          placeholder="Describe what this certification covers..."
          rows={4}
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

export default CVCertificationForm;
