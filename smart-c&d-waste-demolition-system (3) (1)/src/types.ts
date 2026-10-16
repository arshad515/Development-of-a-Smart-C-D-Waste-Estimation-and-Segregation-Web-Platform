/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProjectMetadata {
  projectName: string;
  buildingType: string; // 'Residential' | 'Commercial' | 'Industrial' | 'School' | 'Hospital' | 'Renovation' | 'Partial' | 'Road' | 'Bridge'
  city: string; // 'Pune' | 'Mumbai' | 'Nagpur' | 'Nashik' | 'Aurangabad' | 'Delhi' | 'Bangalore' | 'Hyderabad' | 'Chennai' | 'Kolkata' | 'Ahmedabad'
  demolitionType: 'Full' | 'Partial' | 'Deconstruction';
  builtUpArea: number; // in sq.m
  floorsCount: number;
  rccGrade: string; // 'M20' | 'M25' | 'M30'
  constructionType: 'RCC Frame' | 'Load Bearing' | 'Steel Frame' | 'Composite';
  leadDistance: number; // distance to recycling/landfill in km
  calculationMode?: 'correct' | 'approximate';
}

export interface ComponentItem {
  id: string;
  name: string;
  [field: string]: any;
}

export interface ComponentInput {
  enabled: boolean;
  type: string; // material type helper
  items?: ComponentItem[];
  [key: string]: any; // specific dimensions like length, width, height, etc.
}

export interface EstimationInputs {
  // Structural
  foundation: ComponentInput;
  footing: ComponentInput;
  columns: ComponentInput;
  beams: ComponentInput;
  slabs: ComponentInput;
  walls: ComponentInput;
  staircases: ComponentInput;
  roof: ComponentInput;

  // Non-structural
  doors: ComponentInput;
  windows: ComponentInput;
  glass: ComponentInput;
  tiles: ComponentInput;
  plumbing: ComponentInput;
  electrical: ComponentInput;
  falseCeiling: ComponentInput;
  paint: ComponentInput;
  woodwork: ComponentInput;
}

export interface MaterialResult {
  material: string;
  totalMass: number; // kg
  reusableMass: number; // kg
  recyclableMass: number; // kg
  landfillMass: number; // kg
  recoveryValue: number; // ₹ (credits from scrap/sales)
  recyclingCost: number; // ₹
}

export interface ComponentCalculation {
  name: string;
  volume: number; // m³
  totalMass: number; // kg
  breakdown: { [material: string]: number }; // material -> kg mapping
  steps: string[]; // text descriptions of engineering calculations
}

export interface EstimationOutputs {
  totalWasteMass: number; // kg
  totalRecoverableMass: number; // kg (recyclable)
  totalReusableMass: number; // kg (direct reuse)
  totalLandfillMass: number; // kg
  
  recoveryValue: number; // ₹ saved/recovered
  transportCost: number; // ₹ cost to move
  landfillCost: number; // ₹ cost to dump
  recyclingCost: number; // ₹ cost to recycle/process
  netCost: number; // (transportCost + landfillCost + recyclingCost) - recoveryValue
  sustainabilityScore: number; // 0 to 100 based on diversion rate
  
  materialBreakdown: MaterialResult[];
  components: { [key: string]: ComponentCalculation };
}

export interface CityRates {
  city: string;
  steelScrapRate: number; // ₹/kg
  brickRecoveryValue: number; // ₹ each or ₹/kg
  woodRecoveryValue: number; // ₹/kg
  concreteRecyclingRate: number; // ₹/kg or ₹/tonne (we'll standardize to ₹/kg)
  transportRate: number; // ₹ per km per trip
  landfillCharge: number; // ₹/tonne or ₹/kg
  tripCapacity: number; // in kg (e.g., 5000 kg dumper limit)
}

export interface ManualChapter {
  id: string;
  title: string;
  content: string; // markdown content or sectioned text
  subsections?: { title: string; content: string }[];
}
