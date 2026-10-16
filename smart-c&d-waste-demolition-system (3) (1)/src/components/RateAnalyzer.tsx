/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CityRates } from "../types";
import { Coins, Settings2, ShieldAlert, Check, Undo2, ArrowUpRight, TrendingUp, Plus, X, Trash2 } from "lucide-react";

interface RateAnalyzerProps {
  rates: CityRates[];
  setRates: React.Dispatch<React.SetStateAction<CityRates[]>>;
  selectedCity: string;
  onCityChange: (city: string) => void;
  onSaveRatesToServer: (rates: CityRates[]) => void;
}

export function RateAnalyzer({ rates, setRates, selectedCity, onCityChange, onSaveRatesToServer }: RateAnalyzerProps) {
  const [editingCityIdx, setEditingCityIdx] = useState<number | null>(null);
  const [editedRate, setEditedRate] = useState<CityRates | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);

  // Custom component manually added rates state
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newCity, setNewCity] = useState("");
  const [newSteelScrapRate, setNewSteelScrapRate] = useState(35.00);
  const [newBrickRecoveryValue, setNewBrickRecoveryValue] = useState(2.50);
  const [newWoodRecoveryValue, setNewWoodRecoveryValue] = useState(12.00);
  const [newConcreteRecyclingRate, setNewConcreteRecyclingRate] = useState(0.45);
  const [newTransportRate, setNewTransportRate] = useState(40.00);
  const [newLandfillCharge, setNewLandfillCharge] = useState(0.60);
  const [newTripCapacity, setNewTripCapacity] = useState(5000);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const startEditing = (idx: number) => {
    setEditingCityIdx(idx);
    setEditedRate({ ...rates[idx] });
  };

  const cancelEditing = () => {
    setEditingCityIdx(null);
    setEditedRate(null);
  };

  const handleFieldChange = (field: keyof CityRates, value: number) => {
    if (editedRate) {
      setEditedRate({
        ...editedRate,
        [field]: value,
      });
    }
  };

  const saveEditedRate = (idx: number) => {
    if (editedRate) {
      const updatedList = [...rates];
      updatedList[idx] = editedRate;
      setRates(updatedList);
      onSaveRatesToServer(updatedList); // write to Express server memory
      setEditingCityIdx(null);
      setEditedRate(null);
    }
  };

  const handleAddNewRates = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);

    if (!newCity.trim()) {
      setFormError("Please enter a custom name or city identifier.");
      return;
    }

    const cityClean = newCity.trim();
    const exists = rates.some(r => r.city.toLowerCase() === cityClean.toLowerCase());
    if (exists) {
      setFormError(`A rates profile called "${cityClean}" already exists.`);
      return;
    }

    const newProfile: CityRates = {
      city: cityClean,
      steelScrapRate: Number(newSteelScrapRate),
      brickRecoveryValue: Number(newBrickRecoveryValue),
      woodRecoveryValue: Number(newWoodRecoveryValue),
      concreteRecyclingRate: Number(newConcreteRecyclingRate),
      transportRate: Number(newTransportRate),
      landfillCharge: Number(newLandfillCharge),
      tripCapacity: Number(newTripCapacity)
    };

    const updated = [newProfile, ...rates];
    setRates(updated);
    onSaveRatesToServer(updated);

    // Reset fields
    setNewCity("");
    setNewSteelScrapRate(35.00);
    setNewBrickRecoveryValue(2.50);
    setNewWoodRecoveryValue(12.00);
    setNewConcreteRecyclingRate(0.45);
    setNewTransportRate(40.00);
    setNewLandfillCharge(0.60);
    setNewTripCapacity(5000);
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3000);
  };

  const handleDeleteRatesProfile = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetName = rates[idx].city;
    if (targetName === selectedCity) {
      alert("Cannot delete the currently active city/location. Please select another active city first.");
      return;
    }
    if (confirm(`Are you sure you want to delete the manually added/preset rates profile for "${targetName}"?`)) {
      const updated = rates.filter((_, i) => i !== idx);
      setRates(updated);
      onSaveRatesToServer(updated);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-slate-150 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Coins className="text-emerald-700" size={20} /> City-wise Scrap Index & Logistics Matrix
          </h2>
          <p className="text-slate-505 text-xs">
            Show, compare, and modify market rates and land dumping charges across key metropolitan zones.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer border flex items-center gap-2 transition-all ${
              showAddForm 
                ? "bg-emerald-50 text-emerald-800 border-emerald-300" 
                : "bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-800"
            }`}
          >
            <Plus size={14} /> {showAddForm ? "Close Form" : "Custom Rates Input"}
          </button>
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer border flex items-center gap-2 transition-all ${showAdminPanel ? "bg-amber-50 text-amber-800 border-amber-300" : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"}`}
          >
            <Settings2 size={14} /> {showAdminPanel ? "Close Admin Mode" : "Open Admin Panel"}
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddNewRates} className="bg-slate-50 border border-emerald-200 rounded-2xl p-5 md:p-6 space-y-4 animate-fadeIn shadow-3xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Plus className="text-emerald-600 animate-pulse" size={16} /> Add Custom Rates Profile Manually
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg font-semibold flex items-center gap-1.5">
              ⚠️ {formError}
            </div>
          )}

          {formSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs rounded-lg font-extrabold flex items-center gap-1.5">
              ✓ Custom rates profile added! Locate and select it in the comparison table below.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* Name */}
            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                Profile Name / Identifier
              </label>
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="e.g. Pune-West Demolition Site"
                className="w-full px-3 py-2 rounded-lg border border-slate-250 font-bold text-slate-800 bg-white"
                required
              />
            </div>

            {/* Steel */}
            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                Steel Scrap Rate (₹/kg)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newSteelScrapRate}
                onChange={(e) => setNewSteelScrapRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-250 font-mono font-semibold text-slate-800 bg-white"
                required
              />
            </div>

            {/* Brick */}
            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                Brick Scrap Value (₹ each)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                value={newBrickRecoveryValue}
                onChange={(e) => setNewBrickRecoveryValue(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-250 font-mono font-semibold text-slate-800 bg-white"
                required
              />
            </div>

            {/* Timber */}
            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                Timber Recovery Rate (₹/kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={newWoodRecoveryValue}
                onChange={(e) => setNewWoodRecoveryValue(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-250 font-mono font-semibold text-slate-800 bg-white"
                required
              />
            </div>

            {/* Concrete */}
            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider font-sans">
                Concrete Processing Fee (₹/kg)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newConcreteRecyclingRate}
                onChange={(e) => setNewConcreteRecyclingRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-250 font-mono font-semibold text-slate-800 bg-white"
                required
              />
            </div>

            {/* Transport */}
            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                Freight Logistics (₹/km)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={newTransportRate}
                onChange={(e) => setNewTransportRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-250 font-mono font-semibold text-slate-800 bg-white"
                required
              />
            </div>

            {/* Landfill Fee */}
            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                Landfill Transit dumping (₹/kg)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newLandfillCharge}
                onChange={(e) => setNewLandfillCharge(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-250 font-mono font-semibold text-slate-800 bg-white"
                required
              />
            </div>

            {/* Trip capacity */}
            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                Trip Truck Capacity (kg)
              </label>
              <input
                type="number"
                step="100"
                min="100"
                value={newTripCapacity}
                onChange={(e) => setNewTripCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-250 font-mono font-semibold text-slate-800 bg-white"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-3xs active:scale-98 transition-all flex items-center gap-1.5"
            >
              <Plus size={14} className="text-white" /> Create Manual Component Rates Profile
            </button>
          </div>
        </form>
      )}

      {showAdminPanel && (
        <div className="border border-amber-200 bg-amber-50/20 rounded-2xl p-4 md:p-6 space-y-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <ShieldAlert size={20} className="text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase">Administrator Presets Config</h3>
              <p className="text-slate-600 text-xs text-justify">
                As site administrator, you possess privileges to modify local market rate settings (₹ per kg) and trucking logistical parameters dynamically. Saved updates persist in-memory immediately, updating downstream cost-benefit evaluations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Rates Comparative Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider">
                <th className="py-3.5 px-4 font-extrabold">Metro Region</th>
                <th className="py-3.5 px-4 font-extrabold">Steel Scrap (₹/kg)</th>
                <th className="py-3.5 px-4 font-extrabold">Brick Scrap (₹ each)</th>
                <th className="py-3.5 px-4 font-extrabold">Timber Recovery (₹/kg)</th>
                <th className="py-3.5 px-4 font-extrabold flex items-center gap-1">Concrete Processing (₹/kg) <TrendingUp size={12} /></th>
                <th className="py-3.5 px-8 font-extrabold">Freight Rate (₹/km)</th>
                <th className="py-3.5 px-4 font-extrabold">Landfill Fee (₹/kg)</th>
                <th className="py-3.5 px-4 font-extrabold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-slate-800">
              {rates.map((cityRate, idx) => {
                const isEditing = editingCityIdx === idx;
                const isSelected = selectedCity === cityRate.city;

                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${isEditing ? "bg-amber-50/30" : isSelected ? "bg-emerald-50/15 border-l-4 border-l-emerald-600" : "hover:bg-slate-50/50"}`}
                  >
                    {/* Location Name */}
                    <td className="py-3.5 px-4 font-bold">
                      <div className="flex items-center gap-2">
                        <span>{cityRate.city}</span>
                        {isSelected && (
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] uppercase font-black rounded-sm border border-emerald-200">
                            Active
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Steel Scrap rate */}
                    <td className="py-3.5 px-4 font-semibold font-mono">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editedRate?.steelScrapRate || 0}
                          onChange={(e) => handleFieldChange("steelScrapRate", Number(e.target.value))}
                          className="w-20 px-2 py-1 rounded-md border border-slate-300 font-semibold text-xs text-slate-800"
                        />
                      ) : (
                        `₹ ${cityRate.steelScrapRate.toFixed(2)}`
                      )}
                    </td>

                    {/* Brick Recovery */}
                    <td className="py-3.5 px-4 font-semibold font-mono">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          value={editedRate?.brickRecoveryValue || 0}
                          onChange={(e) => handleFieldChange("brickRecoveryValue", Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded-md border border-slate-300 font-semibold text-xs text-slate-800"
                        />
                      ) : (
                        `₹ ${cityRate.brickRecoveryValue.toFixed(2)}`
                      )}
                    </td>

                    {/* Wood Scrap */}
                    <td className="py-3.5 px-4 font-semibold font-mono">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          value={editedRate?.woodRecoveryValue || 0}
                          onChange={(e) => handleFieldChange("woodRecoveryValue", Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded-md border border-slate-300 font-semibold text-xs text-slate-800"
                        />
                      ) : (
                        `₹ ${cityRate.woodRecoveryValue.toFixed(2)}`
                      )}
                    </td>

                    {/* Concrete recycling charge */}
                    <td className="py-3.5 px-4 font-semibold font-mono">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editedRate?.concreteRecyclingRate || 0}
                          onChange={(e) => handleFieldChange("concreteRecyclingRate", Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded-md border border-slate-300 font-semibold text-xs text-slate-800"
                        />
                      ) : (
                        `₹ ${cityRate.concreteRecyclingRate.toFixed(2)}`
                      )}
                    </td>

                    {/* Freight Rate */}
                    <td className="py-3.5 px-8 font-semibold font-mono">
                      {isEditing ? (
                        <input
                          type="number"
                          step="1"
                          value={editedRate?.transportRate || 0}
                          onChange={(e) => handleFieldChange("transportRate", Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded-md border border-slate-300 font-semibold text-xs text-slate-800"
                        />
                      ) : (
                        `₹ ${cityRate.transportRate.toFixed(1)}`
                      )}
                    </td>

                    {/* Landfill dumping */}
                    <td className="py-3.5 px-4 font-semibold font-mono">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.05"
                          value={editedRate?.landfillCharge || 0}
                          onChange={(e) => handleFieldChange("landfillCharge", Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded-md border border-slate-300 font-semibold text-xs text-slate-800"
                        />
                      ) : (
                        `₹ ${cityRate.landfillCharge.toFixed(2)}`
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2 justify-end w-full">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => saveEditedRate(idx)}
                              className="p-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md flex items-center gap-1 cursor-pointer"
                              title="Save Changes"
                            >
                              <Check size={12} /> Save
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditing}
                              className="p-1 px-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-md cursor-pointer"
                              title="Cancel"
                            >
                              Cancel
                            </button>
                          </>
                        ) : showAdminPanel ? (
                          <div className="flex items-center gap-1.5 justify-end">
                            <button
                              type="button"
                              onClick={() => startEditing(idx)}
                              className="p-1 px-2.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-800 font-extrabold rounded-md flex items-center gap-1 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteRatesProfile(idx, e)}
                              className="p-1 text-rose-700 bg-rose-50 border border-rose-250 hover:bg-rose-100 rounded-md cursor-pointer flex items-center justify-center transition-colors"
                              title="Delete profile"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onCityChange(cityRate.city)}
                            className="p-1 px-2 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold hover:bg-emerald-600 hover:text-white rounded-md cursor-pointer flex items-center gap-1 transition-colors"
                          >
                            Select <ArrowUpRight size={10} />
                          </button>
                        )}
                      </div>
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
