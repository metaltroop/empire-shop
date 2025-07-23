'use client'

import { useEffect, useState } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { FilterState, PRODUCT_CATEGORIES } from '@/types'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export default function FilterDrawer({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange 
}: FilterDrawerProps) {
  // Local state for filters (to avoid updating parent state on every change)
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)
  
  // Section open/closed state
  const [isPriceOpen, setIsPriceOpen] = useState(true)
  const [isCategoryOpen, setIsCategoryOpen] = useState(true)
  const [isRatingOpen, setIsRatingOpen] = useState(true)
  
  // Update local filters when parent filters change
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])
  
  // Apply filters and close drawer
  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
    onClose()
  }
  
  // Reset filters to initial state
  const handleResetFilters = () => {
    const resetFilters = {
      priceRange: [0, 200000],
      categories: [],
      minRating: 0
    }
    setLocalFilters(resetFilters)
    onFiltersChange(resetFilters)
  }
  
  // Handle price range change
  const handlePriceChange = (index: number, value: number) => {
    const newPriceRange = [...localFilters.priceRange] as [number, number]
    newPriceRange[index] = value
    
    // Ensure min <= max
    if (index === 0 && value > newPriceRange[1]) {
      newPriceRange[1] = value
    } else if (index === 1 && value < newPriceRange[0]) {
      newPriceRange[0] = value
    }
    
    setLocalFilters({
      ...localFilters,
      priceRange: newPriceRange
    })
  }
  
  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    const isSelected = localFilters.categories.includes(categoryId)
    
    // For now, we only support single category selection
    // In a future implementation, this could be modified to support multiple
    setLocalFilters({
      ...localFilters,
      categories: isSelected ? [] : [categoryId]
    })
  }
  
  // Handle rating selection
  const handleRatingChange = (rating: number) => {
    setLocalFilters({
      ...localFilters,
      minRating: rating === localFilters.minRating ? 0 : rating
    })
  }
  
  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }
  
  // Check if any filters are active
  const hasActiveFilters = localFilters.categories.length > 0 || 
    localFilters.minRating > 0 || 
    localFilters.priceRange[0] > 0 || 
    localFilters.priceRange[1] < 200000

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 max-w-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Filter Sections */}
        <div className="overflow-y-auto h-[calc(100%-120px)] p-4 space-y-6">
          {/* Price Range Section */}
          <div className="border-b border-gray-200 pb-4">
            <button
              onClick={() => setIsPriceOpen(!isPriceOpen)}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <h3 className="text-md font-medium text-gray-900">Price Range</h3>
              {isPriceOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {isPriceOpen && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{formatPrice(localFilters.priceRange[0])}</span>
                  <span>{formatPrice(localFilters.priceRange[1])}</span>
                </div>
                
                <div className="relative h-1 bg-gray-200 rounded-full">
                  <div 
                    className="absolute h-1 bg-blue-500 rounded-full"
                    style={{
                      left: `${(localFilters.priceRange[0] / 200000) * 100}%`,
                      right: `${100 - (localFilters.priceRange[1] / 200000) * 100}%`
                    }}
                  />
                </div>
                
                <div className="relative">
                  <input
                    type="range"
                    min={0}
                    max={200000}
                    step={1000}
                    value={localFilters.priceRange[0]}
                    onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                    className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer"
                    style={{ pointerEvents: 'none', zIndex: 3 }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={200000}
                    step={1000}
                    value={localFilters.priceRange[1]}
                    onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                    className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer"
                    style={{ pointerEvents: 'none', zIndex: 4 }}
                  />
                </div>
                
                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Min</label>
                    <input
                      type="number"
                      min={0}
                      max={200000}
                      step={1000}
                      value={localFilters.priceRange[0]}
                      onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Max</label>
                    <input
                      type="number"
                      min={0}
                      max={200000}
                      step={1000}
                      value={localFilters.priceRange[1]}
                      onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Categories Section */}
          <div className="border-b border-gray-200 pb-4">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <h3 className="text-md font-medium text-gray-900">Categories</h3>
              {isCategoryOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {isCategoryOpen && (
              <div className="space-y-2">
                {Object.entries(PRODUCT_CATEGORIES).map(([id, name]) => (
                  <div key={id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${id}`}
                      checked={localFilters.categories.includes(id)}
                      onChange={() => handleCategoryChange(id)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`category-${id}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Rating Section */}
          <div className="pb-4">
            <button
              onClick={() => setIsRatingOpen(!isRatingOpen)}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <h3 className="text-md font-medium text-gray-900">Rating</h3>
              {isRatingOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {isRatingOpen && (
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <input
                      type="radio"
                      id={`rating-${rating}`}
                      checked={localFilters.minRating === rating}
                      onChange={() => handleRatingChange(rating)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`rating-${rating}`}
                      className="ml-2 text-sm text-gray-700 flex items-center"
                    >
                      {Array(rating).fill(0).map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                      {Array(5 - rating).fill(0).map((_, i) => (
                        <span key={i} className="text-gray-300">★</span>
                      ))}
                      <span className="ml-1">& Up</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white flex gap-3">
          <button
            onClick={handleResetFilters}
            disabled={!hasActiveFilters}
            className={`flex-1 py-2 px-4 rounded-md border border-gray-300 text-sm font-medium ${
              hasActiveFilters 
                ? 'text-gray-700 hover:bg-gray-50' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            Reset All
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
      
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          pointer-events: auto;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          -webkit-appearance: none;
        }
      `}</style>
    </>
  )
}