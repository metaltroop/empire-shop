"use client";

import React from "react";
import Image from "next/image";
import { PCBuild, CompatibilityError } from "@/types";
import {
  getProductById,
  getCPUSpecById,
  getGPUSpecById,
} from "@/lib/data-utils";
import { calculateTotalPowerConsumption } from "@/lib/compatibility-utils";
import {
  AlertCircle,
  Cpu,
  CircuitBoard,
  MonitorSmartphone,
  Box,
  Fan,
  Zap,
  HardDrive,
  X,
} from "lucide-react";

interface BuildSummaryProps {
  components: Partial<PCBuild["components"]>;
  compatibilityErrors: CompatibilityError[];
  onRemoveComponent: (componentType: keyof PCBuild["components"]) => void;
}

const BuildSummary: React.FC<BuildSummaryProps> = ({
  components,
  compatibilityErrors,
  onRemoveComponent,
}) => {
  // Calculate total price
  const calculateTotalPrice = () => {
    let total = 0;

    // Add up prices for all selected components
    Object.entries(components).forEach(([type, id]) => {
      if (type !== "storage" && id) {
        const product = getProductById(id);
        if (product) {
          total += product.price;
        }
      }
    });

    // Add storage prices (array of IDs)
    if (components.storage && Array.isArray(components.storage)) {
      components.storage.forEach((storageId) => {
        const product = getProductById(storageId);
        if (product) {
          total += product.price;
        }
      });
    }

    return total;
  };

  // Calculate power consumption
  const powerConsumption = calculateTotalPowerConsumption(components);

  // Get power consumption level (for gauge)
  const getPowerLevel = () => {
    if (powerConsumption < 300) return "low";
    if (powerConsumption < 500) return "medium";
    return "high";
  };

  // Get component name by ID
  const getComponentName = (id: string) => {
    const product = getProductById(id);
    return product ? product.prodName : "Unknown Component";
  };

  // Get component icon by type
  const getComponentIcon = (type: keyof PCBuild["components"]) => {
    switch (type) {
      case "cpu":
        return <Cpu className="h-4 w-4" />;
      case "motherboard":
        return <CircuitBoard className="h-4 w-4" />;
      case "gpu":
        return <MonitorSmartphone className="h-4 w-4" />;
      case "case":
        return <Box className="h-4 w-4" />;
      case "cooler":
        return <Fan className="h-4 w-4" />;
      case "psu":
        return <Zap className="h-4 w-4" />;
      case "storage":
        return <HardDrive className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Get component type display name
  const getComponentTypeDisplay = (type: keyof PCBuild["components"]) => {
    switch (type) {
      case "cpu":
        return "CPU";
      case "motherboard":
        return "Motherboard";
      case "gpu":
        return "Graphics Card";
      case "case":
        return "Case";
      case "cooler":
        return "CPU Cooler";
      case "psu":
        return "Power Supply";
      case "storage":
        return "Storage";
      default:
        return type;
    }
  };

  // Count selected components
  const selectedComponentCount =
    Object.values(components).filter(Boolean).length;

  // Calculate completion percentage
  const completionPercentage = Math.round((selectedComponentCount / 7) * 100);

  // Format price
  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
      <h3 className="text-lg font-semibold mb-4">Build Summary</h3>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Build Progress</span>
          <span>{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Selected components list */}
      <div className="space-y-3 mb-6">
        {Object.entries(components).map(([type, id]) => {
          if (!id) return null;

          const componentType = type as keyof PCBuild["components"];
          const hasError = compatibilityErrors.some((error) =>
            error.components.includes(componentType)
          );

          return (
            <div
              key={type}
              className={`flex items-center justify-between p-2 rounded-md ${
                hasError ? "bg-red-50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                {getComponentIcon(componentType)}
                <div>
                  <p className="text-xs text-gray-500">
                    {getComponentTypeDisplay(componentType)}
                  </p>
                  <p className="text-sm font-medium line-clamp-1">
                    {typeof id === "string"
                      ? getComponentName(id)
                      : "Multiple Items"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRemoveComponent(componentType)}
                className="text-gray-400 hover:text-red-500"
                aria-label={`Remove ${getComponentTypeDisplay(componentType)}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}

        {/* Empty component slots */}
        {["cpu", "motherboard", "gpu", "case", "cooler", "psu", "storage"].map(
          (type) => {
            const componentType = type as keyof PCBuild["components"];
            if (components[componentType]) return null;

            return (
              <div
                key={type}
                className="flex items-center justify-between p-2 rounded-md border border-dashed border-gray-300"
              >
                <div className="flex items-center gap-2">
                  {getComponentIcon(componentType)}
                  <div>
                    <p className="text-xs text-gray-500">
                      {getComponentTypeDisplay(componentType)}
                    </p>
                    <p className="text-sm text-gray-400">Not selected</p>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Power consumption gauge */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">
          Estimated Power Consumption
        </h4>
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              getPowerLevel() === "low"
                ? "bg-green-500"
                : getPowerLevel() === "medium"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${Math.min(powerConsumption / 10, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>{powerConsumption}W</span>
          <span>1000W</span>
        </div>
      </div>

      {/* Compatibility warnings */}
      {compatibilityErrors.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Compatibility Issues</h4>
          <div className="space-y-2">
            {compatibilityErrors.map((error, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 p-2 rounded-md text-xs ${
                  error.severity === "error"
                    ? "bg-red-50 text-red-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{error.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price summary */}
      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm">Subtotal</span>
          <span className="font-medium">
            {formatPrice(calculateTotalPrice())}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(calculateTotalPrice())}</span>
        </div>
      </div>
    </div>
  );
};

export default BuildSummary;
