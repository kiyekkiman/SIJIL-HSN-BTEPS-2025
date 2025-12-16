import React, { useState } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ResultModal from './components/ResultModal';
import { searchStudent } from './services/sheetService';
import { SearchFormData, SearchStatus, StudentRecord } from './types';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-slate-50 overflow-hidden">
       {/* Grid Pattern */}
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
       
       {/* Ambient Glows */}
       <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-[100px] animate-pulse"></div>
       <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
       
       {/* Diagonal stripe for sporty feel */}
       <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-transparent rotate-12 blur-3xl"></div>
    </div>
  );
};

const App: React.FC = () => {
  const [searchStatus, setSearchStatus] = useState<SearchStatus>(SearchStatus.IDLE);
  const [foundStudent, setFoundStudent] = useState<StudentRecord | null>(null);

  const handleSearch = async (formData: SearchFormData) => {
    // 1. Basic Validation
    if (!formData.name.trim() || !formData.icNumber.trim() || formData.icNumber.length < 4) {
      setSearchStatus(SearchStatus.INVALID_INPUT);
      return;
    }

    setSearchStatus(SearchStatus.LOADING);

    try {
      // Securely search on the server
      const match = await searchStudent(formData.name, formData.icNumber);

      if (match) {
        console.log("Match found:", match);
        // Ensure the link exists and looks like a URL
        const hasValidLink = match.certLink && (match.certLink.startsWith('http') || match.certLink.startsWith('www'));
        
        if (hasValidLink) {
             setFoundStudent(match);
             setSearchStatus(SearchStatus.SUCCESS);
        } else {
            console.warn("Match found but link is empty/invalid:", match.certLink);
            setFoundStudent(match); // Set student so we can show name
            setSearchStatus(SearchStatus.CERT_NOT_READY);
        }
      } else {
        console.log("No match found.");
        setSearchStatus(SearchStatus.NOT_FOUND);
      }
    } catch (error) {
      console.error("Error during search:", error);
      setSearchStatus(SearchStatus.ERROR);
    }
  };

  const closeModal = () => {
    setSearchStatus(SearchStatus.IDLE);
    setFoundStudent(null);
  };

  return (
    <>
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col font-sans">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 flex items-center justify-center">
          <div className="w-full max-w-2xl">
             <SearchForm onSearch={handleSearch} isLoading={searchStatus === SearchStatus.LOADING} />
          </div>
        </main>

        <footer className="mt-auto py-6">
          <div className="container mx-auto px-4 text-center">
             <div className="inline-block px-6 py-2 rounded-full bg-[#ebf8ff]/60 backdrop-blur-sm border border-white/20 shadow-sm">
                <p className="text-gray-700 font-medium text-sm">&copy; {new Date().getFullYear()} Unit Sukan & Kokurikulum. Hak Cipta Terpelihara. 🏆</p>
             </div>
            <p className="text-xs text-gray-500 mt-2 font-medium tracking-wider uppercase">Majulah Sukan Untuk Negara 🇲🇾</p>
          </div>
        </footer>

        <ResultModal 
          status={searchStatus} 
          student={foundStudent} 
          onClose={closeModal} 
        />
      </div>
    </>
  );
};

export default App;