// PC Builder compatibility validation logic

import { 
  PCBuild, 
  CompatibilityError, 
  CPUSpec, 
  GPUSpec, 
  MotherboardSpec, 
  PSUSpec, 
  CaseSpec, 
  CoolerSpec 
} from '@/types'
import {
  getCPUSpecById,
  getGPUSpecById,
  getMotherboardSpecById,
  getPSUSpecById,
  getCaseSpecById,
  getCoolerSpecById,
  getStorageSpecById
} from '@/lib/data-utils'

// Calculate total TDP for power consumption validation
export const calculateTotalTDP = (build: Partial<PCBuild>): number => {
  let totalTDP = 0
  
  // Add CPU TDP
  if (build.components?.cpu) {
    const cpu = getCPUSpecById(build.components.cpu)
    if (cpu) {
      totalTDP += cpu.tdp
    }
  }
  
  // Add GPU TDP
  if (build.components?.gpu) {
    const gpu = getGPUSpecById(build.components.gpu)
    if (gpu) {
      totalTDP += gpu.tdp
    }
  }
  
  // Add base system consumption (motherboard, RAM, storage, fans)
  totalTDP += 50 // Base system consumption estimate
  
  return totalTDP
}

// Calculate total price for the build
export const calculateTotalPrice = (build: Partial<PCBuild>): number => {
  let totalPrice = 0
  
  if (build.components?.cpu) {
    const cpu = getCPUSpecById(build.components.cpu)
    if (cpu) totalPrice += cpu.price
  }
  
  if (build.components?.motherboard) {
    const motherboard = getMotherboardSpecById(build.components.motherboard)
    if (motherboard) totalPrice += motherboard.price
  }
  
  if (build.components?.gpu) {
    const gpu = getGPUSpecById(build.components.gpu)
    if (gpu) totalPrice += gpu.price
  }
  
  if (build.components?.case) {
    const pcCase = getCaseSpecById(build.components.case)
    if (pcCase) totalPrice += pcCase.price
  }
  
  if (build.components?.cooler) {
    const cooler = getCoolerSpecById(build.components.cooler)
    if (cooler) totalPrice += cooler.price
  }
  
  if (build.components?.psu) {
    const psu = getPSUSpecById(build.components.psu)
    if (psu) totalPrice += psu.price
  }
  
  // Add storage components
  if (build.components?.storage) {
    build.components.storage.forEach(storageId => {
      const storage = getStorageSpecById(storageId)
      if (storage) totalPrice += storage.price
    })
  }
  
  return totalPrice
}

// Motherboard socket mapping (since it's not in the data)
// TODO(back-end): Add socketType to motherboard data
const MOTHERBOARD_SOCKET_MAP: Record<string, string> = {
  'PROD009': 'LGA1700', // ATX DDR4
  'PROD010': 'AM4',     // Micro-ATX DDR4
  'PROD011': 'LGA1700', // ATX DDR5
  'PROD012': 'AM4'      // Micro-ATX DDR4
}

// Main compatibility validation function
export const validateCompatibility = (build: Partial<PCBuild>): CompatibilityError[] => {
  const errors: CompatibilityError[] = []
  
  // CPU-Motherboard socket compatibility
  if (build.components?.cpu && build.components?.motherboard) {
    const cpu = getCPUSpecById(build.components.cpu)
    const motherboard = getMotherboardSpecById(build.components.motherboard)
    const motherboardSocket = MOTHERBOARD_SOCKET_MAP[build.components.motherboard]
    
    if (cpu && motherboard && motherboardSocket && cpu.socketType !== motherboardSocket) {
      errors.push({
        type: 'socket',
        message: `CPU socket ${cpu.socketType} is incompatible with motherboard socket ${motherboardSocket}`,
        severity: 'error',
        components: [build.components.cpu, build.components.motherboard]
      })
    }
  }
  
  // GPU-Case clearance validation
  if (build.components?.gpu && build.components?.case) {
    const gpu = getGPUSpecById(build.components.gpu)
    const pcCase = getCaseSpecById(build.components.case)
    
    if (gpu && pcCase && gpu.length_mm > pcCase.maxGpuLengthmm) {
      errors.push({
        type: 'clearance',
        message: `GPU length ${gpu.length_mm}mm exceeds case maximum GPU length ${pcCase.maxGpuLengthmm}mm`,
        severity: 'error',
        components: [build.components.gpu, build.components.case]
      })
    }
  }
  
  // CPU Cooler-Case height validation (Note: cooler height not in data, using radiator size as proxy)
  if (build.components?.cooler && build.components?.case) {
    const cooler = getCoolerSpecById(build.components.cooler)
    const pcCase = getCaseSpecById(build.components.case)
    
    // For AIO coolers, check radiator size compatibility
    if (cooler && pcCase && cooler.coolerType === 'AIO' && cooler.radiatorSizeMm > 0) {
      // Basic radiator size check - this would need more sophisticated logic
      if (cooler.radiatorSizeMm > 280) {
        errors.push({
          type: 'clearance',
          message: `Large ${cooler.radiatorSizeMm}mm radiator may not fit in ${pcCase.formFactor} case`,
          severity: 'warning',
          components: [build.components.cooler, build.components.case]
        })
      }
    }
  }
  
  // CPU Cooler-CPU socket compatibility
  if (build.components?.cooler && build.components?.cpu) {
    const cooler = getCoolerSpecById(build.components.cooler)
    const cpu = getCPUSpecById(build.components.cpu)
    
    if (cooler && cpu) {
      // Parse supported sockets from the SupportedSocket string
      const supportedSockets = cooler.SupportedSocket.split('/')
      if (!supportedSockets.includes(cpu.socketType)) {
        errors.push({
          type: 'socket',
          message: `CPU cooler does not support ${cpu.socketType} socket (supports: ${cooler.SupportedSocket})`,
          severity: 'error',
          components: [build.components.cooler, build.components.cpu]
        })
      }
    }
  }
  
  // Motherboard-Case form factor compatibility
  if (build.components?.motherboard && build.components?.case) {
    const motherboard = getMotherboardSpecById(build.components.motherboard)
    const pcCase = getCaseSpecById(build.components.case)
    
    if (motherboard && pcCase) {
      // Check if case supports motherboard form factor
      const isCompatible = isFormFactorCompatible(motherboard.formFactor, pcCase.formFactor)
      if (!isCompatible) {
        errors.push({
          type: 'formFactor',
          message: `Motherboard form factor ${motherboard.formFactor} is not compatible with case form factor ${pcCase.formFactor}`,
          severity: 'error',
          components: [build.components.motherboard, build.components.case]
        })
      }
    }
  }
  
  // PSU wattage validation
  if (build.components?.psu && (build.components?.cpu || build.components?.gpu)) {
    const psu = getPSUSpecById(build.components.psu)
    const totalTDP = calculateTotalTDP(build)
    
    if (psu) {
      const safetyMargin = 0.8 // 80% safety margin
      const maxSafePower = psu.wattage * safetyMargin
      
      if (totalTDP > maxSafePower) {
        errors.push({
          type: 'power',
          message: `System power consumption ${totalTDP}W exceeds PSU safe capacity ${Math.round(maxSafePower)}W (${psu.wattage}W with 80% safety margin)`,
          severity: 'error',
          components: [build.components.psu, ...(build.components.cpu ? [build.components.cpu] : []), ...(build.components.gpu ? [build.components.gpu] : [])]
        })
      } else if (totalTDP > psu.wattage * 0.6) {
        // Warning if using more than 60% of PSU capacity
        errors.push({
          type: 'power',
          message: `System power consumption ${totalTDP}W is high for ${psu.wattage}W PSU. Consider a higher wattage PSU for better efficiency.`,
          severity: 'warning',
          components: [build.components.psu]
        })
      }
    }
  }
  
  // CPU TDP vs Cooler TDP rating validation
  if (build.components?.cpu && build.components?.cooler) {
    const cpu = getCPUSpecById(build.components.cpu)
    const cooler = getCoolerSpecById(build.components.cooler)
    
    if (cpu && cooler && cpu.tdp > cooler.maxTdpSupported) {
      errors.push({
        type: 'power',
        message: `CPU TDP ${cpu.tdp}W exceeds cooler TDP rating ${cooler.maxTdpSupported}W. This may result in thermal throttling.`,
        severity: 'warning',
        components: [build.components.cpu, build.components.cooler]
      })
    }
  }
  
  return errors
}

// Helper function to check form factor compatibility
const isFormFactorCompatible = (motherboardFormFactor: string, caseFormFactor: string): boolean => {
  // Define form factor compatibility matrix
  const compatibilityMatrix: Record<string, string[]> = {
    'Full Tower': ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'],
    'Mid Tower': ['ATX', 'Micro-ATX', 'Mini-ITX'],
    'Mini Tower': ['Micro-ATX', 'Mini-ITX'],
    'SFF': ['Mini-ITX'],
    'ATX': ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'],
    'Micro-ATX': ['Micro-ATX', 'Mini-ITX'],
    'Mini-ITX': ['Mini-ITX']
  }
  
  const supportedFormFactors = compatibilityMatrix[caseFormFactor] || []
  return supportedFormFactors.includes(motherboardFormFactor)
}

// Utility function to get compatibility status for a build
export const getCompatibilityStatus = (build: Partial<PCBuild>) => {
  const errors = validateCompatibility(build)
  const hasErrors = errors.some(error => error.severity === 'error')
  const hasWarnings = errors.some(error => error.severity === 'warning')
  
  if (hasErrors) {
    return {
      status: 'error' as const,
      message: 'Build has compatibility issues that must be resolved',
      errors
    }
  } else if (hasWarnings) {
    return {
      status: 'warning' as const,
      message: 'Build has some compatibility warnings',
      errors
    }
  } else {
    return {
      status: 'compatible' as const,
      message: 'All components are compatible',
      errors: []
    }
  }
}

// Function to get filtered compatible components based on current build
// TODO: Implement proper component filtering logic
export const getCompatibleComponents = (
  build: Partial<PCBuild>,
  componentType: 'cpu' | 'motherboard' | 'gpu' | 'case' | 'cooler' | 'psu' | 'storage'
): string[] => {
  // Placeholder implementation - returns empty array
  // This will be implemented in future tasks when building the actual PC builder UI
  return []
}

// Export validation utilities for use in components
export { validateCompatibility as default }