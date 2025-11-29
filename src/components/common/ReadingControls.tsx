import React from 'react';
import { Type, AlignJustify } from 'lucide-react';
import { useReadingPreferences } from '../../hooks/useReadingPreferences';

const ReadingControls: React.FC = () => {
  const { preferences, setFontSize, setLineHeight } = useReadingPreferences();

  return (
    <div className="sticky top-28 z-30 bg-white dark:bg-secondary-900 border-b border-gray-200 dark:border-gray-700 py-3 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Type size={18} />
          <span className="hidden sm:inline">Reading Settings</span>
        </div>

        <div className="flex items-center gap-6">
          {/* Font Size Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">Font:</span>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setFontSize('small')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  preferences.fontSize === 'small'
                    ? 'bg-accent text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-label="Small font size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('medium')}
                className={`px-3 py-1 rounded text-base font-medium transition-colors ${
                  preferences.fontSize === 'medium'
                    ? 'bg-accent text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-label="Medium font size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-3 py-1 rounded text-lg font-medium transition-colors ${
                  preferences.fontSize === 'large'
                    ? 'bg-accent text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-label="Large font size"
              >
                A+
              </button>
            </div>
          </div>

          {/* Line Height Controls */}
          <div className="flex items-center gap-2">
            <AlignJustify size={16} className="text-gray-500 dark:text-gray-400 hidden sm:inline" />
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setLineHeight('compact')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  preferences.lineHeight === 'compact'
                    ? 'bg-accent text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-label="Compact line height"
                title="Compact"
              >
                ≡
              </button>
              <button
                onClick={() => setLineHeight('normal')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  preferences.lineHeight === 'normal'
                    ? 'bg-accent text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-label="Normal line height"
                title="Normal"
              >
                ≡
              </button>
              <button
                onClick={() => setLineHeight('relaxed')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  preferences.lineHeight === 'relaxed'
                    ? 'bg-accent text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-label="Relaxed line height"
                title="Relaxed"
              >
                ≡
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingControls;
