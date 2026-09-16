"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { fetchMovies, type Movie } from "@/lib/api";
import {
  fetchAdminTheaters,
  fetchAdminShowtimes,
  createShowtime,
  updateShowtime,
  deleteShowtime,
  type AdminTheater,
  type AdminShowtime,
} from "@/lib/adminApi";

const EMPTY_FORM = {
  movie_id: "",
  theater_id: "",
  show_date: "",
  show_time: "",
  price_classic: "59",
  price_prime: "200",
  price_recliner: "350",
};

export default function ShowtimesAdminTab() {
  const [showtimes, setShowtimes] = useState<AdminShowtime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<AdminTheater[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [stRes, movieRes, theaterRes] = await Promise.all([
        fetchAdminShowtimes(),
        fetchMovies(),
        fetchAdminTheaters(),
      ]);
      if (stRes.success && stRes.data) setShowtimes(stRes.data);
      if (movieRes.success && movieRes.data) setMovies(movieRes.data);
      if (theaterRes.success && theaterRes.data) setTheaters(theaterRes.data);
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
    setForm({
      ...EMPTY_FORM,
      movie_id: movies[0] ? String(movies[0].movie_id) : "",
      theater_id: theaters[0] ? String(theaters[0].theater_id) : "",
    });
    setError("");
    setShowForm(true);
  };

  const openEditForm = (st: AdminShowtime) => {
    setEditingId(st.showtime_id);
    setForm({
      movie_id: String(st.movie_id),
      theater_id: String(st.theater_id),
      show_date: st.show_date,
      show_time: st.show_time,
      price_classic: String(st.price_classic),
      price_prime: String(st.price_prime),
      price_recliner: String(st.price_recliner),
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.movie_id || !form.theater_id || !form.show_date || !form.show_time) {
      setError("Movie, theater, date, and time are required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const priceData = {
        price_classic: Number(form.price_classic),
        price_prime: Number(form.price_prime),
        price_recliner: Number(form.price_recliner),
      };

      const res = editingId
        ? await updateShowtime(editingId, { show_date: form.show_date, show_time: form.show_time, ...priceData })
        : await createShowtime({
            movie_id: Number(form.movie_id),
            theater_id: Number(form.theater_id),
            show_date: form.show_date,
            show_time: form.show_time,
            ...priceData,
          });

      if (res.success) {
        setShowForm(false);
        load();
      } else {
        setError(res.error || res.message || "Failed to save showtime");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (st: AdminShowtime) => {
    if (!window.confirm(`Delete showtime for "${st.movie_title}" at ${st.show_time} on ${st.show_date}?`)) return;
    const res = await deleteShowtime(st.showtime_id);
    if (res.success) {
      load();
    } else {
      alert(res.message || "Failed to delete showtime");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Showtimes ({showtimes.length})</h2>
        <button
          onClick={openAddForm}
          disabled={movies.length === 0 || theaters.length === 0}
          className="flex items-center gap-1.5 bg-bms-red hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Add Showtime</span>
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
          <h3 className="font-bold text-sm text-gray-900">{editingId ? "Edit Showtime" : "Add Showtime"}</h3>

          {error && <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Movie *</label>
              <select
                required
                disabled={!!editingId}
                value={form.movie_id}
                onChange={(e) => setForm({ ...form, movie_id: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none disabled:opacity-60"
              >
                {movies.map((m) => (
                  <option key={m.movie_id} value={m.movie_id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Theater *</label>
              <select
                required
                disabled={!!editingId}
                value={form.theater_id}
                onChange={(e) => setForm({ ...form, theater_id: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none disabled:opacity-60"
              >
                {theaters.map((t) => (
                  <option key={t.theater_id} value={t.theater_id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Show Date *</label>
              <input
                required
                type="date"
                value={form.show_date}
                onChange={(e) => setForm({ ...form, show_date: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Show Time *</label>
              <input
                required
                placeholder="e.g. 07:00 PM"
                value={form.show_time}
                onChange={(e) => setForm({ ...form, show_time: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">PEARL Price</label>
              <input
                type="number"
                value={form.price_classic}
                onChange={(e) => setForm({ ...form, price_classic: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">DIAMOND Price</label>
              <input
                type="number"
                value={form.price_prime}
                onChange={(e) => setForm({ ...form, price_prime: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">RECLINER Price</label>
              <input
                type="number"
                value={form.price_recliner}
                onChange={(e) => setForm({ ...form, price_recliner: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
          </div>

          {!editingId && (
            <p className="text-[11px] text-gray-400">
              A full DIAMOND/PEARL seat layout is generated automatically for the new showtime.
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-lg transition cursor-pointer disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Save Changes" : "Create Showtime"}
          </button>
        </form>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-xs">Loading showtimes...</div>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px]">
              <tr>
                <th className="text-left p-3">Movie</th>
                <th className="text-left p-3">Theater</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Time</th>
                <th className="text-left p-3">Prices (P/D/R)</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {showtimes.map((st) => (
                <tr key={st.showtime_id} className="border-t border-gray-100">
                  <td className="p-3 font-semibold text-gray-900 whitespace-nowrap">{st.movie_title}</td>
                  <td className="p-3 text-gray-600 whitespace-nowrap">{st.theater_name}</td>
                  <td className="p-3 text-gray-600 whitespace-nowrap">{st.show_date}</td>
                  <td className="p-3 text-gray-600 whitespace-nowrap">{st.show_time}</td>
                  <td className="p-3 text-gray-600 whitespace-nowrap">
                    ₹{st.price_classic} / ₹{st.price_prime} / ₹{st.price_recliner}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditForm(st)}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(st)}
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
