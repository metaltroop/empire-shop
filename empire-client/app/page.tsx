'use client'
import { ShoppingCart } from 'lucide-react'
import { lazy, useEffect, useState } from 'react'

// Lazy load components
const HomeCarousel = lazy(() => import('@/components/HomeCarousel'))
const ServicesSection = lazy(() => import('@/components/ServicesSection'))
const PopularCategories = lazy(() => import('@/components/PopularCategories'))

export default function Home() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setIsScrolled(window.scrollY > 10)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial scroll position
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
      <header 
        className={`
          sticky top-0 z-50 transition-all duration-300
          ${isScrolled 
            ? 'bg-white/80 backdrop-blur-sm shadow-[0_2px_10px_-5px_rgba(0,0,0,0.1)]' 
            : 'bg-transparent'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="w-8"></div>
            <h1 className="text-2xl font-bold tracking-tight">
              <span 
                className={`
                  transition-all duration-300
                  ${isScrolled
                    ? 'bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'
                    : 'text-gray-800'
                  }
                `}
              >
                Empire Infotech
              </span>
            </h1>
            <div className="w-8"></div>
          </div>
        </div>
      </header>

      <div className="px-4">
        <HomeCarousel />
        <ServicesSection />

        <section className="mt-6">
          <h3 className="font-bold mb-4 text-gray-800">Popular Categories</h3>
          <PopularCategories />
        </section>
      </div>
    </main>
  )
}