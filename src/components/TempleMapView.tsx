import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import { TempleListing } from '../types';
import {
  MapPin,
  Navigation,
  Compass,
  Video,
  Heart,
  Clock,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Search,
  Route as RouteIcon,
  Layers,
  Phone,
  Building2,
  X
} from 'lucide-react';

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

// Calculate distance in km between two lat/lng points using Haversine formula
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
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

// Helper component to pan map smoothly when center/zoom changes
function MapPanController({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !center) return;
    map.panTo(center);
    if (typeof zoom === 'number') {
      map.setZoom(zoom);
    }
  }, [map, center.lat, center.lng, zoom]);
  return null;
}

// Helper component to compute & display route polylines using Google Maps Routes API
function RouteDisplay({
  origin,
  destination,
}: {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !origin || !destination) return;

    // Clear previous route polylines
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    routesLib.Route.computeRoutes({
      origin,
      destination,
      travelMode: 'DRIVING',
      fields: ['path', 'viewport', 'distanceMeters', 'durationMillis'],
    })
      .then(({ routes }) => {
        if (routes?.[0]) {
          const polylines = routes[0].createPolylines();
          polylines.forEach((p) => p.setMap(map));
          polylinesRef.current = polylines;
          if (routes[0].viewport) {
            map.fitBounds(routes[0].viewport);
          }
        }
      })
      .catch((err) => {
        console.warn('Routes API error or quota limit:', err);
      });

    return () => {
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [routesLib, map, origin, destination]);

  return null;
}

// Live Places API Search Overlay for Jain Temples near current location
function LivePlacesSearchOverlay({
  location,
  onPlacesFound,
  isSearching,
}: {
  location: { lat: number; lng: number } | null;
  onPlacesFound: (places: any[]) => void;
  isSearching: boolean;
}) {
  const placesLib = useMapsLibrary('places');
  const map = useMap();

  useEffect(() => {
    if (!placesLib || !isSearching || !location) return;

    placesLib.Place.searchByText({
      textQuery: 'Jain temple derasar',
      fields: ['displayName', 'location', 'formattedAddress', 'rating', 'userRatingCount', 'id'],
      locationBias: location || map?.getCenter() || { lat: 18.9560, lng: 72.8080 },
      maxResultCount: 10,
    })
      .then(({ places }) => {
        if (places && places.length > 0) {
          onPlacesFound(places);
        }
      })
      .catch((err) => {
        console.warn('Places API Search error:', err);
      });
  }, [placesLib, isSearching, location, map]);

  return null;
}

export const TempleMapView: React.FC<TempleMapViewProps> = ({
  temples,
  selectedTemple,
  onSelectTemple,
  onOpenLiveDarshan,
  onOpenDonation,
}) => {
  // Default reference center: Mumbai (18.9560, 72.8080)
  const defaultCenter = { lat: 18.9560, lng: 72.8080 };
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('Detecting location...');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(0); // 0 = All distances
  const [activeInfoWindowId, setActiveInfoWindowId] = useState<string | null>(selectedTemple?.id || null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(defaultCenter);
  const [mapZoom, setMapZoom] = useState<number>(6);
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');

  // Route & Places API States
  const [activeRouteTarget, setActiveRouteTarget] = useState<{ lat: number; lng: number } | null>(null);
  const [enableLivePlaces, setEnableLivePlaces] = useState(false);
  const [livePlaces, setLivePlaces] = useState<any[]>([]);
  const [activePlaceInfoWindowId, setActivePlaceInfoWindowId] = useState<string | null>(null);
  const [mapSearchTerm, setMapSearchTerm] = useState('');

  // Request browser geolocation
  const handleDetectLocation = useCallback(() => {
    setIsLocating(true);
    setLocationStatus('Locating your position...');

    const applyPosition = (lat: number, lng: number) => {
      const userPos = { lat, lng };
      setUserLocation(userPos);
      setMapCenter(userPos);
      setMapZoom(11);
      setIsLocating(false);
      setLocationStatus('Current location detected successfully!');
    };

    const tryIpFallback = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
            applyPosition(data.latitude, data.longitude);
            return true;
          }
        }
      } catch (e) {
        // IP fallback error ignored
      }
      return false;
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          applyPosition(pos.coords.latitude, pos.coords.longitude);
        },
        async (err) => {
          console.warn('Geolocation error:', err);
          const fallbackSuccess = await tryIpFallback();
          if (!fallbackSuccess) {
            setIsLocating(false);
            setLocationStatus('Location access denied. Showing temples across India.');
          }
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
      );
    } else {
      tryIpFallback().then((fallbackSuccess) => {
        if (!fallbackSuccess) {
          setIsLocating(false);
          setLocationStatus('Geolocation unsupported. Showing default region.');
        }
      });
    }
  }, []);

  useEffect(() => {
    handleDetectLocation();
  }, [handleDetectLocation]);

  // Sync selected temple from parent props with map center & info window
  useEffect(() => {
    if (selectedTemple && selectedTemple.lat && selectedTemple.lng) {
      setMapCenter({ lat: selectedTemple.lat, lng: selectedTemple.lng });
      setMapZoom(12);
      setActiveInfoWindowId(selectedTemple.id);
    }
  }, [selectedTemple]);

  // Calculate distance for all directory temples relative to user location or default center
  const templesWithDistance = useMemo(() => {
    const referencePos = userLocation || defaultCenter;
    return temples.map((t) => {
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

  // Filter temples by search term & radius
  const filteredTemples = useMemo(() => {
    return templesWithDistance.filter((t) => {
      if (
        mapSearchTerm &&
        !t.templeName.toLowerCase().includes(mapSearchTerm.toLowerCase()) &&
        !t.city.toLowerCase().includes(mapSearchTerm.toLowerCase()) &&
        !t.mainDeity.toLowerCase().includes(mapSearchTerm.toLowerCase()) &&
        !t.state.toLowerCase().includes(mapSearchTerm.toLowerCase())
      ) {
        return false;
      }
      if (maxRadiusKm > 0 && t.computedDistanceKm > maxRadiusKm) {
        return false;
      }
      return true;
    });
  }, [templesWithDistance, mapSearchTerm, maxRadiusKm]);

  // Sorted by nearest distance first
  const sortedTemples = useMemo(() => {
    return [...filteredTemples].sort((a, b) => a.computedDistanceKm - b.computedDistanceKm);
  }, [filteredTemples]);

  return (
    <div className="space-y-4">
      {/* Top Location, Radius & Search Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Geolocation Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="px-4 py-2.5 min-h-[44px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Use My Current Location'}</span>
            </button>

            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
              {userLocation ? '📍 Current Location Active' : locationStatus}
            </span>
          </div>

          {/* Map Search Field */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search map tirths, deity, or city..."
              value={mapSearchTerm}
              onChange={(e) => setMapSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 min-h-[44px] text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            {mapSearchTerm && (
              <button
                onClick={() => setMapSearchTerm('')}
                className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Radius Filter Pills & Live Places Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Radius:</span>
            {[
              { label: 'All India', value: 0 },
              { label: '< 25 km', value: 25 },
              { label: '< 100 km', value: 100 },
              { label: '< 500 km', value: 500 },
            ].map((pill) => (
              <button
                key={pill.value}
                onClick={() => setMaxRadiusKm(pill.value)}
                className={`px-3 py-2 min-h-[44px] text-xs font-bold rounded-xl border transition-all shrink-0 flex items-center justify-center cursor-pointer ${
                  maxRadiusKm === pill.value
                    ? 'bg-amber-600 text-white border-amber-600 shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Live Google Places Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setEnableLivePlaces(!enableLivePlaces)}
              className={`px-3 py-2 min-h-[44px] text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                enableLivePlaces
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title="Search Google Maps Places API for additional local Jain temples near your position"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{enableLivePlaces ? 'Live Google Places Active' : 'Find Places API Temples'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map & Nearby List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive Google Map Box */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl relative min-h-[480px] h-[540px]">
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
                  <p><strong>Step 1:</strong> Get an API key from Google Maps Platform Console:</p>
                  <a
                    href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 underline break-all inline-block font-bold"
                  >
                    Get Google Maps API Key
                  </a>
                  <p className="pt-2"><strong>Step 2:</strong> Add key as secret in AI Studio:</p>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-200">
                    <li>Open <strong>Settings</strong> (⚙️ gear icon, top right)</li>
                    <li>Select <strong>Secrets</strong></li>
                    <li>Type secret name: <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-400">GOOGLE_MAPS_PLATFORM_KEY</code></li>
                    <li>Paste your key & press <strong>Enter</strong></li>
                  </ul>
                  <p className="text-[10px] text-slate-400 italic pt-1">
                    The app rebuilds automatically after adding the secret.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <APIProvider apiKey={API_KEY} version="weekly">
              <Map
                center={mapCenter}
                zoom={mapZoom}
                mapTypeId={mapTypeId}
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                style={{ width: '100%', height: '100%' }}
              >
                {/* Map Smooth Pan Controller */}
                <MapPanController center={mapCenter} zoom={mapZoom} />

                {/* Google Routes API Polyline Renderer */}
                {userLocation && activeRouteTarget && (
                  <RouteDisplay origin={userLocation} destination={activeRouteTarget} />
                )}

                {/* Live Places API Finder Overlay */}
                <LivePlacesSearchOverlay
                  location={userLocation || defaultCenter}
                  isSearching={enableLivePlaces}
                  onPlacesFound={(places) => setLivePlaces(places)}
                />

                {/* Current User Location Marker */}
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

                {/* Directory Temple Advanced Markers */}
                {sortedTemples.map((temple) => {
                  const isSelected = selectedTemple?.id === temple.id;
                  const isSwetambar = temple.sect.toLowerCase().includes('swetambar');
                  const isDigambar = temple.sect.toLowerCase().includes('digambar');
                  
                  let pinBg = '#f59e0b'; // Gold Swetambar
                  if (isDigambar && !isSwetambar) pinBg = '#059669'; // Green Digambar
                  if (isSwetambar && isDigambar) pinBg = '#7c3aed'; // Purple Joint
                  if (isSelected) pinBg = '#dc2626'; // Selected Red

                  return (
                    <React.Fragment key={temple.id}>
                      <AdvancedMarker
                        position={{ lat: temple.lat!, lng: temple.lng! }}
                        onClick={() => {
                          onSelectTemple(temple);
                          setActiveInfoWindowId(temple.id);
                          setMapCenter({ lat: temple.lat!, lng: temple.lng! });
                          setMapZoom(13);
                        }}
                      >
                        <Pin
                          background={pinBg}
                          borderColor="#ffffff"
                          glyphColor="#ffffff"
                          scale={isSelected ? 1.25 : 1.0}
                        />
                      </AdvancedMarker>

                      {/* Interactive InfoWindow */}
                      {activeInfoWindowId === temple.id && (
                        <InfoWindow
                          position={{ lat: temple.lat!, lng: temple.lng! }}
                          onCloseClick={() => setActiveInfoWindowId(null)}
                        >
                          <div className="p-1 max-w-xs text-slate-900 space-y-2">
                            <div className="flex items-center justify-between gap-1">
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 text-[9px] font-black uppercase rounded">
                                {temple.sect}
                              </span>
                              <span className="text-[10px] text-amber-700 font-bold flex items-center gap-0.5">
                                <MapPin className="w-3 h-3" /> {temple.computedDistanceKm} km away
                              </span>
                            </div>

                            <div>
                              <h4 className="font-bold text-xs text-slate-900 font-serif leading-tight">
                                {temple.templeName}
                              </h4>
                              <p className="text-[10px] text-slate-600 mt-0.5">
                                <strong>Main Deity:</strong> {temple.mainDeity}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                📍 {temple.city}, {temple.state}
                              </p>
                            </div>

                            {temple.hasAccommodation && (
                              <div className="text-[9px] bg-emerald-50 text-emerald-800 p-1 rounded font-semibold flex items-center gap-1">
                                🏠 Dharamshala Available ({temple.dharamshalaRooms || 'Yes'} Rooms)
                              </div>
                            )}

                            {/* InfoWindow Action Buttons */}
                            <div className="pt-1 grid grid-cols-2 gap-1 text-[10px] font-bold">
                              {userLocation && (
                                <button
                                  onClick={() => setActiveRouteTarget({ lat: temple.lat!, lng: temple.lng! })}
                                  className="px-2 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded flex items-center justify-center gap-1 shadow cursor-pointer"
                                >
                                  <RouteIcon className="w-3 h-3" /> Route
                                </button>
                              )}
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(temple.templeName + ' ' + temple.city)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-1.5 bg-slate-900 hover:bg-black text-white rounded flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Compass className="w-3 h-3 text-amber-400" /> Go
                              </a>
                            </div>

                            <div className="flex items-center gap-1 pt-0.5">
                              <button
                                onClick={() => onOpenLiveDarshan(temple)}
                                className="flex-1 py-1 bg-red-600 text-white rounded text-[9px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Video className="w-2.5 h-2.5" /> Live Darshan
                              </button>
                              <button
                                onClick={() => onOpenDonation(temple)}
                                className="flex-1 py-1 bg-emerald-600 text-white rounded text-[9px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Heart className="w-2.5 h-2.5" /> Donate
                              </button>
                            </div>
                          </div>
                        </InfoWindow>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Google Places API Live Search Markers */}
                {enableLivePlaces &&
                  livePlaces.map((p) => {
                    if (!p.location) return null;
                    const pLat = typeof p.location.lat === 'function' ? p.location.lat() : p.location.lat;
                    const pLng = typeof p.location.lng === 'function' ? p.location.lng() : p.location.lng;
                    const name = typeof p.displayName === 'string' ? p.displayName : p.displayName?.text || 'Jain Temple';

                    return (
                      <React.Fragment key={p.id || name}>
                        <AdvancedMarker
                          position={{ lat: pLat, lng: pLng }}
                          onClick={() => setActivePlaceInfoWindowId(p.id || name)}
                        >
                          <Pin background="#0284c7" borderColor="#ffffff" glyphColor="#ffffff" scale={0.9} />
                        </AdvancedMarker>

                        {activePlaceInfoWindowId === (p.id || name) && (
                          <InfoWindow
                            position={{ lat: pLat, lng: pLng }}
                            onCloseClick={() => setActivePlaceInfoWindowId(null)}
                          >
                            <div className="p-1 max-w-xs text-slate-900 space-y-1">
                              <span className="px-1.5 py-0.5 bg-sky-100 text-sky-900 text-[9px] font-bold uppercase rounded">
                                Google Places Result
                              </span>
                              <h4 className="font-bold text-xs">{name}</h4>
                              <p className="text-[10px] text-slate-600">{p.formattedAddress}</p>
                              {p.rating && (
                                <p className="text-[10px] font-bold text-amber-600">
                                  ⭐ {p.rating} ({p.userRatingCount || 0} reviews)
                                </p>
                              )}
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + (p.formattedAddress || ''))}`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-1 block py-1 bg-sky-600 text-white text-center rounded text-[10px] font-bold"
                              >
                                View on Google Maps
                              </a>
                            </div>
                          </InfoWindow>
                        )}
                      </React.Fragment>
                    );
                  })}
              </Map>
            </APIProvider>
          )}

          {/* Map Controls Overlay (Map Type Switcher & Legend) */}
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white p-1.5 rounded-xl shadow-xl flex items-center gap-1 z-10 pointer-events-auto">
            <Layers className="w-3.5 h-3.5 text-amber-400 ml-1" />
            {(['roadmap', 'satellite', 'hybrid'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMapTypeId(type)}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg capitalize transition-colors cursor-pointer ${
                  mapTypeId === type
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Quick Legend Overlay */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-amber-500/30 text-white p-2.5 rounded-xl text-[10px] space-y-1 shadow-lg pointer-events-auto z-10">
            <p className="font-bold text-amber-400 uppercase tracking-wider">Map Pin Guide:</p>
            <div className="flex flex-wrap items-center gap-3 text-slate-200">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Swetambar
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Digambar
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" /> Joint Tirth
              </span>
              {userLocation && (
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block animate-ping" /> Your Location
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Nearby Temples Proximity List Column */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-md flex flex-col h-[540px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold font-serif text-slate-900 dark:text-white flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-500" />
                <span>Nearest Sacred Tirths</span>
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Sorted by distance from {userLocation ? 'your GPS position' : 'default location'}
              </p>
            </div>
            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold text-[11px] rounded-full">
              {sortedTemples.length} Found
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1">
            {sortedTemples.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  No temples found matching radius or search filter.
                </p>
                <button
                  onClick={() => {
                    setMaxRadiusKm(0);
                    setMapSearchTerm('');
                  }}
                  className="text-xs text-amber-600 dark:text-amber-400 font-bold underline cursor-pointer"
                >
                  Clear filters & view all nationwide
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
                        setMapZoom(13);
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
                      <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full shrink-0 shadow-sm">
                        📍 {temple.computedDistanceKm} km
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
                        <Clock className="w-3 h-3 text-amber-500" /> {temple.timings?.split('(')[0] || 'Open Daily'}
                      </span>

                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onOpenLiveDarshan(temple)}
                          className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 shadow cursor-pointer"
                        >
                          <Video className="w-3 h-3" /> Live
                        </button>
                        <button
                          onClick={() => onOpenDonation(temple)}
                          className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 shadow cursor-pointer"
                        >
                          <Heart className="w-3 h-3" /> Donate
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
