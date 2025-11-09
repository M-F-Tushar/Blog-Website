import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { siteName } = useSiteSettings();
  const { isAuthenticated } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-gray-200 dark:bg-gray-700 text-accent dark:text-accent-light'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold font-serif text-gray-900 dark:text-white">
              {siteName}
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" className={navLinkClasses}>Home</NavLink>
            <NavLink to="/about" className={navLinkClasses}>About</NavLink>
            <NavLink to="/blog" className={navLinkClasses}>Blog</NavLink>
            <NavLink to="/recommendations" className={navLinkClasses}>Recommendations</NavLink>
            <NavLink to="/contact" className={navLinkClasses}>Contact</NavLink>
            {isAuthenticated && (
                <NavLink to="/admin/dashboard" className={navLinkClasses}>Dashboard</NavLink>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <form onSubmit={handleSearch} className="hidden sm:block">
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 w-32 sm:w-40 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 focus:w-48"
              />
            </form>
            <ThemeToggle />
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={!isMenuOpen ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink to="/" className={navLinkClasses} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
          <NavLink to="/about" className={navLinkClasses} onClick={() => setIsMenuOpen(false)}>About</NavLink>
          <NavLink to="/blog" className={navLinkClasses} onClick={() => setIsMenuOpen(false)}>Blog</NavLink>
          <NavLink to="/recommendations" className={navLinkClasses} onClick={() => setIsMenuOpen(false)}>Recommendations</NavLink>
          <NavLink to="/contact" className={navLinkClasses} onClick={() => setIsMenuOpen(false)}>Contact</NavLink>
          {isAuthenticated && (
            <NavLink to="/admin/dashboard" className={navLinkClasses} onClick={() => setIsMenuOpen(false)}>Dashboard</NavLink>
          )}
          <form onSubmit={handleSearch} className="p-2">
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 w-full text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </form>
        </div>
      )}
    </header>
  );
};

export default Header;
