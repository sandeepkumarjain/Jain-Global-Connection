import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { playNavkarMantraAudio, stopNavkarMantraAudio } from '../utils/navkarAudio';
import {
  Sparkles,
  Heart,
  Building2,
  MapPin,
  Droplet,
  Music,
  Users,
  Compass,
  Volume2,
  VolumeX,
  Navigation,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Search,
  ExternalLink,
  Flame,
  Globe
} from 'lucide-react';

export const GlobalSanghHighlights: React.FC = () => {
  const {
    temples,
    businesses,
    matrimonials,
    bloodDonors,
    bhajans,
    sanghas,
    openSanghaMap,
    setActiveTab,
    setIsAISearchOpen,
    showToast,
    panchang
  } = useApp();

  const [activeTab, setActiveTabFilter] = useState<'temples' | 'businesses' | 'matrimonial' | 'blood' | 'bhajans' | 'sangha'>('temples');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleNavkarMantra = () => {
    if (isPlayingAudio) {
      stopNavkarMantraAudio();
      setIsPlayingAudio(false);
      showToast('Navkar Audio Paused', 'Audio chanting stopped.', 'info');
    } else {
      setIsPlayingAudio(true);
      showToast('Playing Navkar Mantra Chanting', 'Namo Arihantanam... Namo Siddhanam...', 'info');
      playNavkarMantraAudio(() => {
        setIsPlayingAudio(false);
      });
    }
  };

  // Top 4 featured items per tab
  const featuredTemples = temples.slice(0, 4);
  const featuredBusinesses = businesses.slice(0, 4);
  const featuredMatrimonials = matrimonials.slice(0, 4);
  const featuredDonors = bloodDonors.slice(0, 4);
  const featuredBhajans = bhajans.slice(0, 4);

  return (
    <section className="bg-gradient-to-b from-amber-500/5 via-amber-50/40 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 rounded-3xl border border-amber-200/80 dark:border-slate-800 p-5 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Title Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-100 dark:border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-100/80 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-700/60 rounded-full text-amber-900 dark:text-amber-300 text-[11px] font-extrabold uppercase tracking-widest shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
            <span>Jai Jinendra • Global Sangh Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Explore the Global Jain Ecosystem</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal">
            Verified matrimonial candidates, holy tirths, GST businesses, emergency donors, and sacred stavan audio.
          </p>
        </div>

        {/* Live Chanting Floating Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleNavkarMantra}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 shadow-sm cursor-pointer min-h-[44px] ${
              isPlayingAudio
                ? 'bg-amber-500 text-white animate-pulse ring-2 ring-amber-400'
                : 'bg-amber-100/70 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-300 border border-amber-200/80 dark:border-slate-700'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4 text-white" />
                <span>Pause Navkar Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>Play Navkar Mantra</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsAISearchOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 min-h-[44px] cursor-pointer"
          >
            <Search className="w-4 h-4 text-amber-200" />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Navigation Pillar Tabs */}
      <div className="relative z-10 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'temples', label: 'Holy Temples & Tirths', icon: MapPin, count: temples.length, color: 'text-emerald-600 dark:text-emerald-400' },
          { id: 'sangha', label: 'Sangha & Mandals Map', icon: Compass, count: sanghas.length, color: 'text-purple-600 dark:text-purple-400' },
          { id: 'matrimonial', label: 'Matrimonial Matches', icon: Heart, count: matrimonials.length, color: 'text-red-600 dark:text-red-400' },
          { id: 'businesses', label: 'Verified Businesses', icon: Building2, count: businesses.length, color: 'text-amber-600 dark:text-amber-400' },
          { id: 'blood', label: 'Blood Donors Sangh', icon: Droplet, count: bloodDonors.length, color: 'text-rose-600 dark:text-rose-400' },
          { id: 'bhajans', label: 'Stavan & Bhajans', icon: Music, count: bhajans.length, color: 'text-sky-600 dark:text-sky-400' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabFilter(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer min-h-[44px] border ${
                isActive
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 hover:bg-amber-50/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-amber-200/80 dark:border-slate-800 hover:border-amber-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-amber-100/70 dark:bg-amber-950 text-amber-900 dark:text-amber-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display Cards */}
      <div className="relative z-10">
        {/* 1. Temples Tab */}
        {activeTab === 'temples' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredTemples.map((t) => (
                <div
                  key={t.id}
                  className="bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative h-32 overflow-hidden bg-amber-50 dark:bg-slate-800">
                    <img
                      src={t.photoUrl || '/src/assets/images/jain_temple_banner_1784713506779.jpg'}
                      alt={t.templeName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-amber-900 dark:text-amber-300 rounded-md text-[10px] font-bold border border-amber-200 dark:border-slate-700 shadow-xs">
                      {t.sect}
                    </span>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                        {t.templeName}
                      </h3>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="line-clamp-1">{t.city}, {t.state}</span>
                      </p>
                      <p className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold mt-1">
                        Deity: {t.mainDeity}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-amber-100 dark:border-slate-800 gap-2">
                      <a
                        href={
                          t.lat && t.lng
                            ? `https://www.google.com/maps/dir/?api=1&destination=${t.lat},${t.lng}`
                            : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(t.templeName + ' ' + t.city)}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 bg-amber-50 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-300 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-amber-200 dark:border-slate-700 shrink-0 min-h-[32px]"
                      >
                        <Navigation className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                        <span>Directions</span>
                      </a>

                      <button
                        onClick={() => setActiveTab('temple')}
                        className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:underline flex items-center gap-0.5"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveTab('temple')}
                className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:text-amber-900 flex items-center gap-1 group cursor-pointer"
              >
                <span>Browse All {temples.length} Sacred Temples & Tirths</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* 1.5 Sangha & Mandals Map Tab */}
        {activeTab === 'sangha' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sanghas.slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  className="bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-slate-800 rounded-2xl p-4 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-lg transition-all duration-300 space-y-3 flex flex-col justify-between group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded text-[9px] font-bold">
                        {s.category}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        {s.tradition}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                      {s.name}
                    </h3>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-500 shrink-0" />
                      <span>{s.city}, {s.state}</span>
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {s.description}
                    </p>
                  </div>

                  <div className="border-t border-purple-100 dark:border-slate-800 pt-2 space-y-1 text-[10px] text-slate-600 dark:text-slate-300">
                    <p className="truncate">👤 Contact: {s.contactPerson}</p>
                    <p className="truncate font-mono">📞 {s.phone}</p>
                  </div>

                  <button
                    onClick={() => openSanghaMap()}
                    className="w-full py-2 bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-slate-700 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer min-h-[36px]"
                  >
                    <Compass className="w-3.5 h-3.5 text-purple-600" />
                    <span>View on Leaflet Map</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => openSanghaMap()}
                className="text-xs font-bold text-purple-700 dark:text-purple-400 hover:text-purple-800 flex items-center gap-1 group cursor-pointer"
              >
                <span>Explore Global Sangha Map with {sanghas.length} Pinned Mandals</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* 2. Matrimonial Tab */}
        {activeTab === 'matrimonial' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredMatrimonials.map((m) => (
                <div
                  key={m.id}
                  className="bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 rounded-2xl p-4 hover:border-red-400 dark:hover:border-red-500 hover:shadow-lg transition-all duration-300 space-y-3 flex flex-col justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.photoUrl || (m.gender === 'female' ? '/src/assets/images/default_bride.jpg' : '/src/assets/images/default_groom.jpg')}
                      alt={m.fullName}
                      className="w-12 h-12 rounded-xl object-cover border border-red-200 dark:border-red-800 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors truncate">
                        {m.fullName}
                      </h3>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                        {m.age} Yrs • {m.height} • {m.sect}
                      </p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded text-[9px] font-bold uppercase">
                        {m.gender === 'female' ? 'Bride Candidate' : 'Groom Candidate'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300 border-t border-amber-100 dark:border-slate-800 pt-2">
                    <p className="truncate">🎓 {m.education || 'Graduate'}</p>
                    <p className="truncate">💼 {m.occupation || 'Professional'}</p>
                    <p className="truncate">📍 {m.city}, {m.state}</p>
                  </div>

                  <button
                    onClick={() => setActiveTab('matrimonial')}
                    className="w-full py-2 bg-red-50 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-slate-700 text-red-800 dark:text-red-300 border border-red-200 dark:border-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer min-h-[36px]"
                  >
                    <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                    <span>View Profile</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveTab('matrimonial')}
                className="text-xs font-bold text-red-700 dark:text-red-400 hover:text-red-800 flex items-center gap-1 group cursor-pointer"
              >
                <span>Search All {matrimonials.length} Matrimonial Profiles</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* 3. Businesses Tab */}
        {activeTab === 'businesses' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredBusinesses.map((b) => (
                <div
                  key={b.id}
                  className="bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 rounded-2xl p-4 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-lg transition-all duration-300 space-y-3 flex flex-col justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-amber-100/70 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded text-[9px] font-bold">
                        {b.category}
                      </span>
                      {b.isVerified && (
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Verified
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                      {b.businessName}
                    </h3>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                      👤 {b.ownerName}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                      📍 {b.city}, {b.state}
                    </p>
                  </div>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 border-t border-amber-100 dark:border-slate-800 pt-2 font-normal">
                    {b.description || 'Verified Jain-owned business enterprise.'}
                  </p>

                  <button
                    onClick={() => setActiveTab('business')}
                    className="w-full py-2 bg-amber-50 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer min-h-[36px]"
                  >
                    <Building2 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                    <span>View Business Card</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveTab('business')}
                className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:text-amber-900 flex items-center gap-1 group cursor-pointer"
              >
                <span>Browse All {businesses.length} Jain Businesses</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* 4. Blood Donors Tab */}
        {activeTab === 'blood' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredDonors.map((d) => (
                <div
                  key={d.id}
                  className="bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 rounded-2xl p-4 hover:border-rose-400 dark:hover:border-rose-500 hover:shadow-lg transition-all duration-300 space-y-3 flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl font-black text-xs flex items-center gap-1">
                      <Droplet className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                      <span>{d.bloodGroup}</span>
                    </span>
                    <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      Available
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-1">
                      {d.fullName}
                    </h3>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>{d.city}, {d.state}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('emergency')}
                    className="w-full py-2 bg-rose-50 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-slate-700 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer min-h-[36px]"
                  >
                    <Droplet className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    <span>Emergency Contact</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveTab('emergency')}
                className="text-xs font-bold text-rose-700 dark:text-rose-400 hover:text-rose-800 flex items-center gap-1 group cursor-pointer"
              >
                <span>Access Emergency Blood Donor Registry</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* 5. Bhajans & Stavan Tab */}
        {activeTab === 'bhajans' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredBhajans.map((bh) => (
                <div
                  key={bh.id}
                  className="bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 rounded-2xl p-4 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-lg transition-all duration-300 space-y-3 flex flex-col justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-sky-50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 rounded-xl text-sky-700 dark:text-sky-300 group-hover:scale-110 transition-transform">
                      <Music className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors truncate">
                        {bh.title}
                      </h3>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                        🎤 {bh.singer || 'Traditional Stavan'}
                      </p>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 border-t border-amber-100 dark:border-slate-800 pt-2">
                    Category: {bh.category || 'Bhajan'}
                  </p>

                  <button
                    onClick={toggleNavkarMantra}
                    className="w-full py-2 bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer min-h-[36px]"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>Play Audio Chanting</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={toggleNavkarMantra}
                className="text-xs font-bold text-sky-700 dark:text-sky-400 hover:text-sky-800 flex items-center gap-1 group cursor-pointer"
              >
                <span>Listen to Sacred Navkar Audio Stavan</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
