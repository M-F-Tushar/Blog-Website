import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Eye,
  Edit,
  Save,
  X,
  Split,
  Maximize2,
  Minimize2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Image,
  Table,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Youtube,
  Twitter,
  FileCode,
  FileText,
  Upload,
  Clock,
  Search,
  ChevronDown,
  Undo,
  Redo,
  Keyboard,
  FileUp,
  Hash,
  Minus,
  CheckSquare,
} from 'lucide-react';
import { usePosts } from '../hooks/usePosts';
import { PostStatus } from '../types/types';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { isSupabaseConfigured } from '../services/supabase';
import { uploadImage, generateUniqueFilename } from '../services/supabaseStorageService';
import MarkdownRenderer from './markdown/MarkdownRenderer';
import { DEFAULT_AVATAR } from '../constants/constants';

interface ToolbarButton {
  icon: React.FC<{ size?: number; className?: string }>;
  label: string;
  action: string | (() => void);
  shortcut?: string;
}

interface ToolbarDropdown {
  icon: React.FC<{ size?: number; className?: string }>;
  label: string;
  items: { label: string; action: string }[];
}

const CreatePost: React.FC = () => {
  const { postId } = useParams<{ postId?: string }>();
  const isEditMode = Boolean(postId);
  const { posts, addPost, updatePost } = usePosts();
  const { categories, authorName, seo } = useSiteSettings();
  const navigate = useNavigate();
  const supabaseEnabled = isSupabaseConfigured();

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0] || '');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<PostStatus>(PostStatus.DRAFT);
  const [coverImage, setCoverImage] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [isDragging, setIsDragging] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedContentRef = useRef<string>('');

  // Load post for editing
  useEffect(() => {
    if (isEditMode && postId) {
      const postToEdit = posts.find((p) => p.id === postId);
      if (postToEdit) {
        setTitle(postToEdit.title);
        setContent(postToEdit.content);
        setCategory(postToEdit.category);
        setTags(postToEdit.tags.join(', '));
        setStatus(postToEdit.status);
        setCoverImage(postToEdit.coverImage || '');
        lastSavedContentRef.current = postToEdit.content;
      }
    } else {
      // Load draft from localStorage
      const draft = localStorage.getItem('post-draft');
      if (draft && !isEditMode) {
        try {
          const parsed = JSON.parse(draft);
          if (window.confirm('Restore unsaved draft?')) {
            setTitle(parsed.title || '');
            setContent(parsed.content || '');
            setCategory(parsed.category || categories[0] || '');
            setTags(parsed.tags || '');
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [postId, isEditMode, posts, categories]);

  // Auto-save draft
  useEffect(() => {
    if (!isEditMode && content !== lastSavedContentRef.current) {
      setAutoSaveStatus('unsaved');

      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {
        const draft = { title, content, category, tags };
        localStorage.setItem('post-draft', JSON.stringify(draft));
        lastSavedContentRef.current = content;
        setAutoSaveStatus('saved');
      }, 2000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [title, content, category, tags, isEditMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            handleInsert('**', '**');
            break;
          case 'i':
            e.preventDefault();
            handleInsert('*', '*');
            break;
          case 'k':
            e.preventDefault();
            handleInsert('[', '](url)');
            break;
          case 's':
            e.preventDefault();
            handleSubmit(new Event('submit') as unknown as React.FormEvent);
            break;
          case 'z':
            e.preventDefault();
            handleUndo();
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'p':
            e.preventDefault();
            setViewMode((v) => (v === 'preview' ? 'edit' : 'preview'));
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content]);

  // Reading time calculation
  const readingTime = useMemo(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / 200);
    return { words, minutes };
  }, [content]);

  // Table of contents
  const tableOfContents = useMemo(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const toc: { level: number; text: string; id: string }[] = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      toc.push({
        level: match[1].length,
        text: match[2],
        id: match[2].toLowerCase().replace(/\s+/g, '-'),
      });
    }
    return toc;
  }, [content]);

  const handleInsert = useCallback(
    (prefix: string, suffix: string = '') => {
      if (!textareaRef.current) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end) || 'text';

      // Save to undo stack
      setUndoStack((prev) => [...prev.slice(-20), content]);
      setRedoStack([]);

      const newContent =
        content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
      setContent(newContent);

      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + prefix.length + selectedText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [content]
  );

  const handleInsertText = useCallback(
    (text: string) => {
      if (!textareaRef.current) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;

      setUndoStack((prev) => [...prev.slice(-20), content]);
      setRedoStack([]);

      const newContent = content.substring(0, start) + text + content.substring(start);
      setContent(newContent);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    },
    [content]
  );

  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousContent = undoStack[undoStack.length - 1];
      setUndoStack((prev) => prev.slice(0, -1));
      setRedoStack((prev) => [...prev, content]);
      setContent(previousContent);
    }
  }, [undoStack, content]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextContent = redoStack[redoStack.length - 1];
      setRedoStack((prev) => prev.slice(0, -1));
      setUndoStack((prev) => [...prev, content]);
      setContent(nextContent);
    }
  }, [redoStack, content]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((f) => f.type.startsWith('image/'));
      const textFiles = files.filter((f) => f.name.endsWith('.md') || f.name.endsWith('.txt'));

      // Handle image drops
      for (const file of imageFiles) {
        if (!supabaseEnabled) {
          alert('Supabase required for image upload');
          continue;
        }
        try {
          setIsUploading(true);
          const filename = generateUniqueFilename(file.name);
          const path = `posts/${filename}`;
          const publicURL = await uploadImage(file, path, (p) => setUploadProgress(p.progress));
          handleInsertText(`\n![${file.name}](${publicURL})\n`);
        } catch {
          alert('Failed to upload image');
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      }

      // Handle text/markdown file drops
      for (const file of textFiles) {
        const text = await file.text();
        handleInsertText(text);
      }
    },
    [supabaseEnabled, handleInsertText]
  );

  // File import
  const handleFileImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.md') || file.name.endsWith('.txt') || file.name.endsWith('.html')) {
      const text = await file.text();

      if (file.name.endsWith('.html')) {
        // Simple HTML to markdown conversion
        const markdown = text
          .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
          .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
          .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
          .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
          .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
          .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
          .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
          .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
          .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
          .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
          .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (_, items) =>
            items.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
          )
          .replace(/<ol[^>]*>(.*?)<\/ol>/gis, (_, items) => {
            let counter = 0;
            return items.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${++counter}. $1\n`);
          })
          .replace(/<[^>]+>/g, '')
          .trim();
        setContent((prev) => prev + '\n' + markdown);
      } else {
        setContent((prev) => prev + '\n' + text);
      }
    }

    e.target.value = '';
  }, []);

  // Image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!supabaseEnabled) {
      alert('Supabase is not configured. Please use image URLs instead.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB.');
      return;
    }

    try {
      setIsUploading(true);
      const filename = generateUniqueFilename(file.name);
      const path = `posts/${filename}`;
      const publicURL = await uploadImage(file, path, (progress) => {
        setUploadProgress(progress.progress);
      });
      setCoverImage(publicURL);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Embed handler
  const handleEmbed = useCallback(() => {
    if (!embedUrl) return;

    let embedCode = '';

    // YouTube
    if (embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be')) {
      const videoId = embedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
      if (videoId) {
        embedCode = `\n<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>\n`;
      }
    }
    // Twitter/X
    else if (embedUrl.includes('twitter.com') || embedUrl.includes('x.com')) {
      embedCode = `\n<blockquote class="twitter-tweet"><a href="${embedUrl}"></a></blockquote>\n`;
    }
    // CodePen
    else if (embedUrl.includes('codepen.io')) {
      const match = embedUrl.match(/codepen\.io\/([^/]+)\/pen\/([^/?]+)/);
      if (match) {
        embedCode = `\n<iframe height="400" style="width: 100%;" scrolling="no" src="https://codepen.io/${match[1]}/embed/${match[2]}" frameborder="no"></iframe>\n`;
      }
    }
    // Generic iframe
    else {
      embedCode = `\n<iframe src="${embedUrl}" width="100%" height="400" frameborder="0"></iframe>\n`;
    }

    handleInsertText(embedCode);
    setEmbedUrl('');
    setShowEmbedModal(false);
  }, [embedUrl, handleInsertText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category) {
      alert('Please fill in Title, Content, and Category.');
      return;
    }

    const postData = {
      title,
      content,
      category,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      status,
      coverImage,
      excerpt: content.substring(0, 150) + '...',
      author: {
        name: authorName || 'Admin',
        avatar: DEFAULT_AVATAR,
      },
      readTime: `${readingTime.minutes} min read`,
    };

    try {
      setIsSaving(true);
      if (isEditMode && postId) {
        await updatePost(postId, postData);
      } else {
        await addPost(postData);
        localStorage.removeItem('post-draft');
      }
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClasses =
    'w-full px-3 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200';
  const labelClasses = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';
  const toolBtnClasses =
    'p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors';

  return (
    <div className="max-w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold font-serif text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Post' : 'New Post'}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>
              {readingTime.words} words • {readingTime.minutes} min read
            </span>
          </div>
          {autoSaveStatus === 'saving' && (
            <span className="text-xs text-yellow-600">Saving draft...</span>
          )}
          {autoSaveStatus === 'saved' && !isEditMode && (
            <span className="text-xs text-green-600">Draft saved</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex border rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1.5 text-sm ${viewMode === 'edit' ? 'bg-accent text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
              title="Edit only"
            >
              <Edit size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 text-sm ${viewMode === 'split' ? 'bg-accent text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
              title="Split view"
            >
              <Split size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 text-sm ${viewMode === 'preview' ? 'bg-accent text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
              title="Preview only"
            >
              <Eye size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            title="Keyboard shortcuts"
          >
            <Keyboard size={18} />
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="absolute right-4 top-16 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border p-4 w-72">
          <h3 className="font-semibold mb-3">Keyboard Shortcuts</h3>
          <div className="space-y-2 text-sm">
            {[
              ['Ctrl+B', 'Bold'],
              ['Ctrl+I', 'Italic'],
              ['Ctrl+K', 'Insert link'],
              ['Ctrl+S', 'Save post'],
              ['Ctrl+Z', 'Undo'],
              ['Ctrl+Y', 'Redo'],
              ['Ctrl+Shift+P', 'Toggle preview'],
            ].map(([key, action]) => (
              <div key={key} className="flex justify-between">
                <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{key}</code>
                <span className="text-gray-500">{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row">
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Title Input */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title..."
              className="w-full text-3xl font-bold font-serif bg-transparent border-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-400"
              required
            />
          </div>

          {/* Enhanced Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
            {/* Undo/Redo */}
            <button
              type="button"
              onClick={handleUndo}
              className={toolBtnClasses}
              title="Undo (Ctrl+Z)"
              aria-label="Undo (Ctrl+Z)"
              disabled={undoStack.length === 0}
            >
              <Undo size={16} />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              className={toolBtnClasses}
              title="Redo (Ctrl+Y)"
              aria-label="Redo (Ctrl+Y)"
              disabled={redoStack.length === 0}
            >
              <Redo size={16} />
            </button>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

            {/* Text Formatting */}
            <button
              type="button"
              onClick={() => handleInsert('**', '**')}
              className={toolBtnClasses}
              title="Bold (Ctrl+B)"
              aria-label="Bold (Ctrl+B)"
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleInsert('*', '*')}
              className={toolBtnClasses}
              title="Italic (Ctrl+I)"
              aria-label="Italic (Ctrl+I)"
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleInsert('~~', '~~')}
              className={toolBtnClasses}
              title="Strikethrough"
              aria-label="Strikethrough"
            >
              <Strikethrough size={16} />
            </button>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

            {/* Headings */}
            <button
              type="button"
              onClick={() => handleInsertText('\n# ')}
              className={toolBtnClasses}
              title="Heading 1"
              aria-label="Heading 1"
            >
              <Heading1 size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleInsertText('\n## ')}
              className={toolBtnClasses}
              title="Heading 2"
              aria-label="Heading 2"
            >
              <Heading2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleInsertText('\n### ')}
              className={toolBtnClasses}
              title="Heading 3"
              aria-label="Heading 3"
            >
              <Heading3 size={16} />
            </button>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

            {/* Lists */}
            <button
              type="button"
              onClick={() => handleInsertText('\n- ')}
              className={toolBtnClasses}
              title="Bullet list"
              aria-label="Bullet list"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleInsertText('\n1. ')}
              className={toolBtnClasses}
              title="Numbered list"
              aria-label="Numbered list"
            >
              <ListOrdered size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleInsertText('\n- [ ] ')}
              className={toolBtnClasses}
              title="Checklist"
              aria-label="Checklist"
            >
              <CheckSquare size={16} />
            </button>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

            {/* Blocks */}
            <button
              type="button"
              onClick={() => handleInsertText('\n> ')}
              className={toolBtnClasses}
              title="Quote"
              aria-label="Quote"
            >
              <Quote size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleInsert('`', '`')}
              className={toolBtnClasses}
              title="Inline code"
              aria-label="Inline code"
            >
              <Code size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleInsertText('\n```\n\n```')}
              className={toolBtnClasses}
              title="Code block"
              aria-label="Code block"
            >
              <FileCode size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleInsertText('\n---\n')}
              className={toolBtnClasses}
              title="Horizontal rule"
              aria-label="Horizontal rule"
            >
              <Minus size={16} />
            </button>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

            {/* Links & Media */}
            <button
              type="button"
              onClick={() => handleInsert('[', '](url)')}
              className={toolBtnClasses}
              title="Link (Ctrl+K)"
              aria-label="Insert link (Ctrl+K)"
            >
              <Link2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleInsertText('\n![alt](url)')}
              className={toolBtnClasses}
              title="Image"
              aria-label="Insert image"
            >
              <Image size={16} />
            </button>
            <button
              type="button"
              onClick={() =>
                handleInsertText('\n| Header | Header |\n| --- | --- |\n| Cell | Cell |')
              }
              className={toolBtnClasses}
              title="Table"
              aria-label="Insert table"
            >
              <Table size={16} />
            </button>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

            {/* Embed */}
            <button
              type="button"
              onClick={() => setShowEmbedModal(true)}
              className={toolBtnClasses}
              title="Embed YouTube/Twitter/CodePen"
              aria-label="Embed YouTube/Twitter/CodePen"
            >
              <Youtube size={16} />
            </button>

            {/* Import */}
            <label
              className={`${toolBtnClasses} cursor-pointer`}
              title="Import file (.md, .txt, .html)"
              aria-label="Import file (.md, .txt, .html)"
            >
              <FileUp size={16} />
              <input
                type="file"
                accept=".md,.txt,.html"
                onChange={handleFileImport}
                className="hidden"
                aria-label="Import markdown or text file"
              />
            </label>
          </div>

          {/* Editor Content */}
          <div
            className={`flex-1 flex ${viewMode === 'split' ? 'flex-row' : 'flex-col'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Editor */}
            {viewMode !== 'preview' && (
              <div
                className={`${viewMode === 'split' ? 'w-1/2 border-r border-gray-200 dark:border-gray-700' : 'flex-1'} relative`}
              >
                {isDragging && (
                  <div className="absolute inset-0 bg-accent/20 border-2 border-dashed border-accent z-10 flex items-center justify-center">
                    <div className="text-accent font-medium">
                      Drop files here (images or markdown)
                    </div>
                  </div>
                )}
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your content in Markdown..."
                  className="w-full h-[500px] p-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                  required
                />
              </div>
            )}

            {/* Preview */}
            {viewMode !== 'edit' && (
              <div
                className={`${viewMode === 'split' ? 'w-1/2' : 'flex-1'} h-[500px] overflow-y-auto p-6 bg-white dark:bg-gray-900`}
              >
                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-200 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-accent">
                  <MarkdownRenderer content={content} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 p-4 space-y-4">
          {/* Cover Image */}
          <div>
            <label className={labelClasses}>Cover Image</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className={inputClasses}
              placeholder="Image URL..."
            />
            {supabaseEnabled && (
              <label className="mt-2 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-md cursor-pointer hover:border-accent transition-colors">
                <Upload size={16} />
                <span className="text-sm">Upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            )}
            {isUploading && (
              <div className="mt-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover"
                className="mt-2 w-full h-32 object-cover rounded-md"
              />
            )}
          </div>

          {/* Category */}
          <div>
            <label className={labelClasses}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClasses}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className={labelClasses}>Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={inputClasses}
              placeholder="react, typescript, tutorial"
            />
          </div>

          {/* Status */}
          <div>
            <label className={labelClasses}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PostStatus)}
              className={inputClasses}
            >
              <option value={PostStatus.DRAFT}>Draft</option>
              <option value={PostStatus.PUBLISHED}>Published</option>
            </select>
          </div>

          {/* SEO Preview */}
          <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Search size={14} /> SEO Preview
            </label>
            <div className="text-sm">
              <p className="text-blue-600 dark:text-blue-400 truncate font-medium">
                {title || 'Post Title'}
              </p>
              <p className="text-green-700 dark:text-green-500 text-xs truncate">
                yoursite.com/blog/{title ? title.toLowerCase().replace(/\s+/g, '-') : 'post-slug'}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 mt-1">
                {content.substring(0, 160) || 'Post description will appear here...'}
              </p>
            </div>
          </div>

          {/* Table of Contents */}
          {tableOfContents.length > 0 && (
            <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Hash size={14} /> Table of Contents
              </label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {tableOfContents.map((item, i) => (
                  <div
                    key={i}
                    className="text-xs text-gray-600 dark:text-gray-400 truncate"
                    style={{ paddingLeft: `${(item.level - 1) * 8}px` }}
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="w-full px-4 py-3 bg-accent text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : isEditMode ? 'Update Post' : 'Publish Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              disabled={isSaving}
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      </form>

      {/* Embed Modal */}
      {showEmbedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Embed Content</h3>
            <p className="text-sm text-gray-500 mb-3">
              Paste a URL from YouTube, Twitter/X, or CodePen
            </p>
            <input
              type="url"
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className={inputClasses}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowEmbedModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEmbed}
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-indigo-700"
              >
                Embed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
