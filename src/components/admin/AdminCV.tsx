import React, { useState } from 'react';
import {
  useCVData,
  type Education,
  type Experience,
  type Certification,
} from '../../hooks/useCVData';
import CVEducationForm from './CVEducationForm';
import CVExperienceForm from './CVExperienceForm';
import CVCertificationForm from './CVCertificationForm';
import { cosmic } from './ui/cosmicClassNames';

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

  if (loading) {
    return (
      <div className={cosmic.container}>
        <div className="flex items-center justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-primary-400"
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
          <span className="ml-3 text-secondary-400">Loading CV data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cosmic.container}>
        <div className={cosmic.alertError}>
          <p>Error loading CV data: {error}</p>
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
          <h3 className={cosmic.subTitle}>Education ({education.length})</h3>
          <button onClick={() => setIsCreating(true)} className={cosmic.buttonPrimary}>
            + Add Education
          </button>
        </div>

        {education.length === 0 ? (
          <p className={cosmic.emptyState}>
            No education entries yet. Click &quot;Add Education&quot; to get started.
          </p>
        ) : (
          <div className={cosmic.tableWrapper}>
            <table className={cosmic.table}>
              <thead className={cosmic.tableHead}>
                <tr>
                  <th className={cosmic.tableHeadCell}>Institution</th>
                  <th className={cosmic.tableHeadCell}>Degree</th>
                  <th className={cosmic.tableHeadCell}>Field</th>
                  <th className={cosmic.tableHeadCell}>Period</th>
                  <th className={cosmic.tableHeadCell}>Order</th>
                  <th className={`${cosmic.tableHeadCell} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className={cosmic.tableBody}>
                {education
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((item) => (
                    <tr key={item.id} className={cosmic.tableRow}>
                      <td className={`${cosmic.tableCell} text-secondary-50 font-medium`}>
                        {item.institution}
                      </td>
                      <td className={cosmic.tableCell}>{item.degree}</td>
                      <td className={cosmic.tableCell}>{item.field_of_study}</td>
                      <td className={cosmic.tableCell}>
                        {item.start_date} - {item.current ? 'Present' : item.end_date || 'N/A'}
                      </td>
                      <td className={cosmic.tableCell}>{item.sort_order}</td>
                      <td className={`${cosmic.tableCell} text-right`}>
                        <button
                          onClick={() => setEditingId(item.id)}
                          className={`${cosmic.linkEdit} font-medium mr-3`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEducation(item.id)}
                          className={`${cosmic.linkDelete} font-medium`}
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
          <h3 className={cosmic.subTitle}>Experience ({experience.length})</h3>
          <button onClick={() => setIsCreating(true)} className={cosmic.buttonPrimary}>
            + Add Experience
          </button>
        </div>

        {experience.length === 0 ? (
          <p className={cosmic.emptyState}>
            No experience entries yet. Click &quot;Add Experience&quot; to get started.
          </p>
        ) : (
          <div className={cosmic.tableWrapper}>
            <table className={cosmic.table}>
              <thead className={cosmic.tableHead}>
                <tr>
                  <th className={cosmic.tableHeadCell}>Company</th>
                  <th className={cosmic.tableHeadCell}>Position</th>
                  <th className={cosmic.tableHeadCell}>Location</th>
                  <th className={cosmic.tableHeadCell}>Period</th>
                  <th className={cosmic.tableHeadCell}>Skills</th>
                  <th className={cosmic.tableHeadCell}>Order</th>
                  <th className={`${cosmic.tableHeadCell} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className={cosmic.tableBody}>
                {experience
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((item) => (
                    <tr key={item.id} className={cosmic.tableRow}>
                      <td className={`${cosmic.tableCell} text-secondary-50 font-medium`}>
                        {item.company}
                      </td>
                      <td className={cosmic.tableCell}>{item.position}</td>
                      <td className={cosmic.tableCell}>{item.location || '-'}</td>
                      <td className={cosmic.tableCell}>
                        {item.start_date} - {item.current ? 'Present' : item.end_date || 'N/A'}
                      </td>
                      <td className={cosmic.tableCell}>
                        <div className="flex flex-wrap gap-1">
                          {item.skills.slice(0, 3).map((skill, i) => (
                            <span key={i} className={cosmic.tag}>
                              {skill}
                            </span>
                          ))}
                          {item.skills.length > 3 && (
                            <span className="inline-block px-2 py-0.5 text-xs text-secondary-400">
                              +{item.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={cosmic.tableCell}>{item.sort_order}</td>
                      <td className={`${cosmic.tableCell} text-right`}>
                        <button
                          onClick={() => setEditingId(item.id)}
                          className={`${cosmic.linkEdit} font-medium mr-3`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteExperience(item.id)}
                          className={`${cosmic.linkDelete} font-medium`}
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
          <h3 className={cosmic.subTitle}>Certifications ({certifications.length})</h3>
          <button onClick={() => setIsCreating(true)} className={cosmic.buttonPrimary}>
            + Add Certification
          </button>
        </div>

        {certifications.length === 0 ? (
          <p className={cosmic.emptyState}>
            No certifications yet. Click &quot;Add Certification&quot; to get started.
          </p>
        ) : (
          <div className={cosmic.tableWrapper}>
            <table className={cosmic.table}>
              <thead className={cosmic.tableHead}>
                <tr>
                  <th className={cosmic.tableHeadCell}>Name</th>
                  <th className={cosmic.tableHeadCell}>Issuer</th>
                  <th className={cosmic.tableHeadCell}>Issue Date</th>
                  <th className={cosmic.tableHeadCell}>Expiry Date</th>
                  <th className={cosmic.tableHeadCell}>Credential</th>
                  <th className={cosmic.tableHeadCell}>Order</th>
                  <th className={`${cosmic.tableHeadCell} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className={cosmic.tableBody}>
                {certifications
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((item) => (
                    <tr key={item.id} className={cosmic.tableRow}>
                      <td className={`${cosmic.tableCell} text-secondary-50 font-medium`}>
                        {item.name}
                      </td>
                      <td className={cosmic.tableCell}>{item.issuer}</td>
                      <td className={cosmic.tableCell}>{item.issue_date}</td>
                      <td className={cosmic.tableCell}>{item.expiry_date || '-'}</td>
                      <td className={cosmic.tableCell}>
                        {item.credential_url ? (
                          <a
                            href={item.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${cosmic.linkEdit} underline`}
                          >
                            {item.credential_id || 'View'}
                          </a>
                        ) : (
                          item.credential_id || '-'
                        )}
                      </td>
                      <td className={cosmic.tableCell}>{item.sort_order}</td>
                      <td className={`${cosmic.tableCell} text-right`}>
                        <button
                          onClick={() => setEditingId(item.id)}
                          className={`${cosmic.linkEdit} font-medium mr-3`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCertification(item.id)}
                          className={`${cosmic.linkDelete} font-medium`}
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
    <div className={cosmic.container}>
      <h2 className={`${cosmic.sectionTitle} mb-6`}>CV Management</h2>

      <div className="border-b border-white/[0.06] mb-6">
        <nav className="flex gap-2 -mb-px">
          <button
            onClick={() => {
              setActiveTab('education');
              resetFormState();
            }}
            className={activeTab === 'education' ? cosmic.tabActive : cosmic.tabInactive}
          >
            Education
          </button>
          <button
            onClick={() => {
              setActiveTab('experience');
              resetFormState();
            }}
            className={activeTab === 'experience' ? cosmic.tabActive : cosmic.tabInactive}
          >
            Experience
          </button>
          <button
            onClick={() => {
              setActiveTab('certifications');
              resetFormState();
            }}
            className={activeTab === 'certifications' ? cosmic.tabActive : cosmic.tabInactive}
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
