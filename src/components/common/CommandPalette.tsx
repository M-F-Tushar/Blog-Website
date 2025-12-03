import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Home,
  BookOpen,
  User,
  Mail,
  Bookmark,
  Tag,
  Sun,
  Moon,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { usePosts } from '../../hooks/usePosts';
import { useTheme } from '../../hooks/useTheme';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Command {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'navigation' | 'action' | 'post' | 'recent';
  keywords?: string[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { posts } = usePosts();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(
    'command-palette-recent',
    []
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useFocusTrap<HTMLDivElement>(isOpen);
  const listRef = useRef<HTMLDivElement>(null);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 100);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Navigation commands
  const navigationCommands: Command[] = useMemo(
    () => [
      {
        id: 'nav-home',
        title: 'Go to Home',
        icon: <Home size={18} />,
        action: () => {
          navigate('/');
          onClose();
        },
        category: 'navigation',
        keywords: ['home', 'main', 'index'],
      },
      {
        id: 'nav-blog',
        title: 'Go to Blog',
        icon: <BookOpen size={18} />,
        action: () => {
          navigate('/blog');
          onClose();
        },
        category: 'navigation',
        keywords: ['blog', 'posts', 'articles'],
      },
      {
        id: 'nav-about',
        title: 'Go to About',
        icon: <User size={18} />,
        action: () => {
          navigate('/about');
          onClose();
        },
        category: 'navigation',
        keywords: ['about', 'profile', 'info'],
      },
      {
        id: 'nav-contact',
        title: 'Go to Contact',
        icon: <Mail size={18} />,
        action: () => {
          navigate('/contact');
          onClose();
        },
        category: 'navigation',
        keywords: ['contact', 'email', 'message'],
      },
      {
        id: 'nav-bookmarks',
        title: 'Go to Bookmarks',
        icon: <Bookmark size={18} />,
        action: () => {
          navigate('/bookmarks');
          onClose();
        },
        category: 'navigation',
        keywords: ['bookmarks', 'saved', 'reading list'],
      },
      {
        id: 'nav-tags',
        title: 'Go to Tags',
        icon: <Tag size={18} />,
        action: () => {
          navigate('/tags');
          onClose();
        },
        category: 'navigation',
        keywords: ['tags', 'categories', 'topics'],
      },
      {
        id: 'nav-recommendations',
        title: 'Go to Recommendations',
        icon: <TrendingUp size={18} />,
        action: () => {
          navigate('/recommendations');
          onClose();
        },
        category: 'navigation',
        keywords: ['recommendations', 'suggested', 'featured'],
      },
    ],
    [navigate, onClose]
  );

  // Action commands
  const actionCommands: Command[] = useMemo(
    () => [
      {
        id: 'action-theme',
        title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
        icon: theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />,
        action: () => {
          toggleTheme();
          onClose();
        },
        category: 'action',
        keywords: ['theme', 'dark', 'light', 'mode', 'appearance'],
      },
    ],
    [theme, toggleTheme, onClose]
  );

  // Post commands
  const postCommands: Command[] = useMemo(
    () =>
      posts.slice(0, 10).map((post) => ({
        id: `post-${post.id}`,
        title: post.title,
        subtitle: post.excerpt,
        icon: <BookOpen size={18} />,
        action: () => {
          addRecentSearch(post.title);
          navigate(`/blog/${post.id}`);
          onClose();
        },
        category: 'post' as const,
        keywords: [post.title, ...(post.tags || []), post.excerpt || ''],
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [posts]
  );

  // Recent searches commands
  const recentCommands: Command[] = useMemo(
    () =>
      recentSearches.slice(0, 5).map((search, index) => ({
        id: `recent-${index}`,
        title: search,
        icon: <Clock size={18} />,
        action: () => {
          setQuery(search);
        },
        category: 'recent' as const,
      })),
    [recentSearches]
  );

  // Add recent search
  const addRecentSearch = useCallback(
    (search: string) => {
      const updated = [search, ...recentSearches.filter((s) => s !== search)].slice(0, 10);
      setRecentSearches(updated);
    },
    [recentSearches, setRecentSearches]
  );

  // Fuzzy search function
  const fuzzyMatch = (text: string, search: string): boolean => {
    const searchLower = search.toLowerCase();
    const textLower = text.toLowerCase();

    // Direct substring match
    if (textLower.includes(searchLower)) return true;

    // Fuzzy match: all characters in order
    let searchIndex = 0;
    for (let i = 0; i < textLower.length && searchIndex < searchLower.length; i++) {
      if (textLower[i] === searchLower[searchIndex]) {
        searchIndex++;
      }
    }
    return searchIndex === searchLower.length;
  };

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) {
      return [...navigationCommands, ...actionCommands, ...recentCommands];
    }

    const allCommands = [...navigationCommands, ...actionCommands, ...postCommands];
    return allCommands.filter((cmd) => {
      const searchTargets = [cmd.title, cmd.subtitle, ...(cmd.keywords || [])].filter(Boolean);
      return searchTargets.some((target) => fuzzyMatch(target as string, query));
    });
  }, [query, navigationCommands, actionCommands, postCommands, recentCommands]);

  // Reset selected index when filtered commands change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands.length]); // Use length to avoid re-running on every content change

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Command Palette */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <Search size={20} className="text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search posts, navigate pages, or run commands..."
                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-base"
                autoComplete="off"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
                ESC
              </kbd>
            </div>

            {/* Commands List */}
            <div
              ref={listRef}
              className="max-h-[60vh] overflow-y-auto overscroll-contain divide-y divide-gray-100 dark:divide-gray-700"
            >
              {filteredCommands.length > 0 ? (
                filteredCommands.map((command, index) => (
                  <button
                    key={command.id}
                    onClick={command.action}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      index === selectedIndex
                        ? 'bg-primary-50 dark:bg-primary-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        index === selectedIndex
                          ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {command.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {command.title}
                      </div>
                      {command.subtitle && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {command.subtitle}
                        </div>
                      )}
                    </div>
                    {command.category === 'recent' && (
                      <span className="text-xs text-gray-400">Recent</span>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-12 text-center">
                  <Search size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No results found for &quot;{query}&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-mono">
                    ↑↓
                  </kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-mono">
                    ↵
                  </kbd>
                  Select
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
