import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Share2,
  Copy,
  Check,
  Clock,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const PanchangWidget: React.FC = () => {
  const { panchang, showToast } = useApp();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(`${panchang.dailyQuote.text} - ${panchang.dailyQuote.source}`);
    setCopiedQuote(true);
    showToast('Quote Copied!', 'Jain daily quote copied to clipboard.', 'success');
    setTimeout(() => setCopiedQuote(false), 3000);
  };

  const toggleNavkarMantra = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      showToast('Playing Navkar Mantra Chanting', 'Namo Arihantanam... Namo Siddhanam...', 'info');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
              Jain Panchang & Daily Tithi
              <span className="text-[10px] bg-amber-500 text-amber-950 px-2 py-0.5 rounded font-bold uppercase">
                LIVE
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{panchang.date}</p>
          </div>
        </div>

        {/* Audio Player Button */}
        <button
          onClick={toggleNavkarMantra}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-sm ${
            isPlayingAudio
              ? 'bg-amber-500 text-amber-950 border-amber-400 animate-pulse'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60 hover:bg-amber-100'
          }`}
        >
          {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{isPlayingAudio ? 'Playing Navkar Mantra' : 'Play Navkar Mantra'}</span>
        </button>
      </div>

      {/* Main Tithi Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-slate-900 border border-amber-200 dark:border-amber-900/40">
          <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Today's Tithi</p>
          <p className="text-sm font-black text-slate-900 dark:text-amber-100 mt-1 font-serif">{panchang.tithi}</p>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-slate-900 border border-amber-200 dark:border-amber-900/40">
          <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Jain Masa / Month</p>
          <p className="text-sm font-black text-slate-900 dark:text-amber-100 mt-1 font-serif">{panchang.month}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex items-center gap-3">
          <Sun className="w-6 h-6 text-amber-500 shrink-0" />
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Sunrise</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{panchang.sunrise}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 flex items-center gap-3">
          <Moon className="w-6 h-6 text-indigo-400 shrink-0" />
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Sunset</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{panchang.sunset}</p>
          </div>
        </div>
      </div>

      {/* Choghadiya Timings */}
      <div>
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          Today's Day Choghadiya Schedule
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {panchang.choghadiyaDay.map((c, idx) => {
            const isGood = c.type === 'Auspicious';
            return (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border text-xs ${
                  isGood
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{c.name}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      isGood ? 'bg-emerald-200 text-emerald-950' : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {c.type}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">{c.time}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Quote Box */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-amber-700/10 border border-amber-400/40 rounded-xl p-4 relative">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Daily Jain Agam Quote
            </p>
            <p className="text-sm font-serif italic text-slate-800 dark:text-slate-200 font-medium">
              {panchang.dailyQuote.text}
            </p>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
              — {panchang.dailyQuote.source}
            </p>
          </div>

          <button
            onClick={handleCopyQuote}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors shrink-0"
            title="Copy Quote"
          >
            {copiedQuote ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Upcoming Jain Parva / Festivals */}
      <div>
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          Upcoming Sacred Jain Parva Calendar
        </h3>
        <div className="space-y-2">
          {panchang.upcomingFestivals.map((f, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{f.name}</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">{f.description}</p>
              </div>
              <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono font-bold rounded-lg shrink-0">
                {f.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
