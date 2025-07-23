// empire-client/components/PopCard.tsx
'use client'
import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface CategoryData {
  categoryID: string
  categoryName: string
  categoryViews: number
  categoryIcon: string
  categoryDescription: string
}

function PopCardComponent({ category }: { category: CategoryData }) {
  return (
    <Link href={`/category/${category.categoryID}`}
      className="flex flex-col items-center p-6 rounded-xl
        bg-gradient-to-b from-white to-gray-50
        border border-gray-200
        shadow-[0_2px_8px_rgba(0,0,0,0.06)]
        hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]
        hover:border-blue-200
        hover:from-blue-50 hover:to-white
        transition-all duration-300 ease-out
        group"
    >
      <div className="relative w-16 h-16 mb-4 transform group-hover:scale-110 transition-transform duration-300">
        <Image
          src={category.categoryIcon}
          alt={category.categoryName}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
        {category.categoryName}
      </h3>
    </Link>
  )
}

export default function PopCard({ category }: { category: CategoryData }) {
  return (
    <Suspense fallback={
      <div className="w-full h-[140px] animate-pulse bg-gradient-to-b from-gray-100 to-gray-50 rounded-xl" />
    }>
      <PopCardComponent category={category} />
    </Suspense>
  )
}
