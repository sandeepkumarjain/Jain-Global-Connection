import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { TempleListing } from '../types';
import { MapPin, Navigation, Compass, Video, Heart, Clock, ShieldCheck, ExternalLink, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface TempleMapViewProps {
  temples: TempleListing[];
  selectedTemple: TempleListing | null;
  onSelectTemple: (temple: TempleListing) => void;
  onOpenLiveDarshan: (temple: TempleListing) => void;
  onOpenDonation: (temple: TempleListing) => void;
}

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

export const TempleMapView: React.FC<TempleMapViewProps> = ({
  temples,
  selectedTemple,
  onSelectTemple,
  onOpenLiveDarshan,
  onOpenDonation,
}) => {
  // Default location: Mumbai (18.9560, 72.8080)
  const defaultCenter = { lat: 18.9560, lng: 72.8080 };
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('Detecting current location...');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(0); // 0 = All distances
  const [activeInfoWindowId, setActiveInfoWindowId] = useState<string | null>(selectedTemple?.id || null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(defaultCenter);
  const [mapZoom, setMapZoom] = useState<number>(6);

  // Request browser geolocation
  const handleDetectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser. Showing default region.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Locating your position...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(userPos);
        setMapCenter(userPos);
        setMapZoom(11);
        setIsLocating(false);
        setLocationStatus('Current location detected successfully!');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        setLocationStatus('Location access denied/unavailable. Showing temples across India.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }, []);

  useEffect(() => {
    handleDetectLocation();
  }, [handleDetectLocation]);

  // Sync selected temple with map center & info window
  useEffect(() => {
    if (selectedTemple && selectedTemple.lat && selectedTemple.lng) {
      setMapCenter({ lat: selectedTemple.lat, lng: selectedTemple.lng });
      setMapZoom(12);
      setActiveInfoWindowId(selectedTemple.id);
    }
  }, [selectedTemple]);

  // Compute distance for all temples relative to user location or map center
  const templesWithDistance = useMemo(() => {
    const referencePos = userLocation || defaultCenter;
    return temples.map((t) => {
      // Default approx lat/lng if not explicitly provided
      const tLat = t.lat || (t.city === 'Palitana' ? 21.5222 : t.city === 'Mumbai' ? 18.9560 : 25.1158);
      const tLng = t.lng || (t.city === 'Palitana' ? 71.8383 : t.city === 'Mumbai' ? 72.8080 : 73.4735);

      const computedDist = calculateDistanceKm(referencePos.lat, referencePos.lng, tLat, tLng);
      return {
        ...t,
        lat: tLat,
        lng: tLng,
        computedDistanceKm: computedDist,
      };
    });
  }, [temples, userLocation]);

  // Filter temples by radius if set
  const filteredTemples = useMemo(() => {
    if (maxRadiusKm <= 0) return templesWithDistance;
    return templesWithDistance.filter((t) => t.computedDistanceKm <= maxRadiusKm);
  }, [templesWithDistance, maxRadiusKm]);

  // Sorted by nearest distance first
  const sortedTemples = useMemo(() => {
    return [...filteredTemples].sort((a, b) => a.computedDistanceKm - b.computedDistanceKm);
  }, [filteredTemples]);

  return (
    <div className="space-y-4">
      {/* Top Location & Distance Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="px-3.5 py-2.5 min-h-[44px] bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Use My Current Location'}</span>
            </button>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {userLocation ? '📍 Location Active' : locationStatus}
            </span>
          </div>

          {/* Radius Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
            <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Radius:</span>
            {[
              { label: 'All India', value: 0 },
              { label: 'Within 25 km', value: 25 },
              { label: 'Within 100 km', value: 100 },
              { label: 'Within 500 km', value: 500 },
            ].map((pill) => (
              <button
                key={pill.value}
                onClick={() => setMaxRadiusKm(pill.value)}
                className={`px-3 py-2 min-h-[44px] text-xs font-bold rounded-xl border transition-all shrink-0 flex items-center justify-center ${
                  maxRadiusKm === pill.value
                    ? 'bg-amber-600 text-white border-amber-600 shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map Box & Side List Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive Google Map Column */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl relative min-h-[480px] h-[520px]">
          {!hasValidKey ? (
            <div className="h-full flex items-center justify-center p-6 text-center text-white bg-slate-900">
              <div className="max-w-md space-y-4">
                <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-full w-fit mx-auto text-amber-400">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-serif text-amber-300">
                  Google Maps API Key Required
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  To view interactive satellite and road map views of sacred Jain Tirths & Derasars with live markers:
                </p>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left text-xs space-y-2 text-slate-300">
                  <p><strong>Step 1:</strong> Get an API key from Google Maps Platform Console.</p>
                  <p><strong>Step 2:</strong> Add secret in AI Studio:</p>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-200">
                    <li>Open <strong>Settings</strong> (⚙️ top right) → <strong>Secrets</strong></li>
                    <li>Add key name: <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-400">GOOGLE_MAPS_PLATFORM_KEY</code></li>
                    <li>Paste your key & press <strong>Enter</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
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

                {/* Temple Markers */}
                {sortedTemples.map((temple) => {
                  const isSelected = selectedTemple?.id === temple.id;
                  return (
                    <React.Fragment key={temple.id}>
                      <AdvancedMarker
                        position={{ lat: temple.lat!, lng: temple.lng! }}
                        onClick={() => {
                          onSelectTemple(temple);
                          setActiveInfoWindowId(temple.id);
                        }}
                      >
                        <Pin
                          background={isSelected ? '#d97706' : temple.sect.includes('Swetambar') ? '#f59e0b' : '#059669'}
                          borderColor="#fff"
                          glyphColor="#fff"
                        />
                      </AdvancedMarker>

                      {activeInfoWindowId === temple.id && (
                        <InfoWindow
                          position={{ lat: temple.lat!, lng: temple.lng! }}
                          onCloseClick={() => setActiveInfoWindowId(null)}
                        >
                          <div className="p-1 max-w-xs text-slate-900 space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 text-[9px] font-black uppercase rounded">
                                {temple.sect}
                              </span>
                              <span className="text-[10px] text-amber-700 font-bold">
                                📍 {temple.computedDistanceKm} km away
                              </span>
                            </div>

                            <h4 className="font-bold text-xs text-slate-900 font-serif leading-tight">
                              {temple.templeName}
                            </h4>

                            <p className="text-[10px] text-slate-600">
                              <strong>Deity:</strong> {temple.mainDeity}
                            </p>

                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>{temple.city}, {temple.state}</span>
                            </p>

                            <div className="pt-1 flex items-center gap-1">
                              <button
                                onClick={() => onOpenLiveDarshan(temple)}
                                className="px-2.5 py-2 min-h-[44px] bg-red-600 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 shadow"
                              >
                                <Video className="w-3 h-3" /> Live
                              </button>
                              <button
                                onClick={() => onOpenDonation(temple)}
                                className="px-2.5 py-2 min-h-[44px] bg-amber-600 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 shadow"
                              >
                                <Heart className="w-3 h-3" /> Donate
                              </button>
                              <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(temple.templeName + ' ' + temple.city)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-2 min-h-[44px] bg-slate-900 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1"
                              >
                                <Compass className="w-3 h-3 text-amber-400" /> Go
                              </a>
                            </div>
                          </div>
                        </InfoWindow>
                      )}
                    </React.Fragment>
                  );
                })}
              </Map>
            </APIProvider>
          )}

          {/* Quick Legend Overlay */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-amber-500/30 text-white p-2.5 rounded-xl text-[10px] space-y-1 shadow-lg pointer-events-auto">
            <p className="font-bold text-amber-400 uppercase tracking-wider">Map Legend:</p>
            <div className="flex items-center gap-3 text-slate-200">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Swetambar
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Digambar
              </span>
              {userLocation && (
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> Your Location
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Nearby Temples Sorted List Column */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-md flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold font-serif text-slate-900 dark:text-white flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-500" />
                <span>Nearby Sacred Temples</span>
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Sorted by proximity from {userLocation ? 'your location' : 'reference city'}
              </p>
            </div>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold text-[11px] rounded-full">
              {sortedTemples.length} Found
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-1">
            {sortedTemples.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  No temples found within {maxRadiusKm} km radius.
                </p>
                <button
                  onClick={() => setMaxRadiusKm(0)}
                  className="text-xs text-amber-600 dark:text-amber-400 font-bold underline"
                >
                  Show all temples nationwide
                </button>
              </div>
            ) : (
              sortedTemples.map((temple) => {
                const isSelected = selectedTemple?.id === temple.id;
                return (
                  <div
                    key={temple.id}
                    onClick={() => {
                      onSelectTemple(temple);
                      setActiveInfoWindowId(temple.id);
                      if (temple.lat && temple.lng) {
                        setMapCenter({ lat: temple.lat, lng: temple.lng });
                        setMapZoom(12);
                      }
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 text-[9px] font-black uppercase rounded">
                          {temple.sect}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white font-serif mt-1 line-clamp-1">
                          {temple.templeName}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full shrink-0">
                        {temple.computedDistanceKm} km
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                      <span className="font-semibold text-amber-600 dark:text-amber-400">Deity:</span> {temple.mainDeity}
                    </p>

                    <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="truncate">{temple.city}, {temple.state}</span>
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" /> {temple.timings}
                      </span>

                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onOpenLiveDarshan(temple)}
                          className="px-2.5 py-2 min-h-[44px] bg-red-600 text-white rounded-lg text-[10px] font-bold hover:bg-red-700 flex items-center justify-center"
                        >
                          Live
                        </button>
                        <button
                          onClick={() => onOpenDonation(temple)}
                          className="px-2.5 py-2 min-h-[44px] bg-amber-600 text-white rounded-lg text-[10px] font-bold hover:bg-amber-700 flex items-center justify-center"
                        >
                          Donate
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
