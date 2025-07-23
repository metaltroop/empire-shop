'use client'

import React from 'react'

interface QuickFilterOption {
  id: string
  label: string
  value: string
  isActive: boolean
  isDisabled: boolean
}

interface ppkQuickFilterProps {
  filters: QuickFilterOption[]
  onFilterChange: (filterId: string) => void
}

const PpkQuickFilter: React.FC<ppkQuickFilterProps> = ({
  filters,
  onFilterChange
}) => {
  return (
    <div className="flex gap-2 px-4 pb-2 overflow-x-auto scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => !filter.isDisabled && onFilterChange(filter.id)}
          disabled={filter.isDisabled}
          className={`
            px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors
            ${filter.isActive 
              ? 'bg-blue-600 text-white' 
              : filter.isDisabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

export default PpkQuickFilter