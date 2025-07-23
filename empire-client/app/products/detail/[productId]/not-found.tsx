'use client'

import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <Search className="text-blue-600" size={24} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900">
          Product Not Found
        </h1>
        
        <p className="text-gray-600">
          We couldn't find the product you're looking for. It may have been removed or the URL might be incorrect.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          
          <Link
            href="/products/search/all"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
          >
            <Search size={16} />
            Browse All Products
          </Link>
        </div>
      </div>
    </div>
  )
}