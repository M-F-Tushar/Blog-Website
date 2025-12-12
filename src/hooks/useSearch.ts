import { useState, useMemo } from 'react';
import { Post } from '../types';

interface UseSearchResult {
  query: string;
  setQuery: (query: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  filteredPosts: Post[];
  availableTags: string[];
}

export const useSearch = (posts: Post[]): UseSearchResult => {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags from posts
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  // Filter posts based on query and selected tags
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Filter by tags
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every((tag) => post.tags.includes(tag));
        if (!hasAllTags) return false;
      }

      // Filter by query
      if (!query.trim()) return true;

      const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
      const title = (post.title || '').toLowerCase();
      const content = (post.content || '').toLowerCase();
      const excerpt = (post.excerpt || '').toLowerCase();

      // Check if all search terms match either title, content, or excerpt
      return searchTerms.every(
        (term) => title.includes(term) || content.includes(term) || excerpt.includes(term)
      );
    });
  }, [posts, query, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return {
    query,
    setQuery,
    selectedTags,
    toggleTag,
    filteredPosts,
    availableTags,
  };
};

export default useSearch;
