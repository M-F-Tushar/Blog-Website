import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

// Providers (existing hooks/contexts)
import { AuthProvider } from '@/hooks/useAuth';
import { SiteSettingsProvider } from '@/hooks/useSiteSettings';
import { PostsProvider } from '@/hooks/usePosts';
import { ProfileProvider } from '@/hooks/useProfile';
import { RecommendationsProvider } from '@/hooks/useRecommendations';
import { ToastProvider } from '@/context/ToastContext';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { ProjectsProvider } from '@/hooks/useProjects';
import { PublicationsProvider } from '@/hooks/usePublications';
import { CVDataProvider } from '@/hooks/useCVData';
import { PageContentProvider } from '@/hooks/usePageContent';

// Lazy-loaded admin components (existing)
const AdminLogin = lazy(() => import('@/components/admin/AdminLogin'));
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout'));
const AdminRootLayout = lazy(() => import('@/components/admin/AdminRootLayout'));
const AdminDashboard = lazy(() => import('@/components/admin/AdminDashboard'));
const CreatePost = lazy(() => import('@/components/CreatePost'));
const AdminRecommendationsDashboard = lazy(
  () => import('@/components/admin/AdminRecommendationsDashboard')
);
const RecommendationForm = lazy(() => import('@/components/admin/RecommendationForm'));
const AdminSiteSettings = lazy(() => import('@/components/admin/AdminSiteSettings'));
const AdminProfileSettings = lazy(() => import('@/components/admin/AdminProfileSettings'));
const DataMigration = lazy(() => import('@/components/admin/DataMigration'));
const AdminProjects = lazy(() => import('@/components/admin/AdminProjects'));
const ProjectForm = lazy(() => import('@/components/admin/ProjectForm'));
const AdminPublications = lazy(() => import('@/components/admin/AdminPublications'));
const PublicationForm = lazy(() => import('@/components/admin/PublicationForm'));
const AdminCV = lazy(() => import('@/components/admin/AdminCV'));
const AdminPageContent = lazy(() => import('@/components/admin/AdminPageContent'));

const LoadingFallback: React.FC = () => (
  <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading admin...</p>
    </div>
  </div>
);

const ToastContainerWrapper: React.FC = () => {
  const { toasts, dismissToast } = useToast();
  return <ToastContainer toasts={toasts} onDismiss={dismissToast} />;
};

const AdminApp: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <SiteSettingsProvider>
          <PostsProvider>
            <ProfileProvider>
              <RecommendationsProvider>
                <ProjectsProvider>
                  <PublicationsProvider>
                    <CVDataProvider>
                      <PageContentProvider>
                        <HashRouter>
                          <Suspense fallback={<LoadingFallback />}>
                            <Routes>
                              <Route path="/login" element={<AdminLogin />} />
                              <Route path="/" element={<AdminLayout />}>
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
                                  <Route path="projects" element={<AdminProjects />} />
                                  <Route path="projects/create" element={<ProjectForm />} />
                                  <Route
                                    path="projects/edit/:projectId"
                                    element={<ProjectForm />}
                                  />
                                  <Route path="publications" element={<AdminPublications />} />
                                  <Route path="publications/create" element={<PublicationForm />} />
                                  <Route
                                    path="publications/edit/:pubId"
                                    element={<PublicationForm />}
                                  />
                                  <Route path="cv" element={<AdminCV />} />
                                  <Route path="pages" element={<AdminPageContent />} />
                                  <Route path="settings/site" element={<AdminSiteSettings />} />
                                  <Route
                                    path="settings/profile"
                                    element={<AdminProfileSettings />}
                                  />
                                  <Route path="migrate" element={<DataMigration />} />
                                  {/* Default redirect */}
                                  <Route index element={<AdminDashboard />} />
                                </Route>
                              </Route>
                            </Routes>
                          </Suspense>
                        </HashRouter>
                        <ToastContainerWrapper />
                      </PageContentProvider>
                    </CVDataProvider>
                  </PublicationsProvider>
                </ProjectsProvider>
              </RecommendationsProvider>
            </ProfileProvider>
          </PostsProvider>
        </SiteSettingsProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default AdminApp;
