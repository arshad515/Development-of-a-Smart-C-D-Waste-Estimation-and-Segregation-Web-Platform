/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { EstimationOutputs, ProjectMetadata, CityRates } from "../types";
import { Printer, FileText, CheckSquare, Award, HelpCircle } from "lucide-react";

interface ReportViewProps {
  meta: ProjectMetadata;
  output: EstimationOutputs | null;
  rates: CityRates;
}

export function ReportView({ meta, output, rates }: ReportViewProps) {
  const triggerPrint = () => {
    window.print();
  };

  if (!output || output.totalWasteMass <= 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-12 text-center text-slate-500 text-xs">
        Configure structural items first to generate a printable civil engineering audit sheet.
      </div>
    );
  }

  const tonnes = (kg: number) => (kg / 1000).toFixed(2) + " Tonnes";
  const numTonnes = (kg: number) => Number((kg / 1000).toFixed(2));
  const inRupees = (v: number) => "₹ " + Math.round(v).toLocaleString("en-IN");

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Print Trigger Button Panel */}
      <div className="border border-slate-205 p-4 rounded-xl flex items-center justify-between bg-slate-50 print:hidden text-xs font-bold shadow-2xs">
        <span className="text-slate-705 flex items-center gap-1.5 font-extrabold uppercase">
          <FileText size={16} className="text-emerald-700" /> Export / Archive Civil Report
        </span>
        <button
          onClick={triggerPrint}
          className="px-4 py-2 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <Printer size={14} /> Send to Print / PDF
        </button>
      </div>

      {/* Main Printable Civil Engineering Document Grid */}
      <div className="bg-white border border-slate-250 rounded-2xl p-6 md:p-10 space-y-8 shadow-xs print:p-0 print:border-none print:shadow-none">
        {/* Academic Headings */}
        <div className="text-center space-y-2 border-b border-slate-300 pb-6">
          <h1 className="text-lg md:text-xl font-bold font-mono uppercase tracking-wide text-slate-900">
            Smart C&D Demolition Waste Estimation & Segregation System
          </h1>
          <p className="text-[10px] text-slate-505 uppercase tracking-wider font-extrabold font-mono">
            Minor Research Project Report • Civil Engineering Prototype
          </p>
          <div className="text-[10px] text-slate-400 font-mono">
            Date Generated: {today} | Location Index: {meta.city}
          </div>
        </div>

        {/* Project Context Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-200">
          <div>
            <h4 className="text-[10px] font-black uppercase text-indigo-950 font-mono block">
              1. Project Context
            </h4>
            <div className="mt-2 space-y-1.5 text-xs text-slate-750">
              <div><strong className="text-slate-800">Project:</strong> {meta.projectName || "Unnamed demolition site"}</div>
              <div><strong className="text-slate-800">Building Category:</strong> {meta.buildingType} framework</div>
              <div><strong className="text-slate-800">Demolition Scope:</strong> {meta.demolitionType} method</div>
              <div><strong className="text-slate-800">Typology:</strong> {meta.constructionType} joints</div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase text-indigo-950 font-mono block">
              2. Structural Scales
            </h4>
            <div className="mt-2 space-y-1.5 text-xs text-slate-750 font-normal">
              <div><strong className="text-slate-800">Built-Up Area:</strong> {meta.builtUpArea || 100} m²</div>
              <div><strong className="text-slate-800">Structural Floors:</strong> {meta.floorsCount} Floors</div>
              <div><strong className="text-slate-800">Concrete Design Grade:</strong> {meta.rccGrade}</div>
              <div><strong className="text-slate-800">Logistical Distance:</strong> {meta.leadDistance} km</div>
            </div>
          </div>
        </div>

        {/* Performance & Sustainability Metrics */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase text-indigo-950 font-mono block">
            3. Operational Recovery Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-200 p-4 rounded-xl text-center">
              <span className="text-[9px] font-extrabold uppercase text-slate-450 block">Total Waste Debris</span>
              <span className="text-md font-bold text-slate-900 font-mono">{tonnes(output.totalWasteMass)}</span>
            </div>
            <div className="border border-slate-200 p-4 rounded-xl text-center bg-slate-50">
              <span className="text-[9px] font-extrabold uppercase text-slate-450 block">Sustainability Score</span>
              <span className="text-md font-bold text-slate-900 font-mono">{output.sustainabilityScore}/100</span>
            </div>
            <div className="border border-slate-200 p-4 rounded-xl text-center">
              <span className="text-[9px] font-extrabold uppercase text-slate-450 block">Diverted Resource mass</span>
              <span className="text-md font-bold text-slate-900 font-mono">
                {tonnes(output.totalReusableMass + output.totalRecoverableMass)}
              </span>
            </div>
          </div>
        </div>

        {/* Material Table */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase text-indigo-950 font-mono block">
            4. Material-wise Demolition Breakdown Ledger
          </h4>
          <div className="border border-slate-250 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-250 text-slate-705 font-extrabold">
                  <th className="py-2.5 px-3">Material Segment</th>
                  <th className="py-2.5 px-3">Aggregated Mass (T)</th>
                  <th className="py-2.5 px-3">Reusable (T)</th>
                  <th className="py-2.5 px-3">Recyclable (T)</th>
                  <th className="py-2.5 px-3">Landfill Residue (T)</th>
                  <th className="py-2.5 px-3 text-right">Scrap Credit (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {output.materialBreakdown.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/20 font-medium">
                    <td className="py-2.5 px-3 font-semibold">{m.material}</td>
                    <td className="py-2.5 px-3 font-mono">{numTonnes(m.totalMass)} T</td>
                    <td className="py-2.5 px-3 font-mono">{numTonnes(m.reusableMass)} T</td>
                    <td className="py-2.5 px-3 font-mono">{numTonnes(m.recyclableMass)} T</td>
                    <td className="py-2.5 px-3 font-mono">{numTonnes(m.landfillMass)} T</td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-800">{m.recoveryValue > 0 ? inRupees(m.recoveryValue) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Recapitulatory balance */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase text-indigo-950 font-mono block">
            5. Logistical & Financial Valuations
          </h4>
          <div className="border border-slate-200 p-4 rounded-xl space-y-3 text-xs leading-relaxed max-w-md">
            <div className="flex justify-between items-center text-slate-600">
              <span>Estimated Transportation Freight:</span>
              <span className="font-mono font-bold text-slate-800">{inRupees(output.transportCost)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Landfill Dumping Charges:</span>
              <span className="font-mono font-bold text-slate-800">{inRupees(output.landfillCost)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Raw Material Scrap Credits (+):</span>
              <span className="font-mono font-bold text-emerald-800">{inRupees(output.recoveryValue)}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between items-center font-extrabold text-slate-900">
              <span>Net Demolition Balance Expense/Profit:</span>
              <span className="font-mono">{inRupees(output.netCost)}</span>
            </div>
          </div>
        </div>

        {/* Formal Signature block */}
        <div className="pt-12 grid grid-cols-2 text-center text-xs text-slate-600 font-mono gap-12 font-normal">
          <div className="space-y-12">
            <div>____________________________</div>
            <div>Prepared by: Demolition Engineer</div>
          </div>
          <div className="space-y-12">
            <div>____________________________</div>
            <div>Authorized signature: C&D Assessor</div>
          </div>
        </div>
      </div>
    </div>
  );
}
