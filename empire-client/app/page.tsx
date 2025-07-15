'use client'
import { ShoppingCart } from 'lucide-react'
import { lazy } from 'react'

// Lazy load components
const HomeCarousel = lazy(() => import('@/components/HomeCarousel'))
const ServicesSection = lazy(() => import('@/components/ServicesSection'))
const PopularCategories = lazy(() => import('@/components/PopularCategories'))

export default function Home() {
  return (
    <main className="p-4  pb-20">
      <header className="flex justify-between items-center py-4">
        <p></p>
        <h1 className="text-xl text-center font-bold">Empire Infotech</h1>
        <p></p>
      </header>

      <HomeCarousel />
      <ServicesSection />

      <section className="mt-6">
        <h3 className="font-bold mb-4">Popular Categories</h3>
        <PopularCategories />
      </section>
    </main>
  )
}