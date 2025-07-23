'use client'

import React from 'react'
import { Cpu, CircuitBoard, MonitorSmartphone, Box, Fan, Zap, HardDrive } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  onStepClick: (step: number) => void
  completedSteps: number[]
}

const steps = [
  { name: 'CPU', icon: Cpu },
  { name: 'Motherboard', icon: CircuitBoard },
  { name: 'GPU', icon: MonitorSmartphone },
  { name: 'Case', icon: Box },
  { name: 'Cooler', icon: Fan },
  { name: 'PSU', icon: Zap },
  { name: 'Storage', icon: HardDrive }
]

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  onStepClick,
  completedSteps
}) => {
  return (
    <div className="w-full py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep === index
          const isCompleted = completedSteps.includes(index)
          
          return (
            <React.Fragment key={index}>
              {/* Step indicator */}
              <div 
                className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
                  isActive ? 'scale-110' : ''
                }`}
                onClick={() => onStepClick(index)}
              >
                <div 
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-2
                    ${isActive ? 'bg-blue-600 text-white' : 
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
                    transition-colors duration-200
                  `}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span 
                  className={`text-xs font-medium ${
                    isActive ? 'text-blue-600' : 
                    isCompleted ? 'text-green-500' : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </span>
              </div>
              
              {/* Connector line between steps (except after the last step) */}
              {index < steps.length - 1 && (
                <div className="hidden sm:block w-full h-0.5 bg-gray-200 flex-grow mx-2">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ 
                      width: isCompleted && completedSteps.includes(index + 1) ? '100%' : '0%' 
                    }}
                  />
                </div>
              )}
              
              {/* Mobile separator */}
              {index < steps.length - 1 && (
                <div className="sm:hidden h-4 w-0.5 bg-gray-200 my-1">
                  <div 
                    className="w-full bg-green-500 transition-all duration-300"
                    style={{ 
                      height: isCompleted && completedSteps.includes(index + 1) ? '100%' : '0%' 
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default StepIndicator