'use client'

import { useState } from 'react'
import { ShoppingCart, Check, Loader2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

interface AddToCartButtonProps {
  productId: string
  className?: string
  showText?: boolean
  quantity?: number
}

export default function AddToCartButton({ 
  productId, 
  className = '', 
  showText = true,
  quantity = 1
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  
  const handleAddToCart = () => {
    setIsAdding(true)
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      addItem(productId, quantity)
      setIsAdding(false)
      setIsAdded(true)
      
      // Reset button state after 2 seconds
      setTimeout(() => {
        setIsAdded(false)
      }, 2000)
    }, 300)
  }
  
  // Base button classes
  const baseClasses = `
    flex items-center justify-center gap-2 
    px-4 py-2 rounded-lg font-medium 
    transition-all duration-300 ease-out
    ${className}
  `
  
  // Button state classes
  const stateClasses = isAdded
    ? 'bg-green-600 hover:bg-green-700 text-white transform'
    : isAdding
    ? 'bg-blue-500 text-white cursor-not-allowed opacity-90'
    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md active:transform active:scale-95'
  
  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`${baseClasses} ${stateClasses} ${isAdded ? 'animate-wiggle' : ''}`}
      aria-label={isAdded ? "Added to cart" : "Add to cart"}
    >
      {isAdding ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          {showText && <span>Adding...</span>}
        </>
      ) : isAdded ? (
        <>
          <Check size={18} />
          {showText && <span>Added to Cart</span>}
        </>
      ) : (
        <>
          <ShoppingCart size={18} />
          {showText && <span>Add to Cart</span>}
        </>
      )}
    </button>
  )
}