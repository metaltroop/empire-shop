"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Product,
  CPUSpec,
  GPUSpec,
  MotherboardSpec,
  PSUSpec,
  CaseSpec,
  CoolerSpec,
  StorageSpec,
  CompatibilityError,
  PCBuild,
} from "@/types";
import {
  loadCPUSpecs,
  loadGPUSpecs,
  loadMotherboardSpecs,
  loadPSUSpecs,
  loadCaseSpecs,
  loadCoolerSpecs,
  loadStorageSpecs,
} from "@/lib/data-utils";
import { AlertCircle, Check, Search } from "lucide-react";
import { getCompatibleComponents } from "@/lib/compatibility-utils";

interface ComponentSelectorProps {
  componentType: keyof PCBuild["components"];
  selectedId?: string;
  onSelect: (productId: string) => void;
  currentBuild: Partial<PCBuild["components"]>;
  compatibilityErrors: CompatibilityError[];
}

const ComponentSelector = ({
  componentType,
  selectedId,
  onSelect,
  currentBuild,
  compatibilityErrors,
}: ComponentSelectorProps) => {
  const [components, setComponents] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [compatibilityMessage, setCompatibilityMessage] = useState<
    string | null
  >(null);

  // Load components based on type
  useEffect(() => {
    const loadComponents = async () => {
      setLoading(true);
      try {
        let loadedComponents: Product[] = [];

        switch (componentType) {
          case "cpu":
            loadedComponents = loadCPUSpecs();
            break;
          case "motherboard":
            loadedComponents = loadMotherboardSpecs();
            break;
          case "gpu":
            loadedComponents = loadGPUSpecs();
            break;
          case "case":
            loadedComponents = loadCaseSpecs();
            break;
          case "cooler":
            loadedComponents = loadCoolerSpecs();
            break;
          case "psu":
            loadedComponents = loadPSUSpecs();
            break;
          case "storage":
            loadedComponents = loadStorageSpecs();
            break;
          default:
            loadedComponents = [];
        }

        // Apply compatibility filters if needed
        const compatibilityFilter = getCompatibleComponents(
          componentType,
          currentBuild
        );

        if (compatibilityFilter) {
          // Apply the filter function to the loaded components
          loadedComponents = loadedComponents.filter((component: any) =>
            compatibilityFilter.filter(component)
          );

          // Set compatibility message
          setCompatibilityMessage(compatibilityFilter.message);
        } else {
          setCompatibilityMessage(null);
        }

        setComponents(loadedComponents);
      } catch (error) {
        console.error("Error loading components:", error);
        setComponents([]);
      } finally {
        setLoading(false);
      }
    };

    loadComponents();
  }, [componentType, currentBuild]);

  // Filter components by search term
  const filteredComponents = searchTerm
    ? components.filter((c) =>
        c.prodName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : components;

  // Check if this component has compatibility errors
  const componentErrors = compatibilityErrors.filter((error) =>
    error.components.includes(componentType)
  );

  // Get component type display name
  const getComponentTypeDisplay = () => {
    switch (componentType) {
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
        return componentType;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">
          Select {getComponentTypeDisplay()}
        </h3>

        {/* Search input */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder={`Search ${getComponentTypeDisplay()}...`}
            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Compatibility message */}
        {compatibilityMessage && (
          <div className="bg-blue-50 text-blue-700 p-2 rounded-md mb-4 text-sm">
            <p>{compatibilityMessage}</p>
          </div>
        )}

        {/* Compatibility errors */}
        {componentErrors.length > 0 && (
          <div
            className={`${
              componentErrors.some((e) => e.severity === "error")
                ? "bg-red-50 text-red-700"
                : "bg-amber-50 text-amber-700"
            } p-2 rounded-md mb-4 text-sm`}
          >
            {componentErrors.map((error, index) => (
              <div key={index} className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{error.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 h-32 rounded-md"
            ></div>
          ))}
        </div>
      ) : (
        <>
          {/* Empty state */}
          {filteredComponents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No {getComponentTypeDisplay()} components found.</p>
              {searchTerm && (
                <button
                  className="text-blue-600 mt-2"
                  onClick={() => setSearchTerm("")}
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* Component grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredComponents.map((component) => {
              const isSelected = selectedId === component.prodID;

              return (
                <div
                  key={component.prodID}
                  className={`
                    border rounded-md p-3 flex gap-3 cursor-pointer transition-all
                    ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }
                  `}
                  onClick={() => onSelect(component.prodID)}
                >
                  {/* Component image */}
                  <div className="w-20 h-20 relative flex-shrink-0">
                    <Image
                      src={
                        component.smimageurl.startsWith("/")
                          ? component.smimageurl
                          : `/images/${component.smimageurl}.jpg`
                      }
                      alt={component.prodName}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        (e.target as HTMLImageElement).src =
                          "/images/placeholder-product.jpg";
                      }}
                    />
                  </div>

                  {/* Component details */}
                  <div className="flex-grow">
                    <h4 className="font-medium text-sm line-clamp-2">
                      {component.prodName}
                    </h4>
                    <p className="text-blue-600 font-semibold mt-1">
                      ${(component.price / 100).toFixed(2)}
                    </p>

                    {/* Component specs preview */}
                    <div className="mt-1 text-xs text-gray-500">
                      {componentType === "cpu" &&
                        (component as CPUSpec).cores && (
                          <p>
                            {(component as CPUSpec).cores} Cores,{" "}
                            {(component as CPUSpec).threads} Threads
                          </p>
                        )}
                      {componentType === "gpu" &&
                        (component as GPUSpec).vramGb && (
                          <p>
                            {(component as GPUSpec).vramGb}GB VRAM,{" "}
                            {(component as GPUSpec).chipset}
                          </p>
                        )}
                      {componentType === "motherboard" &&
                        (component as MotherboardSpec).socketType && (
                          <p>
                            {(component as MotherboardSpec).socketType},{" "}
                            {(component as MotherboardSpec).formFactor}
                          </p>
                        )}
                      {componentType === "psu" &&
                        (component as PSUSpec).wattage && (
                          <p>
                            {(component as PSUSpec).wattage}W,{" "}
                            {(component as PSUSpec).efficiencyRating}
                          </p>
                        )}
                      {componentType === "case" &&
                        (component as CaseSpec).formFactor && (
                          <p>{(component as CaseSpec).formFactor}</p>
                        )}
                      {componentType === "cooler" &&
                        (component as CoolerSpec).coolerType && (
                          <p>{(component as CoolerSpec).coolerType}</p>
                        )}
                      {componentType === "storage" &&
                        (component as StorageSpec).capacityGB && (
                          <p>
                            {(component as StorageSpec).capacityGB}GB,{" "}
                            {(component as StorageSpec).storageType}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ComponentSelector;
