import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/plugins/captions.css';

interface CustomImageProps {
  src?: string;
  alt?: string;
  title?: string;
}

const CustomImage: React.FC<CustomImageProps> = ({ src, alt, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!src) return null;

  return (
    <>
      <figure className="my-8">
        <img
          src={src}
          alt={alt || ''}
          title={title}
          className="w-full rounded-lg shadow-md cursor-zoom-in hover:shadow-lg transition-shadow duration-300"
          onClick={() => setIsOpen(true)}
          loading="lazy"
        />
        {alt && (
          <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 italic">
            {alt}
          </figcaption>
        )}
      </figure>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={[{ src, alt, title }]}
        plugins={[Zoom, Captions]}
        captions={{ showToggle: true, descriptionTextAlign: 'center' }}
      />
    </>
  );
};

export default CustomImage;
