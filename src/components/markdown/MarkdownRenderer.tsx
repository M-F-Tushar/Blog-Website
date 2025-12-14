import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { visit } from 'unist-util-visit';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';

import CodeBlock from './CodeBlock';
import Admonition from './Admonition';
import CustomImage from './CustomImage';

// Plugin to handle custom directives (:::note, etc.)
function remarkAdmonitions() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (['note', 'tip', 'info', 'warning', 'danger'].includes(node.name)) {
          const data = node.data || (node.data = {});

          data.hName = 'admonition';
          data.hProperties = {
            type: node.name,
            title: node.attributes.title,
          };
        }
      }
    });
  };
}

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkDirective, remarkAdmonitions]}
        rehypePlugins={[
          rehypeRaw,
          rehypeHighlight,
          rehypeKatex,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ]}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code({ node: _node, inline, className, children, ..._props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            if (!inline && match) {
              return <CodeBlock language={language} value={String(children).replace(/\n$/, '')} />;
            }
            return <code className={className}>{children}</code>;
          },
          img: ({ node: _node, src, alt, title, ..._props }) => (
            <CustomImage src={src} alt={alt} title={title} />
          ),
          // @ts-expect-error - Custom component for admonitions
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          admonition: ({ node: _node, type, title, children, ..._props }: any) => (
            <Admonition type={type} title={title}>
              {children}
            </Admonition>
          ),
          a: ({ node: _node, href, children, ..._props }) => {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="text-accent hover:text-accent-light transition-colors no-underline hover:underline"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
