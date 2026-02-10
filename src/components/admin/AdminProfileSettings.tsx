import React, { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { cosmic } from './ui/cosmicClassNames';

const AdminProfileSettings: React.FC = () => {
  const { photoUrl, updateProfilePhoto } = useProfile();
  const [newPhotoUrl, setNewPhotoUrl] = useState(photoUrl);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfilePhoto(newPhotoUrl);
    setSuccessMessage('Profile photo updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
  };

  return (
    <div className={cosmic.containerSm}>
      <h1 className={`${cosmic.pageTitle} text-center mb-6`}>Profile Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="photoUrl" className={cosmic.label}>
            About Me Photo URL
          </label>
          <input
            type="url"
            id="photoUrl"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
            className={cosmic.input}
            required
          />
        </div>

        <div>
          <p className={cosmic.label}>Current Photo Preview:</p>
          <img
            src={photoUrl}
            alt="Current profile"
            className="h-32 w-32 rounded-full object-cover shadow-md"
          />
        </div>

        <div className="text-right">
          <button type="submit" className={cosmic.buttonPrimary}>
            Save Changes
          </button>
        </div>
        {successMessage && (
          <p className="text-success-300 text-sm text-center mt-4 transition-opacity duration-300">
            {successMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default AdminProfileSettings;
