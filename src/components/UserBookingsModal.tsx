"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { X, Ticket, Trash2, Calendar, MapPin, LogIn } from "lucide-react";
import { fetchUserBookings, cancelBooking } from "@/lib/api";
import type { BookingLike } from "@/lib/types";

interface UserBookingsModalProps {
  onClose: () => void;
}

export default function UserBookingsModal({ onClose }: UserBookingsModalProps) {
  const { status: authStatus } = useSession();
  const [bookings, setBookings] = useState<BookingLike[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadBookings = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetchUserBookings();
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authStatus === "authenticated") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
      loadBookings();
    }
  }, [authStatus]);

  const handleCancelBooking = async (id: number, ref: string) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${ref}?`)) return;

    try {
      const res = await cancelBooking(id);
      if (res.success) {
        setMessage(`Booking ${ref} cancelled successfully.`);
        loadBookings();
      }
    } catch (err) {
      alert(`Error cancelling booking: ${(err as Error).message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="bg-bms-darker text-white p-4 flex items-center justify-between">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Ticket className="w-5 h-5 text-bms-red" />
            <span>My Ticket Bookings</span>
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {authStatus !== "authenticated" ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-sm text-gray-500">Sign in with Google to see your ticket bookings.</p>
              <button
                onClick={() => signIn("google")}
                className="inline-flex items-center gap-2 bg-bms-red hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign in with Google</span>
              </button>
            </div>
          ) : (
            <>
              {message && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg font-medium">
                  {message}
                </div>
              )}

              {loading ? (
                <div className="text-center py-10 text-gray-500 text-xs">Loading tickets...</div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  No ticket bookings found. Book a movie ticket to see it here!
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div
                      key={b.booking_id}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={b.poster_url}
                          alt={b.movie_title}
                          className="w-14 h-20 object-cover rounded-lg shadow-sm border"
                        />
                        <div className="space-y-1">
                          <div className="font-bold text-sm text-gray-900">{b.movie_title}</div>
                          <div className="text-xs text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-bms-red" />
                            <span>{b.theater_name}</span>
                          </div>
                          <div className="text-[11px] text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {b.show_date} | {b.show_time}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-bms-red">
                            Seats: {b.seats_list} (Ref: {b.booking_ref})
                          </div>
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        <div className="font-extrabold text-sm text-gray-900">
                          ₹{Number(b.total_amount).toFixed(2)}
                        </div>
                        <button
                          onClick={() => handleCancelBooking(b.booking_id, b.booking_ref)}
                          className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-red-200 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Cancel Ticket</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
