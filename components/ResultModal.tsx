import React from 'react';
import { X, CheckCircle, AlertCircle, Clock, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchStatus, StudentRecord } from '../types';

interface ResultModalProps {
  status: SearchStatus;
  student: StudentRecord | null;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ status, student, onClose }) => {
  if (status === SearchStatus.IDLE || status === SearchStatus.LOADING) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-[#ebf8ff] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#9fc2fa]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 hover:bg-white/30 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="p-8 text-center">
            {/* Content based on status */}
            {status === SearchStatus.SUCCESS && student ? (
              <>
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center ring-4 ring-green-100/50 shadow-inner">
                    <CheckCircle size={40} />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Tahniah! 🎉</h3>
                <p className="text-gray-600 mb-8 font-medium">
                  Sijil untuk <strong className="text-gray-900">{student.name}</strong> sedia dimuat turun.
                </p>
                
                <a
                  href={student.certLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-3 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-green-200 transition-all transform active:scale-[0.98]"
                >
                  <Download size={22} />
                  <span className="uppercase tracking-wider text-sm">Muat Turun Sijil 📥</span>
                </a>
                
                 <p className="mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                   📄 Format PDF
                 </p>
              </>
            ) : status === SearchStatus.CERT_NOT_READY && student ? (
              <>
                 <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center ring-4 ring-orange-100/50 shadow-inner">
                    <Clock size={40} />
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Dalam Proses ⏳</h3>
                <p className="text-gray-600 mb-6 font-medium">
                  Rekod ditemui untuk <strong>{student.name}</strong>, tetapi sijil masih dalam proses penjanaan.
                </p>
                 <div className="bg-orange-50 p-4 rounded-xl mb-6 text-left border border-orange-100 shadow-sm">
                    <p className="text-xs text-orange-800 font-semibold leading-relaxed">
                       📡 Sijil akan dikemas kini secara berperingkat. Sila semak semula dalam masa terdekat.
                    </p>
                 </div>
                <button
                  onClick={onClose}
                  className="w-full bg-white/50 hover:bg-white/80 text-gray-800 font-bold py-4 px-6 rounded-xl transition-colors text-sm uppercase tracking-wider"
                >
                  Tutup
                </button>
              </>
            ) : status === SearchStatus.NOT_FOUND ? (
              <>
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center ring-4 ring-red-100/50 shadow-inner">
                    <AlertCircle size={40} />
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Tiada Rekod 😔</h3>
                <p className="text-gray-600 mb-8 font-medium">
                  Maaf, nama atau no. kad pengenalan tidak ditemui dalam pangkalan data kami.
                </p>
                <button
                  onClick={onClose}
                  className="w-full bg-white/50 hover:bg-white/80 text-gray-800 font-bold py-4 px-6 rounded-xl transition-colors text-sm uppercase tracking-wider"
                >
                  Cuba Lagi
                </button>
              </>
            ) : (
              <>
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center ring-4 ring-gray-100/50 shadow-inner">
                    <AlertCircle size={40} />
                  </div>
                </div>
                 <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Ralat Input ✍️</h3>
                <p className="text-gray-600 mb-8 font-medium">
                  Sila pastikan maklumat yang dimasukkan adalah lengkap dan betul.
                </p>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-colors text-sm uppercase tracking-wider"
                >
                  Perbaiki Maklumat
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ResultModal;