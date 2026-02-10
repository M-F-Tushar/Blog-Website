import React from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Image,
  Link,
  Quote,
  Code,
  Table,
  AlertCircle,
  Type,
  TerminalSquare,
} from 'lucide-react';

interface MarkdownToolbarProps {
  onInsert: (text: string) => void;
}

const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ onInsert }) => {
  const tools = [
    { icon: Bold, label: 'Bold', action: '**bold text**' },
    { icon: Italic, label: 'Italic', action: '*italic text*' },
    { icon: Type, label: 'Heading', action: '## Heading' },
    { icon: Quote, label: 'Quote', action: '> quote' },
    { icon: List, label: 'List', action: '- list item' },
    { icon: ListOrdered, label: 'Ordered List', action: '1. list item' },
    { icon: Code, label: 'Code', action: '`code`' },
    { icon: TerminalSquare, label: 'Code Block', action: '```language\ncode block\n```' },
    { icon: Link, label: 'Link', action: '[link text](url)' },
    { icon: Image, label: 'Image', action: '![alt text](url)' },
    { icon: Table, label: 'Table', action: '| Header | Header |\n| --- | --- |\n| Cell | Cell |' },
    { icon: AlertCircle, label: 'Admonition', action: ':::note\nThis is a note\n:::' },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-elevated border-b border-white/10 rounded-t-md">
      {tools.map((tool, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onInsert(tool.action)}
          className="p-2 text-secondary-300 hover:bg-white/[0.06] hover:text-primary-300 rounded transition-colors duration-200"
          title={tool.label}
        >
          <tool.icon size={18} />
        </button>
      ))}
    </div>
  );
};

export default MarkdownToolbar;
