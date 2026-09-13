import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

export default function LanguageFormatModal({ movie, onClose, onConfirmLanguageFormat }) {
  const [selectedFormat, setSelectedFormat] = useState({ lang: 'Tamil', format: '2D' });

  // Generate available options based on movie language
  const availableLangs = [
    {
      lang: movie.language.includes('Tamil') ? 'TAMIL' : movie.language.includes('Hindi') ? 'HINDI' : movie.language.includes('Telugu') ? 'TELUGU' : 'MALAYALAM',
      formats: ['2D', 'IMAX 3D', 'EPIQ', '4DX 3D']
    },
    {
      lang: 'HINDI',
      formats: ['2D', '3D']
    },
    {
      lang: 'TELUGU',
      formats: ['2D']
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-semibold text-xs text-gray-500 line-clamp-1">{movie.title}</h3>
            <h2 className="text-lg font-bold text-gray-900">Select language and format</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language & Format Sections matching BMS Screenshot */}
        <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-1">
          {availableLangs.map((item) => (
            <div key={item.lang} className="space-y-3">
              <div className="bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 uppercase tracking-wider">
                {item.lang}
              </div>

              <div className="flex flex-wrap gap-2.5 px-1">
                {item.formats.map((fmt) => {
                  const isSelected = selectedFormat.lang === item.lang && selectedFormat.format === fmt;

                  return (
                    <button
                      key={fmt}
                      onClick={() => {
                        setSelectedFormat({ lang: item.lang, format: fmt });
                        onConfirmLanguageFormat(item.lang, fmt);
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'border-bms-red bg-red-50 text-bms-red shadow-sm ring-2 ring-red-200'
                          : 'border-gray-300 hover:border-bms-red text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{fmt}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-bms-red" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Confirmation Button */}
        <div className="pt-2">
          <button
            onClick={() => onConfirmLanguageFormat(selectedFormat.lang, selectedFormat.format)}
            className="w-full bg-bms-red hover:bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg transition active:scale-95 text-xs cursor-pointer"
          >
            Proceed with {selectedFormat.lang} ({selectedFormat.format})
          </button>
        </div>

      </div>
    </div>
  );
}
