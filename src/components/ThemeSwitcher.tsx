import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, ChevronDown, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className = '',
  showLabel = true,
}) => {
  const { themeMode, setThemeMode, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeOptions = [
    {
      id: 'light' as const,
      label: 'Light Mode',
      shortLabel: 'Light',
      icon: Sun,
      iconColor: 'text-amber-500',
      activeBg: 'bg-amber-50 dark:bg-slate-800 text-amber-900 dark:text-amber-300 font-bold border border-amber-200 dark:border-slate-700',
      toastMsg: 'Light theme enabled.',
    },
    {
      id: 'dark' as const,
      label: 'Dark Mode',
      shortLabel: 'Dark',
      icon: Moon,
      iconColor: 'text-sky-400',
      activeBg: 'bg-slate-800 text-sky-300 font-bold border border-slate-700',
      toastMsg: 'Dark theme enabled.',
    },
  ];

  const currentTheme = themeOptions.find((t) => t.id === themeMode) || themeOptions[0];
  const CurrentIcon = currentTheme.icon;

  const handleCycleTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextMode);
    const nextObj = themeOptions.find((t) => t.id === nextMode);
    showToast('Theme Updated', nextObj?.toastMsg || 'Theme changed.', 'info');
  };

  const handleSelectTheme = (mode: 'light' | 'dark') => {
    setThemeMode(mode);
    setIsOpen(false);
    const selected = themeOptions.find((t) => t.id === mode);
    showToast('Theme Updated', selected?.toastMsg || 'Theme changed.', 'info');
  };

  return (
    <div className={`relative flex items-center ${className}`} ref={containerRef}>
      <div
        className={`flex items-center rounded-full p-0.5 border shadow-sm transition-all ${
          themeMode === 'dark'
            ? 'bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-800'
            : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
        }`}
      >
        {/* Single Click Cycle Theme Button */}
        <button
          type="button"
          onClick={handleCycleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold cursor-pointer hover:opacity-85 transition-opacity"
          title={`Current: ${currentTheme.label}. Click to toggle (Light <-> Dark)`}
          aria-label={`Toggle Theme Mode (Current: ${currentTheme.label})`}
        >
          <CurrentIcon className={`w-4 h-4 ${currentTheme.iconColor}`} />
          {showLabel && (
            <span className="text-[11px] font-extrabold hidden sm:inline capitalize">
              {currentTheme.shortLabel}
            </span>
          )}
        </button>

        {/* Dropdown Chevron for explicit selection */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-1 py-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          title="Choose Theme Mode"
          aria-label="Open Theme Selection Menu"
          aria-expanded={isOpen}
        >
          <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-300 transition-transform ${isOpen ? 'rotate-180 text-amber-500' : ''}`} />
        </button>
      </div>

      {/* Theme Popover Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-amber-500/30 dark:border-amber-700/50 p-2 z-50 animate-fade-in">
          <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Site Theme Mode</p>
            <span className="text-[9px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-bold">
              GLOBAL
            </span>
          </div>

          <div className="space-y-1">
            {themeOptions.map((option) => {
              const IconComp = option.icon;
              const isSelected = themeMode === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectTheme(option.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? option.activeBg
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IconComp className={`w-4 h-4 ${option.iconColor}`} />
                    <span>{option.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
