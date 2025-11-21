import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const [copied, setCopied] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // Add structured data for SEO
  useEffect(() => {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${window.location.origin}/`
        },
        ...items.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 2,
          "name": item.label,
          "item": item.path ? `${window.location.origin}${item.path}` : undefined
        }))
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(breadcrumbSchema);
    script.id = 'breadcrumb-schema';

    // Remove existing schema if present
    const existing = document.getElementById('breadcrumb-schema');
    if (existing) {
      existing.remove();
    }

    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('breadcrumb-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [items]);

  // Detect scroll for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Copy path to clipboard
  const copyPath = () => {
    const path = ['Home', ...items.map(i => i.label)].join(' > ');
    navigator.clipboard.writeText(path).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <nav
      className={`flex items-center justify-between gap-4 text-sm mb-6 transition-all duration-300 ${isSticky
          ? 'sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 py-3 px-4 -mx-4 shadow-sm'
          : ''
        }`}
      aria-label="Breadcrumb"
    >
      {/* Breadcrumb trail */}
      <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 overflow-x-auto whitespace-nowrap pb-2 flex-1">
        <Link
          to="/"
          className="flex items-center hover:text-accent dark:hover:text-accent-light transition-colors group"
          title="Home"
        >
          <Home size={16} className="group-hover:scale-110 transition-transform" />
        </Link>

        {items.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight size={14} className="flex-shrink-0 text-gray-400 dark:text-gray-600" />
            {item.path ? (
              <Link
                to={item.path}
                className="hover:text-accent dark:hover:text-accent-light transition-colors hover:underline"
                title={item.label}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="font-medium text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs"
                title={item.label}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Copy path button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={copyPath}
        className="flex-shrink-0 p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-accent transition-colors"
        title="Copy path"
        aria-label="Copy breadcrumb path"
      >
        {copied ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-green-500"
          >
            <Check size={16} />
          </motion.div>
        ) : (
          <Copy size={16} />
        )}
      </motion.button>
    </nav>
  );
};

export default Breadcrumbs;
