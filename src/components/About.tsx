import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  Calendar,
  TrendingUp,
  Users,
  Briefcase,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import SEO from './common/SEO';
import { generatePersonSchema } from '../utils/seo';
import { useProfile } from '../hooks/useProfile';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePosts } from '../hooks/usePosts';
import { PostStatus } from '../types/types';
import { LoadingSpinner } from './common/LoadingSpinner';
import StructuredData from './common/StructuredData';
import { generatePersonSchema as generateJsonLdPerson } from '../utils/structuredData';

const About: React.FC = () => {
  const {
    authorName,
    authorBio,
    authorTagline,
    skills,
    timeline,
    achievements,
    socialLinks,
    loading: settingsLoading,
  } = useSiteSettings();
  const { photoUrl, loading: profileLoading } = useProfile();
  const { posts } = usePosts();

  const schema = useMemo(() => generatePersonSchema(), []);

  const structuredDataSchema = useMemo(
    () =>
      generateJsonLdPerson(
        {
          name: authorName,
          email: socialLinks?.email,
          url: 'https://m-f-tushar.github.io/Blog-Website',
        },
        'Web Developer',
        authorBio,
        socialLinks ? [socialLinks.github, socialLinks.linkedin].filter(Boolean) : []
      ),
    [authorName, authorBio, socialLinks]
  );



  // Calculate statistics

  // Calculate statistics
  const stats = useMemo(() => {
    const publishedPosts = posts.filter((p) => p.status === PostStatus.PUBLISHED);
    const totalWords = publishedPosts.reduce(
      (sum, post) => sum + post.content.split(/\s+/).length,
      0
    );
    const yearsActive = new Date().getFullYear() - 2020;

    return {
      postsWritten: publishedPosts.length,
      totalWords,
      yearsActive,
      categories: Array.from(new Set(publishedPosts.map((p) => p.category))).length,
    };
  }, [posts]);

  if (settingsLoading || profileLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SEO
        title={`About ${authorName}`}
        description={`Learn more about ${authorName}, web developer and CS student.`}
        image={photoUrl || 'https://mahirfaysaltusherblog.is-a.dev/images/og-image.jpg'}
      />
      <StructuredData data={structuredDataSchema} />
      <div className="space-y-24 pb-12">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 px-4 -mt-8 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-blob" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-200/20 dark:bg-accent-900/10 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
          </div>

          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-1 text-center md:text-left"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-secondary-800/50 backdrop-blur-sm border border-secondary-200 dark:border-secondary-700 mb-6">
                  <Sparkles size={16} className="text-accent-500" />
                  <span className="text-sm font-medium text-secondary-600 dark:text-secondary-300">
                    About Me
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold font-serif text-secondary-900 dark:text-white mb-6 leading-tight">
                  Hi, I&apos;m <span className="text-gradient">{authorName}</span>
                </h1>

                <p className="text-xl md:text-2xl text-secondary-600 dark:text-secondary-300 mb-8 leading-relaxed">
                  {authorTagline ||
                    'A passionate developer, lifelong learner, and technology enthusiast.'}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-accent-500 rounded-[2rem] rotate-6 opacity-20 blur-lg" />
                <img
                  src={photoUrl || 'https://m-f-tushar.github.io/Blog-Website/images/og-image.jpg'}
                  alt={authorName}
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-[2rem] object-cover shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-24">
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                label: 'Articles Written',
                value: stats.postsWritten,
                icon: <BookOpen size={24} />,
              },
              {
                label: 'Total Words',
                value: stats.totalWords.toLocaleString(),
                icon: <TrendingUp size={24} />,
              },
              {
                label: 'Years Active',
                value: `${stats.yearsActive}+`,
                icon: <Calendar size={24} />,
              },
              { label: 'Topics Covered', value: stats.categories, icon: <Users size={24} /> },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-lg border border-secondary-100 dark:border-secondary-700 text-center hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-secondary-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bio */}
          <div className="grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4 lg:col-span-3">
              <h2 className="text-3xl font-bold font-serif text-secondary-900 dark:text-white mb-6 sticky top-24">
                My Story
              </h2>
            </div>
            <div className="md:col-span-8 lg:col-span-9">
              <div className="prose prose-lg dark:prose-invert max-w-none text-secondary-600 dark:text-secondary-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{authorBio || ''}</ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <div className="grid md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-4 lg:col-span-3">
                <h2 className="text-3xl font-bold font-serif text-secondary-900 dark:text-white mb-6 sticky top-24">
                  Tech Stack
                </h2>
              </div>
              <div className="md:col-span-8 lg:col-span-9">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.05 * index }}
                      className="group bg-white dark:bg-secondary-800 p-6 rounded-2xl shadow-sm border border-secondary-200 dark:border-secondary-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                    >
                      <div className="font-semibold text-secondary-900 dark:text-white mb-3">
                        {skill.name}
                      </div>
                      <div className="w-full bg-secondary-100 dark:bg-secondary-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(skill.level / 5) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="bg-gradient-to-r from-primary-500 to-accent-500 h-full rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          {timeline && timeline.length > 0 && (
            <div className="grid md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-4 lg:col-span-3">
                <h2 className="text-3xl font-bold font-serif text-secondary-900 dark:text-white mb-6 sticky top-24">
                  Journey
                </h2>
              </div>
              <div className="md:col-span-8 lg:col-span-9">
                <div className="relative border-l-2 border-secondary-200 dark:border-secondary-800 ml-3 md:ml-0 space-y-12 pl-8 md:pl-12">
                  {timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * index }}
                      className="relative"
                    >
                      <div className="absolute -left-[41px] md:-left-[57px] top-0 p-2 bg-white dark:bg-secondary-950 border-2 border-secondary-200 dark:border-secondary-800 rounded-full">
                        <div
                          className={`p-1.5 rounded-full ${item.type === 'work'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            }`}
                        >
                          {item.type === 'work' ? (
                            <Briefcase size={16} />
                          ) : (
                            <GraduationCap size={16} />
                          )}
                        </div>
                      </div>

                      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700 hover:shadow-md transition-shadow">
                        <span className="inline-block px-3 py-1 rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 text-xs font-semibold mb-3">
                          {item.year}
                        </span>
                        <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-1">
                          {item.title}
                        </h3>
                        <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                          {item.organization}
                        </p>
                        <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <div className="grid md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-4 lg:col-span-3">
                <h2 className="text-3xl font-bold font-serif text-secondary-900 dark:text-white mb-6 sticky top-24">
                  Awards
                </h2>
              </div>
              <div className="md:col-span-8 lg:col-span-9">
                <div className="grid sm:grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700 flex items-start gap-4"
                    >
                      <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-xl">
                        <Award size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-secondary-900 dark:text-white mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          {achievement.issuer} • {achievement.year}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default About;
