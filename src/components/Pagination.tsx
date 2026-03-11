import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults?: number;
  resultsPerPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
  resultsPerPage = 6,
}) => {
  const [jumpToPage, setJumpToPage] = useState('');

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle if not typing in an input
      if (document.activeElement?.tagName === 'INPUT') return;

      switch (e.key) {
        case 'ArrowLeft':
          if (currentPage > 1) {
            e.preventDefault();
            onPageChange(currentPage - 1);
          }
          break;
        case 'ArrowRight':
          if (currentPage < totalPages) {
            e.preventDefault();
            onPageChange(currentPage + 1);
          }
          break;
        case 'Home':
          e.preventDefault();
          onPageChange(1);
          break;
        case 'End':
          e.preventDefault();
          onPageChange(totalPages);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages, onPageChange]);

  // Generate smart page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if near start
      if (currentPage <= 3) {
        endPage = 4;
      }

      // Adjust if near end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpToPage('');
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  const baseButtonClasses =
    'px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-gray-900';
  const activeButtonClasses = 'bg-accent text-white shadow-md hover:bg-indigo-700';
  const inactiveButtonClasses =
    'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600';
  const disabledButtonClasses =
    'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500';

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center space-y-4 mt-8">
      {/* Results count */}
      {totalResults !== undefined && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold">{(currentPage - 1) * resultsPerPage + 1}</span> to{' '}
          <span className="font-semibold">
            {Math.min(currentPage * resultsPerPage, totalResults)}
          </span>{' '}
          of <span className="font-semibold">{totalResults}</span> results
        </p>
      )}

      {/* Pagination controls */}
      <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`${baseButtonClasses} ${currentPage === 1 ? disabledButtonClasses : inactiveButtonClasses}`}
          aria-label="First page"
          title="First page (Home)"
        >
          <ChevronsLeft size={18} />
        </button>

        {/* Previous page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${baseButtonClasses} ${currentPage === 1 ? disabledButtonClasses : inactiveButtonClasses}`}
          aria-label="Previous page"
          title="Previous page (←)"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-500 dark:text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`${baseButtonClasses} ${currentPage === page ? activeButtonClasses : inactiveButtonClasses}`}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}

        {/* Next page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${baseButtonClasses} ${currentPage === totalPages ? disabledButtonClasses : inactiveButtonClasses}`}
          aria-label="Next page"
          title="Next page (→)"
        >
          <ChevronRight size={18} />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`${baseButtonClasses} ${currentPage === totalPages ? disabledButtonClasses : inactiveButtonClasses}`}
          aria-label="Last page"
          title="Last page (End)"
        >
          <ChevronsRight size={18} />
        </button>
      </nav>

      {/* Jump to page */}
      {totalPages > 7 && (
        <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
          <label htmlFor="jump-to-page" className="text-sm text-gray-600 dark:text-gray-400">
            Jump to page:
          </label>
          <input
            id="jump-to-page"
            type="number"
            min="1"
            max={totalPages}
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder={`1-${totalPages}`}
          />
          <button
            type="submit"
            className="px-3 py-1 text-sm bg-accent text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Go
          </button>
        </form>
      )}

      {/* Keyboard shortcuts hint */}
      <p className="text-xs text-gray-500 dark:text-gray-500 hidden sm:block">
        Use arrow keys (← →), Home, or End to navigate
      </p>
    </div>
  );
};

export default Pagination;
