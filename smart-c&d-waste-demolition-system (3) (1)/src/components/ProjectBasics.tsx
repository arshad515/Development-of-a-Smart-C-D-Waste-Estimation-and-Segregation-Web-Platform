/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ProjectMetadata, CityRates, EstimationInputs, EstimationOutputs } from "../types";
import { 
  Building, 
  MapPin, 
  Layers, 
  Scale, 
  Zap, 
  Sparkles, 
  CheckCircle,
  Hash,
  AlertCircle,
  Database,
  Cloud,
  CloudOff,
  RefreshCw,
  Save,
  Download,
  Trash2,
  Copy,
  ExternalLink
} from "lucide-react";

interface ProjectBasicsProps {
  metadata: ProjectMetadata;
  setMetadata: React.Dispatch<React.SetStateAction<ProjectMetadata>>;
  rates: CityRates[];
  inputs: EstimationInputs;
  setInputs: React.Dispatch<React.SetStateAction<EstimationInputs>>;
  output: EstimationOutputs | null;
}

export function ProjectBasics({ metadata, setMetadata, rates, inputs, setInputs, output }: ProjectBasicsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata((prev) => ({
      ...prev,
      [name]: name === "builtUpArea" || name === "floorsCount" || name === "leadDistance" ? Number(value) : value,
    }));
  };

  const currentCityObj = rates.find((r) => r.city === metadata.city) || rates[0];

  // Supabase Local State Controllers
  const [dbStatus, setDbStatus] = React.useState<{ configured: boolean; url: string | null }>({ configured: false, url: null });
  const [estimations, setEstimations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [dbError, setDbError] = React.useState<string | null>(null);
  const [dbTip, setDbTip] = React.useState<string | null>(null);
  const [sqlCopied, setSqlCopied] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const fetchStatusAndData = async () => {
    try {
      const statusRes = await fetch("/api/supabase/status");
      const statusData = await statusRes.json();
      setDbStatus(statusData);

      if (statusData.configured) {
        setLoading(true);
        const dataRes = await fetch("/api/supabase/estimations");
        const listData = await dataRes.json();
        if (listData.success) {
          setEstimations(listData.data || []);
          setDbError(null);
          setDbTip(null);
        } else {
          setDbError(listData.error || "Failed to load estimations.");
          setDbTip(listData.tip || null);
        }
      }
    } catch (err: any) {
      console.error(err);
      setDbError("Dev server database API not responding.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStatusAndData();
  }, []);

  const handleSaveToSupabase = async () => {
    if (!metadata.projectName) {
      alert("Please provide a Project Name first.");
      return;
    }
    setSaving(true);
    setDbError(null);
    setDbTip(null);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/supabase/estimations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: metadata.projectName,
          metadata,
          inputs,
          output
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        fetchStatusAndData();
      } else {
        setDbError(data.error || "Save operation failed.");
        setDbTip(data.tip || null);
      }
    } catch (err: any) {
      setDbError("Network error while trying to reach database.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEstimation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this saved project estimation?")) return;
    setDeletingId(id);
    setDbError(null);
    try {
      const res = await fetch(`/api/supabase/estimations/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        fetchStatusAndData();
      } else {
        setDbError(data.error || "Delete operation failed.");
      }
    } catch (err: any) {
      setDbError("Network error while trying to delete estimation.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLoadEstimation = (item: any) => {
    if (confirm(`Load project "${item.project_name}"? This will overwrite your current active estimation values.`)) {
      setMetadata(item.metadata);
      setInputs(item.inputs);
    }
  };

  const copySqlToClipboard = () => {
    const rawSql = `CREATE TABLE demolition_estimations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  metadata JSONB NOT NULL,
  inputs JSONB NOT NULL,
  output JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`;
    navigator.clipboard.writeText(rawSql);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Dynamic Link Notification Panel */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-200 rounded-2xl p-4 md:p-5 flex items-start gap-4 shadow-3xs">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
          <Zap size={20} className="animate-pulse" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-widest flex items-center gap-2">
            Auto-Scaling Engine Engaged <span className="inline-block px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[9px] rounded-sm uppercase tracking-normal">Live Sync</span>
          </h4>
          <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
            Modifying <strong>Built-Up Area</strong> or <strong>Floors Count</strong> will automatically scale and recalculate all component parameters proportionally (columns count, footing mass, slab areas, walls lengths). You do not need to manually edit every sub-structure!
          </p>
        </div>
      </div>

      {/* Supabase Core Integration Module */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-3xs overflow-hidden relative">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-150 pb-5">
          <div className="space-y-1 mt-1">
            <h2 className="text-[15px] md:text-base font-black text-slate-900 flex items-center gap-2.5">
              <Database className="text-emerald-700 shrink-0" size={20} /> Supabase Cloud Database Storage
            </h2>
            <p className="text-slate-500 text-xs leading-relaxed max-w-2xl">
              Synchronize, archive, and retrieve your project estimations directly in your own cloud-hosted PostgreSQL database. Perfect for audit trails.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {dbStatus.configured ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-mono font-extrabold rounded-lg uppercase tracking-wide">
                <Cloud size={11} className="text-emerald-600" /> Active Cloud Link
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-mono font-extrabold rounded-lg uppercase tracking-wide">
                <CloudOff size={11} className="text-amber-600 animate-pulse" /> Offline
              </span>
            )}
            <button
              type="button"
              onClick={fetchStatusAndData}
              disabled={loading}
              className="p-1 px-1.5 bg-slate-100 border border-slate-200 text-slate-800 font-extrabold text-[9px] rounded-lg cursor-pointer hover:bg-slate-200 transition-colors flex items-center gap-1 font-mono uppercase"
            >
              <RefreshCw size={10} className={loading ? "animate-spin" : ""} /> Sync
            </button>
          </div>
        </div>

        {/* Database state & helpful instructions if missing keys */}
        {!dbStatus.configured ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-5 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-600 mt-0.5 shrink-0" size={16} />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                  Configure Your Secrets First
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  To connect your custom cloud database, go to the <strong>Secrets panel in AI Studio UI</strong> and add the environment configurations:
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-700 bg-white border border-slate-150 p-4 rounded-xl">
              <div>
                <span className="block text-[8px] font-bold text-slate-400">VARIABLE:</span>
                <span className="font-extrabold text-slate-900">SUPABASE_URL</span>
                <span className="block text-[9px] text-slate-500 pt-0.5 font-sans leading-relaxed">e.g., https://yourproject.supabase.co</span>
              </div>
              <div>
                <span className="block text-[8px] font-bold text-slate-400">VARIABLE:</span>
                <span className="font-extrabold text-slate-900">SUPABASE_ANON_KEY</span>
                <span className="block text-[9px] text-slate-500 pt-0.5 font-sans leading-relaxed">Your public anon key / service key.</span>
              </div>
            </div>

            <div className="space-y-2 pt-2.5 border-t border-slate-150">
              <span className="text-[10px] font-extrabold text-slate-700 block uppercase tracking-wider">
                SQL Create Table Schema
              </span>
              <p className="text-[10px] text-slate-500 font-medium">
                Run this command in your <strong>Supabase SQL Editor</strong> to construct the target table structure:
              </p>
              <div className="relative">
                <pre className="bg-slate-900 text-slate-300 text-[10px] p-4 rounded-xl overflow-x-auto font-mono leading-relaxed select-all">
{`CREATE TABLE demolition_estimations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  metadata JSONB NOT NULL,
  inputs JSONB NOT NULL,
  output JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`}
                </pre>
                <button
                  type="button"
                  onClick={copySqlToClipboard}
                  className="absolute top-2.5 right-2.5 px-2 py-1 bg-slate-800 text-slate-200 border border-slate-705 hover:bg-slate-700 text-[9px] font-bold rounded-lg cursor-pointer flex items-center gap-1 select-none transition-colors"
                >
                  {sqlCopied ? <span className="text-emerald-400 font-extrabold">Copied!</span> : "Copy Code"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Database status and manual project save trigger */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 rounded-2xl p-4 md:p-5 border border-slate-155">
              <div className="space-y-1.5 justify-center flex flex-col">
                <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-widest flex items-center gap-1.5">
                  <Save size={13} className="text-emerald-700" /> Archive Active Estimation
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Commit and save the current project configurations, material dimensions, and financial metrics directly to your cloud hosted schema.
                </p>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handleSaveToSupabase}
                  disabled={saving || !metadata.projectName}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    saveSuccess
                      ? "bg-emerald-600 text-white shadow-xs border border-emerald-700"
                      : !metadata.projectName
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                      : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs active:scale-98 border border-emerald-800"
                  }`}
                >
                  {saving ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" /> Saving estimation...
                    </>
                  ) : saveSuccess ? (
                    <>
                      ✓ Synced to Supabase!
                    </>
                  ) : (
                    <>
                      <Save size={13} /> Save Current Project to Cloud
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error displays */}
            {dbError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-950 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle size={16} className="text-rose-700 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs w-full">
                  <p className="font-extrabold uppercase tracking-wide text-rose-900">Database Connection Notice</p>
                  <p className="font-medium text-[11px] leading-relaxed text-rose-800">{dbError}</p>
                  
                  {dbTip && (
                    <div className="mt-2.5 p-3 bg-white/80 border border-slate-150 rounded-xl space-y-2">
                      <p className="font-bold text-[10px] text-slate-700">
                        💡 Auto-Setup Solution Schema:
                      </p>
                      <p className="leading-normal font-medium text-[10px] text-slate-500">{dbTip}</p>
                      
                      <div className="relative pt-1">
                        <pre className="bg-slate-900 text-slate-300 text-[9px] p-3 rounded-lg overflow-x-auto select-all leading-normal font-mono">
{`CREATE TABLE demolition_estimations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  metadata JSONB NOT NULL,
  inputs JSONB NOT NULL,
  output JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`}
                        </pre>
                        <button
                          type="button"
                          onClick={copySqlToClipboard}
                          className="absolute top-3.5 right-2 px-2 bg-slate-800 text-slate-200 border border-slate-700 text-[9px] py-1 font-semibold rounded-md cursor-pointer transition-colors"
                        >
                          {sqlCopied ? "Copied" : "Copy Schema"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* List of saved estimations */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block font-mono">
                Archived Estimations in Supabase ({estimations.length})
              </span>
              
              {loading ? (
                <div className="py-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <RefreshCw size={13} className="animate-spin text-emerald-700" /> Loading cloud entries...
                </div>
              ) : estimations.length === 0 ? (
                <div className="p-6 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-450 font-medium">
                  No cloud database rows found. Fill out your details and click "Save Current Project to Cloud" to record database entries!
                </div>
              ) : (
                <div className="divide-y divide-slate-150 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-3xs max-h-[300px] overflow-y-auto">
                  {estimations.map((item) => {
                    const savedAt = new Date(item.created_at).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    });
                    return (
                      <div key={item.id} className="p-3.5 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="font-extrabold text-slate-900 leading-snug flex items-center gap-1.5 flex-wrap">
                            <span>{item.project_name}</span>
                            <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-250 text-slate-600 font-bold text-[8px] rounded uppercase">
                              {item.metadata?.buildingType || "General"}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 space-x-2">
                            <span>Area: <strong>{item.metadata?.builtUpArea || 0} m²</strong></span>
                            <span>•</span>
                            <span>Floors: <strong>{item.metadata?.floorsCount || 0}</strong></span>
                            <span>•</span>
                            <span>Saved: <strong>{savedAt}</strong></span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleLoadEstimation(item)}
                            className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 text-slate-800 hover:bg-emerald-50 hover:text-emerald-950 hover:border-emerald-250 font-extrabold text-[10px] rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
                          >
                            <Download size={11} className="text-emerald-800" /> Restore
                          </button>
                          <button
                            type="button"
                            disabled={deletingId === item.id}
                            onClick={(e) => handleDeleteEstimation(item.id, e)}
                            className="px-2 py-1.5 bg-slate-50 border border-slate-200 hover:bg-rose-50 hover:text-rose-950 hover:border-rose-250 text-slate-500 font-extrabold text-[10px] rounded-lg cursor-pointer transition-colors disabled:opacity-40"
                          >
                            {deletingId === item.id ? (
                              <RefreshCw size={11} className="animate-spin" />
                            ) : (
                              <Trash2 size={11} className="text-rose-800" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-8 shadow-3xs overflow-hidden relative">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-150 pb-5">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
              <Building className="text-emerald-700 shrink-0" size={22} /> Project Context & Baselines
            </h2>
            <p className="text-slate-500 text-xs">
              Configure baseline targeting variables to automatically scale structural volume and density metrics.
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono font-bold rounded-lg uppercase tracking-wide">
            <Sparkles size={11} className="text-amber-500 animate-spin-slow" /> Setup Stage 1
          </div>
        </div>

        {/* Real-time Calculation Accuracy Mode Selector (Strictly Detailed Correct Sum Mode) */}
        <div className="bg-gradient-to-r from-slate-50 to-indigo-50/20 rounded-2xl p-5 border border-slate-150 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <h3 className="text-xs font-extrabold uppercase text-indigo-950 tracking-wider flex items-center gap-1.5">
              <Scale size={14} className="text-emerald-700 animate-bounce" /> Estimation Precision Mode
            </h3>
            <p className="text-[11px] text-slate-500 leading-normal">
              This calculator operates exclusively in <strong>Detailed Correct Sum Mode</strong>. It strictly computes weights and volumes based on actual structural component measurements (beams, slabs, columns, walls) and material-specific densities, ensuring engineering-grade precision and auditing reliability.
            </p>
          </div>
          <div className="flex items-center self-stretch md:self-auto shrink-0">
            <div className="px-4 py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-250 text-xs font-black uppercase rounded-xl flex items-center gap-1.5 tracking-wider shadow-3xs">
              <CheckCircle size={14} className="text-emerald-700 shrink-0" /> Detailed Correct Sum Active
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Section 1: Project Identity & Location */}
          <div className="space-y-5">
            <h3 className="text-xs font-extrabold uppercase text-indigo-950 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <MapPin size={14} className="text-emerald-700" /> Identity & Geographic Scope
            </h3>

            {/* Project Name */}
            <div className="space-y-1.5">
              <label htmlFor="projectName-id" className="text-[10px] font-extrabold text-slate-700 block uppercase tracking-wide">
                Project Title / Site Name
              </label>
              <input
                id="projectName-id"
                type="text"
                name="projectName"
                value={metadata.projectName || ""}
                onChange={handleChange}
                placeholder="e.g. Pune Metro Corridor Deconstruction Audit"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-bold text-slate-800 text-xs shadow-3xs outline-hidden transition-all placeholder:font-medium bg-slate-50/50 hover:bg-white focus:bg-white"
              />
            </div>

            {/* Selected City */}
            <div className="space-y-1.5">
              <label htmlFor="city-id" className="text-[10px] font-extrabold text-slate-700 block uppercase tracking-wide">
                City Locator (Active Scrap Index)
              </label>
              <select
                id="city-id"
                name="city"
                value={metadata.city || "Pune"}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-bold text-slate-800 text-xs shadow-3xs outline-hidden bg-white hover:bg-slate-50/50 transition-all cursor-pointer"
              >
                {rates.map((r, idx) => (
                  <option key={idx} value={r.city}>
                    {r.city} (Steel Scrap Rate: ₹{r.steelScrapRate}/kg)
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-450 italic pt-0.5">
                Current selection sets scrap rates: Brick ₹{currentCityObj.brickRecoveryValue}/kg, Wood ₹{currentCityObj.woodRecoveryValue}/kg.
              </p>
            </div>

            {/* Demolition Type */}
            <div className="space-y-1.5">
              <label htmlFor="demolitionType-id" className="text-[10px] font-extrabold text-slate-700 block uppercase tracking-wide">
                Deconstruction Methodology
              </label>
              <select
                id="demolitionType-id"
                name="demolitionType"
                value={metadata.demolitionType || "Full"}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-bold text-slate-800 text-xs shadow-3xs outline-hidden bg-white hover:bg-slate-50/50 transition-all cursor-pointer"
              >
                <option value="Full">Full Demolition (Complete knock-down)</option>
                <option value="Partial">Partial Demolition (Slabs/Skeletal framework intact)</option>
                <option value="Deconstruction">Selective Deconstruction (Maximum material segregation)</option>
              </select>
            </div>
          </div>

          {/* Section 2: Dimensional Configurations */}
          <div className="space-y-5">
            <h3 className="text-xs font-extrabold uppercase text-indigo-950 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Layers size={14} className="text-emerald-700" /> Physical Dimensions & Geometry
            </h3>

            {/* Built up area */}
            <div className="space-y-1.5">
              <label htmlFor="builtUpArea-id" className="text-[10px] font-extrabold text-slate-700 block uppercase tracking-wide flex items-center justify-between">
                <span>Total Built-Up Area (sq. m)</span>
                <span className="text-[9px] text-indigo-600 font-mono font-black uppercase tracking-wider">Multiplies outputs</span>
              </label>
              <input
                id="builtUpArea-id"
                type="number"
                min="100"
                max="500000"
                name="builtUpArea"
                value={metadata.builtUpArea || 1500}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-black text-slate-800 text-xs shadow-3xs outline-hidden bg-slate-50/50 hover:bg-white focus:bg-white"
              />
            </div>

            {/* Slabs Floors */}
            <div className="space-y-1.5">
              <label htmlFor="floorsCount-id" className="text-[10px] font-extrabold text-slate-700 block uppercase tracking-wide flex items-center justify-between">
                <span>Number of Floors / Levels</span>
                <span className="text-[9px] text-amber-600 font-mono font-black uppercase tracking-wider">Scales height</span>
              </label>
              <input
                id="floorsCount-id"
                type="number"
                min="1"
                max="80"
                name="floorsCount"
                value={metadata.floorsCount || 4}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-black text-slate-800 text-xs shadow-3xs outline-hidden bg-slate-50/50 hover:bg-white focus:bg-white"
              />
            </div>

            {/* Building Category */}
            <div className="space-y-1.5">
              <label htmlFor="buildingType-id" className="text-[10px] font-extrabold text-slate-700 block uppercase tracking-wide">
                Structural Occupancy Category
              </label>
              <select
                id="buildingType-id"
                name="buildingType"
                value={metadata.buildingType || "Commercial"}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-bold text-slate-800 text-xs shadow-3xs outline-hidden bg-white hover:bg-slate-50/50 transition-all cursor-pointer"
              >
                <option value="Residential">Residential Building (Apartments/Villas)</option>
                <option value="Commercial">Commercial (Complexes, Malls, Offices)</option>
                <option value="Industrial">Industrial (Warehouses, Sheds, Factories)</option>
                <option value="School">School / Educational Complex</option>
                <option value="Hospital">Hospital / Clinical Centers</option>
                <option value="Road">Road / Pavement Infrastructure</option>
                <option value="Bridge">Bridge / Elevated RCC Structure</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Material & Structural Quality */}
        <div className="pt-6 border-t border-slate-150 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-1.5">
            <label htmlFor="rccGrade-id" className="text-[10px] font-extrabold text-slate-700 block uppercase tracking-wide">
              Concrete Design Structural Grade
            </label>
            <select
              id="rccGrade-id"
              name="rccGrade"
              value={metadata.rccGrade || "M25"}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-bold text-slate-800 text-xs shadow-3xs outline-hidden bg-white hover:bg-slate-50/50 transition-all cursor-pointer"
            >
              <option value="M20">M20 Grade (Residential typical - 1:1.5:3 cement ratio)</option>
              <option value="M25">M25 Grade (Standard commercial - 1:1:2 design setup)</option>
              <option value="M30">M30 Grade (Heavy elevated structure/Piers)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="constructionType-id" className="text-[10px] font-extrabold text-slate-700 block uppercase tracking-wide">
              Core Framework Architectural Typology
            </label>
            <select
              id="constructionType-id"
              name="constructionType"
              value={metadata.constructionType || "RCC Frame"}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-bold text-slate-800 text-xs shadow-3xs outline-hidden bg-white hover:bg-slate-50/50 transition-all cursor-pointer"
            >
              <option value="RCC Frame">RCC Column-Beam Frame Structural Grid Layout</option>
              <option value="Load Bearing">Traditional Load Bearing Masonry Frame</option>
              <option value="Steel Frame">Industrial Structural Steel columns & Post Frame</option>
              <option value="Composite">Composite Steel & RCC Concrete Framework</option>
            </select>
          </div>
        </div>

        {/* Lead Transit distance slider */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-150/80 space-y-3">
          <label htmlFor="leadDistance-id" className="text-[10px] font-extrabold text-slate-800 block uppercase tracking-wider flex items-center justify-between">
            <span>Recycling Yard Transit Lead Distance (Dumping Limit)</span>
            <span className="font-mono text-emerald-800 font-black bg-emerald-100 px-2 py-0.5 rounded-sm text-xs">
              {metadata.leadDistance || 25} km
            </span>
          </label>
          <div className="flex items-center gap-4">
            <input
              id="leadDistance-id"
              type="range"
              min="5"
              max="150"
              name="leadDistance"
              value={metadata.leadDistance || 25}
              onChange={handleChange}
              className="flex-1 accent-emerald-700 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex items-start gap-1.5 text-[10px] text-slate-500 leading-normal">
            <AlertCircle size={12} className="text-slate-400 shrink-0 mt-0.5" />
            <span>
              This transit distance exponentially impacts trucking carbon logic and cargo logistics rates: <strong>₹{currentCityObj.transportRate}/km per trip</strong>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
