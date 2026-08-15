import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Compass,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  MapPin,
  Clock,
  Home,
  Utensils,
  Navigation,
  Heart,
  Eye,
  Camera,
  Share2,
  Info,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { HOLY_SITE_VIRTUAL_TOUR_SLIDES, HolySiteTourSlide } from '../data/templeImages';
import { TempleListing } from '../types';
import { playNavkarMantraAudio, stopNavkarMantraAudio } from '../utils/navkarAudio';

interface HolySiteVirtualTourCarouselModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSlideIndex?: number;
  temples?: TempleListing[];
  onOpen360Tour?: (temple: TempleListing) => void;
  onOpenDonation?: (temple: TempleListing) => void;
  showToast?: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const HolySiteVirtualTourCarouselModal: React.FC<HolySiteVirtualTourCarouselModalProps> = ({
  isOpen,
  onClose,
  initialSlideIndex = 0,
  temples = [],
  onOpen360Tour,
  onOpenDonation,
  showToast,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialSlideIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showInfoOverlay, setShowInfoOverlay] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [slideProgress, setSlideProgress] = useState<number>(0);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const SLIDE_DURATION_MS = 7000;
  const slides = HOLY_SITE_VIRTUAL_TOUR_SLIDES;
  const currentSlide: HolySiteTourSlide = slides[currentIndex] || slides[0];

  // Sync initial index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialSlideIndex, slides.length - 1)));
      setZoomLevel(1);
      setSlideProgress(0);
    }
  }, [isOpen, initialSlideIndex, slides.length]);

  // Find matching temple object if any
  const matchedTemple = temples.find((t) => t.id === currentSlide.templeId) || null;

  // Next and Prev handlers
  const goToNext = useCallback(() => {
    setZoomLevel(1);
    setSlideProgress(0);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setZoomLevel(1);
    setSlideProgress(0);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (idx: number) => {
    setZoomLevel(1);
    setSlideProgress(0);
    setCurrentIndex(idx);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'Escape') {
        stopNavkarMantraAudio();
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNext, goToPrev, onClose]);

  // Slideshow timer & progress
  useEffect(() => {
    if (!isOpen || !isPlaying || zoomLevel > 1) return;

    const stepInterval = 100;
    const progressIncrement = (stepInterval / SLIDE_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + progressIncrement;
      });
    }, stepInterval);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, zoomLevel, goToNext]);

  // Audio Toggle
  const toggleAudio = () => {
    if (isAudioPlaying) {
      stopNavkarMantraAudio();
      setIsAudioPlaying(false);
      if (showToast) showToast('Audio Paused', 'Sacred Navkar Mantra paused.', 'info');
    } else {
      setIsAudioPlaying(true);
      if (showToast) showToast('Playing Devotional Chanting', 'Namo Arihantanam... Namo Siddhanam...', 'info');
      playNavkarMantraAudio(() => setIsAudioPlaying(false));
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!modalContainerRef.current) return;
    if (!isFullscreen) {
      if (modalContainerRef.current.requestFullscreen) {
        modalContainerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Snapshot download
  const handleDownloadSnapshot = () => {
    const link = document.createElement('a');
    link.href = currentSlide.imageUrl;
    link.download = `${currentSlide.id}_tirth_darshan.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (showToast) {
      showToast('Image Saved', `Downloaded HD holy site photo for ${currentSlide.title}`, 'success');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-2 sm:p-4 md:p-6 overflow-hidden animate-fadeIn">
      {/* Container Box */}
      <div
        ref={modalContainerRef}
        className={`relative w-full max-w-7xl bg-slate-950 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
          isFullscreen ? 'h-screen max-w-none rounded-none border-none' : 'h-[92vh] max-h-[900px]'
        }`}
      >
        {/* Top Header Navigation Bar */}
        <div className="relative z-30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-3 sm:p-4 border-b border-amber-500/30 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="p-2.5 bg-gradient-to-tr from-amber-500 to-amber-600 text-amber-950 rounded-2xl shadow-lg shrink-0">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </span>

            <div className="overflow-hidden">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500/30 to-amber-700/30 text-amber-300 text-[10px] font-extrabold uppercase rounded-md border border-amber-500/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Holy Sites Virtual Tour
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {currentSlide.sect}
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  Site {currentIndex + 1} of {slides.length}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-white truncate mt-0.5">
                {currentSlide.title}
              </h2>
            </div>
          </div>

          {/* Header Controls Right */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer min-h-[40px] border ${
                isAudioPlaying
                  ? 'bg-amber-500 text-amber-950 border-amber-300 shadow-md animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/30'
              }`}
              title="Toggle Devotional Navkar Mantra Audio"
            >
              {isAudioPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden md:inline">{isAudioPlaying ? 'Mute Chanting' : 'Temple Audio'}</span>
            </button>

            {/* Info Overlay Toggle */}
            <button
              onClick={() => setShowInfoOverlay((prev) => !prev)}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[40px] border ${
                showInfoOverlay
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
              }`}
              title="Toggle Details Drawer"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[40px]"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                stopNavkarMantraAudio();
                onClose();
              }}
              className="p-2.5 bg-amber-500/20 hover:bg-amber-500 text-amber-200 hover:text-amber-950 border border-amber-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[40px]"
              title="Close Virtual Tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Progress Bar (during autoplay) */}
        {isPlaying && (
          <div className="w-full bg-slate-900 h-1 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-100 ease-linear"
              style={{ width: `${slideProgress}%` }}
            />
          </div>
        )}

        {/* Main Stage Image Display */}
        <div className="relative flex-1 w-full overflow-hidden bg-slate-950 flex items-center justify-center select-none group">
          {/* Main Visual Image */}
          <div
            className="w-full h-full flex items-center justify-center overflow-hidden transition-transform duration-500 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              key={currentSlide.id}
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center animate-fadeIn"
            />
          </div>

          {/* Vignette & Contrast Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

          {/* Navigation Chevron Left */}
          <button
            onClick={goToPrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-slate-950/80 hover:bg-amber-500 text-amber-300 hover:text-amber-950 border border-amber-500/40 shadow-2xl backdrop-blur-md transition-all cursor-pointer hover:scale-110 z-20 group-hover:opacity-100 opacity-90"
            title="Previous Holy Site (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Navigation Chevron Right */}
          <button
            onClick={goToNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-slate-950/80 hover:bg-amber-500 text-amber-300 hover:text-amber-950 border border-amber-500/40 shadow-2xl backdrop-blur-md transition-all cursor-pointer hover:scale-110 z-20 group-hover:opacity-100 opacity-90"
            title="Next Holy Site (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Floating Top Location Pill */}
          <div className="absolute top-4 left-4 sm:left-6 z-20 pointer-events-none flex items-center gap-2">
            <div className="bg-slate-950/85 backdrop-blur-md border border-amber-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-200 shadow-xl flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentSlide.location}, {currentSlide.state}</span>
            </div>
            <div className="bg-slate-950/85 backdrop-blur-md border border-amber-500/40 px-3 py-1.5 rounded-full text-xs font-bold text-amber-300 shadow-xl hidden sm:flex items-center gap-1">
              <span>Moolnayak:</span>
              <strong className="text-white">{currentSlide.deity}</strong>
            </div>
          </div>

          {/* Zoom In / Out Controls Overlay Floating */}
          <div className="absolute top-4 right-4 sm:right-6 z-20 flex items-center bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-1 gap-1 text-white shadow-xl">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(1, prev - 0.25))}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-bold text-amber-300 px-1.5">
              {zoomLevel.toFixed(1)}x
            </span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.25))}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {zoomLevel > 1 && (
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 hover:bg-slate-800 text-amber-400 rounded-xl transition-all cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dynamic Information Overlay Card (Bottom/Center) */}
          {showInfoOverlay && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8 z-20 max-w-4xl mx-auto bg-slate-950/90 backdrop-blur-xl border border-amber-500/40 p-4 sm:p-5 rounded-2xl shadow-2xl text-white space-y-3 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black uppercase rounded">
                      {currentSlide.sect}
                    </span>
                    <span className="text-xs text-amber-400 font-bold">
                      {currentSlide.location}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-white mt-1">
                    {currentSlide.title}
                  </h3>
                  <p className="text-xs text-amber-200/90 font-medium italic">
                    "{currentSlide.subtitle}"
                  </p>
                </div>

                {/* Quick Actions in Banner */}
                <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                  {matchedTemple && onOpen360Tour && (
                    <button
                      onClick={() => onOpen360Tour(matchedTemple)}
                      className="px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>360° Interactive View</span>
                    </button>
                  )}

                  {matchedTemple && onOpenDonation && (
                    <button
                      onClick={() => onOpenDonation(matchedTemple)}
                      className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>Dev Dravya</span>
                    </button>
                  )}

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      currentSlide.title + ' ' + currentSlide.location
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Directions</span>
                  </a>
                </div>
              </div>

              {/* Main Content Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="space-y-1 md:col-span-2">
                  <p className="text-slate-300 leading-relaxed line-clamp-3">
                    {currentSlide.description}
                  </p>
                  <p className="text-[11px] text-amber-200/80 pt-1 flex items-start gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Spiritual Glory:</strong> {currentSlide.spiritualSignificance}</span>
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Darshan & Aarti Timings:</span>
                  </div>
                  <p className="text-slate-300">{currentSlide.aartiTimings}</p>

                  <div className="flex items-center gap-1.5 text-blue-300 font-bold pt-1">
                    <Home className="w-3.5 h-3.5 text-blue-400" />
                    <span>Dharamshala & Food:</span>
                  </div>
                  <p className="text-slate-300 line-clamp-2">{currentSlide.dharamshalaInfo}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Thumbnail Ribbon & Navigation Toolbar */}
        <div className="relative z-30 bg-slate-950 border-t border-amber-500/30 p-2 sm:p-3 space-y-2">
          {/* Thumbnail Strip */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                className={`relative group rounded-xl overflow-hidden shrink-0 transition-all duration-300 cursor-pointer border-2 ${
                  currentIndex === idx
                    ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105 shadow-xl'
                    : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                }`}
                style={{ width: '84px', height: '52px' }}
                title={`Jump to ${slide.title}`}
              >
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-all" />
                <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] font-bold text-white px-1 truncate text-center">
                  {slide.title.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>

          {/* Action Toolbar Bottom */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-white pt-1 border-t border-slate-900 px-2">
            {/* Left: Previous / Next & Slide counter */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={goToPrev}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
                title="Previous Holy Site"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <button
                onClick={goToNext}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
                title="Next Holy Site"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono text-slate-400 px-2 font-bold">
                {currentIndex + 1} / {slides.length}
              </span>
            </div>

            {/* Center: Autoplay Pause/Play */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isPlaying
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
                <span>{isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}</span>
              </button>
            </div>

            {/* Right: Snapshot & Info Drawer Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadSnapshot}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
                title="Save High Resolution Holy Site Image"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Save HD Photo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
