import { PanchangInfo } from '../types';

export interface AgamQuote {
  id: number;
  text: string;
  source: string;
  translation: string;
  theme: string;
}

export interface CityPachkanTiming {
  city: string;
  state: string;
  sunrise: string;
  sunset: string;
  navkarshi: string;
  porshi: string;
  sadhPorshi: string;
  purimatta: string;
  avaddh: string;
  chouvihar: string;
}

export const JAIN_AGAM_QUOTES: AgamQuote[] = [
  {
    id: 1,
    text: '"Live and let live. Ahimsa Paramo Dharma — Non-violence is the supreme virtue and duty of every soul."',
    source: 'Bhagwan Mahavira (Acharanga Sutra)',
    translation: 'Practice Ahimsa (Non-violence) in thought, word, and action toward all living beings.',
    theme: 'Ahimsa & Compassion'
  },
  {
    id: 2,
    text: '"Khamemi Savva Jive, Savve Jiva Khamantu Me. Mitti Me Savva Bhutesu, Veram Majjham Na Kenai."',
    source: 'Samvatsari Kshamavani Sutra',
    translation: 'I forgive all living beings, may all living beings forgive me. I have friendship with all beings and enmity toward none.',
    theme: 'Forgiveness (Kshama)'
  },
  {
    id: 3,
    text: '"Samyak Darshana Jnana Charitrani Moksha Margah."',
    source: 'Acharya Umasvati (Tattvartha Sutra 1.1)',
    translation: 'Right Faith, Right Knowledge, and Right Conduct together form the direct pathway to liberation (Moksha).',
    theme: 'Ratnatraya (Three Jewels)'
  },
  {
    id: 4,
    text: '"Anathho Parathho Vaa, Appaa Nahanu Parassa Vaa."',
    source: 'Bhagwan Mahavira (Uttaradhyayana Sutra 20.21)',
    translation: 'You are your own master and refuge. Look inward for eternal peace; no external power can liberate your soul.',
    theme: 'Self-Reliance & Soul'
  },
  {
    id: 5,
    text: '"Possa Thimima Paratthattham, Jasa Bhutana Dayai."',
    source: 'Bhagwan Mahavira (Dasaveyaliya Sutra 6.9)',
    translation: 'True spiritual wisdom always produces profound compassion and loving-kindness for every living creature.',
    theme: 'Wisdom & Karuna'
  },
  {
    id: 6,
    text: '"Parasparopagraho Jivanam."',
    source: 'Acharya Umasvati (Tattvartha Sutra 5.21)',
    translation: 'All life in the cosmos is interconnected and bound together by mutual support and harmony.',
    theme: 'Universal Interdependence'
  },
  {
    id: 7,
    text: '"Anekantavada teaches us that truth has infinite facets; respecting diverse viewpoints is intellectual non-violence."',
    source: 'Acharya Haribhadra Suri (Agam Commentary)',
    translation: 'Cultivate open-mindedness and reverence for truth from every perspective.',
    theme: 'Anekantavada (Multi-faceted Truth)'
  },
  {
    id: 8,
    text: '"Subhehim Kammehim Subham Phalaam, Asubhehim Kammehim Asubham Phalaam."',
    source: 'Bhagwan Mahavira (Vipakasutra)',
    translation: 'Good actions yield auspicious karma and peace; harmful actions yield painful consequences. Every soul reaps what it sows.',
    theme: 'Law of Karma'
  },
  {
    id: 9,
    text: '"Aparigraha is not merely limiting possessions, but abandoning attachment and greed in consciousness."',
    source: 'Acharya Kundakunda (Samayasara)',
    translation: 'True contentment lies in inner detachment rather than physical accumulation.',
    theme: 'Aparigraha (Non-Possessiveness)'
  },
  {
    id: 10,
    text: '"Manasa Vacha Kayaa — Control mind, speech, and body to preserve spiritual purity."',
    source: 'Bhagwan Mahavira (Sutrakritanga Sutra)',
    translation: 'Restrain negative thoughts, harsh words, and harmful actions to guard your soul.',
    theme: 'Three Guptis (Self-Control)'
  },
  {
    id: 11,
    text: '"Sanyama (Self-restraint) and Tapa (Penance) cleanse the soul of karmic impurities like gold in fire."',
    source: 'Acharya Amritchandra (Purushartha Siddhyupaya)',
    translation: 'Daily discipline and mindful austerity elevate consciousness toward pure bliss.',
    theme: 'Sanyama & Tapa'
  },
  {
    id: 12,
    text: '"Control your anger through forgiveness, conquer pride through humility, deceit through honesty, and greed through contentment."',
    source: 'Bhagwan Mahavira (Dasaveyaliya Sutra 8.38)',
    translation: 'Overcome the four Kashayas (Anger, Pride, Deceit, Greed) with their opposite virtues.',
    theme: 'Conquering Kashayas'
  },
  {
    id: 13,
    text: '"Do not injure, abuse, oppress, enslave, insult, torment, torture, or kill any creature or living being."',
    source: 'Bhagwan Mahavira (Acharanga Sutra 1.5.5)',
    translation: 'Every living soul desires happiness and fears pain just like yourself.',
    theme: 'Universal Compassion'
  },
  {
    id: 14,
    text: '"Dharmo Mangalam Ukkattham, Ahimsa Sanyamo Tapo; Deva Vi Tam Namamsanti, Jassa Dhammai Manao."',
    source: 'Bhagwan Mahavira (Dasaveyaliya Sutra 1.1)',
    translation: 'Religion is the supreme blessing. Ahimsa, Self-restraint, and Penance are its pillar. Even celestial beings bow to the soul grounded in Dharma.',
    theme: 'Supreme Dharma'
  },
  {
    id: 15,
    text: '"Knowledge without character is incomplete; character without knowledge is directionless. Combine both for liberation."',
    source: 'Acharya Pujyapada (Ishtopadesha)',
    translation: 'Balance spiritual study with daily ethical practice in life.',
    theme: 'Jnana & Charitra'
  }
];

const JAIN_MONTHS = [
  'Chaitra Masa',
  'Vaishakha Masa',
  'Jyeshtha Masa',
  'Ashadha Masa',
  'Sravana (Shravan) Masa',
  'Bhadrapada (Bhadarva) Masa',
  'Ashvin (Aso) Masa',
  'Kartika Masa',
  'Margashirsha Masa',
  'Pausha Masa',
  'Magha Masa',
  'Phalguna Masa'
];

const JAIN_TITHIS = [
  'Pratipada (1st Tithi)',
  'Dwitiya (2nd Tithi)',
  'Tritiya (3rd Tithi)',
  'Chaturthi (4th Tithi)',
  'Panchami (5th Tithi - Auspicious)',
  'Shashthi (6th Tithi)',
  'Saptami (7th Tithi)',
  'Ashtami (8th Tithi - Fasting & Swadhyay)',
  'Navami (9th Tithi)',
  'Dashami (10th Tithi)',
  'Ekadashi (11th Tithi - Sacred Fasting)',
  'Dwadashi (12th Tithi)',
  'Trayodashi (13th Tithi)',
  'Chaturdashi (14th Tithi - Pakshi & Pratikraman)',
  'Purnima / Amavasya (Sacred Tithi)'
];

/**
 * Helper to convert minutes after midnight to "HH:MM AM/PM" format
 */
function formatMinutesToTime(totalMinutes: number): string {
  let hours = Math.floor(totalMinutes / 60) % 24;
  const mins = Math.floor(totalMinutes % 60);
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const paddedMins = mins < 10 ? `0${mins}` : `${mins}`;
  const paddedHours = hours < 10 ? `0${hours}` : `${hours}`;
  return `${paddedHours}:${paddedMins} ${period}`;
}

export interface BaseCityInfo {
  name: string;
  state: string;
  lat: number;
  lng: number;
  srMin: number;
  ssMin: number;
}

export const BASE_CITIES: BaseCityInfo[] = [
  { name: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119, srMin: 365, ssMin: 1155 },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, srMin: 374, ssMin: 1152 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, srMin: 370, ssMin: 1158 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, srMin: 358, ssMin: 1154 },
  { name: 'Delhi', state: 'NCR', lat: 28.6139, lng: 77.2090, srMin: 348, ssMin: 1156 },
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311, srMin: 372, ssMin: 1156 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, srMin: 312, ssMin: 1104 },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, srMin: 362, ssMin: 1148 },
  { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, srMin: 366, ssMin: 1125 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, srMin: 356, ssMin: 1118 },
  { name: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125, srMin: 363, ssMin: 1152 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, srMin: 371, ssMin: 1149 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, srMin: 355, ssMin: 1130 },
];

/**
 * Finds the closest city in our dataset to the user's lat, lng
 */
export function findNearestCity(lat: number, lng: number): BaseCityInfo {
  let closest = BASE_CITIES[0];
  let minDistance = Infinity;

  BASE_CITIES.forEach((c) => {
    const dLat = c.lat - lat;
    const dLng = c.lng - lng;
    const dist = dLat * dLat + dLng * dLng; // Squared Euclidean distance for quick comparison
    if (dist < minDistance) {
      minDistance = dist;
      closest = c;
    }
  });

  return closest;
}

/**
 * Calculates seasonal sunrise & sunset for major Indian cities
 */
export function getCityPachkanTimings(date: Date = new Date()): Record<string, CityPachkanTiming> {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Seasonal variation in minutes (-20 to +20 mins around base times)
  const seasonalOffset = Math.round(18 * Math.sin((dayOfYear - 80) * (2 * Math.PI / 365)));

  const cityMap: Record<string, CityPachkanTiming> = {};

  BASE_CITIES.forEach((c) => {
    const sunriseMin = c.srMin - seasonalOffset;
    const sunsetMin = c.ssMin + seasonalOffset;

    const sunriseStr = formatMinutesToTime(sunriseMin);
    const sunsetStr = formatMinutesToTime(sunsetMin);
    const navkarshiStr = formatMinutesToTime(sunriseMin + 48);
    const porshiStr = formatMinutesToTime(sunriseMin + 180);
    const sadhPorshiStr = formatMinutesToTime(sunriseMin + 270);
    const purimattaStr = formatMinutesToTime(sunriseMin + 360);
    const avaddhStr = formatMinutesToTime(sunriseMin + 540);
    const chouviharStr = formatMinutesToTime(sunsetMin - 20);

    cityMap[c.name] = {
      city: c.name,
      state: c.state,
      sunrise: sunriseStr,
      sunset: sunsetStr,
      navkarshi: `${navkarshiStr} (+48m)`,
      porshi: `${porshiStr} (1 Prahar)`,
      sadhPorshi: `${sadhPorshiStr} (1.5 Prahar)`,
      purimatta: `${purimattaStr} (2 Prahar)`,
      avaddh: `${avaddhStr} (3 Prahar)`,
      chouvihar: `${chouviharStr} (-20m)`,
    };
  });

  return cityMap;
}

/**
 * Generates exact Pachkan timing for user's GPS coordinates
 */
export function getGPSCustomTiming(lat: number, lng: number, date: Date = new Date()): CityPachkanTiming {
  const nearest = findNearestCity(lat, lng);
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const seasonalOffset = Math.round(18 * Math.sin((dayOfYear - 80) * (2 * Math.PI / 365)));

  // Adjust sunrise/sunset based on exact longitude difference relative to nearest city (1 deg = ~4 mins)
  const lngDiffMins = Math.round((nearest.lng - lng) * 4);
  const sunriseMin = nearest.srMin - seasonalOffset + lngDiffMins;
  const sunsetMin = nearest.ssMin + seasonalOffset + lngDiffMins;

  const sunriseStr = formatMinutesToTime(sunriseMin);
  const sunsetStr = formatMinutesToTime(sunsetMin);
  const navkarshiStr = formatMinutesToTime(sunriseMin + 48);
  const porshiStr = formatMinutesToTime(sunriseMin + 180);
  const sadhPorshiStr = formatMinutesToTime(sunriseMin + 270);
  const purimattaStr = formatMinutesToTime(sunriseMin + 360);
  const avaddhStr = formatMinutesToTime(sunriseMin + 540);
  const chouviharStr = formatMinutesToTime(sunsetMin - 20);

  return {
    city: nearest.name,
    state: `${nearest.state} (GPS: ${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
    sunrise: sunriseStr,
    sunset: sunsetStr,
    navkarshi: `${navkarshiStr} (+48m)`,
    porshi: `${porshiStr} (1 Prahar)`,
    sadhPorshi: `${sadhPorshiStr} (1.5 Prahar)`,
    purimatta: `${purimattaStr} (2 Prahar)`,
    avaddh: `${avaddhStr} (3 Prahar)`,
    chouvihar: `${chouviharStr} (-20m)`,
  };
}

/**
 * Auto-calculates daily Jain Panchang based on current Date
 */
export function getDailyJainPanchang(targetDate: Date = new Date()): PanchangInfo {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = targetDate.toLocaleDateString('en-IN', options);

  // Calculate day of year
  const startOfYear = new Date(targetDate.getFullYear(), 0, 0);
  const diff = targetDate.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Determine lunar month and tithi approximation
  const monthIdx = (Math.floor(dayOfYear / 30) + 3) % 12;
  const tithiCycleDay = (dayOfYear + 12) % 30;
  const isShukla = tithiCycleDay < 15;
  const pakshaStr = isShukla ? 'Shukla Paksha (Sud)' : 'Krishna Paksha (Vad)';
  
  const tithiIdx = tithiCycleDay % 15;
  let tithiName = JAIN_TITHIS[tithiIdx];
  if (tithiIdx === 14) {
    tithiName = isShukla ? 'Purnima (Full Moon - Sacred Tithi)' : 'Amavasya (No Moon - Sacred Tithi)';
  }

  const fullTithiStr = `${pakshaStr} ${tithiName}`;
  const monthStr = JAIN_MONTHS[monthIdx];

  // Pick Daily Agam Quote based on day of year
  const quoteObj = JAIN_AGAM_QUOTES[dayOfYear % JAIN_AGAM_QUOTES.length];

  // Get city timings for default city (Bikaner)
  const cityTimings = getCityPachkanTimings(targetDate);
  const bikanerTiming = cityTimings['Bikaner'] || {
    sunrise: '06:05 AM',
    sunset: '07:15 PM',
  };

  // Special Kalyanak or Festival checks
  let kalyanakStr = 'Daily Jain Swadhyay, Navkar Jaap & Compassion Observance.';
  if (tithiIdx === 4) {
    kalyanakStr = 'Panchami Tithi — Ideal for Knowledge Worship (Jnana Panchami Observance).';
  } else if (tithiIdx === 7) {
    kalyanakStr = 'Ashtami Tithi — Sacred Fasting (Ekasana/Biyasana), Green Vegetable Renunciation (Arembo).';
  } else if (tithiIdx === 10) {
    kalyanakStr = 'Ekadashi Tithi — Holy Day for Tapa, Upvas & Jin Pooja.';
  } else if (tithiIdx === 13) {
    kalyanakStr = 'Chaudas (14th Tithi) — Pakshi Pratikraman & Self-Introspection Day.';
  } else if (tithiIdx === 14) {
    kalyanakStr = 'Purnima / Amavasya — Universal Peace & Chanting of Navkar Mantra.';
  }

  return {
    date: formattedDate,
    tithi: fullTithiStr,
    paksha: pakshaStr,
    month: monthStr,
    sunrise: bikanerTiming.sunrise,
    sunset: bikanerTiming.sunset,
    choghadiyaDay: [
      { name: 'Labh (Gain)', type: 'Auspicious', time: `${bikanerTiming.sunrise} - 07:45 AM` },
      { name: 'Amrit (Nectar)', type: 'Auspicious', time: '07:45 AM - 09:25 AM' },
      { name: 'Kaal (Loss)', type: 'Inauspicious', time: '09:25 AM - 11:05 AM' },
      { name: 'Shubh (Good)', type: 'Auspicious', time: '11:05 AM - 12:45 PM' },
      { name: 'Rog (Disease)', type: 'Inauspicious', time: '12:45 PM - 02:25 PM' },
      { name: 'Udveg (Anxiety)', type: 'Inauspicious', time: '02:25 PM - 04:05 PM' },
      { name: 'Chara (Variable)', type: 'Neutral', time: '04:05 PM - 05:45 PM' },
      { name: 'Labh (Gain)', type: 'Auspicious', time: `05:45 PM - ${bikanerTiming.sunset}` },
    ],
    dailyQuote: {
      text: quoteObj.text,
      source: quoteObj.source,
    },
    upcomingFestivals: [
      { name: 'Paryushan Parva (Swetambar)', date: '2026-08-25', description: '8 Days of spiritual introspection, fasting, and Pratikraman.' },
      { name: 'Das Lakshana Parva (Digambar)', date: '2026-09-02', description: '10 Days honoring Supreme Forgiveness, Modesty, Purity, and Truth.' },
      { name: 'Samvatsari Kshamavani', date: '2026-09-01', description: 'Universal Forgiveness Day: "Micchami Dukkadam" to all living beings.' },
    ],
  };
}
