import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useApp } from '../context/AppContext';
import { JainSanghaMandal, SanghaCategory, SanghaTradition } from '../types';
import {
  MapPin,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Mail,
  ExternalLink,
  Navigation,
  Globe2,
  Users,
  Building,
  CheckCircle2,
  ShieldCheck,
  Plus,
  X,
  Share2,
  Sparkles,
  Compass,
  Clock,
  Home,
  Copy,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
  Maximize2,
  Minimize2,
  AlertCircle
} from 'lucide-react';

// Tile Layer Configurations
const SANGHA_TILE_LAYERS = {
  cartoLight: {
    name: 'Crisp Light',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  },
  standardOsm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  cartoDark: {
    name: 'Night Luxury',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  },
};

// Distance calculation between 2 coordinates in km
function computeDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
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

// Custom Leaflet Marker Icon for Jain Mandals
function createSanghaMarkerIcon(mandal: JainSanghaMandal, isSelected: boolean) {
  let primaryColor = '#d97706'; // Saffron amber
  let secondaryColor = '#b45309';

  if (mandal.category === 'Yuvak Mandal') {
    primaryColor = '#0284c7'; // Cyan / Blue for Youth
    secondaryColor = '#0369a1';
  } else if (mandal.category === 'Mahila Mandal') {
    primaryColor = '#e11d48'; // Rose for Mahila
    secondaryColor = '#be123c';
  } else if (mandal.category === 'Mahasangh') {
    primaryColor = '#7c3aed'; // Royal Purple for Mahasangh
    secondaryColor = '#6d28d9';
  } else if (mandal.category === 'Jain Community Center') {
    primaryColor = '#059669'; // Emerald for Community Center
    secondaryColor = '#047857';
  } else if (mandal.category === 'Seva Trust') {
    primaryColor = '#ea580c'; // Warm Orange for Seva Trust
    secondaryColor = '#c2410c';
  }

  const pinSize = isSelected ? 44 : 36;
  const innerSvgSize = Math.round(pinSize * 0.44);

  // Sacred Kalash & Ahimsa Hand Icon
  const svgIcon = `
    <svg style="width: ${innerSvgSize}px; height: ${innerSvgSize}px; fill: #ffffff;" viewBox="0 0 24 24">
      <path d="M12 2L9 7h6l-3-5zm-5 6h10l-1 6H8L7 8zm2 8h6v5H9v-5zm-4-1h14v2H5v-2z"/>
    </svg>
  `;

  const html = `
    <div style="position: relative; width: ${pinSize}px; height: ${pinSize + 8}px; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s ease;">
      ${isSelected ? `
        <div style="
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: ${pinSize + 16}px;
          height: ${pinSize + 16}px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.4);
          animation: pulse 1.5s infinite;
          pointer-events: none;
        "></div>
      ` : ''}
      <div style="
        width: ${pinSize}px;
        height: ${pinSize}px;
        background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
        border: ${isSelected ? '3px solid #ffffff' : '2px solid #ffffff'};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
          ${svgIcon}
        </div>
      </div>
      <div style="
        width: 10px;
        height: 4px;
        background: rgba(0,0,0,0.3);
        border-radius: 50%;
        margin-top: -2px;
        filter: blur(1px);
      "></div>
    </div>
  `;

  return L.divIcon({
    className: 'sangha-map-marker',
    html,
    iconSize: [pinSize, pinSize + 8],
    iconAnchor: [pinSize / 2, pinSize + 6],
    popupAnchor: [0, -(pinSize + 6)],
  });
}

export const GlobalSanghaMap: React.FC = () => {
  const {
    sanghas,
    selectedSanghaCity,
    setSelectedSanghaCity,
    selectedSanghaMandal,
    setSelectedSanghaMandal,
    addSanghaMandal,
    showToast,
    currentUser,
    setIsAuthModalOpen
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTradition, setSelectedTradition] = useState<string>('All');
  const [selectedTileLayer, setSelectedTileLayer] = useState<keyof typeof SANGHA_TILE_LAYERS>('cartoLight');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'map_only' | 'list_only'>('split');

  // Form State for registering new mandal
  const [regForm, setRegForm] = useState<Partial<JainSanghaMandal>>({
    name: '',
    hindiName: '',
    category: 'Sangha',
    tradition: 'All Traditions',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    address: '',
    lat: 18.9560,
    lng: 72.8080,
    contactPerson: '',
    contactRole: 'President',
    phone: '',
    mobile: '',
    email: '',
    whatsapp: '',
    website: '',
    memberHouseholdsCount: 500,
    establishedYear: 2000,
    activities: ['Daily Pathshala', 'Paryushan Mahaparva'],
    facilities: ['Community Hall', 'Library'],
    description: '',
  });

  // Extract unique cities list with count
  const cityOptions = useMemo(() => {
    const map = new Map<string, number>();
    sanghas.forEach((s) => {
      const c = s.city.trim();
      map.set(c, (map.get(c) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [sanghas]);

  // Fast-access popular city pills
  const POPULAR_CITY_PILLS = [
    'All',
    'Mumbai',
    'Ahmedabad',
    'Bengaluru',
    'Delhi',
    'Pune',
    'Surat',
    'Jaipur',
    'London',
    'New York',
    'Los Angeles'
  ];

  // Detect user geolocation
  const handleDetectUserLocation = useCallback(() => {
    setIsLocating(true);
    setLocationStatus('Locating your position...');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserCoords(coords);
          setIsLocating(false);
          setLocationStatus('Located! Showing closest mandals.');

          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([coords.lat, coords.lng], 11, { duration: 1.2 });
          }
          showToast('Location Detected', 'Calculated distances to local Jain Mandals & Sanghas.', 'info');
        },
        () => {
          setIsLocating(false);
          setLocationStatus('Could not detect location');
          showToast('Location Error', 'Unable to retrieve current location. Showing all global mandals.', 'info');
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
      setLocationStatus('Geolocation unsupported');
    }
  }, [showToast]);

  // Filtered Mandals
  const filteredMandals = useMemo(() => {
    return sanghas
      .filter((m) => {
        // City filter
        if (selectedSanghaCity !== 'All' && m.city.toLowerCase() !== selectedSanghaCity.toLowerCase()) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && m.category !== selectedCategory) {
          return false;
        }

        // Tradition filter
        if (selectedTradition !== 'All' && m.tradition !== selectedTradition) {
          return false;
        }

        // Search term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = m.name.toLowerCase().includes(q);
          const matchHindi = (m.hindiName || '').toLowerCase().includes(q);
          const matchCity = m.city.toLowerCase().includes(q);
          const matchContact = m.contactPerson.toLowerCase().includes(q);
          const matchAddress = m.address.toLowerCase().includes(q);
          const matchActivities = m.activities.some((act) => act.toLowerCase().includes(q));
          if (!matchName && !matchHindi && !matchCity && !matchContact && !matchAddress && !matchActivities) {
            return false;
          }
        }

        return true;
      })
      .map((m) => {
        const dist = userCoords ? computeDistanceKm(userCoords.lat, userCoords.lng, m.lat, m.lng) : null;
        return {
          ...m,
          distanceKm: dist,
        };
      })
      .sort((a, b) => {
        if (a.distanceKm !== null && b.distanceKm !== null) {
          return a.distanceKm - b.distanceKm;
        }
        return b.memberHouseholdsCount - a.memberHouseholdsCount;
      });
  }, [sanghas, selectedSanghaCity, selectedCategory, selectedTradition, searchTerm, userCoords]);

  // Fly map to a specific mandal and select it
  const handleSelectMandal = useCallback((mandal: JainSanghaMandal, openModal = false) => {
    setSelectedSanghaMandal(mandal);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([mandal.lat, mandal.lng], 14, { duration: 1 });
      const marker = markersMapRef.current.get(mandal.id);
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 1000);
      }
    }
    if (openModal) {
      setIsDetailModalOpen(true);
    }
  }, [setSelectedSanghaMandal]);

  // Copy contact details to clipboard
  const handleCopyContact = (mandal: JainSanghaMandal) => {
    const text = `🙏 Jai Jinendra!\n${mandal.name}\n${mandal.address}\nContact: ${mandal.contactPerson} (${mandal.contactRole})\nPhone: ${mandal.phone || mandal.mobile}\nEmail: ${mandal.email || 'N/A'}`;
    navigator.clipboard.writeText(text);
    showToast('Contact Copied', `Details for ${mandal.name} copied to clipboard.`, 'success');
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter: [number, number] = [20.5937, 78.9629]; // India center
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
    });

    // Add Tile Layer
    const currentLayer = SANGHA_TILE_LAYERS[selectedTileLayer];
    L.tileLayer(currentLayer.url, {
      maxZoom: 19,
      attribution: currentLayer.attribution,
    }).addTo(map);

    // Marker Cluster Group
    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 50,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `
            <div style="
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background: linear-gradient(135deg, #d97706, #b45309);
              border: 2.5px solid #ffffff;
              box-shadow: 0 4px 12px rgba(180, 83, 9, 0.45);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-family: inherit;
            ">
              <span style="font-size: 13px; font-weight: 900; line-height: 1;">${count}</span>
              <span style="font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Sangh</span>
            </div>
          `,
          className: 'sangha-cluster-icon',
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });
      },
    });

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;
    mapInstanceRef.current = map;

    // Resize observer to prevent map rendering bugs when switching tabs
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (clusterGroupRef.current) {
        clusterGroupRef.current.clearLayers();
      }
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when filteredMandals or selection changes
  useEffect(() => {
    if (!mapInstanceRef.current || !clusterGroupRef.current) return;

    const cluster = clusterGroupRef.current;
    cluster.clearLayers();
    markersMapRef.current.clear();

    filteredMandals.forEach((mandal) => {
      const isSelected = selectedSanghaMandal?.id === mandal.id;
      const markerIcon = createSanghaMarkerIcon(mandal, isSelected);
      const marker = L.marker([mandal.lat, mandal.lng], { icon: markerIcon });

      // Build Rich Interactive Popup HTML
      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 text-slate-900 dark:text-slate-100 max-w-xs';
      popupContent.innerHTML = `
        <div style="font-family: inherit;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 800; background: #fef3c7; color: #92400e; border: 1px solid #fde68a;">
              ${mandal.category}
            </span>
            <span style="font-size: 10px; font-weight: 700; color: #059669; display: flex; align-items: center; gap: 2px;">
              ✓ Verified Sangh
            </span>
          </div>
          <h4 style="font-size: 14px; font-weight: 800; color: #1e293b; margin: 0 0 2px 0; line-height: 1.25;">
            ${mandal.name}
          </h4>
          ${mandal.hindiName ? `<p style="font-size: 11px; color: #64748b; margin: 0 0 6px 0; font-weight: 600;">${mandal.hindiName}</p>` : ''}
          <p style="font-size: 11px; color: #475569; margin: 0 0 8px 0; display: flex; align-items: start; gap: 4px;">
            📍 <span>${mandal.address}</span>
          </p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 8px; margin-bottom: 8px; font-size: 11px;">
            <span style="display: block; font-weight: 700; color: #0f172a;">👤 ${mandal.contactPerson}</span>
            <span style="display: block; color: #64748b; font-size: 10px;">${mandal.contactRole}</span>
          </div>
          <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 6px;">
            <a href="tel:${(mandal.phone || mandal.mobile).replace(/[^0-9+]/g, '')}" 
               style="display: flex; align-items: center; justify-content: center; gap: 4px; padding: 6px 10px; border-radius: 8px; background: #0284c7; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: 800;">
              📞 Call
            </a>
            ${mandal.whatsapp ? `
              <a href="https://wa.me/${mandal.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Jai Jinendra! Inquiring via Global Sangha Map.')}" 
                 target="_blank" rel="noopener noreferrer"
                 style="display: flex; align-items: center; justify-content: center; gap: 4px; padding: 6px 10px; border-radius: 8px; background: #16a34a; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: 800;">
                💬 WhatsApp
              </a>
            ` : `
              <a href="https://www.google.com/maps/dir/?api=1&destination=${mandal.lat},${mandal.lng}" 
                 target="_blank" rel="noopener noreferrer"
                 style="display: flex; align-items: center; justify-content: center; gap: 4px; padding: 6px 10px; border-radius: 8px; background: #d97706; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: 800;">
                🧭 Directions
              </a>
            `}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 280 });
      marker.on('click', () => {
        setSelectedSanghaMandal(mandal);
      });

      cluster.addLayer(marker);
      markersMapRef.current.set(mandal.id, marker);
    });

    // Auto fit bounds if city filter is active
    if (selectedSanghaCity !== 'All' && filteredMandals.length > 0) {
      const lats = filteredMandals.map((m) => m.lat);
      const lngs = filteredMandals.map((m) => m.lng);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      if (filteredMandals.length === 1) {
        mapInstanceRef.current.flyTo([minLat, minLng], 14, { duration: 1 });
      } else {
        mapInstanceRef.current.fitBounds(
          [
            [minLat - 0.04, minLng - 0.04],
            [maxLat + 0.04, maxLng + 0.04],
          ],
          { padding: [40, 40], maxZoom: 14 }
        );
      }
    }
  }, [filteredMandals, selectedSanghaMandal, selectedSanghaCity, setSelectedSanghaMandal]);

  // Handle new Mandal Registration Submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.city || !regForm.address || !regForm.contactPerson || !regForm.mobile) {
      showToast('Incomplete Form', 'Please complete all mandatory mandal details.', 'error');
      return;
    }

    const newMandal = addSanghaMandal({
      name: regForm.name.trim(),
      hindiName: regForm.hindiName?.trim(),
      category: (regForm.category as SanghaCategory) || 'Sangha',
      tradition: (regForm.tradition as SanghaTradition) || 'All Traditions',
      city: regForm.city.trim(),
      state: regForm.state?.trim() || 'Maharashtra',
      country: regForm.country?.trim() || 'India',
      address: regForm.address.trim(),
      lat: Number(regForm.lat) || 19.0760,
      lng: Number(regForm.lng) || 72.8777,
      contactPerson: regForm.contactPerson.trim(),
      contactRole: regForm.contactRole?.trim() || 'President',
      phone: regForm.phone?.trim() || regForm.mobile.trim(),
      mobile: regForm.mobile.trim(),
      email: regForm.email?.trim(),
      whatsapp: regForm.whatsapp?.trim() || regForm.mobile.trim(),
      website: regForm.website?.trim(),
      memberHouseholdsCount: Number(regForm.memberHouseholdsCount) || 250,
      establishedYear: Number(regForm.establishedYear) || new Date().getFullYear(),
      activities: regForm.activities || ['Pathshala', 'Paryushan Mahaparva'],
      facilities: regForm.facilities || ['Community Hall'],
      description: regForm.description?.trim() || 'Local Jain Mandal dedicated to spiritual seva and community harmony.',
    });

    setIsRegisterModalOpen(false);
    setSelectedSanghaCity(newMandal.city);
    handleSelectMandal(newMandal);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedSanghaCity('All');
    setSelectedCategory('All');
    setSelectedTradition('All');
    setSearchTerm('');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([20.5937, 78.9629], 5, { duration: 1 });
    }
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 p-4 overflow-y-auto' : ''}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white rounded-2xl p-5 sm:p-7 shadow-xl border border-amber-600/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Worldwide Jain Mandals &amp; Communities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white flex items-center gap-2.5">
              <span>Global Sangha Map</span>
              <span className="text-xs sm:text-sm font-sans font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {filteredMandals.length} Mandals Pinned
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Discover local Jain mandals, youth samitis, mahila mandals, and NRI community centres worldwide. Filter by city, explore verified office bearers, and connect directly via call or WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleDetectUserLocation}
              disabled={isLocating}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer"
              title="Detect proximity to nearest Jain Mandals"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : 'text-amber-400'}`} />
              <span>{isLocating ? 'Detecting...' : 'Near Me'}</span>
            </button>

            <button
              onClick={() => {
                if (!currentUser) {
                  setIsAuthModalOpen(true);
                  showToast('Login Required', 'Please log in to register your local Jain Mandal or Sangha.', 'info');
                  return;
                }
                setIsRegisterModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register Local Mandal</span>
            </button>
          </div>
        </div>

        {locationStatus && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-xs text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{locationStatus}</span>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <input
              type="text"
              placeholder="Search Mandal, Locality, President, Activity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* City Filter Dropdown */}
          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={selectedSanghaCity}
                onChange={(e) => setSelectedSanghaCity(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold cursor-pointer"
              >
                <option value="All">All Cities ({sanghas.length} Mandals)</option>
                {cityOptions.map(([cityName, count]) => (
                  <option key={cityName} value={cityName}>
                    {cityName} ({count})
                  </option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 text-amber-500 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Sangha">Sangha / Samaj</option>
                <option value="Yuvak Mandal">Youth / Yuvak Mandal</option>
                <option value="Mahila Mandal">Mahila Mandal</option>
                <option value="Jain Community Center">Community Center (Global)</option>
                <option value="Seva Trust">Seva &amp; Welfare Trust</option>
                <option value="Mahasangh">Apex Mahasangh</option>
              </select>
              <Building className="w-3.5 h-3.5 text-amber-500 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Tradition Filter */}
          <div className="md:col-span-2">
            <div className="relative">
              <select
                value={selectedTradition}
                onChange={(e) => setSelectedTradition(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold cursor-pointer"
              >
                <option value="All">All Traditions</option>
                <option value="Swetambar Murtipujak">Swetambar</option>
                <option value="Digambar">Digambar</option>
                <option value="All Jains">All Jains / Unity</option>
                <option value="All Traditions">All Traditions</option>
              </select>
              <Users className="w-3.5 h-3.5 text-amber-500 absolute left-2.5 top-3" />
            </div>
          </div>
        </div>

        {/* Popular City Quick-Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0 flex items-center gap-1 mr-1">
            <MapPin className="w-3 h-3 text-amber-500" /> Quick City:
          </span>
          {POPULAR_CITY_PILLS.map((cityName) => {
            const isActive = selectedSanghaCity.toLowerCase() === cityName.toLowerCase() || (cityName === 'All' && selectedSanghaCity === 'All');
            return (
              <button
                key={cityName}
                onClick={() => setSelectedSanghaCity(cityName)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cityName}
              </button>
            );
          })}
        </div>

        {/* Filter Stats & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 font-medium">
            <span>Showing <strong>{filteredMandals.length}</strong> of <strong>{sanghas.length}</strong> registered mandals</span>
            {selectedSanghaCity !== 'All' && (
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                City: {selectedSanghaCity}
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                Category: {selectedCategory}
              </span>
            )}
          </div>

          {(selectedSanghaCity !== 'All' || selectedCategory !== 'All' || selectedTradition !== 'All' || searchTerm) && (
            <button
              onClick={handleResetFilters}
              className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Map & Directory Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Map Container (7 cols on large screens) */}
        <div className={`lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col ${isFullscreen ? 'h-[85vh]' : 'h-[540px] sm:h-[620px]'}`}>
          {/* Map Top Bar */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Interactive Leaflet Map</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Tile layer selector */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 text-[11px] font-bold">
                {(['cartoLight', 'standardOsm', 'cartoDark'] as const).map((layerKey) => (
                  <button
                    key={layerKey}
                    onClick={() => setSelectedTileLayer(layerKey)}
                    className={`px-2 py-1 rounded-md transition-all ${
                      selectedTileLayer === layerKey
                        ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {SANGHA_TILE_LAYERS[layerKey].name}
                  </button>
                ))}
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Leaflet DOM Anchor */}
          <div ref={mapContainerRef} className="flex-1 w-full relative z-10" />

          {/* Map Footer Legend */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-[11px] flex flex-wrap items-center justify-between gap-2 text-slate-500 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-3 font-semibold">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Sangh
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Youth Mandal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Mahila Mandal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Mahasangh
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Community Center
              </span>
            </div>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              Click any pin to inspect contacts
            </span>
          </div>
        </div>

        {/* Community Contact Cards & Directory List (5 cols on large screens) */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-500" />
              <span>Community Mandals &amp; Contacts ({filteredMandals.length})</span>
            </h3>
            {userCoords && (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                Sorted by proximity
              </span>
            )}
          </div>

          <div className="space-y-3 max-h-[570px] overflow-y-auto pr-1">
            {filteredMandals.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  No mandals match your selected filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredMandals.map((mandal) => {
                const isSelected = selectedSanghaMandal?.id === mandal.id;
                return (
                  <div
                    key={mandal.id}
                    onClick={() => handleSelectMandal(mandal)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-slate-900 shadow-sm ${
                      isSelected
                        ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700'
                    }`}
                  >
                    {/* Header: Name, Category, Verification */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            {mandal.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {mandal.tradition}
                          </span>
                          {mandal.isVerified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-1.5 leading-snug">
                          {mandal.name}
                        </h4>
                        {mandal.hindiName && (
                          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {mandal.hindiName}
                          </p>
                        )}
                      </div>

                      {mandal.distanceKm !== null && (
                        <div className="text-right shrink-0">
                          <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-black block">
                            {mandal.distanceKm} km
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Address & City */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{mandal.address}</span>
                    </p>

                    {/* Primary Contact Person Highlight Box */}
                    <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1 mb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-black text-xs flex items-center justify-center">
                            {mandal.contactPerson.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {mandal.contactPerson}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {mandal.contactRole}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyContact(mandal);
                          }}
                          className="p-1.5 text-slate-400 hover:text-amber-600 transition-colors"
                          title="Copy Contact Details"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                        <span className="font-semibold">{mandal.mobile || mandal.phone}</span>
                        {mandal.memberHouseholdsCount && (
                          <span className="text-[10px] font-sans text-slate-500">
                            {mandal.memberHouseholdsCount.toLocaleString()} Families
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: Direct Call, WhatsApp, Directions, More Details */}
                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                      <a
                        href={`tel:${(mandal.phone || mandal.mobile).replace(/[^0-9+]/g, '')}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all"
                        title="Direct Phone Call"
                      >
                        <Phone className="w-3.5 h-3.5 text-sky-600" />
                        <span>Call</span>
                      </a>

                      {mandal.whatsapp ? (
                        <a
                          href={`https://wa.me/${mandal.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Jai Jinendra! Connecting with ${mandal.name} via Jain Connect Global Sangha Directory.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all"
                          title="Chat on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                      ) : (
                        <a
                          href={`mailto:${mandal.email || 'contact@jainconnect.org'}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-500" />
                          <span>Email</span>
                        </a>
                      )}

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${mandal.lat},${mandal.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all"
                        title="Open in Google Maps"
                      >
                        <Navigation className="w-3.5 h-3.5 text-amber-600" />
                        <span>Map</span>
                      </a>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectMandal(mandal, true);
                        }}
                        className="px-2 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Mandal Detailed Profile Modal */}
      {isDetailModalOpen && selectedSanghaMandal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300">
                  {selectedSanghaMandal.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {selectedSanghaMandal.tradition}
                </span>
                {selectedSanghaMandal.establishedYear && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    Est. {selectedSanghaMandal.establishedYear}
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-serif">
                {selectedSanghaMandal.name}
              </h3>
              {selectedSanghaMandal.hindiName && (
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                  {selectedSanghaMandal.hindiName}
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-800/40">
              {selectedSanghaMandal.description}
            </p>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Primary Contact Person</span>
                <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm block">
                  {selectedSanghaMandal.contactPerson}
                </span>
                <span className="text-slate-500 font-medium block">
                  {selectedSanghaMandal.contactRole}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Households &amp; Office Hours</span>
                <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm block">
                  {selectedSanghaMandal.memberHouseholdsCount.toLocaleString()} Families
                </span>
                <span className="text-slate-500 font-medium block">
                  {selectedSanghaMandal.operatingHours || '08:00 AM - 08:00 PM'}
                </span>
              </div>
            </div>

            {/* Location & Address */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Complete Address &amp; Region</span>
              </span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                {selectedSanghaMandal.address}, {selectedSanghaMandal.city}, {selectedSanghaMandal.state}, {selectedSanghaMandal.country}
              </p>
            </div>

            {/* Activities & Programs */}
            {selectedSanghaMandal.activities && selectedSanghaMandal.activities.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Key Religious &amp; Community Activities
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSanghaMandal.activities.map((act, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800"
                    >
                      ✓ {act}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Facilities */}
            {selectedSanghaMandal.facilities && selectedSanghaMandal.facilities.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Campus Facilities Available
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSanghaMandal.facilities.map((fac, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      🏢 {fac}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons in Modal */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleCopyContact(selectedSanghaMandal)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Contact</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${(selectedSanghaMandal.phone || selectedSanghaMandal.mobile).replace(/[^0-9+]/g, '')}`}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {selectedSanghaMandal.phone || selectedSanghaMandal.mobile}</span>
                </a>

                {selectedSanghaMandal.whatsapp && (
                  <a
                    href={`https://wa.me/${selectedSanghaMandal.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Jai Jinendra! Inquiring via Jain Connect Global Sangha Directory.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register Local Mandal Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-950/80 rounded-full text-amber-800 dark:text-amber-300 text-xs font-extrabold mb-1">
                <Plus className="w-3.5 h-3.5 text-amber-600" />
                <span>Local Community Registration</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-serif">
                Pin Your Jain Mandal on the Global Map
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Provide official contact information so visiting devotees, sadharmik families, and youths can find and connect with your mandal.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mandal / Sangha Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kandivali Jain Yuvak Mandal"
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hindi / Regional Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. कांदिवली जैन युवक मंडल"
                    value={regForm.hindiName}
                    onChange={(e) => setRegForm({ ...regForm, hindiName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={regForm.category}
                    onChange={(e) => setRegForm({ ...regForm, category: e.target.value as SanghaCategory })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Sangha">Sangha / Derasar Trust</option>
                    <option value="Yuvak Mandal">Youth / Yuvak Mandal</option>
                    <option value="Mahila Mandal">Mahila Mandal</option>
                    <option value="Jain Community Center">Jain Community Center</option>
                    <option value="Seva Trust">Seva &amp; Charity Trust</option>
                    <option value="Mahasangh">Apex Mahasangh</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tradition / Sect *
                  </label>
                  <select
                    value={regForm.tradition}
                    onChange={(e) => setRegForm({ ...regForm, tradition: e.target.value as SanghaTradition })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="All Traditions">All Traditions / Common Sangh</option>
                    <option value="Swetambar Murtipujak">Swetambar Murtipujak</option>
                    <option value="Digambar">Digambar</option>
                    <option value="Sthanakvasi">Sthanakvasi</option>
                    <option value="Terapanthi">Terapanthi</option>
                    <option value="All Jains">All Jains</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai"
                    value={regForm.city}
                    onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maharashtra"
                    value={regForm.state}
                    onChange={(e) => setRegForm({ ...regForm, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. India"
                    value={regForm.country}
                    onChange={(e) => setRegForm({ ...regForm, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Complete Address &amp; Landmark *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Street, locality, near landmark, pincode..."
                  value={regForm.address}
                  onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shri Kantilal Mehta"
                    value={regForm.contactPerson}
                    onChange={(e) => setRegForm({ ...regForm, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Designation / Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. President / General Secretary"
                    value={regForm.contactRole}
                    onChange={(e) => setRegForm({ ...regForm, contactRole: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 00000"
                    value={regForm.mobile}
                    onChange={(e) => setRegForm({ ...regForm, mobile: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98200 00000"
                    value={regForm.whatsapp}
                    onChange={(e) => setRegForm({ ...regForm, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="contact@mandal.org"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Member Households (Approx)
                  </label>
                  <input
                    type="number"
                    placeholder="500"
                    value={regForm.memberHouseholdsCount}
                    onChange={(e) => setRegForm({ ...regForm, memberHouseholdsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Brief Description &amp; History
                </label>
                <textarea
                  rows={2}
                  placeholder="Key activities, annual sammelans, facilities available..."
                  value={regForm.description}
                  onChange={(e) => setRegForm({ ...regForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold shadow-md cursor-pointer"
                >
                  Pin Mandal on Global Map
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
