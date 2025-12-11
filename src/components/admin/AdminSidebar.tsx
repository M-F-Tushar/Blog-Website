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
        navigate('/admin/login');
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `block w-full text-left px-4 py-2 text-sm transition-colors ${isActive
            ? 'bg-accent/10 text-accent dark:bg-accent-light/20 dark:text-accent-light'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`;


    return (
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex-shrink-0 flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <Link to="/admin/dashboard" className="text-xl font-bold font-serif text-gray-900 dark:text-white">{authorName}</Link>
                <span className="block text-sm text-gray-500">Admin Panel</span>
            </div>
            <nav className="mt-6 flex-grow">
                <NavLink to="/admin/dashboard" className={navLinkClasses} end>Dashboard</NavLink>
                <NavLink to="/admin/posts/create" className={navLinkClasses}>New Post</NavLink>
                <NavLink to="/admin/recommendations" className={navLinkClasses}>Recommendations</NavLink>
                <NavLink to="/admin/settings/site" className={navLinkClasses}>Site Settings</NavLink>
                <NavLink to="/admin/settings/ui-text" className={navLinkClasses}>UI Text</NavLink>
                <NavLink to="/admin/settings/layout" className={navLinkClasses}>Homepage Layout</NavLink>
                <NavLink to="/admin/settings/profile" className={navLinkClasses}>Profile Settings</NavLink>
            </nav>
            <div className="p-4 mt-6 border-t border-gray-200 dark:border-gray-700">
                <Link to="/" target="_blank" rel="noopener noreferrer" className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    View Site
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;