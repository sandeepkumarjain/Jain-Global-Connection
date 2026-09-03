import { getDailyJainPanchang, getJainTithiAndMonth, JAIN_AGAM_QUOTES } from './jainPanchang';
import { JAIN_EVENTS_DATA, JainEvent } from '../components/JainEventsCalendar';

export interface UpcomingFestivalInfo {
  id: string;
  title: string;
  hindiTitle?: string;
  displayDate: string;
  gregorianDate: string;
  jainTithi: string;
  sect: string;
  significance: string;
  dietaryRule?: string;
  daysRemaining: number;
  daysLabel: string;
  isToday: boolean;
  isMajor: boolean;
  bannerColor?: string;
}

export interface DailyTithiAlertData {
  gregorianDateStr: string; // e.g. "Wednesday, 02 September 2026"
  formattedYMD: string;      // e.g. "2026-09-02"
  month: string;             // e.g. "Bhadrapada (Bhadarva) Masa"
  tithi: string;             // e.g. "Shukla Paksha (Sud) Panchami (5th Tithi - Auspicious)"
  paksha: string;            // e.g. "Shukla Paksha (Sud)"
  tithiNum: number;
  sunrise: string;
  sunset: string;
  todayObservance: {
    ruleTitle: string;
    description: string;
    isFastDay: boolean;
    recommendedDiet: string;
  };
  dailyQuote: {
    text: string;
    source: string;
  };
  todayFestival?: UpcomingFestivalInfo;
  nextFestival: UpcomingFestivalInfo | null;
  upcomingFestivals: UpcomingFestivalInfo[];
}

/**
 * Formats a Date object to YYYY-MM-DD
 */
export function formatToYMD(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calculates current Tithi and nearest upcoming significant Jain festivals
 */
export function getDailyTithiAlert(targetDate: Date = new Date()): DailyTithiAlertData {
  const panchang = getDailyJainPanchang(targetDate);
  const { tithiNum } = getJainTithiAndMonth(targetDate);
  const todayYMD = formatToYMD(targetDate);

  // Determine today's dietary observance based on Tithi
  let ruleTitle = 'Normal Sattvic Bhojan';
  let description = 'Observe compassion, Navkar Jaap, and take meals before sunset (Chouvihar).';
  let isFastDay = false;
  let recommendedDiet = 'Fresh Sattvic food; avoid food after sunset.';

  if (tithiNum === 8) {
    ruleTitle = 'Ashtami Tithi (8th Tithi) — Sacred Fasting & Swadhyay';
    description = 'Traditional day for Ekasana (single meal), Biyasana, and complete avoidance of green leafy vegetables (Arembo).';
    isFastDay = true;
    recommendedDiet = 'Ekasana / Biyasana, boiled water, no green vegetables (Hari Ka Tyag).';
  } else if (tithiNum === 14) {
    ruleTitle = 'Chaturdashi (Chaudas / 14th Tithi) — Pakshi Pratikraman';
    description = 'Holy Tithi for evening Pratikraman, atonement of transgressions, and inner purification.';
    isFastDay = true;
    recommendedDiet = 'Fasting / Ekasana, strictly Chouvihar, avoidance of root & green vegetables.';
  } else if (tithiNum === 11) {
    ruleTitle = 'Ekadashi (11th Tithi) — Tapa & Upvas Observance';
    description = 'Spiritual austerity day dedicated to Jina Puja, mantra contemplation, and dietary restraint.';
    isFastDay = true;
    recommendedDiet = 'Upvas / Ekasana, boiled water intake during daytime.';
  } else if (tithiNum === 5) {
    ruleTitle = 'Panchami (5th Tithi) — Knowledge & Auspicious Worship';
    description = 'Auspicious day for Jnana Puja, scripture reading (Swadhyay), and honoring spiritual teachers.';
    isFastDay = false;
    recommendedDiet = 'Sattvic food before sunset; study and contemplation.';
  } else if (tithiNum === 15) {
    ruleTitle = 'Purnima / Amavasya — Sacred Maha Tithi';
    description = 'Sacred culmination Tithi for universal meditation, charity (Dana), and Navkar chanting.';
    isFastDay = true;
    recommendedDiet = 'Ekasana / Upvas, Chouvihar, boiled water only.';
  }

  // Parse festivals from JAIN_EVENTS_DATA
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();

  let todayFestival: UpcomingFestivalInfo | undefined;
  const futureFestivals: UpcomingFestivalInfo[] = [];

  JAIN_EVENTS_DATA.forEach((event: JainEvent) => {
    if (!event.gregorianDate) return;
    
    // Parse event date
    const parts = event.gregorianDate.split('-');
    if (parts.length < 3) return;
    const evDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const evTime = evDate.getTime();
    
    const diffMs = evTime - targetMidnight;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    let daysLabel = '';
    const isToday = diffDays === 0;

    if (diffDays === 0) {
      daysLabel = 'Today (आज)';
    } else if (diffDays === 1) {
      daysLabel = 'Tomorrow (कल)';
    } else if (diffDays > 1) {
      daysLabel = `In ${diffDays} days`;
    } else {
      daysLabel = `${Math.abs(diffDays)} days ago`;
    }

    const festivalInfo: UpcomingFestivalInfo = {
      id: event.id,
      title: event.title,
      hindiTitle: event.hindiTitle,
      displayDate: event.displayDate,
      gregorianDate: event.gregorianDate,
      jainTithi: event.jainTithi,
      sect: event.sect,
      significance: event.significance,
      dietaryRule: event.dietaryRule,
      daysRemaining: diffDays,
      daysLabel,
      isToday,
      isMajor: event.isMajor,
      bannerColor: event.bannerColor
    };

    if (isToday) {
      todayFestival = festivalInfo;
    }

    // Only collect upcoming or today (up to 90 days in the future)
    if (diffDays >= 0 && diffDays <= 120) {
      futureFestivals.push(festivalInfo);
    }
  });

  // Sort upcoming festivals by days remaining ascending
  futureFestivals.sort((a, b) => a.daysRemaining - b.daysRemaining);

  const nextFestival = futureFestivals.length > 0 ? futureFestivals[0] : null;

  return {
    gregorianDateStr: panchang.date,
    formattedYMD: todayYMD,
    month: panchang.month,
    tithi: panchang.tithi,
    paksha: panchang.paksha,
    tithiNum,
    sunrise: panchang.sunrise,
    sunset: panchang.sunset,
    todayObservance: {
      ruleTitle,
      description,
      isFastDay,
      recommendedDiet,
    },
    dailyQuote: panchang.dailyQuote || {
      text: JAIN_AGAM_QUOTES[0].text,
      source: JAIN_AGAM_QUOTES[0].source,
    },
    todayFestival,
    nextFestival,
    upcomingFestivals: futureFestivals.slice(0, 4),
  };
}

// ==========================================
// Browser Push Notifications (Web Notification API)
// ==========================================

const NOTIF_STORAGE_KEY = 'jcg_daily_tithi_push_enabled';
const TOAST_DISMISS_KEY = 'jcg_daily_tithi_toast_dismissed_date';

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestPushPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      localStorage.setItem(NOTIF_STORAGE_KEY, 'true');
    } else {
      localStorage.setItem(NOTIF_STORAGE_KEY, 'false');
    }
    return permission;
  } catch (err) {
    console.error('Failed to request notification permission:', err);
    return 'denied';
  }
}

export function isDailyPushEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(NOTIF_STORAGE_KEY) === 'true' && getNotificationPermission() === 'granted';
}

export function setDailyPushEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTIF_STORAGE_KEY, enabled ? 'true' : 'false');
}

/**
 * Dispatches a native browser push notification for today's Jain Tithi & upcoming festival
 */
export function sendDailyTithiPushNotification(alert: DailyTithiAlertData): boolean {
  if (!isNotificationSupported()) return false;
  if (Notification.permission !== 'granted') return false;

  try {
    const festivalSummary = alert.todayFestival
      ? `🎉 Today's Mahaparv: ${alert.todayFestival.title}!`
      : alert.nextFestival
      ? `🔔 Upcoming: ${alert.nextFestival.title} (${alert.nextFestival.daysLabel})`
      : 'Auspicious day for Swadhyay & Ahimsa';

    const notif = new Notification(`🙏 Today's Jain Tithi: ${alert.tithi.split('(')[0].trim()}`, {
      body: `${alert.month}\n${festivalSummary}\nSunrise: ${alert.sunrise} • Sunset (Chouvihar): ${alert.sunset}`,
      icon: '/src/assets/images/jain_connect_logo_1784713492384.jpg',
      badge: '/src/assets/images/jain_connect_logo_1784713492384.jpg',
      tag: `jain-tithi-daily-${alert.formattedYMD}`,
      requireInteraction: false,
    });

    notif.onclick = () => {
      window.focus();
      notif.close();
    };

    return true;
  } catch (err) {
    console.error('Error firing native Notification:', err);
    return false;
  }
}

// ==========================================
// Daily Toast UI Alert Session Persistence
// ==========================================

export function hasAlertBeenDismissedToday(): boolean {
  if (typeof window === 'undefined') return false;
  const todayYMD = formatToYMD();
  const saved = localStorage.getItem(TOAST_DISMISS_KEY);
  return saved === todayYMD;
}

export function markAlertDismissedToday(): void {
  if (typeof window === 'undefined') return;
  const todayYMD = formatToYMD();
  localStorage.setItem(TOAST_DISMISS_KEY, todayYMD);
}

export function resetAlertDismissal(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOAST_DISMISS_KEY);
}
