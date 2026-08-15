import { DashboardWidgetConfig, DashboardWidgetId } from '../types';

export const DEFAULT_DASHBOARD_WIDGETS: DashboardWidgetConfig[] = [
  {
    id: 'panchang',
    title: 'Jain Panchang & Daily Tithi',
    subtitle: 'Navkarshi, Porsi, Chouvihar & Tithi Timings',
    description: 'Live sunrise/sunset calculations, Jain calendar, pachkhan timings, and daily agam teachings.',
    category: 'Spiritual',
    icon: 'Calendar',
    isPinned: true,
    isVisible: true,
    order: 0,
    badgeText: 'Essential',
    badgeColor: 'amber',
  },
  {
    id: 'audio_player',
    title: 'Sacred Bhakti & Audio Player',
    subtitle: 'Navkar Mantra, Bhaktamar Stotra & Stavan Library',
    description: 'Direct audio player for morning chanting, 48 shlokas of Bhaktamar, aartis, and devotional stavans.',
    category: 'Media',
    icon: 'Music',
    isPinned: true,
    isVisible: true,
    order: 1,
    badgeText: 'Audio Chants',
    badgeColor: 'amber',
  },
  {
    id: 'community_feed',
    title: 'Community Feed & Announcements',
    subtitle: 'Global Updates, Discussions & Sangh Bulletins',
    description: 'Real-time announcements, temple events, official bulletins, and interactive discussions from sanghs worldwide.',
    category: 'Community',
    icon: 'MessageSquare',
    isPinned: false,
    isVisible: true,
    order: 2,
    badgeText: 'Live Updates',
    badgeColor: 'blue',
  },
  {
    id: 'matrimonial_matches',
    title: 'Featured Matrimonial Matches',
    subtitle: 'Verified Grooms & Brides with Direct Biodata',
    description: 'Browse newly verified Jain matrimonial profiles filtered by sect, gotra, and qualification.',
    category: 'Directory',
    icon: 'Heart',
    isPinned: false,
    isVisible: true,
    order: 3,
    badgeText: 'Matrimonial',
    badgeColor: 'rose',
  },
  {
    id: 'business_directory',
    title: 'Verified Jain Businesses & Trade',
    subtitle: 'Jewellers, CAs, IT Firms & Enterprise Listings',
    description: 'Discover trusted Jain-owned businesses, request quotes, and connect with global entrepreneurs.',
    category: 'Directory',
    icon: 'Building2',
    isPinned: false,
    isVisible: true,
    order: 4,
    badgeText: 'Commercial',
    badgeColor: 'amber',
  },
  {
    id: 'temple_directory',
    title: 'Holy Jain Temples & Virtual Tours',
    subtitle: 'Palitana, Shikharji, Ranakpur & Derasar Locator',
    description: 'Sacred tirths, daily aarti schedules, dharmashala rooms, and 360° / HD virtual tours.',
    category: 'Directory',
    icon: 'MapPin',
    isPinned: false,
    isVisible: true,
    order: 5,
    badgeText: 'Sacred Tirths',
    badgeColor: 'emerald',
  },
  {
    id: 'daily_wisdom',
    title: 'Daily Jain Wisdom & Agam Quotes',
    subtitle: 'Tattvartha Sutra & Bhagwan Mahavira Teachings',
    description: 'Inspirational scriptural quotes with Hindi and English translations for daily spiritual reflection.',
    category: 'Spiritual',
    icon: 'Sparkles',
    isPinned: false,
    isVisible: true,
    order: 6,
    badgeText: 'Scriptures',
    badgeColor: 'purple',
  },
  {
    id: 'sangh_highlights',
    title: 'Global Sangh Hub & Directory',
    subtitle: '120+ Countries Community Statistics & Network',
    description: 'Live community census statistics, regional chapters, and directory quick explorer.',
    category: 'Community',
    icon: 'Users',
    isPinned: false,
    isVisible: true,
    order: 7,
    badgeText: 'Census Hub',
    badgeColor: 'blue',
  },
  {
    id: 'vivah_stories',
    title: 'Vivah Success Stories',
    subtitle: 'Inspiring Unions across the Global Jain Sangh',
    description: 'Testimonials and happy couple experiences arranged through the Jain Matrimonial Bureau.',
    category: 'Community',
    icon: 'Award',
    isPinned: false,
    isVisible: true,
    order: 8,
    badgeText: 'Success Stories',
    badgeColor: 'emerald',
  },
];

const STORAGE_PREFIX = 'jcg_user_dashboard_layout_';

/**
 * Load stored dashboard layout for a user or return default
 */
export const loadUserDashboardWidgets = (userId?: string): DashboardWidgetConfig[] => {
  if (!userId) {
    return [...DEFAULT_DASHBOARD_WIDGETS];
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
    if (!raw) {
      return [...DEFAULT_DASHBOARD_WIDGETS];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [...DEFAULT_DASHBOARD_WIDGETS];
    }

    // Merge with defaults to ensure all existing widget IDs exist (even if new ones were added)
    const existingIds = new Set(parsed.map((p: DashboardWidgetConfig) => p.id));
    const merged: DashboardWidgetConfig[] = [...parsed];

    DEFAULT_DASHBOARD_WIDGETS.forEach((def) => {
      if (!existingIds.has(def.id)) {
        merged.push({
          ...def,
          order: merged.length,
        });
      }
    });

    // Sort by order
    return merged.sort((a, b) => a.order - b.order);
  } catch (err) {
    console.error('Failed to load user dashboard layout:', err);
    return [...DEFAULT_DASHBOARD_WIDGETS];
  }
};

/**
 * Save user dashboard layout to local storage
 */
export const saveUserDashboardWidgets = (
  userId: string,
  widgets: DashboardWidgetConfig[]
): void => {
  if (!userId) return;
  try {
    const normalized = widgets.map((w, idx) => ({
      ...w,
      order: idx,
    }));
    localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(normalized));
  } catch (err) {
    console.error('Failed to save user dashboard layout:', err);
  }
};

/**
 * Reorder widgets array by moving an item from sourceIndex to destIndex
 */
export const reorderWidgets = (
  list: DashboardWidgetConfig[],
  startIndex: number,
  endIndex: number
): DashboardWidgetConfig[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result.map((item, index) => ({
    ...item,
    order: index,
  }));
};

/**
 * Toggle pinned status of a widget and place pinned items first if requested
 */
export const togglePinWidgetHelper = (
  widgets: DashboardWidgetConfig[],
  widgetId: DashboardWidgetId
): DashboardWidgetConfig[] => {
  return widgets.map((w) => {
    if (w.id === widgetId) {
      return { ...w, isPinned: !w.isPinned };
    }
    return w;
  });
};

/**
 * Toggle visibility of a widget
 */
export const toggleVisibilityHelper = (
  widgets: DashboardWidgetConfig[],
  widgetId: DashboardWidgetId
): DashboardWidgetConfig[] => {
  return widgets.map((w) => {
    if (w.id === widgetId) {
      return { ...w, isVisible: !w.isVisible };
    }
    return w;
  });
};
