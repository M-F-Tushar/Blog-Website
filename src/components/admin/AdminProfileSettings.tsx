import React, { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';

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
  
  const inputClasses = "w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold font-serif text-center mb-6 text-gray-900 dark:text-white">
        Profile Settings
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="photoUrl" className={labelClasses}>About Me Photo URL</label>
          <input 
            type="url"
            id="photoUrl"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
            className={inputClasses}
            required
          />
        </div>
        
        <div>
          <p className={labelClasses}>Current Photo Preview:</p>
          <img 
            src={photoUrl} 
            alt="Current profile" 
            className="h-32 w-32 rounded-full object-cover shadow-md"
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-accent text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-offset-dark-gray transition-colors"
          >
            Save Changes
          </button>
        </div>
        {successMessage && (
            <p className="text-green-600 dark:text-green-400 text-sm text-center mt-4 transition-opacity duration-300">
                {successMessage}
            </p>
        )}
      </form>
    </div>
  );
};

export default AdminProfileSettings;
