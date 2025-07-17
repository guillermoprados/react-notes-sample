import { useState } from 'react';
import { PaginationMeta } from '../types/api';

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

export const usePagination = (options: UsePaginationOptions = {}) => {
  const { initialPage = 1, initialPageSize = 10 } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentPageSize, setCurrentPageSize] = useState(initialPageSize);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const setPageSize = (size: number) => {
    setCurrentPageSize(size);
    setCurrentPage(1);
  };

  const reset = () => {
    setCurrentPage(initialPage);
    setCurrentPageSize(initialPageSize);
  };

  return {
    currentPage,
    currentPageSize,

    goToPage,
    goToNextPage,
    goToPreviousPage,
    setPageSize,
    reset,
  };
};
