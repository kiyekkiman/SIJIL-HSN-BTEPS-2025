import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { SearchFormData } from '../types';

interface SearchFormProps {
  onSearch: (data: SearchFormData) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [name, setName] = useState('');
  const [icNumber, setIcNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ name, icNumber });
  };

  return (
    <div className="bg-[#ebf8ff]/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] overflow-hidden border border-[#9fc2fa]">
      <div className="p-6 sm:p-10">
        
        {/* Centered Header Section */}
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">
            SEMAKAN SIJIL 📋
          </h2>
          <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 font-medium pt-2">
            Masukkan butiran pelajar untuk memuat turun sijil. 🎓
          </p>

          {/* Disclaimer Box */}
          <div className="mt-8 bg-red-100 border-2 border-red-200 rounded-xl p-4 inline-block max-w-lg mx-auto shadow-md">
            <p className="text-red-800 font-bold text-sm sm:text-base uppercase tracking-wider flex flex-col sm:flex-row items-center gap-3 justify-center">
              <span className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-black flex items-center gap-2 shadow-sm animate-pulse">
                ⚠️ PENTING
              </span>
              <span>Tamat Tempoh: 1 Januari 2026</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
          <div className="group">
            <label htmlFor="name" className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2 pl-1">
              Nama Penuh 👤
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border-2 border-white/50 bg-white/70 focus:bg-white focus:border-orange-500 focus:ring-0 transition-all duration-200 text-gray-900 font-semibold placeholder-gray-400"
              placeholder="AHMAD BIN ABU"
              required
            />
          </div>

          <div className="group">
            <label htmlFor="icNumber" className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2 pl-1">
              No. Kad Pengenalan 🔢
            </label>
            <input
              type="text"
              id="icNumber"
              value={icNumber}
              onChange={(e) => setIcNumber(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border-2 border-white/50 bg-white/70 focus:bg-white focus:border-orange-500 focus:ring-0 transition-all duration-200 text-gray-900 font-semibold placeholder-gray-400"
              placeholder="100101012345"
              required
            />
            <p className="mt-2 text-[11px] text-gray-500 font-bold uppercase tracking-wider pl-1 flex items-center gap-1">
              ⛔ Tanpa Sengkang (-)
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:-translate-y-0.5 active:scale-[0.99] shadow-lg shadow-orange-500/20 mt-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span className="uppercase tracking-wider text-sm">Sedang Memproses...</span>
              </>
            ) : (
              <>
                <Search size={20} />
                <span className="uppercase tracking-wider text-sm">Semak Status 🚀</span>
              </>
            )}
          </button>

          {/* Contact Details Section */}
          <div className="mt-8 pt-6 border-t border-blue-200 text-center">
            <div className="inline-block">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                Bantuan Teknikal 🛠️
              </p>
              <p className="text-sm font-bold text-gray-800">
                MR. KHAI 👨‍🏫
              </p>
              <a href="tel:+60183208573" className="text-xs font-mono text-orange-700 hover:text-orange-800 transition-colors flex items-center justify-center gap-1 mt-1 font-semibold">
                📞 018-3208573
              </a>
            </div>
          </div>
        </form>
      </div>
      <div className="bg-[#b3d1ff] px-8 py-4 text-[10px] text-center text-gray-600 font-semibold uppercase tracking-wider border-t border-[#9fc2fa] flex justify-center items-center gap-1">
        🔒 Data anda dilindungi & selamat
      </div>
    </div>
  );
};

export default SearchForm;