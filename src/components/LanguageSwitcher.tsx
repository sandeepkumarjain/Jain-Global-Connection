import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGE_MAP, LanguageCode } from '../utils/translations';
import { Globe, ChevronDown, Check, Languages, Sparkles } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'topbar' | 'mobile' | 'full' | 'compact';
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

  // Primary featured languages requested: English, Hindi, Gujarati
  const primaryLanguages: { code: LanguageCode; native: string; label: string; langCode: string; flag: string }[] = [
    { code: 'English', native: 'English', label: 'English', langCode: 'en', flag: '🇬🇧' },
    { code: 'Hindi', native: 'हिन्दी', label: 'Hindi', langCode: 'hi', flag: '🇮🇳' },
    { code: 'Gujarati', native: 'ગુજરાતી', label: 'Gujarati', langCode: 'gu', flag: '🇮🇳' },
  ];

  // Secondary community languages
  const secondaryLanguages: { code: LanguageCode; native: string; label: string; langCode: string; flag: string }[] = [
    { code: 'Marathi', native: 'मराठी', label: 'Marathi', langCode: 'mr', flag: '🇮🇳' },
    { code: 'Kannada', native: 'ಕನ್ನಡ', label: 'Kannada', langCode: 'kn', flag: '🇮🇳' },
    { code: 'Tamil', native: 'தமிழ்', label: 'Tamil', langCode: 'ta', flag: '🇮🇳' },
    { code: 'Telugu', native: 'తెలుగు', label: 'Telugu', langCode: 'te', flag: '🇮🇳' },
  ];

  const allLanguages = [...primaryLanguages, ...secondaryLanguages];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (langCodeName: LanguageCode, native: string, label: string) => {
    setLanguage(langCodeName);
    setIsOpen(false);
    showToast(
      `Language Set: ${native}`,
      `Interface translated to ${label} (${native}) using Google Translate.`,
      'success'
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 bg-amber-950/70 p-1 rounded-full border border-amber-500/40 ${className}`}>
        {primaryLanguages.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleLanguageSelect(lang.code, lang.native, lang.label)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                  : 'text-amber-200 hover:text-white hover:bg-amber-900/60'
              }`}
            >
              {lang.native}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className={`space-y-2.5 ${className}`}>
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-400">
          <span className="flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5" />
            <span>Select Language / भाषा चुनें</span>
          </span>
          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold border border-amber-500/30">
            Google Translate
          </span>
        </div>

        {/* Highlighted Primary Options: English, Hindi, Gujarati */}
        <div className="grid grid-cols-3 gap-1.5">
          {primaryLanguages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageSelect(lang.code, lang.native, lang.label)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black border-amber-300 shadow-md ring-2 ring-amber-400/50'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700/80'
                }`}
              >
                <span className="font-serif text-sm font-extrabold">{lang.native}</span>
                <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                  {lang.label}
                </span>
                {isSelected && (
                  <span className="mt-1 px-1.5 py-0.2 bg-slate-950 text-amber-300 text-[9px] font-extrabold rounded-full flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5" /> Active
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Other Regional Languages */}
        <details className="group pt-1">
          <summary className="text-[11px] text-amber-300/80 hover:text-amber-200 cursor-pointer font-bold flex items-center justify-between py-1 border-t border-slate-800">
            <span>More Regional Languages ({secondaryLanguages.length})</span>
            <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
          </summary>
          <div className="grid grid-cols-2 gap-1.5 mt-2 pt-1">
            {secondaryLanguages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageSelect(lang.code, lang.native, lang.label)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-serif">{lang.native}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>
                      ({lang.label})
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-slate-950" />}
                </button>
              );
            })}
          </div>
        </details>
      </div>
    );
  }

  // Topbar Dropdown (Default for Header)
  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 hover:bg-amber-900 text-amber-200 hover:text-white text-[11px] font-bold border border-amber-500/50 transition-all shadow-sm cursor-pointer hover:border-amber-400"
        title="Select Language (English, Hindi, Gujarati)"
      >
        <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="font-serif font-extrabold text-amber-100">{currentLang.native}</span>
        <span className="text-[10px] text-amber-300/80 hidden xl:inline">({currentLang.label})</span>
        <ChevronDown className={`w-3.5 h-3.5 text-amber-400/80 transition-transform ${isOpen ? 'rotate-180 text-amber-300' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl border-2 border-amber-500/50 py-2.5 w-64 z-50 animate-fade-in">
          {/* Header */}
          <div className="px-3.5 pb-2 text-[10px] font-black uppercase tracking-wider text-amber-400 border-b border-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              <span>Language Switcher</span>
            </span>
            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold border border-amber-500/30">
              Google Translate
            </span>
          </div>

          {/* Featured Primary Languages (English, Hindi, Gujarati) */}
          <div className="p-2 space-y-1">
            <p className="px-1 text-[9px] font-extrabold uppercase tracking-widest text-amber-300/80 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Primary Languages</span>
            </p>
            <div className="grid grid-cols-1 gap-1">
              {primaryLanguages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageSelect(lang.code, lang.native, lang.label)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md border border-amber-300'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-100 border border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{lang.flag}</span>
                      <span className="font-serif font-extrabold text-sm">{lang.native}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                        ({lang.label})
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-slate-950 shrink-0 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Community Languages */}
          <div className="px-2 pt-1 border-t border-slate-800/80">
            <p className="px-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Other Regional Languages
            </p>
            <div className="space-y-0.5 max-h-36 overflow-y-auto no-scrollbar">
              {secondaryLanguages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageSelect(lang.code, lang.native, lang.label)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-amber-600/30 transition-colors cursor-pointer ${
                      isSelected ? 'text-amber-300 font-bold bg-amber-950/80' : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-serif">{lang.native}</span>
                      <span className="text-[10px] text-slate-400">({lang.label})</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-3 pt-2 text-center border-t border-slate-800 mt-1">
            <p className="text-[9px] text-amber-300/60 italic">
              Automatically translates pages, menus & directories instantly
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
