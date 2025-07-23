'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

interface FilterState {
  priceRange: [number, number]
  brand: string[]
  compatibility: boolean
  [key: string]: any
}

interface ppkFilterOverlayProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onApplyFilters: (filters: FilterState) => void
  availableBrands: string[]
  minPrice: number
  maxPrice: number
}

const PpkFilterOverlay: React.FC<ppkFilterOverlayProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  availableBrands,
  minPrice,
  maxPrice
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)
  
  if (!isOpen) return null
  
  const handleBrandToggle = (brand: string) => {
    setLocalFilters(prev => {
      const newBrands = prev.brand.includes(brand)
        ? prev.brand.filter(b => b !== brand)
        : [...prev.brand, brand]
      
      return {
        ...prev,
        brand: newBrands
      }
    })
  }
  
  const handlePriceChange = (index: number, value: number) => {
    setLocalFilters(prev => {
      const newPriceRange = [...prev.priceRange] as [number, number]
      newPriceRange[index] = value
      return {
        ...prev,
        priceRange: newPriceRange
      }
    })
  }
  
  const handleCompatibilityToggle = () => {
    setLocalFilters(prev => ({
      ...prev,
      compatibility: !prev.compatibility
    }))
  }
  
  const handleApply = () => {
    onApplyFilters(localFilters)
    onClose()
  }
  
  const handleReset = () => {
    setLocalFilters({
      priceRange: [minPrice, maxPrice],
      brand: [],
      compatibility: true
    })
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-500 mb-1 block">Min</label>
                <input
                  type="number"
                  value={localFilters.priceRange[0]}
                  onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                  min={minPrice}
                  max={localFilters.priceRange[1]}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-500 mb-1 block">Max</label>
                <input
                  type="number"
                  value={localFilters.priceRange[1]}
                  onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                  min={localFilters.priceRange[0]}
                  max={maxPrice}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>
          
          {/* Brands */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Brands</h3>
            <div className="space-y-2">
              {availableBrands.map(brand => (
                <label key={brand} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localFilters.brand.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Compatibility */}
          <div className="mb-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localFilters.compatibility}
                onChange={handleCompatibilityToggle}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Show only compatible components</span>
            </label>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleReset}
              className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PpkFilterOverlay