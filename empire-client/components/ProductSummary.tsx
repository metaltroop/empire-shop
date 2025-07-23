'use client'

import { Star, Check } from 'lucide-react'
import { Product } from '@/types'
import AddToCartButton from './AddToCartButton'

interface ProductSummaryProps {
  product: Product
  categoryName: string
}

export default function ProductSummary({ product, categoryName }: ProductSummaryProps) {
  // Format price to INR currency
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price)
  
  // Generate star rating display
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i}
        size={16}
        className={`${i < Math.floor(rating) 
          ? 'text-yellow-400 fill-yellow-400' 
          : i < rating 
            ? 'text-yellow-400 fill-yellow-100' 
            : 'text-gray-300 fill-gray-100'
        }`}
      />
    ))
  }

  return (
    <div className="space-y-4">
      {/* Category */}
      <div className="text-sm text-blue-600 font-medium">
        {categoryName}
      </div>
      
      {/* Product Name */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
        {product.prodName}
      </h1>
      
      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {renderStars(product.averageRating)}
        </div>
        <span className="text-sm text-gray-500">
          ({product.totalratingsRecieved} reviews)
        </span>
      </div>
      
      {/* Price */}
      <div className="mt-4">
        <span className="text-3xl font-bold text-gray-900">
          {formattedPrice}
        </span>
        <span className="ml-2 text-sm text-gray-500">
          inclusive of all taxes
        </span>
      </div>
      
      {/* Availability - Placeholder for now */}
      <div className="flex items-center gap-2 text-green-600">
        <Check size={16} />
        <span className="text-sm font-medium">In Stock</span>
      </div>
      
      {/* Add to Cart Button */}
      <div className="pt-4">
        <AddToCartButton 
          productId={product.prodID}
          className="w-full md:w-auto px-6 py-3"
        />
      </div>
    </div>
  )
}