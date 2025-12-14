/**
 * Required environment variables for the application
 */
const requiredEnvVars = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
} as const;

/**
 * Optional environment variables (won't cause app to fail)
 */
const optionalEnvVars = {
  VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
} as const;

/**
 * Validate that all required environment variables are present
 * Now shows warnings instead of throwing errors to allow development without Supabase
 */
export const validateEnv = (): void => {
  const missing: string[] = [];

  // Check required variables
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value || value === 'undefined') {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    const warningMessage = `
      ⚠️ Missing required environment variables:
      ${missing.map((key) => `  - ${key}`).join('\n')}
      
      The app will run in development mode, but Supabase features will not work.
      Please create a .env file in the root directory with these variables.
      See .env.example for reference.
    `;

    console.warn(warningMessage); // eslint-disable-line no-console
    // Don't throw error - allow app to run without Supabase in development
    return;
  }

  // Warn about missing optional variables
  const missingOptional: string[] = [];
  Object.entries(optionalEnvVars).forEach(([key, value]) => {
    if (!value || value === 'undefined') {
      missingOptional.push(key);
    }
  });

  if (missingOptional.length > 0) {
    console.warn(
      // eslint-disable-line no-console
      '⚠️ Optional environment variables not set:',
      missingOptional.join(', ')
    );
  }

  console.log('✅ Environment variables validated successfully'); // eslint-disable-line no-console
};

/**
 * Get a validated environment variable
 * @param key - The environment variable key
 * @returns The environment variable value
 * @throws Error if the variable is not set
 */
export const getEnvVar = (key: keyof typeof requiredEnvVars): string => {
  const value = requiredEnvVars[key];
  if (!value || value === 'undefined') {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};
