import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import Card from './Card';
import { PostStatus } from '../types';
import useSEO from '../hooks/useSEO';

const TagPage: React.FC = () => {
  const { tagName } = useParams<{ tagName: string }>();
  useSEO(`Posts tagged with "${tagName}"`, `Find all articles and posts tagged with "${tagName}".`);
  const { posts } = usePosts();

  const filteredPosts = useMemo(() => {
    if (!tagName) return [];
    return posts.filter(post => 
      post.status === PostStatus.PUBLISHED && post.tags.includes(tagName)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts, tagName]);

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-white">
          Posts Tagged: <span className="text-accent">#{tagName}</span>
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found.
        </p>
      </div>
      
      {filteredPosts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map(post => (
            <Card key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No posts found with this tag.
          </p>
        </div>
      )}

      <div className="text-center mt-8">
          <Link to="/tags" className="text-accent hover:underline">
              &larr; Back to all tags
          </Link>
      </div>
    </div>
  );
};

export default TagPage;