'use client'
import { lazy } from 'react'

const PopCard = lazy(() => import('./PopCard'))

const popularCategories = [
  {
    categoryID: 'graphics-cards',
    categoryName: 'Graphics Cards',
    categoryViews: 1500,
    categoryIcon: '/GPU.png',
    categoryDescription: 'High-performance graphics cards for gaming and professional use'
  },
  {
    categoryID: 'keyboards',
    categoryName: 'Keyboards',
    categoryViews: 1200,
    categoryIcon: '/window.svg',
    categoryDescription: 'Mechanical and membrane keyboards for all uses'
  },
  {
    categoryID: 'processors',
    categoryName: 'Processors',
    categoryViews: 1100,
    categoryIcon: '/file.svg',
    categoryDescription: 'CPUs from leading manufacturers'
  },
  {
    categoryID: 'motherboards',
    categoryName: 'Motherboards',
    categoryViews: 900,
    categoryIcon: '/globe.svg',
    categoryDescription: 'Quality motherboards for your PC build'
  }
].sort((a, b) => b.categoryViews - a.categoryViews) // Sort by views in descending order

export default function PopularCategories() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {popularCategories.map(category => (
        <PopCard key={category.categoryID} category={category} />
      ))}
    </div>
  )
}
