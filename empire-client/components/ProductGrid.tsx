'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Product } from '@/types'
import ProductImage from './ProductImage'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  
  // Format price to INR currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }
  
  // Add staggered animation on mount
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    
    const cards = Array.from(grid.children) as HTMLElement[]
    
    cards.forEach((card, index) => {
      card.style.opacity = '0'
      card.style.transform = 'translateY(10px)'
      
      setTimeout(() => {
        card.style.transition = 'opacity 300ms ease-out, transform 300ms ease-out'
        card.style.opacity = '1'
        card.style.transform = 'translateY(0)'
      }, 50 * index) // Stagger the animations
    })
  }, [products])

  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {products.map((product) => (
        <Link
          key={product.prodID}
          href={`/products/detail/${product.prodID}`}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-50">
            <div className="w-full h-full p-4">
              <ProductImage
                src={product.smimageurl}
                alt={product.prodName}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain"
              />
            </div>
          </div>
          
          {/* Product Info */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10 mb-2">
              {product.prodName}
            </h3>
            
            {/* Rating Stars */}
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400">
                {Array(5).fill(0).map((_, i) => (
                  <span key={i} className={i < Math.floor(product.averageRating) ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                ({product.totalratingsRecieved})
              </span>
            </div>
            
            {/* Price */}
            <div className="font-bold text-gray-900">
              {formatPrice(product.price)}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}