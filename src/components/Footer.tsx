import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';

const Footer: React.FC = () => {
    const { authorName, socialLinks } = useSiteSettings();
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700" role="contentinfo">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <p className="text-sm text-gray-600 dark:text-gray-400">&copy; {new Date().getFullYear()} {authorName}. All Rights Reserved.</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Powered by React & Tailwind CSS</p>
                    </div>
                    <nav className="flex items-center space-x-6" aria-label="Social media links">
                        <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-accent dark:text-gray-400 dark:hover:text-accent-light transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded" aria-label="Visit GitHub profile">GitHub</a>
                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-accent dark:text-gray-400 dark:hover:text-accent-light transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded" aria-label="Visit LinkedIn profile">LinkedIn</a>
                        <a href={`mailto:${socialLinks.email}`} className="text-gray-600 hover:text-accent dark:text-gray-400 dark:hover:text-accent-light transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded" aria-label="Send email">Email</a>
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;