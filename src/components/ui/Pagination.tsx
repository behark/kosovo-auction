import React from 'react';
import useKeyboardAccessible from '@/hooks/useKeyboardAccessible';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = '',
}) => {
  const { getAccessibleProps } = useKeyboardAccessible();

  // Generate page numbers array with ellipsis
  const generatePaginationItems = () => {
    // Always show first page, last page, current page, and pages around current page
    const items: (number | 'ellipsis')[] = [];

    // Calculate range
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Whether to show ellipsis
    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    // Always add page 1
    items.push(1);

    // Add left ellipsis if needed
    if (showLeftEllipsis) {
      items.push('ellipsis');
    }

    // Add middle pages
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) {
        items.push(i);
      }
    }

    // Add right ellipsis if needed
    if (showRightEllipsis) {
      items.push('ellipsis');
    }

    // Always add last page if there's more than one page
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  };

  // Don't render if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  const paginationItems = generatePaginationItems();

  return (
    <nav aria-label="Pagination" className={`flex justify-center my-8 ${className}`}>
      <ul className="flex items-center space-x-1">
        {/* Previous button */}
        <li>
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className={`
              flex items-center justify-center w-10 h-10 rounded-md
              focus:outline-none focus:ring-2 focus:ring-primary-500
              ${currentPage === 1 
                ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed' 
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }
            `}
            aria-label="Go to previous page"
            {...getAccessibleProps(() => onPageChange(Math.max(currentPage - 1, 1)))}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </li>
        
        {/* Page numbers */}
        {paginationItems.map((item, index) => (
          <li key={index}>
            {item === 'ellipsis' ? (
              <span className="flex items-center justify-center w-10 h-10 text-neutral-500 dark:text-neutral-400">
                …
              </span>
            ) : (
              <button
                onClick={() => onPageChange(item)}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-md
                  focus:outline-none focus:ring-2 focus:ring-primary-500
                  ${item === currentPage 
                    ? 'bg-primary-600 text-white font-medium' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }
                `}
                aria-label={`Go to page ${item}`}
                aria-current={item === currentPage ? 'page' : undefined}
                {...getAccessibleProps(() => onPageChange(item))}
              >
                {item}
              </button>
            )}
          </li>
        ))}

        {/* Next button */}
        <li>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`
              flex items-center justify-center w-10 h-10 rounded-md
              focus:outline-none focus:ring-2 focus:ring-primary-500
              ${currentPage === totalPages 
                ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed' 
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }
            `}
            aria-label="Go to next page"
            {...getAccessibleProps(() => onPageChange(Math.min(currentPage + 1, totalPages)))}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
