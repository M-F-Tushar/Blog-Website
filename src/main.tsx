import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../index.css';
import { ThemeProvider } from './hooks/useTheme';
import { PostsProvider } from './hooks/usePosts';
import { RecommendationsProvider } from './hooks/useRecommendations';
import { AuthProvider } from './hooks/useAuth';
import { ProfileProvider } from './hooks/useProfile';
import { SiteSettingsProvider } from './hooks/useSiteSettings';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SiteSettingsProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProfileProvider>
            <PostsProvider>
              <RecommendationsProvider>
                <App />
              </RecommendationsProvider>
            </PostsProvider>
          </ProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </SiteSettingsProvider>
  </React.StrictMode>
);
