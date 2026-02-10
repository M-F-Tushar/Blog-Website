import React, { useState } from 'react';
import { useCVData, Education, Experience, Certification } from '../../hooks/useCVData';
import CVEducationForm from './CVEducationForm';
import CVExperienceForm from './CVExperienceForm';
import CVCertificationForm from './CVCertificationForm';

type Tab = 'education' | 'experience' | 'certifications';

const AdminCV: React.FC = () => {
  const {
    education,
    experience,
    certifications,
    addEducation,
    updateEducation,
    deleteEducation,
    addExperience,
    updateExperience,
    deleteExperience,
    addCertification,
    updateCertification,
    deleteCertification,
    loading,
    error,
  } = useCVData();

  const [activeTab, setActiveTab] = useState<Tab>('education');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const resetFormState = () => {
    setEditingId(null);
    setIsCreating(false);
  };

  const handleDeleteEducation = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      await deleteEducation(id);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this experience entry?')) {
      await deleteExperience(id);
    }
  };

  const handleDeleteCertification = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this certification entry?')) {
      await deleteCertification(id);
    }
  };

  const tabClasses = (tab: Tab) =>
    `px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer ${
      activeTab === tab
        ? 'border-accent text-accent'
        : 'border-transparent text-gray-500 dark:text-secondary-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
    }`;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto bg-white dark:bg-surface rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-accent"
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
          <span className="ml-3 text-gray-600 dark:text-secondary-400">Loading CV data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto bg-white dark:bg-surface rounded-lg shadow-lg p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-red-700 dark:text-red-400">Error loading CV data: {error}</p>
        </div>
      </div>
    );
  }

  const renderEducationTab = () => {
    if (isCreating) {
      return (
        <CVEducationForm
          onSave={async (data) => {
            await addEducation(data);
            resetFormState();
          }}
          onCancel={resetFormState}
        />
      );
    }

    if (editingId) {
      const item = education.find((e) => e.id === editingId);
      if (item) {
        return (
          <CVEducationForm
            education={item}
            onSave={async (data) => {
              await updateEducation(editingId, data);
              resetFormState();
            }}
            onCancel={resetFormState}
          />
        );
      }
    }

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-secondary-50">
            Education ({education.length})
          </h3>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-md transition-colors duration-200"
          >
            + Add Education
          </button>
        </div>

        {education.length === 0 ? (
          <p className="text-gray-500 dark:text-secondary-400 text-center py-8">
            No education entries yet. Click &quot;Add Education&quot; to get started.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-secondary-400 uppercase bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3">Institution</th>
                  <th className="px-4 py-3">Degree</th>
                  <th className="px-4 py-3">Field</th>
                  <th className="px-4 py-3">Period</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {education
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-4 py-3 text-gray-900 dark:text-secondary-50 font-medium">
                        {item.institution}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-secondary-300">
                        {item.degree}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-secondary-300">
                        {item.field_of_study}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-secondary-300">
                        {item.start_date} - {item.current ? 'Present' : item.end_date || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-secondary-300">
                        {item.sort_order}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setEditingId(item.id)}
                          className="text-accent hover:text-accent/80 font-medium mr-3 transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEducation(item.id)}
                          className="text-red-600 hover:text-red-500 font-medium transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  };

  const renderExperienceTab = () => {
    if (isCreating) {
      return (
        <CVExperienceForm
          onSave={async (data) => {
            await addExperience(data);
            resetFormState();
          }}
          onCancel={resetFormState}
        />
      );
    }

    if (editingId) {
      const item = experience.find((e) => e.id === editingId);
      if (item) {
        return (
          <CVExperienceForm
            experience={item}
            onSave={async (data) => {
              await updateExperience(editingId, data);
              resetFormState();
            }}
            onCancel={resetFormState}
          />
        );
      }
    }

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-secondary-50">
            Experience ({experience.length})
          </h3>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-md transition-colors duration-200"
          >
            + Add Experience
          </button>
        </div>

        {experience.length === 0 ? (
          <p className="text-gray-500 dark:text-secondary-400 text-center py-8">
            No experience entries yet. Click &quot;Add Experience&quot; to get started.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-secondary-400 uppercase bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Position</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Period</th>
                  <th className="px-4 py-3">Skills</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {experience
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-4 py-3 text-gray-900 dark:text-secondary-50 font-medium">
                        {item.company}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-secondary-300">
                        {item.position}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-secondary-300">
                        {item.location || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-secondary-300">
                        {item.start_date} - {item.current ? 'Present' : item.end_date || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-secondary-300">
                        <div className="flex flex-wrap gap-1">
                          {item.skills.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="inline-block px-2 py-0.5 text-xs bg-accent/10 text-accent rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                          {item.skills.length > 3 && (
                            <span className="inline-block px-2 py-0.5 text-xs text-gray-500 dark:text-secondary-400">
                              +{item.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-secondary-300">
                        {item.sort_order}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setEditingId(item.id)}
                          className="text-accent hover:text-accent/80 font-medium mr-3 transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteExperience(item.id)}
                          className="text-red-600 hover:text-red-500 font-medium transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  };

  const renderCertificationsTab = () => {
    if (isCreating) {
      return (
        <CVCertificationForm
          onSave={async (data) => {
            await addCertification(data);
            resetFormState();
          }}
          onCancel={resetFormState}
        />
      );
    }

    if (editingId) {
      const item = certifications.find((c) => c.id === editingId);
      if (item) {
        return (
          <CVCertificationForm
            certification={item}
            onSave={async (data) => {
              await updateCertification(editingId, data);
              resetFormState();
            }}
            onCancel={resetFormState}
          />
        );
      }
    }

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-secondary-50">
            Certifications ({certifications.length})
          </h3>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-md transition-colors duration-200"
          >
            + Add Certification
          </button>
        </div>

        {certifications.length === 0 ? (
          <p className="text-gray-500 dark:text-secondary-400 text-center py-8">
            No certifications yet. Click &quot;Add Certification&quot; to get started.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-secondary-400 uppercase bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Issuer</th>
                  <th className="px-4 py-3">Issue Date</th>
                  <th className="px-4 py-3">Expiry Date</th>
                  <th className="px-4 py-3">Credential</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {certifications
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-4 py-3 text-gray-900 dark:text-secondary-50 font-medium">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-secondary-300">
                        {item.issuer}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-secondary-300">
                        {item.issue_date}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-secondary-300">
                        {item.expiry_date || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-secondary-300">
                        {item.credential_url ? (
                          <a
                            href={item.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-accent/80 underline transition-colors duration-200"
                          >
                            {item.credential_id || 'View'}
                          </a>
                        ) : (
                          item.credential_id || '-'
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-secondary-300">
                        {item.sort_order}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setEditingId(item.id)}
                          className="text-accent hover:text-accent/80 font-medium mr-3 transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCertification(item.id)}
                          className="text-red-600 hover:text-red-500 font-medium transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-surface rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-secondary-50 mb-6">
        CV Management
      </h2>

      <div className="border-b border-gray-200 dark:border-white/[0.06] mb-6">
        <nav className="flex gap-0 -mb-px">
          <button
            onClick={() => {
              setActiveTab('education');
              resetFormState();
            }}
            className={tabClasses('education')}
          >
            Education
          </button>
          <button
            onClick={() => {
              setActiveTab('experience');
              resetFormState();
            }}
            className={tabClasses('experience')}
          >
            Experience
          </button>
          <button
            onClick={() => {
              setActiveTab('certifications');
              resetFormState();
            }}
            className={tabClasses('certifications')}
          >
            Certifications
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'education' && renderEducationTab()}
        {activeTab === 'experience' && renderExperienceTab()}
        {activeTab === 'certifications' && renderCertificationsTab()}
      </div>
    </div>
  );
};

export default AdminCV;
