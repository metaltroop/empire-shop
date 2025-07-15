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
      className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
        hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]
        hover:border-gray-300
        transition-all duration-200"
    >
      <div className="relative w-16 h-16 mb-3">
        <Image
          src={category.categoryIcon}
          alt={category.categoryName}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-sm font-medium text-gray-800 text-center">
        {category.categoryName}
      </h3>
    </Link>
  )
}

export default function PopCard({ category }: { category: CategoryData }) {
  return (
    <Suspense fallback={
      <div className="w-full h-[120px] animate-pulse bg-gray-200 rounded-lg" />
    }>
      <PopCardComponent category={category} />
    </Suspense>
  )
}
