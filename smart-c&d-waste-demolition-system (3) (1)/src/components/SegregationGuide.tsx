/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Info, HelpCircle, Shield, Truck, Archive, CheckCircle2 } from "lucide-react";

interface GuideItem {
  colorName: string;
  badgeBg: string;
  borderColors: string;
  materials: string[];
  binDesc: string;
  reuseMethod: string;
  recycleMethod: string;
  storage: string;
  precautions: string;
}

export function SegregationGuide() {
  const [activeTab, setActiveTab] = useState<string>("White/Grey");

  const binConfig: { [key: string]: { active: string; unactiveHover: string; dotColor: string; bgSoft: string; border: string; indicatorText: string } } = {
    "White/Grey": {
      active: "bg-slate-100 text-slate-800 border-slate-400 ring-2 ring-slate-200/60 shadow-sm",
      unactiveHover: "hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300",
      dotColor: "bg-slate-400 border border-slate-350",
      bgSoft: "bg-gradient-to-br from-slate-50 to-stone-50/20 border-slate-300",
      border: "border-slate-300",
      indicatorText: "text-slate-600"
    },
    "Blue": {
      active: "bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300/40 shadow-sm",
      unactiveHover: "hover:bg-blue-50/50 hover:text-blue-700 hover:border-blue-300",
      dotColor: "bg-blue-550 border border-blue-400",
      bgSoft: "bg-gradient-to-br from-blue-50/30 to-white border-blue-200",
      border: "border-blue-200",
      indicatorText: "text-blue-650"
    },
    "Green": {
      active: "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-300/40 shadow-sm",
      unactiveHover: "hover:bg-emerald-50 hover:text-emerald-705 hover:border-emerald-300",
      dotColor: "bg-emerald-550 border border-emerald-400",
      bgSoft: "bg-gradient-to-br from-emerald-50/30 to-white border-emerald-250",
      border: "border-emerald-250",
      indicatorText: "text-emerald-700"
    },
    "Yellow": {
      active: "bg-amber-400 text-slate-900 border-amber-500 ring-2 ring-amber-200/65 shadow-sm",
      unactiveHover: "hover:bg-amber-50 hover:text-amber-750 hover:border-amber-300",
      dotColor: "bg-amber-400 border border-amber-300",
      bgSoft: "bg-gradient-to-br from-amber-50/40 to-white border-amber-200",
      border: "border-amber-200",
      indicatorText: "text-amber-700"
    },
    "Orange": {
      active: "bg-orange-500 text-white border-orange-600 ring-2 ring-orange-300/40 shadow-sm",
      unactiveHover: "hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300",
      dotColor: "bg-orange-500 border border-orange-400",
      bgSoft: "bg-gradient-to-br from-orange-50/30 to-white border-orange-200",
      border: "border-orange-250",
      indicatorText: "text-orange-700"
    },
    "Red": {
      active: "bg-rose-600 text-white border-rose-700 ring-2 ring-rose-300/40 shadow-sm",
      unactiveHover: "hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300",
      dotColor: "bg-rose-500 border border-rose-400",
      bgSoft: "bg-gradient-to-br from-rose-50/30 to-white border-rose-200",
      border: "border-rose-250",
      indicatorText: "text-rose-700"
    },
    "Black": {
      active: "bg-slate-900 text-white border-slate-950 ring-2 ring-slate-800 shadow-sm",
      unactiveHover: "hover:bg-slate-100 hover:text-slate-950 hover:border-slate-400",
      dotColor: "bg-slate-950 border border-slate-800",
      bgSoft: "bg-gradient-to-br from-slate-100/60 to-white border-slate-350",
      border: "border-slate-850",
      indicatorText: "text-slate-800"
    }
  };

  const guideList: GuideItem[] = [
    {
      colorName: "White/Grey",
      badgeBg: "bg-slate-100 text-slate-800 border-slate-350",
      borderColors: "border-slate-300 bg-slate-50/10",
      materials: ["Concrete", "Bricks", "Tiles", "Ceramic Fixtures", "Foundation Blocks"],
      binDesc: "Mineral demolition debris, masonry, stone foundations.",
      reuseMethod: "Clean and dry bricks can be isolated for low-stress partition masonry or landscape garden walls. Intact tiles can satisfy repair works.",
      recycleMethod: "Crushed in pulverized mobile aggregates jaw chambers to manufacture Recycled Concrete Aggregates (RCA) or sub-base road paving gravel.",
      storage: "Keep dry, avoid mud/humic soil mixtures. Prevent cement binder hydration.",
      precautions: "Heavy load dangers, crushing hazards. Always wear impact resistant safety boots."
    },
    {
      colorName: "Blue",
      badgeBg: "bg-blue-100 text-blue-800 border-blue-300",
      borderColors: "border-blue-300 bg-blue-50/10",
      materials: ["Structural Steel Reinforcement", "Copper Cables", "GI Pipework", "Aluminium Window Frames"],
      binDesc: "Structural reinforcement grids, metallic lines, wire scraps.",
      reuseMethod: "Clean non-bent structural sections are isolated for secondary roof trusses or support staging. Pipe couplings can be re-fitted.",
      recycleMethod: "Bundled and shipped to regional smelting factories to re-roll raw steel into high-grade TMT tension bars.",
      storage: "Cover under waterproof tarpaulins to eliminate heavy rain oxide rust. Group in lockable yards.",
      precautions: "Sharp jagged metal spurs, puncture wounds. Must use level-5 thick woven wire-knit cut gloves."
    },
    {
      colorName: "Green",
      badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
      borderColors: "border-emerald-300 bg-emerald-50/10",
      materials: ["Timber Truss Rafters", "Plywood Panels", "Doors shutters", "Modular Cabinets Woodwork"],
      binDesc: "Cellulose boards, wood frameworks, modular cabinets.",
      reuseMethod: "Intact wood planks, frames, and shutters can be refitted inside cheap housing or rustic interior panels directly.",
      recycleMethod: "Downsized inside woodworking factories to form chips for particulate composite MDF panels, garden mulch, or organic biomass fuel pellets.",
      storage: "Keep dry! Moisture initiates deep termite colonies, rot, and fungi structural decay.",
      precautions: "Deep wood splinters, chemical paint toxic out-gassings. Always use safety goggles during cutting."
    },
    {
      colorName: "Yellow",
      badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
      borderColors: "border-amber-300 bg-amber-50/10",
      materials: ["Gypsum Plasterboards", "Plaster of Paris Panels", "Drywall fragments"],
      binDesc: "Gypsum tiles, temporary wall partitions, sound isolation grids.",
      reuseMethod: "Uninjured gypsum sheets can form partial partitioning panels inside temporary structural sheds or warehouses.",
      recycleMethod: "Sifting and crushing drywall to separate paper linings. Pulverized pure gypsum is recycled to form raw drywall compound base or farming soil additions.",
      storage: "Extremely sensitive to humic wetness. Gypsum dissolves into mush when mud and water interact.",
      precautions: "Very minor fine powder, eye irritations. Constant use of particulate respirator filters (N95 masks) is mandatory."
    },
    {
      colorName: "Orange",
      badgeBg: "bg-orange-100 text-orange-850 border-orange-300",
      borderColors: "border-orange-300 bg-orange-50/10",
      materials: ["PVC conduit tubes", "Polyethylene waterproofing film", "Packaging plastic crates", "Cable insulation PVC"],
      binDesc: "Polymer pipeline sheaths, waterproofing panels, packaging sheets.",
      reuseMethod: "Uncut structural pipe lengths are usable for storm conduits, gardening channels, or plumbing drains.",
      recycleMethod: "Thermal shredding and extrusion to melt PVC into industrial grade pipelines, electric conduits, or outdoor plastic wood decking.",
      storage: "Shield from continuous solar UV rays to avoid thermal embrittlement and cracking.",
      precautions: "Exposure to open combustion/flame emits highly cancerous toxic chlorine gas. Keep extinguishing sources active."
    },
    {
      colorName: "Red",
      badgeBg: "bg-rose-100 text-rose-800 border-rose-300",
      borderColors: "border-rose-300 bg-rose-50/10",
      materials: ["Asbestos Roof Corrugated Sheets", "Lead Paint residues", "Chemical Sealants", "Fluorescent lighting mercury tubes"],
      binDesc: "Highly hazardous chemical residues, insulation fibers.",
      reuseMethod: "STRICTLY PROHIBITED. Reusing asbestos sheets can pose immediate, life-threatening airborne health hazards.",
      recycleMethod: "Deep encapsulation inside specialized geo-synthetic container cells. Neutralization at chemical incinerators (high temp).",
      storage: "Conceal under airtight heavy plastic shrink membranes. Lock in leakproof containment blocks with hazardous decals.",
      precautions: "Asbestos fibers cause permanent lung scarring (mesothelioma). Staff must wear complete hazmat suits with oxygen supply."
    },
    {
      colorName: "Black",
      badgeBg: "bg-slate-800 text-slate-100 border-slate-705",
      borderColors: "border-slate-700 bg-slate-900/10",
      materials: ["Unsorted mixed dust rubble", "Sweeping dirt piles", "Mortar plaster dust", "Deformed non-separated scrap composites"],
      binDesc: "Mixed mineral dirt, scrap residues.",
      reuseMethod: "Has zero direct engineering reuse parameters if mixed with organic soil debris.",
      recycleMethod: "Lower priority sorting. Useful only for heavy structural hollow core block manufacturing or solid civil embankment filling.",
      storage: "Group in designated rubble yard bunkers pending final city landfill authorization.",
      precautions: "Heavy airborne micro-silica dust. Must activate constant water spraying cannons across site lines."
    }
  ];

  const currentGuide = guideList.find((g) => g.colorName === activeTab) || guideList[0];

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-slate-150 pb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="text-emerald-700" size={20} /> Site Waste Segregation & recommendation Guide
        </h2>
        <p className="text-slate-505 text-xs">
          Professional site sorting indices sorted by standard color-coded bin categories for demolition waste diversion.
        </p>
      </div>

      {/* Tabs Selector Row */}
      <div className="flex flex-wrap gap-2 md:gap-3">
        {guideList.map((g) => {
          const config = binConfig[g.colorName] || binConfig["White/Grey"];
          const isActive = activeTab === g.colorName;
          return (
            <button
              key={g.colorName}
              onClick={() => setActiveTab(g.colorName)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider border cursor-pointer transition-all duration-250 flex items-center gap-2 ${
                isActive 
                  ? config.active 
                  : `bg-white text-slate-600 border-slate-200 ${config.unactiveHover}`
              }`}
            >
              <span className={`w-3 h-3 rounded-full shrink-0 shadow-xs ${config.dotColor}`} />
              {g.colorName} Bin
            </button>
          );
        })}
      </div>

      {/* Segregation Guide Detail Panel */}
      <div className={`border rounded-3xl p-6 md:p-8 space-y-8 transition-all duration-300 shadow-xs ${binConfig[activeTab]?.bgSoft} ${binConfig[activeTab]?.border}`}>
        {/* Core details title */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <span className={`px-3 py-1 font-extrabold uppercase tracking-widest text-[10px] rounded-full border ${currentGuide.badgeBg}`}>
              {currentGuide.colorName} stream bin
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 pt-1">
              Target Segment: {currentGuide.materials.join(" • ")}
            </h3>
            <p className="text-xs text-slate-500 italic font-medium">
              Core Classification: {currentGuide.binDesc}
            </p>
          </div>
        </div>

        {/* Breakdown parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reuse strategy */}
          <div className="space-y-2 border border-slate-150 bg-white p-5 rounded-xl">
            <h4 className="text-xs font-black text-indigo-950 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" /> Reuse Potential on-Site
            </h4>
            <p className="text-slate-600 text-xs text-justify leading-relaxed">
              {currentGuide.reuseMethod}
            </p>
          </div>

          {/* Recycling strategy */}
          <div className="space-y-2 border border-slate-150 bg-white p-5 rounded-xl">
            <h4 className="text-xs font-black text-indigo-950 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 size={16} className="text-teal-600" /> Recycling & Industrial Secondary Loop
            </h4>
            <p className="text-slate-600 text-xs text-justify leading-relaxed font-normal">
              {currentGuide.recycleMethod}
            </p>
          </div>

          {/* Storage strategy */}
          <div className="space-y-2 border border-slate-150 bg-white p-5 rounded-xl flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="text-xs font-black text-indigo-950 uppercase tracking-widest flex items-center gap-2">
                <Archive size={16} className="text-amber-600" /> Storage & Bin Setup Protocols
              </h4>
              <p className="text-slate-600 text-xs text-justify leading-relaxed">
                {currentGuide.storage}
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-[10px] text-amber-800 font-mono">
              <Info size={12} /> Separate materials clearly to optimize scrap dealer credits.
            </div>
          </div>

          {/* Safety strategy */}
          <div className="space-y-2 border border-slate-150 bg-white p-5 rounded-xl flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="text-xs font-black text-indigo-950 uppercase tracking-widest flex items-center gap-2">
                <Shield size={16} className="text-rose-600" /> Safety Protocols & Site PPE
              </h4>
              <p className="text-slate-600 text-xs text-justify leading-relaxed">
                {currentGuide.precautions}
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-[10px] text-rose-800 font-mono">
              <Shield size={12} /> Compliance to IS: 4130 safety demolition code is mandatory.
            </div>
          </div>
        </div>

        {/* Global site sorting recommendation banner */}
        <div className="bg-slate-900 text-white rounded-xl p-4 flex items-start gap-4 text-xs font-medium border border-slate-800">
          <Truck size={24} className="text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <strong className="text-white text-xs uppercase font-extrabold tracking-wider block">Logistics recommendation: Source Segregation Optimization</strong>
            <p className="text-slate-350 leading-relaxed text-slate-300">
              Sorting demolition items prior to loading reduces combined landfill masses by up to 88%. This dramatically reduces landfill dumping fees and leverages secondary steel market credits immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
