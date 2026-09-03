import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { playNavkarMantraAudio, stopNavkarMantraAudio } from '../utils/navkarAudio';
import { JainEventsCalendar } from './JainEventsCalendar';
import { FeaturedAdsSection } from './FeaturedAdsSection';
import { LocationPermissionModal } from './LocationPermissionModal';
import { createGoogleCalendarEvent, getGoogleCalendarWebUrl } from '../lib/googleCalendar';
import { getAccessToken, googleSignIn } from '../lib/googleAuth';
import { JAIN_AGAM_QUOTES, getCityPachkanTimings, CityPachkanTiming, findNearestCity, getGPSCustomTiming, getDailyJainPanchang } from '../utils/jainPanchang';
import {
  Calendar,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Share2,
  Copy,
  Check,
  Clock,
  Sparkles,
  BookOpen,
  MapPin,
  Navigation,
  Compass,
  RefreshCw,
  CalendarPlus,
  Flame,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  HelpCircle,
  ShieldCheck,
  AlertCircle,
  Bell
} from 'lucide-react';

export const PanchangWidget: React.FC = () => {
  const { panchang: defaultTodayPanchang, showToast, openDailyTithiAlert } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCityKey, setSelectedCityKey] = useState<string>(() => {
    try {
      return localStorage.getItem('jcg_panchang_city') || 'Madurai';
    } catch {
      return 'Madurai';
    }
  });
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [isDetectingLoc, setIsDetectingLoc] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(() => {
    try {
      return localStorage.getItem('jcg_dismiss_loc_banner') === 'true';
    } catch {
      return false;
    }
  });

  const [gpsCoords, setGpsCoords] = useState<{
    lat: number;
    lng: number;
    detectedCity?: string;
    detectedState?: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('jcg_panchang_gps');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Helper date conversions for <input type="date">
  const toInputDateStr = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseInputDateStr = (str: string): Date => {
    if (!str) return new Date();
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const selectedDateStr = toInputDateStr(selectedDate);
  const todayStr = toInputDateStr(new Date());

  const isToday = selectedDateStr === todayStr;
  const isFuture = selectedDateStr > todayStr;
  const isPast = selectedDateStr < todayStr;

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  // Compute active Panchang for selected target date
  const activePanchang = useMemo(() => {
    if (isToday && defaultTodayPanchang) return defaultTodayPanchang;
    return getDailyJainPanchang(selectedDate);
  }, [selectedDate, isToday, defaultTodayPanchang]);

  // Compute pachkan timings for selected target date & selected city
  const baseCityTimings = useMemo(() => getCityPachkanTimings(selectedDate), [selectedDate]);

  const customGpsTiming = useMemo(() => {
    if (!gpsCoords) return null;
    return getGPSCustomTiming(
      gpsCoords.lat,
      gpsCoords.lng,
      selectedDate,
      gpsCoords.detectedCity,
      gpsCoords.detectedState
    );
  }, [gpsCoords, selectedDate]);

  const cityTimingsMap: Record<string, CityPachkanTiming> = useMemo(() => {
    return {
      ...(customGpsTiming ? { [customGpsTiming.city + ' (GPS Synced)']: customGpsTiming } : {}),
      ...baseCityTimings
    };
  }, [baseCityTimings, customGpsTiming]);

  const activeTiming: CityPachkanTiming =
    cityTimingsMap[selectedCityKey] || customGpsTiming || baseCityTimings['Madurai'] || baseCityTimings['Bikaner'] || Object.values(baseCityTimings)[0];

  // Auto-calculate daily quote index based on selected date
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isSyncingToday, setIsSyncingToday] = useState(false);
  const [isTodaySynced, setIsTodaySynced] = useState(false);

  useEffect(() => {
    const startOfYear = new Date(selectedDate.getFullYear(), 0, 0);
    const diff = selectedDate.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    setCurrentQuoteIndex(Math.abs(dayOfYear) % JAIN_AGAM_QUOTES.length);
    setIsTodaySynced(false);
  }, [selectedDate]);

  const activeQuote = JAIN_AGAM_QUOTES[currentQuoteIndex] || JAIN_AGAM_QUOTES[0];

  const handleSyncTithi = async () => {
    let token = getAccessToken();
    const eventPayload = {
      title: `📿 Jain Tithi (${activePanchang.date}): ${activePanchang.tithi}`,
      description: `📅 Masa: ${activePanchang.month}\n🌅 Sunrise (${activeTiming.city}): ${activeTiming.sunrise}\n🌇 Sunset: ${activeTiming.sunset}\n⏰ Navkarshi: ${activeTiming.navkarshi}\n⏰ Chouvihar: ${activeTiming.chouvihar}\n\nSaved via Jain Connect Global Panchang Widget`,
      startDate: selectedDateStr,
      location: `${activeTiming.city}, ${activeTiming.state}`,
    };

    setIsSyncingToday(true);

    try {
      if (!token) {
        const authRes = await googleSignIn();
        if (authRes?.accessToken) {
          token = authRes.accessToken;
        }
      }

      if (token) {
        await createGoogleCalendarEvent(token, eventPayload);
        setIsTodaySynced(true);
        showToast(
          'Tithi Saved to Google Calendar!',
          `Tithi (${activePanchang.tithi}) for ${activePanchang.date} synced to your Google Calendar.`,
          'success'
        );
      } else {
        const webUrl = getGoogleCalendarWebUrl(eventPayload);
        window.open(webUrl, '_blank');
        showToast('Opening Google Calendar', `Opened calendar link for ${activePanchang.date} Tithi.`, 'info');
      }
    } catch (err: any) {
      console.warn('Calendar API sync warning, using web fallback:', err);
      const webUrl = getGoogleCalendarWebUrl(eventPayload);
      window.open(webUrl, '_blank');
      showToast('Calendar Sync', `Opened Google Calendar link for ${activePanchang.date} Tithi.`, 'info');
    } finally {
      setIsSyncingToday(false);
    }
  };

  // Ensure sound is stopped when component unmounts
  useEffect(() => {
    return () => {
      stopNavkarMantraAudio();
    };
  }, []);

  const handleChangeQuote = () => {
    const nextIdx = (currentQuoteIndex + 1) % JAIN_AGAM_QUOTES.length;
    setCurrentQuoteIndex(nextIdx);
    showToast('Agam Quote Changed', JAIN_AGAM_QUOTES[nextIdx].source, 'success');
  };

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(`${activeQuote.text} - ${activeQuote.source}`);
    setCopiedQuote(true);
    showToast('Quote Copied!', 'Jain daily quote copied to clipboard.', 'success');
    setTimeout(() => setCopiedQuote(false), 3000);
  };

  const toggleNavkarMantra = () => {
    if (isPlayingAudio) {
      stopNavkarMantraAudio();
      setIsPlayingAudio(false);
      showToast('Navkar Audio Paused', 'Audio chanting stopped.', 'info');
    } else {
      setIsPlayingAudio(true);
      showToast('Playing Navkar Mantra Chanting', 'Namo Arihantanam... Namo Siddhanam...', 'info');
      playNavkarMantraAudio(() => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleDetectLocation = async () => {
    setIsDetectingLoc(true);

    const applyGpsPosition = async (lat: number, lng: number, fallbackCity?: string, fallbackState?: string) => {
      let resolvedCity = fallbackCity;
      let resolvedState = fallbackState;

      // 1. Try high-precision client reverse-geocoding
      if (!resolvedCity) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2600);
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            const detected = geoData.city || geoData.locality || geoData.principalSubdivision;
            if (detected) {
              resolvedCity = detected;
              resolvedState = geoData.principalSubdivision || geoData.countryName;
            }
          }
        } catch {
          // Fallback to nearest city lookup
        }
      }

      // 2. Exact astronomical solar match against nearest center if not resolved
      const nearest = findNearestCity(lat, lng);
      const finalCity = resolvedCity || nearest.name;
      const finalState = resolvedState || nearest.state;

      const newGpsData = { lat, lng, detectedCity: finalCity, detectedState: finalState };
      setGpsCoords(newGpsData);

      const customTiming = getGPSCustomTiming(lat, lng, selectedDate, finalCity, finalState);
      const keyName = finalCity + ' (GPS Synced)';
      setSelectedCityKey(keyName);
      setIsDetectingLoc(false);

      try {
        localStorage.setItem('jcg_panchang_city', keyName);
        localStorage.setItem('jcg_panchang_gps', JSON.stringify(newGpsData));
      } catch {
        // storage ignored
      }

      showToast(
        'GPS Location Synced!',
        `Synced to ${finalCity}, ${finalState} (${lat.toFixed(2)}°, ${lng.toFixed(2)}°). Sunrise: ${customTiming.sunrise}, Sunset: ${customTiming.sunset}.`,
        'success'
      );
    };

    const tryIpFallback = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
            await applyGpsPosition(data.latitude, data.longitude, data.city, data.region);
            return true;
          }
        }
      } catch {
        // IP geolocation fallback error ignored
      }
      return false;
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsPermissionDenied(false);
          applyGpsPosition(pos.coords.latitude, pos.coords.longitude);
        },
        async (err) => {
          console.warn('Browser geolocation denied/timed out, trying network IP fallback...', err);
          if (err.code === err.PERMISSION_DENIED) {
            setIsPermissionDenied(true);
          }
          const fallbackSuccess = await tryIpFallback();
          if (!fallbackSuccess) {
            setIsDetectingLoc(false);
            let reason = 'Defaulted to Madurai Pachkan timings.';
            if (err.code === err.PERMISSION_DENIED) {
              reason = 'Browser location permission was denied. Tap "Why Location?" to learn more or unblock.';
            } else if (err.code === err.TIMEOUT) {
              reason = 'Location detection timed out. Defaulted to Madurai.';
            }
            showToast('GPS Location Notice', reason, 'info');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0 // force prompt check
        }
      );
    } else {
      const fallbackSuccess = await tryIpFallback();
      if (!fallbackSuccess) {
        setIsDetectingLoc(false);
        showToast('Location Notice', 'Geolocation is not supported by your browser.', 'error');
      }
    }
  };

  const handleModalLocationSuccess = (lat: number, lng: number, cityName: string, stateName: string) => {
    setIsPermissionDenied(false);
    const newGpsData = { lat, lng, detectedCity: cityName, detectedState: stateName };
    setGpsCoords(newGpsData);

    const customTiming = getGPSCustomTiming(lat, lng, selectedDate, cityName, stateName);
    const keyName = cityName + ' (GPS Synced)';
    setSelectedCityKey(keyName);

    try {
      localStorage.setItem('jcg_panchang_city', keyName);
      localStorage.setItem('jcg_panchang_gps', JSON.stringify(newGpsData));
    } catch {
      // storage ignored
    }

    showToast(
      'Location Updated!',
      `Timings calculated for ${cityName}, ${stateName}. Sunrise: ${customTiming.sunrise}, Sunset: ${customTiming.sunset}.`,
      'success'
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Widget Header & Location Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
              <span>Jain Panchang & Daily Pachkan Timings</span>
              <span className="text-[10px] bg-amber-500 text-amber-950 px-2 py-0.5 rounded font-bold uppercase">
                {activeTiming.city}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{activePanchang.date}</p>
          </div>
        </div>

        {/* Location Picker & Audio Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* City Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-1 text-xs">
            <MapPin className="w-3.5 h-3.5 text-amber-500 ml-1" />
            <select
              value={selectedCityKey}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCityKey(val);
                try {
                  localStorage.setItem('jcg_panchang_city', val);
                } catch {
                  // ignored
                }
              }}
              className="bg-transparent font-bold text-slate-800 dark:text-slate-200 focus:outline-none text-xs cursor-pointer max-w-[180px] sm:max-w-xs truncate"
            >
              {Object.keys(cityTimingsMap).map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {c.includes('(GPS Synced)') ? `📍 ${c}` : c} ({cityTimingsMap[c].state})
                </option>
              ))}
            </select>
          </div>

          {/* GPS Auto Detect & Help */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleDetectLocation}
              disabled={isDetectingLoc}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              title="Use current GPS Location"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetectingLoc ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">GPS Sync</span>
            </button>

            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="p-2 bg-amber-100 hover:bg-amber-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              title="Why is location needed? / Unblock guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Audio Player Button */}
          <button
            onClick={toggleNavkarMantra}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm cursor-pointer ${
              isPlayingAudio
                ? 'bg-amber-500 text-amber-950 border-amber-400 animate-pulse'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60 hover:bg-amber-100'
            }`}
          >
            {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPlayingAudio ? 'Navkar Audio' : 'Play Navkar'}</span>
          </button>

          {/* Daily Tithi Alert Notification Button */}
          <button
            onClick={openDailyTithiAlert}
            className="px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-amber-400/50 bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200 shadow-sm cursor-pointer active:scale-95"
            title="Open Daily Jain Tithi & Significant Upcoming Festivals Alert"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-bounce" />
            <span className="hidden sm:inline">Daily Tithi Alert</span>
          </button>

          {/* Sync Tithi to Google Calendar Button */}
          <button
            onClick={handleSyncTithi}
            disabled={isSyncingToday}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm cursor-pointer ${
              isTodaySynced
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                : 'bg-amber-600 hover:bg-amber-700 text-white border-amber-500'
            }`}
            title="Sync Jain Tithi & Pachkan Timings to your Google Calendar"
          >
            <CalendarPlus className={`w-3.5 h-3.5 ${isSyncingToday ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isTodaySynced ? 'Tithi Saved' : 'Sync Tithi'}</span>
          </button>
        </div>
      </div>

      {/* Friendly Location Access Notification Banner */}
      {(!isBannerDismissed || isPermissionDenied) && (
        <div
          className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs ${
            isPermissionDenied
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200'
              : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                isPermissionDenied
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
              }`}
            >
              {isPermissionDenied ? <AlertCircle className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <strong className="font-bold text-slate-900 dark:text-white text-xs">
                  {isPermissionDenied
                    ? 'Location Access Blocked in Browser'
                    : 'Why Location Access is Used in Panchang'}
                </strong>
                {gpsCoords && (
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.2 rounded-full">
                    GPS Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                {isPermissionDenied
                  ? 'In Jain tradition, daily Pachkan (Navkarshi, Chauvihar) strictly depends on local Surya Uday and Ast. If you blocked access, click below to trigger the browser prompt or follow the unblock steps.'
                  : 'Pachkan fast timings (Navkarshi, Chauvihar, etc.) are computed mathematically from exact astronomical Sunrise and Sunset at your location. Your coordinates stay private on your device.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 justify-end">
            <button
              onClick={handleDetectLocation}
              disabled={isDetectingLoc}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isDetectingLoc ? 'animate-spin' : ''}`} />
              <span>{isDetectingLoc ? 'Prompting...' : isPermissionDenied ? 'Retry Location Prompt' : 'Sync My Location'}</span>
            </button>

            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {isPermissionDenied ? 'Unblock Guide' : 'Learn More'}
            </button>

            {!isPermissionDenied && (
              <button
                onClick={() => {
                  setIsBannerDismissed(true);
                  try {
                    localStorage.setItem('jcg_dismiss_loc_banner', 'true');
                  } catch {
                    // ignored
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Dismiss banner"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Date Picker & Quick Date Navigation Controls Bar */}
      <div className="bg-amber-50/80 dark:bg-amber-950/30 border-2 border-amber-300/80 dark:border-amber-800/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Day Navigation Controls & Date Selector */}
          <div className="flex items-center bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700/80 rounded-xl p-1 shadow-xs">
            <button
              type="button"
              onClick={handlePrevDay}
              className="p-1.5 hover:bg-amber-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Previous Day Panchang"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-2.5">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <input
                type="date"
                value={selectedDateStr}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(parseInputDateStr(e.target.value));
                  }
                }}
                className="bg-transparent font-black text-slate-900 dark:text-white text-xs focus:outline-none cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={handleNextDay}
              className="p-1.5 hover:bg-amber-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Next Day Panchang"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Jump to Today */}
          {!isToday && (
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
              title="Return to Today's Panchang"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Jump to Today</span>
            </button>
          )}
        </div>

        {/* Quick Date Presets */}
        <div className="flex items-center gap-1.5 text-xs font-bold w-full sm:w-auto justify-end">
          <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 mr-1 hidden lg:inline">Presets:</span>
          <button
            type="button"
            onClick={() => {
              const d = new Date();
              d.setDate(d.getDate() - 1);
              setSelectedDate(d);
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
              selectedDateStr === toInputDateStr(new Date(Date.now() - 86400000))
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-amber-100 dark:hover:bg-slate-700'
            }`}
          >
            Yesterday
          </button>

          <button
            type="button"
            onClick={handleToday}
            className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
              isToday
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-amber-100 dark:hover:bg-slate-700'
            }`}
          >
            Today
          </button>

          <button
            type="button"
            onClick={() => {
              const d = new Date();
              d.setDate(d.getDate() + 1);
              setSelectedDate(d);
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
              selectedDateStr === toInputDateStr(new Date(Date.now() + 86400000))
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-amber-100 dark:hover:bg-slate-700'
            }`}
          >
            Tomorrow
          </button>
        </div>
      </div>

      {/* Notice Banner for Non-Today Dates */}
      {!isToday && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 bg-amber-100/90 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {isFuture ? '📅 Future Date Panchang Lookup: ' : '📜 Past Date Panchang Lookup: '}
              <strong className="underline decoration-amber-400 font-extrabold">{activePanchang.date}</strong> ({activePanchang.tithi})
            </span>
          </div>
          <button
            type="button"
            onClick={handleToday}
            className="underline hover:text-amber-600 font-black cursor-pointer text-[11px] shrink-0"
          >
            Reset to Today
          </button>
        </div>
      )}

      {/* Main Tithi & Solar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-slate-900 border border-amber-200 dark:border-amber-900/40">
          <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            {isToday ? "Today's Tithi" : 'Selected Date Tithi'}
          </p>
          <p className="text-xs font-black text-slate-900 dark:text-amber-100 mt-1 font-serif">{activePanchang.tithi}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-slate-900 border border-amber-200 dark:border-amber-900/40">
          <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Masa / Month</p>
          <p className="text-xs font-black text-slate-900 dark:text-amber-100 mt-1 font-serif">{activePanchang.month}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-center gap-3">
          <Sun className="w-5 h-5 text-amber-500 shrink-0 animate-spin-slow" />
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Sunrise ({activeTiming.city})</p>
            <p className="text-xs font-black text-slate-900 dark:text-white">{activeTiming.sunrise}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 flex items-center gap-3">
          <Moon className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Sunset ({activeTiming.city})</p>
            <p className="text-xs font-black text-slate-900 dark:text-white">{activeTiming.sunset}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-3 col-span-1 sm:col-span-2 lg:col-span-1">
          <Clock className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase">Navkarshi / Chouvihar</p>
            <p className="text-[11px] font-bold text-slate-900 dark:text-white">N: {activeTiming.navkarshi.split(' ')[0]} | C: {activeTiming.chouvihar.split(' ')[0]}</p>
          </div>
        </div>
      </div>

      {/* Daily Pachkan Timings Grid */}
      <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" />
            Pachkan Timings ({activeTiming.city}, {activeTiming.state})
          </h3>
          <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-bold px-2 py-0.5 rounded-full">
            {isToday ? 'Live Date' : activePanchang.date}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Navkarshi</p>
            <p className="text-xs font-black text-amber-700 dark:text-amber-400 mt-0.5">{activeTiming.navkarshi}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Porshi (1 Prahar)</p>
            <p className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5">{activeTiming.porshi}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Sadh-Porshi</p>
            <p className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5">{activeTiming.sadhPorshi}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Purimatta (2 Prahar)</p>
            <p className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5">{activeTiming.purimatta}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Avaddh (3 Prahar)</p>
            <p className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5">{activeTiming.avaddh}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-900/50">
            <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">Chouvihar</p>
            <p className="text-xs font-black text-indigo-700 dark:text-indigo-300 mt-0.5">{activeTiming.chouvihar}</p>
          </div>
        </div>
      </div>

      {/* Choghadiya Timings */}
      <div>
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          Day Choghadiya Schedule ({activeTiming.city} • {activePanchang.date})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {activePanchang.choghadiyaDay.map((c, idx) => {
            const isGood = c.type === 'Auspicious';
            return (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border text-xs ${
                  isGood
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{c.name}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      isGood ? 'bg-emerald-200 text-emerald-950' : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {c.type}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">{c.time}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Quote Box */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-amber-700/10 border border-amber-400/40 rounded-2xl p-5 relative shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
                DAILY JAIN AGAM QUOTE
              </p>
              <span className="text-[10px] px-2 py-0.5 bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold rounded-full">
                Quote #{currentQuoteIndex + 1} of {JAIN_AGAM_QUOTES.length}
              </span>
            </div>

            <p className="text-sm sm:text-base font-serif italic text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
              {activeQuote.text}
            </p>

            {activeQuote.translation && (
              <p className="text-xs text-slate-600 dark:text-slate-300 font-sans italic bg-amber-100/50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200/50">
                <strong className="text-amber-900 dark:text-amber-300 font-bold font-serif">Meaning:</strong> {activeQuote.translation}
              </p>
            )}

            <p className="text-xs text-amber-800 dark:text-amber-400 font-bold font-serif pt-1">
              — {activeQuote.source}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleChangeQuote}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              title="Click to change and read next Agam quote"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change Quote</span>
            </button>

            <button
              onClick={handleCopyQuote}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-950 transition-colors shadow-sm cursor-pointer"
              title="Copy Quote"
            >
              {copiedQuote ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Featured Business Advertisements & Promotions */}
      <FeaturedAdsSection />

      {/* Interactive Jain Events Calendar with Event Filters & Tithi Fasting Guidance */}
      <div className="pt-4 border-t border-amber-200/50 dark:border-slate-800">
        <JainEventsCalendar />
      </div>

      {/* Location Permission & Unblock Guidance Modal */}
      <LocationPermissionModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSuccess={handleModalLocationSuccess}
        currentCityName={activeTiming.city}
        isGpsSynced={Boolean(gpsCoords || selectedCityKey.includes('(GPS Synced)'))}
      />
    </div>
  );
};

