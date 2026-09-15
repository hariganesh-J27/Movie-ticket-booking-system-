"use client";

import { useState } from "react";
import { X, Sparkles, Check } from "lucide-react";
import type { MovieLike, ShowLike } from "@/lib/types";

interface SeatCountModalProps {
  showtime: ShowLike;
  movie: MovieLike;
  onClose: () => void;
  onConfirmSeatCount: (count: number, category: string) => void;
}

export default function SeatCountModal({ showtime, movie, onClose, onConfirmSeatCount }: SeatCountModalProps) {
  const [seatCount, setSeatCount] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState("DIAMOND");

  const diamondPrice = showtime.price_prime || 200;
  const pearlPrice = showtime.price_classic || 59;
  const currentUnitPrice = selectedCategory === "DIAMOND" ? diamondPrice : pearlPrice;
  const totalEstimatedPrice = seatCount * currentUnitPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col p-6 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 pt-2">
          <h2 className="text-xl font-extrabold text-gray-900">How many seats?</h2>
          <p className="text-xs text-gray-500">
            {movie.title} • {showtime.show_time}
          </p>
        </div>

        <div className="flex justify-center my-1">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border-2 border-red-100 shadow-inner">
            <span className="text-4xl transform -scale-x-100">🛵</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap px-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              onClick={() => setSeatCount(num)}
              className={`w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center transition cursor-pointer ${
                seatCount === num ? "bg-bms-red text-white shadow-md scale-110" : "hover:bg-gray-100 text-gray-700 font-medium"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          <label className="block text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Select Ticket Category
          </label>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedCategory("DIAMOND")}
              className={`relative p-4 rounded-2xl border-2 transition cursor-pointer text-center flex flex-col items-center justify-center ${
                selectedCategory === "DIAMOND"
                  ? "border-bms-red bg-red-50/70 shadow-md ring-2 ring-red-200"
                  : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
              }`}
            >
              {selectedCategory === "DIAMOND" && (
                <div className="absolute top-2 right-2 bg-bms-red text-white p-0.5 rounded-full">
                  <Check className="w-3 h-3" />
                </div>
              )}
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">DIAMOND</div>
              <div className="text-xl font-black text-gray-900 mt-0.5">₹{diamondPrice}</div>
              <div className="text-[10px] text-emerald-600 font-extrabold tracking-wider mt-1">AVAILABLE</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory("PEARL")}
              className={`relative p-4 rounded-2xl border-2 transition cursor-pointer text-center flex flex-col items-center justify-center ${
                selectedCategory === "PEARL"
                  ? "border-bms-red bg-red-50/70 shadow-md ring-2 ring-red-200"
                  : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
              }`}
            >
              {selectedCategory === "PEARL" && (
                <div className="absolute top-2 right-2 bg-bms-red text-white p-0.5 rounded-full">
                  <Check className="w-3 h-3" />
                </div>
              )}
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">PEARL</div>
              <div className="text-xl font-black text-gray-900 mt-0.5">₹{pearlPrice}</div>
              <div className="text-[10px] text-emerald-600 font-extrabold tracking-wider mt-1">AVAILABLE</div>
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 text-center text-xs text-gray-600 font-medium flex items-center justify-between border border-gray-200 px-4">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>
              Category: <strong className="text-gray-900">{selectedCategory}</strong> ({seatCount} x ₹
              {currentUnitPrice})
            </span>
          </div>
          <div className="font-black text-sm text-bms-red">₹{totalEstimatedPrice}</div>
        </div>

        <button
          onClick={() => onConfirmSeatCount(seatCount, selectedCategory)}
          className="w-full bg-bms-red hover:bg-red-600 text-white font-bold py-3.5 rounded-2xl shadow-lg transition active:scale-95 text-base cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Select Seats • ₹{totalEstimatedPrice}</span>
        </button>
      </div>
    </div>
  );
}
