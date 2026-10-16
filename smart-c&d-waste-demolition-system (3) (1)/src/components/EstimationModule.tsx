/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { EstimationInputs } from "../types";
import { ChevronDown, ChevronUp, Construction, Hammer, HelpCircle, ToggleLeft, ToggleRight, Info } from "lucide-react";

interface EstimationModuleProps {
  inputs: EstimationInputs;
  setInputs: React.Dispatch<React.SetStateAction<EstimationInputs>>;
  calculationMode?: 'correct' | 'approximate';
}

export function EstimationModule({ inputs, setInputs, calculationMode }: EstimationModuleProps) {
  const [activeSection, setActiveSection] = useState<string | null>("foundation");

  const toggleComponent = (key: keyof EstimationInputs) => {
    setInputs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key].enabled,
      },
    }));
  };

  const updateField = (key: keyof EstimationInputs, field: string, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const toggleExpand = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const updateItemField = (key: keyof EstimationInputs, itemId: string, field: string, value: any) => {
    setInputs((prev) => {
      const comp = prev[key];
      let items = comp.items ? [...comp.items] : [];
      if (items.length === 0) {
        const firstItem = {
          id: "def_" + key,
          name: "Standard Section",
          ...comp
        };
        items = [firstItem];
      }

      const updatedItems = items.map((item) => {
        if (item.id === itemId) {
          return { ...item, [field]: value };
        }
        return item;
      });

      return {
        ...prev,
        [key]: {
          ...comp,
          items: updatedItems,
          ...(updatedItems[0] ? updatedItems[0] : {}),
        },
      };
    });
  };

  const addItemInstance = (key: keyof EstimationInputs, fields: any[], elementLabel: string) => {
    setInputs((prev) => {
      const comp = prev[key];
      let items = comp.items ? [...comp.items] : [];
      
      if (items.length === 0) {
        const firstItem = {
          id: "def_" + key,
          name: `Standard ${elementLabel}`,
          ...comp
        };
        items = [firstItem];
      }

      const newItem: any = {
        id: `custom_${key}_${Date.now()}`,
        name: `${elementLabel} Type ${items.length + 1}`,
      };

      fields.forEach((f) => {
        newItem[f.name] = comp[f.name] !== undefined ? comp[f.name] : f.default;
      });

      return {
        ...prev,
        [key]: {
          ...comp,
          items: [...items, newItem],
        },
      };
    });
  };

  const removeItemInstance = (key: keyof EstimationInputs, itemId: string) => {
    setInputs((prev) => {
      const comp = prev[key];
      let items = comp.items ? [...comp.items] : [];
      
      if (items.length <= 1) return prev;
      
      const updatedItems = items.filter((item) => item.id !== itemId);
      
      return {
        ...prev,
        [key]: {
          ...comp,
          items: updatedItems,
          ...(updatedItems[0] ? updatedItems[0] : {}),
        }
      };
    });
  };

  // List of Structural and Non-structural targets with configurations
  const structuralList: { key: keyof EstimationInputs; label: string; formula: string; fields: { name: string; label: string; type: string; options?: string[]; default: any }[] }[] = [
    {
      key: "foundation",
      label: "Foundation Excavation / Core",
      formula: "Volume = Length × Width × Depth × Count",
      fields: [
        { name: "length", label: "Length (m)", type: "number", default: 12 },
        { name: "width", label: "Width (m)", type: "number", default: 10 },
        { name: "depth", label: "Depth (m)", type: "number", default: 1.5 },
        { name: "count", label: "Count / Blocks", type: "number", default: 1 },
        { name: "soilRatio", label: "Soil / Overlay Ratio", type: "range", default: 0.4 }
      ]
    },
    {
      key: "footing",
      label: "Footing Blocks (Isolated / Combined)",
      formula: "Volume = Length × Width × Depth × Count",
      fields: [
        { name: "length", label: "Length (m)", type: "number", default: 1.5 },
        { name: "width", label: "Width (m)", type: "number", default: 1.5 },
        { name: "depth", label: "Depth (m)", type: "number", default: 0.6 },
        { name: "count", label: "Number of Footings", type: "number", default: 12 }
      ]
    },
    {
      key: "columns",
      label: "Structural Columns",
      formula: "Volume = Width × Depth × Height × Count",
      fields: [
        { name: "width", label: "Width (m)", type: "number", default: 0.4 },
        { name: "breadth", label: "Breadth/Depth (m)", type: "number", default: 0.4 },
        { name: "height", label: "Average Height (m)", type: "number", default: 3.2 },
        { name: "count", label: "Number of Columns", type: "number", default: 16 }
      ]
    },
    {
      key: "beams",
      label: "Tie Beams & Lintels",
      formula: "Volume = Length × Width × Depth × Count",
      fields: [
        { name: "length", label: "Running Length (m)", type: "number", default: 32 },
        { name: "width", label: "Width (m)", type: "number", default: 0.3 },
        { name: "depth", label: "Depth (m)", type: "number", default: 0.45 },
        { name: "count", label: "Multiplier Count", type: "number", default: 1 }
      ]
    },
    {
      key: "slabs",
      label: "Roof & Floor Slabs",
      formula: "Volume = Area × Thickness × Floor Count",
      fields: [
        { name: "area", label: "Slab Plan Area (m²)", type: "number", default: 120 },
        { name: "thickness", label: "Slab Thickness (m)", type: "number", default: 0.15 },
        { name: "count", label: "Number of Slabs", type: "number", default: 2 }
      ]
    },
    {
      key: "walls",
      label: "Masonry partitions / Walls",
      formula: "Volume = Length × Height × Thickness × Count",
      fields: [
        { name: "length", label: "Cumulative Length (m)", type: "number", default: 85 },
        { name: "height", label: "Average Wall Height (m)", type: "number", default: 3.0 },
        { name: "thickness", label: "Thickness (m)", type: "number", default: 0.23 },
        { name: "count", label: "Multiplier Count", type: "number", default: 1 },
        { name: "materialType", label: "Masonry Material", type: "select", options: ["Brick", "Concrete Block", "RCC Wall"], default: "Brick" }
      ]
    },
    {
      key: "staircases",
      label: "Staircases (Waist Slab & Steps)",
      formula: "Volume = [Waist (L×W×T) + Step volume (0.03×W×Steps)] × Flight Count",
      fields: [
        { name: "length", label: "Flight Slope Length (m)", type: "number", default: 4.5 },
        { name: "width", label: "Flight Width (m)", type: "number", default: 1.2 },
        { name: "thickness", label: "Waist Slab Thickness (m)", type: "number", default: 0.15 },
        { name: "steps", label: "Number of Steps", type: "number", default: 18 },
        { name: "count", label: "Number of flights", type: "number", default: 2 }
      ]
    },
    {
      key: "roof",
      label: "External Roof Canopy",
      formula: "Volume = Area × Effective Thickness",
      fields: [
        { name: "area", label: "Roof Cover Area (m²)", type: "number", default: 130 },
        { name: "thickness", label: "Profile Thickness (m)", type: "number", default: 0.12 },
        { name: "materialType", label: "Roof Core Material", type: "select", options: ["RCC", "Metal Sheet", "Timber Frame"], default: "RCC" }
      ]
    }
  ];

  const nonStructuralList: { key: keyof EstimationInputs; label: string; formula: string; fields: { name: string; label: string; type: string; options?: string[]; default: any }[] }[] = [
    {
      key: "doors",
      label: "Prefabricated Doors",
      formula: "Volume = Doors Count × H × W × Shutter Thickness",
      fields: [
        { name: "count", label: "Number of Doors", type: "number", default: 8 },
        { name: "width", label: "Standard Width (m)", type: "number", default: 0.90 },
        { name: "height", label: "Standard Height (m)", type: "number", default: 2.10 },
        { name: "material", label: "Door shutters Core", type: "select", options: ["Wood", "Metal", "PVC"], default: "Wood" }
      ]
    },
    {
      key: "windows",
      label: "Window Units & Shading panels",
      formula: "Volume = Window Area. Glass Ratio (60%)",
      fields: [
        { name: "count", label: "Number of Windows", type: "number", default: 10 },
        { name: "width", label: "Width (m)", type: "number", default: 1.20 },
        { name: "height", label: "Height (m)", type: "number", default: 1.20 },
        { name: "material", label: "Frame Material", type: "select", options: ["Aluminium", "Steel", "Wood"], default: "Aluminium" }
      ]
    },
    {
      key: "glass",
      label: "Glazed Panels & Partition Glass",
      formula: "Volume = Covered Area × Glass thickness",
      fields: [
        { name: "area", label: "Glass Area (m²)", type: "number", default: 15 },
        { name: "thickness", label: "Glass Thickness (mm)", type: "number", default: 6 }
      ]
    },
    {
      key: "tiles",
      label: "Ceramic tiling / Stonework",
      formula: "Mass = Coverage Area × Tiling Depth × Ceramic Density (2200 kg/m³)",
      fields: [
        { name: "area", label: "Tile Plan Area (m²)", type: "number", default: 140 },
        { name: "thickness", label: "Tile Thickness (mm)", type: "number", default: 10 }
      ]
    },
    {
      key: "plumbing",
      label: "Water Conduit & Closet Fixtures",
      formula: "Pipe Weight + Bathroom Fixture units weight",
      fields: [
        { name: "length", label: "Estimated Plumbing pipe length (m)", type: "number", default: 45 },
        { name: "pipeMaterial", label: "Main pipe material", type: "select", options: ["PVC/Plastic", "GI/Metal"], default: "PVC/Plastic" },
        { name: "fixtures", label: "Bathroom/WC fixtures", type: "number", default: 6 }
      ]
    },
    {
      key: "electrical",
      label: "Electrical conduits & copper wires",
      formula: "Core mass ratios: ~1.5kg PVC, ~0.25kg copper, ~0.75kg metal boxes per m²",
      fields: [
        { name: "area", label: "Service Built-Up Area (m²)", type: "number", default: 120 }
      ]
    },
    {
      key: "falseCeiling",
      label: "Gypsum False Ceilings",
      formula: "Weight = Covered Area × Plaster compound density factor",
      fields: [
        { name: "area", label: "False Ceiling Area (m²)", type: "number", default: 75 },
        { name: "material", label: "Ceiling Material Plaster", type: "select", options: ["Gypsum Board", "POP", "Metal Grids"], default: "Gypsum Board" }
      ]
    },
    {
      key: "paint",
      label: "Scraped Paint / Pigment Compounds",
      formula: "Plaster Scrapings: Area × 0.1mm film × Solid density (1400 kg/m³)",
      fields: [
        { name: "area", label: "Wall Scratching Area (m²)", type: "number", default: 280 }
      ]
    },
    {
      key: "woodwork",
      label: "Cabinetry & Furniture Boards (MDF/Plywood)",
      formula: "Volume = Cabinet surface area × Board thickness",
      fields: [
        { name: "area", label: "Furniture Area (m²)", type: "number", default: 40 },
        { name: "thickness", label: "Cabinet thickness (mm)", type: "number", default: 18 }
      ]
    }
  ];

  const renderItemManagers = (key: keyof EstimationInputs, fields: any[], elementLabel: string) => {
    const comp = inputs[key];
    const items = comp.items && comp.items.length > 0 
      ? comp.items 
      : [{ id: "default", name: `Standard ${elementLabel}`, ...comp }];

    return (
      <div className="space-y-4">
        {items.map((item, itemIdx) => {
          return (
            <div 
              key={item.id} 
              className="p-4 bg-slate-50/50 rounded-xl border border-slate-150 relative space-y-4 shadow-3xs hover:border-slate-300 transition-all duration-200"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 font-mono font-bold text-[10px] rounded-sm">
                    #{itemIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={item.name || ""}
                    placeholder={`e.g. Balcony ${elementLabel}`}
                    onChange={(e) => updateItemField(key, item.id, "name", e.target.value)}
                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-hidden focus:border-indigo-500 max-w-[180px] md:max-w-[240px]"
                  />
                </div>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItemInstance(key, item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-red-100 bg-white shadow-3xs"
                    title="Delete this dynamic parameter item"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {fields.map((f, idx) => {
                  const val = item[f.name] !== undefined ? item[f.name] : f.default;

                  return (
                    <div key={idx} className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-650 block uppercase tracking-wide">
                        {f.label}
                      </label>
                      {f.type === "number" ? (
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={val}
                          onChange={(e) => updateItemField(key, item.id, f.name, Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 text-xs font-semibold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 outline-hidden bg-white"
                        />
                      ) : f.type === "select" ? (
                        <select
                          value={val}
                          onChange={(e) => updateItemField(key, item.id, f.name, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 text-xs font-semibold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 outline-hidden bg-white"
                        >
                          {f.options?.map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : f.type === "range" ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0.1"
                            max="0.8"
                            step="0.05"
                            value={val}
                            onChange={(e) => updateItemField(key, item.id, f.name, Number(e.target.value))}
                            className="flex-1 accent-emerald-700 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-[10px] font-mono font-bold text-emerald-800">
                            {Math.round(val * 100)}%
                          </span>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => addItemInstance(key, fields, elementLabel)}
          className="w-full border-2 border-dashed border-slate-250 hover:border-emerald-500 hover:bg-emerald-50/20 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black text-emerald-800 hover:text-emerald-950 transition-all duration-200 group cursor-pointer bg-slate-50/30"
        >
          <span className="text-base text-emerald-700 font-bold group-hover:scale-125 transition-transform">+</span>
          Add Another {elementLabel} Type Setup
        </button>
      </div>
    );
  };

  const renderSectionHeader = (
    key: keyof EstimationInputs,
    label: string,
    formula: string,
    fields: any[],
    isStructural: boolean
  ) => {
    const isEnabled = inputs[key]?.enabled;
    const isExpanded = activeSection === key;

    return (
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className={`px-4 py-3 flex items-center justify-between transition-colors ${isEnabled ? "bg-emerald-50/40" : "bg-white"}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleComponent(key)}
              className="cursor-pointer outline-hidden focus:ring-2 focus:ring-emerald-450 rounded-lg animate-fadeIn"
              title={isEnabled ? "Disable component" : "Enable component"}
            >
              {isEnabled ? (
                <span className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                  Active
                </span>
              ) : (
                <span className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-slate-200">
                  Skipped
                </span>
              )}
            </button>
            <div className="text-left cursor-pointer" onClick={() => isEnabled && toggleExpand(key)}>
              <span className={`text-xs md:text-sm font-bold block ${isEnabled ? "text-slate-900" : "text-slate-400"}`}>
                {label}
              </span>
              <span className="text-[10px] text-slate-400 font-mono italic block">
                Formula: {formula}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEnabled && (
              <button
                onClick={() => toggleExpand(key)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-100"
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
          </div>
        </div>

        {isEnabled && isExpanded && (
          <div className="px-4 py-3 bg-white border-t border-slate-100 space-y-3">
            {renderItemManagers(key, fields, label)}
            <div className="text-[10px] text-slate-500 bg-emerald-50/10 p-2 rounded-lg border border-emerald-100/30 flex items-start gap-1.5">
              <Info size={12} className="text-emerald-700 shrink-0 mt-0.5" />
              <span>
                Calculation operates on real density specifications. Deactivating any fields excludes them from the total waste ledger calculation automatically.
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-slate-150 pb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Construction className="text-emerald-700" size={20} /> Component-wise Demolition Estimation Module
        </h2>
        <p className="text-slate-505 text-xs">
          Click the status tab to activate or skip structural components. Once active, expand components to provide precision length, thickness, and material details.
        </p>
      </div>

      {calculationMode === 'approximate' && (
        <div className="bg-amber-50 border border-amber-250 text-amber-900 rounded-2xl p-4 flex items-start gap-3 shadow-3xs animate-fadeIn">
          <Info className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <div className="space-y-1">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-950">
              Active: Thumb-Rule / Approximate Mode
            </h4>
            <p className="text-[11px] leading-relaxed text-amber-800 font-medium">
              The calculator is currently using <strong>empirical, area-based thumb rules</strong> (such as standard concrete, brick, and steel indexes) for fast early-stage estimation. Individual dimension modifications here are bypassed. Tap on <strong>Project Context & Baselines</strong> page to switch back to <strong>Detailed / Correct Sum Mode</strong> for precise component-wise control.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Structural Sub-grid */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping"></span>
            <span className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider">
              1. Primary Structural Elements
            </span>
          </div>
          <div className="space-y-3">
            {structuralList.map((item) => (
              <div key={item.key}>
                {renderSectionHeader(item.key, item.label, item.formula, item.fields, true)}
              </div>
            ))}
          </div>
        </div>

        {/* Non-structural Sub-grid */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-ping"></span>
            <span className="text-xs font-extrabold text-teal-900 uppercase tracking-wider">
              2. Architectural & Utility Fittings
            </span>
          </div>
          <div className="space-y-3">
            {nonStructuralList.map((item) => (
              <div key={item.key}>
                {renderSectionHeader(item.key, item.label, item.formula, item.fields, false)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
