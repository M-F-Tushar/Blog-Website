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

  return {
    supabase: {
      url: env.VITE_SUPABASE_URL || null,
      anonKey: env.VITE_SUPABASE_ANON_KEY || null,
      isConfigured: Boolean(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY),
    },
    contact: {
      formspreeEndpoint: env.VITE_FORMSPREE_ENDPOINT || null,
      fallbackEmail: env.VITE_CONTACT_EMAIL || null,
    },
    tracking: {
      analyticsEndpoint: env.VITE_ANALYTICS_ENDPOINT || null,
      errorTrackingEnabled: env.VITE_ERROR_TRACKING_ENABLED === 'true',
    },
    deployment: {
      baseUrl: env.BASE_URL || '/',
      isGitHubPages: Boolean(process.env.GITHUB_ACTIONS),
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
        'To enable full features, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
    );
  }

  // Check contact form configuration
  if (!config.contact.formspreeEndpoint && !config.contact.fallbackEmail) {
    warnings.push(
      'Contact form is not fully configured. Set VITE_FORMSPREE_ENDPOINT for real email submission, ' +
        'or VITE_CONTACT_EMAIL for mailto fallback.'
    );
  }

  // Check error tracking configuration
  if (config.tracking.errorTrackingEnabled && !config.tracking.analyticsEndpoint) {
    warnings.push(
      'Error tracking is enabled but no VITE_ANALYTICS_ENDPOINT is configured. ' +
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
    console.log(
      'Contact Form:',
      config.contact.formspreeEndpoint ? '✅ Formspree configured' : '⚠️ Using mailto fallback'
    );
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
