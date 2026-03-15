import React, { useMemo } from 'react';
import { usePosts } from '../../hooks/usePosts';
import { useBookshelf } from '../../hooks/useBookshelf';
import { cosmic } from './ui/cosmicClassNames';

const AdminTopics: React.FC = () => {
  const { posts } = usePosts();
  const { entries } = useBookshelf();

  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((post) =>
      post.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1))
    );
    entries.forEach((entry) =>
      entry.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1))
    );
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [posts, entries]);

  return (
    <div className={cosmic.container}>
      <div className="mb-8 border-b border-white/[0.06] pb-6">
        <h1 className={cosmic.pageTitle}>Topics / Tags</h1>
        <p className="mt-2 text-sm text-secondary-400">
          A shared view of the ideas currently organizing the Garden and Bookshelf.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {topics.map(([topic, count]) => (
          <div key={topic} className="surface-subtle p-5">
            <h2 className="font-semibold text-secondary-50">{topic}</h2>
            <p className="mt-2 text-sm text-secondary-400">{count} linked entries</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTopics;
