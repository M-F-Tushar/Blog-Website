import React, { useMemo } from 'react';
import { marked } from 'marked';
import { motion } from 'framer-motion';
import {
  Code, Database, Globe, Smartphone, Award, BookOpen,
  Calendar, TrendingUp, Users, Download, Briefcase, GraduationCap
} from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { useProfile } from '../hooks/useProfile';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePosts } from '../hooks/usePosts';
import { PostStatus } from '../types/types';
import { LoadingSpinner } from './common/LoadingSpinner';

interface TimelineItem {
  year: string;
  title: string;
  organization: string;
  description: string;
  type: 'work' | 'education';
}

interface Skill {
  name: string;
  level: number; // 1-5
  icon: React.ReactNode;
}

const timeline: TimelineItem[] = [
  {
    year: '2024',
    title: 'Full Stack Developer',
    organization: 'Tech Company',
    description: 'Building modern web applications with React, TypeScript, and Node.js',
    type: 'work'
  },
  {
    year: '2023',
    title: 'Computer Science Student',
    organization: 'University',
    description: 'Studying algorithms, data structures, and software engineering',
    type: 'education'
  },
  {
    year: '2022',
    title: 'Started Blogging',
    organization: 'Personal Project',
    description: 'Sharing knowledge about web development and programming',
    type: 'work'
  },
  {
    year: '2020',
    title: 'First Programming Course',
    organization: 'Online Learning',
    description: 'Learned fundamentals of programming with Python',
    type: 'education'
  }
];

const skills: Skill[] = [
  { name: 'React & TypeScript', level: 5, icon: <Code size={24} /> },
  { name: 'Node.js & Express', level: 4, icon: <Database size={24} /> },
  { name: 'Web Development', level: 5, icon: <Globe size={24} /> },
  { name: 'Responsive Design', level: 5, icon: <Smartphone size={24} /> },
  { name: 'Git & GitHub', level: 4, icon: <Code size={24} /> },
  { name: 'Tailwind CSS', level: 5, icon: <Globe size={24} /> }
];

const About: React.FC = () => {
  const { authorName, authorBio, authorTagline, loading: settingsLoading } = useSiteSettings();
  const { photoUrl, loading: profileLoading } = useProfile();
  const { posts } = usePosts();

  useSEO({
    title: `About ${authorName}`,
    description: `Learn more about ${authorName}, web developer and CS student.`,
    image: photoUrl || 'https://m-f-tushar.github.io/Blog-Website/images/og-image.jpg'
  });

  const renderedBio = useMemo(() => {
    if (authorBio) {
      return { __html: marked.parse(authorBio) };
    }
    return { __html: '' };
  }, [authorBio]);

  // Calculate statistics
  const stats = useMemo(() => {
    const publishedPosts = posts.filter(p => p.status === PostStatus.PUBLISHED);
    const totalWords = publishedPosts.reduce((sum, post) => sum + post.content.split(/\s+/).length, 0);
    const yearsActive = new Date().getFullYear() - 2020;

    return {
      postsWritten: publishedPosts.length,
      totalWords,
      yearsActive,
      categories: Array.from(new Set(publishedPosts.map(p => p.category))).length
    };
  }, [posts]);

  if (settingsLoading || profileLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 md:p-12"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            src={photoUrl}
            alt={authorName}
            className="w-48 h-48 rounded-full object-cover shadow-2xl ring-4 ring-white dark:ring-gray-800"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 dark:text-white mb-4">
              Hi, I'm {authorName}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              {authorTagline || 'A passionate developer, lifelong learner, and technology enthusiast.'}
            </p>
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              <Download size={20} />
              Download Resume
            </a>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Articles Written', value: stats.postsWritten, icon: <BookOpen size={24} /> },
          { label: 'Total Words', value: stats.totalWords.toLocaleString(), icon: <TrendingUp size={24} /> },
          { label: 'Years Active', value: `${stats.yearsActive}+`, icon: <Calendar size={24} /> },
          { label: 'Topics Covered', value: stats.categories, icon: <Users size={24} /> }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 text-accent rounded-lg mb-3">
              {stat.icon}
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bio */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About Me</h2>
        <div
          className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
          dangerouslySetInnerHTML={renderedBio}
        />
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Skills & Technologies
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-accent/10 text-accent rounded-lg">
                  {skill.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {skill.name}
                </h3>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full ${i < skill.level
                        ? 'bg-accent'
                        : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          My Journey
        </h2>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-accent rounded-full -ml-2 ring-4 ring-white dark:ring-gray-900 z-10" />

                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} pl-16 md:pl-0`}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${item.type === 'work'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        }`}>
                        {item.type === 'work' ? <Briefcase size={20} /> : <GraduationCap size={20} />}
                      </div>
                      <span className="text-sm font-semibold text-accent">
                        {item.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {item.organization}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Achievements & Certifications
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'React Developer Certification', issuer: 'Online Platform', year: '2023' },
            { title: 'Full Stack Web Development', issuer: 'Bootcamp', year: '2022' },
            { title: 'Open Source Contributor', issuer: 'GitHub', year: '2023' },
            { title: 'Technical Writing Award', issuer: 'Community', year: '2024' }
          ].map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md flex items-start gap-4"
            >
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg">
                <Award size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {achievement.issuer} • {achievement.year}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;