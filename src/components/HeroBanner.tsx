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
  UserPlus
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { ads, setActiveTab, setIsRegModalOpen, setIsAISearchOpen, systemSettings } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

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
    ...ads.map((ad, idx) => ({
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Headline & Slide Info */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-amber-700/20 border border-amber-500/40 rounded-full text-amber-300 text-xs font-bold uppercase tracking-widest shadow-lg backdrop-blur-sm">
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
                onClick={() => setIsRegModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-amber-950 font-black text-sm rounded-xl shadow-xl hover:shadow-amber-500/20 transition-all flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Your Profile</span>
              </button>

              <button
                onClick={() => setIsAISearchOpen(true)}
                className="px-5 py-3 bg-slate-900/80 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 backdrop-blur-sm"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>AI Search Assistant</span>
              </button>
            </div>

            {/* Slider Controls */}
            {heroSlides.length > 1 && (
              <div className="flex items-center gap-2 pt-4">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
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
                className="p-3 bg-slate-950/60 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left transition-all group"
              >
                <Heart className="w-5 h-5 text-red-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Matrimonial</p>
                <p className="text-[10px] text-slate-400">Search Brides & Grooms</p>
              </button>

              <button
                onClick={() => setActiveTab('business')}
                className="p-3 bg-slate-950/60 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left transition-all group"
              >
                <Building2 className="w-5 h-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Business</p>
                <p className="text-[10px] text-slate-400">Find Verified Jain Vendors</p>
              </button>

              <button
                onClick={() => setActiveTab('temple')}
                className="p-3 bg-slate-950/60 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left transition-all group"
              >
                <MapPin className="w-5 h-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Temples & Tirths</p>
                <p className="text-[10px] text-slate-400">Live Darshan & Routes</p>
              </button>

              <button
                onClick={() => setActiveTab('panchang')}
                className="p-3 bg-slate-950/60 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left transition-all group"
              >
                <Calendar className="w-5 h-5 text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">Jain Panchang</p>
                <p className="text-[10px] text-slate-400">Choghadiya & Tithis</p>
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Ticker Statistics Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/60">
            <p className="text-2xl font-black text-amber-400 font-serif">10,000,000+</p>
            <p className="text-xs text-slate-400 font-medium">Jains Connected Globally</p>
          </div>

          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/60">
            <p className="text-2xl font-black text-amber-400 font-serif">5,000+</p>
            <p className="text-xs text-slate-400 font-medium">Verified Jain Businesses</p>
          </div>

          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/60">
            <p className="text-2xl font-black text-amber-400 font-serif">800+</p>
            <p className="text-xs text-slate-400 font-medium">Holy Jain Temples Listed</p>
          </div>

          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/60">
            <p className="text-2xl font-black text-amber-400 font-serif">1,200+</p>
            <p className="text-xs text-slate-400 font-medium">Verified Matrimonial Matches</p>
          </div>
        </div>
      </div>
    </section>
  );
};
