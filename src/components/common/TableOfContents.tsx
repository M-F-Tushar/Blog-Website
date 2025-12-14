import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

// Helper component for TOC content
const TocContent: React.FC<{
  headings: TocItem[];
  activeId: string;
  onHeadingClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}> = ({ headings, activeId, onHeadingClick }) => (
  <>
    <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
      Table of Contents
    </h4>
    <ul className="space-y-2 text-sm">
      {headings.map((heading) => (
        <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}>
          <a
            href={`#${heading.id}`}
            className={cn(
              'block transition-colors duration-200 border-l-2 pl-3',
              activeId === heading.id
                ? 'border-accent text-accent font-medium'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
            )}
            onClick={(e) => onHeadingClick(e, heading.id)}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  </>
);

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // Parse headings from markdown content
    // This is a simple regex parser. For more complex needs, we might need to use a remark plugin to extract this.
    // However, since we are rendering with rehype-slug, the IDs in the DOM will match the slugified text.
    // We'll actually scan the DOM after render to be perfectly accurate.

    const updateHeadings = () => {
      const elements = Array.from(document.querySelectorAll('h2, h3, h4'));
      const items = elements.map((elem) => ({
        id: elem.id,
        text: (elem as HTMLElement).innerText,
        level: Number(elem.tagName.substring(1)),
      }));
      setHeadings(items);
    };

    // Wait a bit for the markdown to render
    const timer = setTimeout(updateHeadings, 100);
    return () => clearTimeout(timer);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Close mobile drawer when clicking a heading
  const handleHeadingClick = (e: React.MouseEvent<HTMLAnchorElement>, headingId: string) => {
    e.preventDefault();
    setIsMobileOpen(false);
    document.getElementById(headingId)?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  if (headings.length === 0) return null;

  if (headings.length === 0) return null;

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile/tablet */}
      <nav className="hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto p-4">
        <TocContent headings={headings} activeId={activeId} onHeadingClick={handleHeadingClick} />
      </nav>

      {/* Mobile Floating Button - Visible on mobile/tablet */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-20 left-4 z-40 bg-accent text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
        aria-label="Open table of contents"
      >
        <List size={24} />
      </motion.button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Close button */}
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Close table of contents"
                >
                  <X size={24} />
                </button>

                <TocContent
                  headings={headings}
                  activeId={activeId}
                  onHeadingClick={handleHeadingClick}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default TableOfContents;
