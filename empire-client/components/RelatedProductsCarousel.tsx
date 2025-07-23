'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Product } from '@/types'
import ProductImage from './ProductImage'

interface RelatedProductsCarouselProps {
  products: Product[]
  categoryName: string
}

export default function RelatedProductsCarousel({ products, categoryName }: RelatedProductsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  
  // Format price to INR currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }
  
  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current
    if (!container) return
    
    setShowLeftArrow(container.scrollLeft > 0)
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    )
  }
  
  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollPosition)
      // Initial check
      checkScrollPosition()
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition)
      }
    }
  }, [])
  
  // Handle scroll buttons
  const scrollLeft = () => {
    const container = scrollContainerRef.current
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }
  
  const scrollRight = () => {
    const container = scrollContainerRef.current
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }
  
  // If no products, don't render
  if (products.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Related {categoryName} Products
      </h2>
      
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        
        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        )}
        
        {/* Carousel Container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <Link
              key={product.prodID}
              href={`/products/detail/${product.prodID}`}
              className="flex-shrink-0 w-48 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="relative h-36 bg-gray-50">
                <div className="w-full h-full p-2">
                  <ProductImage
                    src={product.smimageurl}
                    alt={product.prodName}
                    fill
                    sizes="192px"
                    className="object-contain"
                  />
                </div>
              </div>
              
              {/* Product Info */}
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10">
                  {product.prodName}
                </h3>
                
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs text-gray-600 ml-1">
                      {product.averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}