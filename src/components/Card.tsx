import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types/types';

interface CardProps {
  post: Post;
}

const Card: React.FC<CardProps> = ({ post }) => {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full group" aria-labelledby={`post-title-${post.id}`}>
      {post.coverImage && (
        <Link to={`/blog/${post.id}`} className="block overflow-hidden h-48" aria-label={`View ${post.title}`}>
          <img 
            src={post.coverImage} 
            alt={`Cover image for ${post.title}`} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <header className="flex-grow">
            <time className="text-sm text-gray-500 dark:text-gray-400" dateTime={post.date}>{post.date}</time>
            <h2 id={`post-title-${post.id}`} className="text-xl font-bold font-serif mt-2 mb-2 text-gray-900 dark:text-white">
            <Link to={`/blog/${post.id}`} className="hover:text-accent dark:hover:text-accent-light transition-colors" aria-label={`Read full article: ${post.title}`}>
                {post.title}
            </Link>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
            {post.excerpt}
            </p>
        </header>
        <footer className="mt-4">
          <Link to={`/blog/${post.id}`} className="font-semibold text-accent hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors" aria-label={`Read more about ${post.title}`}>
            Read More &rarr;
          </Link>
        </footer>
      </div>
    </article>
  );
};

export default Card;
