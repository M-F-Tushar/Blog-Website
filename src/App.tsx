// FIX: Replaced BrowserRouter with HashRouter to solve persistent routing issues in the preview environment.
import React, { Suspense, lazy } from 'react';
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
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/ui/Toast';

// Lazy load components
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
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
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
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
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
