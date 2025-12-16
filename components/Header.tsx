import React, { useState } from 'react';
import { Award } from 'lucide-react';

const Header: React.FC = () => {
  // File ID extracted from: https://drive.google.com/file/d/1xSMxGHSDSP_yNCaevg2ZrvT_FbdsLchw/view?usp=sharing
  const fileId = "1xSMxGHSDSP_yNCaevg2ZrvT_FbdsLchw";
  
  // Strategy: Try these URLs in order until one loads successfully
  // 1. Direct export view (Standard)
  // 2. Google User Content CDN (Often bypasses redirect limits)
  // 3. High-res thumbnail (Reliable fallback)
  const logoUrls = [
    `https://drive.google.com/uc?export=view&id=${fileId}`,
    `https://lh3.googleusercontent.com/d/${fileId}`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
  ];

  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (currentUrlIndex < logoUrls.length - 1) {
      // Try the next URL in the list
      console.log(`Logo URL ${currentUrlIndex} failed, trying next fallback...`);
      setCurrentUrlIndex(prev => prev + 1);
    } else {
      // All URLs failed
      console.error("All logo fallbacks failed.");
      setHasError(true);
    }
  };

  return (
    <header className="bg-[#ebf8ff]/90 backdrop-blur-md sticky top-0 z-20 border-b border-blue-300/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center justify-center text-center space-y-4">
        {/* School Logo */}
        <div className="w-32 h-32 sm:w-44 sm:h-44 relative transform hover:scale-105 transition-transform duration-300 flex items-center justify-center drop-shadow-xl">
          {!hasError ? (
            <img 
              key={logoUrls[currentUrlIndex]} // Key ensures component remounts on URL change
              src={logoUrls[currentUrlIndex]}
              alt="Logo SK Bandar Teknologi Kajang"
              className="w-full h-full object-contain"
              onError={handleImageError}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-xl text-white shadow-lg ring-4 ring-orange-50 flex items-center justify-center">
              <Award size={50} />
            </div>
          )}
        </div>
        
        {/* Title */}
        <div className="w-full">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight mx-auto text-orange-600 drop-shadow-sm p-1 uppercase">
            🏅 SISTEM SEMAKAN SIJIL HARI SUKAN NEGARA <span className="normal-case">BTePS</span> 2025 🏅
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;