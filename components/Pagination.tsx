import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) {
    return null;
  }

  const baseButtonClasses = "px-4 py-2 mx-1 rounded-md transition-colors text-sm font-medium";
  const activeButtonClasses = "bg-accent text-white";
  const inactiveButtonClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600";
  const disabledButtonClasses = "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500";
  
  return (
    <nav className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseButtonClasses} ${currentPage === 1 ? disabledButtonClasses : inactiveButtonClasses}`}
      >
        &laquo; Prev
      </button>
      
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`${baseButtonClasses} ${currentPage === number ? activeButtonClasses : inactiveButtonClasses}`}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseButtonClasses} ${currentPage === totalPages ? disabledButtonClasses : inactiveButtonClasses}`}
      >
        Next &raquo;
      </button>
    </nav>
  );
};

export default Pagination;
