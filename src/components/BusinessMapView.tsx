import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { BusinessListing } from '../types';
import {
  MapPin,
  Navigation,
  Compass,
  Phone,
  MessageSquare,
  Mail,
  QrCode,
  Printer,
  ShieldCheck,
  Star,
  ExternalLink,
  Search,
  Filter,
  X,
  Building2,
  CheckCircle2,
  Maximize2,
  Sparkles,
  LocateFixed
} from 'lucide-react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// Default Known City Coordinates for Jain Commercial Hubs
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Mumbai: { lat: 18.9560, lng: 72.8080 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Surat: { lat: 21.1702, lng: 72.8311 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Indore: { lat: 22.7196, lng: 75.8577 },
  Delhi: { lat: 28.6139, lng: 77.2090 },
  Ludhiana: { lat: 30.8901, lng: 75.8812 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Hyderabad: { lat: 17.3850, lng: 78.4867 },
};

// Calculate distance in km between two lat/lng points
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function getBusinessCoordinates(b: BusinessListing): { lat: number; lng: number } {
  if (typeof b.latitude === 'number' && typeof b.longitude === 'number' && !isNaN(b.latitude) && !isNaN(b.longitude)) {
    return { lat: b.latitude, lng: b.longitude };
  }
  
  const alt = b as any;
  if (typeof alt.lat === 'number' && typeof alt.lng === 'number' && !isNaN(alt.lat) && !isNaN(alt.lng)) {
    return { lat: alt.lat, lng: alt.lng };
  }

  // Fallback to City Center with a unique micro-offset based on business ID hash
  const cityMatch = CITY_COORDINATES[b.city] || CITY_COORDINATES['Mumbai'];
  
  let hash = 0;
  for (let i = 0; i < b.id.length; i++) {
    hash = (hash << 5) - hash + b.id.charCodeAt(i);
    hash |= 0;
  }
  const offsetLat = ((hash % 100) - 50) * 0.0012;
  const offsetLng = (((hash >> 2) % 100) - 50) * 0.0012;

  return {
    lat: cityMatch.lat + offsetLat,
    lng: cityMatch.lng + offsetLng,
  };
}

interface BusinessMapViewProps {
  businesses: BusinessListing[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  openGmailModal: (email: string, subject: string, body: string) => void;
  setVisitingCardBusiness: (b: BusinessListing) => void;
  setQrModalBusiness: (b: BusinessListing) => void;
  isOwnerOfBusiness: (b: BusinessListing) => boolean;
  currentUser: any;
  setIsAuthModalOpen: (open: boolean) => void;
  showToast: (title: string, msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const BusinessMapView: React.FC<BusinessMapViewProps> = ({
  businesses,
  selectedCategory,
  onSelectCategory,
  openGmailModal,
  setVisitingCardBusiness,
  setQrModalBusiness,
  isOwnerOfBusiness,
  currentUser,
  setIsAuthModalOpen,
  showToast,
}) => {
  const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Center of India
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessListing | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('Click to detect current GPS location');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('All Cities');
  const [onlyGstFilter, setOnlyGstFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 19.0760, lng: 72.8777 }); // Mumbai default
  const [mapZoom, setMapZoom] = useState<number>(6);

  // Filter verified businesses
  const verifiedBusinesses = useMemo(() => {
    return businesses.filter((b) => b.isVerified && b.status === 'Approved');
  }, [businesses]);

  // Extract unique cities
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    verifiedBusinesses.forEach((b) => {
      if (b.city) cities.add(b.city);
    });
    return ['All Cities', ...Array.from(cities).sort()];
  }, [verifiedBusinesses]);

  // Filtered dataset
  const filteredBusinesses = useMemo(() => {
    return verifiedBusinesses.filter((b) => {
      const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
      const matchesCity = selectedCityFilter === 'All Cities' || b.city === selectedCityFilter;
      const matchesGst = !onlyGstFilter || Boolean(b.gstNumber);
      const matchesSearch =
        !searchQuery ||
        b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.productsAndServices && b.productsAndServices.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesCity && matchesGst && matchesSearch;
    });
  }, [verifiedBusinesses, selectedCategory, selectedCityFilter, onlyGstFilter, searchQuery]);

  // Map elements with coordinates & computed distance
  const mappedBusinesses = useMemo(() => {
    return filteredBusinesses.map((b) => {
      const coords = getBusinessCoordinates(b);
      const distanceKm = userLocation
        ? calculateDistanceKm(userLocation.lat, userLocation.lng, coords.lat, coords.lng)
        : null;
      return {
        ...b,
        coords,
        distanceKm,
      };
    });
  }, [filteredBusinesses, userLocation]);

  // Auto-fit map center when city or selection changes
  useEffect(() => {
    if (selectedBusiness) {
      const coords = getBusinessCoordinates(selectedBusiness);
      setMapCenter(coords);
      setMapZoom(13);
    } else if (selectedCityFilter !== 'All Cities' && CITY_COORDINATES[selectedCityFilter]) {
      setMapCenter(CITY_COORDINATES[selectedCityFilter]);
      setMapZoom(11);
    } else if (mappedBusinesses.length > 0) {
      setMapCenter(mappedBusinesses[0].coords);
      setMapZoom(6);
    }
  }, [selectedBusiness, selectedCityFilter]);

  // Geolocation detector
  const handleDetectUserLocation = useCallback(() => {
    setIsLocating(true);
    setLocationStatus('Locating your position via GPS...');

    const applyPosition = (lat: number, lng: number) => {
      const userPos = { lat, lng };
      setUserLocation(userPos);
      setMapCenter(userPos);
      setMapZoom(11);
      setIsLocating(false);
      setLocationStatus('GPS location detected successfully!');
      showToast('GPS Detected', 'Map centered on your current location', 'success');
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          applyPosition(pos.coords.latitude, pos.coords.longitude);
        },
        async () => {
          try {
            const res = await fetch('https://ipapi.co/json/');
            if (res.ok) {
              const data = await res.json();
              if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
                applyPosition(data.latitude, data.longitude);
                return;
              }
            }
          } catch (e) {
            // Error handling ignored
          }
          setIsLocating(false);
          setLocationStatus('Unable to access location.');
          showToast('Location Access', 'Could not detect GPS location.', 'info');
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
      );
    } else {
      setIsLocating(false);
      setLocationStatus('Geolocation is not supported by your browser.');
    }
  }, [showToast]);

  const handleWhatsAppChat = (phone: string, businessName: string) => {
    if (!currentUser) {
      showToast('Sign In Required', 'Please sign in or register to connect via WhatsApp.', 'info');
      setIsAuthModalOpen(true);
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Jai Jinendra! I am interested in your business ${businessName} listed on Jain Connect Global.`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
      
      {/* HEADER & CONTROLS TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="p-2.5 bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-2xl border border-amber-500/40">
            <MapPin className="w-5 h-5 text-amber-500" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-serif">
                Interactive Commercial Map
              </h3>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 rounded-full font-black text-[11px] uppercase tracking-wider">
                {mappedBusinesses.length} Verified Pins
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explore verified Jain manufacturers, jewelers, doctors, and firms on live map. Click any pin for Quick-View card.
            </p>
          </div>
        </div>

        {/* GPS LOCATE ME BUTTON & GST FILTER */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={handleDetectUserLocation}
            disabled={isLocating}
            className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-xs rounded-xl border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title={locationStatus}
          >
            <LocateFixed className={`w-4 h-4 text-amber-500 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{userLocation ? 'GPS Active' : 'Locate Me'}</span>
          </button>

          <button
            onClick={() => setOnlyGstFilter(!onlyGstFilter)}
            className={`px-3 py-2 text-xs font-black rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              onlyGstFilter
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-emerald-500'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>GST Verified Only</span>
          </button>
        </div>
      </div>

      {/* SEARCH & CITY QUICK FILTERS */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700/80">
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search map by name, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 no-scrollbar text-xs">
          {availableCities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCityFilter(city)}
              className={`px-3 py-1.5 rounded-xl font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                selectedCityFilter === city
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400'
              }`}
            >
              {city === 'All Cities' ? '🌐 All Cities' : `📍 ${city}`}
            </button>
          ))}
        </div>
      </div>

      {/* MAP GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* INTERACTIVE MAP CONTAINER */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-lg h-[500px] relative bg-slate-950">
          
          {hasValidKey ? (
            <APIProvider apiKey={API_KEY} version="weekly">
              <Map
                center={mapCenter}
                zoom={mapZoom}
                onCenterChanged={(e) => setMapCenter(e.detail.center)}
                onZoomChanged={(e) => setMapZoom(e.detail.zoom)}
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                style={{ width: '100%', height: '100%' }}
              >
                {/* User Current Location Marker */}
                {userLocation && (
                  <AdvancedMarker position={userLocation} title="Your Current Location">
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-sky-400 opacity-75"></span>
                      <div className="w-5 h-5 bg-sky-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                  </AdvancedMarker>
                )}

                {/* Business Markers */}
                {mappedBusinesses.map((b) => {
                  const isSelected = selectedBusiness?.id === b.id;
                  return (
                    <AdvancedMarker
                      key={b.id}
                      position={b.coords}
                      onClick={() => setSelectedBusiness(b)}
                    >
                      <Pin
                        background={isSelected ? '#f59e0b' : b.gstNumber ? '#059669' : '#d97706'}
                        borderColor="#ffffff"
                        glyphColor="#ffffff"
                      />
                    </AdvancedMarker>
                  );
                })}

                {/* Selected Business InfoWindow */}
                {selectedBusiness && (
                  <InfoWindow
                    position={getBusinessCoordinates(selectedBusiness)}
                    onCloseClick={() => setSelectedBusiness(null)}
                  >
                    <div className="p-1 max-w-xs text-slate-900 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[9px] font-black uppercase rounded">
                          {selectedBusiness.category}
                        </span>
                        {selectedBusiness.isVerified && (
                          <span className="text-[10px] text-emerald-700 font-bold">
                            ✓ Verified
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 font-serif leading-tight">
                        {selectedBusiness.businessName}
                      </h4>

                      <p className="text-[10px] text-slate-600 truncate">
                        📍 {selectedBusiness.address}, {selectedBusiness.city}
                      </p>

                      <div className="pt-1 flex items-center gap-1">
                        <button
                          onClick={() => {
                            setVisitingCardBusiness(selectedBusiness);
                          }}
                          className="px-2.5 py-1.5 bg-slate-900 text-amber-300 rounded text-[10px] font-bold flex items-center justify-center gap-1 shadow cursor-pointer"
                        >
                          <QrCode className="w-3 h-3" /> Quick Card
                        </button>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${selectedBusiness.businessName} ${selectedBusiness.address} ${selectedBusiness.city}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 bg-amber-600 text-white rounded text-[10px] font-bold flex items-center justify-center gap-1 shadow"
                        >
                          <Navigation className="w-3 h-3" /> Directions
                        </a>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          ) : (
            /* STANDALONE INTERACTIVE EMBEDDED MAP CANVAS ENGINE (No API Key Required Fallback) */
            <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 flex flex-col justify-between p-4">
              
              {/* Background OpenStreetMap Tile Texture */}
              <div
                className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')`,
                }}
              />

              {/* Map Header Overlay */}
              <div className="relative z-10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-amber-500/30 shadow-lg text-white">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-amber-300">
                    Live Commercial Map ({mappedBusinesses.length} Pins Loaded)
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  Click any business pin to open Quick-View Card
                </span>
              </div>

              {/* INTERACTIVE PINS GRID ON CANVAS */}
              <div className="relative z-10 my-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[360px] overflow-y-auto p-2">
                {mappedBusinesses.map((b) => {
                  const isSelected = selectedBusiness?.id === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBusiness(b)}
                      className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between group cursor-pointer relative ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-white shadow-2xl scale-105 z-20 ring-4 ring-amber-400/50'
                          : 'bg-slate-900/90 text-white border-slate-700/80 hover:border-amber-400 hover:bg-slate-800'
                      }`}
                    >
                      {/* Badge */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                          isSelected ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {b.category}
                        </span>
                        {b.gstNumber && (
                          <ShieldCheck className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`} title="GST Verified" />
                        )}
                      </div>

                      {/* Name & Location */}
                      <div className="space-y-0.5">
                        <h5 className="font-extrabold text-xs leading-tight line-clamp-1">{b.businessName}</h5>
                        <p className={`text-[10px] font-medium truncate ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                          📍 {b.city}, {b.state}
                        </p>
                      </div>

                      {/* Distance Tag if user location detected */}
                      {b.distanceKm !== null && (
                        <div className="mt-2 pt-1 border-t border-white/20 text-[9px] font-mono font-bold flex items-center justify-between">
                          <span>Dist:</span>
                          <span>{b.distanceKm} km</span>
                        </div>
                      )}

                      {/* Pin Icon Indicator */}
                      <div className="absolute -top-1 -right-1">
                        <span className={`w-3 h-3 rounded-full inline-block ${b.gstNumber ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Map Footer Legend */}
              <div className="relative z-10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[10px] text-slate-300">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> GST Verified
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Commercial Pin
                  </span>
                </div>
                <span>Select pin to view details</span>
              </div>
            </div>
          )}

          {/* QUICK-VIEW CARD OVERLAY (FLOATING OVER MAP) */}
          {selectedBusiness && (
            <div className="absolute bottom-3 left-3 right-3 z-30 bg-white dark:bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-4 shadow-2xl text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {/* Close Overlay Button */}
              <button
                onClick={() => setSelectedBusiness(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 cursor-pointer"
                title="Close Card"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 pr-8">
                {/* Logo */}
                <img
                  src={selectedBusiness.logoUrl}
                  alt={selectedBusiness.businessName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0 bg-white"
                />

                {/* Business Info */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-[10px] rounded-full uppercase border border-amber-500/30">
                      {selectedBusiness.category}
                    </span>
                    {selectedBusiness.isVerified && (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] rounded-full flex items-center gap-1 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        Verified
                      </span>
                    )}
                    {selectedBusiness.gstNumber && (
                      <span className="px-2 py-0.5 bg-sky-500/20 text-sky-700 dark:text-sky-300 font-mono font-bold text-[10px] rounded-full border border-sky-500/30">
                        GST: {selectedBusiness.gstNumber}
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white font-serif truncate">
                    {selectedBusiness.businessName}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{selectedBusiness.address}, {selectedBusiness.city}, {selectedBusiness.state}</span>
                  </p>
                </div>
              </div>

              {/* QUICK ACTION BUTTONS */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
                <button
                  onClick={() => handleWhatsAppChat(selectedBusiness.whatsapp, selectedBusiness.businessName)}
                  className="py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    if (!currentUser) {
                      showToast('Sign In Required', 'Please sign in or register to send emails via Gmail.', 'info');
                      setIsAuthModalOpen(true);
                      return;
                    }
                    openGmailModal(
                      selectedBusiness.email,
                      `Inquiry regarding ${selectedBusiness.businessName}`,
                      `Respected Vendor,\n\nI found your business listing on the Jain Connect Global Commercial Map.`
                    );
                  }}
                  className="py-2 px-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Gmail</span>
                </button>

                <button
                  onClick={() => {
                    setVisitingCardBusiness(selectedBusiness);
                  }}
                  className="py-2 px-2 bg-slate-950 text-amber-300 dark:bg-amber-500 dark:text-slate-950 rounded-xl flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Digital Card</span>
                </button>

                <button
                  onClick={() => {
                    setQrModalBusiness(selectedBusiness);
                  }}
                  className="py-2 px-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 rounded-xl border border-amber-500/40 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-500" />
                  <span>QR Poster</span>
                </button>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${selectedBusiness.businessName} ${selectedBusiness.address} ${selectedBusiness.city}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="col-span-2 sm:col-span-1 py-2 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl flex items-center justify-center gap-1 shadow-sm text-center"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR LIST OF MAPPED BUSINESSES */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Directory Listings ({mappedBusinesses.length})
            </h4>
            <span className="text-[10px] text-slate-500">Click card to highlight pin</span>
          </div>

          {mappedBusinesses.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs space-y-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4">
              <Building2 className="w-8 h-8 text-amber-500/50 mx-auto" />
              <p className="font-bold">No businesses found matching filter.</p>
              <button
                onClick={() => {
                  onSelectCategory('All');
                  setSelectedCityFilter('All Cities');
                  setOnlyGstFilter(false);
                  setSearchQuery('');
                }}
                className="text-amber-600 dark:text-amber-400 font-extrabold underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            mappedBusinesses.map((b) => {
              const isSelected = selectedBusiness?.id === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBusiness(b)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 text-xs ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/40 dark:bg-amber-500/10'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <img
                      src={b.logoUrl}
                      alt={b.businessName}
                      className="w-11 h-11 rounded-xl object-cover border shrink-0 bg-white"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className="font-bold text-slate-900 dark:text-white truncate">
                          {b.businessName}
                        </h5>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 shrink-0">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{b.rating || 4.9}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold truncate">
                        {b.category}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        📍 {b.address}, {b.city}
                      </p>
                    </div>
                  </div>

                  {b.productsAndServices && b.productsAndServices.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {b.productsAndServices.slice(0, 2).map((ps, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-[9px] rounded border border-slate-200 dark:border-slate-700 truncate max-w-[140px]"
                        >
                          • {ps}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700/60 text-[10px] text-slate-500 font-bold">
                    <span>{b.gstNumber ? '✓ GST Verified' : 'Commercial Listing'}</span>
                    {b.distanceKm !== null && (
                      <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                        {b.distanceKm} km away
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
