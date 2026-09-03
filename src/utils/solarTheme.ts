import { BASE_CITIES, calculateSolarSunriseSunset, BaseCityInfo } from './jainPanchang';

export type ThemePreference = 'auto' | 'light' | 'dark';
export type EffectiveTheme = 'light' | 'dark';
export type SolarPhase = 'day' | 'night';

export interface SolarThemeInfo {
  preference: ThemePreference;
  effectiveTheme: EffectiveTheme;
  phase: SolarPhase;
  isSolarDay: boolean;
  sunrise: string;
  sunset: string;
  sunriseMinutes: number;
  sunsetMinutes: number;
  currentMinutes: number;
  currentTimeFormatted: string;
  timeUntilNextTransition: string;
  nextTransitionTime: string;
  nextTransitionLabel: string;
  spiritualTitle: string;
  spiritualDescription: string;
  spiritualTip: string;
  locationName: string;
}

export const THEME_STORAGE_KEY = 'jcg_theme_pref_v2';

/**
 * Parses time string like "06:04 AM", "7:20 PM", "06:04", "19:20" to total minutes from midnight (0 - 1439).
 */
export function parseTimeToMinutes(timeStr?: string): number {
  if (!timeStr) return 364; // Default 6:04 AM
  const cleaned = timeStr.trim().toUpperCase();
  const isPM = cleaned.includes('PM');
  const isAM = cleaned.includes('AM');

  // Extract digits and colon
  const match = cleaned.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 364;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Formats total minutes from midnight into 12-hour AM/PM string (e.g. 364 -> "06:04 AM").
 */
export function formatMinutesToTimeString(minutes: number): string {
  const norm = ((minutes % 1440) + 1440) % 1440;
  const hours = Math.floor(norm / 60);
  const mins = norm % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const hh = displayHours.toString().padStart(2, '0');
  const mm = mins.toString().padStart(2, '0');
  return `${hh}:${mm} ${ampm}`;
}

/**
 * Formats countdown time remaining in human-readable form (e.g. "2h 15m").
 */
export function formatTimeRemaining(diffMinutes: number): string {
  const total = Math.max(0, Math.round(diffMinutes));
  const hrs = Math.floor(total / 60);
  const mins = total % 60;
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins}m`;
}

/**
 * Retrieve user's local solar times based on Panchang settings, saved GPS, or fallback city.
 */
export function getLocalSolarTimes(
  panchangSunrise?: string,
  panchangSunset?: string,
  now: Date = new Date()
): {
  sunrise: string;
  sunset: string;
  sunriseMinutes: number;
  sunsetMinutes: number;
  locationName: string;
} {
  // Check if user has GPS coordinates saved from PanchangWidget
  try {
    const savedGpsStr = localStorage.getItem('jcg_panchang_gps');
    if (savedGpsStr) {
      const gps = JSON.parse(savedGpsStr);
      if (gps && typeof gps.lat === 'number' && typeof gps.lng === 'number') {
        const { sunriseMin, sunsetMin } = calculateSolarSunriseSunset(gps.lat, gps.lng, now);
        return {
          sunrise: formatMinutesToTimeString(sunriseMin),
          sunset: formatMinutesToTimeString(sunsetMin),
          sunriseMinutes: sunriseMin,
          sunsetMinutes: sunsetMin,
          locationName: gps.cityName || 'Local GPS',
        };
      }
    }

    const savedCity = localStorage.getItem('jcg_panchang_city');
    if (savedCity) {
      const city = BASE_CITIES.find(
        (c: BaseCityInfo) => c.name.toLowerCase() === savedCity.toLowerCase()
      );
      if (city) {
        const { sunriseMin, sunsetMin } = calculateSolarSunriseSunset(city.lat, city.lng, now);
        return {
          sunrise: formatMinutesToTimeString(sunriseMin),
          sunset: formatMinutesToTimeString(sunsetMin),
          sunriseMinutes: sunriseMin,
          sunsetMinutes: sunsetMin,
          locationName: city.name,
        };
      }
    }
  } catch {
    // Fall back gracefully
  }

  // Use panchang times if available
  if (panchangSunrise && panchangSunset) {
    const sunriseMin = parseTimeToMinutes(panchangSunrise);
    const sunsetMin = parseTimeToMinutes(panchangSunset);
    return {
      sunrise: panchangSunrise,
      sunset: panchangSunset,
      sunriseMinutes: sunriseMin,
      sunsetMinutes: sunsetMin,
      locationName: 'Local Sangha',
    };
  }

  // Default fallback: Standard Jain solar anchor (Bikaner 6:04 AM / 7:20 PM)
  return {
    sunrise: '06:04 AM',
    sunset: '07:20 PM',
    sunriseMinutes: 364,
    sunsetMinutes: 1160,
    locationName: 'Local Sangha',
  };
}

/**
 * Computes full solar theme state including spiritual descriptions and transition timers.
 */
export function getEffectiveSolarTheme(
  preference: ThemePreference,
  panchangSunrise?: string,
  panchangSunset?: string,
  now: Date = new Date()
): SolarThemeInfo {
  const {
    sunrise,
    sunset,
    sunriseMinutes,
    sunsetMinutes,
    locationName,
  } = getLocalSolarTimes(panchangSunrise, panchangSunset, now);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isSolarDay = currentMinutes >= sunriseMinutes && currentMinutes < sunsetMinutes;
  const phase: SolarPhase = isSolarDay ? 'day' : 'night';

  let effectiveTheme: EffectiveTheme = 'light';
  if (preference === 'auto') {
    effectiveTheme = isSolarDay ? 'light' : 'dark';
  } else {
    effectiveTheme = preference;
  }

  // Next transition calculation
  let diffMinutes = 0;
  let nextTransitionTime = '';
  let nextTransitionLabel = '';

  if (isSolarDay) {
    // Next is sunset today
    diffMinutes = sunsetMinutes - currentMinutes;
    nextTransitionTime = `Sunset at ${sunset}`;
    nextTransitionLabel = `Sunset in ${formatTimeRemaining(diffMinutes)}`;
  } else {
    // Next is sunrise (either later tonight/tomorrow morning)
    if (currentMinutes >= sunsetMinutes) {
      // Past sunset: minutes until midnight + minutes from midnight to sunrise
      diffMinutes = (1440 - currentMinutes) + sunriseMinutes;
    } else {
      // Before sunrise in the early morning
      diffMinutes = sunriseMinutes - currentMinutes;
    }
    nextTransitionTime = `Sunrise at ${sunrise}`;
    nextTransitionLabel = `Sunrise in ${formatTimeRemaining(diffMinutes)}`;
  }

  // Spiritual and religious guidance for viewing
  let spiritualTitle = '';
  let spiritualDescription = '';
  let spiritualTip = '';

  if (effectiveTheme === 'light') {
    spiritualTitle = isSolarDay
      ? 'Daylight Swadhyay Mode (Surya Udaya)'
      : 'Light Mode (Manual Override)';
    spiritualDescription =
      'High-contrast luminous view crafted for daytime temple darshan, pachkan vow check, and scriptures study.';
    spiritualTip = isSolarDay
      ? `Divasa (Daytime): Ideal for Chauvihar meals, Ayambil, and temple worship before sunset (${sunset}).`
      : 'Daytime aesthetics with sacred amber parchment styling.';
  } else {
    spiritualTitle = !isSolarDay
      ? 'Nocturnal Pratikraman Mode (Surya Astha)'
      : 'Dark Mode (Manual Override)';
    spiritualDescription =
      'Soothing celestial dark palette with gentle golden embers to ease eye strain for evening prayers and jaap.';
    spiritualTip = !isSolarDay
      ? `Ratri (Nighttime): Pratikraman, Navkar Mantra chanting & introspection period. Strictly no food intake post-sunset.`
      : 'Deep charcoal background with warm sacred gold accents.';
  }

  const hours = now.getHours();
  const mins = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const currentTimeFormatted = `${displayHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;

  return {
    preference,
    effectiveTheme,
    phase,
    isSolarDay,
    sunrise,
    sunset,
    sunriseMinutes,
    sunsetMinutes,
    currentMinutes,
    currentTimeFormatted,
    timeUntilNextTransition: formatTimeRemaining(diffMinutes),
    nextTransitionTime,
    nextTransitionLabel,
    spiritualTitle,
    spiritualDescription,
    spiritualTip,
    locationName,
  };
}

/**
 * Loads the user's saved theme preference from local storage.
 * Defaults to 'auto' for the spiritual solar-based viewing experience.
 */
export function loadSavedThemePreference(): ThemePreference {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'auto' || saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch {
    // Ignore error
  }
  return 'auto';
}

/**
 * Saves the theme preference to local storage.
 */
export function persistThemePreference(pref: ThemePreference): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    // Ignore error
  }
}
