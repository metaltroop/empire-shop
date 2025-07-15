'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Settings, Search, ShoppingCart, User, List } from 'lucide-react'
import SearchOverlay from './SearchOverlay'

export default function BottomNav() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Handle search overlay state with history
  useEffect(() => {
    const handlePopState = () => {
      if (isSearchOpen) {
        setIsSearchOpen(false)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isSearchOpen])

  const handleSearchOpen = () => {
    setIsSearchOpen(true)
    // Add a new history entry when opening search
    history.pushState({ isSearch: true }, '')
  }

  const handleSearchClose = () => {
    setIsSearchOpen(false)
    // Go back when closing search manually
    if (window.history.state?.isSearch) {
      window.history.back()
    }
  }

  // Define navItems with useMemo to prevent recreating on each render
  const navItems = useMemo(() => [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Part Picker', icon: List, href: '/PartPicker' },
    { 
      label: 'Search', 
      icon: Search, 
      href: '#',
      onClick: handleSearchOpen
    },
    { label: 'Cart', icon: ShoppingCart, href: '/cart' },
    { label: 'Profile', icon: User, href: '/profile' },
  ], [])

  // Prefetch all routes on mount
  useEffect(() => {
    const routesToPrefetch = ['/', '/PartPicker', '/cart', '/profile']
    routesToPrefetch.forEach(route => {
      router.prefetch(route)
    })
  }, [router])

  const renderNavItem = useMemo(() => (item: typeof navItems[0]) => {
    const isActive = pathname === item.href
    const Icon = item.icon

    // Base classes that don't change
    const baseButtonClasses = "relative flex flex-col items-center justify-center w-16 h-14 transition-all duration-300 ease-out"
    const baseIconClasses = "transition-all duration-300"
    const baseTextClasses = "mt-1 text-xs font-medium transition-colors duration-300"
    const baseIndicatorClasses = "absolute -bottom-2 w-1/2 h-0.5 bg-blue-500 transition-all duration-300"

    if (item.onClick) {
      return (
        <button
          key={item.label}
          onClick={item.onClick}
          className={baseButtonClasses}
        >
          <Icon
            className={`${baseIconClasses} ${
              isActive ? 'stroke-blue-500 fill-blue-500 scale-110' : 'stroke-gray-500 scale-100'
            }`}
            size={24}
          />
          <span className={`${baseTextClasses} ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
            {item.label}
          </span>
        </button>
      )
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        prefetch={true}
        className={`${baseButtonClasses} ${isActive ? 'transform -translate-y-1' : ''}`}
      >
        <div className="relative">
          <div className={`absolute inset-0 -z-10 rounded-full transition-all duration-300 ${
            isActive ? 'bg-blue-100 scale-150 opacity-100' : 'opacity-0 scale-50'
          }`} />
          <Icon
            className={`${baseIconClasses} ${
              isActive ? 'stroke-blue-500 fill-blue-500 scale-110' : 'stroke-gray-500 scale-100'
            }`}
            size={24}
          />
        </div>
        <span className={`${baseTextClasses} ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
          {item.label}
        </span>
        <div className={`${baseIndicatorClasses} ${
          isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`} />
      </Link>
    )
  }, [pathname])

  return (
    <>
      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={handleSearchClose}
      />
      
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg z-50 rounded-t-xl">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-around items-center py-2">
            {navItems.map(renderNavItem)}
          </div>
        </div>
      </nav>
    </>
  )
}
