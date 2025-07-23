'use client'

import React from 'react'
import { notFound } from 'next/navigation'
import { 
  getProductById, 
  getCPUSpecById, 
  getGPUSpecById, 
  getMotherboardSpecById,
  getPSUSpecById,
  getCaseSpecById,
  getCoolerSpecById,
  getStorageSpecById,
  getRatingsByProductId,
  searchProducts
} from '@/lib/data-utils'
import { PRODUCT_CATEGORIES } from '@/types'
import ImageGallery from '@/components/ImageGallery'
import ProductSummary from '@/components/ProductSummary'
import SpecsAccordion from '@/components/SpecsAccordion'
import ReviewList from '@/components/ReviewList'
import RelatedProductsCarousel from '@/components/RelatedProductsCarousel'

interface ProductDetailPageProps {
  params: {
    productId: string
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Unwrap params using React.use() to avoid the warning
  const unwrappedParams = React.use(Promise.resolve(params))
  const { productId } = unwrappedParams
  
  // Get base product data
  const product = getProductById(productId)
  
  if (!product) {
    notFound()
  }

  // Get detailed specifications based on category
  let detailedSpecs = null
  const categoryName = PRODUCT_CATEGORIES[product.categoryID as keyof typeof PRODUCT_CATEGORIES]
  
  switch (product.categoryID) {
    case 'CAT001': // CPU
      detailedSpecs = getCPUSpecById(productId)
      break
    case 'CAT002': // GPU
      detailedSpecs = getGPUSpecById(productId)
      break
    case 'CAT003': // Motherboard
      detailedSpecs = getMotherboardSpecById(productId)
      break
    case 'CAT004': // PSU
      detailedSpecs = getPSUSpecById(productId)
      break
    case 'CAT005': // Case
      detailedSpecs = getCaseSpecById(productId)
      break
    case 'CAT006': // Cooler
      detailedSpecs = getCoolerSpecById(productId)
      break
    case 'CAT007': // Storage
      detailedSpecs = getStorageSpecById(productId)
      break
  }

  // Get reviews for this product
  const reviews = getRatingsByProductId(productId)
  
  // Get related products from same category
  const relatedProducts = searchProducts('', product.categoryID)
    .filter(p => p.prodID !== productId)
    .slice(0, 8)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <ImageGallery 
              images={product.bigimageurl} 
              productName={product.prodName}
            />
          </div>
          
          {/* Product Summary */}
          <div className="space-y-6">
            <ProductSummary 
              product={product}
              categoryName={categoryName}
            />
          </div>
        </div>

        {/* Specifications Section */}
        {detailedSpecs && (
          <div className="mb-8">
            <SpecsAccordion 
              specs={detailedSpecs} 
              category={categoryName}
            />
          </div>
        )}

        {/* Reviews Section */}
        <div className="mb-8">
          <ReviewList 
            reviews={reviews}
            productName={product.prodName}
          />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <RelatedProductsCarousel 
              products={relatedProducts}
              categoryName={categoryName}
            />
          </div>
        )}
      </div>
    </div>
  )
}