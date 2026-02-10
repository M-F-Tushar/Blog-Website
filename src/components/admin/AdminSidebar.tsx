import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { cosmic } from './ui/cosmicClassNames';

const AdminSidebar: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { authorName } = useSiteSettings();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    isActive ? cosmic.navActive : cosmic.navInactive;

  return (
    <aside className={cosmic.sidebar}>
      {/* Brand */}
      <div className={cosmic.sidebarBrand}>
        <Link to="/dashboard" className="block">
          <span className="text-xl font-bold font-serif admin-text-gradient">{authorName}</span>
        </Link>
        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-md bg-gold-500/10 text-gold-400 border border-gold-500/20">
          Admin Panel
        </span>
      </div>

      <nav className="mt-4 flex-grow admin-scrollbar overflow-y-auto">
        {/* Content */}
        <div className="px-4 pt-4 pb-2">
          <span className={cosmic.sectionLabel}>Content</span>
          <div className="admin-cosmic-divider mt-2" />
        </div>
        <NavLink to="/dashboard" className={navLinkClasses} end>
          Dashboard
        </NavLink>
        <NavLink to="/posts/create" className={navLinkClasses}>
          New Post
        </NavLink>
        <NavLink to="/recommendations" className={navLinkClasses}>
          Recommendations
        </NavLink>

        {/* Research */}
        <div className="px-4 pt-6 pb-2">
          <span className={cosmic.sectionLabel}>Research</span>
          <div className="admin-cosmic-divider mt-2" />
        </div>
        <NavLink to="/projects" className={navLinkClasses}>
          Projects
        </NavLink>
        <NavLink to="/publications" className={navLinkClasses}>
          Publications
        </NavLink>

        {/* Pages */}
        <div className="px-4 pt-6 pb-2">
          <span className={cosmic.sectionLabel}>Pages</span>
          <div className="admin-cosmic-divider mt-2" />
        </div>
        <NavLink to="/pages" className={navLinkClasses}>
          Page Content
        </NavLink>
        <NavLink to="/cv" className={navLinkClasses}>
          CV Manager
        </NavLink>
        <NavLink to="/settings/homepage" className={navLinkClasses}>
          Homepage Layout
        </NavLink>
        <NavLink to="/custom-pages" className={navLinkClasses}>
          Custom Pages
        </NavLink>

        {/* Settings */}
        <div className="px-4 pt-6 pb-2">
          <span className={cosmic.sectionLabel}>Settings</span>
          <div className="admin-cosmic-divider mt-2" />
        </div>
        <NavLink to="/settings/site" className={navLinkClasses}>
          Site Settings
        </NavLink>
        <NavLink to="/settings/profile" className={navLinkClasses}>
          Profile Settings
        </NavLink>
        <NavLink to="/settings/appearance" className={navLinkClasses}>
          Appearance
        </NavLink>
        <NavLink to="/settings/seo" className={navLinkClasses}>
          SEO
        </NavLink>
        <NavLink to="/settings/ui-text" className={navLinkClasses}>
          UI Text
        </NavLink>
        <NavLink to="/settings/navigation" className={navLinkClasses}>
          Navigation
        </NavLink>

        {/* Tools */}
        <div className="px-4 pt-6 pb-2">
          <span className={cosmic.sectionLabel}>Tools</span>
          <div className="admin-cosmic-divider mt-2" />
        </div>
        <NavLink to="/media" className={navLinkClasses}>
          Media Library
        </NavLink>
        <NavLink to="/inbox" className={navLinkClasses}>
          Inbox
        </NavLink>
      </nav>

      <div className="p-4 border-t border-white/[0.06]">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-left px-4 py-2.5 text-sm text-secondary-400 hover:text-primary-300 hover:bg-white/[0.04] rounded-lg transition-all duration-200"
        >
          View Site &rarr;
        </a>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2.5 text-sm text-error-400 hover:bg-error-500/10 rounded-lg transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
