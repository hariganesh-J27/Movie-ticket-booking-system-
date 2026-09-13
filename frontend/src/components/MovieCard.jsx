import React from 'react';
import { Star, Ticket, Trash2 } from 'lucide-react';

export default function MovieCard({ movie, onSelect, onDelete }) {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-200">
      
      {/* Poster image container */}
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-900 cursor-pointer" onClick={() => onSelect(movie)}>
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Rating Badge */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 font-bold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{movie.rating ? `${movie.rating}/10` : 'New'}</span>
          </div>
          <span className="text-gray-300 font-medium bg-black/60 px-1.5 py-0.5 rounded text-[11px]">
            {movie.language}
          </span>
        </div>

        {/* Format Tag */}
        <div className="absolute top-2 left-2 bg-bms-red text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
          2D / 3D
        </div>

        {/* Quick Delete Option for SQL Demo */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(movie.movie_id, movie.title);
            }}
            title="Delete Movie (Runs SQL Delete)"
            className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Card Info Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h3 
            onClick={() => onSelect(movie)}
            className="font-bold text-base text-gray-900 group-hover:text-bms-red transition line-clamp-1 cursor-pointer"
          >
            {movie.title}
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">{movie.genre}</p>
        </div>

        <button
          onClick={() => onSelect(movie)}
          className="w-full mt-2 flex items-center justify-center gap-1.5 bg-bms-red hover:bg-red-600 text-white text-xs font-bold py-2 rounded-lg transition active:scale-95 cursor-pointer shadow-sm"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Book Tickets</span>
        </button>
      </div>
    </div>
  );
}
