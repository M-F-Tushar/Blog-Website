import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
import { CustomPagesProvider } from '@/hooks/useCustomPages';
import { PageSectionsProvider } from '@/hooks/usePageSections';
import { StoryProvider } from '@/hooks/useStory';
import { BookshelfProvider } from '@/hooks/useBookshelf';
import { NavigationItemsProvider } from '@/hooks/useNavigationItems';
import { ContactLinksProvider } from '@/hooks/useContactLinks';

// Lazy-loaded admin components
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
const AdminAppearanceSettings = lazy(() => import('@/components/admin/AdminAppearanceSettings'));
const AdminSEOSettings = lazy(() => import('@/components/admin/AdminSEOSettings'));
const AdminUITextSettings = lazy(() => import('@/components/admin/AdminUITextSettings'));
const AdminNavigationSettings = lazy(() => import('@/components/admin/AdminNavigationSettings'));
const AdminHomepageLayout = lazy(() => import('@/components/admin/AdminHomepageLayout'));
const DataMigration = lazy(() => import('@/components/admin/DataMigration'));
const AdminProjects = lazy(() => import('@/components/admin/AdminProjects'));
const ProjectForm = lazy(() => import('@/components/admin/ProjectForm'));
const AdminPublications = lazy(() => import('@/components/admin/AdminPublications'));
const PublicationForm = lazy(() => import('@/components/admin/PublicationForm'));
const AdminCV = lazy(() => import('@/components/admin/AdminCV'));
const AdminPageContent = lazy(() => import('@/components/admin/AdminPageContent'));
const AdminMediaLibrary = lazy(() => import('@/components/admin/AdminMediaLibrary'));
const AdminInbox = lazy(() => import('@/components/admin/AdminInbox'));
const AdminCustomPages = lazy(() => import('@/components/admin/AdminCustomPages'));
const AdminPages = lazy(() => import('@/components/admin/AdminPages'));
const AdminStory = lazy(() => import('@/components/admin/AdminStory'));
const AdminBookshelf = lazy(() => import('@/components/admin/AdminBookshelf'));
const AdminGarden = lazy(() => import('@/components/admin/AdminGarden'));
const BookshelfForm = lazy(() => import('@/components/admin/BookshelfForm'));
const AdminSiteConfiguration = lazy(() => import('@/components/admin/AdminSiteConfiguration'));
const AdminContactLinks = lazy(() => import('@/components/admin/AdminContactLinks'));
const AdminTopics = lazy(() => import('@/components/admin/AdminTopics'));

const LoadingFallback: React.FC = () => (
  <div className="flex justify-center items-center min-h-screen bg-void">
    <div className="flex flex-col items-center gap-4">
      <div
        className="h-12 w-12 animate-spin rounded-full border-2 border-primary-500/20 border-t-primary-400"
        style={{ boxShadow: '0 0 20px rgba(6,182,212,0.2)' }}
      />
      <p className="text-sm text-secondary-500">Loading admin...</p>
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
                        <CustomPagesProvider>
                          <PageSectionsProvider>
                            <StoryProvider>
                              <BookshelfProvider>
                                <NavigationItemsProvider>
                                  <ContactLinksProvider>
                                    <BrowserRouter basename="/admin">
                                      <Suspense fallback={<LoadingFallback />}>
                                        <Routes>
                                          <Route path="/login" element={<AdminLogin />} />
                                          <Route path="/" element={<AdminLayout />}>
                                            <Route element={<AdminRootLayout />}>
                                              <Route path="dashboard" element={<AdminDashboard />} />
                                              <Route path="site-config" element={<AdminSiteConfiguration />} />
                                              <Route path="pages" element={<AdminPages />} />
                                              <Route path="story" element={<AdminStory />} />
                                              <Route path="garden" element={<AdminGarden />} />
                                              <Route path="garden/create" element={<CreatePost />} />
                                              <Route path="garden/edit/:postId" element={<CreatePost />} />
                                              <Route path="projects" element={<AdminProjects />} />
                                              <Route path="projects/create" element={<ProjectForm />} />
                                              <Route path="projects/edit/:projectId" element={<ProjectForm />} />
                                              <Route path="bookshelf" element={<AdminBookshelf />} />
                                              <Route path="bookshelf/create" element={<BookshelfForm />} />
                                              <Route path="bookshelf/edit/:entryId" element={<BookshelfForm />} />
                                              <Route path="topics" element={<AdminTopics />} />
                                              <Route path="contact-links" element={<AdminContactLinks />} />
                                              <Route path="media" element={<AdminMediaLibrary />} />
                                              <Route path="inbox" element={<AdminInbox />} />

                                              <Route path="posts/create" element={<CreatePost />} />
                                              <Route path="posts/edit/:postId" element={<CreatePost />} />
                                              <Route path="recommendations" element={<AdminRecommendationsDashboard />} />
                                              <Route path="recommendations/create" element={<RecommendationForm />} />
                                              <Route path="recommendations/edit/:recId" element={<RecommendationForm />} />
                                              <Route path="publications" element={<AdminPublications />} />
                                              <Route path="publications/create" element={<PublicationForm />} />
                                              <Route path="publications/edit/:pubId" element={<PublicationForm />} />
                                              <Route path="cv" element={<AdminCV />} />
                                              <Route path="legacy/page-content" element={<AdminPageContent />} />
                                              <Route path="legacy/site-settings" element={<AdminSiteSettings />} />
                                              <Route path="legacy/profile" element={<AdminProfileSettings />} />
                                              <Route path="legacy/appearance" element={<AdminAppearanceSettings />} />
                                              <Route path="legacy/seo" element={<AdminSEOSettings />} />
                                              <Route path="legacy/ui-text" element={<AdminUITextSettings />} />
                                              <Route path="legacy/navigation" element={<AdminNavigationSettings />} />
                                              <Route path="legacy/homepage" element={<AdminHomepageLayout />} />
                                              <Route path="migrate" element={<DataMigration />} />
                                              <Route path="custom-pages" element={<AdminCustomPages />} />
                                              <Route index element={<AdminDashboard />} />
                                            </Route>
                                          </Route>
                                        </Routes>
                                      </Suspense>
                                    </BrowserRouter>
                                    <ToastContainerWrapper />
                                  </ContactLinksProvider>
                                </NavigationItemsProvider>
                              </BookshelfProvider>
                            </StoryProvider>
                          </PageSectionsProvider>
                        </CustomPagesProvider>
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
