import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const AdminSidebar: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { authorName } = useSiteSettings();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `block w-full text-left px-4 py-2 text-sm transition-colors ${
      isActive
        ? 'bg-accent/10 text-accent dark:bg-accent-light/20 dark:text-accent-light'
        : 'text-gray-700 dark:text-secondary-200 hover:bg-gray-100 dark:hover:bg-elevated'
    }`;

  return (
    <aside className="w-64 bg-white dark:bg-surface shadow-md flex-shrink-0 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-white/[0.06]">
        <Link
          to="/dashboard"
          className="text-xl font-bold font-serif text-gray-900 dark:text-secondary-50"
        >
          {authorName}
        </Link>
        <span className="block text-sm text-gray-500">Admin Panel</span>
      </div>
      <nav className="mt-6 flex-grow">
        {/* Content */}
        <div className="px-4 pt-4 pb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Content
          </span>
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
        <div className="px-4 pt-6 pb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Research
          </span>
        </div>
        <NavLink to="/projects" className={navLinkClasses}>
          Projects
        </NavLink>
        <NavLink to="/publications" className={navLinkClasses}>
          Publications
        </NavLink>

        {/* Pages */}
        <div className="px-4 pt-6 pb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Pages
          </span>
        </div>
        <NavLink to="/pages" className={navLinkClasses}>
          Page Content
        </NavLink>
        <NavLink to="/cv" className={navLinkClasses}>
          CV Manager
        </NavLink>

        {/* Settings */}
        <div className="px-4 pt-6 pb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Settings
          </span>
        </div>
        <NavLink to="/settings/site" className={navLinkClasses}>
          Site Settings
        </NavLink>
        <NavLink to="/settings/profile" className={navLinkClasses}>
          Profile Settings
        </NavLink>
      </nav>
      <div className="p-4 mt-6 border-t border-gray-200 dark:border-white/[0.06]">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-secondary-200 hover:bg-gray-100 dark:hover:bg-elevated"
        >
          View Site
        </a>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-elevated"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
