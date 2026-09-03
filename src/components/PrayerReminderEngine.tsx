import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  playSubtlePrayerBell,
  sendPrayerBrowserNotification,
  formatTimeTo12Hour,
} from '../utils/prayerReminderSound';

export const PrayerReminderEngine: React.FC = () => {
  const { prayerReminderSettings, showToast } = useApp();
  const triggeredSlotsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!prayerReminderSettings || !prayerReminderSettings.enabled) {
      return;
    }

    const checkReminders = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;
      const todayDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      // Clean up slots from previous days
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        triggeredSlotsRef.current.clear();
      }

      const activeReminders = prayerReminderSettings.reminders.filter(
        (r) => r.enabled && r.time === currentTime
      );

      for (const reminder of activeReminders) {
        const slotKey = `${todayDateStr}_${reminder.id}_${currentTime}`;
        if (triggeredSlotsRef.current.has(slotKey)) {
          continue;
        }

        // Mark as triggered
        triggeredSlotsRef.current.add(slotKey);

        // 1. Send subtle browser notification
        if (
          typeof window !== 'undefined' &&
          'Notification' in window &&
          Notification.permission === 'granted'
        ) {
          sendPrayerBrowserNotification(reminder);
        }

        // 2. Play subtle sacred temple bell chime
        if (reminder.soundEnabled) {
          playSubtlePrayerBell(prayerReminderSettings.soundVolume || 0.6);
        }

        // 3. Subtle In-App Toast Banner
        const formattedTime = formatTimeTo12Hour(reminder.time);
        showToast(
          `🙏 Prayer Reminder: ${reminder.name} (${formattedTime})`,
          reminder.description || `Jai Jinendra! It is time for your scheduled ${reminder.name}. Take a moment for spiritual peace.`,
          'info'
        );
      }
    };

    // Run check immediately on mount/settings change
    checkReminders();

    // Check every 20 seconds
    const interval = setInterval(checkReminders, 20000);
    return () => clearInterval(interval);
  }, [prayerReminderSettings, showToast]);

  return null;
};
