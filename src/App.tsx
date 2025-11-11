// FIX: Replaced BrowserRouter with HashRouter to solve persistent routing issues in the preview environment.
import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import Recommendations from './components/Recommendations';
import Contact from './components/Contact';
import Search from './components/Search';
import Tags from './components/Tags';
import TagPage from './components/TagPage';
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminRootLayout from './components/admin/AdminRootLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import CreatePost from './components/CreatePost';
import AdminRecommendationsDashboard from './components/admin/AdminRecommendationsDashboard';
import RecommendationForm from './components/admin/RecommendationForm';
import AdminSiteSettings from './components/admin/AdminSiteSettings';
import AdminProfileSettings from './components/admin/AdminProfileSettings';
import DataMigration from './components/admin/DataMigration';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import SkipToContent from './components/common/SkipToContent';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <SkipToContent />
      <Header />
      <main id="main-content" className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:postId" element={<BlogPost />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="contact" element={<Contact />} />
            <Route path="search" element={<Search />} />
            <Route path="tags" element={<Tags />} />
            <Route path="tags/:tagName" element={<TagPage />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route element={<AdminRootLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="posts/create" element={<CreatePost />} />
              <Route path="posts/edit/:postId" element={<CreatePost />} />
              <Route path="recommendations" element={<AdminRecommendationsDashboard />} />
              <Route path="recommendations/create" element={<RecommendationForm />} />
              <Route path="recommendations/edit/:recId" element={<RecommendationForm />} />
              <Route path="settings/site" element={<AdminSiteSettings />} />
              <Route path="settings/profile" element={<AdminProfileSettings />} />
              <Route path="migrate" element={<DataMigration />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}

export default App;
