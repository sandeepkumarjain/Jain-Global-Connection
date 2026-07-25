import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Music,
  Play,
  Pause,
  X,
  Search,
  Sparkles,
  FileText,
  ChevronDown,
  ChevronUp,
  Volume2,
  Radio,
  User,
  Compass,
  Calendar,
  Zap,
  Filter,
  RotateCcw
} from 'lucide-react';

export const BhajanLibraryModal: React.FC = () => {
  const {
    bhajans,
    currentSong,
    isPlayingSong,
    playSong,
    pauseSong,
    togglePlaySong,
    isBhajanModalOpen,
    setIsBhajanModalOpen
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSinger, setSelectedSinger] = useState<string>('All');
  const [selectedSect, setSelectedSect] = useState<string>('All');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All');
  const [modalSearch, setModalSearch] = useState('');
  const [expandedLyricsId, setExpandedLyricsId] = useState<string | null>(null);

  const categories = ['All', 'Navkar Mantra', 'Stavan', 'Bhajan', 'Aarti', 'Bhaktamar', 'Stuti'];
  const sects = ['All', 'Swetambar', 'Digambar'];
  const occasions = ['All', 'Morning Bhakti', 'Paryushan', 'Mahavir Jayanti', 'Diksha', 'Diwali', 'General'];

  const activeSongs = useMemo(() => bhajans.filter((b) => b.isActive), [bhajans]);

  // Extract unique singers from active songs
  const singers = useMemo(() => {
    const list = activeSongs
      .map((s) => s.singer)
      .filter((singer): singer is string => Boolean(singer && singer.trim().length > 0));
    return ['All', ...Array.from(new Set(list))];
  }, [activeSongs]);

  if (!isBhajanModalOpen) return null;

  const filteredSongs = activeSongs.filter((song) => {
    const matchesCategory = selectedCategory === 'All' || song.category === selectedCategory;
    const matchesSinger = selectedSinger === 'All' || song.singer === selectedSinger;
    const matchesSect =
      selectedSect === 'All' || !song.sect || song.sect === 'All' || song.sect === selectedSect;
    const matchesOccasion =
      selectedOccasion === 'All' || !song.occasion || song.occasion === selectedOccasion;

    const q = modalSearch.toLowerCase().trim();
    const matchesQuery =
      !q ||
      song.title.toLowerCase().includes(q) ||
      (song.hindiTitle && song.hindiTitle.toLowerCase().includes(q)) ||
      (song.singer && song.singer.toLowerCase().includes(q)) ||
      (song.category && song.category.toLowerCase().includes(q)) ||
      (song.occasion && song.occasion.toLowerCase().includes(q));

    return matchesCategory && matchesSinger && matchesSect && matchesOccasion && matchesQuery;
  });

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedSinger('All');
    setSelectedSect('All');
    setSelectedOccasion('All');
    setModalSearch('');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedSinger !== 'All' ||
    selectedSect !== 'All' ||
    selectedOccasion !== 'All' ||
    modalSearch.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-white dark:bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-amber-950 to-slate-950 p-5 text-white flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Music className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-serif font-bold text-amber-300 flex items-center gap-2">
                <span>Jain Devotional Bhajan & Stavan Library</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-sans px-2.5 py-0.5 rounded-full border border-amber-500/30 font-extrabold">
                  {activeSongs.length} Tracks
                </span>
              </h2>
              <p className="text-xs text-slate-300 font-serif">
                भक्ति संगीत, स्तवन, आरती, भक्तामर एवं जाप संग्रह
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBhajanModalOpen(false)}
            className="p-2.5 rounded-full bg-slate-800/80 hover:bg-amber-600/30 text-slate-300 hover:text-white transition-all border border-slate-700"
            title="Close Library"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 space-y-3 shrink-0">
          {/* Top Search Input & Reset Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search track title, singer, category, or occasion..."
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-amber-500/50 outline-none text-slate-900 dark:text-white shadow-sm"
              />
              {modalSearch && (
                <button
                  onClick={() => setModalSearch('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3 py-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 text-amber-900 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 border border-amber-300/50 shrink-0 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Filters</span>
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3 text-amber-500" /> Category Filter
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Dropdown Filters: Singer, Sect, Occasion */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {/* Filter by Singer */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1">
                <User className="w-3 h-3 text-amber-500" /> Filter Singer
              </label>
              <select
                value={selectedSinger}
                onChange={(e) => setSelectedSinger(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/50 outline-none"
              >
                {singers.map((singer) => (
                  <option key={singer} value={singer}>
                    {singer === 'All' ? '🎙️ All Singers' : `🎙️ ${singer}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Sect */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1">
                <Compass className="w-3 h-3 text-amber-500" /> Filter Sect
              </label>
              <select
                value={selectedSect}
                onChange={(e) => setSelectedSect(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/50 outline-none"
              >
                {sects.map((s) => (
                  <option key={s} value={s}>
                    {s === 'All' ? '🏛️ All Sects' : `🏛️ ${s}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Occasion */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-500" /> Filter Occasion
              </label>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/50 outline-none"
              >
                {occasions.map((o) => (
                  <option key={o} value={o}>
                    {o === 'All' ? '✨ All Occasions' : `✨ ${o}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Songs List Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 no-scrollbar">
          {filteredSongs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-3">
              <Radio className="w-12 h-12 text-amber-500/40 mx-auto animate-pulse" />
              <div className="space-y-1">
                <p className="font-bold text-base text-slate-800 dark:text-slate-200">
                  No Devotional Tracks Found
                </p>
                <p className="text-xs text-slate-500">
                  Try clearing or adjusting your Category, Singer, Sect, or Occasion filters.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 shadow-md inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Show All Tracks
              </button>
            </div>
          ) : (
            filteredSongs.map((song) => {
              const isThisPlaying = isPlayingSong && currentSong?.id === song.id;
              const isThisLoaded = currentSong?.id === song.id;
              const hasLyrics = Boolean(song.lyrics && song.lyrics.trim().length > 0);
              const showLyrics = expandedLyricsId === song.id;

              return (
                <div
                  key={song.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isThisPlaying
                      ? 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-500/60 shadow-lg ring-1 ring-amber-500/40'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-amber-500/40 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Track Play Toggle & Details */}
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      {/* Play/Pause Main Icon */}
                      <button
                        onClick={() => togglePlaySong(song)}
                        className={`p-3 rounded-2xl shrink-0 transition-all shadow-md mt-0.5 sm:mt-0 ${
                          isThisPlaying
                            ? 'bg-amber-500 text-slate-950 animate-pulse scale-105'
                            : 'bg-slate-100 dark:bg-slate-700 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-slate-950'
                        }`}
                        title={isThisPlaying ? 'Pause Track' : 'Play Track'}
                      >
                        {isThisPlaying ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </button>

                      {/* Track Meta Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                            {song.title}
                          </h4>
                          {isThisPlaying && (
                            <span className="flex items-center gap-1 bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30">
                              <Volume2 className="w-3 h-3 animate-bounce" /> Playing
                            </span>
                          )}
                        </div>

                        {song.hindiTitle && (
                          <p className="text-xs font-serif text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                            {song.hindiTitle}
                          </p>
                        )}

                        {/* Metadata Tags: Singer, Category, Sect, Occasion */}
                        <div className="flex items-center gap-1.5 flex-wrap mt-2 text-[10px] font-semibold">
                          {/* Category Badge */}
                          <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 rounded-md border border-amber-300/40">
                            {song.category}
                          </span>

                          {/* Singer Tag */}
                          {song.singer && (
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 rounded-md border border-slate-200 dark:border-slate-600 flex items-center gap-1">
                              <User className="w-2.5 h-2.5 text-amber-500" />
                              {song.singer}
                            </span>
                          )}

                          {/* Sect Tag */}
                          {song.sect && song.sect !== 'All' && (
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 rounded-md border border-slate-200 dark:border-slate-600 flex items-center gap-1">
                              <Compass className="w-2.5 h-2.5 text-amber-500" />
                              {song.sect}
                            </span>
                          )}

                          {/* Occasion Tag */}
                          {song.occasion && (
                            <span className="px-2 py-0.5 bg-amber-50 dark:bg-slate-700/80 text-amber-800 dark:text-amber-200 rounded-md border border-amber-200 dark:border-slate-600 flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5 text-amber-500" />
                              {song.occasion}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Action Controls: Lyrics & Quick-Play Button */}
                    <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700/50">
                      {hasLyrics && (
                        <button
                          onClick={() => setExpandedLyricsId(showLyrics ? null : song.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="View Lyrics"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-500" />
                          <span>Lyrics</span>
                          {showLyrics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      )}

                      {/* Prominent Quick-Play Button triggers Global Player */}
                      <button
                        onClick={() => {
                          if (isThisPlaying) {
                            pauseSong();
                          } else {
                            playSong(song);
                          }
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                          isThisPlaying
                            ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 ring-2 ring-amber-400/50'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 hover:shadow-md'
                        }`}
                        title="Quick Play in Global Audio Player"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>{isThisPlaying ? 'Pause Audio' : '⚡ Quick Play'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Lyrics Drawer */}
                  {showLyrics && song.lyrics && (
                    <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 animate-fade-in">
                      <p className="font-bold text-[10px] uppercase text-amber-600 dark:text-amber-400 tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Lyrics & Verses (गीत एवं पंक्तियाँ)
                      </p>
                      <p className="whitespace-pre-line text-slate-700 dark:text-slate-300 font-serif leading-relaxed italic text-xs sm:text-sm">
                        {song.lyrics}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Sticky Bottom Global Player Controller Bar */}
        {currentSong && (
          <div className="p-3.5 bg-slate-950 text-white border-t border-amber-500/30 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold shrink-0 animate-pulse">
                <Music className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] uppercase text-amber-400 font-bold tracking-wider">
                    Global Audio Player
                  </p>
                  {isPlayingSong && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-500/30">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-white font-serif truncate">{currentSong.title}</p>
                {currentSong.hindiTitle && (
                  <p className="text-[10px] text-amber-300 font-serif truncate">{currentSong.hindiTitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => (isPlayingSong ? pauseSong() : playSong(currentSong))}
                className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:bg-amber-400"
              >
                {isPlayingSong ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
