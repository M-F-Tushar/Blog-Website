// FIX: Replaced BrowserRouter with HashRouter to solve persistent routing issues in the preview environment.
import React, { Suspense, lazy, useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import ScrollToTop from './components/common/ScrollToTop';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { SiteSettingsProvider } from './hooks/useSiteSettings';
import { PostsProvider } from './hooks/usePosts';
import { ThemeProvider } from './hooks/useTheme';
import { ProfileProvider } from './hooks/useProfile';
import { RecommendationsProvider } from './hooks/useRecommendations';
import { AuthProvider } from './hooks/useAuth';
import { BookmarksProvider } from './context/BookmarksContext';
import { ToastProvider } from './context/ToastContext';
import { CommandPaletteProvider } from './context/CommandPaletteContext';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/ui/Toast';
import CommandPalette from './components/common/CommandPalette';
import KeyboardShortcutsHelp from './components/common/KeyboardShortcutsHelp';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTheme } from './hooks/useTheme';
import SkipLinks from './components/common/SkipLinks';
import OfflineIndicator from './components/common/OfflineIndicator';
import HealthCheck from './components/common/HealthCheck';
import ConfigStatus from './components/common/ConfigStatus';

// Lazy load components with prefetch routes
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Blog = lazy(() => import('./components/Blog'));
const BlogPost = lazy(() => import('./components/BlogPost'));
const Recommendations = lazy(() => import('./components/Recommendations'));
const Contact = lazy(() => import('./components/Contact'));
const Search = lazy(() => import('./components/Search'));
const ReadingList = lazy(() => import('./components/ReadingList'));
const Tags = lazy(() => import('./components/Tags'));
const TagPage = lazy(() => import('./components/TagPage'));
const NotFound = lazy(() => import('./components/NotFound'));

// Route prefetching map
export const prefetchRoutes = {
  '/': () => import('./components/Home'),
  '/blog': () => import('./components/Blog'),
  '/about': () => import('./components/About'),
  '/recommendations': () => import('./components/Recommendations'),
  '/contact': () => import('./components/Contact'),
  '/search': () => import('./components/Search'),
  '/bookmarks': () => import('./components/ReadingList'),
  '/tags': () => import('./components/Tags'),
};

// Admin components
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminRootLayout = lazy(() => import('./components/admin/AdminRootLayout'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const CreatePost = lazy(() => import('./components/CreatePost'));
const AdminRecommendationsDashboard = lazy(
  () => import('./components/admin/AdminRecommendationsDashboard')
);
const RecommendationForm = lazy(() => import('./components/admin/RecommendationForm'));
const AdminSiteSettings = lazy(() => import('./components/admin/AdminSiteSettings'));
const AdminProfileSettings = lazy(() => import('./components/admin/AdminProfileSettings'));
const DataMigration = lazy(() => import('./components/admin/DataMigration'));

// Toast Container Wrapper to consume context
const ToastContainerWrapper: React.FC = () => {
  const { toasts, dismissToast } = useToast();
  return <ToastContainer toasts={toasts} onDismiss={dismissToast} />;
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const { toggleTheme } = useTheme();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);
  const [isHealthCheckOpen, setIsHealthCheckOpen] = useState(() => {
    // Show health check if ?debug=true or in development
    const isDev = import.meta.env.DEV;
    const hasDebugParam = new URLSearchParams(window.location.search).get('debug') === 'true';
    return isDev || hasDebugParam;
  });
  // Reduced motion preference is respected via CSS media queries
  // const prefersReducedMotion = useReducedMotion();

  // Global keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      metaKey: true,
      action: () => setIsCommandPaletteOpen(true),
      description: 'Open command palette',
      category: 'navigation',
    },
    {
      key: 'k',
      ctrlKey: true,
      action: () => setIsCommandPaletteOpen(true),
      description: 'Open command palette',
      category: 'navigation',
    },
    {
      key: '/',
      metaKey: true,
      action: () => setIsShortcutsHelpOpen(true),
      description: 'Show keyboard shortcuts',
      category: 'help',
    },
    {
      key: '/',
      ctrlKey: true,
      action: () => setIsShortcutsHelpOpen(true),
      description: 'Show keyboard shortcuts',
      category: 'help',
    },
    {
      key: 't',
      action: () => toggleTheme(),
      description: 'Toggle theme',
      category: 'action',
    },
    {
      key: 'h',
      shiftKey: true,
      action: () => setIsHealthCheckOpen(!isHealthCheckOpen),
      description: 'Toggle health check',
      category: 'debug',
    },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <OfflineIndicator />
      <SkipLinks />
      <Header />
      <main id="main-content" className="flex-grow pt-20 md:pt-24">
        <AnimatePresence mode="wait">
          <Suspense
            fallback={
              <div className="flex justify-center items-center min-h-[50vh]">
                <LoadingSpinner />
              </div>
            }
          >
            <Routes location={location} key={location.pathname}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:postId" element={<BlogPost />} />
              <Route path="recommendations" element={<Recommendations />} />
              <Route path="contact" element={<Contact />} />
              <Route path="search" element={<Search />} />
              <Route path="bookmarks" element={<ReadingList />} />
              <Route path="tags" element={<Tags />} />
              <Route path="tags/:tagName" element={<TagPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      <Footer id="footer" />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={isShortcutsHelpOpen}
        onClose={() => setIsShortcutsHelpOpen(false)}
      />

      {/* Health Check - Development/Debug Mode */}
      <HealthCheck isOpen={isHealthCheckOpen} onClose={() => setIsHealthCheckOpen(false)} />

      {/* Configuration Status - Development/Debug Mode */}
      <ConfigStatus />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <CommandPaletteProvider>
              <SiteSettingsProvider>
                <PostsProvider>
                  <ProfileProvider>
                    <RecommendationsProvider>
                      <BookmarksProvider>
                        <HashRouter>
                          <Routes>
                            <Route path="/*" element={<MainLayout />} />
                            <Route
                              path="/admin/login"
                              element={
                                <Suspense
                                  fallback={
                                    <div className="flex justify-center items-center min-h-screen">
                                      <LoadingSpinner />
                                    </div>
                                  }
                                >
                                  <AdminLogin />
                                </Suspense>
                              }
                            />
                            <Route
                              path="/admin"
                              element={
                                <Suspense
                                  fallback={
                                    <div className="flex justify-center items-center min-h-screen">
                                      <LoadingSpinner />
                                    </div>
                                  }
                                >
                                  <AdminLayout />
                                </Suspense>
                              }
                            >
                              <Route element={<AdminRootLayout />}>
                                <Route path="dashboard" element={<AdminDashboard />} />
                                <Route path="posts/create" element={<CreatePost />} />
                                <Route path="posts/edit/:postId" element={<CreatePost />} />
                                <Route
                                  path="recommendations"
                                  element={<AdminRecommendationsDashboard />}
                                />
                                <Route
                                  path="recommendations/create"
                                  element={<RecommendationForm />}
                                />
                                <Route
                                  path="recommendations/edit/:recId"
                                  element={<RecommendationForm />}
                                />
                                <Route path="settings/site" element={<AdminSiteSettings />} />
                                <Route path="settings/profile" element={<AdminProfileSettings />} />
                                <Route path="migrate" element={<DataMigration />} />
                              </Route>
                            </Route>
                          </Routes>
                          <ScrollToTop />
                        </HashRouter>
                        <ToastContainerWrapper />
                      </BookmarksProvider>
                    </RecommendationsProvider>
                  </ProfileProvider>
                </PostsProvider>
              </SiteSettingsProvider>
            </CommandPaletteProvider>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
