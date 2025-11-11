import { useEffect } from 'react';
import { useSiteSettings } from './useSiteSettings';

const useSEO = (title: string, description: string) => {
  const { siteName } = useSiteSettings();

  useEffect(() => {
    if (title) {
      document.title = `${title} | ${siteName}`;
    } else {
      document.title = siteName;
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    if (description && metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [title, description, siteName]);
};

export default useSEO;
