import React from 'react';

interface HighlighterProps {
    text: string;
    highlight: string;
    className?: string;
}

const Highlighter: React.FC<HighlighterProps> = ({ text, highlight, className = '' }) => {
    if (!highlight.trim()) {
        return <span className={className}>{text}</span>;
    }

    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return (
        <span className={className}>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark key={i} className="bg-yellow-200 dark:bg-yellow-900 text-gray-900 dark:text-gray-100 rounded-sm px-0.5">
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
};

export default Highlighter;
