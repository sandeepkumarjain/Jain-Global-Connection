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

export const AuspiciousSanghHighlights: React.FC = () => {
  const {
    temples,
    businesses,
    matrimonials,
    bloodDonors,
    bhajans,
    setActiveTab,
    setIsAISearchOpen,
    showToast,
    panchang
  } = useApp();

  const [activeTab, setActiveTabFilter] = useState<'temples' | 'businesses' | 'matrimonial' | 'blood' | 'bhajans'>('temples');
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
    <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl border border-amber-500/30 p-5 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Title Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-300 text-[11px] font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Jai Jinendra • Auspicious Global Sangh Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight flex items-center gap-2">
            <span>Explore the Global Jain Ecosystem</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal">
            Verified matrimonial candidates, holy tirths, GST businesses, emergency donors, and sacred stavan audio.
          </p>
        </div>

        {/* Live Chanting Floating Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleNavkarMantra}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer min-h-[44px] ${
              isPlayingAudio
                ? 'bg-amber-400 text-amber-950 animate-pulse ring-2 ring-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4 text-amber-950" />
                <span>Pause Navkar Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Play Navkar Mantra</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsAISearchOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5 min-h-[44px] cursor-pointer"
          >
            <Search className="w-4 h-4 text-amber-300" />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Navigation Pillar Tabs */}
      <div className="relative z-10 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'temples', label: 'Holy Temples & Tirths', icon: MapPin, count: temples.length, color: 'text-emerald-400' },
          { id: 'matrimonial', label: 'Matrimonial Matches', icon: Heart, count: matrimonials.length, color: 'text-red-400' },
          { id: 'businesses', label: 'Verified Businesses', icon: Building2, count: businesses.length, color: 'text-amber-400' },
          { id: 'blood', label: 'Blood Donors Sangh', icon: Droplet, count: bloodDonors.length, color: 'text-rose-400' },
          { id: 'bhajans', label: 'Stavan & Bhajans', icon: Music, count: bhajans.length, color: 'text-sky-400' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabFilter(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer min-h-[44px] border ${
                isActive
                  ? 'bg-amber-500 text-amber-950 border-amber-400 shadow-xl scale-[1.02]'
                  : 'bg-slate-900/80 hover:bg-slate-800/90 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-950' : tab.color}`} />
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-amber-950/20 text-amber-950' : 'bg-slate-800 text-slate-400'
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
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative h-32 overflow-hidden bg-slate-900">
                    <img
                      src={t.photoUrl || '/src/assets/images/jain_temple_banner_1784713506779.jpg'}
                      alt={t.templeName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-slate-900/90 text-amber-300 rounded-md text-[10px] font-bold border border-slate-700">
                      {t.sect}
                    </span>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-sm text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                        {t.templeName}
                      </h3>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="line-clamp-1">{t.city}, {t.state}</span>
                      </p>
                      <p className="text-[10px] text-amber-300 font-medium mt-1">
                        Deity: {t.mainDeity}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 gap-2">
                      <a
                        href={
                          t.lat && t.lng
                            ? `https://www.google.com/maps/dir/?api=1&destination=${t.lat},${t.lng}`
                            : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(t.templeName + ' ' + t.city)}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-black text-amber-300 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-slate-700 shrink-0 min-h-[32px]"
                      >
                        <Navigation className="w-3 h-3 text-amber-400" />
                        <span>Directions</span>
                      </a>

                      <button
                        onClick={() => setActiveTab('temple')}
                        className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-0.5"
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
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
              >
                <span>Browse All {temples.length} Sacred Temples & Tirths</span>
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
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 hover:border-red-500/50 hover:shadow-xl transition-all duration-300 space-y-3 flex flex-col justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.photoUrl || (m.gender === 'female' ? '/src/assets/images/default_bride.jpg' : '/src/assets/images/default_groom.jpg')}
                      alt={m.fullName}
                      className="w-12 h-12 rounded-xl object-cover border border-red-500/30 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <h3 className="font-serif font-bold text-sm text-white group-hover:text-red-400 transition-colors truncate">
                        {m.fullName}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate">
                        {m.age} Yrs • {m.height} • {m.sect}
                      </p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 bg-red-950/60 text-red-300 border border-red-900/50 rounded text-[9px] font-bold uppercase">
                        {m.gender === 'female' ? 'Bride Candidate' : 'Groom Candidate'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-300 border-t border-slate-800/80 pt-2">
                    <p className="truncate">🎓 {m.education || 'Graduate'}</p>
                    <p className="truncate">💼 {m.occupation || 'Professional'}</p>
                    <p className="truncate">📍 {m.city}, {m.state}</p>
                  </div>

                  <button
                    onClick={() => setActiveTab('matrimonial')}
                    className="w-full py-2 bg-red-950/50 hover:bg-red-900/70 text-red-200 border border-red-900/60 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer min-h-[36px]"
                  >
                    <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                    <span>View Profile</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveTab('matrimonial')}
                className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 group"
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
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 space-y-3 flex flex-col justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[9px] font-bold">
                        {b.category}
                      </span>
                      {b.isVerified && (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-sm text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {b.businessName}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      👤 {b.ownerName}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      📍 {b.city}, {b.state}
                    </p>
                  </div>

                  <p className="text-[10px] text-slate-300 line-clamp-2 border-t border-slate-800/80 pt-2 font-light">
                    {b.description || 'Verified Jain-owned business enterprise.'}
                  </p>

                  <button
                    onClick={() => setActiveTab('business')}
                    className="w-full py-2 bg-amber-950/50 hover:bg-amber-900/70 text-amber-200 border border-amber-900/60 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer min-h-[36px]"
                  >
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Business Card</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveTab('business')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
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
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 hover:border-rose-500/50 hover:shadow-xl transition-all duration-300 space-y-3 flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl font-black text-xs flex items-center gap-1">
                      <Droplet className="w-3.5 h-3.5 fill-rose-500" />
                      <span>{d.bloodGroup}</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                      Available
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-sm text-white group-hover:text-rose-300 transition-colors line-clamp-1">
                      {d.fullName}
                    </h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                      <span>{d.city}, {d.state}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('emergency')}
                    className="w-full py-2 bg-rose-950/50 hover:bg-rose-900/70 text-rose-200 border border-rose-900/60 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer min-h-[36px]"
                  >
                    <Droplet className="w-3.5 h-3.5 text-rose-400" />
                    <span>Emergency Contact</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveTab('emergency')}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 group"
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
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 hover:border-sky-500/50 hover:shadow-xl transition-all duration-300 space-y-3 flex flex-col justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400 group-hover:scale-110 transition-transform">
                      <Music className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-serif font-bold text-sm text-white group-hover:text-sky-300 transition-colors truncate">
                        {bh.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate">
                        🎤 {bh.singer || 'Traditional Stavan'}
                      </p>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 line-clamp-1 border-t border-slate-800/80 pt-2">
                    Category: {bh.category || 'Bhajan'}
                  </p>

                  <button
                    onClick={toggleNavkarMantra}
                    className="w-full py-2 bg-sky-950/50 hover:bg-sky-900/70 text-sky-200 border border-sky-900/60 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer min-h-[36px]"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Play Audio Chanting</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={toggleNavkarMantra}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 group"
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
