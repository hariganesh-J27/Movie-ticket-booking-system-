import React from 'react';
import { Search, MapPin, Ticket, Film, ChevronDown, PlusCircle } from 'lucide-react';

export default function Navbar({ 
  searchQuery, 
  setSearchQuery, 
  selectedCity, 
  onOpenCitySelector, 
  onOpenMyBookings, 
  onOpenAddMovie,
  onResetHome
}) {
  return (
    <header className="sticky top-0 z-40 bg-bms-darker text-white shadow-md">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={onResetHome}
            className="flex items-center gap-2 font-black text-2xl tracking-wider text-white hover:opacity-90 transition cursor-pointer"
          >
            <span className="bg-bms-red text-white p-1.5 rounded-lg flex items-center justify-center">
              <Film className="w-6 h-6" />
            </span>
            <span>book<span className="text-bms-red">my</span>seat</span>
          </button>

          {/* Search Bar */}
          <div className="relative w-80 lg:w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for Movies, Events, Plays, Sports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2B3141] text-sm text-gray-200 pl-9 pr-4 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-bms-red border border-transparent"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* City Selector */}
          <button 
            onClick={onOpenCitySelector}
            className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-gray-300 hover:text-white px-3 py-1.5 rounded bg-[#2B3141] hover:bg-[#363D50] border border-gray-700 transition cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-bms-red" />
            <span>{selectedCity}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {/* User Bookings button */}
          <button
            onClick={onOpenMyBookings}
            className="flex items-center gap-1.5 text-xs md:text-sm bg-bms-red hover:bg-red-600 text-white px-4 py-1.5 rounded-md transition font-semibold shadow-md cursor-pointer"
          >
            <Ticket className="w-4 h-4" />
            <span>My Bookings</span>
          </button>

          {/* Add Movie */}
          <button
            onClick={onOpenAddMovie}
            className="flex items-center gap-1.5 text-xs md:text-sm bg-[#2B3141] hover:bg-[#363D50] text-gray-200 px-3 py-1.5 rounded-md transition font-medium border border-gray-700 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Add Movie</span>
          </button>

        </div>
      </div>

      {/* Sub Navbar */}
      <div className="bg-[#222539] border-t border-gray-800 text-xs md:text-sm text-gray-300">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-2 overflow-x-auto">
          <div className="flex items-center gap-6 font-medium whitespace-nowrap">
            <button onClick={onResetHome} className="text-white font-bold hover:text-bms-red">Movies</button>
            <span className="hover:text-white cursor-pointer opacity-70">Stream</span>
            <span className="hover:text-white cursor-pointer opacity-70">Events</span>
            <span className="hover:text-white cursor-pointer opacity-70">Plays</span>
            <span className="hover:text-white cursor-pointer opacity-70">Sports</span>
            <span className="hover:text-white cursor-pointer opacity-70">Activities</span>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs text-gray-400">
            <span>ListYourShow</span>
            <span>Corporates</span>
            <span>Offers</span>
            <span>Gift Cards</span>
          </div>
        </div>
      </div>
    </header>
  );
}
