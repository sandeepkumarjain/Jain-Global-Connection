import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Calendar, Sparkles, Sun, Moon, Compass, ChevronRight, Bell } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

export const HomeDateBanner: React.FC = () => {
  const { panchang, setActiveTab, openDailyTithiAlert } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-50 rounded-2xl p-3 sm:p-4 shadow-md border border-amber-500/40 relative overflow-hidden group"
    >
      {/* Decorative Radial Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:14px_14px] opacity-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row flex-wrap items-center justify-between gap-3">
        {/* Left: Gregorian Date & Jain Tithi Info */}
        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5 text-xs sm:text-sm w-full md:w-auto">
          {/* Gregorian Date Pill */}
          <div className="flex items-center gap-2 bg-amber-900/80 px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-100 font-bold shadow-xs">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{panchang.date}</span>
          </div>

          <div className="hidden sm:block w-px h-5 bg-amber-500/30" />

          {/* Jain Tithi & Masa Pill */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/30 text-amber-200 px-3 py-1.5 rounded-xl border border-amber-400/30 font-extrabold shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
            <span className="text-amber-300">{panchang.month}</span>
            <span className="text-amber-500/60">•</span>
            <span className="text-amber-100">{panchang.tithi}</span>
          </div>
        </div>

        {/* Right: Sunrise/Sunset & Navigation CTA */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 text-xs w-full md:w-auto shrink-0 pt-1 md:pt-0 border-t md:border-t-0 border-amber-800/60">
          <div className="flex items-center gap-2.5 text-amber-200/90 font-medium text-[11px] sm:text-xs">
            <span className="flex items-center gap-1 bg-amber-950/60 px-2 py-1 rounded-lg border border-amber-500/20">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{panchang.sunrise}</span>
            </span>
            <span className="flex items-center gap-1 bg-amber-950/60 px-2 py-1 rounded-lg border border-amber-500/20">
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              <span>{panchang.sunset}</span>
            </span>
          </div>

          {/* Time-Based Automatic Solar Theme Switcher */}
          <ThemeSwitcher variant="banner" />

          <button
            onClick={openDailyTithiAlert}
            className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 hover:text-white border border-amber-400/40 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Show Daily Jain Tithi & Significant Upcoming Festivals Alert"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">Daily</span> Alert
          </button>

          <button
            onClick={() => setActiveTab('panchang')}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-1 cursor-pointer shrink-0"
            title="Open Jain Panchang & Pachkan Timings Portal"
          >
            <Compass className="w-3.5 h-3.5 text-slate-950" />
            <span>Full Panchang</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-950" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
