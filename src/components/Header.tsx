import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search as SearchIcon } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePosts } from '../hooks/usePosts';
import { useLocalStorage } from '../hooks/useLocalStorage';
import SearchSuggestions from './common/SearchSuggestions';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recent-searches', []);
  const navigate = useNavigate();
  const { siteName } = useSiteSettings();
  const { posts } = usePosts();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim());
    }
  };

  const performSearch = (query: string) => {
    // Add to recent searches
    const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
    setRecentSearches(updatedSearches);

    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSearchQuery('');
    setShowSuggestions(false);
    setIsMenuOpen(false);
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
      ? 'bg-gray-200 dark:bg-gray-700 text-accent dark:text-accent-light'
      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold font-serif text-gray-900 dark:text-white" aria-label={`${siteName} - Home`}>
              {siteName}
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" className={navLinkClasses} aria-label="Navigate to Home">Home</NavLink>
            <NavLink to="/about" className={navLinkClasses} aria-label="Navigate to About">About</NavLink>
            <NavLink to="/blog" className={navLinkClasses} aria-label="Navigate to Blog">Blog</NavLink>
            <NavLink to="/recommendations" className={navLinkClasses} aria-label="Navigate to Recommendations">Recommendations</NavLink>
            <NavLink to="/contact" className={navLinkClasses} aria-label="Navigate to Contact">Contact</NavLink>
          </div>
          <div className="flex items-center space-x-2">
            <form onSubmit={handleSearch} className="hidden sm:block relative" role="search" aria-label="Site search">
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="pl-3 pr-8 py-1.5 w-32 sm:w-40 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 focus:w-48"
                aria-label="Search blog posts"
              />
              <SearchIcon size={16} className="absolute right-2.5 top-2 text-gray-400 pointer-events-none" />

              <SearchSuggestions
                query={searchQuery}
                posts={posts}
                recentSearches={recentSearches}
                isOpen={showSuggestions && (searchQuery.length > 0 || recentSearches.length > 0)}
                onSelect={performSearch}
                onClose={() => setShowSuggestions(false)}
              />
            </form>
            <ThemeToggle />
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg" role="menu" aria-label="Mobile navigation menu">
          <NavLink to="/" className={navLinkClasses} onClick={() => setIsMenuOpen(false)} aria-label="Navigate to Home">Home</NavLink>
          <NavLink to="/about" className={navLinkClasses} onClick={() => setIsMenuOpen(false)} aria-label="Navigate to About">About</NavLink>
          <NavLink to="/blog" className={navLinkClasses} onClick={() => setIsMenuOpen(false)} aria-label="Navigate to Blog">Blog</NavLink>
          <NavLink to="/recommendations" className={navLinkClasses} onClick={() => setIsMenuOpen(false)} aria-label="Navigate to Recommendations">Recommendations</NavLink>
          <NavLink to="/contact" className={navLinkClasses} onClick={() => setIsMenuOpen(false)} aria-label="Navigate to Contact">Contact</NavLink>
          <form onSubmit={handleSearch} className="p-2 relative" role="search" aria-label="Mobile search">
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 w-full text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Search blog posts"
            />
            <SearchIcon size={16} className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
