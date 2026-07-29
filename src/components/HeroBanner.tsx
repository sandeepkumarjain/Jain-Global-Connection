import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Heart,
  Building2,
  MapPin,
  Calendar,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Search,
  UserPlus,
  Globe,
  Landmark,
  TrendingUp,
  Droplet,
  Music,
  Users,
  Activity,
  ArrowUpRight,
  BarChart3,
  Layers
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const {
    ads,
    setActiveTab,
    openRegistrationModal,
    setIsAISearchOpen,
    systemSettings,
    businesses,
    temples,
    matrimonials,
    members,
    bloodDonors,
    bhajans,
    posts
  } = useApp();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [metricTab, setMetricTab] = useState<'cards' | 'breakdown'>('cards');

  const heroSlides = [
    {
      id: 'slide_1',
      title: systemSettings.heroHeadline,
      subtitle: systemSettings.heroSubheadline,
      tag: 'WORLDWIDE JAIN DIRECTORY',
      bgImage: '/src/assets/images/jain_temple_banner_1784713506779.jpg',
      ctaText: 'Explore Platform',
      ctaTab: 'directory',
    },
    ...ads.map((ad) => ({
      id: ad.id,
      title: ad.title,
      subtitle: 'Promote your Jain Business or Temple to millions of Jain families globally.',
      tag: 'FEATURED ADVERTISEMENT',
      bgImage: ad.imageUrl,
      ctaText: 'View Details',
      ctaTab: 'business',
    })),
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const activeSlide = heroSlides[currentSlide] || heroSlides[0];

  // Calculated Real Platform Metrics
  const realBusinessesCount = businesses.length;
  const realTemplesCount = temples.length;
  const realMatrimonialsCount = matrimonials.length;
  const realMembersCount = members.length;
  const realBloodDonorsCount = bloodDonors.length;
  const realBhajansCount = bhajans.length;

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white border-b border-amber-900/40">
      {/* Background Image Carousel with Glassmorphism Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={activeSlide.bgImage}
          alt="Hero Banner"
          className="w-full h-full object-cover opacity-25 scale-105 transition-all duration-1000 ease-in-out filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Headline & Slide Info */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-gradient-to-r from-amber-500/20 to-amber-700/20 border border-amber-500/40 rounded-full text-amber-300 text-xs font-bold uppercase tracking-widest shadow-lg backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>{activeSlide.tag}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-white tracking-tight leading-tight">
              {activeSlide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-2xl">
              {activeSlide.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => openRegistrationModal('family')}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-amber-950 font-black text-sm rounded-xl shadow-xl hover:shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Your Profile</span>
              </button>

              <button
                onClick={() => setIsAISearchOpen(true)}
                className="px-5 py-3 bg-slate-900/80 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 backdrop-blur-sm cursor-pointer"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>AI Search Assistant</span>
              </button>
            </div>

            {/* Slider Controls */}
            {heroSlides.length > 1 && (
              <div className="flex items-center gap-2 pt-3">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Navigation Grid Card */}
          <div className="lg:col-span-4 bg-slate-900/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-serif">
                Quick Directory Actions
              </h3>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setActiveTab('matrimonial')}
                className="p-3 bg-slate-950/60 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 hover:scale-[1.03] hover:-translate-y-0.5 min-h-[44px] rounded-xl text-left transition-all duration-300 group cursor-pointer"
              >
                <Heart className="w-5 h-5 text-red-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Matrimonial</p>
                <p className="text-[10px] text-slate-400">Search Brides & Grooms</p>
              </button>

              <button
                onClick={() => setActiveTab('business')}
                className="p-3 bg-slate-950/60 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 hover:scale-[1.03] hover:-translate-y-0.5 min-h-[44px] rounded-xl text-left transition-all duration-300 group cursor-pointer"
              >
                <Building2 className="w-5 h-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Business</p>
                <p className="text-[10px] text-slate-400">Find Verified Jain Vendors</p>
              </button>

              <button
                onClick={() => setActiveTab('temple')}
                className="p-3 bg-slate-950/60 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 hover:scale-[1.03] hover:-translate-y-0.5 min-h-[44px] rounded-xl text-left transition-all duration-300 group cursor-pointer"
              >
                <MapPin className="w-5 h-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Temples & Tirths</p>
                <p className="text-[10px] text-slate-400">Live Darshan & Routes</p>
              </button>

              <button
                onClick={() => setActiveTab('panchang')}
                className="p-3 bg-slate-950/60 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 hover:scale-[1.03] hover:-translate-y-0.5 min-h-[44px] rounded-xl text-left transition-all duration-300 group cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Jain Panchang</p>
                <p className="text-[10px] text-slate-400">Choghadiya & Tithis</p>
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Ticker & Graphical Live Data Dashboard */}
        <div className="mt-10 pt-8 border-t border-slate-800/80 space-y-5">
          {/* Dashboard Bar Control Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider font-serif flex items-center gap-2">
                  <span>Real-Time Global Jain Community Metrics</span>
                  <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    LIVE DATA SYNC
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Direct database feed from active registered members, verified businesses, holy tirths & blood donors.
                </p>
              </div>
            </div>

            {/* View Mode Toggle Switch */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setMetricTab('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  metricTab === 'cards'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Graphical Cards</span>
              </button>
              <button
                onClick={() => setMetricTab('breakdown')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  metricTab === 'breakdown'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Sector Analytics</span>
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: Graphical Cards Grid */}
          {metricTab === 'cards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
              
              {/* Card 1: Jains Connected Globally */}
              <div
                onClick={() => setActiveTab('directory')}
                className="relative group overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 p-4 rounded-2xl border border-slate-800 hover:border-amber-500/60 transition-all duration-300 shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 cursor-pointer"
              >
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                    <Globe className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                
                <div className="mt-3">
                  <p className="text-xl font-black font-serif text-amber-400 tracking-tight">
                    10M+
                  </p>
                  <p className="text-xs font-bold text-white mt-0.5">
                    Global Community
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {realMembersCount} Active Directory Profiles
                  </p>
                </div>

                {/* SVG Mini Sparkline Curve */}
                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  <svg className="w-full h-7 text-amber-500/40" viewBox="0 0 100 25" fill="none">
                    <path
                      d="M0 20 Q 25 15, 50 10 T 100 2"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="group-hover:text-amber-400 transition-colors"
                    />
                    <path
                      d="M0 20 Q 25 15, 50 10 T 100 2 L 100 25 L 0 25 Z"
                      fill="rgba(245, 158, 11, 0.1)"
                    />
                  </svg>
                </div>
              </div>

              {/* Card 2: Verified Businesses */}
              <div
                onClick={() => setActiveTab('business')}
                className="relative group overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/60 transition-all duration-300 shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 cursor-pointer"
              >
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div className="mt-3">
                  <p className="text-xl font-black font-serif text-emerald-400 tracking-tight">
                    {realBusinessesCount}+
                  </p>
                  <p className="text-xs font-bold text-white mt-0.5">
                    Verified Businesses
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    100% GST & Admin Verified
                  </p>
                </div>

                {/* SVG Mini Bar Chart */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-end gap-1 h-7">
                  <div className="flex-1 bg-emerald-500/30 h-[40%] rounded-t group-hover:bg-emerald-400 transition-all" />
                  <div className="flex-1 bg-emerald-500/40 h-[65%] rounded-t group-hover:bg-emerald-400 transition-all" />
                  <div className="flex-1 bg-emerald-500/60 h-[85%] rounded-t group-hover:bg-emerald-400 transition-all" />
                  <div className="flex-1 bg-emerald-400 h-[100%] rounded-t shadow-sm shadow-emerald-400/50" />
                </div>
              </div>

              {/* Card 3: Holy Temples */}
              <div
                onClick={() => setActiveTab('temple')}
                className="relative group overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 p-4 rounded-2xl border border-slate-800 hover:border-sky-500/60 transition-all duration-300 shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 cursor-pointer"
              >
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-sky-500/10 rounded-full blur-xl group-hover:bg-sky-500/20 transition-all pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 group-hover:scale-110 transition-transform">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div className="mt-3">
                  <p className="text-xl font-black font-serif text-sky-400 tracking-tight">
                    {realTemplesCount}+
                  </p>
                  <p className="text-xs font-bold text-white mt-0.5">
                    Holy Jain Shrines
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Live GPS Routes & Pooja
                  </p>
                </div>

                {/* SVG Route Graphic */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-sky-300/80 font-mono">
                  <span>GPS Darshan</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                    <span className="text-sky-400 font-bold">100% Live</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Matrimonial Candidates */}
              <div
                onClick={() => setActiveTab('matrimonial')}
                className="relative group overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 p-4 rounded-2xl border border-slate-800 hover:border-rose-500/60 transition-all duration-300 shadow-xl hover:shadow-rose-500/10 hover:-translate-y-1 cursor-pointer"
              >
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-rose-500/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition-all pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
                    <Heart className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div className="mt-3">
                  <p className="text-xl font-black font-serif text-rose-400 tracking-tight">
                    {realMatrimonialsCount}+
                  </p>
                  <p className="text-xs font-bold text-white mt-0.5">
                    Matrimonial Candidates
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Strict Diet & Gotra Verified
                  </p>
                </div>

                {/* Segmented Dual Bar */}
                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-rose-400 w-[55%]" title="Swetambar" />
                    <div className="bg-pink-500 w-[30%]" title="Digambar" />
                    <div className="bg-amber-400 w-[15%]" title="Terapanthi" />
                  </div>
                </div>
              </div>

              {/* Card 5: Blood Donors */}
              <div
                onClick={() => setActiveTab('blood')}
                className="relative group overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 p-4 rounded-2xl border border-slate-800 hover:border-red-500/60 transition-all duration-300 shadow-xl hover:shadow-red-500/10 hover:-translate-y-1 cursor-pointer"
              >
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 group-hover:scale-110 transition-transform">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div className="mt-3">
                  <p className="text-xl font-black font-serif text-red-400 tracking-tight">
                    {realBloodDonorsCount}+
                  </p>
                  <p className="text-xs font-bold text-white mt-0.5">
                    Ready Blood Donors
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    24/7 Lifesaving Hotline
                  </p>
                </div>

                {/* Heartbeat EKG Pulse Wave */}
                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  <svg className="w-full h-7 text-red-500" viewBox="0 0 100 20" fill="none">
                    <path
                      d="M0 10 L 25 10 L 30 2 L 35 18 L 40 5 L 45 13 L 50 10 L 100 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
              </div>

              {/* Card 6: Bhajans & Stavan Library */}
              <div
                onClick={() => setActiveTab('bhajan')}
                className="relative group overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 p-4 rounded-2xl border border-slate-800 hover:border-violet-500/60 transition-all duration-300 shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 cursor-pointer"
              >
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-violet-500/10 rounded-full blur-xl group-hover:bg-violet-500/20 transition-all pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 group-hover:scale-110 transition-transform">
                    <Music className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div className="mt-3">
                  <p className="text-xl font-black font-serif text-violet-400 tracking-tight">
                    {realBhajansCount}+
                  </p>
                  <p className="text-xs font-bold text-white mt-0.5">
                    Bhajans & Audio
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    HD Stavan Player
                  </p>
                </div>

                {/* Animated Equalizer Bars */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-end justify-center gap-1 h-7">
                  <div className="w-1 bg-violet-400 h-3 animate-pulse" />
                  <div className="w-1 bg-violet-400 h-6 animate-pulse delay-75" />
                  <div className="w-1 bg-violet-400 h-4 animate-pulse delay-100" />
                  <div className="w-1 bg-violet-400 h-5 animate-pulse delay-150" />
                  <div className="w-1 bg-violet-400 h-2 animate-pulse delay-200" />
                </div>
              </div>

            </div>
          )}

          {/* VIEW MODE 2: Visual Sector Analytics Breakdown */}
          {metricTab === 'breakdown' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider font-serif flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Platform Directory Capacity & Real Records Distribution
                </h4>
                <span className="text-[11px] font-bold text-slate-400">
                  Total Managed Records: {(realMembersCount + realBusinessesCount + realTemplesCount + realMatrimonialsCount + realBloodDonorsCount + realBhajansCount).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                {/* Business Sector Bar */}
                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      Business Enterprise Directory
                    </span>
                    <span className="text-white font-mono">{realBusinessesCount} Records</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: `${Math.min(100, (realBusinessesCount / 20) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400">Jewellery, CA, IT Founders, Medical & Exporters</p>
                </div>

                {/* Holy Temples Bar */}
                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-sky-400 flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5" />
                      Jain Temples & Holy Shrines
                    </span>
                    <span className="text-white font-mono">{realTemplesCount} Records</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-sky-500 to-blue-400 h-full rounded-full" style={{ width: `${Math.min(100, (realTemplesCount / 10) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400">Swetambar, Digambar, Dharamshala & Live Darshan</p>
                </div>

                {/* Matrimonial Bar */}
                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-rose-400 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5" />
                      Matrimonial Candidates
                    </span>
                    <span className="text-white font-mono">{realMatrimonialsCount} Records</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-rose-500 to-pink-400 h-full rounded-full" style={{ width: `${Math.min(100, (realMatrimonialsCount / 10) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400">Verified Grooms, Brides & Diet Preference Filters</p>
                </div>

                {/* Blood Donors Bar */}
                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-red-400 flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5" />
                      Emergency Blood Donors
                    </span>
                    <span className="text-white font-mono">{realBloodDonorsCount} Donors</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-rose-400 h-full rounded-full" style={{ width: `${Math.min(100, (realBloodDonorsCount / 10) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400">All Blood Groups (A+, B+, O+, AB+, Universal Negative)</p>
                </div>

                {/* Bhajans Bar */}
                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-violet-400 flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5" />
                      Bhajan & Stavan Songs
                    </span>
                    <span className="text-white font-mono">{realBhajansCount} Audio Tracks</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-500 to-purple-400 h-full rounded-full" style={{ width: `${Math.min(100, (realBhajansCount / 10) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400">Devotional Lyrics, Audio Streaming & Singers</p>
                </div>

                {/* Directory Family Profiles */}
                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Family Directory Members
                    </span>
                    <span className="text-white font-mono">{realMembersCount} Profiles</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full" style={{ width: `${Math.min(100, (realMembersCount / 10) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400">Verified Family Trees & Global Jain Sangh Records</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

