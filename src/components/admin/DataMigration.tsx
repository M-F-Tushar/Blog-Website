import React, { useState, useEffect } from 'react';
import {
  migrateDataToSupabase,
  getMigrationStatus,
  MigrationProgress,
} from '../../utils/migrateToSupabase';
import { isSupabaseConfigured } from '../../services/supabase';
import { cosmic } from './ui/cosmicClassNames';

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

  const supabaseConfigured = isSupabaseConfigured();

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

    if (supabaseConfigured) {
      checkStatus();
    }
  }, [supabaseConfigured]);

  const handleMigrate = async () => {
    setIsMigrating(true);

    try {
      await migrateDataToSupabase((progress) => {
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

  if (!supabaseConfigured) {
    return (
      <div className={cosmic.containerSm}>
        <h1 className={`${cosmic.pageTitle} text-center mb-8`}>Data Migration</h1>

        <div className={cosmic.alertWarning}>
          <p className="font-bold">Supabase Not Configured</p>
          <p className="mt-2">
            Supabase environment variables are not configured. Please set up Supabase configuration
            in your <code className="bg-elevated/80 px-2 py-1 rounded">.env</code> file before
            attempting to migrate data.
          </p>
          <p className="mt-2">Required environment variables:</p>
          <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
            <li>VITE_SUPABASE_URL</li>
            <li>VITE_SUPABASE_ANON_KEY</li>
          </ul>
          <p className="mt-4">
            See <code className="bg-elevated/80 px-2 py-1 rounded">SUPABASE_SETUP.md</code> for
            detailed setup instructions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cosmic.containerSm}>
      <h1 className={`${cosmic.pageTitle} text-center mb-8`}>Data Migration</h1>

      <div className="mb-8">
        <p className={`${cosmic.bodyText} mb-4`}>
          This tool will migrate your initial posts and recommendations from{' '}
          <code className="bg-elevated/80 px-2 py-1 rounded">constants.ts</code> to Supabase. This
          should only be done once during initial setup.
        </p>
      </div>

      {migrationStatus && (
        <div className={`mb-6 ${cosmic.alertInfo}`}>
          <h3 className="font-semibold text-info-200 mb-2">Current Status:</h3>
          <div className="text-info-300">
            <p>
              Posts in Supabase: <strong>{migrationStatus.postsCount}</strong>
            </p>
            <p>
              Recommendations in Supabase: <strong>{migrationStatus.recommendationsCount}</strong>
            </p>
            <p>
              Status:{' '}
              <strong>
                {migrationStatus.isComplete ? 'Data Already Migrated' : 'Ready to Migrate'}
              </strong>
            </p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={handleMigrate}
          disabled={isMigrating}
          className={`w-full ${
            isMigrating
              ? 'px-6 py-2.5 bg-elevated border border-white/10 text-secondary-500 rounded-lg cursor-not-allowed opacity-50'
              : cosmic.buttonPrimary
          }`}
        >
          {isMigrating ? 'Migrating...' : 'Migrate Data from constants.ts'}
        </button>
      </div>

      {/* Migration Progress */}
      <div className="space-y-4">
        <div
          className={`p-4 rounded-xl ${
            migrationProgress.status === 'error'
              ? cosmic.alertError
              : migrationProgress.status === 'success'
                ? cosmic.alertSuccess
                : migrationProgress.status === 'migrating'
                  ? cosmic.alertInfo
                  : `${cosmic.card}`
          }`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {migrationProgress.status === 'migrating' && (
                <svg
                  className="animate-spin h-5 w-5 text-primary-400"
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
                  className="h-5 w-5 text-success-400"
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
                  className="h-5 w-5 text-error-400"
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
                    ? 'text-error-300'
                    : migrationProgress.status === 'success'
                      ? 'text-success-300'
                      : migrationProgress.status === 'migrating'
                        ? 'text-info-300'
                        : 'text-secondary-200'
                }`}
              >
                {migrationProgress.message}
              </p>
              {migrationProgress.error && (
                <p className="mt-1 text-sm text-error-300">Error: {migrationProgress.error}</p>
              )}
              {migrationProgress.status === 'success' && (
                <div className="mt-2 text-sm text-success-300">
                  <p>Posts: {migrationProgress.postsCount || 0}</p>
                  <p>Recommendations: {migrationProgress.recommendationsCount || 0}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-8 ${cosmic.card}`}>
        <h3 className="font-semibold text-secondary-50 mb-2">Notes:</h3>
        <ul className={`list-disc list-inside space-y-2 text-sm ${cosmic.bodyText}`}>
          <li>Migration is safe to run multiple times - it will skip if data already exists</li>
          <li>Initial posts and recommendations will be marked as read-only</li>
          <li>After migration, all data will be managed through Supabase</li>
          <li>Make sure your Supabase database and storage are properly configured</li>
        </ul>
      </div>
    </div>
  );
};

export default DataMigration;
