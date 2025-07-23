'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    
    // Always show first page
    pages.push(1)
    
    // Calculate range around current page
    let rangeStart = Math.max(2, currentPage - 1)
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1)
    
    // Adjust range to always show 3 pages if possible
    if (rangeEnd - rangeStart < 2) {
      if (rangeStart === 2) {
        rangeEnd = Math.min(totalPages - 1, rangeStart + 2)
      } else if (rangeEnd === totalPages - 1) {
        rangeStart = Math.max(2, rangeEnd - 2)
      }
    }
    
    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push('ellipsis1')
    }
    
    // Add range pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i)
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push('ellipsis2')
    }
    
    // Always show last page if more than one page
    if (totalPages > 1) {
      pages.push(totalPages)
    }
    
    return pages
  }
  
  // If only one page, don't show pagination
  if (totalPages <= 1) {
    return null
  }
  
  const pageNumbers = getPageNumbers()

  return (
    <nav className="flex items-center justify-center">
      <ul className="flex items-center gap-1">
        {/* Previous Button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className={`flex items-center justify-center w-8 h-8 rounded-md ${
              hasPrevPage
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
        </li>
        
        {/* Page Numbers */}
        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === 'ellipsis1' || page === 'ellipsis2' ? (
              <span className="w-8 h-8 flex items-center justify-center text-gray-500">
                &hellip;
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        
        {/* Next Button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className={`flex items-center justify-center w-8 h-8 rounded-md ${
              hasNextPage
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </li>
      </ul>
    </nav>
  )
}