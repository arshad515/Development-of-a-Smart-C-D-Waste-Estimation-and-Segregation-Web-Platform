/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ProjectMetadata, EstimationInputs, EstimationOutputs, CityRates } from "./types";
import { DEFAULT_CITY_RATES, calculateDemolitionWaste } from "./utils/formulas";
import { Home } from "./components/Home";
import { ProjectBasics } from "./components/ProjectBasics";
import { EstimationModule } from "./components/EstimationModule";
import { RateAnalyzer } from "./components/RateAnalyzer";
import { DashboardView } from "./components/DashboardView";
import { SegregationGuide } from "./components/SegregationGuide";
import { DigitalManual } from "./components/DigitalManual";
import { WorkflowSection } from "./components/WorkflowSection";
import { AIAssistant } from "./components/AIAssistant";
import { ReportView } from "./components/ReportView";
import { References } from "./components/References";
import { 
  Building, 
  Trash2, 
  LayoutDashboard, 
  ShieldCheck, 
  BookOpen, 
  Workflow, 
  BrainCircuit, 
  FileSpreadsheet, 
  FileText, 
  Home as HomeIcon, 
  Coins 
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");

  // Metadata context
  const [metadata, setMetadata] = useState<ProjectMetadata>({
    projectName: "Pune Metro Corridor Deconstruction Audit",
    buildingType: "Commercial",
    city: "Pune",
    demolitionType: "Full",
    builtUpArea: 1500,
    floorsCount: 4,
    rccGrade: "M25",
    constructionType: "RCC Frame",
    leadDistance: 25,
    calculationMode: "correct",
  });

  // Rates sheet state siphoned dynamically
  const [rates, setRates] = useState<CityRates[]>(DEFAULT_CITY_RATES);

  // Core component-wise structural & sub-structural parameters
  const [inputs, setInputs] = useState<EstimationInputs>({
    foundation: { enabled: true, length: 15, width: 12, depth: 2.0, count: 1, soilRatio: 0.3 },
    footing: { enabled: true, length: 1.5, width: 1.5, depth: 0.6, count: 16 },
    columns: { enabled: true, width: 0.4, breadth: 0.4, height: 3.2, count: 24 },
    beams: { enabled: true, length: 65, width: 0.3, depth: 0.45, count: 1 },
    slabs: { enabled: true, area: 450, thickness: 0.15, count: 4 },
    walls: { enabled: true, length: 320, height: 3.0, thickness: 0.23, count: 1, materialType: "Brick" },
    staircases: { enabled: true, length: 4.5, width: 1.2, thickness: 0.15, steps: 18, count: 4 },
    roof: { enabled: true, area: 450, thickness: 0.12, materialType: "RCC" },
    doors: { enabled: true, count: 25, width: 0.9, height: 2.1, material: "Wood" },
    windows: { enabled: true, count: 32, width: 1.2, height: 1.2, material: "Aluminium" },
    glass: { enabled: true, area: 85, thickness: 6 },
    tiles: { enabled: true, area: 650, thickness: 10 },
    plumbing: { enabled: true, length: 140, pipeMaterial: "PVC/Plastic", fixtures: 24 },
    electrical: { enabled: true, area: 1500 },
    falseCeiling: { enabled: true, area: 420, material: "Gypsum Board" },
    paint: { enabled: true, area: 1250 },
    woodwork: { enabled: true, area: 120, thickness: 18 },
  });

  // Output ledger result indices
  const [output, setOutput] = useState<EstimationOutputs | null>(null);

  // Sync to Express Server State Memory
  const handleSaveRatesToServer = async (updatedRatesList: CityRates[]) => {
    try {
      const res = await fetch("/api/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRatesList),
      });
      if (!res.ok) console.error("Could not sync rates configuration to fullstack backend.");
    } catch (err) {
      console.error(err);
    }
  };

  const getCityRateObj = () => {
    return rates.find((r) => r.city === metadata.city) || rates[0];
  };

  // Shadow ref to capture the previous state of builtUpArea and floorsCount for comparison
  const prevBasicsRef = React.useRef({
    builtUpArea: metadata.builtUpArea,
    floorsCount: metadata.floorsCount,
  });

  // Automatically scale all inputs proportionally when Project Basics builtUpArea or floorsCount change
  useEffect(() => {
    const prev = prevBasicsRef.current;
    if (prev.builtUpArea === metadata.builtUpArea && prev.floorsCount === metadata.floorsCount) {
      return;
    }

    const areaRatio = metadata.builtUpArea / (prev.builtUpArea || 1);
    const floorRatio = metadata.floorsCount / (prev.floorsCount || 1);

    // Update the baseline ref for subsequent checks
    prevBasicsRef.current = {
      builtUpArea: metadata.builtUpArea,
      floorsCount: metadata.floorsCount,
    };

    setInputs((prevInputs) => {
      const nextInputs = { ...prevInputs };

      const scaleVal = (v: any, ratio: number) => {
        if (typeof v === "number" && !isNaN(v)) {
          return Number((v * ratio).toFixed(2));
        }
        return v;
      };

      const keyScaleMap: { [key: string]: { area?: boolean; floor?: boolean; areaDivFloor?: boolean } } = {
        foundation: { area: true },
        footing: { area: true },
        columns: { area: true },
        beams: { area: true },
        slabs: { areaDivFloor: true },
        walls: { area: true },
        staircases: { floor: true },
        roof: { areaDivFloor: true },
        doors: { area: true },
        windows: { area: true },
        glass: { area: true },
        tiles: { area: true },
        plumbing: { area: true },
        electrical: { area: true },
        falseCeiling: { area: true },
        paint: { area: true },
        woodwork: { area: true },
      };

      Object.entries(keyScaleMap).forEach(([keyName, rules]) => {
        const key = keyName as keyof EstimationInputs;
        if (!nextInputs[key]) return;

        const comp = { ...nextInputs[key] };
        let multiplier = 1.0;

        if (rules.area) {
          multiplier = areaRatio;
        } else if (rules.floor) {
          multiplier = floorRatio;
        } else if (rules.areaDivFloor) {
          multiplier = areaRatio / floorRatio;
        }

        const updatedComp: any = { ...comp };

        if (key === "slabs") {
          if (updatedComp.area !== undefined) updatedComp.area = scaleVal(updatedComp.area, areaRatio / floorRatio);
          if (updatedComp.count !== undefined) updatedComp.count = scaleVal(updatedComp.count, floorRatio);
        } else if (key === "roof") {
          if (updatedComp.area !== undefined) updatedComp.area = scaleVal(updatedComp.area, areaRatio / floorRatio);
        } else if (key === "foundation") {
          const rootRatio = Math.sqrt(areaRatio);
          if (updatedComp.length !== undefined) updatedComp.length = scaleVal(updatedComp.length, rootRatio);
          if (updatedComp.width !== undefined) updatedComp.width = scaleVal(updatedComp.width, rootRatio);
        } else if (key === "footing" || key === "columns" || key === "doors" || key === "windows" || key === "staircases") {
          if (updatedComp.count !== undefined) updatedComp.count = Math.max(1, Math.round(updatedComp.count * multiplier));
        } else {
          ["area", "length", "fixtures"].forEach((prop) => {
            if (updatedComp[prop] !== undefined) {
              updatedComp[prop] = scaleVal(updatedComp[prop], multiplier);
            }
          });
        }

        if (comp.items && comp.items.length > 0) {
          updatedComp.items = comp.items.map((item: any) => {
            const upItem = { ...item };
            if (key === "slabs") {
              if (upItem.area !== undefined) upItem.area = scaleVal(upItem.area, areaRatio / floorRatio);
              if (upItem.count !== undefined) upItem.count = scaleVal(upItem.count, floorRatio);
            } else if (key === "roof") {
              if (upItem.area !== undefined) upItem.area = scaleVal(upItem.area, areaRatio / floorRatio);
            } else if (key === "foundation") {
              const rootRatio = Math.sqrt(areaRatio);
              if (upItem.length !== undefined) upItem.length = scaleVal(upItem.length, rootRatio);
              if (upItem.width !== undefined) upItem.width = scaleVal(upItem.width, rootRatio);
            } else if (key === "footing" || key === "columns" || key === "doors" || key === "windows" || key === "staircases") {
              if (upItem.count !== undefined) upItem.count = Math.max(1, Math.round(upItem.count * multiplier));
            } else {
              ["area", "length", "fixtures"].forEach((prop) => {
                if (upItem[prop] !== undefined) {
                  upItem[prop] = scaleVal(upItem[prop], multiplier);
                }
              });
            }
            return upItem;
          });
        }

        nextInputs[key] = updatedComp;
      });

      return nextInputs;
    });
  }, [metadata.builtUpArea, metadata.floorsCount]);

  // Perform estimation on any value trigger
  useEffect(() => {
    const activeRateObj = getCityRateObj();
    // 1. Instantly trigger robust local math calculator
    const result = calculateDemolitionWaste(metadata, inputs, activeRateObj);
    setOutput(result);

    // 2. Safely trigger backend endpoint validation as well to verify full-stack parity
    const syncBackendEstimation = async () => {
      try {
        const res = await fetch("/api/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ meta: metadata, inputs, rates: activeRateObj }),
        });
        const data = await res.json();
        if (data && data.success) {
          // Synced calculation with high fidelity
          setOutput(data.estimation);
        }
      } catch (err) {
        console.error("Express API error:", err);
      }
    };
    syncBackendEstimation();
  }, [metadata, inputs, rates]);

  // Initial backend checkout
  useEffect(() => {
    const getRatesFromBackend = async () => {
      try {
        const res = await fetch("/api/rates");
        const data = await res.json();
        if (data && data.rates) {
          setRates(data.rates);
        }
      } catch (err) {
        console.warn("Backend server not ready yet. Using default client fallback parameters.");
      }
    };
    getRatesFromBackend();
  }, []);

  const handleCityChange = (city: string) => {
    setMetadata((prev) => ({ ...prev, city }));
  };

  const currentCityRates = getCityRateObj();

  // Navigation Panel links
  const tabs = [
    { id: "home", label: "Home", icon: <HomeIcon size={16} /> },
    { id: "basics", label: "Project Basics", icon: <Building size={16} /> },
    { id: "estimation", label: "Component Estimation", icon: <Trash2 size={16} /> },
    { id: "dictionary", label: "City Rates", icon: <Coins size={16} /> },
    { id: "dashboard", label: "Dashboard Metrics", icon: <LayoutDashboard size={16} /> },
    { id: "segregation", label: "Segregation Guide", icon: <ShieldCheck size={16} /> },
    { id: "manual", label: "Digital Manual", icon: <BookOpen size={16} /> },
    { id: "workflow", label: "Workflow Pipeline", icon: <Workflow size={16} /> },
    { id: "ai", label: "AI Consultant", icon: <BrainCircuit size={16} /> },
    { id: "report", label: "Print Report", icon: <FileText size={16} /> },
    { id: "references", label: "Academic Sources", icon: <FileSpreadsheet size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-250 selection:text-emerald-950">
      {/* Top Static brand Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 print:hidden shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm">
              🏗️
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 tracking-tight block uppercase leading-none">
                SMART C&D DEMOLITION
              </span>
              <span className="text-[9px] text-slate-505 block tracking-wider font-extrabold font-mono pt-1">
                Waste Segregation & Estimation Matrix
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[10px] text-slate-450 font-mono font-bold">
            <div>REGION: <span className="text-slate-800">{metadata.city.toUpperCase()}</span></div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <div>DIVERSIFIED: <span className="text-emerald-700">{output ? output.sustainabilityScore : 0}%</span></div>
          </div>
        </div>
      </header>

      {/* Main Structural Body */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 md:py-8 flex-1 flex flex-col lg:flex-row gap-8">
        {/* Navigation panel */}
        <aside className="lg:w-64 shrink-0 space-y-3 print:hidden">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-2xs">
            <div className="pb-2 border-b border-slate-150">
              <span className="text-[10px] font-black uppercase text-slate-455 tracking-widest font-mono">
                System Navigation
              </span>
            </div>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 cursor-pointer transition-colors ${isActive ? "bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs font-extrabold" : "text-slate-655 hover:bg-slate-50 hover:text-slate-950"}`}
                  >
                    <span className={isActive ? "text-white" : "text-slate-400"}>
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Stats sidebar footer */}
          {output && output.totalWasteMass > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 p-5 space-y-3 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-450 block font-mono">Active Ledger</span>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Waste Generated:</span>
                  <strong className="font-mono">{(output.totalWasteMass / 1000).toFixed(1)} T</strong>
                </div>
                <div className="flex justify-between text-emerald-850">
                  <span>Recovery Credits:</span>
                  <strong className="font-mono">₹{Math.round(output.recoveryValue).toLocaleString("en-IN")}</strong>
                </div>
                <div className="flex justify-between text-rose-800">
                  <span>Net project cost:</span>
                  <strong className="font-mono">₹{Math.round(output.netCost).toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Action Window Content Area */}
        <main className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 min-h-[500px] shadow-xs relative print:border-none print:shadow-none print:p-0">
          {activeTab === "home" && (
            <Home onStartClick={() => setActiveTab("basics")} />
          )}

          {activeTab === "basics" && (
            <ProjectBasics 
              metadata={metadata} 
              setMetadata={setMetadata} 
              rates={rates} 
              inputs={inputs}
              setInputs={setInputs}
              output={output}
            />
          )}

          {activeTab === "estimation" && (
            <EstimationModule 
              inputs={inputs} 
              setInputs={setInputs} 
              calculationMode={metadata.calculationMode}
            />
          )}

          {activeTab === "dictionary" && (
            <RateAnalyzer 
              rates={rates} 
              setRates={setRates} 
              selectedCity={metadata.city} 
              onCityChange={handleCityChange} 
              onSaveRatesToServer={handleSaveRatesToServer}
            />
          )}

          {activeTab === "dashboard" && (
            <DashboardView 
              output={output} 
              meta={metadata} 
            />
          )}

          {activeTab === "segregation" && (
            <SegregationGuide />
          )}

          {activeTab === "manual" && (
            <DigitalManual />
          )}

          {activeTab === "workflow" && (
            <WorkflowSection />
          )}

          {activeTab === "ai" && (
            <AIAssistant 
              meta={metadata} 
              output={output} 
            />
          )}

          {activeTab === "report" && (
            <ReportView 
              meta={metadata} 
              output={output} 
              rates={currentCityRates} 
            />
          )}

          {activeTab === "references" && (
            <References />
          )}
        </main>
      </div>
    </div>
  );
}
