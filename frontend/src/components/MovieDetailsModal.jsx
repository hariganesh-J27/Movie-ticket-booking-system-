import React from 'react';
import { X, Star, Calendar, Clock, Globe, Ticket, Film, ShieldCheck } from 'lucide-react';

export default function MovieDetailsModal({ movie, onClose, onProceedToBooking }) {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 bg-black/60 hover:bg-black text-white rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Poster Image */}
        <div className="w-full md:w-72 bg-gray-900 relative flex-shrink-0">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-64 md:h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
        </div>

        {/* Right Info Details */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Title & Badge */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-bms-red text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                  UA 16+
                </span>
                <span className="text-xs text-gray-500 font-medium">Releasing in 2D, 3D, IMAX</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug">
                {movie.title}
              </h2>
            </div>

            {/* Rating Bar */}
            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <div className="flex items-center gap-1.5 font-bold text-amber-500 text-lg">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>{movie.rating ? `${movie.rating}/10` : '8.5/10'}</span>
              </div>
              <div className="h-6 w-px bg-gray-300" />
              <div className="text-xs text-gray-600">
                <span className="font-semibold text-gray-900">45.2K+</span> Ratings & Reviews
              </div>
            </div>

            {/* Tags & Meta */}
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-bms-red" />
                <span><strong>Languages:</strong> {movie.language}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-bms-red" />
                <span><strong>Duration:</strong> {movie.duration} Mins</span>
              </div>
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-bms-red" />
                <span><strong>Genre:</strong> {movie.genre}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-bms-red" />
                <span><strong>Release Date:</strong> {movie.release_date || '2024'}</span>
              </div>
            </div>

            {/* About Movie Description */}
            <div>
              <h4 className="font-bold text-sm text-gray-900 mb-1">About the Movie</h4>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {movie.description || 'An exciting blockbuster movie experience with state-of-the-art visuals and surround sound audio. Don\'t miss out on this theatrical release!'}
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Instant Confirmation</span>
            </div>

            <button
              onClick={() => onProceedToBooking(movie)}
              className="flex items-center gap-2 bg-bms-red hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg transition active:scale-95 cursor-pointer text-sm"
            >
              <Ticket className="w-4 h-4" />
              <span>Select Showtimes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
