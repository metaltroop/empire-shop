// Data validation utilities and loading functions for JSON files

import {
  Product,
  CPUSpec,
  GPUSpec,
  MotherboardSpec,
  PSUSpec,
  CaseSpec,
  CoolerSpec,
  StorageSpec,
  Rating,
  CartItem,
  PCBuild,
} from "@/types";

// Import JSON data files
import productsData from "@/data/real_products.json";
import cpuLookupData from "@/data/real_lookup_CPUs.json";
import gpuLookupData from "@/data/real_lookup_GPUs.json";
import motherboardLookupData from "@/data/real_lookup_Motherboards.json";
import psuLookupData from "@/data/real_lookup_PSUs.json";
import caseLookupData from "@/data/real_lookup_Cases.json";
import coolerLookupData from "@/data/real_lookup_Coolers.json";
import storageLookupData from "@/data/real_lookup_Storage.json";
import ratingsData from "@/data/real_ratings.json";

// Validation functions
export const validateProduct = (product: any): product is Product => {
  return (
    typeof product.prodID === "string" &&
    typeof product.prodName === "string" &&
    typeof product.price === "number" &&
    typeof product.categoryID === "string" &&
    typeof product.smimageurl === "string" &&
    Array.isArray(product.bigimageurl) &&
    typeof product.timestamps === "string" &&
    typeof product.averageRating === "number" &&
    typeof product.totalratingsRecieved === "number"
  );
};

export const validateCPUSpec = (cpu: any): cpu is CPUSpec => {
  return (
    typeof cpu.prodID === "string" &&
    typeof cpu.socketType === "string" &&
    typeof cpu.cores === "number" &&
    typeof cpu.threads === "number" &&
    typeof cpu.baseClock === "number" &&
    typeof cpu.boostClock === "number" &&
    typeof cpu.tdp === "number" &&
    typeof cpu.hasIGPU === "boolean" &&
    typeof cpu.cache === "string" &&
    typeof cpu.generation === "string"
  );
};

export const validateGPUSpec = (gpu: any): gpu is GPUSpec => {
  return (
    typeof gpu.prodID === "string" &&
    typeof gpu.chipset === "string" &&
    typeof gpu.vramGb === "number" &&
    typeof gpu.tdp === "number" &&
    typeof gpu.pcieVersion === "string" &&
    typeof gpu.length_mm === "number" &&
    typeof gpu.powerConnector === "string" &&
    typeof gpu.hasRayTracing === "boolean" &&
    typeof gpu.coolingType === "string"
  );
};

export const validateMotherboardSpec = (
  motherboard: any
): motherboard is MotherboardSpec => {
  return (
    typeof motherboard.prodID === "string" &&
    typeof motherboard.formFactor === "string" &&
    typeof motherboard.ramType === "string" &&
    typeof motherboard.ramSlots === "number" &&
    typeof motherboard.maxRamGb === "number" &&
    typeof motherboard.maxRamSpeedMhz === "number" &&
    typeof motherboard.pcieSlots === "number" &&
    typeof motherboard.m2Slots === "number" &&
    typeof motherboard.sataPorts === "number" &&
    typeof motherboard.hasWifi === "boolean" &&
    typeof motherboard.hasBluetooth === "boolean"
  );
};

export const validateRating = (rating: any): rating is Rating => {
  return (
    typeof rating.id === "string" &&
    typeof rating.prodID === "string" &&
    typeof rating.userID === "string" &&
    typeof rating.ratingValue === "number" &&
    typeof rating.reviewText === "string" &&
    typeof rating.timestamps === "string"
  );
};

export const validateCartItem = (item: any): item is CartItem => {
  return (
    typeof item.prodID === "string" &&
    typeof item.quantity === "number" &&
    typeof item.addedAt === "string"
  );
};

export const validatePCBuild = (build: any): build is PCBuild => {
  return (
    typeof build.buildID === "string" &&
    typeof build.name === "string" &&
    typeof build.components === "object" &&
    typeof build.totalPrice === "number" &&
    typeof build.powerConsumption === "number" &&
    typeof build.createdAt === "string"
  );
};

// Data loading functions with validation
export const loadProducts = (): Product[] => {
  return (productsData as any[]).filter(validateProduct);
};

export const loadCPUSpecs = (): CPUSpec[] => {
  const products = loadProducts();
  const cpuProducts = products.filter((p) => p.categoryID === "CAT001");

  return cpuProducts
    .map((product) => {
      const cpuSpec = (cpuLookupData as any[]).find(
        (cpu) => cpu.prodID === product.prodID
      );
      if (!cpuSpec) {
        throw new Error(`CPU spec not found for product ${product.prodID}`);
      }
      return { ...product, ...cpuSpec } as CPUSpec;
    })
    .filter(validateCPUSpec);
};

export const loadGPUSpecs = (): GPUSpec[] => {
  const products = loadProducts();
  const gpuProducts = products.filter((p) => p.categoryID === "CAT002");

  return gpuProducts
    .map((product) => {
      const gpuSpec = (gpuLookupData as any[]).find(
        (gpu) => gpu.prodID === product.prodID
      );
      if (!gpuSpec) {
        throw new Error(`GPU spec not found for product ${product.prodID}`);
      }
      return { ...product, ...gpuSpec } as GPUSpec;
    })
    .filter(validateGPUSpec);
};

export const loadMotherboardSpecs = (): MotherboardSpec[] => {
  const products = loadProducts();
  const motherboardProducts = products.filter((p) => p.categoryID === "CAT003");

  return motherboardProducts
    .map((product) => {
      const motherboardSpec = (motherboardLookupData as any[]).find(
        (mb) => mb.prodID === product.prodID
      );
      if (!motherboardSpec) {
        throw new Error(
          `Motherboard spec not found for product ${product.prodID}`
        );
      }
      return { ...product, ...motherboardSpec } as MotherboardSpec;
    })
    .filter(validateMotherboardSpec);
};

export const loadPSUSpecs = (): PSUSpec[] => {
  const products = loadProducts();
  const psuProducts = products.filter((p) => p.categoryID === "CAT004");

  return psuProducts.map((product) => {
    const psuSpec = (psuLookupData as any[]).find(
      (psu) => psu.prodID === product.prodID
    );
    if (!psuSpec) {
      throw new Error(`PSU spec not found for product ${product.prodID}`);
    }
    return { ...product, ...psuSpec } as PSUSpec;
  });
};

export const loadCaseSpecs = (): CaseSpec[] => {
  const products = loadProducts();
  const caseProducts = products.filter((p) => p.categoryID === "CAT005");

  return caseProducts.map((product) => {
    const caseSpec = (caseLookupData as any[]).find(
      (c) => c.prodID === product.prodID
    );
    if (!caseSpec) {
      throw new Error(`Case spec not found for product ${product.prodID}`);
    }
    return { ...product, ...caseSpec } as CaseSpec;
  });
};

export const loadCoolerSpecs = (): CoolerSpec[] => {
  try {
    const products = loadProducts();
    const coolerProducts = products.filter((p) => p.categoryID === "CAT006");
    
    return coolerProducts
      .map((product) => {
        try {
          const coolerSpec = (coolerLookupData as any[]).find(
            (c) => c.prodID === product.prodID
          );
          if (!coolerSpec) {
            console.warn(`Cooler spec not found for product ${product.prodID}, skipping`);
            return null;
          }
          return { ...product, ...coolerSpec } as CoolerSpec;
        } catch (error) {
          console.error(`Error processing cooler spec for ${product.prodID}:`, error);
          return null;
        }
      })
      .filter((spec): spec is CoolerSpec => spec !== null); // Type guard to ensure non-null values
  } catch (error) {
    console.error("Error loading cooler specs:", error);
    return [];
  }
};

export const loadStorageSpecs = (): StorageSpec[] => {
  try {
    const products = loadProducts();
    const storageProducts = products.filter((p) => p.categoryID === "CAT007");
    
    return storageProducts
      .map((product) => {
        try {
          const storageSpec = (storageLookupData as any[]).find(
            (s) => s.prodID === product.prodID
          );
          if (!storageSpec) {
            console.warn(`Storage spec not found for product ${product.prodID}, skipping`);
            return null;
          }
          return { ...product, ...storageSpec } as StorageSpec;
        } catch (error) {
          console.error(`Error processing storage spec for ${product.prodID}:`, error);
          return null;
        }
      })
      .filter((spec): spec is StorageSpec => spec !== null); // Type guard to ensure non-null values
  } catch (error) {
    console.error("Error loading storage specs:", error);
    return [];
  }
};

export const loadRatings = (): Rating[] => {
  return (ratingsData as any[]).filter(validateRating);
};

// Utility functions for getting specific product data
export const getProductById = (prodID: string): Product | undefined => {
  return loadProducts().find((product) => product.prodID === prodID);
};

export const getCPUSpecById = (prodID: string): CPUSpec | undefined => {
  return loadCPUSpecs().find((cpu) => cpu.prodID === prodID);
};

export const getGPUSpecById = (prodID: string): GPUSpec | undefined => {
  return loadGPUSpecs().find((gpu) => gpu.prodID === prodID);
};

export const getMotherboardSpecById = (
  prodID: string
): MotherboardSpec | undefined => {
  return loadMotherboardSpecs().find((mb) => mb.prodID === prodID);
};

export const getPSUSpecById = (prodID: string): PSUSpec | undefined => {
  return loadPSUSpecs().find((psu) => psu.prodID === prodID);
};

export const getCaseSpecById = (prodID: string): CaseSpec | undefined => {
  return loadCaseSpecs().find((c) => c.prodID === prodID);
};

export const getCoolerSpecById = (prodID: string): CoolerSpec | undefined => {
  return loadCoolerSpecs().find((c) => c.prodID === prodID);
};

export const getStorageSpecById = (prodID: string): StorageSpec | undefined => {
  return loadStorageSpecs().find((s) => s.prodID === prodID);
};

export const getRatingsByProductId = (prodID: string): Rating[] => {
  return loadRatings().filter((rating) => rating.prodID === prodID);
};

// Search and filter utilities
export const searchProducts = (
  searchTerm: string,
  category?: string,
  priceRange?: [number, number],
  minRating?: number
): Product[] => {
  let products = loadProducts();

  // Filter by search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    products = products.filter((product) =>
      product.prodName.toLowerCase().includes(term)
    );
  }

  // Filter by category
  if (category) {
    products = products.filter((product) => product.categoryID === category);
  }

  // Filter by price range
  if (priceRange) {
    products = products.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );
  }

  // Filter by minimum rating
  if (minRating) {
    products = products.filter((product) => product.averageRating >= minRating);
  }

  return products;
};

// Pagination utility
export const paginateProducts = (
  products: Product[],
  page: number,
  limit: number = 12
) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    products: products.slice(startIndex, endIndex),
    totalPages: Math.ceil(products.length / limit),
    currentPage: page,
    totalProducts: products.length,
    hasNextPage: endIndex < products.length,
    hasPrevPage: page > 1,
  };
};
