"use client";

import { useState, useEffect } from "react";
import { PCBuild, Product, CompatibilityError } from "@/types";
import { validateBuildCompatibility } from "@/lib/compatibility-utils";
import {
  loadProducts,
  loadCPUSpecs,
  loadGPUSpecs,
  loadMotherboardSpecs,
  loadPSUSpecs,
  loadCaseSpecs,
  loadCoolerSpecs,
  loadStorageSpecs,
  getProductById,
} from "@/lib/data-utils";

// Import custom components
import PpkCategoryGrid from "@/components/PartPicker/ppkCategoryGrid";
import PpkNavigationHeader from "@/components/PartPicker/ppkNavigationHeader";
import PpkSearchbar from "@/components/PartPicker/ppkSearchbar";
import PpkQuickFilter from "@/components/PartPicker/ppkQuickFilter";
import PpkProductCard from "@/components/PartPicker/ppkProductCard";
import PpkBuildTracker from "@/components/PartPicker/ppkBuildTracker";
import PpkFilterOverlay from "@/components/PartPicker/ppkFilterOverlay";

// Static image mapping
const COMPONENT_IMAGES = {
  cpu: "/images/AMD_R9.jpg",
  motherboard: "/images/aorusMB.jpg",
  gpu: "/images/rtx_3060ti.jpg",
  case: "/images/nzxtcase.jpg",
  cooler: "/images/aircooler.jpg",
  psu: "/images/CMMWE550.jpg",
  storage: "/images/SSD.jpg",
  ram: "/images/ram.jpg",
};

export default function PartPicker() {
  // State for screen management
  const [currentScreen, setCurrentScreen] = useState<
    "categories" | "components"
  >("categories");

  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState<
    keyof PCBuild["components"] | null
  >(null);

  // State for selected components
  const [selectedComponents, setSelectedComponents] = useState<
    Partial<PCBuild["components"]>
  >({});

  // State for compatibility errors
  const [compatibilityErrors, setCompatibilityErrors] = useState<
    CompatibilityError[]
  >([]);

  // State for search term
  const [searchTerm, setSearchTerm] = useState("");

  // State for filter overlay
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // State for filter options
  const [filters, setFilters] = useState<{
    priceRange: [number, number];
    brand: string[];
    compatibility: boolean;
  }>({
    priceRange: [0, 100000] as [number, number],
    brand: [] as string[],
    compatibility: true,
  });

  // State for products
  const [products, setProducts] = useState<Product[]>([]);

  // State for loading
  const [isLoading, setIsLoading] = useState(false);

  // Quick filter options based on category
  const [quickFilters, setQuickFilters] = useState<
    {
      id: string;
      label: string;
      value: string;
      isActive: boolean;
      isDisabled: boolean;
    }[]
  >([]);

  // Calculate subtotal
  const calculateSubtotal = () => {
    let total = 0;

    Object.entries(selectedComponents).forEach(([_, productId]) => {
      if (typeof productId === "string") {
        const product = getProductById(productId);
        if (product) {
          total += product.price;
        }
      }
    });

    return total;
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category as keyof PCBuild["components"]);
    setCurrentScreen("components");
    loadCategoryProducts(category as keyof PCBuild["components"]);
  };

  // Handle back button
  const handleBack = () => {
    if (currentScreen === "components") {
      setCurrentScreen("categories");
      setSelectedCategory(null);
    }
  };

  // Handle next button
  const handleNext = () => {
    if (selectedCategory) {
      // Find the next category that hasn't been selected yet
      const categories: (keyof PCBuild["components"])[] = [
        "cpu",
        "motherboard",
        "gpu",
        "case",
        "cooler",
        "psu",
        "storage",
      ];

      const currentIndex = categories.indexOf(selectedCategory);
      let nextIndex = (currentIndex + 1) % categories.length;

      // Skip categories that are already selected
      while (
        nextIndex !== currentIndex &&
        selectedComponents[categories[nextIndex]]
      ) {
        nextIndex = (nextIndex + 1) % categories.length;
      }

      if (nextIndex !== currentIndex) {
        setSelectedCategory(categories[nextIndex]);
        loadCategoryProducts(categories[nextIndex]);
      } else {
        // All categories selected, go back to category screen
        setCurrentScreen("categories");
        setSelectedCategory(null);
      }
    }
  };

  // Handle component selection
  const handleComponentSelect = (productId: string) => {
    if (selectedCategory) {
      setSelectedComponents((prev) => ({
        ...prev,
        [selectedCategory]: productId,
      }));
    }
  };

  // Handle component click from build tracker
  const handleComponentClick = (componentType: keyof PCBuild["components"]) => {
    setSelectedCategory(componentType);
    setCurrentScreen("components");
    loadCategoryProducts(componentType);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Handle filter change
  const handleFilterChange = (newFilters: {
    priceRange: [number, number];
    brand: string[];
    compatibility: boolean;
  }) => {
    setFilters(newFilters);
  };

  // Handle quick filter change
  const handleQuickFilterChange = (filterId: string) => {
    setQuickFilters((prev) =>
      prev.map((filter) => ({
        ...filter,
        isActive: filter.id === filterId ? !filter.isActive : filter.isActive,
      }))
    );
  };

  // Load products for a specific category
  const loadCategoryProducts = async (
    category: keyof PCBuild["components"]
  ) => {
    setIsLoading(true);
    setProducts([]); // Clear products while loading

    // Add a small delay to show loading animation
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      let categoryProducts: Product[] = [];

      switch (category) {
        case "cpu":
          categoryProducts = loadCPUSpecs();
          setQuickFilters([
            {
              id: "amd",
              label: "AMD",
              value: "AMD",
              isActive: false,
              isDisabled: false,
            },
            {
              id: "intel",
              label: "Intel",
              value: "Intel",
              isActive: false,
              isDisabled: false,
            },
          ]);
          break;
        case "motherboard":
          categoryProducts = loadMotherboardSpecs();
          setQuickFilters([
            {
              id: "atx",
              label: "ATX",
              value: "ATX",
              isActive: false,
              isDisabled: false,
            },
            {
              id: "microatx",
              label: "Micro-ATX",
              value: "Micro-ATX",
              isActive: false,
              isDisabled: false,
            },
            {
              id: "miniitx",
              label: "Mini-ITX",
              value: "Mini-ITX",
              isActive: false,
              isDisabled: false,
            },
          ]);
          break;
        case "gpu":
          categoryProducts = loadGPUSpecs();
          setQuickFilters([
            {
              id: "nvidia",
              label: "NVIDIA",
              value: "NVIDIA",
              isActive: false,
              isDisabled: false,
            },
            {
              id: "amd",
              label: "AMD",
              value: "AMD",
              isActive: false,
              isDisabled: false,
            },
          ]);
          break;
        case "case":
          categoryProducts = loadCaseSpecs();
          setQuickFilters([
            {
              id: "atx",
              label: "ATX",
              value: "ATX",
              isActive: false,
              isDisabled: false,
            },
            {
              id: "microatx",
              label: "Micro-ATX",
              value: "Micro-ATX",
              isActive: false,
              isDisabled: false,
            },
            {
              id: "miniitx",
              label: "Mini-ITX",
              value: "Mini-ITX",
              isActive: false,
              isDisabled: false,
            },
          ]);
          break;
        case "cooler":
          try {
            categoryProducts = loadCoolerSpecs();
            setQuickFilters([
              {
                id: "air",
                label: "Air Cooler",
                value: "Air",
                isActive: false,
                isDisabled: false,
              },
              {
                id: "liquid",
                label: "Liquid Cooler",
                value: "Liquid",
                isActive: false,
                isDisabled: false,
              },
            ]);
          } catch (error) {
            console.error("Error loading cooler specs:", error);
            categoryProducts = [];
          }
          break;
        case "psu":
          categoryProducts = loadPSUSpecs();
          setQuickFilters([
            {
              id: "modular",
              label: "Modular",
              value: "Modular",
              isActive: false,
              isDisabled: false,
            },
            {
              id: "semimodular",
              label: "Semi-Modular",
              value: "Semi-Modular",
              isActive: false,
              isDisabled: false,
            },
            {
              id: "nonmodular",
              label: "Non-Modular",
              value: "Non-Modular",
              isActive: false,
              isDisabled: false,
            },
          ]);
          break;
        case "storage":
          try {
            categoryProducts = loadStorageSpecs();
            setQuickFilters([
              {
                id: "ssd",
                label: "SSD",
                value: "SSD",
                isActive: false,
                isDisabled: false,
              },
              {
                id: "hdd",
                label: "HDD",
                value: "HDD",
                isActive: false,
                isDisabled: false,
              },
              {
                id: "nvme",
                label: "NVMe",
                value: "NVMe",
                isActive: false,
                isDisabled: false,
              },
            ]);
          } catch (error) {
            console.error("Error loading storage specs:", error);
            categoryProducts = [];
          }
          break;
        default:
          categoryProducts = [];
      }

      // Add a small delay to ensure smooth animation
      await new Promise(resolve => setTimeout(resolve, 200));
      setProducts(categoryProducts);
    } catch (error) {
      console.error(`Error loading ${category} products:`, error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update compatibility errors when components change
  useEffect(() => {
    const errors = validateBuildCompatibility(selectedComponents);
    setCompatibilityErrors(errors);
  }, [selectedComponents]);

  // Filter products based on search term and filters
  const filteredProducts = products.filter((product) => {
    // Search filter
    if (
      searchTerm &&
      !product.prodName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Price filter
    if (
      product.price < filters.priceRange[0] ||
      product.price > filters.priceRange[1]
    ) {
      return false;
    }

    // Brand filter (simplified for demo)
    if (filters.brand.length > 0) {
      const productBrand = product.prodName.split(" ")[0];
      if (!filters.brand.includes(productBrand)) {
        return false;
      }
    }

    // Quick filter (simplified for demo)
    const activeQuickFilters = quickFilters
      .filter((f) => f.isActive)
      .map((f) => f.value);
    if (activeQuickFilters.length > 0) {
      const matchesQuickFilter = activeQuickFilters.some((filter) =>
        product.prodName.includes(filter)
      );
      if (!matchesQuickFilter) {
        return false;
      }
    }

    return true;
  });

  // Check if a product is compatible with the current build
  const isProductCompatible = (product: Product) => {
    if (!filters.compatibility) return true;

    // This is a simplified compatibility check
    // In a real implementation, you would use the compatibility utils
    return true;
  };

  // Get category display name
  const getCategoryDisplayName = () => {
    switch (selectedCategory) {
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
        return "Component";
    }
  };

  // Get available brands for filter
  const getAvailableBrands = () => {
    const brands = new Set<string>();
    products.forEach((product) => {
      const brand = product.prodName.split(" ")[0];
      brands.add(brand);
    });
    return Array.from(brands);
  };

  return (
    <main className="pb-24">
      {/* Navigation header */}
      <PpkNavigationHeader
        title={
          currentScreen === "categories"
            ? "Select Component"
            : `Select ${getCategoryDisplayName()}`
        }
        onBack={handleBack}
        showNextButton={currentScreen === "components"}
        nextButtonEnabled={
          selectedCategory ? !!selectedComponents[selectedCategory] : false
        }
        onNext={handleNext}
      />

      {currentScreen === "categories" ? (
        /* Category selection screen */
        <PpkCategoryGrid onSelectCategory={handleCategorySelect} />
      ) : (
        /* Component selection screen */
        <>
          {/* Search and filter */}
          <PpkSearchbar
            placeholder={`Search ${getCategoryDisplayName()}...`}
            value={searchTerm}
            onChange={handleSearch}
            onFilterClick={() => setIsFilterOpen(true)}
          />

          {/* Quick filters */}
          <PpkQuickFilter
            filters={quickFilters}
            onFilterChange={handleQuickFilterChange}
          />

          {/* Loading state */}
          {isLoading ? (
            <div className="p-4 grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-200 rounded-lg loading-skeleton"
                ></div>
              ))}
            </div>
          ) : (
            /* Product grid */
            <div className="p-4 grid grid-cols-2 gap-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <PpkProductCard
                    key={product.prodID}
                    product={product}
                    isSelected={
                      selectedComponents[selectedCategory!] === product.prodID
                    }
                    isCompatible={isProductCompatible(product)}
                    onClick={() => {
                      handleComponentSelect(product.prodID);
                      // Add a visual feedback when selecting a component
                      const element = document.getElementById(`product-${product.prodID}`);
                      if (element) {
                        element.classList.add('animate-pulse-once');
                        setTimeout(() => {
                          element.classList.remove('animate-pulse-once');
                        }, 1000);
                      }
                    }}
                    imageMapping={COMPONENT_IMAGES}
                  />
                ))
              ) : (
                <div className="col-span-2 py-8 text-center text-gray-500 animate-fade-in">
                  <p>No products found.</p>
                  {searchTerm && (
                    <button
                      className="mt-2 text-blue-600 hover:underline"
                      onClick={() => setSearchTerm("")}
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Filter overlay */}
          <PpkFilterOverlay
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onApplyFilters={handleFilterChange}
            availableBrands={getAvailableBrands()}
            minPrice={0}
            maxPrice={100000}
          />
        </>
      )}

      {/* Build tracker */}
      <PpkBuildTracker
        selectedComponents={selectedComponents}
        subtotal={calculateSubtotal()}
        onComponentClick={handleComponentClick}
        onNextClick={handleNext}
        nextEnabled={
          selectedCategory ? !!selectedComponents[selectedCategory] : false
        }
      />
    </main>
  );
}
