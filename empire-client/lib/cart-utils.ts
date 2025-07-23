import { CartItem, Product } from '@/types'
import { getProductById } from './data-utils'

// Load cart from localStorage
export const loadCart = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return []
  }
  
  try {
    const storedCart = localStorage.getItem('empireCart')
    if (!storedCart) {
      return []
    }
    
    const parsedCart = JSON.parse(storedCart)
    if (!Array.isArray(parsedCart)) {
      return []
    }
    
    // Validate cart items
    return parsedCart.filter(item => 
      typeof item === 'object' && 
      typeof item.prodID === 'string' && 
      typeof item.quantity === 'number' &&
      typeof item.addedAt === 'string'
    )
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
    return []
  }
}

// Save cart to localStorage
export const saveCart = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    localStorage.setItem('empireCart', JSON.stringify(cart))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

// Add item to cart
export const addToCart = (productId: string, quantity = 1): CartItem[] => {
  const cart = loadCart()
  const existingItemIndex = cart.findIndex(item => item.prodID === productId)
  
  if (existingItemIndex >= 0) {
    // Update quantity if item already exists
    cart[existingItemIndex].quantity += quantity
  } else {
    // Add new item
    cart.push({
      prodID: productId,
      quantity,
      addedAt: new Date().toISOString()
    })
  }
  
  saveCart(cart)
  return cart
}

// Remove item from cart
export const removeFromCart = (productId: string): CartItem[] => {
  const cart = loadCart().filter(item => item.prodID !== productId)
  saveCart(cart)
  return cart
}

// Update item quantity
export const updateCartItemQuantity = (productId: string, quantity: number): CartItem[] => {
  if (quantity <= 0) {
    return removeFromCart(productId)
  }
  
  const cart = loadCart()
  const existingItemIndex = cart.findIndex(item => item.prodID === productId)
  
  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity = quantity
    saveCart(cart)
  }
  
  return cart
}

// Clear cart
export const clearCart = (): void => {
  saveCart([])
}

// Get cart item count
export const getCartItemCount = (): number => {
  return loadCart().reduce((total, item) => total + item.quantity, 0)
}

// Calculate cart subtotal
export const getCartSubtotal = (): number => {
  return loadCart().reduce((total, item) => {
    const product = getProductById(item.prodID)
    return total + (product?.price || 0) * item.quantity
  }, 0)
}

// Get product details for cart items
export const getCartItemsWithProducts = (): { item: CartItem; product: Product | undefined }[] => {
  return loadCart().map(item => ({
    item,
    product: getProductById(item.prodID)
  }))
}