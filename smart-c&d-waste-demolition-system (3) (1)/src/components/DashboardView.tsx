/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { EstimationOutputs, ProjectMetadata } from "../types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Scale, Truck, Trash2, ShieldCheck, Landmark, DollarSign, Award, ArrowUpRight, TrendingDown } from "lucide-react";

interface DashboardViewProps {
  output: EstimationOutputs | null;
  meta: ProjectMetadata;
}

export function DashboardView({ output, meta }: DashboardViewProps) {
  if (!output || output.totalWasteMass <= 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-12 text-center space-y-4">
        <Scale className="mx-auto text-slate-300 animate-bounce" size={48} />
        <h3 className="text-md font-bold text-slate-700">Awaiting Estimation Data Inputs</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Configure structural and partition modules on the "Component Estimation" pages to stream active volume results.
        </p>
      </div>
    );
  }

  // Formatting variables
  const tonnes = (kg: number) => (kg / 1000).toFixed(2) + " Tonnes";
  const numTonnes = (kg: number) => Number((kg / 1000).toFixed(2));
  const inRupees = (val: number) => "₹ " + Math.round(val).toLocaleString("en-IN");

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 50) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  const netBalanceValue = output.netCost;
  const isProfit = netBalanceValue < 0; // If recovery exceeds cost, it is an economic profit!

  // Recharts Material Breakdown data
  const chartData = output.materialBreakdown.map((m) => ({
    name: m.material,
    massTonnes: numTonnes(m.totalMass),
    reuseTonnes: numTonnes(m.reusableMass),
    recycleTonnes: numTonnes(m.recyclableMass),
    landfillTonnes: numTonnes(m.landfillMass),
  }));

  // Recharts Breakdown Pie data
  const pieData = [
    { name: "Direct Reuse", value: numTonnes(output.totalReusableMass), color: "#0d9488" }, // Teal
    { name: "Recyclable", value: numTonnes(output.totalRecoverableMass), color: "#0284c7" }, // Blue
    { name: "Landfill Residue", value: numTonnes(output.totalLandfillMass), color: "#e11d48" } // Red
  ].filter(p => p.value > 0);

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Structural overview header banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6 shadow-md relative overflow-hidden">
        <div className="space-y-1 z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 font-mono">
            Active Estimation Summary Ledger
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight text-white">
              {meta.projectName || "Standard Site Demolition"}
            </h2>
            <span className={`px-2 py-0.5 text-[9px] font-mono font-extrabold uppercase tracking-wider rounded-md border shrink-0 ${
              meta.calculationMode === "approximate"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse"
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
            }`}>
              {meta.calculationMode === "approximate" ? "Approximate (Thumb-Rule)" : "Correct (Engineered Sum)"}
            </span>
          </div>
          <p className="text-slate-400 text-xs">
            Scope: {meta.buildingType} • Localized in {meta.city} • Lead: {meta.leadDistance} km • Calculation: {meta.calculationMode === "approximate" ? "Empirical General Estimates" : "Custom Parametric Dimensions"}
          </p>
        </div>

        {/* Sustainability Score badge */}
        <div className="flex items-center gap-3 z-10 bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
          <Award className="text-emerald-400 shrink-0" size={32} />
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
              Sustainability Index
            </span>
            <span className="text-2xl font-black text-white font-mono">
              {output.sustainabilityScore}%
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Waste Mass */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-start gap-4 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
            <Trash2 size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Waste Generated</span>
            <span className="text-lg font-black text-slate-900 font-mono block">
              {tonnes(output.totalWasteMass)}
            </span>
            <span className="text-[10px] text-slate-400">Primary structural + cladding mass</span>
          </div>
        </div>

        {/* Diversion Breakdown (Reused + Recycled) */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-start gap-4 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Green diverted ratio</span>
            <span className="text-lg font-black text-slate-900 font-mono block text-emerald-800">
              {tonnes(output.totalReusableMass + output.totalRecoverableMass)}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold font-mono">
              {Math.round(((output.totalReusableMass + output.totalRecoverableMass) * 100) / output.totalWasteMass)}% diversion rate
            </span>
          </div>
        </div>

        {/* Landfill leftovers */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-start gap-4 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <TrendingDown size={20} className="transform rotate-90" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Unsorted Landfill residue</span>
            <span className="text-lg font-black text-slate-900 font-mono block text-rose-700">
              {tonnes(output.totalLandfillMass)}
            </span>
            <span className="text-[10px] text-slate-400">Requires tax and dumping damage fees</span>
          </div>
        </div>

        {/* Freight & Logistics */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-start gap-4 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
            <Truck size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Required Cargo Freight</span>
            <span className="text-lg font-black text-slate-900 font-mono block">
              {Math.ceil(output.totalWasteMass / 5000)} Trips
            </span>
            <span className="text-[10px] text-slate-400 italic">5,000 kg standard truck payload</span>
          </div>
        </div>
      </div>

      {/* Financial Statement Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="text-sm font-extrabold uppercase text-slate-900 tracking-wider">
            Demolition Economic balance Sheet
          </h3>
          <p className="text-[11px] text-slate-500">
            Financial offsets listing expenses against revenue generated from metal scrap and brick recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Recovery value */}
          <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
            <span className="text-[9px] uppercase font-bold text-emerald-800 block">Material Scrap Credits (+)</span>
            <span className="text-md font-bold text-emerald-950 font-mono block">
              {inRupees(output.recoveryValue)}
            </span>
            <span className="text-[10px] text-emerald-700 italic">Revenue from siphoned components</span>
          </div>

          {/* Transport cost */}
          <div className="bg-rose-50/20 border border-rose-100 p-4 rounded-xl">
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Transit freight Logistics (-)</span>
            <span className="text-md font-bold text-slate-900 font-mono block">
              {inRupees(output.transportCost)}
            </span>
            <span className="text-[10px] text-slate-400">Based on {meta.leadDistance}km total transit distance</span>
          </div>

          {/* Landfill dumping damanges */}
          <div className="bg-rose-50/25 border border-rose-100 p-4 rounded-xl">
            <span className="text-[9px] uppercase font-bold text-rose-800 block">Landfill dumping Damage (-)</span>
            <span className="text-md font-bold text-rose-900 font-mono block">
              {inRupees(output.landfillCost)}
            </span>
            <span className="text-[10px] text-rose-700 italic">Dumping charges per kg at metro limits</span>
          </div>

          {/* Concrete processing */}
          <div className="bg-slate-100/50 border border-slate-200 p-4 rounded-xl">
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Concrete Crushing charge (-)</span>
            <span className="text-md font-bold text-slate-900 font-mono block">
              {inRupees(output.recyclingCost)}
            </span>
            <span className="text-[10px] text-slate-400">Sorting & crushing aggregates fee</span>
          </div>
        </div>

        {/* Profit/Loss Final indicator wrapper banner */}
        <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 text-xs font-semibold ${isProfit ? "bg-emerald-100/70 border-emerald-300 text-emerald-900" : "bg-slate-100 border-slate-200 text-slate-800"}`}>
          <div className="space-y-0.5">
            <span className="font-extrabold uppercase tracking-wider block text-[10px]">
              {isProfit ? "Net Economic Benefit (Earnings Surplus)" : "Net Demolition Deficit / Processing Cost"}
            </span>
            <p className="text-[10px] text-slate-500 font-normal">
              {isProfit 
                ? "Siphoned metals and copper outweigh regional logistically active dump tariffs!" 
                : "Active site management decreases expenditures. Ensure high selectivity to swing index forward."}
            </p>
          </div>
          <div>
            <span className="text-xl font-black font-mono block">
              {inRupees(Math.abs(netBalanceValue))}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Material Mass breakdown Chart */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl lg:col-span-8 flex flex-col space-y-4 shadow-2xs">
          <div>
            <h4 className="text-xs font-extrabold uppercase text-indigo-950 tracking-wider">
              Component Material-wise breakdown (Tonnes)
            </h4>
            <p className="text-[10px] text-slate-400">Stacked layout mapping structural wood, steel, concrete weight specifications.</p>
          </div>
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={9} tickLine={false} />
                <YAxis stroke="#888888" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Bar dataKey="reuseTonnes" name="Reusable (T)" fill="#0d9488" stackId="a" />
                <Bar dataKey="recycleTonnes" name="Recyclable (T)" fill="#0284c7" stackId="a" />
                <Bar dataKey="landfillTonnes" name="Landfill (T)" fill="#e11d48" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Diversion Classification Pie */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl lg:col-span-4 flex flex-col space-y-4 shadow-2xs">
          <div>
            <h4 className="text-xs font-extrabold uppercase text-indigo-950 tracking-wider">
              Diverted vs. Landfill Stream Split
            </h4>
            <p className="text-[10px] text-slate-400">Proportional layout comparing green diversion splits.</p>
          </div>
          <div className="h-44 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: "10px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Diversion</span>
              <span className="text-xl font-black font-mono text-emerald-800">
                {Math.round(((output.totalReusableMass + output.totalRecoverableMass) * 100) / output.totalWasteMass)}%
              </span>
            </div>
          </div>
          <div className="space-y-1 pt-1.5 border-t border-slate-100">
            {pieData.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px] font-medium text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                  <span>{p.name}</span>
                </div>
                <span className="font-mono font-bold">{p.value.toFixed(2)} T</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Materials Segregation Bin Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <h4 className="text-xs font-extrabold uppercase text-indigo-950 tracking-wider">
              Segmented Material Disposal & Bin recommendation Matrix
            </h4>
            <p className="text-[10px] text-slate-400">
              Prescribed target bin color codes and weight allocation calculated dynamically from structural components.
            </p>
          </div>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-mono font-black rounded-sm border border-emerald-100 uppercase">
            Active Segregation Plan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-150 text-slate-500 font-extrabold uppercase text-[9px] tracking-wider">
                <th className="py-2.5">Material Component</th>
                <th className="py-2.5 text-right">Formed Mass</th>
                <th className="py-2.5 text-right">Diverted Reuse</th>
                <th className="py-2.5 text-right">Recycle Yield</th>
                <th className="py-2.5 text-right">Landfill residue</th>
                <th className="py-2.5 pl-6 text-center">Prescribed Sorting Bin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {output.materialBreakdown.map((m, idx) => {
                const getMaterialBin = (material: string) => {
                  const mat = material.toLowerCase();
                  if (mat.includes("concrete") || mat.includes("brick") || mat.includes("tile") || mat.includes("masonry") || mat.includes("stone")) {
                    return { name: "White/Grey Bin", bg: "bg-slate-100 text-slate-800 border-slate-300", dot: "bg-slate-400" };
                  }
                  if (mat.includes("steel") || mat.includes("metal") || mat.includes("iron") || mat.includes("wire") || mat.includes("cable") || mat.includes("copper") || mat.includes("aluminium") || mat.includes("reinforcement")) {
                    return { name: "Blue Bin", bg: "bg-blue-100 text-blue-800 border-blue-300", dot: "bg-blue-600" };
                  }
                  if (mat.includes("wood") || mat.includes("cabinetry") || mat.includes("timber") || mat.includes("plywood") || mat.includes("woodwork")) {
                    return { name: "Green Bin", bg: "bg-emerald-100 text-emerald-800 border-emerald-300", dot: "bg-emerald-600" };
                  }
                  if (mat.includes("gypsum") || mat.includes("pop") || mat.includes("plaster") || mat.includes("ceiling") || mat.includes("drywall")) {
                    return { name: "Yellow Bin", bg: "bg-amber-100 text-amber-800 border-amber-300", dot: "bg-amber-400 animate-pulse" };
                  }
                  if (mat.includes("pvc") || mat.includes("plastic") || mat.includes("polymer") || mat.includes("conduit") || mat.includes("plumbing")) {
                    return { name: "Orange Bin", bg: "bg-orange-100 text-orange-950 border-orange-300", dot: "bg-orange-500" };
                  }
                  if (mat.includes("asbestos") || mat.includes("lead") || mat.includes("hazard") || mat.includes("chemical") || mat.includes("toxic")) {
                    return { name: "Red Bin", bg: "bg-rose-100 text-rose-850 border-rose-300", dot: "bg-rose-600 animate-pulse" };
                  }
                  return { name: "Black Bin", bg: "bg-slate-800 text-slate-100 border-slate-700", dot: "bg-slate-950" };
                };

                const bin = getMaterialBin(m.material);

                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors font-medium text-slate-700">
                    <td className="py-2.5 font-bold text-slate-900">{m.material}</td>
                    <td className="py-2.5 text-right font-mono font-bold">{(m.totalMass / 1000).toFixed(2)} T</td>
                    <td className="py-2.5 text-right font-mono text-emerald-700">{(m.reusableMass / 1000).toFixed(2)} T</td>
                    <td className="py-2.5 text-right font-mono text-cyan-700">{(m.recyclableMass / 1000).toFixed(2)} T</td>
                    <td className="py-2.5 text-right font-mono text-rose-600">{(m.landfillMass / 1000).toFixed(2)} T</td>
                    <td className="py-2.5 pl-6 flex justify-center text-center">
                      <span className={`px-2.5 py-1 border shrink-0 font-extrabold uppercase tracking-wider text-[10px] rounded-full inline-flex items-center gap-1.5 ${bin.bg}`}>
                        <span className={`w-2 h-2 rounded-full ${bin.dot}`} />
                        {bin.name}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
