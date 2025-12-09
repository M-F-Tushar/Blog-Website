import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

interface TableOfContentsProps {
  content: string;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const headings = useMemo(() => {
    // Parse headings from markdown
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const matches: Heading[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      matches.push({ id, text, level });
    }
    return matches;
  }, [content]);

  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66% 0px' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="toc sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto hidden lg:block p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wider">
        Table of Contents
      </h2>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} className={`${heading.level === 3 ? 'pl-4' : ''}`}>
            <a
              href={`#${heading.id}`}
              className={`block transition-colors duration-200 ${
                activeId === heading.id
                  ? 'text-accent font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: 'smooth',
                });
                setActiveId(heading.id);
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
