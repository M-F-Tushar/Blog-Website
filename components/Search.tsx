import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import Card from './Card';
import useSEO from '../hooks/useSEO';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { posts } = usePosts();
  
  useSEO(`Search results for "${query}"`, `Find posts related to your search query: ${query}.`);

  const filteredPosts = useMemo(() => {
    if (!query.trim()) {
      return [];
    }
    const lowerCaseQuery = query.toLowerCase();
    return posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(lowerCaseQuery) ||
        post.excerpt.toLowerCase().includes(lowerCaseQuery) ||
        post.content.toLowerCase().includes(lowerCaseQuery)
      );
    });
  }, [query, posts]);

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-white">
          Search Results
        </h1>
        {query && (
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Found {filteredPosts.length} results for: <span className="font-semibold text-accent">"{query}"</span>
          </p>
        )}
      </div>

      {query.trim() ? (
        filteredPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Card key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500 dark:text-gray-400">No posts found matching your search.</p>
          </div>
        )
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500 dark:text-gray-400">Please enter a term in the search bar to begin.</p>
        </div>
      )}
    </div>
  );
};

export default Search;