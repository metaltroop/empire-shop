'use client'

import React from 'react'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { Product } from '@/types'

interface ppkProductCardProps {
  product: Product
  isSelected: boolean
  isCompatible: boolean
  onClick: () => void
  showSpecs?: boolean
  imageMapping: Record<string, string>
}

const PpkProductCard: React.FC<ppkProductCardProps> = ({
  product,
  isSelected,
  isCompatible,
  onClick,
  showSpecs = true,
  imageMapping
}) => {
  // Get the appropriate image based on category
  const getProductImage = () => {
    const categoryMapping: Record<string, string> = {
      'CAT001': 'cpu',
      'CAT002': 'gpu',
      'CAT003': 'motherboard',
      'CAT004': 'psu',
      'CAT005': 'case',
      'CAT006': 'cooler',
      'CAT007': 'storage'
    }
    
    const category = categoryMapping[product.categoryID] || 'placeholder'
    return imageMapping[category] || '/images/placeholder-product.jpg'
  }
  
  return (
    <div
      id={`product-${product.prodID}`}
      onClick={isCompatible ? onClick : undefined}
      className={`
        border rounded-lg overflow-hidden transition-all duration-300
        ${isSelected ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]' : 'border-gray-200'}
        ${isCompatible ? 'cursor-pointer hover:shadow-lg hover:translate-y-[-4px]' : 'opacity-50 cursor-not-allowed'}
        transform hover:scale-[1.02] hover:border-blue-300
        animate-fade-in grid-item-appear hover-lift
      `}
    >
      <div className="relative h-40 bg-white">
        <Image
          src={getProductImage()}
          alt={product.prodName}
          fill
          className="object-contain p-4"
        />
        {isSelected && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full animate-pulse-once">
            <Check className="h-4 w-4 animate-scale-in" />
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.prodName}</h3>
        <p className="text-blue-600 font-semibold">${(product.price / 100).toFixed(2)}</p>
        
        {showSpecs && (
          <div className="mt-2 text-xs text-gray-500 line-clamp-2">
            {/* Dynamic specs based on product type would go here */}
            {product.averageRating > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.round(product.averageRating) ? "text-yellow-400" : "text-gray-300"}>★</span>
                  ))}
                </div>
                <span>({product.totalratingsRecieved})</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PpkProductCard