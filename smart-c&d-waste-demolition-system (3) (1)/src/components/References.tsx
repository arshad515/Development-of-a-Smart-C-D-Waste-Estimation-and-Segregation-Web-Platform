/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Landmark, FileText, Globe, GraduationCap } from "lucide-react";

export function References() {
  const referencesList = [
    {
      type: "Indian Standard Code",
      title: "IS 4130 (1991): Demolition of Buildings — Code of Safety",
      source: "Bureau of Indian Standards (BIS), New Delhi.",
      desc: "Lays down safety guidelines, scaffolding, dismantling procedures, and sequential stripping protocols for masonry, steel, and RCC entities."
    },
    {
      type: "Indian Standard Code",
      title: "IS 383 (2016): Coarse and Fine Aggregates from Natural Sources for Concrete — Specification",
      source: "Bureau of Indian Standards (BIS), New Delhi.",
      desc: "Mandates specifications for utilizing processed recycled concrete aggregates (RCA) in structural and non-structural concrete mixes."
    },
    {
      type: "Government Regulation",
      title: "Construction and Demolition Waste Management Rules, 2016",
      source: "Ministry of Environment, Forest and Climate Change (MoEFCC), Govt. of India.",
      desc: "Defines source segregation mandate, duties of waste generators, municipal storage requirements, and penalties for indiscriminate dumping."
    },
    {
      type: "Academic Literature",
      title: "Estimating Construction and Demolition Waste: Density, Volume-to-Mass Conversions, and Core Material Splits",
      source: "Journal of Sustainable Civil Engineering Practice, 2021.",
      desc: "Provides basic material density bounds (e.g. Concrete 2500kg/m³, Brick masonry 1800kg/m³) and corresponding material reuse efficiency scales."
    },
    {
      type: "National Mission Guidelines",
      title: "Swachh Bharat Mission (Urban) 2.0 Operational Guidelines (2021-2026)",
      source: "Ministry of Housing and Urban Affairs (MoHUA), Govt. of India.",
      desc: "Emphasizes establishing fixed-capacity C&D recycling complexes across all cities having population indices exceeding 100,000 dwellers."
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-slate-150 pb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <GraduationCap className="text-emerald-700" size={20} /> Academic References & Standard Codes
        </h2>
        <p className="text-slate-505 text-xs">
          Authentic civil engineering standards, central ministry rules, and academic references backing up the structural calculation engine.
        </p>
      </div>

      <div className="space-y-4">
        {referencesList.map((ref, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-2xs transition-shadow space-y-2"
          >
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-300 text-[9px] uppercase font-black rounded-sm">
                {ref.type}
              </span>
            </div>
            <h3 className="text-xs md:text-sm font-bold text-slate-900 font-mono">
              {ref.title}
            </h3>
            <div className="text-[11px] text-slate-500 italic">
              Source: {ref.source}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed text-slate-505 text-justify">
              {ref.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
