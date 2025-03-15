import { ChevronLeft, ChevronRight } from 'lucide-react';

export type PaginationProps = {
  page: number;
  totalSize: number;
  limit: number;
  onNext: () => void;
  onPrevious: () => void;
};

const Pagination: React.FC<PaginationProps> = ({
  limit,
  page,
  totalSize,
  onNext,
  onPrevious,
}) => {
  return (
    <nav className="flex justify-center gap-2 pb-4">
      <button
        className="py-1 px-2 rounded-sm text-gray-900 bg-white hover:bg-gray-100  disabled:hover:bg-transparent disabled:text-gray-400"
        disabled={page === 1}
        onClick={onPrevious}
      >
        <ChevronLeft className="w-4 h-4 text-" />
      </button>
      <button className="py-1 px-3 rounded-sm text-white bg-gray-800">
        {page}
      </button>
      <button
        className="py-1 px-2 rounded-sm text-gray-900 bg-white hover:bg-gray-100  disabled:hover:bg-transparent disabled:text-gray-400"
        disabled={totalSize <= limit * page}
        onClick={onNext}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};

export default Pagination;
