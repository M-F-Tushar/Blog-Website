import React from 'react';
import useSEO from '../hooks/useSEO';
import { useSiteSettings } from '../hooks/useSiteSettings';

const Contact: React.FC = () => {
    const { authorName, socialLinks } = useSiteSettings();
    useSEO('Contact', `Get in touch with ${authorName}.`);

    return (
        <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-white">Contact Me</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team. Feel free to reach out.
            </p>

            <div className="mt-8 space-y-4">
                <a 
                    href={`mailto:${socialLinks.email}`} 
                    className="inline-block w-full max-w-sm p-4 text-lg font-semibold text-white bg-accent rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                >
                    Email Me
                </a>
                <a 
                    href={socialLinks.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block w-full max-w-sm p-4 text-lg font-semibold text-gray-800 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
                >
                    Connect on GitHub
                </a>
                <a 
                    href={socialLinks.linkedin}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block w-full max-w-sm p-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                    Find me on LinkedIn
                </a>
            </div>
        </div>
    );
};

export default Contact;