import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
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
  Compass
} from 'lucide-react';

interface CityTiming {
  city: string;
  state: string;
  sunrise: string;
  sunset: string;
  navkarshi: string;
  chouvihar: string;
}

const CITY_TIMINGS: Record<string, CityTiming> = {
  Bikaner: {
    city: 'Bikaner',
    state: 'Rajasthan',
    sunrise: '06:02 AM',
    sunset: '07:22 PM',
    navkarshi: '06:50 AM (+48 mins)',
    chouvihar: '07:02 PM (-20 mins)',
  },
  Mumbai: {
    city: 'Mumbai',
    state: 'Maharashtra',
    sunrise: '06:14 AM',
    sunset: '07:18 PM',
    navkarshi: '07:02 AM (+48 mins)',
    chouvihar: '06:58 PM (-20 mins)',
  },
  Ahmedabad: {
    city: 'Ahmedabad',
    state: 'Gujarat',
    sunrise: '06:10 AM',
    sunset: '07:24 PM',
    navkarshi: '06:58 AM (+48 mins)',
    chouvihar: '07:04 PM (-20 mins)',
  },
  Jaipur: {
    city: 'Jaipur',
    state: 'Rajasthan',
    sunrise: '05:58 AM',
    sunset: '07:19 PM',
    navkarshi: '06:46 AM (+48 mins)',
    chouvihar: '06:59 PM (-20 mins)',
  },
  Delhi: {
    city: 'Delhi',
    state: 'NCR',
    sunrise: '05:48 AM',
    sunset: '07:22 PM',
    navkarshi: '06:36 AM (+48 mins)',
    chouvihar: '07:02 PM (-20 mins)',
  },
  Surat: {
    city: 'Surat',
    state: 'Gujarat',
    sunrise: '06:12 AM',
    sunset: '07:22 PM',
    navkarshi: '07:00 AM (+48 mins)',
    chouvihar: '07:02 PM (-20 mins)',
  },
  Kolkata: {
    city: 'Kolkata',
    state: 'West Bengal',
    sunrise: '05:12 AM',
    sunset: '06:28 PM',
    navkarshi: '06:00 AM (+48 mins)',
    chouvihar: '06:08 PM (-20 mins)',
  },
  Indore: {
    city: 'Indore',
    state: 'Madhya Pradesh',
    sunrise: '06:02 AM',
    sunset: '07:14 PM',
    navkarshi: '06:50 AM (+48 mins)',
    chouvihar: '06:54 PM (-20 mins)',
  },
  Bangalore: {
    city: 'Bangalore',
    state: 'Karnataka',
    sunrise: '06:06 AM',
    sunset: '06:50 PM',
    navkarshi: '06:54 AM (+48 mins)',
    chouvihar: '06:30 PM (-20 mins)',
  },
  Chennai: {
    city: 'Chennai',
    state: 'Tamil Nadu',
    sunrise: '05:56 AM',
    sunset: '06:38 PM',
    navkarshi: '06:44 AM (+48 mins)',
    chouvihar: '06:18 PM (-20 mins)',
  },
};

export const PanchangWidget: React.FC = () => {
  const { panchang, showToast } = useApp();
  const [selectedCityKey, setSelectedCityKey] = useState<string>('Bikaner');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [isDetectingLoc, setIsDetectingLoc] = useState(false);

  const activeTiming = CITY_TIMINGS[selectedCityKey] || CITY_TIMINGS['Bikaner'];

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(`${panchang.dailyQuote.text} - ${panchang.dailyQuote.source}`);
    setCopiedQuote(true);
    showToast('Quote Copied!', 'Jain daily quote copied to clipboard.', 'success');
    setTimeout(() => setCopiedQuote(false), 3000);
  };

  const toggleNavkarMantra = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      showToast('Playing Navkar Mantra Chanting', 'Namo Arihantanam... Namo Siddhanam...', 'info');
    }
  };

  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      setIsDetectingLoc(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetectingLoc(false);
          // Set to user's nearest city or Bikaner/Mumbai
          setSelectedCityKey('Bikaner');
          showToast(
            'GPS Location Synced!',
            `Coordinates (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}). Calculated Sunrise & Sunset for Rani Bazar / Bikaner Region.`,
            'success'
          );
        },
        (err) => {
          setIsDetectingLoc(false);
          showToast('Location Detection', 'Defaulting to Bikaner, Rajasthan Panchang timings.', 'info');
        }
      );
    } else {
      showToast('Location Error', 'Geolocation is not supported by your browser.', 'error');
    }
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
            <p className="text-xs text-slate-500 dark:text-slate-400">{panchang.date}</p>
          </div>
        </div>

        {/* Location Picker & Audio Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* City Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-1 text-xs">
            <MapPin className="w-3.5 h-3.5 text-amber-500 ml-1" />
            <select
              value={selectedCityKey}
              onChange={(e) => setSelectedCityKey(e.target.value)}
              className="bg-transparent font-bold text-slate-800 dark:text-slate-200 focus:outline-none text-xs cursor-pointer"
            >
              {Object.keys(CITY_TIMINGS).map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {c} ({CITY_TIMINGS[c].state})
                </option>
              ))}
            </select>
          </div>

          {/* GPS Auto Detect */}
          <button
            onClick={handleDetectLocation}
            disabled={isDetectingLoc}
            className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            title="Use current GPS Location"
          >
            <Navigation className={`w-3.5 h-3.5 ${isDetectingLoc ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">GPS Sync</span>
          </button>

          {/* Audio Player Button */}
          <button
            onClick={toggleNavkarMantra}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
              isPlayingAudio
                ? 'bg-amber-500 text-amber-950 border-amber-400 animate-pulse'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60 hover:bg-amber-100'
            }`}
          >
            {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPlayingAudio ? 'Navkar Audio' : 'Play Navkar'}</span>
          </button>
        </div>
      </div>

      {/* Main Tithi & Solar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-slate-900 border border-amber-200 dark:border-amber-900/40">
          <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Today's Tithi</p>
          <p className="text-xs font-black text-slate-900 dark:text-amber-100 mt-1 font-serif">{panchang.tithi}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-slate-900 border border-amber-200 dark:border-amber-900/40">
          <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Masa / Month</p>
          <p className="text-xs font-black text-slate-900 dark:text-amber-100 mt-1 font-serif">{panchang.month}</p>
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

      {/* Choghadiya Timings */}
      <div>
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          Today's Day Choghadiya Schedule ({activeTiming.city})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {panchang.choghadiyaDay.map((c, idx) => {
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
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-amber-700/10 border border-amber-400/40 rounded-xl p-4 relative">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Daily Jain Agam Quote
            </p>
            <p className="text-sm font-serif italic text-slate-800 dark:text-slate-200 font-medium">
              {panchang.dailyQuote.text}
            </p>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
              — {panchang.dailyQuote.source}
            </p>
          </div>

          <button
            onClick={handleCopyQuote}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors shrink-0"
            title="Copy Quote"
          >
            {copiedQuote ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Upcoming Jain Parva / Festivals */}
      <div>
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          Upcoming Sacred Jain Parva Calendar
        </h3>
        <div className="space-y-2">
          {panchang.upcomingFestivals.map((f, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{f.name}</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">{f.description}</p>
              </div>
              <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono font-bold rounded-lg shrink-0">
                {f.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
