// empire-client/components/ProductCard.tsx
'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'

type ProductCardProps = {
  prodID: string
  prodName: string
  smimageurl: string
  price: number
  averageRating: number
}

export default function ProductCard({
  prodID,
  prodName,
  smimageurl,
  price,
  averageRating
}: ProductCardProps) {
  return (
    <Link
      href={`/product/${prodID}`}
      className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md 
      transition-shadow duration-300 group p-3 flex flex-col justify-between"
    >
      {/* Rating Badge */}
      <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-white text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
        <Star size={12} className="fill-white text-white" />
        {averageRating.toFixed(1)}
      </div>

      {/* Image */}
      <div className="relative w-full aspect-square mb-2 rounded-lg overflow-hidden">
        <Image
          src={`/${smimageurl}.webp`}
          alt={prodName}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product Info */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-2">
          {prodName}
        </h3>
        <span className="text-sm font-semibold text-blue-700 ml-2">₹{price.toLocaleString()}</span>
      </div>
    </Link>
  )
}
