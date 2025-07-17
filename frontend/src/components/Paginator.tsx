import { useState, useEffect } from 'react';

interface PaginatorProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const Paginator: React.FC<PaginatorProps> = ({
  currentPage: externalCurrentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(externalCurrentPage);

  useEffect(() => {
    setCurrentPage(externalCurrentPage);
  }, [externalCurrentPage]);

  useEffect(() => {
    onPageChange?.(currentPage);
  }, [currentPage]);

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="flex items-center justify-center space-x-8 p-4 bg-white">
      <button
        onClick={goToPrevious}
        disabled={currentPage <= 1}
        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &lt;
      </button>

      <span className="text-sm text-gray-600">
        <span className="underline font-medium">{currentPage}</span> /{' '}
        {totalPages}
      </span>

      <button
        onClick={goToNext}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &gt;
      </button>
    </div>
  );
};

export { Paginator };
