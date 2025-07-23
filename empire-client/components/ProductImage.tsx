'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImageProps {
  src: string
  alt: string
  fill?: boolean
  sizes?: string
  className?: string
  priority?: boolean
}

export default function ProductImage({
  src,
  alt,
  fill = false,
  sizes,
  className = '',
  priority = false
}: ProductImageProps) {
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Construct proper image path
  const getImageSrc = () => {
    if (isError) {
      return '/images/placeholder-product.jpg'
    }
    
    // If src already starts with /, use as is
    if (src.startsWith('/')) {
      return src
    }
    
    // If src already has extension, use as is with /images/ prefix
    if (src.includes('.')) {
      return `/images/${src}`
    }
    
    // Otherwise add .jpg extension
    return `/images/${src}.jpg`
  }
  
  const imageSrc = getImageSrc()
  
  const handleLoad = () => {
    setIsLoading(false)
  }
  
  const handleError = () => {
    setIsError(true)
    setIsLoading(false)
  }
  
  if (fill) {
    return (
      <div className={`relative ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
        )}
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes={sizes || '100vw'}
          className={`object-contain transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${isError ? 'opacity-70' : ''}`}
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    )
  }
  
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded w-[300px] h-[300px]" />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={300}
        height={300}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className} ${isError ? 'opacity-70' : ''}`}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}