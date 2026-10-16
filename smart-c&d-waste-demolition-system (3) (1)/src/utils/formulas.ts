/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EstimationInputs, EstimationOutputs, CityRates, ProjectMetadata, ComponentCalculation, MaterialResult } from "../types";

export const DENSITIES = {
  rccConcrete: 2500, // kg/m³
  brickMasonry: 1800, // kg/m³
  steel: 7850, // kg/m³
  wood: 600, // kg/m³
  glass: 2500, // kg/m³
  gypsum: 950, // kg/m³
  tiles: 2200, // kg/m³
  plastic: 950, // kg/m³
  soil: 1600, // kg/m³
  copper: 8960 // kg/m³
};

// Coefficient splits: [Reusable %, Recyclable %, Landfill %]
export const MATERIAL_SPLITS: { [material: string]: { reuse: number; recycle: number; landfill: number } } = {
  "Concrete": { reuse: 0.10, recycle: 0.80, landfill: 0.10 },
  "Steel": { reuse: 0.05, recycle: 0.90, landfill: 0.05 },
  "Brick": { reuse: 0.40, recycle: 0.45, landfill: 0.15 },
  "Wood": { reuse: 0.60, recycle: 0.25, landfill: 0.15 },
  "Glass": { reuse: 0.15, recycle: 0.70, landfill: 0.15 },
  "Gypsum": { reuse: 0.05, recycle: 0.60, landfill: 0.35 },
  "Tiles": { reuse: 0.15, recycle: 0.45, landfill: 0.40 },
  "Plastics (PVC)": { reuse: 0.10, recycle: 0.75, landfill: 0.15 },
  "Soil": { reuse: 0.90, recycle: 0.00, landfill: 0.10 },
  "Metals/Copper": { reuse: 0.05, recycle: 0.92, landfill: 0.03 }
};

export const DEFAULT_CITY_RATES: CityRates[] = [
  { city: "Pune", steelScrapRate: 38.18, brickRecoveryValue: 3.20, woodRecoveryValue: 15.00, concreteRecyclingRate: 0.50, transportRate: 45.00, landfillCharge: 0.70, tripCapacity: 5000 },
  { city: "Mumbai", steelScrapRate: 38.47, brickRecoveryValue: 3.50, woodRecoveryValue: 18.00, concreteRecyclingRate: 0.60, transportRate: 55.00, landfillCharge: 0.90, tripCapacity: 5000 },
  { city: "Nagpur", steelScrapRate: 36.79, brickRecoveryValue: 2.80, woodRecoveryValue: 12.00, concreteRecyclingRate: 0.40, transportRate: 40.00, landfillCharge: 0.60, tripCapacity: 5000 },
  { city: "Nashik", steelScrapRate: 36.50, brickRecoveryValue: 2.90, woodRecoveryValue: 13.00, concreteRecyclingRate: 0.42, transportRate: 42.00, landfillCharge: 0.65, tripCapacity: 5000 },
  { city: "Aurangabad", steelScrapRate: 36.72, brickRecoveryValue: 2.85, woodRecoveryValue: 12.50, concreteRecyclingRate: 0.45, transportRate: 42.00, landfillCharge: 0.60, tripCapacity: 5000 },
  { city: "Delhi", steelScrapRate: 38.38, brickRecoveryValue: 3.40, woodRecoveryValue: 16.00, concreteRecyclingRate: 0.55, transportRate: 50.00, landfillCharge: 0.80, tripCapacity: 5000 },
  { city: "Bangalore", steelScrapRate: 38.16, brickRecoveryValue: 3.35, woodRecoveryValue: 17.00, concreteRecyclingRate: 0.52, transportRate: 48.00, landfillCharge: 0.75, tripCapacity: 5000 },
  { city: "Hyderabad", steelScrapRate: 36.92, brickRecoveryValue: 3.00, woodRecoveryValue: 14.00, concreteRecyclingRate: 0.48, transportRate: 45.00, landfillCharge: 0.70, tripCapacity: 5000 },
  { city: "Chennai", steelScrapRate: 37.47, brickRecoveryValue: 3.10, woodRecoveryValue: 15.00, concreteRecyclingRate: 0.50, transportRate: 46.00, landfillCharge: 0.72, tripCapacity: 5000 },
  { city: "Kolkata", steelScrapRate: 37.31, brickRecoveryValue: 2.95, woodRecoveryValue: 13.50, concreteRecyclingRate: 0.45, transportRate: 44.00, landfillCharge: 0.68, tripCapacity: 5000 },
  { city: "Ahmedabad", steelScrapRate: 35.54, brickRecoveryValue: 2.90, woodRecoveryValue: 13.00, concreteRecyclingRate: 0.44, transportRate: 42.00, landfillCharge: 0.65, tripCapacity: 5000 }
];

export function calculateDemolitionWaste(
  meta: ProjectMetadata,
  inputs: EstimationInputs,
  rates: CityRates
): EstimationOutputs {
  const componentsResults: { [key: string]: ComponentCalculation } = {};
  const aggregatedBreakdown: { [material: string]: number } = {};

  const addMass = (material: string, mass: number) => {
    if (mass <= 0) return;
    aggregatedBreakdown[material] = (aggregatedBreakdown[material] || 0) + mass;
  };

  if (meta.calculationMode === "approximate") {
    // Standard civil engineering thumb rules for IS-4878 and Demolition Rules:
    const area = Number(meta.builtUpArea || 100);
    const floors = Number(meta.floorsCount || 1);
    const bType = meta.buildingType || "Residential";
    const constType = meta.constructionType || "RCC Frame";

    // Establish specific multiplier presets per building category
    let concreteMult = 350; // kg/m^2 of total accumulated area
    let steelMult = 28;
    let brickMult = 240;
    let soilMult = 100;
    let woodMult = 10;
    let glassMult = 2.5;
    let tileMult = 15;
    let pvcMult = 4.5;
    let metalMult = 1.8;
    let gypsumMult = 5;

    if (bType === "Commercial") {
      concreteMult = 400; steelMult = 34; brickMult = 180; soilMult = 120;
      woodMult = 8; glassMult = 6; tileMult = 20; pvcMult = 6; metalMult = 2.5; gypsumMult = 8;
    } else if (bType === "Industrial") {
      concreteMult = 120; steelMult = 80; brickMult = 60; soilMult = 50;
      woodMult = 3; glassMult = 4; tileMult = 2; pvcMult = 3; metalMult = 3.2; gypsumMult = 1;
    } else if (bType === "School" || bType === "Hospital") {
      concreteMult = 380; steelMult = 30; brickMult = 240; soilMult = 110;
      woodMult = 12; glassMult = 5; tileMult = 18; pvcMult = 5.5; metalMult = 2.2; gypsumMult = 6;
    } else if (bType === "Road") {
      concreteMult = 2000; steelMult = 4; brickMult = 10; soilMult = 1500;
      woodMult = 0; glassMult = 0; tileMult = 0; pvcMult = 1; metalMult = 0.5; gypsumMult = 0;
    } else if (bType === "Bridge") {
      concreteMult = 4500; steelMult = 115; brickMult = 0; soilMult = 1800;
      woodMult = 0; glassMult = 0; tileMult = 0; pvcMult = 0; metalMult = 1; gypsumMult = 0;
    }

    // Apply adjustments based on construction typologies
    if (constType === "Steel Frame") {
      concreteMult *= 0.35;
      steelMult *= 2.4;
      brickMult *= 0.3;
    } else if (constType === "Load Bearing") {
      concreteMult *= 0.2;
      steelMult *= 0.25;
      brickMult *= 1.8;
      soilMult *= 0.8;
    } else if (constType === "Composite") {
      concreteMult *= 0.8;
      steelMult *= 1.5;
    }

    // Calculate absolute masses (kg)
    const totalConcrete = concreteMult * area;
    const totalSteel = steelMult * area;
    const totalBrick = brickMult * area;
    const totalSoil = soilMult * area * (1 + floors * 0.05); // foundation depth scales slightly with level height
    const totalWood = woodMult * area;
    const totalGlass = glassMult * area;
    const totalTiles = tileMult * area;
    const totalPVC = pvcMult * area;
    const totalMetals = metalMult * area;
    const totalGypsum = gypsumMult * area;

    // Push to aggregator
    addMass("Concrete", totalConcrete);
    addMass("Steel", totalSteel);
    addMass("Brick", totalBrick);
    addMass("Soil", totalSoil);
    addMass("Wood", totalWood);
    addMass("Glass", totalGlass);
    addMass("Tiles", totalTiles);
    addMass("Plastics (PVC)", totalPVC);
    addMass("Metals/Copper", totalMetals);
    addMass("Gypsum", totalGypsum);

    // Build componentsResults for visual satisfaction/drilldown
    componentsResults["foundation"] = {
      name: "Soil & Excavations Base",
      volume: totalSoil / DENSITIES.soil,
      totalMass: totalSoil,
      breakdown: { "Soil": totalSoil },
      steps: [
        `Approximate Estimation: Base ground soil displacement estimated using empirical index = ${soilMult} kg/m²`,
        `Formula: Built-Up Area (${area} m²) × Index (${soilMult} kg/m²) = ${totalSoil.toFixed(1)} kg`
      ]
    };

    componentsResults["columns"] = {
      name: "Superstructure Frame (RCC / Concrete / Masonry)",
      volume: (totalConcrete + totalSteel + totalBrick) / DENSITIES.rccConcrete,
      totalMass: totalConcrete + totalSteel + totalBrick,
      breakdown: { "Concrete": totalConcrete, "Steel": totalSteel, "Brick": totalBrick },
      steps: [
        `Approximate Estimation: RCC structural frame + Masonry elements computed using standard building typologies:`,
        `- Prescribed Concrete Index: ${concreteMult} kg/m² of area`,
        `- Prescribed Reinforcement Steel index: ${steelMult} kg/m² of area`,
        `- Prescribed Brick Masonry index: ${brickMult} kg/m² of area`,
        `Calculations:`,
        `* Concrete: ${area} m² × ${concreteMult} kg/m² = ${totalConcrete.toFixed(1)} kg`,
        `* Steel: ${area} m² × ${steelMult} kg/m² = ${totalSteel.toFixed(1)} kg`,
        `* Brick: ${area} m² × ${brickMult} kg/m² = ${totalBrick.toFixed(1)} kg`
      ]
    };

    componentsResults["finishes"] = {
      name: "Architectural Fittings & Finishes",
      volume: (totalWood + totalGlass + totalTiles + totalPVC + totalMetals + totalGypsum) / DENSITIES.wood,
      totalMass: totalWood + totalGlass + totalTiles + totalPVC + totalMetals + totalGypsum,
      breakdown: {
        "Wood": totalWood,
        "Glass": totalGlass,
        "Tiles": totalTiles,
        "Plastics (PVC)": totalPVC,
        "Metals/Copper": totalMetals,
        "Gypsum": totalGypsum
      },
      steps: [
        `Approximate Estimation: Non-structural finishes computed empirically from built-up area:`,
        `* Wood Panels: ${area} m² × ${woodMult} kg/m² = ${totalWood.toFixed(1)} kg`,
        `* Glass partitions: ${area} m² × ${glassMult} kg/m² = ${totalGlass.toFixed(1)} kg`,
        `* Flooring Tiles: ${area} m² × ${tileMult} kg/m² = ${totalTiles.toFixed(1)} kg`,
        `* Conduit PVC Pipes: ${area} m² × ${pvcMult} kg/m² = ${totalPVC.toFixed(1)} kg`,
        `* Plumbing Fixtures/Wiring Metals: ${area} m² × ${metalMult} kg/m² = ${totalMetals.toFixed(1)} kg`,
        `* Gypsum False Ceiling: ${area} m² × ${gypsumMult} kg/m² = ${totalGypsum.toFixed(1)} kg`
      ]
    };
  } else {
    // --- STRUCTURAL ENGINES ---

  // 1. Foundation: Volume = L * W * D. Material: RCC + heavy excavation soil
  if (inputs.foundation?.enabled) {
    const f = inputs.foundation;
    const items = f.items && f.items.length > 0 ? f.items : [{ id: "def_foundation", name: "Base Foundation", ...f }];
    
    let totalVolume = 0;
    let totalConcreteVol = 0;
    let totalSoilVol = 0;
    let totalSteelMass = 0;
    let totalConcMass = 0;
    let totalSoilMass = 0;
    const steps: string[] = [];

    items.forEach((item, idx) => {
      const l = Number(item.length || 0);
      const w = Number(item.width || 0);
      const d = Number(item.depth || 0);
      const count = Number(item.count || 1);
      const soilRatio = Number(item.soilRatio !== undefined ? item.soilRatio : 0.4);

      const volume = l * w * d * count;
      const concreteVol = volume * (1 - soilRatio);
      const soilVol = volume * soilRatio;

      const steelMass = concreteVol * 0.015 * DENSITIES.steel;
      const concMass = Math.max(0, (concreteVol * DENSITIES.rccConcrete) - steelMass);
      const soilMass = soilVol * DENSITIES.soil;

      totalVolume += volume;
      totalConcreteVol += concreteVol;
      totalSoilVol += soilVol;
      totalSteelMass += steelMass;
      totalConcMass += concMass;
      totalSoilMass += soilMass;

      steps.push(
        `Variant [#${idx + 1} - ${item.name || 'Core'}]: Volume = L (${l}m) × W (${w}m) × D (${d}m) × Qty (${count}) = ${volume.toFixed(2)} m³ (Concrete: ${concreteVol.toFixed(2)} m³, Soil: ${soilVol.toFixed(2)} m³)`
      );
    });

    componentsResults["foundation"] = {
      name: "Foundation",
      volume: totalVolume,
      totalMass: (totalConcreteVol * DENSITIES.rccConcrete) + (totalSoilVol * DENSITIES.soil),
      breakdown: { "Concrete": totalConcMass, "Steel": totalSteelMass, "Soil": totalSoilMass },
      steps: [
        `Summary: Merged Foundation of ${items.length} segment(s), total volume = ${totalVolume.toFixed(2)} m³`,
        ...steps,
        `Total steel (1.5% ratio): ${totalSteelMass.toFixed(1)} kg, Concrete: ${totalConcMass.toFixed(1)} kg, excavated soil: ${totalSoilMass.toFixed(1)} kg`
      ]
    };
    addMass("Concrete", totalConcMass);
    addMass("Steel", totalSteelMass);
    addMass("Soil", totalSoilMass);
  }

  // 2. Footing: L * W * D * Count
  if (inputs.footing?.enabled) {
    const ft = inputs.footing;
    const items = ft.items && ft.items.length > 0 ? ft.items : [{ id: "def_footing", name: "Standard Footing", ...ft }];

    let totalVolume = 0;
    let totalSteelMass = 0;
    let totalConcMass = 0;
    const steps: string[] = [];

    items.forEach((item, idx) => {
      const l = Number(item.length || 0);
      const w = Number(item.width || 0);
      const d = Number(item.depth || 0);
      const count = Number(item.count || 1);

      const volume = l * w * d * count;
      const steelMass = volume * 0.012 * DENSITIES.steel;
      const concMass = (volume * DENSITIES.rccConcrete) - steelMass;

      totalVolume += volume;
      totalSteelMass += steelMass;
      totalConcMass += concMass;

      steps.push(
        `Variant [#${idx + 1} - ${item.name || 'Core'}]: Volume = L (${l}m) × W (${w}m) × D (${d}m) × Qty (${count}) = ${volume.toFixed(2)} m³`
      );
    });

    componentsResults["footing"] = {
      name: "Footing",
      volume: totalVolume,
      totalMass: totalVolume * DENSITIES.rccConcrete,
      breakdown: { "Concrete": totalConcMass, "Steel": totalSteelMass },
      steps: [
        `Summary: Combined Footing of ${items.length} block variant(s), total volume = ${totalVolume.toFixed(2)} m³`,
        ...steps,
        `Steel reinforcement (1.2% volumetric ratio): ${totalSteelMass.toFixed(1)} kg, Concrete: ${totalConcMass.toFixed(1)} kg`
      ]
    };
    addMass("Concrete", totalConcMass);
    addMass("Steel", totalSteelMass);
  }

  // 3. Columns: Cross-Sectional Area (W * B) * Height * Count
  if (inputs.columns?.enabled) {
    const col = inputs.columns;
    const items = col.items && col.items.length > 0 ? col.items : [{ id: "def_column", name: "Standard Columns", ...col }];

    let totalVolume = 0;
    let totalSteelMass = 0;
    let totalConcMass = 0;
    const steps: string[] = [];

    items.forEach((item, idx) => {
      const width = Number(item.width || 0);
      const breadth = Number(item.breadth || 0);
      const h = Number(item.height || 0);
      const count = Number(item.count || 1);

      const volume = width * breadth * h * count;
      const steelMass = volume * 0.02 * DENSITIES.steel;
      const concMass = (volume * DENSITIES.rccConcrete) - steelMass;

      totalVolume += volume;
      totalSteelMass += steelMass;
      totalConcMass += concMass;

      steps.push(
        `Variant [#${idx + 1} - ${item.name || 'Core'}]: Volume = W (${width}m) × B (${breadth}m) × H (${h}m) × Qty (${count}) = ${volume.toFixed(2)} m³`
      );
    });

    componentsResults["columns"] = {
      name: "Columns",
      volume: totalVolume,
      totalMass: totalVolume * DENSITIES.rccConcrete,
      breakdown: { "Concrete": totalConcMass, "Steel": totalSteelMass },
      steps: [
        `Summary: Combined Columns of ${items.length} column variant(s), total volume = ${totalVolume.toFixed(2)} m³`,
        ...steps,
        `Steel reinforcement (2.0% heavy volumetric ratio): ${totalSteelMass.toFixed(1)} kg, Concrete: ${totalConcMass.toFixed(1)} kg`
      ]
    };
    addMass("Concrete", totalConcMass);
    addMass("Steel", totalSteelMass);
  }

  // 4. Beams: Length * Width * Depth * Count
  if (inputs.beams?.enabled) {
    const beam = inputs.beams;
    const items = beam.items && beam.items.length > 0 ? beam.items : [{ id: "def_beam", name: "Standard Beams", ...beam }];

    let totalVolume = 0;
    let totalSteelMass = 0;
    let totalConcMass = 0;
    const steps: string[] = [];

    items.forEach((item, idx) => {
      const l = Number(item.length || 0);
      const w = Number(item.width || 0);
      const d = Number(item.depth || 0);
      const count = Number(item.count || 1);

      const volume = l * w * d * count;
      const steelMass = volume * 0.016 * DENSITIES.steel;
      const concMass = (volume * DENSITIES.rccConcrete) - steelMass;

      totalVolume += volume;
      totalSteelMass += steelMass;
      totalConcMass += concMass;

      steps.push(
        `Variant [#${idx + 1} - ${item.name || 'Core'}]: Volume = L (${l}m) × W (${w}m) × D (${d}m) × Qty (${count}) = ${volume.toFixed(2)} m³`
      );
    });

    componentsResults["beams"] = {
      name: "Beams",
      volume: totalVolume,
      totalMass: totalVolume * DENSITIES.rccConcrete,
      breakdown: { "Concrete": totalConcMass, "Steel": totalSteelMass },
      steps: [
        `Summary: Combined Beams of ${items.length} beam variant(s), total volume = ${totalVolume.toFixed(2)} m³`,
        ...steps,
        `Steel reinforcement (1.6% volumetric ratio): ${totalSteelMass.toFixed(1)} kg, Concrete: ${totalConcMass.toFixed(1)} kg`
      ]
    };
    addMass("Concrete", totalConcMass);
    addMass("Steel", totalSteelMass);
  }

  // 5. Slabs: Area * Thickness * Count
  if (inputs.slabs?.enabled) {
    const slab = inputs.slabs;
    const items = slab.items && slab.items.length > 0 ? slab.items : [{ id: "def_slab", name: "Standard Slabs", ...slab }];

    let totalVolume = 0;
    let totalSteelMass = 0;
    let totalConcMass = 0;
    const steps: string[] = [];

    items.forEach((item, idx) => {
      const area = Number(item.area || 0);
      const thick = Number(item.thickness || 0);
      const count = Number(item.count || 1);

      const volume = area * thick * count;
      const steelMass = volume * 0.008 * DENSITIES.steel;
      const concMass = (volume * DENSITIES.rccConcrete) - steelMass;

      totalVolume += volume;
      totalSteelMass += steelMass;
      totalConcMass += concMass;

      steps.push(
        `Variant [#${idx + 1} - ${item.name || 'Core'}]: Volume = Area (${area} m²) × Thickness (${thick}m) × Floors (${count}) = ${volume.toFixed(2)} m³`
      );
    });

    componentsResults["slabs"] = {
      name: "Slabs",
      volume: totalVolume,
      totalMass: totalVolume * DENSITIES.rccConcrete,
      breakdown: { "Concrete": totalConcMass, "Steel": totalSteelMass },
      steps: [
        `Summary: Combined Slabs of ${items.length} slab variant(s), total volume = ${totalVolume.toFixed(2)} m³`,
        ...steps,
        `Steel reinforcement (0.8% volumetric ratio): ${totalSteelMass.toFixed(1)} kg, Concrete: ${totalConcMass.toFixed(1)} kg`
      ]
    };
    addMass("Concrete", totalConcMass);
    addMass("Steel", totalSteelMass);
  }

  // 6. Walls: Length * Height * Thickness * Count
  if (inputs.walls?.enabled) {
    const wall = inputs.walls;
    const items = wall.items && wall.items.length > 0 ? wall.items : [{ id: "def_wall", name: "Standard Walls", ...wall }];

    let totalVolume = 0;
    let totalMassAll = 0;
    const breakdown: { [mat: string]: number } = {};
    const steps: string[] = [];

    items.forEach((item, idx) => {
      const l = Number(item.length || 0);
      const h = Number(item.height || 0);
      const thick = Number(item.thickness || 0);
      const count = Number(item.count || 1);
      const matType = item.materialType || "Brick";

      const volume = l * h * thick * count;
      let materialName = "Brick";
      let density = DENSITIES.brickMasonry;
      
      if (matType === "Concrete Block" || matType === "RCC Wall") {
        materialName = "Concrete";
        density = DENSITIES.rccConcrete;
      }

      const totalMass = volume * density;
      totalVolume += volume;
      totalMassAll += totalMass;
      breakdown[materialName] = (breakdown[materialName] || 0) + totalMass;

      steps.push(
        `Variant [#${idx + 1} - ${item.name || 'Core'}]: V = ${volume.toFixed(2)} m³ of ${matType} (Density: ${density} kg/m³, Weight: ${totalMass.toFixed(1)} kg)`
      );
      addMass(materialName, totalMass);
    });

    componentsResults["walls"] = {
      name: "Walls",
      volume: totalVolume,
      totalMass: totalMassAll,
      breakdown,
      steps: [
        `Summary: Combined Walls of ${items.length} variant(s), total volume = ${totalVolume.toFixed(2)} m³`,
        ...steps,
        `Total wall brick/block mass = ${totalMassAll.toFixed(1)} kg`
      ]
    };
  }

  // 7. Staircases: L * W * Thickness/WaistSlab. Let's make waist-slab model + step additions
  if (inputs.staircases?.enabled) {
    const st = inputs.staircases;
    const items = st.items && st.items.length > 0 ? st.items : [{ id: "def_staircase", name: "Standard Staircase", ...st }];

    let totalVolume = 0;
    let totalMassAll = 0;
    let totalSteelMass = 0;
    let totalConcMass = 0;
    const stepsDesc: string[] = [];

    items.forEach((item, idx) => {
      const l = Number(item.length || 0);
      const w = Number(item.width || 0);
      const waist = Number(item.thickness || 0.15);
      const steps = Number(item.steps || 15);
      const count = Number(item.count || 1);

      const waistVol = l * w * waist;
      const stepsVol = steps * 0.03 * w;
      const volume = (waistVol + stepsVol) * count;
      const totalMass = volume * DENSITIES.rccConcrete;
      const steelMass = volume * 0.01 * DENSITIES.steel;
      const concMass = totalMass - steelMass;

      totalVolume += volume;
      totalMassAll += totalMass;
      totalSteelMass += steelMass;
      totalConcMass += concMass;

      stepsDesc.push(
        `Variant [#${idx + 1} - ${item.name || 'Core'}]: Volume = [Waist (${l}m × ${w}m × ${waist}m) + Steps (${steps} × 0.03 m³)] × flights (${count}) = ${volume.toFixed(2)} m³`
      );
    });

    componentsResults["staircases"] = {
      name: "Staircases",
      volume: totalVolume,
      totalMass: totalMassAll,
      breakdown: { "Concrete": totalConcMass, "Steel": totalSteelMass },
      steps: [
        `Summary: Combined Staircases of ${items.length} flight variant(s), total volume = ${totalVolume.toFixed(2)} m³`,
        ...stepsDesc,
        `Reinforcement steel meshes (1.0% volumetric ratio): ${totalSteelMass.toFixed(1)} kg, Concrete: ${totalConcMass.toFixed(1)} kg`
      ]
    };
    addMass("Concrete", totalConcMass);
    addMass("Steel", totalSteelMass);
  }

  // 8. Roof: Area * Thickness * Count
  if (inputs.roof?.enabled) {
    const rf = inputs.roof;
    const items = rf.items && rf.items.length > 0 ? rf.items : [{ id: "def_roof", name: "Standard Roof", ...rf }];

    let totalVolume = 0;
    let totalMassAll = 0;
    const breakdown: { [mat: string]: number } = {};
    const stepsDesc: string[] = [];

    items.forEach((item, idx) => {
      const area = Number(item.area || 0);
      const thick = Number(item.thickness || 0);
      const matType = item.materialType || "RCC";

      const volume = area * thick;
      let totalMass = 0;

      if (matType === "RCC") {
        totalMass = volume * DENSITIES.rccConcrete;
        const steel = volume * 0.012 * DENSITIES.steel;
        const conc = totalMass - steel;
        breakdown["Concrete"] = (breakdown["Concrete"] || 0) + conc;
        breakdown["Steel"] = (breakdown["Steel"] || 0) + steel;
        stepsDesc.push(
          `Variant [#${idx + 1} - ${item.name || 'Core'}]: Volume = ${volume.toFixed(2)} m³ (RCC, Steel Reinforcement: ${steel.toFixed(1)} kg, Concrete: ${conc.toFixed(1)} kg)`
        );
        addMass("Concrete", conc);
        addMass("Steel", steel);
      } else if (matType === "Metal Sheet") {
        totalMass = area * 12;
        breakdown["Steel"] = (breakdown["Steel"] || 0) + totalMass;
        stepsDesc.push(
          `Variant [#${idx + 1} - ${item.name || 'Core'}]: Face Area = ${area} m² (Corrugated metal panels, Steel Weight: ${totalMass.toFixed(1)} kg)`
        );
        addMass("Steel", totalMass);
      } else { // Timber
        totalMass = volume * DENSITIES.wood;
        breakdown["Wood"] = (breakdown["Wood"] || 0) + totalMass;
        stepsDesc.push(
          `Variant [#${idx + 1} - ${item.name || 'Core'}]: Volume = ${volume.toFixed(2)} m³ (Timber frame structures, Wood Weight: ${totalMass.toFixed(1)} kg)`
        );
        addMass("Wood", totalMass);
      }
      totalVolume += volume;
      totalMassAll += totalMass;
    });

    componentsResults["roof"] = {
      name: "Roof / Ceiling Deck",
      volume: totalVolume,
      totalMass: totalMassAll,
      breakdown,
      steps: [
        `Summary: Combined Roof covers consisting of ${items.length} variant(s), total volume = ${totalVolume.toFixed(2)} m³`,
        ...stepsDesc
      ]
    };
  }

  // --- NON-STRUCTURAL ENGINES ---

  // 9. Doors: Count * W * H * Frame thickness
  if (inputs.doors?.enabled) {
    const d = inputs.doors;
    const items = d.items && d.items.length > 0 ? d.items : [{ id: "def_door", name: "Standard Doors", ...d }];

    let totalVolume = 0;
    let totalMassAll = 0;
    const breakdown: { [mat: string]: number } = {};
    const stepsDesc: string[] = [];

    items.forEach((item, idx) => {
      const count = Number(item.count || 0);
      const w = Number(item.width || 0.9);
      const h = Number(item.height || 2.1);
      const mat = item.material || "Wood";

      const frameVol = count * w * h * 0.04;
      let totalMass = 0;
      let materialName = "Wood";
      
      if (mat === "Metal") {
        materialName = "Steel";
        totalMass = frameVol * DENSITIES.steel * 0.15;
      } else if (mat === "PVC") {
        materialName = "Plastics (PVC)";
        totalMass = frameVol * DENSITIES.plastic;
      } else {
        materialName = "Wood";
        totalMass = frameVol * DENSITIES.wood;
      }

      totalVolume += frameVol;
      totalMassAll += totalMass;
      breakdown[materialName] = (breakdown[materialName] || 0) + totalMass;

      stepsDesc.push(
        `Variant [#${idx + 1} - ${item.name || 'Core'}]: Qty (${count}) × ${w}m × ${h}m shutter = ${frameVol.toFixed(3)} m³ of ${mat} (${totalMass.toFixed(1)} kg)`
      );
      addMass(materialName, totalMass);
    });

    componentsResults["doors"] = {
      name: "Doors",
      volume: totalVolume,
      totalMass: totalMassAll,
      breakdown,
      steps: [
        `Summary: Combined prefab doors of ${items.length} sizing variant(s), total shutter volume = ${totalVolume.toFixed(3)} m³`,
        ...stepsDesc
      ]
    };
  }

  // 10. Windows: Count * W * H
  if (inputs.windows?.enabled) {
    const win = inputs.windows;
    const items = win.items && win.items.length > 0 ? win.items : [{ id: "def_window", name: "Standard Windows", ...win }];

    let totalVolume = 0;
    let totalMassAll = 0;
    const breakdown: { [mat: string]: number } = {};
    const stepsDesc: string[] = [];

    items.forEach((item, idx) => {
      const count = Number(item.count || 0);
      const w = Number(item.width || 1.2);
      const h = Number(item.height || 1.2);
      const frameMat = item.material || "Aluminium";

      const faceArea = count * w * h;
      const glassMass = faceArea * 0.6 * 0.005 * DENSITIES.glass;
      
      let frameMass = 0;
      let frameType = "Steel";
      if (frameMat === "Aluminium" || frameMat === "Steel") {
        frameMass = faceArea * 12;
        frameType = "Steel";
      } else {
        frameMass = faceArea * 0.4 * 0.06 * DENSITIES.wood;
        frameType = "Wood";
      }

      totalVolume += faceArea * 0.05;
      totalMassAll += (glassMass + frameMass);
      breakdown["Glass"] = (breakdown["Glass"] || 0) + glassMass;
      breakdown[frameType] = (breakdown[frameType] || 0) + frameMass;

      stepsDesc.push(
        `Variant [#${idx + 1} - ${item.name || 'Core'}]: Qty (${count}) × ${w}m × ${h}m frame, Area = ${faceArea.toFixed(2)} m² (Glass: ${glassMass.toFixed(1)} kg, Frame: ${frameMass.toFixed(1)} kg)`
      );
      addMass("Glass", glassMass);
      addMass(frameType, frameMass);
    });

    componentsResults["windows"] = {
      name: "Windows",
      volume: totalVolume,
      totalMass: totalMassAll,
      breakdown,
      steps: [
        `Summary: Combined glazed window units of ${items.length} variant(s), total mass = ${totalMassAll.toFixed(1)} kg`,
        ...stepsDesc
      ]
    };
  }

  // 11. Glass panels
  if (inputs.glass?.enabled) {
    const gl = inputs.glass;
    const items = gl.items && gl.items.length > 0 ? gl.items : [{ id: "def_glass", name: "Standard Glass", ...gl }];

    let totalVolume = 0;
    let totalMassAll = 0;
    const stepsDesc: string[] = [];

    items.forEach((item, idx) => {
      const area = Number(item.area || 0);
      const thick = Number(item.thickness || 5) / 1000;

      const volume = area * thick;
      const mass = volume * DENSITIES.glass;

      totalVolume += volume;
      totalMassAll += mass;

      stepsDesc.push(
        `Variant [#${idx + 1} - ${item.name || 'Core'}]: Area ${area} m² × ${Math.round(thick*1000)}mm glass = ${volume.toFixed(4)} m³ (${mass.toFixed(1)} kg)`
      );
      addMass("Glass", mass);
    });

    componentsResults["glass"] = {
      name: "Glass Fittings",
      volume: totalVolume,
      totalMass: totalMassAll,
      breakdown: { "Glass": totalMassAll },
      steps: [
        `Summary: Combined glazed entities of ${items.length} dynamic row(s), total volume = ${totalVolume.toFixed(4)} m³`,
        ...stepsDesc
      ]
    };
  }

  // 12. Tiles and Ceramics
  if (inputs.tiles?.enabled) {
    const t = inputs.tiles;
    const items = t.items && t.items.length > 0 ? t.items : [{ id: "def_tiles", name: "Standard Tiles", ...t }];

    let totalVolume = 0;
    let totalMassAll = 0;
    const stepsDesc: string[] = [];

    items.forEach((item, idx) => {
      const area = Number(item.area || 0);
      const thick = Number(item.thickness || 8) / 1000;
      
      const totalVol = area * thick;
      const mass = totalVol * DENSITIES.tiles;

      totalVolume += totalVol;
      totalMassAll += mass;

      stepsDesc.push(
        `Variant [#${idx + 1} - ${item.name || 'Core'}]: Plan Area ${area} m² × ${Math.round(thick*1000)}mm tiles = ${totalVol.toFixed(3)} m³ (${mass.toFixed(1)} kg)`
      );
      addMass("Tiles", mass);
    });

    componentsResults["tiles"] = {
      name: "Tiles / Interior Ceramics",
      volume: totalVolume,
      totalMass: totalMassAll,
      breakdown: { "Tiles": totalMassAll },
      steps: [
        `Summary: Combined floor tiling sections of ${items.length} layout variant(s), total mass = ${totalMassAll.toFixed(1)} kg`,
        ...stepsDesc
      ]
    };
  }

  // 13. Plumbing installations
  if (inputs.plumbing?.enabled) {
    const p = inputs.plumbing;
    const items = p.items && p.items.length > 0 ? p.items : [{ id: "def_plumbing", name: "Standard Plumbing", ...p }];

    let totalVolume = 0;
    let totalMassAll = 0;
    let totalPvcMass = 0;
    let totalMetalPipeMass = 0;
    let totalCeramicMass = 0;
    const stepsDesc: string[] = [];

    items.forEach((item, idx) => {
      const pipeL = Number(item.length || 0);
      const metalPipesRatio = item.pipeMaterial === "GI/Metal" ? 0.8 : 0.1;
      const fixturesCount = Number(item.fixtures || 5);

      const pipeMass = pipeL * (metalPipesRatio === 0.8 ? 2.5 : 0.8);
      const fixtureMass = fixturesCount * 22;

      const pvcMass = pipeMass * (1 - metalPipesRatio);
      const metalPipeMass = pipeMass * metalPipesRatio;
      const ceramicMass = fixtureMass;

      totalVolume += pipeL * 0.002;
      totalMassAll += (pipeMass + fixtureMass);
      totalPvcMass += pvcMass;
      totalMetalPipeMass += metalPipeMass;
      totalCeramicMass += ceramicMass;

      stepsDesc.push(
        `Variant [#${idx + 1} - ${item.name || 'Core'}]: Running pipe ${pipeL}m (${item.pipeMaterial}) + ${fixturesCount} fixtures (PVC: ${pvcMass.toFixed(1)} kg, Metal: ${metalPipeMass.toFixed(1)} kg, Vitrified Clay: ${ceramicMass.toFixed(1)} kg)`
      );

      addMass("Plastics (PVC)", pvcMass);
      addMass("Steel", metalPipeMass);
      addMass("Tiles", ceramicMass);
    });

    componentsResults["plumbing"] = {
      name: "Plumbing Utility",
      volume: totalVolume,
      totalMass: totalMassAll,
      breakdown: { "Plastics (PVC)": totalPvcMass, "Steel": totalMetalPipeMass, "Tiles": totalCeramicMass },
      steps: [
        `Summary: Combined Plumbing utilities of ${items.length} pipeline segment(s), total weight = ${totalMassAll.toFixed(1)} kg`,
        ...stepsDesc
      ]
    };
  }

  // 14. Electrical
  if (inputs.electrical?.enabled) {
    const el = inputs.electrical;
    const items = el.items && el.items.length > 0 ? el.items : [{ id: "def_electrical", name: "Standard Electrical", ...el }];

    let totalVolume = 0;
    let totalMassAll = 0;
    let totalPvcMass = 0;
    let totalCopperMass = 0;
    let totalSteelMass = 0;
    const stepsDesc: string[] = [];

    items.forEach((item, idx) => {
      const area = Number(item.area || 0);
      
      const pvcMass = area * 1.5;
      const copperMass = area * 0.25;
      const steelMass = area * 0.75;

      totalVolume += area * 0.001;
      totalMassAll += (pvcMass + copperMass + steelMass);
      totalPvcMass += pvcMass;
      totalCopperMass += copperMass;
      totalSteelMass += steelMass;

      stepsDesc.push(
        `Variant [#${idx + 1} - ${item.name || 'Core'}]: Area cover ${area} m² (PVC: ${pvcMass.toFixed(1)} kg, Copper: ${copperMass.toFixed(1)} kg, Steel parts: ${steelMass.toFixed(1)} kg)`
      );

      addMass("Plastics (PVC)", pvcMass);
      addMass("Metals/Copper", copperMass);
      addMass("Steel", steelMass);
    });

    componentsResults["electrical"] = {
      name: "Electrical Conduits / Cables",
      volume: totalVolume,
      totalMass: totalMassAll,
      breakdown: { "Plastics (PVC)": totalPvcMass, "Metals/Copper": totalCopperMass, "Steel": totalSteelMass },
      steps: [
        `Summary: Combined electrical grids of ${items.length} section(s), total weight = ${totalMassAll.toFixed(1)} kg`,
        ...stepsDesc
      ]
    };
  }

  // 15. False Ceiling
  if (inputs.falseCeiling?.enabled) {
    const fc = inputs.falseCeiling;
    const items = fc.items && fc.items.length > 0 ? fc.items : [{ id: "def_falseCeiling", name: "Standard False Ceiling", ...fc }];

    let totalVolume = 0;
    let totalMassAll = 0;
    const breakdown: { [mat: string]: number } = {};
    const stepsDesc: string[] = [];

    items.forEach((item, idx) => {
      const area = Number(item.area || 0);
      const mat = item.material || "Gypsum Board";

      let mass = 0;
      let materialName = "Gypsum";
      if (mat === "Gypsum Board") {
        mass = area * 8.5;
      } else if (mat === "POP") {
        mass = area * 12;
      } else {
        materialName = "Steel";
        mass = area * 4.5;
      }

      totalVolume += area * 0.012;
      totalMassAll += mass;
      breakdown[materialName] = (breakdown[materialName] || 0) + mass;

      stepsDesc.push(
        `Variant [#${idx + 1} - ${item.name || 'Core'}]: Plan Area ${area} m² (${mat}, Weight: ${mass.toFixed(1)} kg of ${materialName})`
      );

      addMass(materialName, mass);
    });

    componentsResults["falseCeiling"] = {
      name: "False Ceiling Panels",
      volume: totalVolume,
      totalMass: totalMassAll,
      breakdown,
      steps: [
        `Summary: Combined False Ceiling plans of ${items.length} variant(s), total mass = ${totalMassAll.toFixed(1)} kg`,
        ...stepsDesc
      ]
    };
  }

  // 16. Paint
  if (inputs.paint?.enabled) {
    const pt = inputs.paint;
    const items = pt.items && pt.items.length > 0 ? pt.items : [{ id: "def_paint", name: "Standard Paint", ...pt }];

    let totalVolume = 0;
    let totalMassAll = 0;
    const stepsDesc: string[] = [];

    items.forEach((item, idx) => {
      const area = Number(item.area || 0);
      const thick = 0.1 / 1000;
      const volume = area * thick;
      const mass = volume * 1400;

      totalVolume += volume;
      totalMassAll += mass;

      stepsDesc.push(
        `Variant [#${idx + 1} - ${item.name || 'Core'}]: Surface area ${area} m² × 0.1mm film = ${volume.toFixed(4)} m³ (${mass.toFixed(1)} kg)`
      );

      addMass("Gypsum", mass);
    });

    componentsResults["paint"] = {
      name: "Paint Scrapings / Waste",
      volume: totalVolume,
      totalMass: totalMassAll,
      breakdown: { "Gypsum": totalMassAll },
      steps: [
        `Summary: Combined wall skins scrape of ${items.length} detail lines, total pigment weight = ${totalMassAll.toFixed(1)} kg`,
        ...stepsDesc
      ]
    };
  }

  // 17. Woodwork (Plywood cabinetry/MDF)
  if (inputs.woodwork?.enabled) {
    const ww = inputs.woodwork;
    const items = ww.items && ww.items.length > 0 ? ww.items : [{ id: "def_woodwork", name: "Standard Woodwork", ...ww }];

    let totalVolume = 0;
    let totalMassAll = 0;
    const stepsDesc: string[] = [];

    items.forEach((item, idx) => {
      const area = Number(item.area || 0);
      const thick = Number(item.thickness || 18) / 1000;

      const volume = area * thick;
      const mass = volume * 650;

      totalVolume += volume;
      totalMassAll += mass;

      stepsDesc.push(
        `Variant [#${idx + 1} - ${item.name || 'Core'}]: Plan Area ${area} m² × ${Math.round(thick*1000)}mm plywood board = ${volume.toFixed(3)} m³ (${mass.toFixed(1)} kg)`
      );

      addMass("Wood", mass);
    });

    componentsResults["woodwork"] = {
      name: "Modular Woodwork & Cabinets",
      volume: totalVolume,
      totalMass: totalMassAll,
      breakdown: { "Wood": totalMassAll },
      steps: [
        `Summary: Combined plywood/furniture board layouts of ${items.length} fitting list(s), total volume = ${totalVolume.toFixed(3)} m³`,
        ...stepsDesc
      ]
    };
  }
  }

  // --- MERGE MATERIAL METRICS & CODES ---

  let totalMassAll = 0;
  let totalReuseAll = 0;
  let totalRecycleAll = 0;
  let totalLandfillAll = 0;

  let totSteelScrapVal = 0;
  let totBrickRecoveryVal = 0;
  let totWoodRecoveryVal = 0;
  let totConcreteRecyclingVal = 0; // processed aggregate credit

  const breakdownsArray: MaterialResult[] = [];

  Object.entries(aggregatedBreakdown).forEach(([material, mass]) => {
    totalMassAll += mass;

    const coefs = MATERIAL_SPLITS[material] || { reuse: 0.10, recycle: 0.70, landfill: 0.20 };
    const reuseMassVal = mass * coefs.reuse;
    const recycleMassVal = mass * coefs.recycle;
    const landfillMassVal = mass * coefs.landfill;

    totalReuseAll += reuseMassVal;
    totalRecycleAll += recycleMassVal;
    totalLandfillAll += landfillMassVal;

    // Financial Recovery Values:
    let recoveryValue = 0;
    let recyclingCost = 0;

    if (material === "Steel" || material === "Metals/Copper") {
      // scrap value
      recoveryValue = mass * rates.steelScrapRate;
      if (material === "Metals/Copper") {
        recoveryValue = mass * (rates.steelScrapRate * 12); // copper is worth heavily more than steel!
      }
    } else if (material === "Brick") {
      // bricks are around 2kg per brick, rate is for brick recovery
      recoveryValue = mass * rates.brickRecoveryValue; 
    } else if (material === "Wood") {
      recoveryValue = mass * rates.woodRecoveryValue;
    } else if (material === "Concrete") {
      // Concrete cost to recycle at professional plant:
      recyclingCost = recycleMassVal * rates.concreteRecyclingRate;
      // credits: concrete recycled can be sold as cheap aggregate (credits of ₹ 0.20 per kg)
      recoveryValue = recycleMassVal * 0.25;
    } else if (material === "Glass") {
      recoveryValue = recycleMassVal * 1.5; // clear cullet value
    }

    totSteelScrapVal += (material === "Steel" ? recoveryValue : 0) + (material === "Metals/Copper" ? recoveryValue : 0);
    totBrickRecoveryVal += material === "Brick" ? recoveryValue : 0;
    totWoodRecoveryVal += material === "Wood" ? recoveryValue : 0;
    totConcreteRecyclingVal += material === "Concrete" ? recoveryValue : 0;

    breakdownsArray.push({
      material,
      totalMass: mass,
      reusableMass: reuseMassVal,
      recyclableMass: recycleMassVal,
      landfillMass: landfillMassVal,
      recoveryValue,
      recyclingCost
    });
  });

  // Transport and landfill calculations:
  // dumper trips estimation
  const tripCapacity = rates.tripCapacity;
  const numTrips = Math.ceil(totalMassAll / tripCapacity) || 1;
  const transportCost = meta.leadDistance * numTrips * rates.transportRate;

  const landfillCost = totalLandfillAll * rates.landfillCharge;
  const totalRecycleValue = breakdownsArray.reduce((acc, curr) => acc + curr.recoveryValue, 0);
  const totalProcessingCost = breakdownsArray.reduce((acc, curr) => acc + curr.recyclingCost, 0);

  const netCost = (transportCost + landfillCost + totalProcessingCost) - totalRecycleValue;

  // Sustainability score: (reused + recycled) / total * 100
  const diversionRate = totalMassAll > 0 ? ((totalReuseAll + totalRecycleAll) / totalMassAll) * 100 : 80;
  
  // High diversion rate grants standard credits. We'll fine tune score with landfill offset
  const sustainabilityScore = Math.min(100, Math.round(diversionRate));

  return {
    totalWasteMass: totalMassAll,
    totalRecoverableMass: totalRecycleAll,
    totalReusableMass: totalReuseAll,
    totalLandfillMass: totalLandfillAll,
    recoveryValue: totalRecycleValue,
    transportCost,
    landfillCost,
    recyclingCost: totalProcessingCost,
    netCost,
    sustainabilityScore,
    materialBreakdown: breakdownsArray,
    components: componentsResults
  };
}
