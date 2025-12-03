import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useSwipeGesture } from '../../hooks/useSwipeGesture';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, children, title }) => {
  const drawerRef = useFocusTrap<HTMLDivElement>(isOpen);
  const swipeRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when drawer is open
  useBodyScrollLock(isOpen);

  // Swipe to close gesture
  useSwipeGesture(swipeRef, {
    onSwipeRight: onClose,
    threshold: 100,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Mobile menu'}
          >
            <div ref={swipeRef} className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                {title && (
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                  </h2>
                )}
                <button
                  onClick={onClose}
                  className="ml-auto p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Close menu"
                  style={{ minWidth: '48px', minHeight: '48px' }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
