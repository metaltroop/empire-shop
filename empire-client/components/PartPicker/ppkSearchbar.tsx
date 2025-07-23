'use client'

import React from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

interface ppkSearchbarProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  onFilterClick: () => void
}

const PpkSearchbar: React.FC<ppkSearchbarProps> = ({
  placeholder,
  value,
  onChange,
  onFilterClick
}) => {
  return (
    <div className="flex items-center gap-2 p-4">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>
      
      <button
        onClick={onFilterClick}
        className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="h-5 w-5" />
      </button>
    </div>
  )
}

export default PpkSearchbar