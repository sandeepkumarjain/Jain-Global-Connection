import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Clock,
  Compass,
  Navigation,
  Video,
  Heart,
  ParkingCircle,
  Home,
  Phone,
  Search,
  Plus,
  ExternalLink,
  ShieldCheck,
  X,
  Sparkles,
  DollarSign,
  Map as MapIcon,
  Grid,
  Filter,
  Columns,
  Utensils,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { TempleListing } from '../types';
import { TempleMapView } from './TempleMapView';
import { TempleSkeleton } from './Skeletons';
import { Virtual3DTourModal } from './Virtual3DTourModal';
import { VirtualTourButton } from './VirtualTourButton';
import { HolySiteVirtualTourCarouselModal } from './HolySiteVirtualTourCarouselModal';
import { HOLY_SITE_VIRTUAL_TOUR_SLIDES } from '../data/templeImages';

export const TempleSection: React.FC = () => {
  const { temples, openRegistrationModal, showToast, isLoadingData, systemSettings } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSect, setSelectedSect] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'map' | 'cards' | 'both'>('map');
  const [selectedTemple, setSelectedTemple] = useState<TempleListing | null>(null);
  const [selected360Temple, setSelected360Temple] = useState<TempleListing | null>(null);
  const [showLiveDarshan, setShowLiveDarshan] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('1100');
  const [showVirtualTourCarousel, setShowVirtualTourCarousel] = useState(false);
  const [carouselSlideIndex, setCarouselSlideIndex] = useState(0);

  // Helper to open virtual tour carousel
  const handleOpenHolySiteTour = (temple?: TempleListing) => {
    if (temple) {
      const foundIdx = HOLY_SITE_VIRTUAL_TOUR_SLIDES.findIndex(
        (s) => s.templeId === temple.id || s.title.toLowerCase().includes(temple.templeName.toLowerCase())
      );
      setCarouselSlideIndex(foundIdx >= 0 ? foundIdx : 0);
    } else {
      setCarouselSlideIndex(0);
    }
    setShowVirtualTourCarousel(true);
  };

  // AI Semantic Search State
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchActive, setAiSearchActive] = useState(false);
  const [aiMatchedIds, setAiMatchedIds] = useState<string[] | null>(null);
  const [aiSearchResultSummary, setAiSearchResultSummary] = useState('');
  const [aiSuggestedFilters, setAiSuggestedFilters] = useState<string[]>([]);

  // AI Temple Search Handler
  const handleAiTempleSearch = async (overrideQuery?: string) => {
    const q = (overrideQuery !== undefined ? overrideQuery : searchTerm).trim();
    if (!q) {
      clearAiSearch();
      return;
    }

    setIsAiSearching(true);
    try {
      const response = await fetch('/api/ai/temple-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          temples,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiMatchedIds(data.matchedIds || []);
        setAiSearchResultSummary(data.summary || `Found temples matching "${q}"`);
        setAiSuggestedFilters(data.suggestedFilters || []);
        setAiSearchActive(true);
      } else {
        throw new Error('AI search API error');
      }
    } catch (err) {
      console.warn('AI Temple Search Fallback:', err);
      // Smart client-side fallback
      const lowerQ = q.toLowerCase();
      const keywords = lowerQ.split(/\s+/).filter(Boolean);

      const matched = temples.filter((t) => {
        const fullText = `${t.templeName} ${t.mainDeity} ${t.sect} ${t.city} ${t.state} ${t.address} ${t.history || ''}`.toLowerCase();
        const facilityText = `${
          t.hasAccommodation ? 'bhojanashala bhojanalaya dharamshala room accommodation stay lodging dining food' : ''
        } ${t.hasParking ? 'parking car vehicle' : ''} ${t.liveDarshanUrl ? 'live darshan' : ''}`.toLowerCase();

        return keywords.some((k) => fullText.includes(k) || facilityText.includes(k));
      });

      setAiMatchedIds(matched.map((m) => m.id));
      setAiSearchResultSummary(`Found ${matched.length} sacred temple(s) matching "${q}".`);
      setAiSuggestedFilters(['Bhojanashala Available', 'Dharamshala Lodging', 'Lord Parshvanath']);
      setAiSearchActive(true);
    } finally {
      setIsAiSearching(false);
    }
  };

  const clearAiSearch = () => {
    setSearchTerm('');
    setAiSearchActive(false);
    setAiMatchedIds(null);
    setAiSearchResultSummary('');
    setAiSuggestedFilters([]);
  };

  const filtered = temples.filter((t) => {
    // 1. AI Search filter taking priority
    if (aiSearchActive && aiMatchedIds !== null) {
      if (!aiMatchedIds.includes(t.id)) {
        return false;
      }
    } else if (searchTerm) {
      // Standard search including Bhojanashala / facility keywords
      const q = searchTerm.toLowerCase().trim();
      const nameMatch = t.templeName.toLowerCase().includes(q);
      const cityMatch = t.city.toLowerCase().includes(q);
      const deityMatch = t.mainDeity.toLowerCase().includes(q);
      const stateMatch = t.state.toLowerCase().includes(q);
      
      const isBhojanashalaQuery = q.includes('bhojana') || q.includes('food') || q.includes('dining') || q.includes('meal');
      const isDharamshalaQuery = q.includes('dharamshala') || q.includes('stay') || q.includes('lodging') || q.includes('room');
      const isParkingQuery = q.includes('park') || q.includes('car') || q.includes('vehicle');

      const facilityMatch = (isBhojanashalaQuery || isDharamshalaQuery) && t.hasAccommodation;
      const parkingMatch = isParkingQuery && t.hasParking;

      if (!nameMatch && !cityMatch && !deityMatch && !stateMatch && !facilityMatch && !parkingMatch) {
        return false;
      }
    }

    // 2. Sect Filter
    if (selectedSect !== 'All' && !t.sect.toLowerCase().includes(selectedSect.toLowerCase())) {
      return false;
    }

    return true;
  });

  const handleDonation = () => {
    showToast('Donation Successful!', `Thank you for donating ₹ ${donationAmount} to ${selectedTemple?.templeName}. Tax exemption 80G receipt issued.`, 'success');
    setShowDonationModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{systemSettings.templeSubtitle || 'Sacred Jain Tirth & Temple Directory'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
            {systemSettings.templeHeading || 'Discover Holy Jain Tirths, Timings, Dharamshala & Live Darshan'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            Palitana, Shikharji, Ranakpur, Pawapuri, Girnar, and hundreds of city Jain Mandirs with Aarti schedules, lodging, and Google Maps directions.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenHolySiteTour()}
              className="px-5 py-3 min-h-[44px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-xl hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-200"
            >
              <Compass className="w-4 h-4 text-slate-950 animate-spin-slow" />
              <span>🌟 Virtual Tour of Holy Tirths (HD Carousel)</span>
            </button>

            <button
              onClick={() => openRegistrationModal('temple')}
              className="px-5 py-3 min-h-[44px] bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Register Your Local Temple</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI-Powered Quick Search Bar & Filters */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-900/10 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/40 p-4 sm:p-5 rounded-2xl border border-amber-300 dark:border-amber-800/80 shadow-md space-y-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs sm:text-sm">
            <span className="p-1.5 bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 rounded-lg shadow-sm flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </span>
            <span>AI-Powered Temple & Tirth Semantic Search</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Gemini 3.6 Flash
          </span>
        </div>

        {/* Form Input & AI Search Action Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAiTempleSearch();
          }}
          className="flex flex-col sm:flex-row items-stretch gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by deity ('Parshvanath'), facility ('Bhojanashala', 'Dharamshala'), city or region..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (aiSearchActive && !e.target.value) {
                  clearAiSearch();
                }
              }}
              className="w-full pl-10 pr-10 py-3 min-h-[44px] text-xs rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-amber-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
            />
            <Search className="w-4 h-4 text-amber-600 dark:text-amber-400 absolute left-3 top-3.5" />
            {searchTerm && (
              <button
                type="button"
                onClick={clearAiSearch}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isAiSearching}
            className="px-5 py-3 min-h-[44px] bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isAiSearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
                <span>AI Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>AI Search</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 shrink-0 uppercase tracking-wide">
            Quick AI Search:
          </span>
          {[
            { label: '🍱 Bhojanashala (Dining)', query: 'Bhojanashala dining facility' },
            { label: '🛏️ Dharamshala Stay', query: 'Dharamshala rooms stay lodging' },
            { label: '🌸 Lord Parshvanath', query: 'Lord Parshvanath' },
            { label: '⛰️ Palitana & Girnar', query: 'Palitana Girnar' },
            { label: '🚗 Parking & Lift', query: 'Car Parking Available' },
            { label: '📹 Live Darshan Stream', query: 'Live Darshan' },
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => {
                setSearchTerm(chip.query);
                handleAiTempleSearch(chip.query);
              }}
              className="px-2.5 py-1.5 min-h-[32px] text-[11px] font-bold rounded-xl bg-white dark:bg-slate-800 border border-amber-300/80 dark:border-amber-800/80 text-slate-800 dark:text-amber-200 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-all shrink-0 flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* AI Result Summary Badge */}
        {aiSearchActive && (
          <div className="bg-amber-100/90 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 p-3 rounded-xl flex items-center justify-between gap-2 text-xs text-amber-950 dark:text-amber-200 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-bounce" />
              <div>
                <p className="font-bold">{aiSearchResultSummary}</p>
                {aiSuggestedFilters.length > 0 && (
                  <p className="text-[10px] text-amber-800 dark:text-amber-300 mt-0.5">
                    Suggested tags: {aiSuggestedFilters.join(' • ')}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={clearAiSearch}
              className="px-2.5 py-1.5 min-h-[32px] bg-amber-200 dark:bg-amber-900 hover:bg-amber-300 dark:hover:bg-amber-800 text-amber-950 dark:text-amber-100 rounded-lg font-bold text-[10px] flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear AI Filter</span>
            </button>
          </div>
        )}

        {/* Sect Filter Pills & View Mode Selector */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Showing <strong>{filtered.length}</strong> of <strong>{temples.length}</strong> Total Database Temples</span>
            {(selectedSect !== 'All' || searchTerm || aiSearchActive) && (
              <button
                onClick={() => {
                  setSelectedSect('All');
                  clearAiSearch();
                }}
                className="ml-2 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 hover:bg-amber-200 rounded-lg text-[11px] font-extrabold transition-all"
              >
                Clear Filters (Show All {temples.length})
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
            <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Sect Filter:
            </span>
            {['All', 'Swetambar', 'Digambar'].map((sect) => (
              <button
                key={sect}
                onClick={() => setSelectedSect(sect)}
                className={`px-3.5 py-2.5 min-h-[44px] text-xs font-bold rounded-xl border transition-all shrink-0 flex items-center justify-center ${
                  selectedSect === sect
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {sect}
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Showing {filtered.length} Sacred Tirths</span>
            </p>

            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'map'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map & Nearby</span>
              </button>

              <button
                onClick={() => setViewMode('cards')}
                className={`px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'cards'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Directory Cards</span>
              </button>

              <button
                onClick={() => setViewMode('both')}
                className={`px-3.5 py-2 min-h-[44px] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'both'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split View</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content View (Skeleton vs Real Views) */}
      {isLoadingData ? (
        <TempleSkeleton />
      ) : (
        <>
          {/* Map View */}
          {(viewMode === 'map' || viewMode === 'both') && (
        <div className="space-y-3">
          <TempleMapView
            temples={filtered}
            selectedTemple={selectedTemple}
            onSelectTemple={(t) => setSelectedTemple(t)}
            onOpenLiveDarshan={(t) => {
              setSelectedTemple(t);
              setShowLiveDarshan(true);
            }}
            onOpenDonation={(t) => {
              setSelectedTemple(t);
              setShowDonationModal(true);
            }}
          />
        </div>
      )}

      {/* Temple Cards Grid */}
      {(viewMode === 'cards' || viewMode === 'both') && (
        <div className="space-y-3">
          {viewMode === 'both' && (
            <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2 pt-2">
              <Grid className="w-4 h-4 text-amber-500" />
              <span>Temple Details & Dharamshala Listings</span>
            </h3>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((t) => (
              <div
                key={t.id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden shadow-lg hover:border-amber-500/50 transition-all flex flex-col justify-between ${
                  selectedTemple?.id === t.id
                    ? 'border-amber-500 ring-2 ring-amber-500/50'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
            <div>
              {/* Image Banner */}
              <div 
                className="relative h-48 overflow-hidden bg-slate-950 cursor-pointer group"
                onClick={() => handleOpenHolySiteTour(t)}
                title="Click to launch HD Virtual Tour of this Holy Site"
              >
                <img
                  src={t.images[0]}
                  alt={t.templeName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* 3D Virtual Tour Badge Overlay */}
                <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
                  <VirtualTourButton
                    temple={t}
                    onOpenTour={(temp) => handleOpenHolySiteTour(temp)}
                    showToast={showToast}
                    size="sm"
                  />
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-500 text-amber-950 text-[10px] font-black uppercase rounded">
                      {t.sect}
                    </span>
                    {t.isVerified && (
                      <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified Tirth
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold font-serif text-white mt-1 truncate">
                    {t.templeName}
                  </h3>
                  <p className="text-xs text-amber-300 font-medium">Main Deity: {t.mainDeity}</p>
                </div>
              </div>

              {/* Details Content */}
              <div className="p-5 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <p className="line-clamp-2 italic bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-200/50 dark:border-amber-900/40">
                  "{t.history}"
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] font-bold text-slate-400">Temple Timings</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{t.timings}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] font-bold text-slate-400">Aarti Timings</p>
                    <p className="font-semibold text-amber-600 dark:text-amber-400">{t.aartiTimings}</p>
                  </div>
                </div>

                {/* Facilities Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {t.hasAccommodation && (
                    <>
                      <span className="px-2 py-1 bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-amber-200/80 dark:border-amber-800/80">
                        <Utensils className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Bhojanashala
                      </span>
                      <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded-lg text-[10px] font-bold flex items-center gap-1">
                        <Home className="w-3 h-3" /> Dharamshala ({t.dharamshalaRooms} Rooms)
                      </span>
                    </>
                  )}
                  {t.hasParking && (
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold flex items-center gap-1">
                      <ParkingCircle className="w-3 h-3" /> Parking
                    </span>
                  )}
                </div>

                <p className="flex items-center gap-1.5 text-slate-500 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{t.address}, {t.city}, {t.state}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
              <button
                onClick={() => {
                  setSelectedTemple(t);
                  setViewMode('map');
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className="py-2.5 min-h-[44px] bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg flex items-center justify-center gap-1 shadow-xs font-black cursor-pointer transition-colors"
                title="Visualize this temple on the interactive Leaflet map"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>View on Map</span>
              </button>

              <button
                onClick={() => {
                  setSelectedTemple(t);
                  setShowLiveDarshan(true);
                }}
                className="py-2.5 min-h-[44px] bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-1 shadow-xs cursor-pointer transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Live Darshan</span>
              </button>

              <button
                onClick={() => {
                  setSelectedTemple(t);
                  setShowDonationModal(true);
                }}
                className="py-2.5 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center gap-1 shadow-xs cursor-pointer transition-colors"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Donate</span>
              </button>

              <a
                href={
                  t.lat && t.lng
                    ? `https://www.google.com/maps/dir/?api=1&destination=${t.lat},${t.lng}`
                    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(t.templeName + ' ' + t.city)}`
                }
                target="_blank"
                rel="noreferrer"
                className="py-2.5 min-h-[44px] bg-slate-900 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-white rounded-lg flex items-center justify-center gap-1 hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-amber-400" />
                <span>Directions</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
        </>
      )}

      {/* Live Darshan Modal */}
      {showLiveDarshan && selectedTemple && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-white space-y-4 p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold font-serif flex items-center gap-2 text-amber-400">
                <Video className="w-5 h-5 text-red-500 animate-pulse" />
                Live Darshan Feed: {selectedTemple.templeName}
              </h3>
              <button onClick={() => setShowLiveDarshan(false)} className="text-slate-400 hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Box */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-amber-900/50 flex items-center justify-center">
              <img
                src={selectedTemple.images[0]}
                alt={selectedTemple.templeName}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex flex-col items-center justify-center text-center p-4">
                <Sparkles className="w-12 h-12 text-amber-400 animate-spin mb-2" />
                <p className="text-sm font-bold font-serif text-white">
                  🙏 Mangal Bhakti Live Darshan Stream Active
                </p>
                <p className="text-xs text-amber-300 mt-1">
                  Daily Pakshal Puja & Sandhya Aarti Stream from {selectedTemple.city}
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl space-y-1">
              <p><span className="font-bold text-amber-400">Aarti Timings:</span> {selectedTemple.aartiTimings}</p>
              <p><span className="font-bold text-amber-400">Puja Timings:</span> {selectedTemple.pujaTimings}</p>
            </div>
          </div>
        </div>
      )}

      {/* Donation Modal */}
      {showDonationModal && selectedTemple && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold font-serif text-amber-600 dark:text-amber-400">
                Temple Donation / Dev Dravya
              </h3>
              <button onClick={() => setShowDonationModal(false)} className="text-slate-400 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Contributing towards the maintenance and worship at <span className="font-bold text-slate-900 dark:text-white">{selectedTemple.templeName}</span>.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold">Select Donation Amount (₹)</label>
              <div className="grid grid-cols-4 gap-2 text-xs font-bold">
                {['501', '1100', '5100', '11000'].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setDonationAmount(amt)}
                    className={`py-2.5 min-h-[44px] rounded-xl border transition-all flex items-center justify-center ${
                      donationAmount === amt
                        ? 'bg-amber-600 text-white border-amber-600 shadow'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    ₹ {amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
              <p className="font-bold">UPI ID: {selectedTemple.donationUpi || 'temple.trust@upi'}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                80G Tax Exemption receipt will be emailed automatically after contribution.
              </p>
            </div>

            <button
              onClick={handleDonation}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-bold text-xs rounded-xl shadow-lg hover:from-amber-600 hover:to-amber-800 transition-all"
            >
              Confirm & Pay ₹ {donationAmount}
            </button>
          </div>
        </div>
      )}

      {/* 360-degree Interactive Virtual 3D Tour Modal */}
      {selected360Temple && (
        <Virtual3DTourModal
          temple={selected360Temple}
          onClose={() => setSelected360Temple(null)}
          showToast={showToast}
        />
      )}

      {/* Holy Sites Virtual Tour Carousel Modal */}
      {showVirtualTourCarousel && (
        <HolySiteVirtualTourCarouselModal
          isOpen={showVirtualTourCarousel}
          onClose={() => setShowVirtualTourCarousel(false)}
          initialSlideIndex={carouselSlideIndex}
          temples={temples}
          onOpen360Tour={(temp) => {
            setShowVirtualTourCarousel(false);
            setSelected360Temple(temp);
          }}
          onOpenDonation={(temp) => {
            setShowVirtualTourCarousel(false);
            setSelectedTemple(temp);
            setShowDonationModal(true);
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
};
