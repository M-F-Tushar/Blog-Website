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
        <div className="px-4 pt-4 pb-2">
          <span className={cosmic.sectionLabel}>Workspace</span>
          <div className="admin-cosmic-divider mt-2" />
        </div>
        <NavLink to="/dashboard" className={navLinkClasses} end>
          Dashboard
        </NavLink>
        <NavLink to="/site-config" className={navLinkClasses}>
          Site Configuration
        </NavLink>
        <NavLink to="/pages" className={navLinkClasses}>
          Pages
        </NavLink>
        <div className="px-4 pt-6 pb-2">
          <span className={cosmic.sectionLabel}>Content</span>
          <div className="admin-cosmic-divider mt-2" />
        </div>
        <NavLink to="/story" className={navLinkClasses}>
          Story
        </NavLink>
        <NavLink to="/garden" className={navLinkClasses}>
          Garden
        </NavLink>
        <NavLink to="/projects" className={navLinkClasses}>
          Projects
        </NavLink>
        <NavLink to="/bookshelf" className={navLinkClasses}>
          Bookshelf
        </NavLink>
        <div className="px-4 pt-6 pb-2">
          <span className={cosmic.sectionLabel}>Taxonomy</span>
          <div className="admin-cosmic-divider mt-2" />
        </div>
        <NavLink to="/topics" className={navLinkClasses}>
          Topics / Tags
        </NavLink>
        <div className="px-4 pt-6 pb-2">
          <span className={cosmic.sectionLabel}>Publishing</span>
          <div className="admin-cosmic-divider mt-2" />
        </div>
        <NavLink to="/contact-links" className={navLinkClasses}>
          Contact Links
        </NavLink>
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
        <div className="px-4 pt-6 pb-2">
          <span className={cosmic.sectionLabel}>Legacy</span>
          <div className="admin-cosmic-divider mt-2" />
        </div>
        <NavLink to="/legacy/site-settings" className={navLinkClasses}>
          Legacy Settings
        </NavLink>
        <NavLink to="/publications" className={navLinkClasses}>
          Publications
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
