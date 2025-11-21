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
import Admonition, { AdmonitionType } from './Admonition';
import CustomImage from './CustomImage';

// Plugin to handle custom directives (:::note, etc.)
function remarkAdmonitions() {
    return (tree: any) => {
        visit(tree, (node) => {
            if (
                node.type === 'containerDirective' ||
                node.type === 'leafDirective' ||
                node.type === 'textDirective'
            ) {
                if (['note', 'tip', 'info', 'warning', 'danger'].includes(node.name)) {
                    const data = node.data || (node.data = {});
                    const tagName = node.type === 'textDirective' ? 'span' : 'div';

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
                remarkPlugins={[
                    remarkGfm,
                    remarkMath,
                    remarkDirective,
                    remarkAdmonitions,
                ]}
                rehypePlugins={[
                    rehypeRaw,
                    rehypeHighlight,
                    rehypeKatex,
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                ]}
                components={{
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';

                        if (!inline && match) {
                            return (
                                <CodeBlock
                                    language={language}
                                    value={String(children).replace(/\n$/, '')}
                                />
                            );
                        }
                        return (
                            <code className={className}>
                                {children}
                            </code>
                        );
                    },
                    img: ({ node, src, alt, title, ...props }) => (
                        <CustomImage src={src} alt={alt} title={title} />
                    ),
                    // @ts-ignore - Custom component for admonitions
                    admonition: ({ node, type, title, children, ...props }: any) => (
                        <Admonition type={type} title={title}>
                            {children}
                        </Admonition>
                    ),
                    a: ({ node, href, children, ...props }) => {
                        const isExternal = href?.startsWith('http');
                        return (
                            <a
                                href={href}
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className="text-accent hover:text-accent-light transition-colors no-underline hover:underline"
                            >
                                {children}
                            </a>
                        )
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
