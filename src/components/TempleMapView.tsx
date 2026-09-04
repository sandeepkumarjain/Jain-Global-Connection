import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import L from '../lib/leafletSetup';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { TempleListing } from '../types';
import { VirtualTourButton } from './VirtualTourButton';
import { Virtual3DTourModal } from './Virtual3DTourModal';
import { TempleDetailsModal } from './TempleDetailsModal';
import {
  TempleMapLegend,
  getTempleSignificanceTier,
  SIGNIFICANCE_TIERS,
  TempleSignificanceTier,
  LegendColorMode,
} from './TempleMapLegend';
import {
  MapPin,
  Navigation,
  Compass,
  Video,
  Heart,
  Clock,
  ExternalLink,
  Sparkles,
  Search,
  Route as RouteIcon,
  Layers,
  Phone,
  Building2,
  X,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Home,
  Utensils,
  Camera,
  Info
} from 'lucide-react';

interface TempleMapViewProps {
  temples: TempleListing[];
  selectedTemple: TempleListing | null;
  onSelectTemple: (temple: TempleListing) => void;
  onOpenLiveDarshan: (temple: TempleListing) => void;
  onOpenDonation: (temple: TempleListing) => void;
  onViewTempleDetails?: (temple: TempleListing) => void;
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

// Helper to estimate driving time
function estimateDrivingTime(distanceKm: number): string {
  if (distanceKm <= 0) return 'Immediate';
  const averageSpeedKmH = distanceKm < 30 ? 35 : 55; // slower in city, faster on highway
  const hours = distanceKm / averageSpeedKmH;
  const totalMins = Math.round(hours * 60);
  if (totalMins < 60) return `${totalMins} mins`;
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs} hrs`;
}

// Create custom SVG Leaflet divIcon based on temple size & significance (or sect) and selection state
function createTempleIcon(
  temple: TempleListing,
  isSelected: boolean,
  colorMode: LegendColorMode = 'significance',
  isHoveredTier: boolean = false,
  isDimmed: boolean = false
) {
  const tierKey = getTempleSignificanceTier(temple);
  const tierConfig = SIGNIFICANCE_TIERS[tierKey];

  const isSwetambar = temple.sect.toLowerCase().includes('swetambar');
  const isDigambar = temple.sect.toLowerCase().includes('digambar');

  let primaryColor = tierConfig.primaryColor;
  let secondaryColor = tierConfig.secondaryColor;
  let auraColor = tierConfig.glowColor;
  let pinSize = isSelected ? tierConfig.pinSize + 8 : tierConfig.pinSize;

  if (colorMode === 'sect') {
    if (isDigambar && !isSwetambar) {
      primaryColor = '#059669'; // Emerald 600
      secondaryColor = '#047857'; // Emerald 700
      auraColor = 'rgba(5, 150, 105, 0.55)';
    } else if (isSwetambar && isDigambar) {
      primaryColor = '#7c3aed'; // Purple 600
      secondaryColor = '#6d28d9';
      auraColor = 'rgba(124, 58, 237, 0.55)';
    } else {
      primaryColor = '#d97706'; // Amber 600
      secondaryColor = '#b45309'; // Amber 700
      auraColor = 'rgba(217, 119, 6, 0.55)';
    }
    pinSize = isSelected ? 42 : 34;
  }

  if (isSelected) {
    primaryColor = '#ea580c'; // Vibrant Orange
    secondaryColor = '#c2410c';
    auraColor = 'rgba(234, 88, 12, 0.85)';
  } else if (isHoveredTier) {
    auraColor = 'rgba(251, 191, 36, 0.95)';
  }

  // Choose icon glyph based on tier
  let innerIconSvg = `<path d="M12 2L9 8h6l-3-6zm-7 8v2h14v-2H5zm1 4v6h12v-6H6zm2 2h8v2H8v-2z"/>`;
  if (tierKey === 'supreme') {
    // Grand crown / Kalash with 3 spires
    innerIconSvg = `<path d="M12 1L8 6h8l-4-5zm-6 6l-2 5h16l-2-5H6zm-1 7v7h14v-7H5zm2 2h10v3H7v-3z"/>`;
  } else if (tierKey === 'major') {
    // Sacred temple shikhar
    innerIconSvg = `<path d="M12 2L9 8h6l-3-6zm-7 8v2h14v-2H5zm1 4v6h12v-6H6zm2 2h8v2H8v-2z"/>`;
  } else if (tierKey === 'heritage') {
    // Ornate historic arch
    innerIconSvg = `<path d="M4 22h16v-2H4v2zm2-4h12V10c0-3.31-2.69-6-6-6s-6 2.69-6 6v8zm2-8c0-2.21 1.79-4 4-4s4 1.79 4 4v6H8v-6z"/>`;
  } else {
    // Community derasar / darshan flame
    innerIconSvg = `<path d="M12 2C9.24 2 7 4.24 7 7c0 3.32 5 11 5 11s5-7.68 5-11c0-2.76-2.24-5-5-5zm0 7.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>`;
  }

  const iconSvgSize = Math.max(11, Math.round(pinSize * 0.38));
  // Deterministic stagger so markers across the map pulse organically without all flashing at once
  const animDelay = ((temple.templeName.charCodeAt(0) || 0) % 8) * 0.35;

  const iconHtml = `
    <div class="temple-marker-pulse-wrapper ${isSelected ? 'is-selected' : ''} ${isHoveredTier ? 'is-highlighted' : ''} ${isDimmed ? 'is-dimmed' : ''}" style="
      animation-delay: ${animDelay}s;
    ">
      <!-- Subtle Pulsing Aura Glow Behind Pin -->
      <div class="temple-marker-aura" style="
        width: ${pinSize}px;
        height: ${pinSize}px;
        margin-left: -${pinSize / 2}px;
        background: ${auraColor};
        animation-delay: ${animDelay}s;
      "></div>

      <!-- Sacred Pin Shape -->
      <div class="temple-marker-pin" style="
        width: ${pinSize}px;
        height: ${pinSize}px;
        background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
        border: ${isSelected ? '3px solid #ffffff' : isHoveredTier ? '2.5px solid #fef08a' : '2px solid #ffffff'};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px -1px rgba(0,0,0,0.35);
        transition: all 0.25s ease;
      ">
        <div style="transform: rotate(45deg); display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <svg style="width: ${iconSvgSize}px; height: ${iconSvgSize}px; fill: #ffffff;" viewBox="0 0 24 24">
            ${innerIconSvg}
          </svg>
        </div>
      </div>

      <!-- Ground Drop Shadow -->
      <div style="
        width: ${Math.max(8, Math.round(pinSize * 0.32))}px;
        height: 4px;
        background: rgba(0,0,0,0.35);
        border-radius: 50%;
        margin-top: -2px;
        filter: blur(1px);
      "></div>
    </div>
  `;

  return L.divIcon({
    className: 'temple-map-marker',
    html: iconHtml,
    iconSize: [pinSize, pinSize + 6],
    iconAnchor: [pinSize / 2, pinSize + 4],
    popupAnchor: [0, -(pinSize + 4)],
  });
}

// Create custom SVG user location pulsating beacon
function createUserLocationIcon() {
  const iconHtml = `
    <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
      <div style="
        position: absolute;
        width: 34px;
        height: 34px;
        background: rgba(14, 165, 233, 0.35);
        border-radius: 50%;
        animation: leafletPing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        width: 15px;
        height: 15px;
        background: #0284c7;
        border: 2.5px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(2, 132, 199, 0.9);
      "></div>
    </div>
  `;

  return L.divIcon({
    className: 'user-location-marker',
    html: iconHtml,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
}

// Available tile layers
type TileLayerType = 'clean' | 'streets' | 'satellite' | 'dark';

const TILE_LAYERS: Record<TileLayerType, { url: string; attribution: string; name: string }> = {
  clean: {
    name: 'Clean Light',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  streets: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  dark: {
    name: 'Dark Mode',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
};

export const TempleMapView: React.FC<TempleMapViewProps> = ({
  temples,
  selectedTemple,
  onSelectTemple,
  onOpenLiveDarshan,
  onOpenDonation,
  onViewTempleDetails,
}) => {
  // Reference center: Palitana / Central Western India
  const defaultCenter = { lat: 21.5222, lng: 71.8383 };

  // Map DOM & Leaflet References
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const templeMarkersMapRef = useRef<Map<string, L.Marker>>(new Map());

  // State variables
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('Detecting location...');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(0); // 0 = All India
  const [mapSearchTerm, setMapSearchTerm] = useState('');
  const [selectedLayer, setSelectedLayer] = useState<TileLayerType>('streets');
  const [activeRouteTarget, setActiveRouteTarget] = useState<TempleListing | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selected360Temple, setSelected360Temple] = useState<TempleListing | null>(null);
  const [viewingTempleDetails, setViewingTempleDetails] = useState<TempleListing | null>(null);

  // Interactive Legend & Significance Filtering States
  const [legendColorMode, setLegendColorMode] = useState<LegendColorMode>('significance');
  const [activeTierFilter, setActiveTierFilter] = useState<TempleSignificanceTier | 'all'>('all');
  const [hoveredTier, setHoveredTier] = useState<TempleSignificanceTier | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Detect user geolocation
  const handleDetectLocation = useCallback(() => {
    setIsLocating(true);
    setLocationStatus('Locating your position...');

    const applyPosition = (lat: number, lng: number) => {
      const userPos = { lat, lng };
      setUserLocation(userPos);
      setIsLocating(false);
      setLocationStatus('Current location active');

      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([lat, lng], 11, { duration: 1.2 });
      }
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
        // IP fallback ignored
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
            setLocationStatus('Showing temples across India');
          }
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
      );
    } else {
      tryIpFallback().then((fallbackSuccess) => {
        if (!fallbackSuccess) {
          setIsLocating(false);
          setLocationStatus('Geolocation unsupported');
        }
      });
    }
  }, []);

  // Request location on first mount
  useEffect(() => {
    handleDetectLocation();
  }, [handleDetectLocation]);

  // Normalize temple coordinates and calculate distance from user location or default reference
  const templesWithDistance = useMemo(() => {
    const referencePos = userLocation || defaultCenter;
    return temples.map((t) => {
      const tLat =
        t.lat ||
        (t.city === 'Palitana'
          ? 21.5222
          : t.city === 'Mumbai'
          ? 18.9560
          : t.city === 'Ranakpur'
          ? 25.1158
          : t.city === 'Delhi'
          ? 28.6562
          : 21.5222);
      const tLng =
        t.lng ||
        (t.city === 'Palitana'
          ? 71.8383
          : t.city === 'Mumbai'
          ? 72.8080
          : t.city === 'Ranakpur'
          ? 73.4735
          : t.city === 'Delhi'
          ? 77.2345
          : 71.8383);

      const dist = calculateDistanceKm(referencePos.lat, referencePos.lng, tLat, tLng);
      return {
        ...t,
        lat: tLat,
        lng: tLng,
        computedDistanceKm: dist,
      };
    });
  }, [temples, userLocation]);

  // Filter temples by search query, radius, and active significance tier
  const filteredTemples = useMemo(() => {
    return templesWithDistance.filter((t) => {
      // Significance tier filter from interactive legend
      if (activeTierFilter !== 'all') {
        const tier = getTempleSignificanceTier(t);
        if (tier !== activeTierFilter) return false;
      }
      if (
        mapSearchTerm &&
        !t.templeName.toLowerCase().includes(mapSearchTerm.toLowerCase()) &&
        !t.city.toLowerCase().includes(mapSearchTerm.toLowerCase()) &&
        !t.mainDeity.toLowerCase().includes(mapSearchTerm.toLowerCase()) &&
        !t.state.toLowerCase().includes(mapSearchTerm.toLowerCase()) &&
        !t.sect.toLowerCase().includes(mapSearchTerm.toLowerCase())
      ) {
        return false;
      }
      if (maxRadiusKm > 0 && t.computedDistanceKm > maxRadiusKm) {
        return false;
      }
      return true;
    });
  }, [templesWithDistance, mapSearchTerm, maxRadiusKm, activeTierFilter]);

  // Sorted by proximity
  const sortedTemples = useMemo(() => {
    return [...filteredTemples].sort((a, b) => a.computedDistanceKm - b.computedDistanceKm);
  }, [filteredTemples]);

  // Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create map
    const map = L.map(mapContainerRef.current, {
      center: [defaultCenter.lat, defaultCenter.lng],
      zoom: 6,
      zoomControl: false,
      attributionControl: false,
    });

    // Add selected Tile Layer
    const layerConfig = TILE_LAYERS[selectedLayer];
    const tileLayer = L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution,
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Create Interactive Marker Cluster Group for Temples
    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 55, // Consolidates nearby temples cleanly at lower/mid zoom levels
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 16, // Reveals individual temple pins at street level
      chunkedLoading: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        let size = 46;
        let sizeClass = 'temple-cluster-sm';
        if (count >= 15) {
          size = 56;
          sizeClass = 'temple-cluster-lg';
        } else if (count >= 6) {
          size = 50;
          sizeClass = 'temple-cluster-md';
        }

        return L.divIcon({
          html: `
            <div class="temple-cluster-icon ${sizeClass}" style="width: ${size}px; height: ${size}px;">
              <div class="temple-cluster-glow"></div>
              <div class="temple-cluster-inner">
                <svg class="temple-cluster-svg" viewBox="0 0 24 24">
                  <path d="M12 2L9 8h6l-3-6zm-7 8v2h14v-2H5zm1 4v6h12v-6H6zm2 2h8v2H8v-2z"/>
                </svg>
                <span class="temple-cluster-count">${count}</span>
                <span class="temple-cluster-label">Temples</span>
              </div>
            </div>
          `,
          className: 'temple-marker-cluster-container',
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });
      },
    });

    map.addLayer(clusterGroup);
    markersClusterGroupRef.current = clusterGroup;

    mapInstanceRef.current = map;
    setMapReady(true);

    // Trigger map invalidation once fully rendered
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      if (markersClusterGroupRef.current) {
        markersClusterGroupRef.current.clearLayers();
      }
      map.remove();
      mapInstanceRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Update Tile Layer when user switches layers
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const map = mapInstanceRef.current;
    map.removeLayer(tileLayerRef.current);

    const layerConfig = TILE_LAYERS[selectedLayer];
    const newTileLayer = L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution,
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [selectedLayer]);

  // ResizeObserver for dynamic container adjustments
  useEffect(() => {
    if (!mapContainerRef.current || !mapInstanceRef.current) return;
    const observer = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, [isFullscreen]);

  // Update User Location Marker on Map
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (userLocation) {
      if (!userMarkerRef.current) {
        const marker = L.marker([userLocation.lat, userLocation.lng], {
          icon: createUserLocationIcon(),
          zIndexOffset: 1000,
        }).addTo(map);

        marker.bindPopup(
          `<div class="p-2 text-center text-xs font-bold text-slate-900">
            <span class="text-sky-600">📍 You are here</span>
            <p class="text-[10px] text-slate-500 font-normal">Accurate GPS Reference</p>
          </div>`,
          { className: 'custom-temple-popup', closeButton: false }
        );

        userMarkerRef.current = marker;
      } else {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      }
    } else if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }
  }, [userLocation]);

  // Generate Interactive HTML Popup for a Temple
  const generatePopupContent = useCallback((temple: any, isTargetRoute: boolean) => {
    const googleMapsDirUrl = userLocation
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${temple.lat},${temple.lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${temple.lat},${temple.lng}`;

    const hasAccommodation = temple.hasAccommodation;
    const hasParking = temple.hasParking;
    const hasLiveDarshan = Boolean(temple.liveDarshanUrl);
    const has360 = Boolean(temple.is360Available);

    const imageUrl = temple.images?.[0] || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80';

    return `
      <div class="w-72 max-w-xs text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
        <!-- Temple Banner Image (Clickable) -->
        <div
          data-action="view-temple"
          data-temple-id="${temple.id}"
          class="relative h-28 w-full overflow-hidden bg-slate-900 cursor-pointer group"
          title="Click to view full temple page and photos"
        >
          <img src="${imageUrl}" alt="${temple.templeName}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <div class="absolute top-2 left-2 flex items-center gap-1">
            <span class="px-2 py-0.5 bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase rounded-md shadow-xs backdrop-blur-xs">
              ${temple.sect}
            </span>
          </div>

          <div class="absolute top-2 right-2 flex items-center gap-1">
            <span class="px-2 py-0.5 bg-black/70 text-amber-300 text-[10px] font-black rounded-md shadow-xs backdrop-blur-xs flex items-center gap-0.5">
              📷 ${temple.images?.length || 1}
            </span>
          </div>

          <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
            <span class="text-[11px] font-extrabold flex items-center gap-1 text-amber-300">
              📍 ${temple.computedDistanceKm} km away
            </span>
            <span class="text-[10px] bg-slate-900/80 px-1.5 py-0.5 rounded text-slate-200">
              ${estimateDrivingTime(temple.computedDistanceKm)} drive
            </span>
          </div>
        </div>

        <!-- Content Body -->
        <div class="p-3 space-y-2 bg-white dark:bg-slate-900">
          <div>
            <h4
              data-action="view-temple"
              data-temple-id="${temple.id}"
              class="font-serif font-extrabold text-sm text-slate-900 dark:text-white leading-tight cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              title="Click to view details"
            >
              ${temple.templeName}
            </h4>
            <p class="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">
              ${temple.mainDeity}
            </p>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <span>📍 ${temple.city}, ${temple.state}</span>
            </p>
          </div>

          <!-- Badges -->
          <div class="flex flex-wrap gap-1 text-[9px] font-bold">
            ${
              hasAccommodation
                ? `<span class="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-0.5">🏠 Dharamshala (${temple.dharamshalaRooms || 'Yes'})</span>`
                : ''
            }
            ${
              hasParking
                ? `<span class="px-1.5 py-0.5 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 rounded border border-sky-200 dark:border-sky-800">🅿️ Parking</span>`
                : ''
            }
            ${
              hasLiveDarshan
                ? `<span class="px-1.5 py-0.5 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded border border-red-200 dark:border-red-800">📹 Live Feed</span>`
                : ''
            }
          </div>

          <!-- Action Buttons -->
          <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1.5">
            <!-- PRIMARY: VIEW THE TEMPLE & PHOTOS -->
            <button
              type="button"
              data-action="view-temple"
              data-temple-id="${temple.id}"
              class="btn-action-view-temple w-full py-2 px-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 hover:text-white text-[12px] font-black rounded-xl shadow-xs hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-amber-400/80"
              title="Open full temple page with photos, timings, facilities & history"
            >
              <span>🏛️ View Temple Details</span>
              <span class="text-[10px] opacity-90 font-mono">↗</span>
            </button>

            <div class="flex items-center gap-1.5">
              <button
                type="button"
                data-action="map-route"
                data-temple-id="${temple.id}"
                class="btn-action-map-route flex-1 px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-900 dark:text-amber-200 hover:text-slate-950 text-[11px] font-black rounded-lg border border-amber-500/40 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                title="Draw direct route on map"
              >
                <span>${isTargetRoute ? '✓ Route Active' : '📍 Map Route'}</span>
              </button>

              <a
                href="${googleMapsDirUrl}"
                target="_blank"
                rel="noreferrer"
                class="flex-1 px-2.5 py-1.5 bg-slate-900 hover:bg-black text-amber-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-bold rounded-lg shadow-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                title="Open turn-by-turn navigation in Google Maps"
              >
                <span>🚗 Navigate</span>
                <span class="text-[9px]">↗</span>
              </a>
            </div>

            <div class="flex items-center gap-1 text-[10px] font-bold">
              ${
                has360
                  ? `<button
                      type="button"
                      data-action="tour"
                      data-temple-id="${temple.id}"
                      class="btn-action-tour flex-1 py-1 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-200 rounded border border-amber-300 dark:border-amber-800 flex items-center justify-center gap-0.5 cursor-pointer"
                    >
                      🌟 360° Tour
                    </button>`
                  : ''
              }
              ${
                hasLiveDarshan
                  ? `<button
                      type="button"
                      data-action="darshan"
                      data-temple-id="${temple.id}"
                      class="btn-action-darshan flex-1 py-1 bg-red-600 hover:bg-red-700 text-white rounded flex items-center justify-center gap-0.5 cursor-pointer"
                    >
                      📹 Darshan
                    </button>`
                  : ''
              }
              <button
                type="button"
                data-action="donate"
                data-temple-id="${temple.id}"
                class="btn-action-donate flex-1 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded flex items-center justify-center gap-0.5 cursor-pointer"
              >
                💛 Seva
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }, [userLocation]);

  // Handle drawing navigation route between user and temple
  const handleDrawRoute = useCallback((temple: TempleListing) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const tLat = temple.lat || 21.5222;
    const tLng = temple.lng || 71.8383;

    setActiveRouteTarget(temple);

    // If user location is not active, prompt location
    const startPoint = userLocation || defaultCenter;

    // Remove existing polyline
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    // Draw stylized route polyline
    const polyline = L.polyline(
      [
        [startPoint.lat, startPoint.lng],
        [tLat, tLng],
      ],
      {
        color: '#f59e0b',
        weight: 4,
        opacity: 0.9,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round',
      }
    ).addTo(map);

    routePolylineRef.current = polyline;

    // Fit map bounds to show full route with comfortable padding
    const bounds = L.latLngBounds(
      [startPoint.lat, startPoint.lng],
      [tLat, tLng]
    );
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [userLocation, defaultCenter]);

  // Clear current route
  const handleClearRoute = useCallback(() => {
    if (routePolylineRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }
    setActiveRouteTarget(null);
  }, []);

  // Update Leaflet Temple Markers whenever filteredTemples or selectedTemple changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersClusterGroupRef.current) return;

    const clusterGroup = markersClusterGroupRef.current;
    clusterGroup.clearLayers();
    templeMarkersMapRef.current.clear();

    const markersToAdd: L.Marker[] = [];

    sortedTemples.forEach((temple) => {
      if (!temple.lat || !temple.lng) return;

      const isSelected = selectedTemple?.id === temple.id;
      const isTargetRoute = activeRouteTarget?.id === temple.id;
      const tier = getTempleSignificanceTier(temple);
      const isHoveredTier = hoveredTier === tier;
      const isDimmed = hoveredTier !== null && hoveredTier !== tier;

      const marker = L.marker([temple.lat, temple.lng], {
        icon: createTempleIcon(temple, isSelected, legendColorMode, isHoveredTier, isDimmed),
        zIndexOffset: isSelected ? 500 : isHoveredTier ? 300 : 10,
      });

      // Bind popup
      const popupHtml = generatePopupContent(temple, isTargetRoute);
      marker.bindPopup(popupHtml, {
        className: 'custom-temple-popup',
        maxWidth: 320,
        minWidth: 280,
      });

      // Handle popup action button events
      marker.on('popupopen', (e) => {
        const el = e.popup.getElement();
        if (!el) return;

        // View Temple button & triggers (Banner and Title)
        const viewTempleTriggers = el.querySelectorAll<HTMLElement>('[data-action="view-temple"]');
        viewTempleTriggers.forEach((trigger) => {
          trigger.onclick = (event) => {
            event.stopPropagation();
            setViewingTempleDetails(temple);
            if (onViewTempleDetails) {
              onViewTempleDetails(temple);
            }
          };
        });

        // Route button
        const routeBtn = el.querySelector<HTMLButtonElement>('.btn-action-map-route');
        if (routeBtn) {
          routeBtn.onclick = () => {
            handleDrawRoute(temple);
            onSelectTemple(temple);
          };
        }

        // 360 Tour button
        const tourBtn = el.querySelector<HTMLButtonElement>('.btn-action-tour');
        if (tourBtn) {
          tourBtn.onclick = () => {
            setSelected360Temple(temple);
          };
        }

        // Live Darshan button
        const darshanBtn = el.querySelector<HTMLButtonElement>('.btn-action-darshan');
        if (darshanBtn) {
          darshanBtn.onclick = () => {
            onOpenLiveDarshan(temple);
          };
        }

        // Donation button
        const donateBtn = el.querySelector<HTMLButtonElement>('.btn-action-donate');
        if (donateBtn) {
          donateBtn.onclick = () => {
            onOpenDonation(temple);
          };
        }
      });

      // Marker click handler
      marker.on('click', () => {
        onSelectTemple(temple);
      });

      markersToAdd.push(marker);
      templeMarkersMapRef.current.set(temple.id, marker);
    });

    clusterGroup.addLayers(markersToAdd);
  }, [sortedTemples, selectedTemple, activeRouteTarget, legendColorMode, hoveredTier, generatePopupContent, handleDrawRoute, onSelectTemple, onOpenLiveDarshan, onOpenDonation, onViewTempleDetails]);

  // When selectedTemple changes externally (e.g. from parent props or list click), pan map, uncluster if needed, and open popup
  useEffect(() => {
    if (!selectedTemple || !mapInstanceRef.current) return;
    const targetMarker = templeMarkersMapRef.current.get(selectedTemple.id);

    if (targetMarker) {
      if (markersClusterGroupRef.current) {
        markersClusterGroupRef.current.zoomToShowLayer(targetMarker, () => {
          targetMarker.openPopup();
        });
      } else {
        mapInstanceRef.current.flyTo(targetMarker.getLatLng(), 14, { duration: 1.0 });
        targetMarker.openPopup();
      }
    } else if (selectedTemple.lat && selectedTemple.lng) {
      mapInstanceRef.current.flyTo([selectedTemple.lat, selectedTemple.lng], 14, { duration: 1.0 });
    }
  }, [selectedTemple]);

  // Fit all visible temples in map view
  const handleFitAllTemples = useCallback(() => {
    if (!mapInstanceRef.current || sortedTemples.length === 0) return;
    const bounds = L.latLngBounds(
      sortedTemples.map((t) => [t.lat!, t.lng!] as [number, number])
    );
    if (userLocation) {
      bounds.extend([userLocation.lat, userLocation.lng]);
    }
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
  }, [sortedTemples, userLocation]);

  // Map Zoom Controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

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
              <span>{isLocating ? 'Detecting GPS...' : 'Use My Current Location'}</span>
            </button>

            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${userLocation ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              {userLocation ? 'GPS Position Active' : locationStatus}
            </span>
          </div>

          {/* Map Search Field */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search map tirths, deity, city, or sect..."
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

        {/* Radius Filter Pills & Map Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Radius:</span>
            {[
              { label: 'All India', value: 0 },
              { label: '< 25 km', value: 25 },
              { label: '< 50 km', value: 50 },
              { label: '< 100 km', value: 100 },
              { label: '< 250 km', value: 250 },
              { label: '< 500 km', value: 500 },
            ].map((pill) => (
              <button
                key={pill.value}
                onClick={() => setMaxRadiusKm(pill.value)}
                className={`px-3 py-1.5 min-h-[36px] text-xs font-bold rounded-xl border transition-all shrink-0 flex items-center justify-center cursor-pointer ${
                  maxRadiusKm === pill.value
                    ? 'bg-amber-600 text-white border-amber-600 shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeTierFilter !== 'all' && (
              <button
                onClick={() => setActiveTierFilter('all')}
                className="px-2.5 py-1.5 min-h-[36px] bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/60 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-900/80 transition-colors shadow-xs"
                title="Click to show all temples"
              >
                <span>Filter: {SIGNIFICANCE_TIERS[activeTierFilter]?.title}</span>
                <X className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </button>
            )}

            <button
              onClick={handleFitAllTemples}
              className="px-3 py-1.5 min-h-[36px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              title="Fit all visible temples into map bounds"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Fit All ({sortedTemples.length})</span>
            </button>

            {activeRouteTarget && (
              <button
                onClick={handleClearRoute}
                className="px-3 py-1.5 min-h-[36px] bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Route</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Map & Nearby List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Leaflet Map Canvas Box */}
        <div
          className={`lg:col-span-8 bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl relative isolate ${
            isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : 'min-h-[480px] h-[540px]'
          }`}
        >
          {/* Leaflet Map Container */}
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Floating Route Info HUD Banner (when a route is drawn) */}
          {activeRouteTarget && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur-md border border-amber-500/60 text-white px-4 py-2 rounded-2xl shadow-2xl z-40 flex items-center gap-3 animate-fadeIn max-w-[90%] pointer-events-auto">
              <div className="p-1.5 bg-amber-500 text-slate-950 rounded-lg">
                <RouteIcon className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white flex items-center gap-1">
                  <span>Navigation Route:</span>
                  <span className="text-amber-400 truncate max-w-[160px] sm:max-w-[220px]">
                    {activeRouteTarget.templeName}
                  </span>
                </p>
                <p className="text-[11px] text-slate-300">
                  Distance: <strong className="text-amber-300">{activeRouteTarget.computedDistanceKm} km</strong> • Est. Drive: <strong className="text-amber-300">{estimateDrivingTime(activeRouteTarget.computedDistanceKm)}</strong>
                </p>
              </div>

              <div className="flex items-center gap-1.5 ml-1">
                <a
                  href={
                    userLocation
                      ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${activeRouteTarget.lat},${activeRouteTarget.lng}`
                      : `https://www.google.com/maps/dir/?api=1&destination=${activeRouteTarget.lat},${activeRouteTarget.lng}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-[10px] font-black rounded-lg shadow flex items-center gap-1 shrink-0"
                  title="Open Google Maps turn-by-turn navigation"
                >
                  <Navigation className="w-3 h-3" /> Turn-by-Turn
                </a>
                <button
                  onClick={handleClearRoute}
                  className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                  title="Close route overlay"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Map Layer Switcher (Top Left) */}
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white p-1.5 rounded-xl shadow-xl flex items-center gap-1 z-30 pointer-events-auto">
            <Layers className="w-3.5 h-3.5 text-amber-400 ml-1 shrink-0" />
            {(['clean', 'streets', 'satellite', 'dark'] as const).map((layerKey) => (
              <button
                key={layerKey}
                onClick={() => setSelectedLayer(layerKey)}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                  selectedLayer === layerKey
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                {TILE_LAYERS[layerKey].name}
              </button>
            ))}
          </div>

          {/* Custom Zoom & View Controls (Top Right) */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-30 pointer-events-auto">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl overflow-hidden shadow-xl flex flex-col">
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="h-px bg-slate-800 w-full" />
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                if (userLocation && mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 13, { duration: 1.0 });
                } else {
                  handleDetectLocation();
                }
              }}
              className="p-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 hover:bg-slate-800 text-sky-400 rounded-xl shadow-xl transition-colors cursor-pointer"
              title="Center on my GPS position"
            >
              <Navigation className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 hover:bg-slate-800 text-amber-400 rounded-xl shadow-xl transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Expand Map'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Interactive Legend Overlay within .leaflet-container */}
          {mapReady && mapContainerRef.current && createPortal(
            <div className="leaflet-interactive-legend-overlay">
              <TempleMapLegend
                temples={templesWithDistance}
                colorMode={legendColorMode}
                onColorModeChange={setLegendColorMode}
                activeTierFilter={activeTierFilter}
                onTierFilterChange={setActiveTierFilter}
                hoveredTier={hoveredTier}
                onHoverTier={setHoveredTier}
                userLocation={userLocation}
              />
            </div>,
            mapContainerRef.current
          )}
        </div>

        {/* Nearby Temples Proximity List Column */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-md flex flex-col h-[540px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold font-serif text-slate-900 dark:text-white flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-500" />
                <span>Nearby Sacred Temples</span>
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Sorted by distance from {userLocation ? 'your GPS position' : 'central region'}
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
                const isRouteTarget = activeRouteTarget?.id === temple.id;

                return (
                  <div
                    key={temple.id}
                    onClick={() => {
                      onSelectTemple(temple);
                      if (temple.lat && temple.lng && mapInstanceRef.current) {
                        const targetMarker = templeMarkersMapRef.current.get(temple.id);
                        if (targetMarker) {
                          mapInstanceRef.current.flyTo([temple.lat, temple.lng], 13, { duration: 1.0 });
                          targetMarker.openPopup();
                        }
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
                          type="button"
                          onClick={() => setViewingTempleDetails(temple)}
                          className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-[10px] font-black flex items-center justify-center gap-1 shadow-xs cursor-pointer transition-colors"
                          title="View temple photos and complete details"
                        >
                          <Info className="w-3 h-3" /> Details
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDrawRoute(temple)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer transition-colors ${
                            isRouteTarget
                              ? 'bg-amber-600 text-white'
                              : 'bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                          }`}
                          title="Draw navigation route on map"
                        >
                          <RouteIcon className="w-3 h-3" /> Route
                        </button>

                        <a
                          href={
                            userLocation
                              ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${temple.lat},${temple.lng}`
                              : `https://www.google.com/maps/dir/?api=1&destination=${temple.lat},${temple.lng}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 bg-slate-900 hover:bg-black text-amber-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                          title="Get Directions in Google Maps (new tab)"
                        >
                          <Navigation className="w-3 h-3 text-amber-400" /> Navigate
                        </a>

                        <VirtualTourButton
                          temple={temple}
                          onOpenTour={(t) => setSelected360Temple(t)}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Full Temple Details & Photo Upload Modal */}
      {viewingTempleDetails && (
        <TempleDetailsModal
          temple={viewingTempleDetails}
          onClose={() => setViewingTempleDetails(null)}
          onOpenLiveDarshan={onOpenLiveDarshan}
          onOpenDonation={onOpenDonation}
          onOpen360Tour={(t) => setSelected360Temple(t)}
          userDistanceKm={
            userLocation && viewingTempleDetails.lat && viewingTempleDetails.lng
              ? Math.round(calculateDistanceKm(userLocation.lat, userLocation.lng, viewingTempleDetails.lat, viewingTempleDetails.lng))
              : undefined
          }
        />
      )}

      {/* 360-degree Virtual 3D Tour Modal */}
      {selected360Temple && (
        <Virtual3DTourModal
          temple={selected360Temple}
          onClose={() => setSelected360Temple(null)}
        />
      )}
    </div>
  );
};
