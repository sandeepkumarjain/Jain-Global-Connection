import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  ListMusic,
  Sparkles,
  Radio,
  Disc3,
  Heart,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { BhajanSong } from '../../types';

export const AudioPlayerWidget: React.FC = () => {
  const {
    bhajans,
    currentSong,
    isPlayingSong,
    playSong,
    pauseSong,
    togglePlaySong,
    isPlayingNavkar,
    toggleNavkarAudio,
    setIsBhajanModalOpen,
    showToast
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isMuted, setIsMuted] = useState(false);

  const categories = ['All', 'Navkar Mantra', 'Bhaktamar', 'Stavan', 'Aarti'];

  // Filter active songs
  const activeSongs = useMemo(() => bhajans.filter((b) => b.isActive), [bhajans]);

  const filteredSongs = useMemo(() => {
    if (selectedCategory === 'All') return activeSongs.slice(0, 6);
    return activeSongs.filter((s) => s.category === selectedCategory).slice(0, 6);
  }, [activeSongs, selectedCategory]);

  const effectiveCurrentSong = currentSong || activeSongs[0] || null;

  const handleNextSong = () => {
    if (!effectiveCurrentSong || activeSongs.length === 0) return;
    const currentIndex = activeSongs.findIndex((s) => s.id === effectiveCurrentSong.id);
    const nextIndex = (currentIndex + 1) % activeSongs.length;
    playSong(activeSongs[nextIndex]);
    if (showToast) {
      showToast('Now Playing', activeSongs[nextIndex].title, 'info');
    }
  };

  const handlePrevSong = () => {
    if (!effectiveCurrentSong || activeSongs.length === 0) return;
    const currentIndex = activeSongs.findIndex((s) => s.id === effectiveCurrentSong.id);
    const prevIndex = (currentIndex - 1 + activeSongs.length) % activeSongs.length;
    playSong(activeSongs[prevIndex]);
    if (showToast) {
      showToast('Now Playing', activeSongs[prevIndex].title, 'info');
    }
  };

  const handleTrackClick = (song: BhajanSong) => {
    if (currentSong?.id === song.id && isPlayingSong) {
      pauseSong();
    } else {
      playSong(song);
      if (showToast) {
        showToast('Playing Devotional Track', song.title, 'success');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5 overflow-hidden relative">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 rounded-2xl shadow-md shadow-amber-500/20 shrink-0">
            <Music className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white">
                Sacred Bhakti & Stotra Player
              </h3>
              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold uppercase rounded-full border border-amber-300 dark:border-amber-800">
                Devotional Audio
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Listen to sacred Navkar Mantra, 48 shlokas of Bhaktamar Stotra, and stavans.
            </p>
          </div>
        </div>

        {/* Action: Open Full Library */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleNavkarAudio()}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              isPlayingNavkar
                ? 'bg-amber-500 text-amber-950 border-amber-400 shadow-md animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-amber-800 dark:text-amber-300 border-slate-200 dark:border-slate-700'
            }`}
            title="Instant Navkar Mantra Chanting"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{isPlayingNavkar ? 'Mute Navkar' : 'Quick Navkar Chanting'}</span>
          </button>

          <button
            onClick={() => setIsBhajanModalOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span>Full Song Library</span>
          </button>
        </div>
      </div>

      {/* Main Player Visual Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
        
        {/* Left: Interactive Now Playing Player Card (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-amber-950 to-slate-950 text-white rounded-2xl p-5 border border-amber-500/40 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg">
                <Disc3 className={`w-5 h-5 ${isPlayingSong ? 'animate-spin' : ''}`} />
              </span>
              <span className="text-[11px] font-mono uppercase text-amber-300 font-bold tracking-wider">
                {isPlayingSong ? 'Active Playback' : 'Devotional Deck'}
              </span>
            </div>

            {effectiveCurrentSong && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-800 text-amber-300 rounded-full border border-amber-500/30">
                {effectiveCurrentSong.category}
              </span>
            )}
          </div>

          {/* Current Song Title & Singer */}
          <div className="space-y-1 my-2">
            <h4 className="text-base sm:text-lg font-bold font-serif text-white line-clamp-1">
              {effectiveCurrentSong ? effectiveCurrentSong.title : 'Navkar Mahamantra Recitation'}
            </h4>
            <p className="text-xs text-amber-200/80 line-clamp-1 font-medium">
              {effectiveCurrentSong?.hindiTitle || effectiveCurrentSong?.singer || 'Pujya Gurudev & Jain Sangeetkar'}
            </p>
          </div>

          {/* Visual Waveform Animation Bars */}
          <div className="flex items-center justify-center gap-1 h-8 px-2 bg-slate-950/60 rounded-xl border border-amber-500/20">
            {[40, 70, 90, 60, 30, 80, 100, 50, 75, 45, 95, 65, 85, 35, 70, 55, 90, 40].map((height, i) => (
              <div
                key={i}
                className={`w-1 bg-amber-400 rounded-full transition-all duration-300 ${
                  isPlayingSong ? 'animate-pulse' : 'opacity-40'
                }`}
                style={{
                  height: isPlayingSong ? `${Math.max(15, (height * (i % 3 + 1)) % 100)}%` : '20%',
                  animationDelay: `${i * 0.08}s`
                }}
              />
            ))}
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrevSong}
              className="p-2.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Previous Devotional Song"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (effectiveCurrentSong) {
                  togglePlaySong(effectiveCurrentSong);
                } else if (activeSongs[0]) {
                  playSong(activeSongs[0]);
                }
              }}
              className="p-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-full shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold flex items-center justify-center"
              title={isPlayingSong ? 'Pause Audio' : 'Play Devotional Audio'}
            >
              {isPlayingSong ? (
                <Pause className="w-5 h-5 fill-slate-950" />
              ) : (
                <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNextSong}
              className="p-2.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Next Devotional Song"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
            </button>
          </div>
        </div>

        {/* Right: Quick Playlist & Category Selector (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Playlist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredSongs.map((song) => {
              const isThisPlaying = currentSong?.id === song.id && isPlayingSong;

              return (
                <div
                  key={song.id}
                  onClick={() => handleTrackClick(song)}
                  className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 group ${
                    isThisPlaying
                      ? 'bg-amber-500/15 border-amber-500/60 shadow-sm dark:bg-amber-950/40'
                      : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50/60 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        isThisPlaying
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-xs'
                      }`}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-slate-950" />
                      ) : (
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold truncate ${
                          isThisPlaying ? 'text-amber-700 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {song.title}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate">
                        {song.category} • {song.singer || 'Devotional'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {song.occasion ? song.occasion.split(' ')[0] : 'Bhakti'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Info Footer Note */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Chanted with pure Bhavana & Vitarag devotion.</span>
            </span>
            <button
              onClick={() => setIsBhajanModalOpen(true)}
              className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore {activeSongs.length}+ tracks</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
