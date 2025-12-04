import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { logConfigurationStatus } from './config/environment';

// eslint-disable-next-line no-console
console.log('Loading app...');

// Log environment configuration in development
logConfigurationStatus();

// Simple error boundary
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
          <h1 style={{ color: 'red' }}>Something went wrong!</h1>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {this.state.error?.toString()}
          </pre>
          <p>Check the console for more details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Try to import and render App
import('./App')
  .then((module) => {
    const App = module.default;
    // eslint-disable-next-line no-console
    console.log('App loaded:', App);

    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    // eslint-disable-next-line no-console
    console.log('App rendered');
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to load App:', error);
    root.render(
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h1 style={{ color: 'red' }}>Failed to load App component!</h1>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
          {error.toString()}
        </pre>
      </div>
    );
  });
