'use client'

import { Star } from 'lucide-react'
import { Rating } from '@/types'

interface ReviewCardProps {
  review: Rating
}

export default function ReviewCard({ review }: ReviewCardProps) {
  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  // Generate star rating display
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i}
        size={14}
        className={`${i < Math.floor(rating) 
          ? 'text-yellow-400 fill-yellow-400' 
          : i < rating 
            ? 'text-yellow-400 fill-yellow-100' 
            : 'text-gray-300 fill-gray-100'
        }`}
      />
    ))
  }
  
  // Get user initials for avatar
  const getUserInitials = (userId: string) => {
    // In a real app, we would get the user's name
    // For now, just use the first 2 characters of the userId
    return userId.substring(0, 2).toUpperCase()
  }
  
  // Get random color for avatar based on userId
  const getAvatarColor = (userId: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-teal-500'
    ]
    
    // Simple hash function to get consistent color for same userId
    const hash = userId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0)
    }, 0)
    
    return colors[hash % colors.length]
  }

  return (
    <div className="border-t border-gray-100 pt-4 first:border-t-0 first:pt-0">
      <div className="flex items-start gap-3">
        {/* User Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${getAvatarColor(review.userID)} flex items-center justify-center text-white text-xs font-medium`}>
          {getUserInitials(review.userID)}
        </div>
        
        <div className="flex-1">
          {/* User and Date */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-medium text-gray-900">
              User {review.userID.substring(0, 8)}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(review.timestamps)}
            </div>
          </div>
          
          {/* Rating Stars */}
          <div className="flex mt-1">
            {renderStars(review.ratingValue)}
          </div>
          
          {/* Review Text */}
          <div className="mt-2 text-sm text-gray-700">
            {review.reviewText}
          </div>
        </div>
      </div>
    </div>
  )
}