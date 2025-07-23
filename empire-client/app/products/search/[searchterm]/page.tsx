'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { searchProducts, paginateProducts } from '@/lib/data-utils'
import { Product, FilterState, PRODUCT_CATEGORIES } from '@/types'
import Breadcrumbs from '@/components/Breadcrumbs'
import FilterDrawer from '@/components/FilterDrawer'
import ProductGrid from '@/components/ProductGrid'
import Pagination from '@/components/Pagination'
import { Filter, X } from 'lucide-react'

export default function ProductSearchPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  
  // Get searchterm from params
  const searchterm = params.searchterm 
    ? decodeURIComponent(params.searchterm as string)
    : ''
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 200000],
    categories: [],
    minRating: 0
  })
  
  // UI state
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  
  // Get page from URL params
  useEffect(() => {
    const page = searchParams.get('page')
    if (page) {
      setCurrentPage(parseInt(page, 10))
    }
  }, [searchParams])
  
  // Search and filter products
  const filteredProducts = useMemo(() => {
    const categoryFilter = filters.categories.length > 0 
      ? filters.categories[0] // For now, support single category
      : undefined
    
    const results = searchProducts(
      searchterm,
      categoryFilter,
      filters.priceRange,
      filters.minRating
    )
    
    return results
  }, [searchterm, filters])
  
  // Set loading to false after we have results
  useEffect(() => {
    setIsLoading(false)
  }, [filteredProducts])
  
  // Paginate results
  const paginatedResults = useMemo(() => {
    return paginateProducts(filteredProducts, currentPage, 12)
  }, [filteredProducts, currentPage])
  
  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])
  
  // Handle filter changes
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Update URL without navigation
    const url = new URL(window.location.href)
    url.searchParams.set('page', page.toString())
    window.history.replaceState({}, '', url.toString())
  }
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      priceRange: [0, 200000],
      categories: [],
      minRating: 0
    })
  }
  
  // Check if any filters are active
  const hasActiveFilters = filters.categories.length > 0 || 
    filters.minRating > 0 || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 200000
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with breadcrumbs and filter button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Breadcrumbs searchterm={searchterm} />
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Search results for "{searchterm}"
              </h1>
              <span className="text-sm text-gray-500">
                ({paginatedResults.totalProducts} products)
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <X size={14} />
                  Clear filters
                </button>
              )}
              
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Filter size={16} />
                Filters
                {hasActiveFilters && (
                  <span className="bg-blue-500 text-xs px-1.5 py-0.5 rounded-full">
                    {filters.categories.length + (filters.minRating > 0 ? 1 : 0) + 
                     (filters.priceRange[0] > 0 || filters.priceRange[1] < 200000 ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading products...</p>
          </div>
        ) : paginatedResults.products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search term or filters to find what you're looking for.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <ProductGrid products={paginatedResults.products} />
            
            {paginatedResults.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={paginatedResults.currentPage}
                  totalPages={paginatedResults.totalPages}
                  onPageChange={handlePageChange}
                  hasNextPage={paginatedResults.hasNextPage}
                  hasPrevPage={paginatedResults.hasPrevPage}
                />
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  )
}