import React from 'react';
import { X, CheckCircle, Printer, MapPin, Calendar, Clock, Ticket, User, Mail, Phone } from 'lucide-react';

export default function TicketModal({ booking, onClose }) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Top Header */}
        <div className="bg-emerald-600 text-white p-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <CheckCircle className="w-12 h-12 mx-auto mb-2 text-white animate-bounce" />
          <h2 className="text-xl font-black">Booking Confirmed!</h2>
          <p className="text-xs text-emerald-100 mt-1">Ticket Reference ID: <span className="font-mono font-bold text-white bg-black/20 px-2 py-0.5 rounded">{booking.booking_ref}</span></p>
        </div>

        {/* Digital Ticket Body */}
        <div className="p-6 space-y-6 bg-gray-50">
          
          {/* Ticket Card */}
          <div className="bg-white rounded-2xl p-5 border-2 border-dashed border-gray-300 shadow-md relative overflow-hidden space-y-4">
            
            {/* Side Notches */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border-r border-gray-300"></div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border-l border-gray-300"></div>

            <div className="flex gap-4 items-center">
              <img
                src={booking.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'}
                alt={booking.movie_title}
                className="w-20 h-28 object-cover rounded-xl shadow-md border border-gray-200"
              />

              <div className="flex-1 space-y-1.5">
                <h3 className="font-black text-lg text-gray-900 leading-tight">{booking.movie_title}</h3>
                
                <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-bms-red" />
                  <span>{booking.theater_name}</span>
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {booking.show_date}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-gray-900 bg-red-50 text-bms-red px-2 py-0.5 rounded">
                    <Clock className="w-3.5 h-3.5 text-bms-red" />
                    {booking.show_time}
                  </span>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Seat / Slot Numbers</span>
                  <div className="font-extrabold text-bms-red text-base">{booking.seats_list}</div>
                </div>
              </div>
            </div>

            {/* Customer Details Box */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs space-y-1">
              <div className="font-bold text-gray-700 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-bms-red" />
                <span>Customer: {booking.user_name}</span>
              </div>
              <div className="text-gray-500 text-[11px] flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-gray-400" />
                  {booking.user_email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gray-400" />
                  {booking.user_phone}
                </span>
              </div>
            </div>

            {/* QR Code & Total */}
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 font-semibold">Total Amount Paid</div>
                <div className="text-xl font-black text-gray-900">₹{Number(booking.total_amount).toFixed(2)}</div>
              </div>

              <div className="flex flex-col items-center">
                {/* SVG QR Code Simulation */}
                <div className="w-16 h-16 bg-gray-900 p-1 rounded-lg flex items-center justify-center">
                  <div className="w-full h-full bg-white p-1 grid grid-cols-4 gap-0.5">
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white"></div>
                    <div className="bg-black"></div>
                  </div>
                </div>
                <span className="text-[9px] text-gray-500 font-mono mt-0.5">SCAN AT CINEMA</span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition text-xs cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Ticket</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 bg-bms-red hover:bg-red-600 text-white font-bold py-3 rounded-xl transition text-xs cursor-pointer shadow-md"
            >
              <Ticket className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
