'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem, Product } from '@/types'
import { getProductById } from '@/lib/data-utils'

interface CartContextType {
  items: CartItem[]
  addItem: (productId: string, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  getCartItemProduct: (productId: string) => Product | undefined
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('empireCart')
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart)
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart)
        }
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('empireCart', JSON.stringify(items))
    }
  }, [items, isInitialized])

  // Add item to cart
  const addItem = (productId: string, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.prodID === productId)
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item => 
          item.prodID === productId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        )
      } else {
        // Add new item
        return [...prevItems, {
          prodID: productId,
          quantity,
          addedAt: new Date().toISOString()
        }]
      }
    })
  }

  // Remove item from cart
  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.prodID !== productId))
  }

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.prodID === productId 
          ? { ...item, quantity } 
          : item
      )
    )
  }

  // Clear cart
  const clearCart = () => {
    setItems([])
  }

  // Get total item count
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    const product = getProductById(item.prodID)
    return total + (product?.price || 0) * item.quantity
  }, 0)

  // Get product details for a cart item
  const getCartItemProduct = (productId: string) => {
    return getProductById(productId)
  }

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      getCartItemProduct
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}