import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { logConfigurationStatus } from './config/environment';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Log environment configuration in development
if (import.meta.env.DEV) {
  logConfigurationStatus();
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Dynamic import for code splitting
import('./App')
  .then(async (module) => {
    const App = module.default;
    const { HelmetProvider } = await import('react-helmet-async');
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error('Failed to load App:', error);
    root.render(
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h1 style={{ color: 'red' }}>Failed to load application</h1>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
          {error.toString()}
        </pre>
        <p>Please refresh the page or contact support if the problem persists.</p>
      </div>
    );
  });
