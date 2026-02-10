import React, { useState, useEffect, useRef } from 'react';

interface Props {
  src: string;
  title?: string;
  description?: string;
  height?: string;
}

const ModelDemo: React.FC<Props> = ({
  src,
  title = 'Model Demo',
  description,
  height = '600px',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy-load the iframe using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-purple-500"
          >
            <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
          </svg>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{title}</h3>
        </div>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
      </div>

      {/* Iframe container */}
      <div className="relative" style={{ height }}>
        {!isVisible && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Scroll down to load the demo...
            </p>
          </div>
        )}

        {isVisible && !isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading demo...</p>
            </div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/10">
            <div className="text-center p-6">
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load demo</p>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Open in new tab
              </a>
            </div>
          </div>
        )}

        {isVisible && (
          <iframe
            src={src}
            title={title}
            className="w-full h-full border-0"
            style={{ display: isLoaded ? 'block' : 'none' }}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            loading="lazy"
          />
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          Powered by Hugging Face Spaces / Gradio
        </span>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
        >
          Open in new tab
        </a>
      </div>
    </div>
  );
};

export default ModelDemo;
