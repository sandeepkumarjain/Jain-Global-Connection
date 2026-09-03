import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Sunrise, Sunset, Sparkles, Clock, Check, ChevronDown, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThemePreference } from '../utils/solarTheme';

interface ThemeSwitcherProps {
  variant?: 'header' | 'topbar' | 'banner' | 'pill';
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'header',
  className = '',
}) => {
  const {
    themeMode,
    themePreference,
    setThemePreference,
    solarThemeInfo,
    showToast,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelectPreference = (pref: ThemePreference) => {
    setThemePreference(pref);
    setIsOpen(false);

    if (pref === 'auto') {
      const modeNow = solarThemeInfo?.effectiveTheme === 'dark' ? 'Night (Dark)' : 'Day (Light)';
      showToast(
        'Auto Solar Theme Activated',
        `Synchronized to local Sunrise (${solarThemeInfo?.sunrise || '6:04 AM'}) & Sunset (${solarThemeInfo?.sunset || '7:20 PM'}). Currently: ${modeNow}.`,
        'success'
      );
    } else if (pref === 'light') {
      showToast('Light Theme Set', 'Bright daytime aesthetic active.', 'info');
    } else {
      showToast('Dark Theme Set', 'Soothing nocturnal dark aesthetic active.', 'info');
    }
  };

  // Quick cycle when clicked directly in compact environments
  const cycleNextPreference = (e: React.MouseEvent) => {
    e.stopPropagation();
    let next: ThemePreference = 'auto';
    if (themePreference === 'auto') next = 'light';
    else if (themePreference === 'light') next = 'dark';
    else next = 'auto';
    handleSelectPreference(next);
  };

  /* ========================================================================= */
  /* VARIANT 1: TOPBAR TICKER (Ultra-compact badge next to language switcher)   */
  /* ========================================================================= */
  if (variant === 'topbar') {
    return (
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-900/60 hover:bg-amber-900/90 border border-amber-500/30 text-amber-200 hover:text-white text-[10px] sm:text-[11px] font-medium transition-all shadow-xs cursor-pointer"
          title={`Theme: ${themePreference === 'auto' ? 'Auto Solar' : themePreference === 'dark' ? 'Dark' : 'Light'}`}
        >
          {themePreference === 'auto' ? (
            solarThemeInfo?.isSolarDay ? (
              <Sunrise className="w-3 h-3 text-amber-300 animate-pulse" />
            ) : (
              <Sunset className="w-3 h-3 text-amber-400 animate-pulse" />
            )
          ) : themeMode === 'dark' ? (
            <Moon className="w-3 h-3 text-amber-300" />
          ) : (
            <Sun className="w-3 h-3 text-amber-400" />
          )}

          <span className="font-bold">
            {themePreference === 'auto' ? (
              <span>Auto {solarThemeInfo?.isSolarDay ? '☀️' : '🌙'}</span>
            ) : (
              <span className="capitalize">{themePreference}</span>
            )}
          </span>
          <ChevronDown className={`w-2.5 h-2.5 text-amber-400/80 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <ThemeDropdownMenu
              themePreference={themePreference}
              solarThemeInfo={solarThemeInfo}
              onSelect={handleSelectPreference}
              onClose={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ========================================================================= */
  /* VARIANT 2: BANNER (Embedded in HomeDateBanner beside Sunrise/Sunset)      */
  /* ========================================================================= */
  if (variant === 'banner') {
    return (
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer shadow-xs ${
            themePreference === 'auto'
              ? 'bg-amber-950/80 border-amber-500/40 text-amber-200 hover:bg-amber-900/90'
              : themeMode === 'dark'
              ? 'bg-slate-900/90 border-amber-500/30 text-amber-300 hover:bg-slate-850'
              : 'bg-amber-100/90 border-amber-300 text-amber-900 hover:bg-amber-200'
          }`}
          title="Click to change between Auto (Sunrise/Sunset), Light, or Dark theme"
        >
          {themePreference === 'auto' ? (
            solarThemeInfo?.isSolarDay ? (
              <div className="flex items-center gap-1 text-amber-300">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-extrabold text-[10px] uppercase tracking-wider bg-amber-500/20 px-1 py-0.5 rounded text-amber-200">Auto Day</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-amber-200">
                <Moon className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-extrabold text-[10px] uppercase tracking-wider bg-amber-500/20 px-1 py-0.5 rounded text-amber-200">Auto Night</span>
              </div>
            )
          ) : (
            <div className="flex items-center gap-1">
              {themeMode === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span className="capitalize">{themePreference} Mode</span>
            </div>
          )}

          <ChevronDown className={`w-3 h-3 text-amber-400/70 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <ThemeDropdownMenu
              themePreference={themePreference}
              solarThemeInfo={solarThemeInfo}
              onSelect={handleSelectPreference}
              onClose={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ========================================================================= */
  /* VARIANT 3: HEADER (Primary action button next to Notifications in Header) */
  /* ========================================================================= */
  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 hover:border-amber-400/60 dark:hover:border-amber-500/60 transition-all cursor-pointer shadow-xs group"
        title={`Theme Switcher: ${
          themePreference === 'auto'
            ? `Auto Solar Mode (${solarThemeInfo?.effectiveTheme === 'dark' ? 'Night' : 'Day'})`
            : `${themePreference} Mode`
        }. Click to configure.`
        }
      >
        {/* Animated Solar / Theme Icon */}
        <div className="relative">
          {themePreference === 'auto' ? (
            solarThemeInfo?.isSolarDay ? (
              <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-600 dark:text-amber-400 transition-transform group-hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-500 dark:text-amber-300 transition-transform group-hover:-rotate-12" />
            )
          ) : themeMode === 'dark' ? (
            <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-indigo-400 dark:text-amber-300" />
          ) : (
            <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-600 dark:text-amber-400" />
          )}

          {/* Micro "Auto" indicator badge */}
          {themePreference === 'auto' && (
            <span
              className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-white dark:border-slate-900 ${
                solarThemeInfo?.isSolarDay ? 'bg-amber-500' : 'bg-indigo-500'
              }`}
            />
          )}
        </div>

        {/* Label for medium+ screens */}
        <div className="hidden md:flex flex-col text-left leading-tight">
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
            {themePreference === 'auto' ? 'Solar Auto' : themePreference === 'dark' ? 'Dark' : 'Light'}
          </span>
          <span className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold tracking-tight">
            {themePreference === 'auto'
              ? solarThemeInfo?.isSolarDay
                ? 'Daylight'
                : 'Nighttime'
              : 'Manual'}
          </span>
        </div>

        <ChevronDown
          className={`w-3 h-3 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-amber-500' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <ThemeDropdownMenu
            themePreference={themePreference}
            solarThemeInfo={solarThemeInfo}
            onSelect={handleSelectPreference}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ========================================================================= */
/* SUB-COMPONENT: ELEGANT SPIRITUAL THEME DROPDOWN MENU                     */
/* ========================================================================= */
interface ThemeDropdownMenuProps {
  themePreference: ThemePreference;
  solarThemeInfo: any;
  onSelect: (pref: ThemePreference) => void;
  onClose: () => void;
}

const ThemeDropdownMenu: React.FC<ThemeDropdownMenuProps> = ({
  themePreference,
  solarThemeInfo,
  onSelect,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.96 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute right-0 mt-2 w-80 sm:w-92 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-amber-200/60 dark:border-amber-900/50 p-3.5 z-50 overflow-hidden text-slate-800 dark:text-slate-100"
    >
      {/* Decorative Gold Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-900 dark:text-white">
              Spiritual Theme Mode
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Astronomical Sunrise & Sunset Synchronization
            </p>
          </div>
        </div>

        {solarThemeInfo?.preference === 'auto' && (
          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60">
            Active
          </span>
        )}
      </div>

      {/* Options List */}
      <div className="space-y-2">
        {/* OPTION 1: AUTO SOLAR (SUNRISE / SUNSET) */}
        <button
          type="button"
          onClick={() => onSelect('auto')}
          className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer relative ${
            themePreference === 'auto'
              ? 'bg-gradient-to-r from-amber-50/90 to-amber-100/40 dark:from-amber-950/40 dark:to-slate-900/60 border-amber-400 dark:border-amber-500/70 shadow-sm'
              : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-750 hover:bg-amber-50/40 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shrink-0 mt-0.5">
                {solarThemeInfo?.isSolarDay ? (
                  <Sunrise className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                ) : (
                  <Sunset className="w-4 h-4 text-amber-500 dark:text-amber-300" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    Auto Solar (Recommended)
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold rounded">
                    {solarThemeInfo?.isSolarDay ? '☀️ Day Active' : '🌙 Night Active'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  Automatically shifts to <strong>Light Mode</strong> at Sunrise ({solarThemeInfo?.sunrise || '06:04 AM'}) and <strong>Dark Mode</strong> at Sunset ({solarThemeInfo?.sunset || '07:20 PM'}).
                </p>

                {/* Live Countdown to Next Transition */}
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 pt-1">
                  <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>Next: {solarThemeInfo?.nextTransitionLabel || 'Loading...'}</span>
                </div>
              </div>
            </div>

            {themePreference === 'auto' && (
              <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </div>
        </button>

        {/* OPTION 2: FIXED LIGHT MODE */}
        <button
          type="button"
          onClick={() => onSelect('light')}
          className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
            themePreference === 'light'
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 dark:border-amber-600 shadow-sm'
              : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/70 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 shrink-0">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Always Light
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Pure parchment aesthetic with golden accents
                </p>
              </div>
            </div>
            {themePreference === 'light' && (
              <div className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            )}
          </div>
        </button>

        {/* OPTION 3: FIXED DARK MODE */}
        <button
          type="button"
          onClick={() => onSelect('dark')}
          className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
            themePreference === 'dark'
              ? 'bg-slate-800 dark:bg-slate-800 border-amber-400 dark:border-amber-600 shadow-sm'
              : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/70 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-indigo-600 dark:text-amber-300 shrink-0">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Always Dark
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Soothing midnight stone theme for low-light reading
                </p>
              </div>
            </div>
            {themePreference === 'dark' && (
              <div className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Spiritual Insight Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-[10px] text-slate-600 dark:text-slate-400 bg-amber-50/50 dark:bg-slate-800/40 p-2 rounded-xl">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Jain Dinacharya (Sacred Rhythm):
          </span>{' '}
          {solarThemeInfo?.spiritualTip ||
            'Daytime promotes active Swadhyay and temple darshan; evening initiates Pratikraman and introspective peace.'}
        </div>
      </div>
    </motion.div>
  );
};
