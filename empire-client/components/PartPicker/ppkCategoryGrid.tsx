'use client'

import React from 'react'
import Image from 'next/image'
import { Cpu, CircuitBoard, MonitorSmartphone, Box, Fan, Zap, HardDrive } from 'lucide-react'

interface ppkCategoryGridProps {
  onSelectCategory: (category: string) => void
}

// Component categories with their display names and icons
const categories = [
  { id: 'cpu', name: 'CPU', icon: Cpu },
  { id: 'motherboard', name: 'Motherboard', icon: CircuitBoard },
  { id: 'gpu', name: 'Graphics Card', icon: MonitorSmartphone },
  { id: 'case', name: 'Case', icon: Box },
  { id: 'cooler', name: 'CPU Cooler', icon: Fan },
  { id: 'psu', name: 'Power Supply', icon: Zap },
  { id: 'storage', name: 'Storage', icon: HardDrive },
]

// Static image mapping for categories
const COMPONENT_IMAGES = {
  cpu: '/images/AMD_R9.jpg',
  motherboard: '/images/aorusMB.jpg',
  gpu: '/images/rtx_3060ti.jpg',
  case: '/images/nzxtcase.jpg',
  cooler: '/images/aircooler.jpg',
  psu: '/images/CMMWE550.jpg',
  storage: '/images/SSD.jpg',
  ram: '/images/ram.jpg'
}

const PpkCategoryGrid: React.FC<ppkCategoryGridProps> = ({ onSelectCategory }) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {categories.map((category) => {
        const Icon = category.icon
        
        return (
          <div
            key={category.id}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelectCategory(category.id)}
          >
            <div className="relative w-16 h-16 mb-4">
              <Image
                src={COMPONENT_IMAGES[category.id] || '/images/placeholder-product.jpg'}
                alt={category.name}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-center font-medium">{category.name}</span>
          </div>
        )
      })}
    </div>
  )
}

export default PpkCategoryGrid