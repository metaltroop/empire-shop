'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface SpecsAccordionProps {
  specs: Record<string, any>
  category: string
}

export default function SpecsAccordion({ specs, category }: SpecsAccordionProps) {
  const [isOpen, setIsOpen] = useState(true)
  
  // Filter out product fields that are not technical specifications
  const commonProductFields = [
    'prodID', 'prodName', 'price', 'categoryID', 
    'smimageurl', 'bigimageurl', 'timestamps', 
    'averageRating', 'totalratingsRecieved'
  ]
  
  // Format spec value based on type
  const formatSpecValue = (key: string, value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }
    
    // Format specific fields based on naming conventions
    if (key.toLowerCase().includes('clock')) {
      return `${value} GHz`
    }
    if (key.toLowerCase().includes('tdp')) {
      return `${value} W`
    }
    if (key.toLowerCase().includes('mm')) {
      return `${value} mm`
    }
    if (key.toLowerCase().includes('gb')) {
      return `${value} GB`
    }
    if (key.toLowerCase().includes('mhz')) {
      return `${value} MHz`
    }
    
    return value
  }
  
  // Format spec key for display
  const formatSpecKey = (key: string) => {
    // Handle special cases
    if (key === 'tdp') return 'TDP'
    if (key === 'hasIGPU') return 'Integrated Graphics'
    if (key === 'vramGb') return 'VRAM'
    if (key === 'pcieVersion') return 'PCIe Version'
    if (key === 'length_mm') return 'Length'
    if (key === 'hasRayTracing') return 'Ray Tracing Support'
    if (key === 'maxRamGb') return 'Maximum RAM'
    if (key === 'maxRamSpeedMhz') return 'Maximum RAM Speed'
    if (key === 'hasWifi') return 'WiFi'
    if (key === 'hasBluetooth') return 'Bluetooth'
    if (key === 'maxGpuLengthmm') return 'Maximum GPU Length'
    if (key === 'maxCoolerHeightMm') return 'Maximum Cooler Height'
    if (key === 'hasRGB') return 'RGB Lighting'
    if (key === 'hasGlassPanel') return 'Glass Panel'
    if (key === 'noiseLevelDB') return 'Noise Level'
    if (key === 'capacityGB') return 'Capacity'
    if (key === 'tbw') return 'TBW (Terabytes Written)'
    
    // General formatting
    return key
      // Split camelCase
      .replace(/([A-Z])/g, ' $1')
      // Handle specific abbreviations
      .replace(/\b(cpu|gpu|psu|ram|ssd|hdd|rgb|m2|pcie)\b/gi, match => match.toUpperCase())
      // Capitalize first letter
      .replace(/^\w/, c => c.toUpperCase())
  }

  // Get technical specifications only
  const technicalSpecs = Object.entries(specs)
    .filter(([key]) => !commonProductFields.includes(key))
    .sort((a, b) => {
      // Sort by importance (custom order for each category)
      const keyA = a[0].toLowerCase()
      const keyB = b[0].toLowerCase()
      
      // CPU specific ordering
      if (category === 'CPU') {
        if (keyA.includes('socket')) return -1
        if (keyB.includes('socket')) return 1
        if (keyA.includes('cores')) return -1
        if (keyB.includes('cores')) return 1
      }
      
      // GPU specific ordering
      if (category === 'GPU') {
        if (keyA.includes('chipset')) return -1
        if (keyB.includes('chipset')) return 1
        if (keyA.includes('vram')) return -1
        if (keyB.includes('vram')) return 1
      }
      
      return keyA.localeCompare(keyB)
    })

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          Technical Specifications
        </h2>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {/* Accordion Content */}
      {isOpen && (
        <div className="px-4 pb-4">
          <div className="border-t border-gray-200 pt-4">
            <table className="w-full">
              <tbody>
                {technicalSpecs.map(([key, value]) => (
                  <tr key={key} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 text-sm font-medium text-gray-500 w-1/3">
                      {formatSpecKey(key)}
                    </td>
                    <td className="py-3 text-sm text-gray-900">
                      {formatSpecValue(key, value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}