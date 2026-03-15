/**
 * Centralized environment configuration
 * Provides runtime checks and validation for environment variables
 */

export interface EnvironmentConfig {
  // Supabase Configuration
  supabase: {
    url: string | null;
    anonKey: string | null;
    isConfigured: boolean;
  };

  // Contact Form Configuration
  contact: {
    useSupabase: boolean;
    formspreeEndpoint: string | null;
    fallbackEmail: string | null;
  };

  // Analytics & Error Tracking
  tracking: {
    analyticsEndpoint: string | null;
    errorTrackingEnabled: boolean;
  };

  // Deployment Configuration
  deployment: {
    baseUrl: string;
    isGitHubPages: boolean;
    isDevelopment: boolean;
    isProduction: boolean;
  };
}

/**
 * Get the current environment configuration
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = import.meta.env;
  const supabaseUrl = env.PUBLIC_SUPABASE_URL || env.VITE_SUPABASE_URL || null;
  const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || null;
  const formspreeEndpoint = env.PUBLIC_FORMSPREE_ENDPOINT || env.VITE_FORMSPREE_ENDPOINT || null;
  const fallbackEmail = env.PUBLIC_CONTACT_EMAIL || env.VITE_CONTACT_EMAIL || null;
  const analyticsEndpoint = env.PUBLIC_ANALYTICS_ENDPOINT || env.VITE_ANALYTICS_ENDPOINT || null;
  const errorTrackingEnabled =
    (env.PUBLIC_ERROR_TRACKING_ENABLED || env.VITE_ERROR_TRACKING_ENABLED) === 'true';
  const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

  return {
    supabase: {
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
      isConfigured: isSupabaseConfigured,
    },
    contact: {
      useSupabase: isSupabaseConfigured,
      formspreeEndpoint,
      fallbackEmail,
    },
    tracking: {
      analyticsEndpoint,
      errorTrackingEnabled,
    },
    deployment: {
      baseUrl: env.BASE_URL || '/',
      // Detect GitHub Pages by checking if base URL contains github.io or if GITHUB_ACTIONS was set during build
      isGitHubPages:
        env.BASE_URL?.includes('github.io') || env.BASE_URL?.includes('/Blog-Website/') || false,
      isDevelopment: env.DEV === true,
      isProduction: env.PROD === true,
    },
  };
};

/**
 * Check if the application is properly configured
 * Returns warnings for missing optional configurations
 */
export const checkConfiguration = (): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} => {
  const config = getEnvironmentConfig();
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check Supabase configuration
  if (!config.supabase.isConfigured) {
    warnings.push(
      'Supabase is not configured. The application will run in demo mode with fallback data. ' +
        'To enable full features, set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY environment variables.'
    );
  }

  // Check contact form configuration
  // Valid if: Supabase is configured OR Formspree is configured OR Fallback email is set
  if (
    !config.contact.useSupabase &&
    !config.contact.formspreeEndpoint &&
    !config.contact.fallbackEmail
  ) {
    warnings.push(
      'Contact form is not fully configured. Configure Supabase, set PUBLIC_FORMSPREE_ENDPOINT, ' +
        'or PUBLIC_CONTACT_EMAIL for mailto fallback.'
    );
  }

  // Check error tracking configuration
  if (config.tracking.errorTrackingEnabled && !config.tracking.analyticsEndpoint) {
    warnings.push(
      'Error tracking is enabled but no PUBLIC_ANALYTICS_ENDPOINT is configured. ' +
        'Errors will only be logged to console.'
    );
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
};

/**
 * Log configuration status to console in development
 */
export const logConfigurationStatus = (): void => {
  if (import.meta.env.DEV) {
    const config = getEnvironmentConfig();
    const check = checkConfiguration();

    /* eslint-disable no-console */
    console.group('🔧 Environment Configuration');
    console.log('Environment:', config.deployment.isDevelopment ? 'Development' : 'Production');
    console.log('Base URL:', config.deployment.baseUrl);
    console.log(
      'Supabase:',
      config.supabase.isConfigured ? '✅ Configured' : '⚠️ Not configured (using fallback data)'
    );

    let contactStatus = '⚠️ Not configured';
    if (config.contact.useSupabase) contactStatus = '✅ Database (Supabase)';
    else if (config.contact.formspreeEndpoint) contactStatus = '✅ Formspree';
    else if (config.contact.fallbackEmail) contactStatus = '⚠️ Mailto Fallback';

    console.log('Contact Form:', contactStatus);
    console.log(
      'Error Tracking:',
      config.tracking.errorTrackingEnabled ? '✅ Enabled' : '❌ Disabled'
    );

    if (check.warnings.length > 0) {
      console.warn('Warnings:');
      check.warnings.forEach((warning) => console.warn(`  - ${warning}`));
    }

    if (check.errors.length > 0) {
      console.error('Errors:');
      check.errors.forEach((error) => console.error(`  - ${error}`));
    }

    console.groupEnd();
    /* eslint-enable no-console */
  }
};

// Export singleton instance
export const envConfig = getEnvironmentConfig();
