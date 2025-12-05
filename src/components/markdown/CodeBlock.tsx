import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [mermaidLoaded, setMermaidLoaded] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lazy load mermaid only when needed
    if (language === 'mermaid' && mermaidRef.current && !mermaidLoaded) {
      import('mermaid')
        .then((mermaidModule) => {
          const mermaid = mermaidModule.default;
          mermaid.initialize({
            startOnLoad: true,
            theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
            securityLevel: 'loose',
          });
          mermaid.contentLoaded();
          setMermaidLoaded(true);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(
            'Failed to load Mermaid diagram library. The diagram cannot be rendered and will display as plain text instead. Error:',
            error
          );
          // The diagram will gracefully fall back to displaying as a code block
        });
    }
  }, [language, value, mermaidLoaded]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (language === 'mermaid') {
    return (
      <div className="my-8 flex justify-center overflow-x-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="mermaid" ref={mermaidRef}>
          {value}
        </div>
      </div>
    );
  }

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
          {language || 'text'}
        </span>
        <button
          onClick={copyToClipboard}
          className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Copy code"
        >
          {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <code className="font-mono text-sm">{value}</code>
      </div>
    </div>
  );
};

export default CodeBlock;
