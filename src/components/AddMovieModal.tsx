"use client";

import { useState } from "react";
import { X, PlusCircle, Film } from "lucide-react";
import { createMovie } from "@/lib/api";

interface AddMovieModalProps {
  onClose: () => void;
  onMovieAdded: () => void;
}

export default function AddMovieModal({ onClose, onMovieAdded }: AddMovieModalProps) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("Action");
  const [duration, setDuration] = useState("150");
  const [rating, setRating] = useState("8.5");
  const [language, setLanguage] = useState("Hindi");
  const [description, setDescription] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [bannerUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !genre || !duration) {
      setError("Please fill required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await createMovie({
        title,
        genre,
        duration: Number(duration),
        rating: Number(rating),
        language,
        description,
        poster_url:
          posterUrl ||
          "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
        banner_url:
          bannerUrl ||
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
      });

      if (res.success) {
        onMovieAdded();
        onClose();
      } else {
        setError(res.error || "Failed to add movie");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-bms-darker text-white p-4 flex items-center justify-between">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Film className="w-5 h-5 text-emerald-400" />
            <span>Add New Movie</span>
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium">{error}</div>
          )}

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Movie Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Pushpa 2: The Rule"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Genre *</label>
              <input
                type="text"
                required
                placeholder="e.g., Action / Drama"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Language</label>
              <input
                type="text"
                placeholder="e.g., Hindi, English, Telugu"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Duration (mins) *</label>
              <input
                type="number"
                required
                placeholder="150"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Rating (out of 10)</label>
              <input
                type="number"
                step="0.1"
                placeholder="8.5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Poster Image URL (Unsplash/Web link)</label>
            <input
              type="url"
              placeholder="https://..."
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Movie Synopsis</label>
            <textarea
              rows={3}
              placeholder="Brief description of the movie plot..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{loading ? "Adding Movie..." : "Add Movie"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
