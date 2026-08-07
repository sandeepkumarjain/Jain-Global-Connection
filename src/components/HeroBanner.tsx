import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { AnimatedCounter } from './AnimatedCounter';
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
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-amber-50/60 to-white text-slate-900 border-b border-amber-200/80">
      {/* Background Image Carousel with Light Warm Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={activeSlide.bgImage}
          alt="Hero Banner"
          className="w-full h-full object-cover opacity-15 scale-105 transition-all duration-1000 ease-in-out filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50/95 via-amber-50/90 to-amber-100/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Headline & Slide Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 space-y-5"
          >
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-100 border border-amber-300/80 rounded-full text-amber-900 text-xs font-bold uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              <span>{activeSlide.tag}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 tracking-tight leading-tight">
              {activeSlide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-2xl">
              {activeSlide.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => openRegistrationModal('family')}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer border border-amber-300"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Your Profile</span>
              </button>

              <button
                onClick={() => setIsAISearchOpen(true)}
                className="px-5 py-3 bg-white hover:bg-amber-50 border border-amber-300 text-amber-950 text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-amber-600" />
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
                      currentSlide === idx ? 'w-8 bg-amber-600' : 'w-2 bg-amber-200 hover:bg-amber-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Action Navigation Grid Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 bg-white/90 backdrop-blur-md border border-amber-200/90 rounded-2xl p-5 shadow-xl shadow-amber-900/5 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <h3 className="text-sm font-black text-amber-900 uppercase tracking-wider font-serif">
                Quick Directory Actions
              </h3>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setActiveTab('matrimonial')}
                className="p-3 bg-slate-50 hover:bg-rose-50/80 border border-slate-200/80 hover:border-rose-300 hover:scale-[1.03] hover:-translate-y-0.5 min-h-[44px] rounded-xl text-left transition-all duration-300 group cursor-pointer shadow-sm"
              >
                <Heart className="w-5 h-5 text-rose-500 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-black text-slate-900">Matrimonial</p>
                <p className="text-[10px] text-slate-600 font-medium">Search Brides & Grooms</p>
              </button>

              <button
                onClick={() => setActiveTab('business')}
                className="p-3 bg-slate-50 hover:bg-amber-50/80 border border-slate-200/80 hover:border-amber-300 hover:scale-[1.03] hover:-translate-y-0.5 min-h-[44px] rounded-xl text-left transition-all duration-300 group cursor-pointer shadow-sm"
              >
                <Building2 className="w-5 h-5 text-amber-600 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-black text-slate-900">Business</p>
                <p className="text-[10px] text-slate-600 font-medium">Find Jain Vendors</p>
              </button>

              <button
                onClick={() => setActiveTab('temple')}
                className="p-3 bg-slate-50 hover:bg-emerald-50/80 border border-slate-200/80 hover:border-emerald-300 hover:scale-[1.03] hover:-translate-y-0.5 min-h-[44px] rounded-xl text-left transition-all duration-300 group cursor-pointer shadow-sm"
              >
                <MapPin className="w-5 h-5 text-emerald-600 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-black text-slate-900">Temples & Tirths</p>
                <p className="text-[10px] text-slate-600 font-medium">Live Darshan & Routes</p>
              </button>

              <button
                onClick={() => setActiveTab('panchang')}
                className="p-3 bg-slate-50 hover:bg-sky-50/80 border border-slate-200/80 hover:border-sky-300 hover:scale-[1.03] hover:-translate-y-0.5 min-h-[44px] rounded-xl text-left transition-all duration-300 group cursor-pointer shadow-sm"
              >
                <Calendar className="w-5 h-5 text-sky-600 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-black text-slate-900">Jain Panchang</p>
                <p className="text-[10px] text-slate-600 font-medium">Choghadiya & Tithis</p>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Real-time Ticker & Graphical Live Data Dashboard */}
        <div className="mt-10 pt-8 border-t border-amber-200/80 space-y-5">
          {/* Dashboard Bar Control Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider font-serif flex items-center gap-2">
                  <span>Real-Time Global Jain Community Metrics</span>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    LIVE DATA SYNC
                  </span>
                </h3>
                <p className="text-[11px] text-slate-600 font-medium">
                  Direct database feed from active registered members, verified businesses, holy tirths & blood donors.
                </p>
              </div>
            </div>

            {/* View Mode Toggle Switch */}
            <div className="flex items-center gap-1.5 bg-amber-100/80 border border-amber-300/80 p-1 rounded-xl shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setMetricTab('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  metricTab === 'cards'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-amber-950 hover:text-amber-800'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Graphical Cards</span>
              </button>
              <button
                onClick={() => setMetricTab('breakdown')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  metricTab === 'breakdown'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-amber-950 hover:text-amber-800'
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
                className="relative group overflow-hidden bg-white p-4 rounded-2xl border border-amber-200/90 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-amber-900/5 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-700 group-hover:scale-110 transition-transform">
                    <Globe className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                
                <div className="mt-3">
                  <p className="text-xl font-black font-serif text-amber-700 tracking-tight">
                    <AnimatedCounter
                      end={10000000}
                      formatter={(val) =>
                        val >= 1000000
                          ? `${(val / 1000000).toFixed(0)}M+`
                          : `${val.toLocaleString()}+`
                      }
                    />
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    Global Community
                  </p>
                  <p className="text-[10px] text-slate-600 font-medium flex items-center gap-1">
                    <AnimatedCounter end={realMembersCount} />
                    <span>Active Directory Profiles</span>
                  </p>
                </div>

                {/* SVG Mini Sparkline Curve */}
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <svg className="w-full h-7 text-amber-500/60" viewBox="0 0 100 25" fill="none">
                    <path
                      d="M0 20 Q 25 15, 50 10 T 100 2"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="group-hover:text-amber-600 transition-colors"
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
                className="relative group overflow-hidden bg-white p-4 rounded-2xl border border-emerald-200/90 hover:border-emerald-400 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-emerald-900/5 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-700 group-hover:scale-110 transition-transform">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div className="mt-3">
                  <p className="text-xl font-black font-serif text-emerald-700 tracking-tight">
                    <AnimatedCounter end={realBusinessesCount} suffix="+" />
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    Verified Businesses
                  </p>
                  <p className="text-[10px] text-slate-600 font-medium">
                    100% GST & Admin Verified
                  </p>
                </div>

                {/* SVG Mini Bar Chart */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-end gap-1 h-7">
                  <div className="flex-1 bg-emerald-200 h-[40%] rounded-t group-hover:bg-emerald-500 transition-all" />
                  <div className="flex-1 bg-emerald-300 h-[65%] rounded-t group-hover:bg-emerald-500 transition-all" />
                  <div className="flex-1 bg-emerald-400 h-[85%] rounded-t group-hover:bg-emerald-500 transition-all" />
                  <div className="flex-1 bg-emerald-600 h-[100%] rounded-t shadow-sm shadow-emerald-400/50" />
                </div>
              </div>

              {/* Card 3: Holy Temples */}
              <div
                onClick={() => setActiveTab('temple')}
                className="relative group overflow-hidden bg-white p-4 rounded-2xl border border-sky-200/90 hover:border-sky-400 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-sky-900/5 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-sky-100 border border-sky-300 text-sky-700 group-hover:scale-110 transition-transform">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div className="mt-3">
                  <p className="text-xl font-black font-serif text-sky-700 tracking-tight">
                    <AnimatedCounter end={realTemplesCount} suffix="+" />
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    Global Temples & Shrines
                  </p>
                  <p className="text-[10px] text-slate-600 font-medium">
                    Live GPS Routes & Pooja
                  </p>
                </div>

                {/* SVG Route Graphic */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-sky-700 font-mono">
                  <span>GPS Darshan</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                    <span className="text-sky-700 font-bold">100% Live</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Matrimonial Candidates */}
              <div
                onClick={() => setActiveTab('matrimonial')}
                className="relative group overflow-hidden bg-white p-4 rounded-2xl border border-rose-200/90 hover:border-rose-400 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-rose-900/5 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-rose-100 border border-rose-300 text-rose-700 group-hover:scale-110 transition-transform">
                    <Heart className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div className="mt-3">
                  <p className="text-xl font-black font-serif text-rose-700 tracking-tight">
                    <AnimatedCounter end={realMatrimonialsCount} suffix="+" />
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    Matrimonial Candidates
                  </p>
                  <p className="text-[10px] text-slate-600 font-medium">
                    Strict Diet & Gotra Verified
                  </p>
                </div>

                {/* Segmented Dual Bar */}
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-rose-500 w-[55%]" title="Swetambar" />
                    <div className="bg-pink-400 w-[30%]" title="Digambar" />
                    <div className="bg-amber-500 w-[15%]" title="Terapanthi" />
                  </div>
                </div>
              </div>

              {/* Card 5: Blood Donors */}
              <div
                onClick={() => setActiveTab('blood')}
                className="relative group overflow-hidden bg-white p-4 rounded-2xl border border-red-200/90 hover:border-red-400 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-red-900/5 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-red-100 border border-red-300 text-red-700 group-hover:scale-110 transition-transform">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div className="mt-3">
                  <p className="text-xl font-black font-serif text-red-700 tracking-tight">
                    <AnimatedCounter end={realBloodDonorsCount} suffix="+" />
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    Ready Blood Donors
                  </p>
                  <p className="text-[10px] text-slate-600 font-medium">
                    24/7 Lifesaving Hotline
                  </p>
                </div>

                {/* Heartbeat EKG Pulse Wave */}
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <svg className="w-full h-7 text-red-600" viewBox="0 0 100 20" fill="none">
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
                className="relative group overflow-hidden bg-white p-4 rounded-2xl border border-violet-200/90 hover:border-violet-400 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-violet-900/5 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-violet-100 border border-violet-300 text-violet-700 group-hover:scale-110 transition-transform">
                    <Music className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div className="mt-3">
                  <p className="text-xl font-black font-serif text-violet-700 tracking-tight">
                    <AnimatedCounter end={realBhajansCount} suffix="+" />
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    Bhajans & Audio
                  </p>
                  <p className="text-[10px] text-slate-600 font-medium">
                    HD Stavan Player
                  </p>
                </div>

                {/* Animated Equalizer Bars */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-end justify-center gap-1 h-7">
                  <div className="w-1 bg-violet-500 h-3 animate-pulse" />
                  <div className="w-1 bg-violet-500 h-6 animate-pulse delay-75" />
                  <div className="w-1 bg-violet-500 h-4 animate-pulse delay-100" />
                  <div className="w-1 bg-violet-500 h-5 animate-pulse delay-150" />
                  <div className="w-1 bg-violet-500 h-2 animate-pulse delay-200" />
                </div>
              </div>

            </div>
          )}

          {/* VIEW MODE 2: Visual Sector Analytics Breakdown */}
          {metricTab === 'breakdown' && (
            <div className="bg-white border border-amber-200/90 rounded-2xl p-5 shadow-lg shadow-amber-900/5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider font-serif flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  Platform Directory Capacity & Real Records Distribution
                </h4>
                <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                  <span>Total Managed Records:</span>
                  <AnimatedCounter
                    end={
                      realMembersCount +
                      realBusinessesCount +
                      realTemplesCount +
                      realMatrimonialsCount +
                      realBloodDonorsCount +
                      realBhajansCount
                    }
                  />
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                {/* Business Sector Bar */}
                <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-200/70 space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-emerald-700 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      Business Enterprise Directory
                    </span>
                    <span className="text-slate-900 font-mono flex items-center gap-1">
                      <AnimatedCounter end={realBusinessesCount} />
                      <span>Records</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full" style={{ width: `${Math.min(100, (realBusinessesCount / 20) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-600">Jewellery, CA, IT Founders, Medical & Exporters</p>
                </div>

                {/* Holy Temples Bar */}
                <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-200/70 space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-sky-700 flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5" />
                      Jain Temples & Holy Shrines
                    </span>
                    <span className="text-slate-900 font-mono flex items-center gap-1">
                      <AnimatedCounter end={realTemplesCount} />
                      <span>Records</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full" style={{ width: `${Math.min(100, (realTemplesCount / 10) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-600">Swetambar, Digambar, Dharamshala & Live Darshan</p>
                </div>

                {/* Matrimonial Bar */}
                <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-200/70 space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-rose-700 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5" />
                      Matrimonial Candidates
                    </span>
                    <span className="text-slate-900 font-mono flex items-center gap-1">
                      <AnimatedCounter end={realMatrimonialsCount} />
                      <span>Records</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-rose-500 to-pink-600 h-full rounded-full" style={{ width: `${Math.min(100, (realMatrimonialsCount / 10) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-600">Verified Grooms, Brides & Diet Preference Filters</p>
                </div>

                {/* Blood Donors Bar */}
                <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-200/70 space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-red-700 flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5" />
                      Emergency Blood Donors
                    </span>
                    <span className="text-slate-900 font-mono flex items-center gap-1">
                      <AnimatedCounter end={realBloodDonorsCount} />
                      <span>Donors</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-rose-600 h-full rounded-full" style={{ width: `${Math.min(100, (realBloodDonorsCount / 10) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-600">All Blood Groups (A+, B+, O+, AB+, Universal Negative)</p>
                </div>

                {/* Bhajans Bar */}
                <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-200/70 space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-violet-700 flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5" />
                      Bhajan & Stavan Songs
                    </span>
                    <span className="text-slate-900 font-mono flex items-center gap-1">
                      <AnimatedCounter end={realBhajansCount} />
                      <span>Audio Tracks</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-500 to-purple-600 h-full rounded-full" style={{ width: `${Math.min(100, (realBhajansCount / 10) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-600">Devotional Lyrics, Audio Streaming & Singers</p>
                </div>

                {/* Directory Family Profiles */}
                <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-200/70 space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-amber-800 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Family Directory Members
                    </span>
                    <span className="text-slate-900 font-mono flex items-center gap-1">
                      <AnimatedCounter end={realMembersCount} />
                      <span>Profiles</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-600 h-full rounded-full" style={{ width: `${Math.min(100, (realMembersCount / 10) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-600">Verified Family Trees & Global Jain Sangh Records</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

