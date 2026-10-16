/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Hammer, Trash2, ShieldCheck, ClipboardCopy, PieChart, Landmark, Settings, ArrowRight } from "lucide-react";

export function WorkflowSection() {
  const stepsList = [
    {
      stepNum: "01",
      icon: <Settings className="text-emerald-700 font-bold" size={18} />,
      title: "Input Configuration",
      desc: "Set building scale, city region targets, structural grades & component dimensions."
    },
    {
      stepNum: "02",
      icon: <Hammer className="text-emerald-700 font-bold" size={18} />,
      title: "Formula Execution",
      desc: "Server computes material volumes combining density coefficients (e.g., 2500kg/m³ RCC)."
    },
    {
      stepNum: "03",
      icon: <Trash2 className="text-emerald-700" size={18} />,
      title: "Active Segregation",
      desc: "Assigning materials to color-coded bins (e.g. Blue bar for Steel, White bar for Concrete)."
    },
    {
      stepNum: "04",
      icon: <ShieldCheck className="text-emerald-700" size={18} />,
      title: "Recovery Siphoning",
      desc: "Siphoning high-value timber, doors, and steel grids to optimize scrap credits."
    },
    {
      stepNum: "05",
      icon: <PieChart className="text-emerald-700" size={18} />,
      title: "Dashboard & Analysis",
      desc: "Generating visual material proportions, carbon logistis, and sustainability score audits."
    },
    {
      stepNum: "06",
      icon: <ClipboardCopy className="text-emerald-700" size={18} />,
      title: "Audit Report",
      desc: "Downloading physical report featuring transparent civil engineering calculation steps."
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-slate-150 pb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Landmark className="text-emerald-700" size={20} /> Smart Demolition Pipeline & Workflow
        </h2>
        <p className="text-slate-505 text-xs">
          Interactive pipeline representation illustrating resource tracing from raw site conditions to printable municipality reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
        {stepsList.map((step, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 relative flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="space-y-2">
              {/* Step indicator */}
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-150 flex items-center justify-center text-emerald-800 font-bold">
                  {step.icon}
                </span>
                <span className="text-[12px] font-mono font-black text-slate-300">
                  #{step.stepNum}
                </span>
              </div>

              {/* Text metadata */}
              <h4 className="text-xs font-black text-slate-900 uppercase">
                {step.title}
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal text-justify">
                {step.desc}
              </p>
            </div>

            {/* Connecting arrows for large screens */}
            {idx < 5 && (
              <div className="absolute top-1/2 -translate-y-1/2 -right-3.5 text-slate-300 hidden lg:block z-10">
                <ArrowRight size={14} className="stroke-slate-405 animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
