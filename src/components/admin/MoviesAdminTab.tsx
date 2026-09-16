"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { fetchMovies, createMovie, deleteMovie, type Movie } from "@/lib/api";
import { updateMovie } from "@/lib/adminApi";

const EMPTY_FORM = {
  title: "",
  genre: "",
  duration: "150",
  rating: "8.0",
  language: "English",
  description: "",
  poster_url: "",
  banner_url: "",
  release_date: "",
};

export default function MoviesAdminTab() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchMovies();
      if (res.success && res.data) setMovies(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
  }, [load]);

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (movie: Movie) => {
    setEditingId(movie.movie_id);
    setForm({
      title: movie.title,
      genre: movie.genre,
      duration: String(movie.duration),
      rating: String(movie.rating ?? ""),
      language: movie.language,
      description: movie.description ?? "",
      poster_url: movie.poster_url ?? "",
      banner_url: movie.banner_url ?? "",
      release_date: movie.release_date ?? "",
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.genre || !form.duration) {
      setError("Title, genre, and duration are required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title,
        genre: form.genre,
        duration: Number(form.duration),
        rating: Number(form.rating),
        language: form.language,
        description: form.description,
        poster_url: form.poster_url,
        banner_url: form.banner_url,
        release_date: form.release_date,
      };

      const res = editingId ? await updateMovie(editingId, payload) : await createMovie(payload);

      if (res.success) {
        setShowForm(false);
        load();
      } else {
        setError(res.error || res.message || "Failed to save movie");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (movie: Movie) => {
    if (!window.confirm(`Delete "${movie.title}"? This cannot be undone.`)) return;
    const res = await deleteMovie(movie.movie_id);
    if (res.success) {
      load();
    } else {
      alert(res.message || "Failed to delete movie");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Movies ({movies.length})</h2>
        <button
          onClick={openAddForm}
          className="flex items-center gap-1.5 bg-bms-red hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Movie</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 text-xs relative">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="font-bold text-sm text-gray-900">{editingId ? "Edit Movie" : "Add Movie"}</h3>

          {error && <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Genre *</label>
              <input
                required
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Duration (mins) *</label>
              <input
                required
                type="number"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Rating</label>
              <input
                type="number"
                step="0.1"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Language</label>
              <input
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Release Date</label>
              <input
                type="date"
                value={form.release_date}
                onChange={(e) => setForm({ ...form, release_date: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Poster URL</label>
              <input
                value={form.poster_url}
                onChange={(e) => setForm({ ...form, poster_url: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Banner URL</label>
              <input
                value={form.banner_url}
                onChange={(e) => setForm({ ...form, banner_url: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-lg transition cursor-pointer disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Save Changes" : "Create Movie"}
          </button>
        </form>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-xs">Loading movies...</div>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px]">
              <tr>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Genre</th>
                <th className="text-left p-3">Language</th>
                <th className="text-left p-3">Duration</th>
                <th className="text-left p-3">Rating</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((m) => (
                <tr key={m.movie_id} className="border-t border-gray-100">
                  <td className="p-3 font-semibold text-gray-900">{m.title}</td>
                  <td className="p-3 text-gray-600">{m.genre}</td>
                  <td className="p-3 text-gray-600">{m.language}</td>
                  <td className="p-3 text-gray-600">{m.duration} min</td>
                  <td className="p-3 text-gray-600">{m.rating ?? "-"}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditForm(m)}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(m)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
