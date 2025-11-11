import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types/types';

interface CardProps {
  post: Post;
}

const Card: React.FC<CardProps> = ({ post }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full group">
      {post.coverImage && (
        <Link to={`/blog/${post.id}`} className="block overflow-hidden h-48">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
            <p className="text-sm text-gray-500 dark:text-gray-400">{post.date}</p>
            <h2 className="text-xl font-bold font-serif mt-2 mb-2 text-gray-900 dark:text-white">
            <Link to={`/blog/${post.id}`} className="hover:text-accent dark:hover:text-accent-light transition-colors">
                {post.title}
            </Link>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
            {post.excerpt}
            </p>
        </div>
        <div className="mt-4">
          <Link to={`/blog/${post.id}`} className="font-semibold text-accent hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors">
            Read More &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
