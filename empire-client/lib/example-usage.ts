// Example usage of the TypeScript interfaces and data utilities
// This file demonstrates how to use the core interfaces and functions

import { 
  Product, 
  CPUSpec, 
  PCBuild, 
  CartItem, 
  FilterState,
  PRODUCT_CATEGORIES 
} from '@/types'
import { 
  loadProducts, 
  loadCPUSpecs, 
  searchProducts, 
  paginateProducts,
  getProductById 
} from '@/lib/data-utils'
import { 
  validateCompatibility, 
  calculateTotalTDP, 
  calculateTotalPrice,
  getCompatibilityStatus 
} from '@/lib/compatibility-validator'

// Example 1: Loading and displaying products
export const exampleLoadProducts = () => {
  const products: Product[] = loadProducts()
  console.log(`Loaded ${products.length} products`)
  
  // Get first CPU
  const cpus: CPUSpec[] = loadCPUSpecs()
  const firstCPU = cpus[0]
  console.log(`First CPU: ${firstCPU.prodName} - ${firstCPU.cores} cores, ${firstCPU.tdp}W TDP`)
}

// Example 2: Searching and filtering products
export const exampleSearchProducts = () => {
  const filters: FilterState = {
    priceRange: [20000, 50000],
    categories: ['CAT001'], // CPU category
    minRating: 4.0
  }
  
  const searchResults = searchProducts('Intel', 'CAT001', filters.priceRange, filters.minRating)
  console.log(`Found ${searchResults.length} Intel CPUs matching criteria`)
  
  // Paginate results
  const paginatedResults = paginateProducts(searchResults, 1, 5)
  console.log(`Page 1 of ${paginatedResults.totalPages}: ${paginatedResults.products.length} products`)
}

// Example 3: Building a PC and validating compatibility
export const examplePCBuild = () => {
  const build: Partial<PCBuild> = {
    components: {
      cpu: 'PROD001',      // Intel i5-12400F (LGA1700)
      motherboard: 'PROD009', // ATX motherboard (LGA1700 based on our mapping)
      gpu: 'PROD005',      // RTX 3060 Ti
      psu: 'PROD013',      // 750W PSU
      case: 'PROD017'      // Mid Tower case
    }
  }
  
  // Calculate build metrics
  const totalPrice = calculateTotalPrice(build)
  const totalTDP = calculateTotalTDP(build)
  
  console.log(`Build total price: ₹${totalPrice.toLocaleString()}`)
  console.log(`Build power consumption: ${totalTDP}W`)
  
  // Validate compatibility
  const compatibilityStatus = getCompatibilityStatus(build)
  console.log(`Compatibility status: ${compatibilityStatus.status}`)
  console.log(`Message: ${compatibilityStatus.message}`)
  
  if (compatibilityStatus.errors.length > 0) {
    console.log('Compatibility issues:')
    compatibilityStatus.errors.forEach(error => {
      console.log(`- ${error.severity.toUpperCase()}: ${error.message}`)
    })
  }
}

// Example 4: Working with shopping cart
export const exampleShoppingCart = () => {
  const cartItems: CartItem[] = [
    {
      prodID: 'PROD001',
      quantity: 1,
      addedAt: new Date().toISOString()
    },
    {
      prodID: 'PROD005',
      quantity: 1,
      addedAt: new Date().toISOString()
    }
  ]
  
  let cartTotal = 0
  cartItems.forEach(item => {
    const product = getProductById(item.prodID)
    if (product) {
      cartTotal += product.price * item.quantity
      console.log(`${product.prodName} x${item.quantity} = ₹${(product.price * item.quantity).toLocaleString()}`)
    }
  })
  
  console.log(`Cart total: ₹${cartTotal.toLocaleString()}`)
}

// Example 5: Using product categories
export const exampleProductCategories = () => {
  console.log('Product Categories:')
  Object.entries(PRODUCT_CATEGORIES).forEach(([id, name]) => {
    const categoryProducts = loadProducts().filter(p => p.categoryID === id)
    console.log(`${name} (${id}): ${categoryProducts.length} products`)
  })
}

// Example 6: Complete PC build with full validation
export const exampleCompletePCBuild = () => {
  const completeBuild: PCBuild = {
    buildID: 'BUILD001',
    name: 'Gaming PC Build',
    components: {
      cpu: 'PROD001',      // Intel i5-12400F
      motherboard: 'PROD009', // ATX motherboard
      gpu: 'PROD005',      // RTX 3060 Ti
      psu: 'PROD013',      // 750W PSU
      case: 'PROD017',     // Mid Tower case
      cooler: 'PROD025',   // Air cooler
      storage: ['PROD021'] // 1TB NVMe SSD
    },
    totalPrice: calculateTotalPrice({ components: {
      cpu: 'PROD001',
      motherboard: 'PROD009',
      gpu: 'PROD005',
      psu: 'PROD013',
      case: 'PROD017',
      cooler: 'PROD025',
      storage: ['PROD021']
    }}),
    powerConsumption: calculateTotalTDP({ components: {
      cpu: 'PROD001',
      motherboard: 'PROD009',
      gpu: 'PROD005',
      psu: 'PROD013',
      case: 'PROD017',
      cooler: 'PROD025',
      storage: ['PROD021']
    }}),
    createdAt: new Date().toISOString()
  }
  
  console.log('Complete PC Build:')
  console.log(`Name: ${completeBuild.name}`)
  console.log(`Total Price: ₹${completeBuild.totalPrice.toLocaleString()}`)
  console.log(`Power Consumption: ${completeBuild.powerConsumption}W`)
  
  // Validate the complete build
  const errors = validateCompatibility(completeBuild)
  if (errors.length === 0) {
    console.log('✅ Build is fully compatible!')
  } else {
    console.log('⚠️ Build has compatibility issues:')
    errors.forEach(error => {
      console.log(`${error.severity === 'error' ? '❌' : '⚠️'} ${error.message}`)
    })
  }
  
  return completeBuild
}