import React, { useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

type ThemeOption = 'light' | 'dark' | 'system';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  // Determine current theme preference (including system)
  const getCurrentPreference = (): ThemeOption => {
    const saved = localStorage.getItem('theme-preference');
    if (saved === 'system' || !saved) return 'system';
    return saved as ThemeOption;
  };

  const [preference, setPreference] = useState<ThemeOption>(getCurrentPreference);

  const handleThemeChange = (newPreference: ThemeOption) => {
    setPreference(newPreference);
    localStorage.setItem('theme-preference', newPreference);

    if (newPreference === 'system') {
      // Use system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      if (theme !== systemTheme) {
        toggleTheme();
      }
    } else {
      // Use explicit preference
      if (theme !== newPreference) {
        toggleTheme();
      }
    }

    setShowMenu(false);
  };

  const themeOptions: { value: ThemeOption; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun size={18} /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={18} /> },
    { value: 'system', label: 'System', icon: <Monitor size={18} /> },
  ];

  const currentIcon =
    preference === 'light' ? (
      <Sun size={20} />
    ) : preference === 'dark' ? (
      <Moon size={20} />
    ) : (
      <Monitor size={20} />
    );

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300"
        aria-label="Toggle theme menu"
        aria-expanded={showMenu}
      >
        <motion.div
          key={preference}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentIcon}
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
            >
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                    preference === option.value
                      ? 'bg-accent text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {option.icon}
                  <span className="font-medium">{option.label}</span>
                  {preference === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
