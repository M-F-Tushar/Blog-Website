import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Sun, Moon, Github, Linkedin, Mail } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useTheme } from '../hooks/useTheme';

const Header: React.FC = () => {
  const { siteName, socialLinks, uiText } = useSiteSettings();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const navLinks = [
    { name: uiText.header.home, path: '/' },
    { name: uiText.header.about, path: '/about' },
    { name: uiText.header.blog, path: '/blog' },
    { name: uiText.header.recommendations, path: '/recommendations' },
    { name: uiText.header.contact, path: '/contact' },
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold font-serif text-secondary-900 dark:text-white tracking-tight hover:scale-105 transition-transform duration-200"
            >
              {siteName}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400 ${location.pathname === link.path
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-secondary-600 dark:text-secondary-300'
                    }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Search Bar */}
              <div className={`relative transition-all duration-300 ${isSearchOpen ? 'w-64' : 'w-10'}`}>
                {isSearchOpen ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder={uiText.header.searchPlaceholder}
                      className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      onBlur={() => setIsSearchOpen(false)}
                      autoFocus
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500" size={16} />
                  </motion.div>
                ) : (
                  <button
                    onClick={() => {
                      setIsSearchOpen(true);
                      setTimeout(() => searchInputRef.current?.focus(), 100);
                    }}
                    className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full text-secondary-600 dark:text-secondary-300 transition-colors"
                    aria-label="Open search"
                  >
                    <Search size={20} />
                  </button>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full text-secondary-600 dark:text-secondary-300 transition-colors"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                  </motion.div>
                </AnimatePresence>
              </button>

              {/* Social Links */}
              <div className="flex items-center gap-2 border-l border-secondary-200 dark:border-secondary-700 pl-4">
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full text-secondary-600 dark:text-secondary-300 transition-colors"
                >
                  <Github size={20} />
                </a>
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full text-secondary-600 dark:text-secondary-300 transition-colors"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-x-0 top-20 bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-800 z-40 md:hidden overflow-hidden"
          >
            <div className="container mx-auto px-4 py-8 space-y-6">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-lg font-medium transition-colors ${location.pathname === link.path
                        ? 'text-primary-600 dark:text-primary-400 pl-4 border-l-4 border-primary-600 dark:border-primary-400'
                        : 'text-secondary-600 dark:text-secondary-300 pl-4 border-l-4 border-transparent'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center justify-between pt-6 border-t border-secondary-100 dark:border-secondary-800">
                <div className="flex items-center gap-4">
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-secondary-100 dark:bg-secondary-800 rounded-full text-secondary-600 dark:text-secondary-300"
                  >
                    <Github size={20} />
                  </a>
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-secondary-100 dark:bg-secondary-800 rounded-full text-secondary-600 dark:text-secondary-300"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a
                    href={`mailto:${socialLinks.email}`}
                    className="p-2 bg-secondary-100 dark:bg-secondary-800 rounded-full text-secondary-600 dark:text-secondary-300"
                  >
                    <Mail size={20} />
                  </a>
                </div>

                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary-100 dark:bg-secondary-800 rounded-full text-secondary-600 dark:text-secondary-300"
                >
                  {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                  <span className="text-sm font-medium">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
