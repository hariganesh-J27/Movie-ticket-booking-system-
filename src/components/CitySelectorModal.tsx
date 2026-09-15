"use client";

import { useState } from "react";
import { X, Search, Navigation } from "lucide-react";

interface CitySelectorModalProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onClose: () => void;
  isInitialPopup?: boolean;
}

export default function CitySelectorModal({
  selectedCity,
  onSelectCity,
  onClose,
  isInitialPopup,
}: CitySelectorModalProps) {
  const [search, setSearch] = useState("");

  const popularCities = [
    { name: "Mumbai", icon: "🏙️" },
    { name: "Delhi-NCR", icon: "🏛️" },
    { name: "Bengaluru", icon: "💻" },
    { name: "Hyderabad", icon: "🕌" },
    { name: "Chandigarh", icon: "🌳" },
    { name: "Ahmedabad", icon: "🏰" },
    { name: "Pune", icon: "🎓" },
    { name: "Chennai", icon: "🏖️" },
    { name: "Kolkata", icon: "🌉" },
    { name: "Kochi", icon: "🌴" },
  ];

  const filteredCities = popularCities.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {!isInitialPopup && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="p-6 pb-4 border-b border-gray-100 space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for your city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none py-1"
              autoFocus
            />
          </div>

          <button
            onClick={() => {
              onSelectCity("Mumbai");
              onClose();
            }}
            className="flex items-center gap-2 text-xs font-semibold text-bms-red hover:opacity-80 transition cursor-pointer"
          >
            <Navigation className="w-4 h-4 fill-bms-red text-bms-red" />
            <span>Detect my location</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 max-h-[70vh]">
          <h4 className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Popular Cities
          </h4>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 pt-2">
            {filteredCities.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  onSelectCity(c.name);
                  onClose();
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition group cursor-pointer ${
                  selectedCity === c.name
                    ? "border-bms-red bg-red-50/60 shadow-sm"
                    : "border-gray-200 hover:border-bms-red hover:bg-red-50/20"
                }`}
              >
                <span className="text-3xl mb-1.5 transform group-hover:scale-110 transition duration-200">
                  {c.icon}
                </span>
                <span className={`text-xs font-medium ${selectedCity === c.name ? "font-bold text-bms-red" : "text-gray-700"}`}>
                  {c.name}
                </span>
              </button>
            ))}
          </div>

          <div className="text-center pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                onSelectCity("Mumbai");
                onClose();
              }}
              className="text-xs font-bold text-bms-red hover:underline cursor-pointer"
            >
              View All Cities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
