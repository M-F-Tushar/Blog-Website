import React from 'react';

interface SkipLink {
  href: string;
  label: string;
}

const skipLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
  { href: '#search', label: 'Skip to search' },
  { href: '#footer', label: 'Skip to footer' },
];

const SkipLinks: React.FC = () => {
  return (
    <div className="skip-links">
      {skipLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-xl focus:font-semibold focus:outline-none focus:ring-4 focus:ring-primary-500/50 hover:focus:bg-primary-700 transition-colors"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

export default SkipLinks;
