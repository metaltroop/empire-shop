'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Cpu, CircuitBoard, MonitorSmartphone, Box, Fan, Zap, HardDrive, ChevronUp, ChevronDown, X } from 'lucide-react'
import { PCBuild } from '@/types'
import ProductImage from '../ProductImage'

interface ppkBuildTrackerProps {
  selectedComponents: Partial<PCBuild['components']>
  subtotal: number
  onComponentClick: (componentType: keyof PCBuild['components']) => void
  onNextClick: () => void
  nextEnabled: boolean
}

const PpkBuildTracker: React.FC<ppkBuildTrackerProps> = ({
  selectedComponents,
  subtotal,
  onComponentClick,
  onNextClick,
  nextEnabled
}) => {
  const [dragState, setDragState] = useState<'collapsed' | 'expanded' | 'fullscreen'>('collapsed')
  const [isDragging, setIsDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [startY, setStartY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragHandleRef = useRef<HTMLDivElement>(null)
  
  // Component types with their icons
  const componentTypes = [
    { type: 'cpu' as const, icon: Cpu, label: 'CPU' },
    { type: 'motherboard' as const, icon: CircuitBoard, label: 'Motherboard' },
    { type: 'gpu' as const, icon: MonitorSmartphone, label: 'GPU' },
    { type: 'case' as const, icon: Box, label: 'Case' },
    { type: 'cooler' as const, icon: Fan, label: 'Cooler' },
    { type: 'psu' as const, icon: Zap, label: 'PSU' },
    { type: 'storage' as const, icon: HardDrive, label: 'Storage' }
  ]

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setStartY(clientY)
    setDragY(0)
  }

  // Handle drag move
  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const deltaY = startY - clientY
    setDragY(Math.max(0, deltaY))
  }

  // Handle drag end
  const handleDragEnd = () => {
    if (!isDragging) return
    
    const threshold = window.innerHeight * 0.5
    
    if (dragY > threshold) {
      setDragState('fullscreen')
    } else if (dragY > 100) {
      setDragState('expanded')
    } else {
      setDragState('collapsed')
    }
    
    setIsDragging(false)
    setDragY(0)
  }

  // Add event listeners for drag
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleDragMove(e)
      const handleMouseUp = () => handleDragEnd()
      const handleTouchMove = (e: TouchEvent) => handleDragMove(e)
      const handleTouchEnd = () => handleDragEnd()

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleTouchEnd)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, startY])

  // Calculate transform based on drag state and current drag
  const getTransform = () => {
    if (isDragging) {
      return `translateY(-${dragY}px)`
    }
    
    switch (dragState) {
      case 'fullscreen':
        return 'translateY(-100vh)'
      case 'expanded':
        return 'translateY(-200px)'
      case 'collapsed':
      default:
        return 'translateY(0)'
    }
  }

  // Get height based on state
  const getHeight = () => {
    if (dragState === 'fullscreen') {
      return '100vh'
    }
    return 'auto'
  }
  
  return (
    <>
      {/* Backdrop for fullscreen mode */}
      {dragState === 'fullscreen' && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setDragState('collapsed')}
        />
      )}
      
      <div 
        ref={containerRef}
        className={`
          fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50
          transition-all duration-300 ease-out
          ${dragState === 'fullscreen' ? 'rounded-t-lg' : ''}
        `}
        style={{
          transform: getTransform(),
          height: getHeight(),
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {/* Drag handle */}
        <div 
          ref={dragHandleRef}
          className="flex justify-center py-2 cursor-grab active:cursor-grabbing hover:bg-gray-100 transition-colors"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Close button for fullscreen */}
        {dragState === 'fullscreen' && (
          <button
            onClick={() => setDragState('collapsed')}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        )}
        
        {/* Main content */}
        <div className={`p-4 ${dragState === 'fullscreen' ? 'h-full overflow-y-auto' : ''}`}>
          {/* Component icons */}
          <div className="flex justify-center gap-4 mb-4">
            {componentTypes.map(({ type, icon: Icon, label }) => {
              const isSelected = !!selectedComponents[type]
              
              return (
                <div 
                  key={type}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => onComponentClick(type)}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-1
                    transition-all duration-300 transform hover:scale-110
                    ${isSelected 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}
                  `}>
                    <Icon className={`h-5 w-5 ${isSelected ? 'animate-pulse-once' : ''}`} />
                  </div>
                  <span className="text-xs">{label}</span>
                </div>
              )
            })}
          </div>
          
          {/* Expanded/Fullscreen details */}
          {(dragState === 'expanded' || dragState === 'fullscreen') && (
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Build Summary</span>
                <span className="text-xl font-bold text-blue-600">
                  ${(subtotal / 100).toFixed(2)}
                </span>
              </div>
              
              {/* Selected components list */}
              {dragState === 'fullscreen' && (
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold mb-3">Selected Components</h3>
                  {componentTypes.map(({ type, icon: Icon, label }) => {
                    const component = selectedComponents[type]
                    
                    return (
                      <div key={type} className="flex items-center p-3 border rounded-lg">
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center mr-4
                          ${component 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-400'}
                        `}>
                          <Icon className="h-6 w-6" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="font-medium">{label}</div>
                          {component ? (
                            <div className="text-sm text-gray-600">
                              {component.prodName}
                              <div className="text-blue-600 font-medium">
                                ${(component.price / 100).toFixed(2)}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">Not selected</div>
                          )}
                        </div>
                        
                        {component && component.smimageurl && (
                          <div className="w-16 h-16 ml-4">
                            <ProductImage
                              src={component.smimageurl}
                              alt={component.prodName}
                              fill
                              className="rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
              
              {/* Summary stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Object.keys(selectedComponents).length}
                  </div>
                  <div className="text-sm text-gray-600">Components</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((Object.keys(selectedComponents).length / componentTypes.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Next button */}
          <button
            onClick={onNextClick}
            disabled={!nextEnabled}
            className={`
              w-full mt-4 py-3 rounded-md text-center font-medium
              transition-all duration-300 transform
              ${nextEnabled
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:scale-[1.02]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {dragState === 'fullscreen' ? 'Continue to Checkout' : 'Next'}
          </button>
        </div>
      </div>
    </>
  )
}

export default PpkBuildTracker