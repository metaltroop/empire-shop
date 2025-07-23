'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { PCBuild, CompatibilityError } from '@/types'
import { validateCompatibility, calculateTotalTDP, calculateTotalPrice } from '@/lib/compatibility-validator'

interface BuildContextType {
  build: Partial<PCBuild>
  currentStep: number
  setCurrentStep: (step: number) => void
  selectComponent: (type: keyof PCBuild['components'], productId: string) => void
  removeComponent: (type: keyof PCBuild['components']) => void
  compatibilityErrors: CompatibilityError[]
  totalPrice: number
  powerConsumption: number
  saveBuild: (name: string) => void
  loadBuild: (buildId: string) => void
  savedBuilds: PCBuild[]
}

const defaultBuild: Partial<PCBuild> = {
  components: {
    cpu: undefined,
    motherboard: undefined,
    gpu: undefined,
    case: undefined,
    cooler: undefined,
    psu: undefined,
    storage: []
  },
  totalPrice: 0,
  powerConsumption: 0
}

const BuildContext = createContext<BuildContextType | undefined>(undefined)

export const BuildProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [build, setBuild] = useState<Partial<PCBuild>>(defaultBuild)
  const [currentStep, setCurrentStep] = useState(0)
  const [compatibilityErrors, setCompatibilityErrors] = useState<CompatibilityError[]>([])
  const [savedBuilds, setSavedBuilds] = useState<PCBuild[]>([])

  // Load saved builds from localStorage on initial render
  useEffect(() => {
    const loadSavedBuilds = () => {
      try {
        const savedBuildsJson = localStorage.getItem('savedBuilds')
        if (savedBuildsJson) {
          setSavedBuilds(JSON.parse(savedBuildsJson))
        }
      } catch (error) {
        console.error('Failed to load saved builds:', error)
      }
    }

    loadSavedBuilds()
  }, [])

  // Update compatibility errors, total price, and power consumption whenever build changes
  useEffect(() => {
    setCompatibilityErrors(validateCompatibility(build))
    
    const totalPrice = calculateTotalPrice(build)
    const powerConsumption = calculateTotalTDP(build)
    
    setBuild(prev => ({
      ...prev,
      totalPrice,
      powerConsumption
    }))
  }, [build.components])

  const selectComponent = (type: keyof PCBuild['components'], productId: string) => {
    setBuild(prev => {
      if (type === 'storage') {
        // Handle storage array separately
        return {
          ...prev,
          components: {
            ...prev.components,
            storage: [...(prev.components?.storage || []), productId]
          }
        }
      } else {
        // Handle other component types
        return {
          ...prev,
          components: {
            ...prev.components,
            [type]: productId
          }
        }
      }
    })
  }

  const removeComponent = (type: keyof PCBuild['components']) => {
    setBuild(prev => {
      if (type === 'storage') {
        // Clear all storage
        return {
          ...prev,
          components: {
            ...prev.components,
            storage: []
          }
        }
      } else {
        // Remove specific component
        const updatedComponents = { ...prev.components }
        if (updatedComponents[type]) {
          delete updatedComponents[type]
        }
        return {
          ...prev,
          components: updatedComponents
        }
      }
    })
  }

  const saveBuild = (name: string) => {
    const newBuild: PCBuild = {
      buildID: `build_${Date.now()}`,
      name,
      components: build.components || {},
      totalPrice: build.totalPrice || 0,
      powerConsumption: build.powerConsumption || 0,
      createdAt: new Date().toISOString()
    }

    const updatedBuilds = [...savedBuilds, newBuild]
    setSavedBuilds(updatedBuilds)
    
    try {
      localStorage.setItem('savedBuilds', JSON.stringify(updatedBuilds))
    } catch (error) {
      console.error('Failed to save build:', error)
    }
  }

  const loadBuild = (buildId: string) => {
    const buildToLoad = savedBuilds.find(b => b.buildID === buildId)
    if (buildToLoad) {
      setBuild({
        components: buildToLoad.components,
        totalPrice: buildToLoad.totalPrice,
        powerConsumption: buildToLoad.powerConsumption
      })
    }
  }

  return (
    <BuildContext.Provider
      value={{
        build,
        currentStep,
        setCurrentStep,
        selectComponent,
        removeComponent,
        compatibilityErrors,
        totalPrice: build.totalPrice || 0,
        powerConsumption: build.powerConsumption || 0,
        saveBuild,
        loadBuild,
        savedBuilds
      }}
    >
      {children}
    </BuildContext.Provider>
  )
}

export const useBuild = (): BuildContextType => {
  const context = useContext(BuildContext)
  if (context === undefined) {
    throw new Error('useBuild must be used within a BuildProvider')
  }
  return context
}