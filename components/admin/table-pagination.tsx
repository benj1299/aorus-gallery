'use client';

interface TablePaginationProps {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({
  totalItems,
  totalPages,
  currentPage,
  onPageChange,
}: TablePaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        {totalItems} resultat{totalItems !== 1 ? 's' : ''}
      </p>
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 text-sm bg-white text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Precedent
          </button>
          <span className="text-sm text-gray-500">
            {currentPage} / {totalPages}
          </span>
          <button
            className="px-3 py-1.5 text-sm bg-white text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
