interface PaginatorProps {
  currentPage?: number;
  totalPages?: number;
  onPrevious?: () => void;
  onNext?: () => void;
}

const Paginator: React.FC<PaginatorProps> = ({
  currentPage = 1,
  totalPages = 1,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="flex items-center justify-center space-x-8 p-4 bg-white">
      <button
        onClick={onPrevious}
        disabled={currentPage <= 1}
        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &lt;
      </button>

      <span className="text-sm text-gray-600">
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &gt;
      </button>
    </div>
  );
};

export { Paginator };
