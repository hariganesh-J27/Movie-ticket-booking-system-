"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import {
  fetchAdminTheaters,
  createTheater,
  updateTheater,
  deleteTheater,
  type AdminTheater,
} from "@/lib/adminApi";

const EMPTY_FORM = {
  name: "",
  location: "",
  city: "Chennai",
  total_screens: "6",
  cancellation_status: "Non-cancellable",
};

export default function TheatersAdminTab() {
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
      const res = await fetchAdminTheaters();
      if (res.success && res.data) setTheaters(res.data);
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

  const openEditForm = (theater: AdminTheater) => {
    setEditingId(theater.theater_id);
    setForm({
      name: theater.name,
      location: theater.location,
      city: theater.city,
      total_screens: String(theater.total_screens),
      cancellation_status: theater.cancellation_status,
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.location) {
      setError("Name and location are required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        location: form.location,
        city: form.city,
        total_screens: Number(form.total_screens),
        cancellation_status: form.cancellation_status,
      };

      const res = editingId ? await updateTheater(editingId, payload) : await createTheater(payload);

      if (res.success) {
        setShowForm(false);
        load();
      } else {
        setError(res.error || res.message || "Failed to save theater");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (theater: AdminTheater) => {
    if (!window.confirm(`Delete "${theater.name}"? This cannot be undone.`)) return;
    const res = await deleteTheater(theater.theater_id);
    if (res.success) {
      load();
    } else {
      alert(res.message || "Failed to delete theater");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Theaters ({theaters.length})</h2>
        <button
          onClick={openAddForm}
          className="flex items-center gap-1.5 bg-bms-red hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Theater</span>
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
          <h3 className="font-bold text-sm text-gray-900">{editingId ? "Edit Theater" : "Add Theater"}</h3>

          {error && <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Location *</label>
              <input
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">City</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Total Screens</label>
              <input
                type="number"
                value={form.total_screens}
                onChange={(e) => setForm({ ...form, total_screens: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Cancellation Status</label>
              <select
                value={form.cancellation_status}
                onChange={(e) => setForm({ ...form, cancellation_status: e.target.value })}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
              >
                <option value="Non-cancellable">Non-cancellable</option>
                <option value="Cancellation available">Cancellation available</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-lg transition cursor-pointer disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Save Changes" : "Create Theater"}
          </button>
        </form>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-xs">Loading theaters...</div>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px]">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Location</th>
                <th className="text-left p-3">City</th>
                <th className="text-left p-3">Screens</th>
                <th className="text-left p-3">Cancellation</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {theaters.map((t) => (
                <tr key={t.theater_id} className="border-t border-gray-100">
                  <td className="p-3 font-semibold text-gray-900">{t.name}</td>
                  <td className="p-3 text-gray-600">{t.location}</td>
                  <td className="p-3 text-gray-600">{t.city}</td>
                  <td className="p-3 text-gray-600">{t.total_screens}</td>
                  <td className="p-3 text-gray-600">{t.cancellation_status}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditForm(t)}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t)}
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
