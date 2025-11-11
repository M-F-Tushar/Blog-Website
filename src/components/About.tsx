import React, { useMemo } from 'react';
import { marked } from 'marked';
import useSEO from '../hooks/useSEO';
import { useProfile } from '../hooks/useProfile';
import { useSiteSettings } from '../hooks/useSiteSettings';

const About: React.FC = () => {
  const { authorName, authorBio } = useSiteSettings();
  const { photoUrl } = useProfile();
  
  useSEO({
    title: `About ${authorName}`,
    description: `Learn more about ${authorName}, web developer and CS student.`,
    image: photoUrl || 'https://m-f-tushar.github.io/Blog-Website/images/og-image.jpg'
  });

  const renderedBio = useMemo(() => {
    if (authorBio) {
        return { __html: marked.parse(authorBio) };
    }
    return { __html: '' };
  }, [authorBio]);

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
      <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
        <img 
          src={photoUrl}
          alt={authorName}
          className="w-40 h-40 rounded-full object-cover shadow-lg mb-6 md:mb-0 md:mr-8 flex-shrink-0"
        />
        <div>
          <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-white">
            Hi, I'm {authorName}
          </h1>
          <p className="mt-2 text-xl text-gray-600 dark:text-gray-400">
            A passionate developer, lifelong learner, and technology enthusiast.
          </p>
        </div>
      </div>
      
      <div 
        className="mt-8 prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={renderedBio}
      />
    </div>
  );
};

export default About;