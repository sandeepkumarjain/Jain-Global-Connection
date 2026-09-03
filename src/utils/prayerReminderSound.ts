import { PrayerReminderItem, PrayerReminderSettings } from '../types';

let audioCtx: AudioContext | null = null;

/**
 * Generates a subtle, soothing sacred temple bell chime using the Web Audio API.
 * Uses natural harmonics with an authentic exponential decay curve.
 */
export function playSubtlePrayerBell(volume: number = 0.6): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const safeVolume = Math.max(0.05, Math.min(volume, 1.0));

    // Master Gain
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(safeVolume * 0.45, now);
    masterGain.connect(audioCtx.destination);

    // Temple Bell Harmonic Frequencies (Sacred D5 bell with gentle overtones)
    // D5 = 587.33 Hz, A5 = 880 Hz, D6 = 1174.66 Hz, F#6 = 1479.98 Hz
    const harmonics = [
      { freq: 587.33, gain: 0.8, decay: 2.8 },
      { freq: 880.0, gain: 0.4, decay: 2.2 },
      { freq: 1174.66, gain: 0.35, decay: 1.8 },
      { freq: 1479.98, gain: 0.2, decay: 1.4 },
      { freq: 2349.32, gain: 0.1, decay: 1.0 },
    ];

    harmonics.forEach(({ freq, gain, decay }) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Attack (instant soft rise) then exponential decay
      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(gain, now + 0.03);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + decay + 0.1);
    });
  } catch (error) {
    console.warn('Subtle temple bell chime error:', error);
  }
}

/**
 * Checks current browser notification permission status.
 */
export function getNotificationPermissionStatus(): 'granted' | 'denied' | 'default' | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Requests browser notification permission from user.
 */
export async function requestBrowserNotificationPermission(): Promise<'granted' | 'denied' | 'default' | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return Notification.permission;
  }
}

/**
 * Sends a subtle browser notification for a prayer reminder.
 */
export function sendPrayerBrowserNotification(
  reminder: PrayerReminderItem,
  customBody?: string
): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const formatted12h = formatTimeTo12Hour(reminder.time);
    const title = `🙏 ${reminder.name} (${formatted12h})`;
    const body =
      customBody ||
      reminder.description ||
      `Jai Jinendra! It is time for your sacred daily ${reminder.name}. Take a moment for spiritual peace and contemplation.`;

    const notification = new Notification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: `jain-prayer-${reminder.id}`,
      silent: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (err) {
    console.warn('Browser notification error:', err);
    return false;
  }
}

/**
 * Formats 24h time ("18:45") to 12h readable time ("06:45 PM")
 */
export function formatTimeTo12Hour(time24: string): string {
  if (!time24 || !time24.includes(':')) return time24;
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  if (isNaN(h)) return time24;

  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  const hDisplay = h < 10 ? `0${h}` : `${h}`;
  return `${hDisplay}:${m} ${ampm}`;
}

/**
 * Default Recommended Prayer Timings
 */
export const DEFAULT_PRAYER_REMINDERS: PrayerReminderItem[] = [
  {
    id: 'rem_morning_samayik',
    name: 'Morning Samayik',
    hindiName: 'प्रातः सामायिक साधना',
    category: 'samayik',
    time: '07:00',
    enabled: true,
    soundEnabled: true,
    description: '48 minutes of equanimity, self-reflection, and introspection (समता भाव ध्यान).',
  },
  {
    id: 'rem_mangal_aarti',
    name: 'Mangal Aarti & Snata Puja',
    hindiName: 'मंगल आरती व स्नात्र पूजा',
    category: 'aarti',
    time: '08:30',
    enabled: true,
    soundEnabled: true,
    description: 'Morning temple offering, Deep Mala darshan, and sacred gratitude prayer.',
  },
  {
    id: 'rem_navkar_smaran',
    name: 'Navkar Mahamantra Smaran',
    hindiName: 'णमोकार महामंत्र स्मरण',
    category: 'pachkan',
    time: '12:00',
    enabled: false,
    soundEnabled: true,
    description: 'Midday spiritual pause for 9 sacred Navkar Mahamantra recitations.',
  },
  {
    id: 'rem_chauvihar_pachkan',
    name: 'Chauvihar & Sunset Pachkan',
    hindiName: 'चौविहार / सूर्यास्त पच्चक्खान',
    category: 'pachkan',
    time: '18:15',
    enabled: true,
    soundEnabled: true,
    description: 'Evening sunset vow reminder before twilight (सूर्यास्त पूर्व चौविहार नियम).',
  },
  {
    id: 'rem_sandhya_aarti',
    name: 'Sandhya Aarti & Mangal Divo',
    hindiName: 'संध्या आरती व मंगल दीवो',
    category: 'aarti',
    time: '18:45',
    enabled: true,
    soundEnabled: true,
    description: 'Twilight devotional Aarti and lighting the auspicious Mangal Divo at home or temple.',
  },
  {
    id: 'rem_evening_samayik',
    name: 'Evening Samayik / Pratikraman',
    hindiName: 'सायं सामायिक व प्रतिक्रमण',
    category: 'samayik',
    time: '19:30',
    enabled: true,
    soundEnabled: true,
    description: 'Evening atonement, universal forgiveness meditation (मिच्छामि दुक्कडम्), and Samayik.',
  },
];

export const DEFAULT_PRAYER_SETTINGS: PrayerReminderSettings = {
  enabled: false, // opt-in by default
  browserNotificationsAllowed: false,
  soundVolume: 0.7,
  reminders: DEFAULT_PRAYER_REMINDERS,
};
