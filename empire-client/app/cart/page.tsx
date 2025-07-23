'use client'

import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import ProductImage from '@/components/ProductImage'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, getCartItemProduct } = useCart()
  
  // Format price to INR currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8 pb-24">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag size={64} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {/* Cart Items */}
          <div className="divide-y divide-gray-200">
            {items.map(item => {
              const product = getCartItemProduct(item.prodID)
              if (!product) return null
              
              return (
                <div key={item.prodID} className="p-4 flex items-center">
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0 mr-4">
                    <Link href={`/products/detail/${product.prodID}`}>
                      <ProductImage 
                        src={product.smimageurl} 
                        alt={product.prodName}
                        className="w-full h-full object-contain"
                      />
                    </Link>
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-grow">
                    <Link 
                      href={`/products/detail/${product.prodID}`}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600"
                    >
                      {product.prodName}
                    </Link>
                    <div className="text-lg font-bold text-gray-900 mt-1">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center mr-4">
                    <button 
                      onClick={() => updateQuantity(item.prodID, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50"
                    >
                      -
                    </button>
                    <div className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-300 bg-white">
                      {item.quantity}
                    </div>
                    <button 
                      onClick={() => updateQuantity(item.prodID, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeItem(item.prodID)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Cart Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">Subtotal</span>
            <span className="text-xl font-bold">{formatPrice(subtotal)}</span>
          </div>
          
          <div className="text-sm text-gray-500 mb-6">
            Shipping and taxes will be calculated at checkout
          </div>
          
          <div className="flex flex-col gap-3">
            <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Proceed to Checkout
            </button>
            
            <Link 
              href="/"
              className="w-full py-3 text-center border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}