import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Info, ShieldCheck, Ticket, AlertCircle } from 'lucide-react';
import { fetchSeats } from '../api';

export default function SeatPicker({
  movie = { title: 'Theri', language: 'Tamil / Hindi' },
  showtime = { showtime_id: 1, show_date: '2026-09-11', show_time: '07:15 PM', price_prime: 200, price_classic: 59, price_recliner: 350 },
  theater = { name: 'PVR: Forum Mall, Koramangala' },
  targetSeatCount = 5,
  targetCategory = 'DIAMOND',
  onBack = () => {},
  onProceedToCheckout = () => {}
}) {
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryWarning, setCategoryWarning] = useState('');
  const [activeCategory, setActiveCategory] = useState(targetCategory || 'DIAMOND');

  // Bulletproof fallback seat layout generator matching BookMyShow (DIAMOND ₹200, PEARL ₹59)
  const generateFallbackSeats = (stId) => {
    const generated = [];
    let idCounter = 1000;
    const safeShowtimeId = stId || 1;

    const rows = [
      { prefix: 'A', cat: 'DIAMOND', count: 12 },
      { prefix: 'B', cat: 'DIAMOND', count: 12 },
      { prefix: 'C', cat: 'DIAMOND', count: 12 },
      { prefix: 'D', cat: 'DIAMOND', count: 12 },
      { prefix: 'E', cat: 'DIAMOND', count: 12 },
      { prefix: 'M', cat: 'PEARL', count: 10 },
      { prefix: 'N', cat: 'PEARL', count: 10 }
    ];

    for (const r of rows) {
      for (let i = 1; i <= r.count; i++) {
        idCounter++;
        const seatNum = `${r.prefix}${i < 10 ? '0' + i : i}`;
        // Pre-book a few seats for realistic look
        const isBooked = (i === 4 || i === 5) && (r.prefix === 'A' || r.prefix === 'M') ? 1 : 0;
        generated.push({
          seat_id: idCounter,
          showtime_id: safeShowtimeId,
          seat_number: seatNum,
          seat_category: r.cat,
          is_booked: isBooked
        });
      }
    }
    return generated;
  };

  useEffect(() => {
    async function loadSeats() {
      setLoading(true);
      const safeShowtimeId = showtime?.showtime_id || 1;

      try {
        let loadedSeats = [];
        const res = await fetchSeats(safeShowtimeId);
        
        if (res && res.success && Array.isArray(res.seats) && res.seats.length > 0) {
          loadedSeats = res.seats;
        } else {
          loadedSeats = generateFallbackSeats(safeShowtimeId);
        }

        setSeats(loadedSeats);

        // Auto-select initial available seats matching activeCategory
        const targetCatUpper = (activeCategory || 'DIAMOND').toUpperCase();
        let categoryAvailable = loadedSeats.filter(
          s => s.is_booked === 0 && (s.seat_category === targetCatUpper || (targetCatUpper === 'DIAMOND' && s.seat_category === 'PRIME') || (targetCatUpper === 'PEARL' && s.seat_category === 'CLASSIC'))
        );
        
        if (categoryAvailable.length < targetSeatCount) {
          categoryAvailable = loadedSeats.filter(s => s.is_booked === 0);
        }

        const countToTake = Math.min(targetSeatCount || 1, categoryAvailable.length);
        if (countToTake > 0) {
          setSelectedSeatIds(categoryAvailable.slice(0, countToTake).map(s => s.seat_id));
        }
      } catch (err) {
        console.error('Error loading seats:', err);
        const fallback = generateFallbackSeats(safeShowtimeId);
        setSeats(fallback);
        setSelectedSeatIds(fallback.slice(0, targetSeatCount || 1).map(s => s.seat_id));
      } finally {
        setLoading(false);
      }
    }

    loadSeats();
  }, [showtime?.showtime_id, targetSeatCount, targetCategory]);

  const toggleSeatSelection = (seat) => {
    if (!seat || seat.is_booked === 1) return;

    setCategoryWarning('');
    const seatCat = (seat.seat_category === 'PRIME' ? 'DIAMOND' : seat.seat_category === 'CLASSIC' ? 'PEARL' : seat.seat_category || 'DIAMOND').toUpperCase();

    // Check if user is clicking a seat outside their preferred category
    if (seatCat !== activeCategory) {
      setCategoryWarning(`Notice: Your chosen preference was ${activeCategory}. You clicked a ${seatCat} seat.`);
      
      const switchConfirm = window.confirm(
        `Your chosen preference was ${activeCategory}. Do you want to switch your category selection to ${seatCat}?`
      );

      if (switchConfirm) {
        setActiveCategory(seatCat);
        setSelectedSeatIds([seat.seat_id]);
        setCategoryWarning(`Category switched to ${seatCat}.`);
      }
      return;
    }

    if (selectedSeatIds.includes(seat.seat_id)) {
      setSelectedSeatIds(selectedSeatIds.filter(id => id !== seat.seat_id));
    } else {
      if (selectedSeatIds.length >= 10) {
        alert('Maximum 10 seats allowed per booking.');
        return;
      }
      setSelectedSeatIds([...selectedSeatIds, seat.seat_id]);
    }
  };

  const selectedSeatsList = seats.filter(s => s && selectedSeatIds.includes(s.seat_id));
  
  const totalPrice = selectedSeatsList.reduce((sum, seat) => {
    if (seat.seat_category === 'RECLINER') return sum + (showtime?.price_recliner || 350);
    if (seat.seat_category === 'DIAMOND' || seat.seat_category === 'PRIME') return sum + (showtime?.price_prime || 200);
    return sum + (showtime?.price_classic || 59);
  }, 0);

  const diamondSeats = seats.filter(s => s && (s.seat_category === 'DIAMOND' || s.seat_category === 'PRIME'));
  const pearlSeats = seats.filter(s => s && (s.seat_category === 'PEARL' || s.seat_category === 'CLASSIC'));

  const renderSeatGrid = (seatArray, categoryName) => {
    if (!Array.isArray(seatArray) || seatArray.length === 0) return null;

    const rows = {};
    seatArray.forEach(s => {
      if (!s) return;
      const rowLetter = s.seat_number ? s.seat_number.charAt(0) : 'A';
      if (!rows[rowLetter]) rows[rowLetter] = [];
      rows[rowLetter].push(s);
    });

    const isCurrentActiveCat = activeCategory === categoryName;

    return Object.keys(rows).map(rowLetter => (
      <div key={rowLetter} className="flex items-center justify-center gap-3 my-1.5">
        <span className="w-6 font-bold text-xs text-gray-400 text-center">{rowLetter}</span>
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {rows[rowLetter].map((seat) => {
            if (!seat) return null;
            const isSelected = selectedSeatIds.includes(seat.seat_id);
            const isBooked = seat.is_booked === 1;

            return (
              <button
                key={seat.seat_id}
                disabled={isBooked}
                onClick={() => toggleSeatSelection(seat)}
                title={
                  isBooked 
                    ? `Seat ${seat.seat_number} - SOLD OUT` 
                    : `Seat ${seat.seat_number} (${categoryName})`
                }
                className={`w-7 h-7 md:w-8 md:h-8 rounded-md font-semibold text-[11px] flex items-center justify-center transition cursor-pointer ${
                  isBooked
                    ? 'bg-gray-200 text-gray-400 border border-gray-300 opacity-50 cursor-not-allowed filter blur-[0.3px]'
                    : isSelected
                    ? 'bg-emerald-600 text-white border-2 border-emerald-700 font-bold shadow-md scale-105'
                    : isCurrentActiveCat
                    ? 'bg-white hover:bg-emerald-50 text-emerald-600 border border-emerald-500'
                    : 'bg-white hover:bg-amber-50 text-gray-600 border border-gray-300 opacity-90'
                }`}
              >
                {seat.seat_number ? seat.seat_number.slice(1) : ''}
              </button>
            );
          })}
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 pb-32">
      
      {/* Top Header Bar matching BMS screenshot */}
      <div className="bg-white p-4 border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h2 className="font-bold text-base text-gray-900 leading-tight">
                {movie?.title || 'Movie'} - {movie?.language || 'Tamil'}
              </h2>
              <p className="text-xs text-gray-500">
                {theater?.name || 'PVR: Forum Mall, Koramangala'} | {showtime?.show_date || '2026-09-11'} | {showtime?.show_time || '07:15 PM'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="border border-bms-red text-bms-red font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
              ✏️ {selectedSeatIds.length} Tickets ({activeCategory})
            </div>
          </div>
        </div>
      </div>

      {/* Preference Warning Banner */}
      {categoryWarning && (
        <div className="bg-amber-500 text-white py-2.5 px-4 text-center text-xs font-bold shadow-md flex items-center justify-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-white" />
          <span>{categoryWarning}</span>
        </div>
      )}

      {/* Showtime Switcher Pills */}
      <div className="bg-gray-50 py-2 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-3">
          <button className="px-4 py-1 bg-emerald-600 text-white rounded text-xs font-bold shadow">
            {showtime?.show_time || '07:15 PM'}
          </button>
        </div>
      </div>

      {/* Main Seat Layout */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 font-medium">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bms-red mr-3"></div>
            Loading real-time seat layout...
          </div>
        ) : (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
            
            {/* 1. DIAMOND CATEGORY */}
            {diamondSeats.length > 0 && (
              <div className={`p-4 rounded-xl transition ${
                activeCategory === 'DIAMOND' 
                  ? 'ring-2 ring-emerald-500/50 bg-emerald-50/20' 
                  : 'bg-gray-50/50 opacity-80'
              }`}>
                <div className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-2 mb-4 flex items-center justify-center gap-2">
                  <span>₹{showtime?.price_prime || 200} DIAMOND</span>
                  {activeCategory === 'DIAMOND' && (
                    <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase shadow-sm">
                      SELECTED CATEGORY
                    </span>
                  )}
                </div>
                {renderSeatGrid(diamondSeats, 'DIAMOND')}
              </div>
            )}

            {/* 2. PEARL CATEGORY */}
            {pearlSeats.length > 0 && (
              <div className={`p-4 rounded-xl transition ${
                activeCategory === 'PEARL' 
                  ? 'ring-2 ring-emerald-500/50 bg-emerald-50/20' 
                  : 'bg-gray-50/50 opacity-80'
              }`}>
                <div className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-2 mb-4 flex items-center justify-center gap-2">
                  <span>₹{showtime?.price_classic || 59} PEARL</span>
                  {activeCategory === 'PEARL' && (
                    <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase shadow-sm">
                      SELECTED CATEGORY
                    </span>
                  )}
                </div>
                {renderSeatGrid(pearlSeats, 'PEARL')}
              </div>
            )}

            {/* Curved Cinema Screen */}
            <div className="pt-8 text-center">
              <div className="w-3/4 mx-auto h-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 curved-screen rounded-t-full mb-2 opacity-90 shadow-md" />
              <p className="text-[11px] text-gray-400 font-semibold tracking-widest uppercase">
                All Eyes This Way Please (SCREEN 1)
              </p>
            </div>

            {/* Seat Status Legend */}
            <div className="flex items-center justify-center gap-6 pt-6 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-white border border-emerald-500"></span>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-gray-200 opacity-60"></span>
                <span>Sold (Booked/Blurred)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-emerald-600"></span>
                <span>Selected</span>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Floating Bottom Bar matching screenshot */}
      {selectedSeatIds.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-40 animate-slideUp">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-gray-500">
                Seats: <strong className="text-gray-900">{selectedSeatsList.map(s => s.seat_number).join(', ')}</strong> ({activeCategory})
              </div>
              <div className="text-xl font-extrabold text-gray-900">
                Pay ₹{totalPrice.toFixed(2)}
              </div>
            </div>

            <button
              onClick={() => onProceedToCheckout({
                selectedSeats: selectedSeatsList,
                totalPrice
              })}
              className="flex items-center gap-2 bg-bms-red hover:bg-red-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition active:scale-95 cursor-pointer text-sm"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Tickets Now</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
