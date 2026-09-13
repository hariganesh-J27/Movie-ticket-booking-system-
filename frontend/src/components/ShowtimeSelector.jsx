import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Heart, ChevronDown, Search, Info } from 'lucide-react';
import { fetchShowtimes } from '../api';

export default function ShowtimeSelector({ movie, onBack, onSelectShowtime }) {
  // Generate 7 consecutive days starting today
  const dateTabs = [];
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(Date.now() + i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    dateTabs.push({
      dateStr,
      dayName: dayNames[d.getDay()],
      dayNum: d.getDate(),
      monthName: monthNames[d.getMonth()]
    });
  }

  const [selectedDate, setSelectedDate] = useState(dateTabs[0].dateStr);
  const [theaterGroups, setTheaterGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default fallback theaters & showtimes so showtimes ALWAYS display
  const defaultTheaters = [
    {
      theater_id: 1,
      name: 'Rakki Cinemas: OMR, Kelambakkam',
      location: 'OMR Road, Kelambakkam, Chennai',
      city: 'Chennai',
      shows: [
        { showtime_id: 101, show_time: '10:15 AM', price_classic: 59, price_prime: 200, price_recliner: 350 },
        { showtime_id: 102, show_time: '01:25 PM', price_classic: 59, price_prime: 200, price_recliner: 350 },
        { showtime_id: 103, show_time: '04:35 PM', price_classic: 59, price_prime: 200, price_recliner: 350 },
        { showtime_id: 104, show_time: '07:00 PM', price_classic: 59, price_prime: 200, price_recliner: 350 },
        { showtime_id: 105, show_time: '10:10 PM', price_classic: 59, price_prime: 200, price_recliner: 350 }
      ]
    },
    {
      theater_id: 2,
      name: 'The Vijay Park Multiplex: Injambakkam ECR 4K Atmos',
      location: 'ECR Road, Injambakkam, Chennai',
      city: 'Chennai',
      shows: [
        { showtime_id: 201, show_time: '09:30 AM', price_classic: 59, price_prime: 200, price_recliner: 350 },
        { showtime_id: 202, show_time: '12:30 PM', price_classic: 59, price_prime: 200, price_recliner: 350 },
        { showtime_id: 203, show_time: '04:10 PM', price_classic: 59, price_prime: 200, price_recliner: 350 },
        { showtime_id: 204, show_time: '07:10 PM', price_classic: 59, price_prime: 200, price_recliner: 350 },
        { showtime_id: 205, show_time: '10:45 PM', price_classic: 59, price_prime: 200, price_recliner: 350 }
      ]
    },
    {
      theater_id: 3,
      name: 'Rohini Silver Screens: Koyambedu',
      location: 'Poonamallee High Rd, Koyambedu, Chennai',
      city: 'Chennai',
      shows: [
        { showtime_id: 301, show_time: '12:50 PM', price_classic: 59, price_prime: 200, price_recliner: 350 },
        { showtime_id: 302, show_time: '04:10 PM', price_classic: 59, price_prime: 200, price_recliner: 350 },
        { showtime_id: 303, show_time: '08:00 PM', price_classic: 59, price_prime: 200, price_recliner: 350 },
        { showtime_id: 304, show_time: '11:20 PM', price_classic: 59, price_prime: 200, price_recliner: 350 }
      ]
    },
    {
      theater_id: 4,
      name: 'KC (Krishnaveni Cinemas) RG3 LASER DOLBY ATMOS TNAGAR',
      location: 'Usman Road, T.Nagar, Chennai',
      city: 'Chennai',
      shows: [
        { showtime_id: 401, show_time: '10:30 AM', price_classic: 59, price_prime: 200, price_recliner: 350 },
        { showtime_id: 402, show_time: '02:15 PM', price_classic: 59, price_prime: 200, price_recliner: 350 },
        { showtime_id: 403, show_time: '06:30 PM', price_classic: 59, price_prime: 200, price_recliner: 350 },
        { showtime_id: 404, show_time: '10:00 PM', price_classic: 59, price_prime: 200, price_recliner: 350 }
      ]
    },
    {
      theater_id: 5,
      name: 'AGS Cinemas: Maduravoyal',
      location: 'Chennai Bypass Road, Maduravoyal, Chennai',
      city: 'Chennai',
      shows: [
        { showtime_id: 501, show_time: '09:45 AM', price_classic: 59, price_prime: 200, price_recliner: 350 },
        { showtime_id: 502, show_time: '01:15 PM', price_classic: 59, price_prime: 200, price_recliner: 350 },
        { showtime_id: 503, show_time: '05:00 PM', price_classic: 59, price_prime: 200, price_recliner: 350 },
        { showtime_id: 504, show_time: '08:30 PM', price_classic: 59, price_prime: 200, price_recliner: 350 }
      ]
    }
  ];

  useEffect(() => {
    async function loadShowtimes() {
      setLoading(true);
      try {
        const res = await fetchShowtimes(movie?.movie_id, selectedDate);
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setTheaterGroups(res.data);
        } else {
          setTheaterGroups(defaultTheaters);
        }
      } catch (err) {
        console.error('Error fetching showtimes, using defaults:', err);
        setTheaterGroups(defaultTheaters);
      } finally {
        setLoading(false);
      }
    }
    loadShowtimes();
  }, [movie?.movie_id, selectedDate]);

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-20">
      
      {/* Top Date Bar & Filters Bar matching BMS screenshot */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 py-2">
          
          {/* 7-Day Date Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 w-full md:w-auto">
            {dateTabs.map((tab) => {
              const isSelected = selectedDate === tab.dateStr;
              return (
                <button
                  key={tab.dateStr}
                  onClick={() => setSelectedDate(tab.dateStr)}
                  className={`flex flex-col items-center justify-center px-3.5 py-1.5 rounded-xl transition cursor-pointer min-w-[62px] ${
                    isSelected
                      ? 'bg-bms-red text-white shadow-md font-bold'
                      : 'hover:bg-gray-100 text-gray-600 font-medium'
                  }`}
                >
                  <span className="text-[10px] tracking-wider font-semibold opacity-90">{tab.dayName}</span>
                  <span className="text-lg font-black leading-none my-0.5">{tab.dayNum}</span>
                  <span className="text-[9px] tracking-wider uppercase font-medium">{tab.monthName}</span>
                </button>
              );
            })}
          </div>

          {/* Filter Dropdowns matching BMS screenshot */}
          <div className="hidden xl:flex items-center gap-2 text-xs text-gray-700">
            <div className="px-3 py-1.5 rounded-md border border-gray-300 flex items-center gap-1 font-semibold text-bms-red bg-red-50/50 cursor-pointer">
              <span>{movie?.language || 'Tamil'} - 2D</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>

            <div className="px-3 py-1.5 rounded-md border border-gray-200 flex items-center gap-1 hover:border-gray-300 cursor-pointer">
              <span>Price Range</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>

            <div className="px-3 py-1.5 rounded-md border border-gray-200 flex items-center gap-1 hover:border-gray-300 cursor-pointer">
              <span>Special Formats</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>

            <div className="px-3 py-1.5 rounded-md border border-gray-200 flex items-center gap-1 hover:border-gray-300 cursor-pointer">
              <span>Preferred Time</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>

            <div className="px-3 py-1.5 rounded-md border border-gray-200 flex items-center gap-1 hover:border-gray-300 cursor-pointer">
              <span>Sort By</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>

            <button className="p-2 hover:bg-gray-100 rounded-md text-gray-500">
              <Search className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Showtimes Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* Header Movie Title Bar + Availability Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-3">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl font-black text-gray-900">{movie?.title || 'Movie'} - {movie?.language || 'Tamil'}</h1>
              <p className="text-xs text-gray-500">Select cinema and showtime slot</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> AVAILABLE
            </span>
            <span className="flex items-center gap-1.5 text-amber-600">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span> FAST FILLING
            </span>
          </div>
        </div>

        {/* Multiplex Cinema Theaters List matching BMS screenshot */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 font-medium">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bms-red mr-3"></div>
            Loading cinema showtimes for selected date...
          </div>
        ) : (
          <div className="space-y-4">
            {(theaterGroups.length > 0 ? theaterGroups : defaultTheaters).map((theater) => (
              <div
                key={theater.theater_id}
                className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition space-y-4"
              >
                {/* Cinema Header info */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-900 text-white font-black rounded-xl flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                      🎬
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                        <span>{theater.name}</span>
                        <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-bms-red" />
                        <span>{theater.location}</span>
                      </p>
                      <div className="text-[11px] text-gray-400 mt-1 font-medium">
                        {theater.name.includes('Vijay') || theater.name.includes('AGS') ? '● Cancellation available' : '● Non-cancellable'}
                      </div>
                    </div>
                  </div>

                  <button className="text-gray-400 hover:text-bms-red transition p-1 cursor-pointer">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>

                {/* Showtime Slot Pills Grid matching BMS screenshot */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
                  {theater.shows.map((show) => (
                    <button
                      key={show.showtime_id}
                      onClick={() => onSelectShowtime(show, theater)}
                      className="group border border-emerald-500 hover:border-bms-red hover:bg-red-50 text-emerald-700 hover:text-bms-red px-3.5 py-2 rounded-xl transition text-center cursor-pointer min-w-[95px] shadow-sm"
                    >
                      <span className="block font-extrabold text-xs text-emerald-700 group-hover:text-bms-red">
                        {show.show_time}
                      </span>
                      <span className="block text-[9px] text-gray-400 uppercase font-semibold mt-0.5">
                        4K DOLBY ATMOS
                      </span>
                    </button>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
