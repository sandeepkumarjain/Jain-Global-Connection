import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Compass,
  Sun,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  X,
  Navigation,
  Globe,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { BASE_CITIES, findNearestCity, getGPSCustomTiming } from '../utils/jainPanchang';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSuccess: (lat: number, lng: number, cityName: string, stateName: string) => void;
  currentCityName?: string;
  isGpsSynced?: boolean;
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isOpen,
  onClose,
  onLocationSuccess,
  currentCityName,
  isGpsSynced = false,
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectStatus, setDetectStatus] = useState<'idle' | 'detecting' | 'granted' | 'blocked' | 'timeout' | 'unsupported'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'why' | 'unblock' | 'manual'>('why');
  const [browserType, setBrowserType] = useState<'chrome' | 'safari' | 'mobile'>('chrome');

  // Detect user agent for smart browser instructions
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('iphone') || ua.includes('ipad') || (ua.includes('safari') && !ua.includes('chrome'))) {
      setBrowserType('safari');
    } else if (ua.includes('android')) {
      setBrowserType('mobile');
    } else {
      setBrowserType('chrome');
    }
  }, []);

  // Check initial permission state if supported
  useEffect(() => {
    if (isOpen && 'permissions' in navigator) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          if (result.state === 'denied') {
            setDetectStatus('blocked');
            setStatusMessage('Location permission is currently blocked in your browser settings.');
          } else if (result.state === 'granted') {
            setDetectStatus('granted');
            setStatusMessage('Location permission is granted.');
          }
        })
        .catch(() => {
          // Ignore permissions query failure
        });
    }
  }, [isOpen]);

  const triggerLocationPrompt = () => {
    setIsDetecting(true);
    setDetectStatus('detecting');
    setStatusMessage('Requesting location access from your browser...');

    if (!('geolocation' in navigator)) {
      setIsDetecting(false);
      setDetectStatus('unsupported');
      setStatusMessage('Geolocation is not supported by your current browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        let detectedCity = '';
        let detectedState = '';

        // Reverse-geocode to get friendly locality name
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2500);
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);
          if (geoRes.ok) {
            const data = await geoRes.json();
            detectedCity = data.city || data.locality || data.principalSubdivision || '';
            detectedState = data.principalSubdivision || data.countryName || '';
          }
        } catch {
          // Fallback to nearest city
        }

        const nearest = findNearestCity(lat, lng);
        const finalCity = detectedCity || nearest.name;
        const finalState = detectedState || nearest.state;

        setIsDetecting(false);
        setDetectStatus('granted');
        setStatusMessage(`Successfully synced to ${finalCity}, ${finalState}!`);

        onLocationSuccess(lat, lng, finalCity, finalState);

        // Auto close after brief celebration
        setTimeout(() => {
          onClose();
        }, 1200);
      },
      (err) => {
        setIsDetecting(false);
        if (err.code === err.PERMISSION_DENIED) {
          setDetectStatus('blocked');
          setStatusMessage('Location permission was denied. Please follow the quick unblock steps below to enable it.');
          setActiveTab('unblock');
        } else if (err.code === err.TIMEOUT) {
          setDetectStatus('timeout');
          setStatusMessage('Location request timed out. Please check your GPS signal and try again.');
        } else {
          setDetectStatus('blocked');
          setStatusMessage('Unable to retrieve location. Please check your browser permissions.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0, // Force fresh prompt
      }
    );
  };

  const selectManualCity = (city: typeof BASE_CITIES[0]) => {
    onLocationSuccess(city.lat, city.lng, city.name, city.state);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/80 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl my-8 relative flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 pr-8">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center shrink-0">
              <Sun className="w-6 h-6 text-amber-100 animate-spin-slow" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-200 bg-black/25 px-2.5 py-0.5 rounded-full">
                Astronomical Precision
              </span>
              <h2 className="text-xl font-bold font-serif leading-snug mt-0.5">
                Location Access & Pachkan Timings
              </h2>
              <p className="text-xs text-amber-100 mt-0.5">
                Accurate Jain sunrise, sunset, and ritual timings for your exact city
              </p>
            </div>
          </div>
        </div>

        {/* Current Status Bar */}
        <div className="px-6 py-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-slate-600 dark:text-slate-300">
              Current Location: <strong className="text-slate-900 dark:text-white font-bold">{currentCityName || 'Madurai'}</strong>
              {isGpsSynced && <span className="ml-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">GPS Synced</span>}
            </span>
          </div>

          <button
            onClick={triggerLocationPrompt}
            disabled={isDetecting}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Navigation className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
            <span>{isDetecting ? 'Locating...' : 'Sync GPS Now'}</span>
          </button>
        </div>

        {/* Status Notification Alert (if blocked / error) */}
        {detectStatus === 'blocked' && (
          <div className="m-6 mb-0 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm">Location Access Was Blocked</p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Your browser previously denied location access for this site. Follow the quick unblock guide below or choose your city manually.
              </p>
            </div>
          </div>
        )}

        {detectStatus === 'granted' && (
          <div className="m-6 mb-0 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm">Location Synced Successfully!</p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {statusMessage}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 pt-5 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('why')}
            className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === 'why'
                ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Why We Need Location
          </button>
          <button
            onClick={() => setActiveTab('unblock')}
            className={`pb-3 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'unblock'
                ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>How to Unblock</span>
            {detectStatus === 'blocked' && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === 'manual'
                ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Select City Manually
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto max-h-[60vh]">
          {activeTab === 'why' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                    <Sun className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Exact Surya Timings</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Pachkan vows (Navkarshi, Chauvihar) strictly require local astronomical sunrise and sunset.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Nearby Temples</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Auto-sorts nearby Jain Derasars, Upashrays, and Dharamshalas by distance from you.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">100% Private</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Calculations run locally in your browser. Coordinates are never tracked or shared.
                  </p>
                </div>
              </div>

              {/* Main Action Trigger */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-slate-800 border border-amber-300 dark:border-amber-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 justify-center sm:justify-start">
                    <Navigation className="w-4 h-4 text-amber-600" />
                    <span>Trigger Browser Location Prompt</span>
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Click to grant or verify location permission in your browser.
                  </p>
                </div>

                <button
                  onClick={triggerLocationPrompt}
                  disabled={isDetecting}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
                >
                  <RotateCcw className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
                  <span>{isDetecting ? 'Prompting Browser...' : 'Prompt / Sync Location'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'unblock' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                If you previously clicked <strong>"Block"</strong> or <strong>"Don't Allow"</strong>, browsers prevent websites from asking again automatically. Here is how to unblock it in 10 seconds:
              </p>

              {/* Browser Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  onClick={() => setBrowserType('chrome')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    browserType === 'chrome'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Chrome / Edge / Brave
                </button>
                <button
                  onClick={() => setBrowserType('safari')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    browserType === 'safari'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Safari (iOS / Mac)
                </button>
                <button
                  onClick={() => setBrowserType('mobile')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    browserType === 'mobile'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Android / Mobile
                </button>
              </div>

              {/* Detailed Visual Steps */}
              {browserType === 'chrome' && (
                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0">1</span>
                    <p>Look at the address bar at the top and tap the <strong>🔒 lock or tune icon</strong> (left of the website URL).</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0">2</span>
                    <p>Find <strong>Location</strong> and toggle it from <em>Blocked</em> to <strong>"Allow"</strong> (or "Reset permission").</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0">3</span>
                    <p>Click the <strong>Prompt / Sync Location</strong> button below to refresh coordinates.</p>
                  </div>
                </div>
              )}

              {browserType === 'safari' && (
                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0">1</span>
                    <p>Tap the <strong>aA</strong> icon in the address bar (bottom or top of Safari).</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0">2</span>
                    <p>Select <strong>Website Settings</strong> &rarr; tap <strong>Location</strong> &rarr; choose <strong>"Allow"</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0">3</span>
                    <p>Tap the button below to re-sync immediately.</p>
                  </div>
                </div>
              )}

              {browserType === 'mobile' && (
                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0">1</span>
                    <p>Ensure your phone's general <strong>GPS / Location</strong> is switched ON in quick settings.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0">2</span>
                    <p>In browser settings &rarr; Site settings &rarr; Location &rarr; Allow for this site.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0">3</span>
                    <p>Click <strong>Prompt / Sync Location</strong> to lock in coordinates.</p>
                  </div>
                </div>
              )}

              <button
                onClick={triggerLocationPrompt}
                disabled={isDetecting}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <RotateCcw className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
                <span>{isDetecting ? 'Checking Permissions...' : 'Retry Location Access Now'}</span>
              </button>
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Prefer not to share GPS? Pick any city below to calculate exact Pachkan timings immediately:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1">
                {BASE_CITIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => selectManualCity(c)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-100 dark:bg-slate-800/80 dark:hover:bg-amber-950/60 border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-left transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300 truncate">
                      {c.name}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate">
                      {c.state}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 text-[11px]">
            GPS calculates Sunrise, Sunset & 7 Pachkan categories
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
