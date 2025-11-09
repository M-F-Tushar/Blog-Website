import React, { useState, useEffect } from 'react';
import { migrateDataToFirebase, getMigrationStatus, MigrationProgress } from '../../utils/migrateData';
import { isFirebaseConfigured } from '../../services/firebase';

const DataMigration: React.FC = () => {
  const [migrationProgress, setMigrationProgress] = useState<MigrationProgress>({
    status: 'idle',
    message: 'Ready to migrate data from constants.ts to Firebase',
  });
  const [migrationStatus, setMigrationStatus] = useState<{
    isComplete: boolean;
    postsCount: number;
    recommendationsCount: number;
  } | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);

  const firebaseConfigured = isFirebaseConfigured();

  useEffect(() => {
    // Check migration status on mount
    const checkStatus = async () => {
      try {
        const status = await getMigrationStatus();
        setMigrationStatus(status);
      } catch (error) {
        console.error('Error checking migration status:', error);
      }
    };

    if (firebaseConfigured) {
      checkStatus();
    }
  }, [firebaseConfigured]);

  const handleMigrate = async () => {
    setIsMigrating(true);
    
    try {
      await migrateDataToFirebase((progress) => {
        setMigrationProgress(progress);
      });

      // Update migration status after completion
      const status = await getMigrationStatus();
      setMigrationStatus(status);
    } catch (error) {
      console.error('Migration failed:', error);
    } finally {
      setIsMigrating(false);
    }
  };

  if (!firebaseConfigured) {
    return (
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold font-serif text-center mb-8 text-gray-900 dark:text-white">
          Data Migration
        </h1>
        
        <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4 mb-6">
          <p className="font-bold">Firebase Not Configured</p>
          <p className="mt-2">
            Firebase environment variables are not configured. Please set up Firebase configuration
            in your <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">.env</code> file
            before attempting to migrate data.
          </p>
          <p className="mt-2">
            Required environment variables:
          </p>
          <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
            <li>VITE_FIREBASE_API_KEY</li>
            <li>VITE_FIREBASE_AUTH_DOMAIN</li>
            <li>VITE_FIREBASE_PROJECT_ID</li>
            <li>VITE_FIREBASE_STORAGE_BUCKET</li>
            <li>VITE_FIREBASE_MESSAGING_SENDER_ID</li>
            <li>VITE_FIREBASE_APP_ID</li>
          </ul>
          <p className="mt-4">
            See <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">FIREBASE_SETUP.md</code> for
            detailed setup instructions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold font-serif text-center mb-8 text-gray-900 dark:text-white">
        Data Migration
      </h1>

      <div className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          This tool will migrate your initial posts and recommendations from <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">constants.ts</code> to
          Firebase Firestore. This should only be done once during initial setup.
        </p>
      </div>

      {migrationStatus && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Current Status:</h3>
          <div className="text-blue-800 dark:text-blue-200">
            <p>Posts in Firebase: <strong>{migrationStatus.postsCount}</strong></p>
            <p>Recommendations in Firebase: <strong>{migrationStatus.recommendationsCount}</strong></p>
            <p>
              Status: <strong>{migrationStatus.isComplete ? 'Data Already Migrated' : 'Ready to Migrate'}</strong>
            </p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={handleMigrate}
          disabled={isMigrating}
          className={`w-full px-6 py-3 font-semibold rounded-md transition-colors ${
            isMigrating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-accent text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent'
          }`}
        >
          {isMigrating ? 'Migrating...' : 'Migrate Data from constants.ts'}
        </button>
      </div>

      {/* Migration Progress */}
      <div className="space-y-4">
        <div
          className={`p-4 rounded-lg ${
            migrationProgress.status === 'error'
              ? 'bg-red-100 dark:bg-red-900 border-l-4 border-red-500'
              : migrationProgress.status === 'success'
              ? 'bg-green-100 dark:bg-green-900 border-l-4 border-green-500'
              : migrationProgress.status === 'migrating'
              ? 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500'
              : 'bg-gray-100 dark:bg-gray-700 border-l-4 border-gray-500'
          }`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {migrationProgress.status === 'migrating' && (
                <svg
                  className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {migrationProgress.status === 'success' && (
                <svg
                  className="h-5 w-5 text-green-600 dark:text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {migrationProgress.status === 'error' && (
                <svg
                  className="h-5 w-5 text-red-600 dark:text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3 flex-1">
              <p
                className={`text-sm font-medium ${
                  migrationProgress.status === 'error'
                    ? 'text-red-800 dark:text-red-200'
                    : migrationProgress.status === 'success'
                    ? 'text-green-800 dark:text-green-200'
                    : migrationProgress.status === 'migrating'
                    ? 'text-blue-800 dark:text-blue-200'
                    : 'text-gray-800 dark:text-gray-200'
                }`}
              >
                {migrationProgress.message}
              </p>
              {migrationProgress.error && (
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  Error: {migrationProgress.error}
                </p>
              )}
              {migrationProgress.status === 'success' && (
                <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                  <p>Posts: {migrationProgress.postsCount || 0}</p>
                  <p>Recommendations: {migrationProgress.recommendationsCount || 0}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Notes:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>Migration is safe to run multiple times - it will skip if data already exists</li>
          <li>Initial posts and recommendations will be marked as read-only</li>
          <li>After migration, all data will be managed through Firebase</li>
          <li>Make sure your Firebase Firestore and Storage are properly configured</li>
        </ul>
      </div>
    </div>
  );
};

export default DataMigration;
