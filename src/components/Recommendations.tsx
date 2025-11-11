import React from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import { Recommendation } from '../types/types';
import useSEO from '../hooks/useSEO';
import { LoadingSpinner } from './common/LoadingSpinner';
import { EmptyState } from './common/EmptyState';

const RecommendationCard: React.FC<{ item: Recommendation }> = ({ item }) => {
  const typeColorMap: { [key: string]: string } = {
    Article: 'bg-blue-500',
    Book: 'bg-green-500',
    Tool: 'bg-purple-500',
    Video: 'bg-red-500',
    Course: 'bg-yellow-500 text-black',
  };

  const badgeClasses = `text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white ${typeColorMap[item.type] || 'bg-gray-500'}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
      <div className="flex-grow">
        <div className="mb-4">
          <span className={badgeClasses}>
            {item.type}
          </span>
        </div>
        <h3 className="text-xl font-bold font-serif text-gray-900 dark:text-white mb-2">{item.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
      </div>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-accent font-semibold hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors"
      >
        Visit Resource &rarr;
      </a>
    </div>
  );
};

const Recommendations: React.FC = () => {
  useSEO('Recommendations', 'A curated list of articles, tools, books, and other valuable resources recommended by Mahir Faysal Tushar.');
  const { recommendations, loading, error } = useRecommendations();

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-white">Recommendations</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Error Loading Recommendations"
        description={error}
      />
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-white">Recommendations</h1>
        <EmptyState
          icon="⭐"
          title="No Recommendations Yet"
          description="I'll be adding my favorite tools, resources, and content soon!"
          actionLabel="Go Home"
          actionLink="/"
        />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-white">My Recommendations</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          A curated list of articles, tools, and resources I've found valuable.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((item) => (
          <RecommendationCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Recommendations;