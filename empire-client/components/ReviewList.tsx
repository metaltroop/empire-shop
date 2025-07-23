'use client'

import { useState } from 'react'
import { Rating } from '@/types'
import ReviewCard from './ReviewCard'

interface ReviewListProps {
  reviews: Rating[]
  productName: string
}

export default function ReviewList({ reviews, productName }: ReviewListProps) {
  const [sortOrder, setSortOrder] = useState<'newest' | 'highest' | 'lowest'>('newest')
  
  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.ratingValue, 0) / reviews.length
    : 0
  
  // Sort reviews based on selected order
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.timestamps).getTime() - new Date(a.timestamps).getTime()
    } else if (sortOrder === 'highest') {
      return b.ratingValue - a.ratingValue
    } else {
      return a.ratingValue - b.ratingValue
    }
  })
  
  // Rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => Math.floor(review.ratingValue) === rating).length
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
    return { rating, count, percentage }
  })

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Customer Reviews
      </h2>
      
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {/* Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-200">
            {/* Average Rating */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  out of 5
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>
            
            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingCounts.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-700 w-6">
                    {rating}★
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sort Controls */}
          <div className="flex justify-end pb-4">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>
          
          {/* Review Cards */}
          <div className="space-y-4">
            {sortedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500">
            No reviews yet for {productName}.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Be the first to share your experience!
          </p>
        </div>
      )}
    </div>
  )
}