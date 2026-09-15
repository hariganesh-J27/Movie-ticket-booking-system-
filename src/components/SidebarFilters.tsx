"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Filter, X } from "lucide-react";

interface SidebarFiltersProps {
  selectedLanguage: string;
  setSelectedLanguage: (v: string) => void;
  selectedGenre: string;
  setSelectedGenre: (v: string) => void;
  selectedFormat: string;
  setSelectedFormat: (v: string) => void;
  onClearFilters: () => void;
}

export default function SidebarFilters({
  selectedLanguage,
  setSelectedLanguage,
  selectedGenre,
  setSelectedGenre,
  selectedFormat,
  setSelectedFormat,
  onClearFilters,
}: SidebarFiltersProps) {
  const [openLanguages, setOpenLanguages] = useState(true);
  const [openGenres, setOpenGenres] = useState(true);
  const [openFormats, setOpenFormats] = useState(true);

  const languages = ["Tamil", "Hindi", "Telugu", "Malayalam", "English"];
  const genres = ["Action", "Sci-Fi", "Comedy", "Thriller", "Drama", "Romance", "Superhero", "Crime"];
  const formats = ["2D", "3D", "IMAX 3D"];

  const hasActiveFilters = selectedLanguage !== "All" || selectedGenre !== "All" || selectedFormat !== "All";

  return (
    <div className="w-full lg:w-64 space-y-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5 text-bms-red" />
          <span>Filters</span>
        </h3>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs font-semibold text-bms-red hover:underline flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <button
          onClick={() => setOpenLanguages(!openLanguages)}
          className="w-full p-4 flex items-center justify-between font-bold text-sm text-bms-red bg-white border-b border-gray-100 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            Languages
            {selectedLanguage !== "All" && (
              <span className="bg-bms-red text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">1</span>
            )}
          </span>
          {openLanguages ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {openLanguages && (
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center text-[11px] text-gray-400">
              <span>Select language:</span>
              <button onClick={() => setSelectedLanguage("All")} className="text-bms-red hover:underline font-semibold cursor-pointer">
                Clear
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => {
                const isSelected = selectedLanguage === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(isSelected ? "All" : lang)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition cursor-pointer ${
                      isSelected ? "border-bms-red bg-red-50 text-bms-red shadow-sm" : "border-gray-200 hover:border-bms-red text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <button
          onClick={() => setOpenGenres(!openGenres)}
          className="w-full p-4 flex items-center justify-between font-bold text-sm text-gray-800 bg-white border-b border-gray-100 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            Genres
            {selectedGenre !== "All" && (
              <span className="bg-bms-red text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">1</span>
            )}
          </span>
          {openGenres ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {openGenres && (
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center text-[11px] text-gray-400">
              <span>Select genre:</span>
              <button onClick={() => setSelectedGenre("All")} className="text-bms-red hover:underline font-semibold cursor-pointer">
                Clear
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {genres.map((g) => {
                const isSelected = selectedGenre === g;
                return (
                  <button
                    key={g}
                    onClick={() => setSelectedGenre(isSelected ? "All" : g)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition cursor-pointer ${
                      isSelected ? "border-bms-red bg-red-50 text-bms-red shadow-sm" : "border-gray-200 hover:border-bms-red text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <button
          onClick={() => setOpenFormats(!openFormats)}
          className="w-full p-4 flex items-center justify-between font-bold text-sm text-gray-800 bg-white border-b border-gray-100 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            Format
            {selectedFormat !== "All" && (
              <span className="bg-bms-red text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">1</span>
            )}
          </span>
          {openFormats ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {openFormats && (
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center text-[11px] text-gray-400">
              <span>Select format:</span>
              <button onClick={() => setSelectedFormat("All")} className="text-bms-red hover:underline font-semibold cursor-pointer">
                Clear
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formats.map((f) => {
                const isSelected = selectedFormat === f;
                return (
                  <button
                    key={f}
                    onClick={() => setSelectedFormat(isSelected ? "All" : f)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      isSelected
                        ? "border-bms-red bg-red-50 text-bms-red shadow-sm ring-2 ring-red-200"
                        : "border-gray-300 hover:border-bms-red text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="pt-2">
        <button className="w-full py-3 rounded-xl border-2 border-bms-red text-bms-red hover:bg-red-50 text-xs font-bold transition cursor-pointer">
          Browse by Cinemas
        </button>
      </div>
    </div>
  );
}
