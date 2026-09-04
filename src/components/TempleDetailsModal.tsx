import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Clock,
  Phone,
  Mail,
  Share2,
  Navigation,
  Heart,
  Camera,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Home,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Video,
  Eye,
  Calendar,
  Compass,
  FileText,
  Printer,
  Car,
  Award,
  Copy,
  Check,
  MessageCircle,
  Star,
  MessageSquare,
  Lightbulb,
  ThumbsUp,
  Send,
  UserCheck,
  ArrowLeft,
  ArrowUp
} from 'lucide-react';
import { TempleListing, TempleReview } from '../types';
import { useApp } from '../context/AppContext';

interface TempleDetailsModalProps {
  temple: TempleListing | null;
  onClose: () => void;
  onOpenLiveDarshan?: (temple: TempleListing) => void;
  onOpenDonation?: (temple: TempleListing) => void;
  onOpen360Tour?: (temple: TempleListing) => void;
  userDistanceKm?: number;
}

export const TempleDetailsModal: React.FC<TempleDetailsModalProps> = ({
  temple,
  onClose,
  onOpenLiveDarshan,
  onOpenDonation,
  onOpen360Tour,
  userDistanceKm
}) => {
  const { addTempleReview, currentUser, showToast } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'timings' | 'facilities' | 'trust' | 'gallery' | 'donations' | 'reviews'>('overview');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Reviews & Suggestions State
  const [reviewType, setReviewType] = useState<'review' | 'suggestion'>('review');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewCategory, setReviewCategory] = useState<'General' | 'Darshan' | 'Cleanliness' | 'Dharamshala' | 'Bhojanashala' | 'Yatra & Facilities'>('General');
  const [reviewerName, setReviewerName] = useState<string>(currentUser?.name || '');
  const [reviewerCity, setReviewerCity] = useState<string>(currentUser?.city || '');
  const [visitDate, setVisitDate] = useState<string>('August 2026');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'review' | 'suggestion'>('all');
  const [upvotedReviews, setUpvotedReviews] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Handle ESC key and prevent body scrolling in full screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  if (!temple) return null;

  const images = temple.images && temple.images.length > 0
    ? temple.images
    : ['https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80'];

  const reviewsList: TempleReview[] = temple.reviews || [];

  const filteredReviews = reviewsList.filter((item) => {
    if (reviewFilter === 'review') return item.type === 'review';
    if (reviewFilter === 'suggestion') return item.type === 'suggestion';
    return true;
  });

  const reviewsOnly = reviewsList.filter((r) => r.type === 'review');
  const suggestionsOnly = reviewsList.filter((r) => r.type === 'suggestion');

  const handleCopyUpi = () => {
    const upi = temple.donationUpi || 'palitana.tirth@upi';
    navigator.clipboard?.writeText(upi);
    setCopiedUpi(true);
    showToast('UPI ID Copied', `${upi} copied to clipboard for donation`, 'success');
    setTimeout(() => setCopiedUpi(false), 3000);
  };

  const handleCopyAddress = () => {
    const addr = `${temple.templeName}, ${temple.address}, ${temple.city}, ${temple.state}, ${temple.country}`;
    navigator.clipboard?.writeText(addr);
    setCopiedAddress(true);
    showToast('Address Copied', 'Full temple address copied to clipboard', 'info');
    setTimeout(() => setCopiedAddress(false), 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: temple.templeName,
        text: `Visit ${temple.templeName} (${temple.mainDeity}) in ${temple.city}, ${temple.state}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Link Copied', 'Temple page link copied to clipboard', 'info');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleUpvoteReview = (reviewId: string) => {
    setUpvotedReviews((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
    showToast('Marked Helpful', 'Thank you for your feedback.', 'info');
  };

  const handleSubmitReviewOrSuggestion = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewerName.trim()) {
      showToast('Name Required', 'Please enter your name.', 'error');
      return;
    }

    if (!reviewComment.trim()) {
      showToast('Feedback Required', 'Please enter your review or suggestion.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      addTempleReview(temple.id, {
        userName: reviewerName.trim(),
        userCity: reviewerCity.trim() || temple.city,
        rating: reviewRating,
        type: reviewType,
        visitDate: visitDate.trim() || 'Recent Visit',
        category: reviewCategory,
        comment: reviewComment.trim(),
        userId: currentUser?.id,
        isVerifiedVisitor: true,
        helpfulCount: 0,
      });

      setReviewComment('');
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      showToast('Submission Failed', 'Please try again.', 'error');
    }
  };

  const scrollToSection = (tabName: typeof activeTab) => {
    setActiveTab(tabName);
    const element = document.getElementById('temple-tab-nav-bar');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const googleMapsUrl = temple.lat && temple.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${temple.lat},${temple.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(temple.templeName + ' ' + temple.city)}`;

  const phoneClean = temple.trustPhone ? temple.trustPhone.replace(/[^0-9]/g, '') : '919876543210';
  const whatsappUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(
    `Jai Jinendra! I would like to inquire regarding darshan timings and accommodation at ${temple.templeName}.`
  )}`;

  return (
    <div
      id="temple-fullscreen-page-overlay"
      className="fixed inset-0 z-[9999] w-screen h-screen bg-slate-100 dark:bg-slate-950 flex flex-col overflow-hidden animate-in fade-in duration-200"
    >
      {/* Top Fixed Header Bar */}
      <header className="h-14 sm:h-16 px-3 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 sm:gap-4 shrink-0 z-30 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onClose}
            className="px-2.5 sm:px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="Back to Temple Map"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Map</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-extrabold text-[10px] uppercase rounded-md shrink-0">
                {temple.sect}
              </span>
              <h1 className="font-serif font-black text-sm sm:text-base md:text-lg text-slate-900 dark:text-white truncate">
                {temple.templeName}
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate hidden md:block">
              {temple.mainDeity} • {temple.city}, {temple.state}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => scrollToSection('reviews')}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Review / Suggest</span>
            <span className="sm:hidden">Feedback</span>
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer hidden md:flex"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-500" />
            <span>Navigate</span>
          </a>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title="Share Temple"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer hidden lg:flex"
            title="Print Details"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-red-600 hover:text-white dark:bg-slate-800 dark:hover:bg-red-600 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer ml-1"
            title="Close Full Screen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Fullscreen Scrollable Page: Everything scrolls naturally with entire viewport height available! */}
      <main className="flex-1 overflow-y-auto min-h-0 w-full bg-slate-50 dark:bg-slate-950 overscroll-contain scroll-smooth">
        
        {/* Full-Width Hero Showcase Section */}
        <section className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[420px] bg-slate-950 overflow-hidden group">
          <img
            src={images[activeImageIndex] || images[0]}
            alt={temple.templeName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/20"></div>

          {/* Carousel Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md shadow-xl transition-all cursor-pointer"
                title="Previous photo"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md shadow-xl transition-all cursor-pointer"
                title="Next photo"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Top Badges */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {temple.sect}
            </span>
            {temple.isVerified && (
              <span className="px-3 py-1 bg-sky-500 text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Tirth Trust
              </span>
            )}
            <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-md text-amber-300 font-bold text-xs rounded-lg shadow-lg flex items-center gap-1.5">
              ★ {temple.rating ? temple.rating.toFixed(1) : '5.0'} ({reviewsList.length} feedback)
            </span>
          </div>

          {/* Hero Bottom Information */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
            <div className="max-w-3xl">
              <p className="text-amber-300 font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2">
                <span>🛕 Moolnayak Deity:</span>
                <span className="text-white font-black">{temple.mainDeity}</span>
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-lg leading-tight mt-1">
                {temple.templeName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5 mt-1.5 drop-shadow-md">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{temple.address}, {temple.city}, {temple.state} - {temple.country}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scrollToSection('reviews')}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Write Review / Suggestion</span>
              </button>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-slate-900/90 hover:bg-black text-amber-300 border border-amber-500/50 font-bold text-xs sm:text-sm rounded-xl shadow-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>Directions</span>
              </a>
            </div>
          </div>

          {/* Image counter indicator */}
          <div className="absolute bottom-4 right-4 md:right-auto md:left-1/2 md:-translate-x-1/2 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-xs font-bold text-slate-300 pointer-events-none hidden sm:block">
            Photo {activeImageIndex + 1} of {images.length}
          </div>
        </section>

        {/* Thumbnail Preview Strip */}
        {images.length > 1 && (
          <div className="bg-slate-100 dark:bg-slate-900 px-4 sm:px-8 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2.5 overflow-x-auto no-scrollbar">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-1">
              <Camera className="w-3.5 h-3.5 text-amber-500" /> Photos:
            </span>
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-14 h-10 sm:w-16 sm:h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-amber-500 scale-105 shadow-md'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Sticky Tabs Navigation Bar */}
        <div
          id="temple-tab-nav-bar"
          className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center gap-1 sm:gap-3 overflow-x-auto no-scrollbar shadow-xs"
        >
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 sm:py-3.5 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🏛️ Overview & Details
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 sm:py-3.5 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ⭐ Reviews & Suggestions ({reviewsList.length})
          </button>
          <button
            onClick={() => setActiveTab('timings')}
            className={`py-3 sm:py-3.5 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'timings'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ⏰ Timings & Aarti
          </button>
          <button
            onClick={() => setActiveTab('facilities')}
            className={`py-3 sm:py-3.5 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'facilities'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🏨 Stay & Bhojanashala
          </button>
          <button
            onClick={() => setActiveTab('trust')}
            className={`py-3 sm:py-3.5 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'trust'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            📞 Trust & Contact
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`py-3 sm:py-3.5 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'gallery'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            📸 Gallery ({images.length})
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={`py-3 sm:py-3.5 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'donations'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            💛 Seva & Donations
          </button>
        </div>

        {/* Tab Content Body (Max Width Centered with Plenty of Vertical Breathing Room) */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          
          {/* TAB 1: OVERVIEW & SACRED HISTORY */}
          {activeTab === 'overview' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Quick Summary Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <p className="text-xs uppercase font-bold text-slate-400">Main Moolnayak</p>
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg mt-1">{temple.mainDeity}</p>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <p className="text-xs uppercase font-bold text-slate-400">Jain Sect Tradition</p>
                  <p className="font-bold text-amber-600 dark:text-amber-400 text-base sm:text-lg mt-1">{temple.sect}</p>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <p className="text-xs uppercase font-bold text-slate-400">Pilgrim Accommodation</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 text-base sm:text-lg mt-1">
                    {temple.hasAccommodation ? `${temple.dharamshalaRooms || 'Available'} Rooms` : 'Nearby Lodges'}
                  </p>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <p className="text-xs uppercase font-bold text-slate-400">Visitor Feedback</p>
                  <p className="font-bold text-amber-500 text-base sm:text-lg mt-1 flex items-center gap-1">
                    ★ {temple.rating ? temple.rating.toFixed(1) : '5.0'} ({reviewsList.length} reviews)
                  </p>
                </div>
              </div>

              {/* Sacred Significance & History */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  Sacred Significance & Spiritual History
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {temple.history ||
                    `${temple.templeName} is a revered Jain pilgrimage destination dedicated to ${temple.mainDeity}. Devotees visit this sacred sanctuary for daily Pakshal Puja, spiritual meditation, and temple worship. The tirth preserves ancient Jain traditions and offers continuous religious merit to all pilgrims.`}
                </p>
              </div>

              {/* Geographical Location & Address */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                    <MapPin className="w-6 h-6 text-amber-500" />
                    Geographical Location & Address
                  </h3>
                  <button
                    onClick={handleCopyAddress}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedAddress ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedAddress ? 'Copied!' : 'Copy Address'}
                  </button>
                </div>
                <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {temple.address}, {temple.city}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      State: {temple.state}, Country: {temple.country}
                    </p>
                    {temple.lat && temple.lng && (
                      <p className="text-xs text-slate-400 font-mono mt-1.5">
                        GPS Coordinates: {temple.lat.toFixed(4)}° N, {temple.lng.toFixed(4)}° E
                      </p>
                    )}
                  </div>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>

              {/* Special Features & Digital Access */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {temple.is360Available && (
                  <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex flex-col justify-between gap-4">
                    <div>
                      <p className="font-bold text-amber-900 dark:text-amber-200 text-base flex items-center gap-2">
                        <Eye className="w-5 h-5 text-amber-600" />
                        360° Virtual Pilgrimage
                      </p>
                      <p className="text-xs sm:text-sm text-amber-800/80 dark:text-amber-300/80 mt-1.5 leading-relaxed">
                        Explore sanctum sanctorum & holy Shikhar in panoramic 3D view.
                      </p>
                    </div>
                    {onOpen360Tour && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpen360Tour(temple);
                        }}
                        className="py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xs cursor-pointer text-center"
                      >
                        Launch 360° Tour
                      </button>
                    )}
                  </div>
                )}

                {temple.liveDarshanUrl && (
                  <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 flex flex-col justify-between gap-4">
                    <div>
                      <p className="font-bold text-red-900 dark:text-red-200 text-base flex items-center gap-2">
                        <Video className="w-5 h-5 text-red-600" />
                        Live Darshan Stream
                      </p>
                      <p className="text-xs sm:text-sm text-red-800/80 dark:text-red-300/80 mt-1.5 leading-relaxed">
                        Live stream of morning Pakshal Puja and evening Sandhya Aarti.
                      </p>
                    </div>
                    {onOpenLiveDarshan && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenLiveDarshan(temple);
                        }}
                        className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs cursor-pointer text-center"
                      >
                        Watch Live Stream
                      </button>
                    )}
                  </div>
                )}

                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex flex-col justify-between gap-4">
                  <div>
                    <p className="font-bold text-emerald-900 dark:text-emerald-200 text-base flex items-center gap-2">
                      <Heart className="w-5 h-5 text-emerald-600" />
                      Temple Seva & Nitya Puja
                    </p>
                    <p className="text-xs sm:text-sm text-emerald-800/80 dark:text-emerald-300/80 mt-1.5 leading-relaxed">
                      Contribute to maintenance, aarti sponsorship & jivdaya bird feeders.
                    </p>
                  </div>
                  {onOpenDonation && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenDonation(temple);
                      }}
                      className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs cursor-pointer text-center"
                    >
                      Make a Contribution
                    </button>
                  )}
                </div>
              </div>

              {/* VISITOR REVIEWS & SUGGESTIONS DIRECTLY AT BOTTOM OF OVERVIEW */}
              <div id="reviews-section" className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                      <MessageSquare className="w-6 h-6 text-amber-500" />
                      Pilgrim Reviews & Suggestions (दर्शनार्थी अनुभव एवं सुझाव)
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Have you visited {temple.templeName}? Share your sacred experience or give suggestions to the trust committee.
                    </p>
                  </div>
                  <button
                    onClick={() => scrollToSection('reviews')}
                    className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    View All ({reviewsList.length}) →
                  </button>
                </div>

                {/* Reviews & Suggestions Embed */}
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                  {/* Action Banner */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800">
                    <div>
                      <p className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        Visited this holy tirth recently?
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                        Your honest feedback helps fellow yatris and helps the Prabandhak trust improve facilities.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => scrollToSection('reviews')}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md cursor-pointer flex items-center gap-2 shrink-0"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Write Review / Suggestion</span>
                    </button>
                  </div>

                  {/* Top Reviews Showcase */}
                  {reviewsList.length > 0 ? (
                    <div className="space-y-4">
                      {reviewsList.slice(0, 3).map((rev) => (
                        <div key={rev.id} className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-black text-sm flex items-center justify-center">
                                {rev.userName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                  {rev.userName}
                                  {rev.userCity && <span className="text-xs font-normal text-slate-500">({rev.userCity})</span>}
                                </p>
                                <p className="text-xs text-slate-400">{rev.visitDate || 'Recent Visit'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {rev.type === 'suggestion' ? (
                                <span className="px-2.5 py-1 bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-black rounded-lg flex items-center gap-1">
                                  <Lightbulb className="w-3.5 h-3.5" /> Suggestion for Trust
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 text-xs font-black rounded-lg flex items-center gap-1">
                                  ★ {rev.rating} / 5
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic text-center py-4">
                      No reviews submitted yet. Be the first pilgrim to share your visit experience!
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: VISITOR REVIEWS & SUGGESTIONS (FULL DEDICATED VIEW) */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Header / Intro Banner */}
              <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent p-6 sm:p-8 rounded-2xl border border-amber-200 dark:border-amber-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                    <MessageSquare className="w-6 h-6 text-amber-500" />
                    Visitor Reviews & Suggestions for {temple.templeName}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    Every pilgrim's experience matters. Your suggestions are read by temple trustees and help devotees plan their holy pilgrimage.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="px-5 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
                    <p className="text-2xl font-black text-amber-500">★ {temple.rating ? temple.rating.toFixed(1) : '5.0'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Average Score</p>
                  </div>
                  <div className="px-5 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{reviewsList.length}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Submissions</p>
                  </div>
                </div>
              </div>

              {/* REVIEW & SUGGESTION SUBMISSION FORM */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                      {reviewType === 'review' ? <Star className="w-6 h-6" /> : <Lightbulb className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-serif font-black text-lg text-slate-900 dark:text-white">
                        {reviewType === 'review' ? 'Share Your Sacred Darshan Experience' : 'Provide Suggestion to Temple Trust'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500">
                        {reviewType === 'review' ? 'Rate facilities, rituals, and darshan peace.' : 'Constructive ideas to improve pilgrim comfort & cleanliness.'}
                      </p>
                    </div>
                  </div>

                  {/* Toggle between Review & Suggestion */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold">
                    <button
                      type="button"
                      onClick={() => setReviewType('review')}
                      className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                        reviewType === 'review'
                          ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                      <span>Review</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewType('suggestion')}
                      className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                        reviewType === 'suggestion'
                          ? 'bg-sky-600 text-white shadow-xs font-black'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <Lightbulb className="w-4 h-4" />
                      <span>Suggestion</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmitReviewOrSuggestion} className="space-y-5 text-sm">
                  {/* Star Rating */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                      {reviewType === 'review' ? 'Your Overall Rating' : 'Rating of Facilities (Optional)'}
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setReviewRating(star)}
                            className="p-1 text-slate-300 hover:scale-125 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`w-7 h-7 sm:w-8 sm:h-8 ${
                                (hoverRating || reviewRating) >= star
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400">
                        {reviewRating === 5 && '★★★★★ (Divine / अलौकिक दर्शन)'}
                        {reviewRating === 4 && '★★★★☆ (Very Good & Well Managed)'}
                        {reviewRating === 3 && '★★★☆☆ (Good / सामान्य)'}
                        {reviewRating === 2 && '★★☆☆☆ (Needs Improvement)'}
                        {reviewRating === 1 && '★☆☆☆☆ (Dissatisfied)'}
                      </span>
                    </div>
                  </div>

                  {/* Aspect Category Selector & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 text-xs sm:text-sm">
                        Category / Aspect
                      </label>
                      <select
                        value={reviewCategory}
                        onChange={(e) => setReviewCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold cursor-pointer"
                      >
                        <option value="General">General Pilgrimage Experience (समग्र अनुभव)</option>
                        <option value="Darshan">Garbhagriha & Darshan (गर्भगृह दर्शन)</option>
                        <option value="Cleanliness">Temple Cleanliness & Hygiene (स्वच्छता)</option>
                        <option value="Dharamshala">Dharamshala & Guest Rooms (धर्मशाला व्यवस्था)</option>
                        <option value="Bhojanashala">Pure Jain Bhojanashala (भोजनशाला)</option>
                        <option value="Yatra & Facilities">Doli, Steps, Water & Parking (यात्रा सुविधाएं)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 text-xs sm:text-sm">
                        When did you visit?
                      </label>
                      <input
                        type="text"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        placeholder="e.g. August 2026, or Last Diwali"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium"
                      />
                    </div>
                  </div>

                  {/* Devotee Identity Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 text-xs sm:text-sm">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="e.g. Rahul Shah"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 text-xs sm:text-sm">
                        City / Jain Sangh
                      </label>
                      <input
                        type="text"
                        value={reviewerCity}
                        onChange={(e) => setReviewerCity(e.target.value)}
                        placeholder="e.g. Mumbai, Ahmedabad, Surat"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium"
                      />
                    </div>
                  </div>

                  {/* Comment / Suggestion Textarea */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 text-xs sm:text-sm">
                      {reviewType === 'review'
                        ? 'Your Review / Darshan Experience *'
                        : 'Your Suggestion for Trust Management *'}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder={
                        reviewType === 'review'
                          ? 'Describe your darshan experience, temple tranquility, morning pakshal, and how well the trust managed the rituals...'
                          : 'Suggest improvements for drinking water, room booking, shoe keeping, elderly assistance, clean toilets, or bhojanashala...'
                      }
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium leading-relaxed resize-none focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Submission Action */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-500" />
                      <span>Published immediately for community devotees & forwarded to trust committee.</span>
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting || !reviewerName.trim() || !reviewComment.trim()}
                      className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Submitting...' : reviewType === 'review' ? 'Submit Review' : 'Send Suggestion'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* LIST OF DEVOTEE REVIEWS & SUGGESTIONS */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h4 className="font-serif font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                    Devotee Feedback & Suggestions ({filteredReviews.length})
                  </h4>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
                    <button
                      onClick={() => setReviewFilter('all')}
                      className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                        reviewFilter === 'all'
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      All ({reviewsList.length})
                    </button>
                    <button
                      onClick={() => setReviewFilter('review')}
                      className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        reviewFilter === 'review'
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5" />
                      Reviews ({reviewsOnly.length})
                    </button>
                    <button
                      onClick={() => setReviewFilter('suggestion')}
                      className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        reviewFilter === 'suggestion'
                          ? 'bg-sky-600 text-white font-black'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      Suggestions ({suggestionsOnly.length})
                    </button>
                  </div>
                </div>

                {/* Feedback Cards */}
                {filteredReviews.length > 0 ? (
                  <div className="space-y-4">
                    {filteredReviews.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5 transition-all hover:border-amber-400/50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-base flex items-center justify-center shadow-xs">
                              {item.userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-base text-slate-900 dark:text-white">
                                  {item.userName}
                                </p>
                                {item.isVerifiedVisitor && (
                                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-md flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Pilgrim
                                  </span>
                                )}
                              </div>
                              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                {item.userCity && <span>{item.userCity} • </span>}
                                <span>{item.visitDate || 'Visited'}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1.5">
                            {item.type === 'suggestion' ? (
                              <span className="px-3 py-1 bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-black text-xs rounded-lg flex items-center gap-1.5 border border-sky-300 dark:border-sky-800">
                                <Lightbulb className="w-4 h-4 text-sky-600" /> Suggestion for Trust
                              </span>
                            ) : (
                              <div className="flex items-center gap-1 text-amber-400">
                                {[1, 2, 3, 4, 5].map((st) => (
                                  <Star
                                    key={st}
                                    className={`w-4 h-4 ${
                                      st <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}

                            {item.category && item.category !== 'General' && (
                              <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                                {item.category}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-slate-50/80 dark:bg-slate-800/40 p-4 rounded-xl">
                          "{item.comment}"
                        </p>

                        <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
                          {item.type === 'suggestion' ? (
                            <span className="text-xs font-semibold text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                              📋 Shared with Temple Trust Administration
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Sacred Darshan Feedback
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleUpvoteReview(item.id)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Helpful ({ (item.helpfulCount || 0) + (upvotedReviews[item.id] || 0) })</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
                    <p className="font-bold text-base text-slate-700 dark:text-slate-300">
                      No feedback under this filter yet.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Be the first devotee to share your review or helpful suggestion.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TIMINGS & AARTI */}
          {activeTab === 'timings' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-500">
                    <Clock className="w-6 h-6" />
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">Mandir Darshan Hours</h4>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{temple.timings || '6:00 AM - 9:00 PM'}</p>
                  <p className="text-xs sm:text-sm text-slate-500">Open daily for devotee darshan & Chaityavandan.</p>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-red-500">
                    <Sparkles className="w-6 h-6" />
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">Daily Aarti Schedule</h4>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{temple.aartiTimings || 'Morning 7:00 AM, Evening 7:30 PM'}</p>
                  <p className="text-xs sm:text-sm text-slate-500">Mangala Aarti and Evening Sandhya Aarti with Dhol-Nagada.</p>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-sky-500">
                    <Calendar className="w-6 h-6" />
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">Pakshal & Snatra Puja</h4>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{temple.pujaTimings || 'Morning 6:30 AM - 8:30 AM'}</p>
                  <p className="text-xs sm:text-sm text-slate-500">Pooja clothes (vastra) mandatory for Jinendra abhishek.</p>
                </div>
              </div>

              {/* Devotee Guidelines */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <h3 className="font-serif text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  Purity & Sacred Conduct Rules
                </h3>
                <ul className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Please enter after washing feet and removing all footwear at the main entrance facility.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Traditional unstitched white cotton or silk puja clothes must be worn for Jinendra Snatra & Pakshal Puja.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Leather items (belts, wallets, bags) and electronic devices should be deposited in the cloakroom.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Navkarshi timings are observed before commencing any temple rituals.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: FACILITIES & BHOJANASHALA */}
          {activeTab === 'facilities' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dharamshala */}
                <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400">
                    <Home className="w-6 h-6" />
                    <h4 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Dharamshala & Yatri Nivas</h4>
                  </div>
                  <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                    <p>
                      <strong>Capacity:</strong> {temple.hasAccommodation ? `${temple.dharamshalaRooms || 'Available'} Guest Rooms` : 'Dharamshala available within 500m'}
                    </p>
                    <p>
                      <strong>Room Categories:</strong> Deluxe AC, Semi-Deluxe Air-Cooled & Non-AC Family Rooms with attached baths.
                    </p>
                    <p>
                      <strong>Check-in Hours:</strong> 24-Hour reception desk for pilgrims. Valid government photo ID card required.
                    </p>
                    <p>
                      <strong>Booking Helpline:</strong>{' '}
                      <a href={`tel:${temple.trustPhone}`} className="text-amber-600 font-bold hover:underline">
                        {temple.trustPhone || '+91 98765 43210'}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Bhojanashala */}
                <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
                    <Utensils className="w-6 h-6" />
                    <h4 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Pure Jain Bhojanashala</h4>
                  </div>
                  <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                    <p>
                      <strong>Food Standard:</strong> 100% Satvik Jain Bhojan prepared strictly without root vegetables (onion, garlic, potato, carrots).
                    </p>
                    <p>
                      <strong>Navkarsi Breakfast:</strong> Post sunrise to 9:30 AM
                    </p>
                    <p>
                      <strong>Lunch:</strong> 11:30 AM to 1:30 PM
                    </p>
                    <p>
                      <strong>Chovihar Dinner:</strong> Strictly served and completed before Sunset (as per Jain Panchang).
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Facilities */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <Car className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                  <p className="font-bold text-sm text-slate-900 dark:text-white">Parking</p>
                  <p className="text-xs text-slate-500 mt-1">{temple.hasParking ? 'Designated Bus & Car Parking' : 'Nearby Public Parking'}</p>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <Award className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-sm text-slate-900 dark:text-white">Wheelchair & Lift</p>
                  <p className="text-xs text-slate-500 mt-1">Accessible ramps for senior devotees</p>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <Compass className="w-6 h-6 text-sky-500 mx-auto mb-2" />
                  <p className="font-bold text-sm text-slate-900 dark:text-white">Doli / Palki Service</p>
                  <p className="text-xs text-slate-500 mt-1">Available for mountain & hill climbs</p>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <FileText className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="font-bold text-sm text-slate-900 dark:text-white">Gyan Bhandar</p>
                  <p className="text-xs text-slate-500 mt-1">Library of sacred Jain literature</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TRUST & CONTACT */}
          {activeTab === 'trust' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                <h3 className="font-serif text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                  <ShieldCheck className="w-6 h-6 text-amber-500" />
                  Temple Managing Trust Committee
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-400">Managing Body</p>
                    <p className="font-black text-slate-900 dark:text-white text-lg mt-1">
                      {temple.trustContactPerson || `${temple.templeName} Prabandh Samiti`}
                    </p>
                    <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                      Registered Religious & Charitable Trust under Devasthan Department.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-400">Administrative Office</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-300 text-base mt-1">
                      {temple.address}, {temple.city}, {temple.state} - {temple.country}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4">
                  <a
                    href={`tel:${temple.trustPhone}`}
                    className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Helpline: {temple.trustPhone || '+91 98765 43210'}</span>
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Inquiry</span>
                  </a>

                  {temple.trustEmail && (
                    <a
                      href={`mailto:${temple.trustEmail}`}
                      className="px-5 py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Mail className="w-4 h-4 text-amber-400" />
                      <span>Email Office</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PHOTO GALLERY (OFFICIAL PHOTOS MANAGED BY TRUST PANEL) */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Header explaining that photos are managed via temple panel */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                    <Camera className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    Temple Photograph Gallery ({images.length})
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Official photographs of Moolnayak Jinendra, temple architecture, Dharamshala, and annual festivities.
                  </p>
                </div>
                <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Managed via Temple Trust Panel</span>
                </div>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`group relative h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden cursor-pointer shadow-xs border transition-all ${
                      activeImageIndex === idx
                        ? 'border-amber-500 ring-4 ring-amber-500/40 scale-[1.02]'
                        : 'border-slate-200 dark:border-slate-800 hover:scale-[1.02]'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${temple.templeName} photo ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Eye className="w-4 h-4" /> View Full Image
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SEVA & DONATIONS */}
          {activeTab === 'donations' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                      <Heart className="w-6 h-6 text-emerald-500" />
                      Holy Temple Seva & Online Contributions
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      All donations are exempt from Income Tax under Section 80G. Digital tax receipts issued instantly.
                    </p>
                  </div>
                  <button
                    onClick={handleCopyUpi}
                    className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                  >
                    {copiedUpi ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedUpi ? 'UPI Copied!' : 'Copy UPI ID'}</span>
                  </button>
                </div>

                {/* Donation Card */}
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <p className="text-xs text-slate-400 font-bold uppercase">Official Trust UPI ID</p>
                    <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                      {temple.donationUpi || 'palitana.tirth@upi'}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Scan via GPay, PhonePe, Paytm or BHIM UPI apps.
                    </p>
                  </div>

                  {onOpenDonation && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenDonation(temple);
                      }}
                      className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer shrink-0"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>Donate Online Now</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Page Bottom Comprehensive Footer */}
        <footer className="mt-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>{temple.templeName}</span>
                <span className="text-slate-400">•</span>
                <span className="text-amber-600 dark:text-amber-400 font-normal text-xs">{temple.city}, {temple.state}</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Devotee helpline: <a href={`tel:${temple.trustPhone}`} className="text-amber-600 font-bold hover:underline">{temple.trustPhone || '+91 98765 43210'}</a>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const mainEl = document.querySelector('main');
                  if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to Top</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Close Full Screen
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
