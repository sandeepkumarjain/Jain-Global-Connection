import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGE_MAP, LanguageCode } from '../utils/translations';
import { Globe, ChevronDown, Check, Languages } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'topbar' | 'mobile' | 'full';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'topbar',
  className = '',
}) => {
  const { language, setLanguage, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGE_MAP[language] || LANGUAGE_MAP.English;

  const languagesList: { code: LanguageCode; native: string; label: string; langCode: string }[] = [
    { code: 'English', native: 'English', label: 'English', langCode: 'en' },
    { code: 'Hindi', native: 'हिन्दी', label: 'Hindi', langCode: 'hi' },
    { code: 'Gujarati', native: 'ગુજરાતી', label: 'Gujarati', langCode: 'gu' },
    { code: 'Marathi', native: 'मराठी', label: 'Marathi', langCode: 'mr' },
    { code: 'Kannada', native: 'ಕನ್ನಡ', label: 'Kannada', langCode: 'kn' },
    { code: 'Tamil', native: 'தமிழ்', label: 'Tamil', langCode: 'ta' },
    { code: 'Telugu', native: 'తెలుగు', label: 'Telugu', langCode: 'te' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (lang: LanguageCode, native: string, label: string) => {
    setLanguage(lang);
    setIsOpen(false);
    showToast(
      `Language Changed: ${native}`,
      `Interface translated to ${label} (${native}) via Google Translate.`,
      'success'
    );
  };

  if (variant === 'mobile') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-400">
          <span className="flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5" />
            <span>Select Language / भाषा</span>
          </span>
          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
            Google Translate
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {languagesList.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code, lang.native, lang.label)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-serif">{lang.native}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>
                    ({lang.label})
                  </span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 hover:text-white text-[11px] font-bold border border-amber-500/40 transition-all shadow-sm cursor-pointer"
        title="Select Language (Google Translate)"
      >
        <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="font-serif truncate max-w-[80px] sm:max-w-none">{currentLang.native}</span>
        <ChevronDown className={`w-3 h-3 opacity-70 transition-transform ${isOpen ? 'rotate-180 text-amber-300' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-slate-900 text-white rounded-2xl shadow-2xl border-2 border-amber-500/40 py-2 w-56 z-50 animate-fade-in">
          <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400/90 border-b border-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Languages className="w-3 h-3 text-amber-400" />
              <span>Google Translate</span>
            </span>
            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
              7 Languages
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto no-scrollbar py-1">
            {languagesList.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageSelect(lang.code, lang.native, lang.label)}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-amber-600/30 transition-colors cursor-pointer ${
                    isSelected ? 'text-amber-300 font-bold bg-amber-950/70 border-l-2 border-amber-400' : 'text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm">{lang.native}</span>
                    <span className="text-[10px] text-slate-400">({lang.label})</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
