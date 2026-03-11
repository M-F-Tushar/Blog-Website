import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 px-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-200/30 dark:bg-accent-900/20 rounded-full blur-3xl animate-blob animation-delay-2000" />

      <div className="text-center relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[150px] md:text-[200px] font-bold font-serif leading-none text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 opacity-20 select-none">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="-mt-12 md:-mt-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-300 mb-8 max-w-md mx-auto">
            Oops! The page you are looking for might have been removed, had its name changed, or is
            temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/30"
            >
              <Home size={20} />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-200 border border-secondary-200 dark:border-secondary-700 rounded-full font-semibold hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
