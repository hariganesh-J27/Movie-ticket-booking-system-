import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, ShoppingBag, User, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { createBooking } from '../api';

export default function BookingSummaryModal({ movie, showtime, theater, selectedSeats, basePrice, onClose, onBookingSuccess }) {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  
  // Food & Beverage addon states
  const [includePopcorn, setIncludePopcorn] = useState(false);
  const [includePepsi, setIncludePepsi] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fnbTotal = (includePopcorn ? 220 : 0) + (includePepsi ? 120 : 0);
  const convenienceFee = Math.round(basePrice * 0.10);
  const finalTotal = basePrice + fnbTotal + convenienceFee;

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!userName || !userEmail || !userPhone) {
      setError('Please fill in all customer details');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        user_name: userName,
        user_email: userEmail,
        user_phone: userPhone,
        showtime_id: showtime.showtime_id,
        seat_ids: selectedSeats.map(s => s.seat_id),
        seat_numbers: selectedSeats.map(s => s.seat_number),
        total_amount: finalTotal
      };

      const res = await createBooking(payload);

      if (res.success) {
        onBookingSuccess(res.data);
      } else {
        setError(res.error || res.message || 'Failed to complete booking');
      }
    } catch (err) {
      setError(err.message || 'Server error occurred during booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-bms-darker text-white p-4 flex items-center justify-between">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-bms-red" />
            <span>Booking Summary & Checkout</span>
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <form onSubmit={handleSubmitBooking} className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          {/* Ticket Summary Card */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900 text-base">{movie.title}</h3>
                <p className="text-xs text-gray-500">{theater.name}</p>
                <p className="text-xs text-gray-500">{showtime.show_date} | {showtime.show_time}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-bms-red bg-red-50 px-2 py-1 rounded">
                  {selectedSeats.length} Seats
                </span>
                <p className="text-xs text-gray-600 font-bold mt-1">
                  {selectedSeats.map(s => s.seat_number).join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* F&B Snacks Section */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider">Grab a Snack (Optional)</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                includePopcorn ? 'border-bms-red bg-red-50/50' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includePopcorn}
                    onChange={(e) => setIncludePopcorn(e.target.checked)}
                    className="accent-bms-red w-4 h-4"
                  />
                  <div>
                    <div className="font-bold text-xs text-gray-800">Caramel Popcorn (Large)</div>
                    <div className="text-[11px] text-gray-500">₹220</div>
                  </div>
                </div>
              </label>

              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                includePepsi ? 'border-bms-red bg-red-50/50' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includePepsi}
                    onChange={(e) => setIncludePepsi(e.target.checked)}
                    className="accent-bms-red w-4 h-4"
                  />
                  <div>
                    <div className="font-bold text-xs text-gray-800">Chilled Pepsi (600ml)</div>
                    <div className="text-[11px] text-gray-500">₹120</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Customer Info Form */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider">Contact Details for Ticket SMS/Email</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Rahul Sharma"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bms-red focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2 pt-2">
            <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider">Select Payment Mode</h4>
            <div className="flex gap-3">
              {['UPI / Google Pay', 'Credit / Debit Card', 'Net Banking'].map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setPaymentMethod(mode)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition ${
                    paymentMethod === mode
                      ? 'bg-bms-darker text-white border-bms-darker'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Price Breakdown & Submit */}
          <div className="border-t border-gray-200 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Ticket Subtotal</span>
              <span>₹{basePrice.toFixed(2)}</span>
            </div>
            {fnbTotal > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Food & Beverages</span>
                <span>₹{fnbTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Convenience Fee (10%)</span>
              <span>₹{convenienceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-gray-900 border-t border-gray-200 pt-2">
              <span>Amount Payable</span>
              <span className="text-bms-red">₹{finalTotal.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-bms-red hover:bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Processing Payment...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Pay ₹{finalTotal.toFixed(2)} & Confirm Ticket</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
