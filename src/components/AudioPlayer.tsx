import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  Music,
  ListMusic,
  X
} from 'lucide-react';

export const AudioPlayer: React.FC = () => {
  const {
    currentSong,
    isPlayingSong,
    pauseSong,
    togglePlaySong,
    setIsBhajanModalOpen
  } = useApp();

  // Only display the sleek mini bar when a song is actively playing
  if (!isPlayingSong || !currentSong) return null;

  return (
    <div className="fixed bottom-3 right-3 sm:right-6 z-40 font-sans animate-fade-in">
      <div className="bg-slate-900/95 backdrop-blur-md border border-amber-500/40 text-white rounded-full px-4 py-2 shadow-2xl flex items-center gap-3 max-w-md">
        {/* Animated Music Icon */}
        <div
          onClick={() => setIsBhajanModalOpen(true)}
          className="p-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md cursor-pointer hover:scale-105 transition-transform shrink-0"
          title="Open Devotional Songs Library"
        >
          <Music className="w-4 h-4 animate-bounce" />
        </div>

        {/* Song Details */}
        <div
          onClick={() => setIsBhajanModalOpen(true)}
          className="cursor-pointer max-w-[150px] sm:max-w-[200px] truncate"
          title="Click to view full Music Library"
        >
          <p className="text-xs font-serif font-bold text-amber-300 truncate">
            {currentSong.title}
          </p>
          <p className="text-[10px] text-slate-300 truncate">
            {currentSong.hindiTitle || currentSong.singer || currentSong.category}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0 ml-1">
          <button
            onClick={() => togglePlaySong(currentSong)}
            className="p-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md transition-all active:scale-95 flex items-center justify-center"
            title="Pause Playback"
          >
            <Pause className="w-3.5 h-3.5 fill-slate-950" />
          </button>

          <button
            onClick={() => setIsBhajanModalOpen(true)}
            className="p-1.5 rounded-full hover:bg-slate-800 text-amber-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-semibold"
            title="View All Bhajans & Songs"
          >
            <ListMusic className="w-4 h-4" />
            <span className="hidden sm:inline">Songs</span>
          </button>

          <button
            onClick={() => pauseSong()}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-0.5"
            title="Stop & Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
