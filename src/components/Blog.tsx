import React, { useState, useMemo } from 'react';
import Card from './Card';
import { usePosts } from '../hooks/usePosts';
import { PostStatus } from '../types/types';
import Pagination from './Pagination';
import useSEO from '../hooks/useSEO';

const POSTS_PER_PAGE = 6;

const Blog: React.FC = () => {
  useSEO('Blog', 'Read the latest articles on technology, life, and personal reflections.');
  const { posts } = usePosts();
  const [currentPage, setCurrentPage] = useState(1);
  
  const publishedPosts = useMemo(() => {
    return posts
      .filter(p => p.status === PostStatus.PUBLISHED)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts]);
  
  const totalPages = Math.ceil(publishedPosts.length / POSTS_PER_PAGE);
  
  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return publishedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [currentPage, publishedPosts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-white">From the Blog</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          My latest thoughts on technology, student life, and personal growth.
        </p>
      </div>
      
      {currentPosts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {currentPosts.map((post) => (
            <Card key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No posts published yet.</p>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Blog;
