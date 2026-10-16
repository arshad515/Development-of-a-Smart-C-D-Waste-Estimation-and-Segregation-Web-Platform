/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MANUAL_CHAPTERS } from "../utils/manualData";
import { ManualChapter } from "../types";
import { FileText, Search, Printer, ChevronRight, BookOpen, Download } from "lucide-react";

export function DigitalManual() {
  const [selectedChapterId, setSelectedChapterId] = useState<string>("chap1");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleChapterClick = (id: string) => {
    setSelectedChapterId(id);
  };

  // Searching logic spanning chapter title and textual paragraph entries
  const filteredChapters = MANUAL_CHAPTERS.filter((chap) => {
    const query = searchQuery.toLowerCase();
    return (
      chap.title.toLowerCase().includes(query) ||
      chap.content.toLowerCase().includes(query)
    );
  });

  const selectedChapter = MANUAL_CHAPTERS.find((c) => c.id === selectedChapterId) || MANUAL_CHAPTERS[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12 print:p-0 print:border-none print:shadow-none font-sans">
      {/* Overview header */}
      <div className="border-b border-slate-150 pb-4 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="text-emerald-700" size={20} /> Digital Demolition & Waste Segregation Manual
          </h2>
          <p className="text-slate-505 text-xs">
            A comprehensive, searchable academic handbook covering regulatory, site sorting, and transportation protocols.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-2 transition-transform hover:-translate-y-0.5"
        >
          <Printer size={14} /> Print / Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Nav (Chapter List) */}
        <div className="lg:col-span-4 space-y-4 print:hidden">
          {/* Search bar */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search handbook keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-medium text-slate-800 text-xs outline-hidden bg-white"
            />
          </div>

          {/* Chapter Links */}
          <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden divide-y divide-slate-150 max-h-[460px] overflow-y-auto shadow-2xs">
            {filteredChapters.length > 0 ? (
              filteredChapters.map((chap) => {
                const isSelected = chap.id === selectedChapterId;
                return (
                  <button
                    key={chap.id}
                    onClick={() => handleChapterClick(chap.id)}
                    className={`w-full text-left px-4 py-3 text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer ${isSelected ? "bg-emerald-50 text-emerald-900 font-extrabold border-l-4 border-l-emerald-600" : "text-slate-705 hover:bg-slate-50 hover:text-slate-950"}`}
                  >
                    <span className="truncate">{chap.title}</span>
                    <ChevronRight size={14} className={isSelected ? "text-emerald-700" : "text-slate-400"} />
                  </button>
                )
              })
            ) : (
              <div className="p-4 text-center text-slate-400 text-xs font-medium">
                No matching chapters found.
              </div>
            )}
          </div>
          
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-[10px] text-slate-500 space-y-1">
            <span className="font-extrabold text-indigo-950 uppercase block">Handbook Regulatory Codes:</span>
            <p>Formulated in compliance with Solid Waste (C&D) Directives, 2016 (MoEFCC Govt of India) & Bureau of Indian Standards aggregates usage codes (IS: 383).</p>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs min-h-[450px] print:border-none print:shadow-none print:p-0">
          <div className="border-b border-slate-150 pb-4">
            <span className="text-[9px] font-extrabold text-emerald-800 uppercase tracking-widest font-mono block print:hidden">
              Regulatory Handbook Reader
            </span>
            <h3 className="text-xl font-bold text-indigo-950 pt-1">
              {selectedChapter.title}
            </h3>
          </div>

          {/* Core Text */}
          <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line text-justify font-normal font-sans">
            {selectedChapter.content}
          </div>

          {/* Quick PDF footer help */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 print:hidden">
            <span>Engineering Manual v2.1 • C&D Segregation guidelines</span>
            <button
               onClick={handlePrint}
               className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Download size={12} /> Save PDF format
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
