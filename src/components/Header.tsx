import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search as SearchIcon, Sun, Moon } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePosts } from '../hooks/usePosts';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../hooks/useTheme';
import SearchSuggestions from './common/SearchSuggestions';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recent-searches', []);
  const navigate = useNavigate();
  const location = useLocation();
  const { siteName } = useSiteSettings();
  const { posts } = usePosts();
  const { theme, toggleTheme } = useTheme();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim());
    }
  };

  const performSearch = (query: string) => {
    const updatedSearches = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 10);
    setRecentSearches(updatedSearches);
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSearchQuery('');
    setShowSuggestions(false);
    setIsMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Blog' },
    { path: '/recommendations', label: 'Recommendations' },
    { path: '/bookmarks', label: 'Bookmarks' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen ? 'glass shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold font-serif tracking-tight text-gradient hover:opacity-80 transition-opacity"
            aria-label={`${siteName} - Home`}
          >
            {siteName}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1" id="navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-0.5 after:bg-primary-600 dark:after:bg-primary-400 after:rounded-full'
                      : 'text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 rounded-full'
                  }`
                }
                aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="relative hidden sm:block group" id="search">
              <form onSubmit={handleSearch} className="relative" role="search">
                <input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  className="pl-10 pr-4 py-2 w-40 focus:w-60 text-sm bg-secondary-100 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 focus:border-primary-500 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 placeholder:text-secondary-500 dark:placeholder:text-secondary-400"
                  aria-label="Search blog posts"
                />
                <SearchIcon
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-500 dark:text-secondary-400 group-focus-within:text-primary-500 transition-colors"
                  aria-hidden="true"
                />
              </form>

              <SearchSuggestions
                query={searchQuery}
                posts={posts}
                recentSearches={recentSearches}
                isOpen={showSuggestions && (searchQuery.length > 0 || recentSearches.length > 0)}
                onSelect={performSearch}
                onClose={() => setShowSuggestions(false)}
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 hover:scale-110 ${
                theme === 'dark'
                  ? 'bg-secondary-800 text-amber-400 hover:bg-secondary-700'
                  : 'bg-secondary-100 text-indigo-600 hover:bg-secondary-200'
              }`}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-white/95 dark:bg-secondary-950/95 backdrop-blur-xl transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '60px' }}
      >
        <div className="p-4 space-y-4 h-full overflow-y-auto">
          <form onSubmit={handleSearch} className="relative" role="search">
            <input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-base bg-secondary-100 dark:bg-secondary-900 border border-transparent focus:border-primary-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              aria-label="Search articles"
            />
            <SearchIcon
              size={20}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400"
              aria-hidden="true"
            />
          </form>

          <nav aria-label="Mobile navigation">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-base font-medium transition-colors relative ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600 dark:border-primary-400'
                        : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900'
                    }`
                  }
                  aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
