// Compatibility validation utilities for PC Builder

import {
  CPUSpec,
  GPUSpec,
  MotherboardSpec,
  PSUSpec,
  CaseSpec,
  CoolerSpec,
  StorageSpec,
  CompatibilityError,
  PCBuild
} from "@/types";

import {
  getCPUSpecById,
  getMotherboardSpecById,
  getGPUSpecById,
  getCaseSpecById,
  getCoolerSpecById,
  getPSUSpecById,
  getStorageSpecById
} from "./data-utils";

/**
 * Validates CPU-Motherboard socket compatibility
 */
export const validateCpuMotherboardCompatibility = (
  cpuId?: string,
  motherboardId?: string
): CompatibilityError | null => {
  if (!cpuId || !motherboardId) return null;

  const cpu = getCPUSpecById(cpuId);
  const motherboard = getMotherboardSpecById(motherboardId);

  if (!cpu || !motherboard) return null;

  if (cpu.socketType !== motherboard.socketType) {
    return {
      type: 'socket',
      message: `CPU socket ${cpu.socketType} is incompatible with motherboard socket ${motherboard.socketType}`,
      severity: 'error',
      components: ['cpu', 'motherboard']
    };
  }

  return null;
};

/**
 * Validates GPU-Case clearance compatibility
 */
export const validateGpuCaseCompatibility = (
  gpuId?: string,
  caseId?: string
): CompatibilityError | null => {
  if (!gpuId || !caseId) return null;

  const gpu = getGPUSpecById(gpuId);
  const pcCase = getCaseSpecById(caseId);

  if (!gpu || !pcCase) return null;

  if (gpu.length_mm > pcCase.maxGpuLengthmm) {
    return {
      type: 'clearance',
      message: `GPU length (${gpu.length_mm}mm) exceeds case maximum clearance (${pcCase.maxGpuLengthmm}mm)`,
      severity: 'error',
      components: ['gpu', 'case']
    };
  }

  return null;
};

/**
 * Validates Cooler-CPU socket compatibility
 */
export const validateCoolerCpuCompatibility = (
  coolerId?: string,
  cpuId?: string
): CompatibilityError | null => {
  if (!coolerId || !cpuId) return null;

  const cooler = getCoolerSpecById(coolerId);
  const cpu = getCPUSpecById(cpuId);

  if (!cooler || !cpu) return null;

  // Check if the cooler supports the CPU socket
  if (!cooler.SupportedSocket.includes(cpu.socketType)) {
    return {
      type: 'socket',
      message: `Cooler does not support CPU socket type ${cpu.socketType}`,
      severity: 'error',
      components: ['cooler', 'cpu']
    };
  }

  // Check if the cooler can handle the CPU's TDP
  if (cooler.maxTdpSupported < cpu.tdp) {
    return {
      type: 'power',
      message: `Cooler TDP support (${cooler.maxTdpSupported}W) is insufficient for CPU TDP (${cpu.tdp}W)`,
      severity: 'warning',
      components: ['cooler', 'cpu']
    };
  }

  return null;
};

/**
 * Validates Motherboard-Case form factor compatibility
 */
export const validateMotherboardCaseCompatibility = (
  motherboardId?: string,
  caseId?: string
): CompatibilityError | null => {
  if (!motherboardId || !caseId) return null;

  const motherboard = getMotherboardSpecById(motherboardId);
  const pcCase = getCaseSpecById(caseId);

  if (!motherboard || !pcCase) return null;

  // Check if the case supports the motherboard form factor
  const caseFormFactors = pcCase.formFactor.split(',').map(f => f.trim().toLowerCase());
  const motherboardFormFactor = motherboard.formFactor.toLowerCase();

  if (!caseFormFactors.includes(motherboardFormFactor)) {
    return {
      type: 'formFactor',
      message: `Case does not support ${motherboard.formFactor} motherboard form factor`,
      severity: 'error',
      components: ['motherboard', 'case']
    };
  }

  return null;
};

/**
 * Calculates total system power consumption
 */
export const calculateTotalPowerConsumption = (build: Partial<PCBuild['components']>): number => {
  let totalPower = 0;

  // Add CPU power consumption
  if (build.cpu) {
    const cpu = getCPUSpecById(build.cpu);
    if (cpu) totalPower += cpu.tdp;
  }

  // Add GPU power consumption
  if (build.gpu) {
    const gpu = getGPUSpecById(build.gpu);
    if (gpu) totalPower += gpu.tdp;
  }

  // Add base system power (motherboard, RAM, etc.) - estimated at 50W
  totalPower += 50;

  // Add storage power (estimated at 5-10W per drive)
  if (build.storage && Array.isArray(build.storage)) {
    totalPower += build.storage.length * 7;
  }

  return totalPower;
};

/**
 * Validates PSU wattage against system power requirements
 */
export const validatePsuWattage = (
  psuId?: string,
  components?: Partial<PCBuild['components']>
): CompatibilityError | null => {
  if (!psuId || !components) return null;

  const psu = getPSUSpecById(psuId);
  if (!psu) return null;

  const totalPower = calculateTotalPowerConsumption(components);
  const recommendedPower = Math.ceil(totalPower * 1.3); // 30% headroom

  if (psu.wattage < totalPower) {
    return {
      type: 'power',
      message: `PSU wattage (${psu.wattage}W) is insufficient for system power consumption (${totalPower}W)`,
      severity: 'error',
      components: ['psu']
    };
  }

  if (psu.wattage < recommendedPower) {
    return {
      type: 'power',
      message: `PSU wattage (${psu.wattage}W) is below recommended (${recommendedPower}W) for optimal system stability`,
      severity: 'warning',
      components: ['psu']
    };
  }

  return null;
};

/**
 * Validates all compatibility issues for a PC build
 */
export const validateBuildCompatibility = (
  components: Partial<PCBuild['components']>
): CompatibilityError[] => {
  const errors: CompatibilityError[] = [];

  // CPU-Motherboard compatibility
  const cpuMotherboardError = validateCpuMotherboardCompatibility(
    components.cpu,
    components.motherboard
  );
  if (cpuMotherboardError) errors.push(cpuMotherboardError);

  // GPU-Case compatibility
  const gpuCaseError = validateGpuCaseCompatibility(
    components.gpu,
    components.case
  );
  if (gpuCaseError) errors.push(gpuCaseError);

  // Cooler-CPU compatibility
  const coolerCpuError = validateCoolerCpuCompatibility(
    components.cooler,
    components.cpu
  );
  if (coolerCpuError) errors.push(coolerCpuError);

  // Motherboard-Case compatibility
  const motherboardCaseError = validateMotherboardCaseCompatibility(
    components.motherboard,
    components.case
  );
  if (motherboardCaseError) errors.push(motherboardCaseError);

  // PSU wattage compatibility
  const psuWattageError = validatePsuWattage(components.psu, components);
  if (psuWattageError) errors.push(psuWattageError);

  return errors;
};

/**
 * Gets compatible components based on current selections
 */
export const getCompatibleComponents = (
  componentType: keyof PCBuild['components'],
  currentBuild: Partial<PCBuild['components']>
) => {
  switch (componentType) {
    case 'motherboard':
      // Filter motherboards compatible with selected CPU
      if (currentBuild.cpu) {
        const cpu = getCPUSpecById(currentBuild.cpu);
        if (cpu) {
          return {
            filter: (motherboard: MotherboardSpec) => motherboard.socketType === cpu.socketType,
            message: `Showing motherboards compatible with ${cpu.prodName} (${cpu.socketType} socket)`
          };
        }
      }
      break;
      
    case 'cpu':
      // Filter CPUs compatible with selected motherboard
      if (currentBuild.motherboard) {
        const motherboard = getMotherboardSpecById(currentBuild.motherboard);
        if (motherboard) {
          return {
            filter: (cpu: CPUSpec) => cpu.socketType === motherboard.socketType,
            message: `Showing CPUs compatible with ${motherboard.prodName} (${motherboard.socketType} socket)`
          };
        }
      }
      break;
      
    case 'case':
      // Filter cases compatible with selected motherboard
      if (currentBuild.motherboard) {
        const motherboard = getMotherboardSpecById(currentBuild.motherboard);
        if (motherboard) {
          return {
            filter: (pcCase: CaseSpec) => {
              const caseFormFactors = pcCase.formFactor.split(',').map(f => f.trim().toLowerCase());
              return caseFormFactors.includes(motherboard.formFactor.toLowerCase());
            },
            message: `Showing cases compatible with ${motherboard.formFactor} motherboards`
          };
        }
      }
      break;
      
    case 'cooler':
      // Filter coolers compatible with selected CPU
      if (currentBuild.cpu) {
        const cpu = getCPUSpecById(currentBuild.cpu);
        if (cpu) {
          return {
            filter: (cooler: CoolerSpec) => {
              return cooler.SupportedSocket.includes(cpu.socketType) && 
                     cooler.maxTdpSupported >= cpu.tdp;
            },
            message: `Showing coolers compatible with ${cpu.prodName} (${cpu.socketType} socket)`
          };
        }
      }
      break;
      
    case 'psu':
      // Recommend PSUs based on estimated power consumption
      const totalPower = calculateTotalPowerConsumption(currentBuild);
      const recommendedPower = Math.ceil(totalPower * 1.3); // 30% headroom
      
      return {
        filter: (psu: PSUSpec) => psu.wattage >= recommendedPower,
        message: `Showing PSUs with sufficient wattage (${recommendedPower}W+ recommended)`
      };
      
    default:
      return null;
  }
  
  return null;
};