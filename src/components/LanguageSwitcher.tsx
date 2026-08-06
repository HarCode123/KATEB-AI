import React from 'react';
import { useLanguage } from '../LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div 
      id="language-switcher-container" 
      className="inline-flex items-center p-0.5 bg-white/10 backdrop-blur-xs rounded-full border border-white/15"
    >
      <button
        id="lang-btn-en"
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all duration-300 cursor-pointer ${
          language === 'en'
            ? 'bg-white text-[#0F4C81] shadow-sm scale-100'
            : 'text-blue-100 hover:text-white hover:bg-white/5'
        }`}
      >
        English
      </button>
      <button
        id="lang-btn-ar"
        type="button"
        onClick={() => setLanguage('ar')}
        className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all duration-300 cursor-pointer ${
          language === 'ar'
            ? 'bg-white text-[#0F4C81] shadow-sm scale-100 font-sans'
            : 'text-blue-100 hover:text-white hover:bg-white/5 font-sans'
        }`}
      >
        العربية
      </button>
    </div>
  );
}
