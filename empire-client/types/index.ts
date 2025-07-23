// Core TypeScript interfaces for Empire Infotech e-commerce platform

// Base product interface
export interface Product {
  prodID: string
  prodName: string
  price: number
  categoryID: string
  smimageurl: string
  bigimageurl: string[]
  timestamps: string
  averageRating: number
  totalratingsRecieved: number
}

// CPU specifications interface
export interface CPUSpec extends Product {
  socketType: string
  cores: number
  threads: number
  baseClock: number
  boostClock: number
  tdp: number
  hasIGPU: boolean
  cache: string
  generation: string
}

// GPU specifications interface
export interface GPUSpec extends Product {
  chipset: string
  vramGb: number
  tdp: number
  pcieVersion: string
  length_mm: number
  powerConnector: string
  hasRayTracing: boolean
  coolingType: string
}

// Motherboard specifications interface
export interface MotherboardSpec extends Product {
  socketType: string
  formFactor: string
  ramType: string
  ramSlots: number
  maxRamGb: number
  maxRamSpeedMhz: number
  pcieSlots: number
  m2Slots: number
  sataPorts: number
  hasWifi: boolean
  hasBluetooth: boolean
}

// PSU specifications interface
export interface PSUSpec extends Product {
  wattage: number
  efficiencyRating: string
  modularity: string
  formFactor: string
  pciConnectors: number
}

// Case specifications interface
export interface CaseSpec extends Product {
  formFactor: string
  maxGpuLengthmm: number
  maxCoolerHeightMm: number
  supportedPsuTypes: string
  driveBays25: number
  driveBays35: number
  hasRGB: boolean
  hasGlassPanel: boolean
}

// Cooler specifications interface
export interface CoolerSpec extends Product {
  coolerType: string
  SupportedSocket: string
  fanSizeMm: number
  radiatorSizeMm: number
  maxTdpSupported: number
  hasRGB: boolean
  noiseLevelDB: number
}

// Storage specifications interface
export interface StorageSpec extends Product {
  storageType: string
  capacityGB: number
  interface: string
  formFactor: string
  readSpeed?: number
  writeSpeed?: number
  tbw?: number
}

// Rating/Review interface
export interface Rating {
  id: string
  prodID: string
  userID: string
  ratingValue: number
  reviewText: string
  timestamps: string
}

// Shopping cart item interface
export interface CartItem {
  prodID: string
  quantity: number
  addedAt: string
}

// PC Build interface
export interface PCBuild {
  buildID: string
  name: string
  components: {
    cpu?: string
    motherboard?: string
    gpu?: string
    case?: string
    cooler?: string
    psu?: string
    storage?: string[]
  }
  totalPrice: number
  powerConsumption: number
  createdAt: string
}

// Filter state interface for search functionality
export interface FilterState {
  priceRange: [number, number]
  categories: string[]
  minRating: number
}

// Compatibility error interface
export interface CompatibilityError {
  type: 'socket' | 'clearance' | 'power' | 'formFactor'
  message: string
  severity: 'error' | 'warning'
  components: string[]
}

// Product category mapping
export const PRODUCT_CATEGORIES = {
  CAT001: 'CPU',
  CAT002: 'GPU', 
  CAT003: 'Motherboard',
  CAT004: 'PSU',
  CAT005: 'Case',
  CAT006: 'Cooler',
  CAT007: 'Storage'
} as const

export type ProductCategory = keyof typeof PRODUCT_CATEGORIES
export type ProductCategoryName = typeof PRODUCT_CATEGORIES[ProductCategory]