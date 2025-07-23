'use client'

import React from 'react'
import { ArrowLeft } from 'lucide-react'

interface ppkNavigationHeaderProps {
  title: string
  onBack: () => void
  showNextButton: boolean
  nextButtonEnabled: boolean
  onNext: () => void
}

const PpkNavigationHeader: React.FC<ppkNavigationHeaderProps> = ({
  title,
  onBack,
  showNextButton,
  nextButtonEnabled,
  onNext
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b animate-fade-in">
      <button 
        onClick={onBack}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      
      <h1 className="text-lg font-semibold animate-slide-down">{title}</h1>
      
      {showNextButton ? (
        <button
          onClick={onNext}
          disabled={!nextButtonEnabled}
          className={`px-4 py-2 rounded-md transition-all duration-300 transform ${
            nextButtonEnabled
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:scale-[1.05]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      ) : (
        <div className="w-10"></div> /* Empty div for spacing */
      )}
    </div>
  )
}

export default PpkNavigationHeader