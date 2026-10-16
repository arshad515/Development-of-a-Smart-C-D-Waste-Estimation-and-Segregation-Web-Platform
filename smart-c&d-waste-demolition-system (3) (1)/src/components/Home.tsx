/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Hammer, Trash2, ShieldCheck, Landmark, Recycle, ArrowRight, Kanban, HelpCircle, HardHat, FileText, TrendingUp, Info } from "lucide-react";

interface HomeProps {
  onStartClick: () => void;
}

export function Home({ onStartClick }: HomeProps) {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-radial from-slate-50 to-emerald-50/20 border-b border-emerald-100 rounded-3xl p-8 md:p-16 text-center shadow-xs">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-xs font-semibold uppercase tracking-wider">
            <HardHat size={14} className="animate-pulse" /> Civil Engineering Minor Project Prototype
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-none bg-gradient-to-r from-emerald-800 to-teal-900 bg-clip-text text-transparent">
            Smart Construction & Demolition Waste Estimation & Segregation System
          </h1>
          <p className="text-md md:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            An advanced, formula-driven deconstruction analysis platform that accurately predicts aggregate volumes, optimizes recovery values, manages regional logistics, and standardizes site segregation.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={onStartClick}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-xl shadow-md cursor-pointer transition-transform hover:-translate-y-0.5 inline-flex items-center gap-2 text-md"
            >
              Start Project Estimation <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Sustainable Development Goals (SDG) Alignment */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">United Nations Sustainable Development Goals (SDGs)</h2>
          <p className="text-slate-500 text-sm">How this engineering prototype supports the UN 2030 Agenda</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-amber-100 bg-amber-50/20 p-6 rounded-2xl hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-2 right-2 text-6xl font-black text-amber-500/10 select-none">9</div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-800 font-bold text-lg">SDG 9</div>
              <h3 className="text-lg font-bold text-slate-850">Industry, Innovation & Infrastructure</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Promotes material recovery loops through crushed recycled concrete aggregate (RCA) and steel re-rolling, reinforcing resilient eco-industrial circular loops.
              </p>
            </div>
          </div>

          <div className="border border-emerald-100 bg-emerald-50/20 p-6 rounded-2xl hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-2 right-2 text-6xl font-black text-emerald-500/10 select-none">11</div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-800 font-bold text-lg">SDG 11</div>
              <h3 className="text-lg font-bold text-slate-850">Sustainable Cities & Communities</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Minimizes uncontrolled rubble dump-out hazards, decreases municipal transport strain, and prevents city green-belt dust pollutions.
              </p>
            </div>
          </div>

          <div className="border border-teal-100 bg-teal-50/20 p-6 rounded-2xl hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-2 right-2 text-6xl font-black text-teal-500/10 select-none">12</div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-800 font-bold text-lg">SDG 12</div>
              <h3 className="text-lg font-bold text-slate-850">Responsible Consumption & Production</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Aids resource conservation by siphoning timber, metals, and plasterboard prior to collapse, protecting virgin natural aggregate quarries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainable C&D Waste Management Hierarchy Infographic */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xl font-bold text-indigo-950 flex items-center justify-center gap-2">
            <Recycle size={20} className="text-teal-600" /> C&D Waste Demolition Hierarchy
          </h2>
          <p className="text-slate-500 text-xs">
            Engineered sorting methodology to maximize material rescue and minimize geological landfill pressure.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-3 pt-2">
          {/* Prevent/Reduce */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-right hidden sm:block text-xs font-bold text-emerald-800 font-mono">PREVENT / REDUCE</div>
            <div className="flex-1 bg-emerald-700 hover:bg-emerald-800 transition-colors text-white py-3 px-4 rounded-xl text-center font-semibold shadow-xs text-xs relative">
              Adaptive Structural Reuse (Tear down interior non-structural layouts only)
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-emerald-900/40 px-2 py-0.5 rounded-sm">Highest Priority</span>
            </div>
          </div>

          {/* Reuse */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-right hidden sm:block text-xs font-bold text-teal-800 font-mono">DIRECT REUSE</div>
            <div className="flex-1 bg-teal-600 hover:bg-teal-700 transition-colors text-white py-3 px-4 rounded-xl text-center font-semibold shadow-xs text-xs relative">
              Doors, Windows, Copper Cables, Bathroom Fixtures siphoned prior to structural impact
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-teal-900/40 px-2 py-0.5 rounded-sm">55-80% Value</span>
            </div>
          </div>

          {/* Recycle */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-right hidden sm:block text-xs font-bold text-cyan-800 font-mono">RECYCLE / CRUSH</div>
            <div className="flex-1 bg-cyan-600 hover:bg-cyan-700 transition-colors text-white py-3 px-4 rounded-xl text-center font-semibold shadow-xs text-xs relative">
              Concrete aggregate crushing (RCA) and Structural steel reinforcement smelt melt-backs
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-cyan-900/40 px-2 py-0.5 rounded-sm">Aggregate Recovery</span>
            </div>
          </div>

          {/* Landfill disposal */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-right hidden sm:block text-xs font-bold text-rose-800 font-mono">LANDFILL</div>
            <div className="flex-1 bg-rose-500 hover:bg-rose-600 transition-colors text-white py-3 px-4 rounded-xl text-center font-semibold shadow-xs text-xs relative">
              Toxic Paint scrapings, fragile tile powder, mortar dust (Landfill disposal)
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-rose-900/40 px-2 py-0.5 rounded-sm">Last Option</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Highlights / Dashboard Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-2 text-center shadow-xs">
          <Trash2 className="mx-auto text-emerald-600" size={24} />
          <h4 className="font-bold text-slate-850 text-sm">Volume prediction</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Real density-driven algorithms assessing beams, columns, floor slabs, tiles, woodwork, etc.
          </p>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-2 text-center shadow-xs">
          <TrendingUp className="mx-auto text-emerald-600" size={24} />
          <h4 className="font-bold text-slate-850 text-sm">Cost & Scrap Valuations</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Automatic comparison across major city scrap structures including Pune, Mumbai, Delhi, etc.
          </p>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-2 text-center shadow-xs">
          <Landmark className="mx-auto text-emerald-600" size={24} />
          <h4 className="font-bold text-slate-850 text-sm">Regulatory Manual</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            A comprehensive chapter-by-chapter segregation handbook for standard site deployment.
          </p>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-2 text-center shadow-xs">
          <ShieldCheck className="mx-auto text-emerald-600" size={24} />
          <h4 className="font-bold text-slate-850 text-sm">Printable Audits</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Instantly download localized demolition reports featuring complete calculation audits.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 pt-8 text-center space-y-2">
        <p className="text-xs text-slate-400">
          Prototype designed by Civil Engineering Minor Project Committee. Built on real structural densities and regulatory standards.
        </p>
        <p className="text-xs text-slate-400">
          Indian Standard Rules of safety for building demolishment (IS: 4130) and C&D Management Rules 2016.
        </p>
      </div>
    </div>
  );
}
