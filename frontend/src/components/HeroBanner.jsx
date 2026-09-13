import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Play, Ticket } from 'lucide-react';

export default function HeroBanner({ movies, onSelectMovie }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const heroMovies = movies.slice(0, 4);

  useEffect(() => {
    if (heroMovies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  if (heroMovies.length === 0) return null;

  const current = heroMovies[currentIndex];

  return (
    <div className="relative bg-bms-darker text-white overflow-hidden shadow-xl mb-8">
      {/* Background Blur Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-20 transform scale-110"
        style={{ backgroundImage: `url(${current.banner_url || current.poster_url})` }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center gap-8 z-10">
        
        {/* Left Info Column */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-bms-red/20 text-bms-red border border-bms-red/30 rounded-full text-xs font-semibold uppercase tracking-wider">
            <span>Now Showing</span>
            <span>•</span>
            <span>3D / IMAX 3D</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {current.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-gray-300">
            <div className="flex items-center gap-1 text-amber-400 font-bold bg-gray-800/80 px-2.5 py-1 rounded">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{current.rating} / 10</span>
            </div>
            <span>•</span>
            <span className="bg-gray-800/80 px-2.5 py-1 rounded">{current.language}</span>
            <span>•</span>
            <span>{current.genre}</span>
            <span>•</span>
            <span>{current.duration} mins</span>
          </div>

          <p className="text-gray-300 text-sm md:text-base max-w-2xl line-clamp-3 leading-relaxed">
            {current.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
            <button
              onClick={() => onSelectMovie(current)}
              className="flex items-center gap-2 bg-bms-red hover:bg-red-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-red-500/25 transition transform active:scale-95 cursor-pointer text-sm md:text-base"
            >
              <Ticket className="w-5 h-5" />
              <span>Book Tickets</span>
            </button>

            <button 
              onClick={() => onSelectMovie(current)}
              className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700 text-gray-200 border border-gray-700 font-medium px-5 py-3 rounded-lg transition text-sm md:text-base cursor-pointer"
            >
              <Play className="w-4 h-4 text-bms-red fill-bms-red" />
              <span>View Details</span>
            </button>
          </div>
        </div>

        {/* Right Poster Display */}
        <div className="relative group w-48 md:w-64 flex-shrink-0 shadow-2xl rounded-xl overflow-hidden border-2 border-gray-700/50">
          <img
            src={current.poster_url}
            alt={current.title}
            className="w-full h-72 md:h-96 object-cover transform group-hover:scale-105 transition duration-500"
          />
        </div>
      </div>

      {/* Carousel Navigation Arrows */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-bms-red p-2 rounded-full text-white transition z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % heroMovies.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-bms-red p-2 rounded-full text-white transition z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Carousel Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {heroMovies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              currentIndex === idx ? 'w-8 bg-bms-red' : 'w-2 bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
