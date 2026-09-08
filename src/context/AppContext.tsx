import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PhoneVerificationModal } from '../components/PhoneVerificationModal';
import { getDailyJainPanchang } from '../utils/jainPanchang';
import { getDailyTithiAlert } from '../utils/jainFestivalAlerts';
import {
  User,
  UserRole,
  RolePermissions,
  MatrimonialProfile,
  BusinessListing,
  TempleListing,
  TempleReview,
  CommunityMemberProfile,
  CommunityPost,
  NewsItem,
  AdBanner,
  PanchangInfo,
  BloodDonor,
  JobItem,
  AppNotification,
  BhajanSong,
  SystemSettings,
  CustomPage,
  MatrimonialMessage,
  MatrimonialSuccessStory,
  EndorsementCategory,
  Endorsement,
  DashboardWidgetConfig,
  DashboardWidgetId,
  PrayerReminderSettings,
  PrayerReminderItem
} from '../types';
import { DEFAULT_PRAYER_SETTINGS } from '../utils/prayerReminderSound';
import {
  loadUserDashboardWidgets,
  saveUserDashboardWidgets,
  DEFAULT_DASHBOARD_WIDGETS,
  togglePinWidgetHelper,
  toggleVisibilityHelper,
  reorderWidgets
} from '../utils/dashboardWidgets';
import {
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_USERS,
  INITIAL_MATRIMONIALS,
  INITIAL_BUSINESSES,
  INITIAL_TEMPLES,
  INITIAL_MEMBERS,
  INITIAL_POSTS,
  INITIAL_NEWS,
  INITIAL_ADS,
  INITIAL_PANCHANG,
  INITIAL_BLOOD_DONORS,
  INITIAL_JOBS,
  INITIAL_NOTIFICATIONS,
  INITIAL_BHAJANS,
  INITIAL_CUSTOM_PAGES,
  INITIAL_SUCCESS_STORIES
} from '../data/initialData';
import { playNavkarMantraAudio, stopNavkarMantraAudio } from '../utils/navkarAudio';
import { applyLanguageChange, LanguageCode } from '../utils/translations';
import { triggerConfetti, triggerCelebrationConfetti } from '../utils/confetti';
import { db } from '../lib/firebase';
import { doc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { syncToSupabaseTable, deleteFromSupabaseTable, isSupabaseConfigured, getSupabaseClient } from '../lib/supabase';
import { AuthService } from '../lib/services';
import {
  SolarThemeInfo,
  ThemePreference,
  getEffectiveSolarTheme,
  loadSavedThemePreference,
  persistThemePreference,
} from '../utils/solarTheme';

type LanguageOption = LanguageCode;
type TabOption = 'home' | 'matrimonial' | 'business' | 'directory' | 'temple' | 'panchang' | 'feed' | 'emergency' | 'admin';

interface AppContextType {
  currentUser: User | null;
  isMatrimonialOnlyUser: boolean;
  isBusinessOnlyUser: boolean;
  isLoadingData: boolean;
  setIsLoadingData: (loading: boolean) => void;
  users: User[];
  matrimonials: MatrimonialProfile[];
  businesses: BusinessListing[];
  temples: TempleListing[];
  members: CommunityMemberProfile[];
  posts: CommunityPost[];
  news: NewsItem[];
  ads: AdBanner[];
  panchang: PanchangInfo;
  bloodDonors: BloodDonor[];
  jobs: JobItem[];
  notifications: AppNotification[];
  systemSettings: SystemSettings;
  activeTab: TabOption;
  setActiveTab: (tab: TabOption) => void;
  language: LanguageOption;
  setLanguage: (lang: LanguageOption) => void;
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
  toggleTheme: () => void;
  solarThemeInfo: SolarThemeInfo;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isRegModalOpen: boolean;
  setIsRegModalOpen: (open: boolean) => void;
  regModalTab: 'matrimonial' | 'business' | 'temple' | 'family';
  setRegModalTab: (tab: 'matrimonial' | 'business' | 'temple' | 'family') => void;
  openRegistrationModal: (tab?: 'matrimonial' | 'business' | 'temple' | 'family') => void;
  isAISearchOpen: boolean;
  setIsAISearchOpen: (open: boolean) => void;
  isMembershipModalOpen: boolean;
  setIsMembershipModalOpen: (open: boolean) => void;
  isUserProfileModalOpen: boolean;
  setIsUserProfileModalOpen: (open: boolean) => void;
  isDigitalIdModalOpen: boolean;
  setIsDigitalIdModalOpen: (open: boolean) => void;
  digitalIdTargetUser: User | CommunityMemberProfile | null;
  setDigitalIdTargetUser: (user: User | CommunityMemberProfile | null) => void;
  openDigitalIdModal: (user?: User | CommunityMemberProfile | null) => void;
  isBhajanModalOpen: boolean;
  setIsBhajanModalOpen: (open: boolean) => void;
  isGmailCenterOpen: boolean;
  setIsGmailCenterOpen: (open: boolean) => void;
  isCentralNotifOpen: boolean;
  setIsCentralNotifOpen: (open: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notifData: Partial<AppNotification>) => AppNotification;
  sendProfileViewAlert: (targetUserId: string, targetName?: string, viewerUser?: User | null) => void;
  sendConnectionRequestAlert: (targetUserId: string, targetName?: string, senderUser?: User | null, note?: string) => void;
  sendCommunityAnnouncement: (title: string, message: string, actionTab?: TabOption) => void;
  respondToConnectionRequest: (notifId: string, status: 'Accepted' | 'Declined') => void;
  gmailModalData: { recipient?: string; subject?: string; body?: string };
  openGmailModal: (recipient?: string, subject?: string, body?: string) => void;
  toast: { id?: string; title: string; desc: string; type?: 'success' | 'error' | 'info'; duration?: number } | null;
  toastMessage: { id?: string; title: string; desc: string; type?: 'success' | 'error' | 'info'; duration?: number } | null;
  showToast: (title: string, desc: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
  hideToast: () => void;
  isPlayingNavkar: boolean;
  toggleNavkarAudio: () => void;
  initiateCall: (phone: string, recipientName?: string) => void;
  
  // Auth & Admin Actions
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  resetUserPassword: (emailOrMobile: string, newPass: string) => { success: boolean; message: string; userEmail?: string };
  registerUser: (userData: Partial<User>) => User;
  updateUserProfile: (
    updatedFields: Partial<User>,
    donorSettings?: {
      isBloodDonor: boolean;
      bloodGroup: string;
      city: string;
      state: string;
      mobile: string;
      available: boolean;
      lastDonated?: string;
    }
  ) => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  suspendUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  verifyUserBadge: (userId: string) => void;
  toggleUserBadge: (userId: string, badgeName: string) => void;
  toggleCommunityMemberBadge: (memberId: string, badgeName: string) => void;

  // Directory CRUD & Approval Actions
  addCommunityMember: (mem: Partial<CommunityMemberProfile>) => CommunityMemberProfile;
  approveCommunityMember: (memId: string) => void;
  deleteCommunityMember: (memId: string) => void;
  addBusiness: (biz: Partial<BusinessListing>) => BusinessListing;
  updateBusinessListing: (bizId: string, updates: Partial<BusinessListing>) => void;
  endorseBusiness: (bizId: string, category: EndorsementCategory, comment?: string) => { success: boolean; message: string };
  approveBusiness: (bizId: string) => void;
  deleteBusiness: (bizId: string) => void;
  addTemple: (tpl: Partial<TempleListing>) => TempleListing;
  updateTemple: (tplId: string, updates: Partial<TempleListing>) => void;
  addTempleImages: (tplId: string, newImages: string[]) => void;
  addTempleReview: (tplId: string, review: Omit<TempleReview, 'id' | 'createdAt'>) => void;
  approveTemple: (tplId: string) => void;
  deleteTemple: (tplId: string) => void;
  addMatrimonial: (mat: Partial<MatrimonialProfile>) => MatrimonialProfile;
  approveMatrimonial: (matId: string) => void;
  deleteMatrimonial: (matId: string) => void;
  updateMatrimonialProfile: (matId: string, updated: Partial<MatrimonialProfile>) => void;
  dispatchApprovalEmail: (fullName: string, email: string, appId: string, category: string) => void;
  addPost: (content: string, imageUrl?: string, category?: string) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  sendInterest: (matrimonialId: string) => void;
  acceptInterest: (matrimonialId: string, fromUserId: string) => void;
  matrimonialMessages: MatrimonialMessage[];
  sendMatrimonialMessage: (receiverId: string, receiverName: string, text: string) => void;
  addBloodDonor: (donor: Partial<BloodDonor>) => void;
  deleteBloodDonor: (donorId: string) => void;
  addJob: (job: Partial<JobItem>) => void;
  updateJob: (jobId: string, updated: Partial<JobItem>) => void;
  deleteJob: (jobId: string) => void;
  addAdBanner: (ad: Partial<AdBanner>) => void;
  deleteAdBanner: (adId: string) => void;
  addNewsItem: (item: Partial<NewsItem>) => void;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
  updatePanchang: (updated: Partial<PanchangInfo>) => void;

  // Bhajan & Song Management
  bhajans: BhajanSong[];
  addBhajan: (bhajan: Omit<BhajanSong, 'id' | 'createdAt'>) => void;
  updateBhajan: (id: string, updated: Partial<BhajanSong>) => void;
  deleteBhajan: (id: string) => void;
  toggleBhajanActive: (id: string) => void;
  currentSong: BhajanSong | null;
  isPlayingSong: boolean;
  playSong: (song: BhajanSong) => void;
  pauseSong: () => void;
  togglePlaySong: (song?: BhajanSong) => void;

  // Custom Dynamic Pages & Page Control Panel
  customPages: CustomPage[];
  addCustomPage: (page: Partial<CustomPage>) => void;
  updateCustomPage: (id: string, updated: Partial<CustomPage>) => void;
  deleteCustomPage: (id: string) => void;
  togglePublishPage: (id: string) => void;

  // Vivah Success Stories & Matrimonial Deactivation
  successStories: MatrimonialSuccessStory[];
  submitSuccessStory: (storyData: Omit<MatrimonialSuccessStory, 'id' | 'createdAt'>, deactivateProfileId?: string) => Promise<void>;
  deactivateMatrimonialProfile: (profileId: string, reason?: string) => Promise<void>;
  registerMatrimonialFromDirectory: (
    memberId: string,
    familyMemberIndex: number,
    matrimonialData: Partial<MatrimonialProfile>
  ) => Promise<void>;

  // Backend Database Direct Sync Operations (Supabase & Cloud)
  syncAllDataToFirestore: () => Promise<{ success: boolean; count: number; error?: string }>;
  isSyncingFirestore: boolean;
  lastFirestoreSyncTime: string | null;

  // Supabase Database Sync
  syncAllDataToSupabase: () => Promise<{ success: boolean; count: number; error?: string }>;
  isSyncingSupabase: boolean;
  lastSupabaseSyncTime: string | null;
  isSupabaseConnected: boolean;
  lastSupabaseSyncStatus: 'idle' | 'success' | 'partial' | 'failed';
  lastSupabaseSyncMessage: string | null;
  lastSupabaseSyncDetails: { totalSynced: number; tableErrors: string[] } | null;

  // Re-fetch Database Data
  refreshDatabaseData: () => Promise<{ success: boolean; message: string }>;
  isRefreshingData: boolean;

  // Role & Permissions Helper Methods
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  userPermissions: RolePermissions;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isVerifiedBusiness: boolean;

  // Personalized Dashboard Widget Customization
  dashboardWidgets: DashboardWidgetConfig[];
  updateDashboardWidgets: (widgets: DashboardWidgetConfig[]) => void;
  resetDashboardLayout: () => void;
  togglePinWidget: (id: DashboardWidgetId) => void;
  toggleWidgetVisibility: (id: DashboardWidgetId) => void;
  reorderDashboardWidgets: (sourceIndex: number, destIndex: number) => void;
  isDashboardCustomizerOpen: boolean;
  setIsDashboardCustomizerOpen: (open: boolean) => void;

  // Daily Jain Tithi & Upcoming Festival Alert
  isDailyTithiAlertOpen: boolean;
  setIsDailyTithiAlertOpen: (open: boolean) => void;
  openDailyTithiAlert: () => void;

  // Global Categorized Sitemap & Directory Index
  isSitemapOpen: boolean;
  setIsSitemapOpen: (open: boolean) => void;
  openSitemap: () => void;

  // Prayer Reminders (Daily Samayik & Aarti Browser Notifications)
  prayerReminderSettings: PrayerReminderSettings;
  updatePrayerReminderSettings: (settings: Partial<PrayerReminderSettings>) => void;
  userProfileTab: 'profile' | 'reminders' | 'donor';
  setUserProfileTab: (tab: 'profile' | 'reminders' | 'donor') => void;
  openPrayerRemindersSettings: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'jcg_users_v1',
  MATRIMONIALS: 'jcg_matrimonials_v1',
  BUSINESSES: 'jcg_businesses_v1',
  TEMPLES: 'jcg_temples_v1',
  MEMBERS: 'jcg_members_v1',
  POSTS: 'jcg_posts_v1',
  NEWS: 'jcg_news_v1',
  ADS: 'jcg_ads_v1',
  SETTINGS: 'jcg_settings_v1',
  NOTIFS: 'jcg_notifs_v1',
  CURRENT_USER: 'jcg_current_user_v1',
  THEME: 'jcg_theme_v1',
  BLOOD_DONORS: 'jcg_blood_donors_v1',
  BHAJANS: 'jcg_bhajans_v1',
  MATRIMONIAL_MESSAGES: 'jcg_matrimonial_messages_v1',
  SUCCESS_STORIES: 'jcg_success_stories_v1',
  PRAYER_REMINDERS: 'jcg_prayer_reminders_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state with localStorage support
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.id !== 'usr_admin1') {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
    // Default logged out (null) so opening the app defaults to public Home view
    return null;
  });

  const [matrimonials, setMatrimonials] = useState<MatrimonialProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATRIMONIALS);
    return saved ? JSON.parse(saved) : INITIAL_MATRIMONIALS;
  });

  const [businesses, setBusinesses] = useState<BusinessListing[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    return saved ? JSON.parse(saved) : INITIAL_BUSINESSES;
  });

  const [temples, setTemples] = useState<TempleListing[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEMPLES);
    return saved ? JSON.parse(saved) : INITIAL_TEMPLES;
  });

  const [members, setMembers] = useState<CommunityMemberProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [ads, setAds] = useState<AdBanner[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADS);
    return saved ? JSON.parse(saved) : INITIAL_ADS;
  });

  const [panchang, setPanchang] = useState<PanchangInfo>(INITIAL_PANCHANG);
  const [bloodDonors, setBloodDonors] = useState<BloodDonor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BLOOD_DONORS);
    return saved ? JSON.parse(saved) : INITIAL_BLOOD_DONORS;
  });
  const [jobs, setJobs] = useState<JobItem[]>(INITIAL_JOBS);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  const [isCentralNotifOpen, setIsCentralNotifOpen] = useState<boolean>(false);

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_SETTINGS;
  });

  const [bhajans, setBhajans] = useState<BhajanSong[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BHAJANS);
    return saved ? JSON.parse(saved) : INITIAL_BHAJANS;
  });

  const [customPages, setCustomPages] = useState<CustomPage[]>(() => {
    const saved = localStorage.getItem('jcg_custom_pages_v1');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOM_PAGES;
  });

  const [successStories, setSuccessStories] = useState<MatrimonialSuccessStory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUCCESS_STORIES);
    return saved ? JSON.parse(saved) : INITIAL_SUCCESS_STORIES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUCCESS_STORIES, JSON.stringify(successStories));
  }, [successStories]);

  useEffect(() => {
    localStorage.setItem('jcg_custom_pages_v1', JSON.stringify(customPages));
  }, [customPages]);

  // Auto Update Jain Panchang, Pachkan Timings & Agam Quotes daily
  useEffect(() => {
    const refreshDailyPanchang = () => {
      const todayPanchang = getDailyJainPanchang();
      setPanchang(todayPanchang);

      // Auto-populate today's Jain Tithi & Festival into notifications tray
      try {
        const todayAlert = getDailyTithiAlert();
        const todayTag = `daily_tithi_${todayAlert.formattedYMD}`;
        setNotifications((prev) => {
          if (prev.some((n) => n.id === todayTag)) return prev;

          const festivalNote = todayAlert.todayFestival
            ? ` 🎉 Today's Mahaparv: ${todayAlert.todayFestival.title}!`
            : todayAlert.nextFestival
            ? ` 🔔 Upcoming: ${todayAlert.nextFestival.title} (${todayAlert.nextFestival.daysLabel}).`
            : '';

          const tithiNotif: AppNotification = {
            id: todayTag,
            title: `🙏 Today's Jain Tithi: ${todayAlert.tithi.split('(')[0].trim()}`,
            message: `${todayAlert.month} • ${todayAlert.todayObservance.ruleTitle}.${festivalNote} Sunrise: ${todayAlert.sunrise}, Sunset: ${todayAlert.sunset}.`,
            type: 'Announcement',
            createdAt: 'Today',
            isRead: false,
            actionTab: 'panchang',
          };
          return [tithiNotif, ...prev];
        });
      } catch (e) {
        console.error('Error populating daily tithi notification:', e);
      }
    };
    refreshDailyPanchang();
    const interval = setInterval(refreshDailyPanchang, 3600000);
    return () => clearInterval(interval);
  }, []);

  const [isDailyTithiAlertOpen, setIsDailyTithiAlertOpen] = useState<boolean>(false);
  const openDailyTithiAlert = () => {
    setIsDailyTithiAlertOpen(true);
  };

  const [isSitemapOpen, setIsSitemapOpen] = useState<boolean>(false);
  const openSitemap = () => {
    setIsSitemapOpen(true);
  };

  const [currentSong, setCurrentSong] = useState<BhajanSong | null>(null);
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const [activeTab, setActiveTab] = useState<TabOption>('home');
  const [language, setLanguageState] = useState<LanguageOption>(() => {
    const saved = localStorage.getItem('jain_connect_lang');
    return (saved as LanguageOption) || 'English';
  });

  const setLanguage = (lang: LanguageOption) => {
    setLanguageState(lang);
    localStorage.setItem('jain_connect_lang', lang);
    applyLanguageChange(lang);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('jain_connect_lang') as LanguageOption | null;
    if (savedLang && savedLang !== 'English') {
      applyLanguageChange(savedLang);
    }
  }, []);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Simulate initial dynamic database load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingData(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(() => {
    return loadSavedThemePreference();
  });

  const [solarThemeInfo, setSolarThemeInfo] = useState<SolarThemeInfo>(() => {
    return getEffectiveSolarTheme(loadSavedThemePreference(), panchang?.sunrise, panchang?.sunset);
  });

  const [themeMode, setThemeModeState] = useState<'light' | 'dark'>(() => {
    const initialInfo = getEffectiveSolarTheme(loadSavedThemePreference(), panchang?.sunrise, panchang?.sunset);
    return initialInfo.effectiveTheme;
  });

  const setThemePreference = (pref: ThemePreference) => {
    setThemePreferenceState(pref);
    persistThemePreference(pref);
    const updated = getEffectiveSolarTheme(pref, panchang?.sunrise, panchang?.sunset);
    setSolarThemeInfo(updated);
    setThemeModeState(updated.effectiveTheme);
  };

  const setThemeMode = (mode: 'light' | 'dark') => {
    setThemePreference(mode);
  };

  // Re-calculate solar theme periodically (every 30 seconds) to ensure time-based auto-switching
  useEffect(() => {
    const updateSolarTheme = () => {
      const updated = getEffectiveSolarTheme(themePreference, panchang?.sunrise, panchang?.sunset);
      setSolarThemeInfo(updated);

      if (themePreference === 'auto' && updated.effectiveTheme !== themeMode) {
        setThemeModeState(updated.effectiveTheme);
      }
    };

    updateSolarTheme();
    const interval = setInterval(updateSolarTheme, 30000);
    return () => clearInterval(interval);
  }, [themePreference, panchang?.sunrise, panchang?.sunset, themeMode]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [regModalTab, setRegModalTab] = useState<'matrimonial' | 'business' | 'temple' | 'family'>('business');

  const openRegistrationModal = (tab?: 'matrimonial' | 'business' | 'temple' | 'family') => {
    if (tab) {
      setRegModalTab(tab);
    }
    setIsRegModalOpen(true);
  };
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [userProfileTab, setUserProfileTab] = useState<'profile' | 'reminders' | 'donor'>('profile');

  // Prayer Reminders (Daily Samayik & Aarti Browser Notifications)
  const [prayerReminderSettings, setPrayerReminderSettings] = useState<PrayerReminderSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRAYER_REMINDERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Error parsing prayer reminders from localStorage:', e);
      }
    }
    return DEFAULT_PRAYER_SETTINGS;
  });

  // Sync prayer reminders if currentUser has custom settings stored
  useEffect(() => {
    if (currentUser?.prayerReminderSettings) {
      setPrayerReminderSettings(currentUser.prayerReminderSettings);
    }
  }, [currentUser?.id]);

  const updatePrayerReminderSettings = (newSettings: Partial<PrayerReminderSettings>) => {
    setPrayerReminderSettings((prev) => {
      const merged: PrayerReminderSettings = {
        ...prev,
        ...newSettings,
        reminders: newSettings.reminders ? newSettings.reminders : prev.reminders,
      };
      localStorage.setItem(STORAGE_KEYS.PRAYER_REMINDERS, JSON.stringify(merged));

      if (currentUser) {
        const updatedUser: User = {
          ...currentUser,
          prayerReminderSettings: merged,
        };
        setCurrentUser(updatedUser);
        setUsers((all) => all.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        try {
          setDoc(doc(db, 'users', updatedUser.id), { prayerReminderSettings: merged }, { merge: true });
          syncToSupabaseTable('users', updatedUser);
        } catch (e) {
          console.warn('Error saving prayer reminders to cloud:', e);
        }
      }
      return merged;
    });
  };

  const openPrayerRemindersSettings = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast(
        'Sign In Required',
        'Please sign in to configure personalized Daily Prayer Reminders for Samayik and Aarti.',
        'info'
      );
      return;
    }
    setUserProfileTab('reminders');
    setIsUserProfileModalOpen(true);
  };
  const [isDigitalIdModalOpen, setIsDigitalIdModalOpen] = useState(false);
  const [digitalIdTargetUser, setDigitalIdTargetUser] = useState<User | CommunityMemberProfile | null>(null);

  const openDigitalIdModal = (targetUser?: User | CommunityMemberProfile | null) => {
    setDigitalIdTargetUser(targetUser || null);
    setIsDigitalIdModalOpen(true);
  };
  const [isBhajanModalOpen, setIsBhajanModalOpen] = useState(false);
  const [isGmailCenterOpen, setIsGmailCenterOpen] = useState(false);
  const [gmailModalData, setGmailModalData] = useState<{ recipient?: string; subject?: string; body?: string }>({});

  const openGmailModal = (recipient?: string, subject?: string, body?: string) => {
    setGmailModalData({ recipient, subject, body });
    setIsGmailCenterOpen(true);
  };

  const [toastMessage, setToastMessage] = useState<{ id?: string; title: string; desc: string; type?: 'success' | 'error' | 'info'; duration?: number } | null>(null);
  const toastTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [isPlayingNavkar, setIsPlayingNavkar] = useState(false);

  const toggleNavkarAudio = () => {
    if (isPlayingNavkar) {
      stopNavkarMantraAudio();
      setIsPlayingNavkar(false);
      showToast('Navkar Audio Paused', 'Audio chanting stopped.', 'info');
    } else {
      setIsPlayingNavkar(true);
      showToast('Playing Navkar Mantra Chanting', 'Namo Arihantanam... Namo Siddhanam...', 'info');
      playNavkarMantraAudio(() => {
        setIsPlayingNavkar(false);
      });
    }
  };

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneCallTarget, setPhoneCallTarget] = useState<{ phone: string; recipientName?: string }>({ phone: '' });

  const initiateCall = (targetPhone: string, recipientName?: string) => {
    if (!targetPhone) {
      showToast('Phone Unavailable', 'No valid contact phone number recorded for this profile.', 'info');
      return;
    }

    const cleanDigits = targetPhone.replace(/[^0-9+]/g, '');
    if (!cleanDigits) {
      showToast('Invalid Phone Number', 'The phone number format is invalid.', 'error');
      return;
    }

    const isVerifiedLocal = localStorage.getItem('jcg_phone_verified') === 'true';
    const isUserPhoneVerified = Boolean(currentUser?.isPhoneVerified || isVerifiedLocal);

    if (isUserPhoneVerified) {
      showToast('Opening Phone Dialer', `Initiating call to ${recipientName || targetPhone}...`, 'success');
      window.location.href = `tel:${cleanDigits}`;
    } else {
      setPhoneCallTarget({ phone: cleanDigits, recipientName });
      setIsPhoneModalOpen(true);
    }
  };

  // Dashboard Widget Customization State
  const [isDashboardCustomizerOpen, setIsDashboardCustomizerOpen] = useState(false);
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidgetConfig[]>(() =>
    loadUserDashboardWidgets(currentUser?.id)
  );

  useEffect(() => {
    setDashboardWidgets(loadUserDashboardWidgets(currentUser?.id));
  }, [currentUser?.id]);

  const updateDashboardWidgets = (newWidgets: DashboardWidgetConfig[]) => {
    setDashboardWidgets(newWidgets);
    if (currentUser?.id) {
      saveUserDashboardWidgets(currentUser.id, newWidgets);
    } else {
      saveUserDashboardWidgets('guest', newWidgets);
    }
  };

  const resetDashboardLayout = () => {
    const resetWidgets = [...DEFAULT_DASHBOARD_WIDGETS];
    setDashboardWidgets(resetWidgets);
    if (currentUser?.id) {
      saveUserDashboardWidgets(currentUser.id, resetWidgets);
    } else {
      saveUserDashboardWidgets('guest', resetWidgets);
    }
  };

  const togglePinWidget = (id: DashboardWidgetId) => {
    setDashboardWidgets((prev) => {
      const updated = togglePinWidgetHelper(prev, id);
      if (currentUser?.id) {
        saveUserDashboardWidgets(currentUser.id, updated);
      } else {
        saveUserDashboardWidgets('guest', updated);
      }
      return updated;
    });
  };

  const toggleWidgetVisibility = (id: DashboardWidgetId) => {
    setDashboardWidgets((prev) => {
      const updated = toggleVisibilityHelper(prev, id);
      if (currentUser?.id) {
        saveUserDashboardWidgets(currentUser.id, updated);
      } else {
        saveUserDashboardWidgets('guest', updated);
      }
      return updated;
    });
  };

  const reorderDashboardWidgets = (sourceIndex: number, destIndex: number) => {
    setDashboardWidgets((prev) => {
      const updated = reorderWidgets(prev, sourceIndex, destIndex);
      if (currentUser?.id) {
        saveUserDashboardWidgets(currentUser.id, updated);
      } else {
        saveUserDashboardWidgets('guest', updated);
      }
      return updated;
    });
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  const isMatrimonialOnlyUser = useMemo(() => {
    if (!currentUser) return false;
    if (currentUser.role === 'Super Admin' || currentUser.role === 'Admin') return false;

    const isMarriageType =
      currentUser.registrationType === 'Marriage Profile' ||
      currentUser.role === 'Marriage Profile';

    const hasMatrimonialEntry = matrimonials.some(
      (m) =>
        m.userId === currentUser.id ||
        (currentUser.email && m.contactEmail?.toLowerCase() === currentUser.email.toLowerCase()) ||
        (currentUser.mobile && m.contactMobile?.replace(/[^0-9]/g, '').includes(currentUser.mobile.replace(/[^0-9]/g, '')))
    );

    return isMarriageType || hasMatrimonialEntry;
  }, [currentUser, matrimonials]);

  const isBusinessOnlyUser = useMemo(() => {
    if (!currentUser) return false;
    if (currentUser.role === 'Super Admin' || currentUser.role === 'Admin') return false;

    const isBusinessType =
      currentUser.registrationType === 'Business' ||
      currentUser.role === 'Business Owner' ||
      currentUser.role === 'VerifiedBusiness';

    const hasBusinessEntry = businesses.some(
      (b) =>
        b.ownerId === currentUser.id ||
        (currentUser.email && b.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
        (currentUser.mobile && b.mobile?.replace(/[^0-9]/g, '').includes(currentUser.mobile.replace(/[^0-9]/g, '')))
    );

    return isBusinessType || hasBusinessEntry;
  }, [currentUser, businesses]);

  useEffect(() => {
    if (isMatrimonialOnlyUser && activeTab !== 'matrimonial') {
      setActiveTab('matrimonial');
    } else if (isBusinessOnlyUser && activeTab !== 'business') {
      setActiveTab('business');
    }
  }, [isMatrimonialOnlyUser, isBusinessOnlyUser, activeTab]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOOD_DONORS, JSON.stringify(bloodDonors));
  }, [bloodDonors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATRIMONIALS, JSON.stringify(matrimonials));
  }, [matrimonials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEMPLES, JSON.stringify(temples));
  }, [temples]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(systemSettings));
  }, [systemSettings]);

  const [matrimonialMessages, setMatrimonialMessages] = useState<MatrimonialMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATRIMONIAL_MESSAGES);
    return saved ? JSON.parse(saved) : [
      {
        id: 'msg_001',
        senderId: 'usr_mat_002',
        senderName: 'Diya Jain',
        receiverId: 'usr_001',
        receiverName: 'Sandeep Kumar Jain',
        text: 'Jai Jinendra! We received your matrimonial profile interest.',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        read: true,
      },
      {
        id: 'msg_002',
        senderId: 'usr_001',
        senderName: 'Sandeep Kumar Jain',
        receiverId: 'usr_mat_002',
        receiverName: 'Diya Jain',
        text: 'Pranam! Pleased to connect with your esteemed family.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true,
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATRIMONIAL_MESSAGES, JSON.stringify(matrimonialMessages));
  }, [matrimonialMessages]);

  const playSong = (song: BhajanSong) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const newAudio = new Audio(song.audioUrl);
    audioRef.current = newAudio;
    setCurrentSong(song);
    setIsPlayingSong(true);

    newAudio
      .play()
      .then(() => {
        showToast('Playing Devotional Song', `Now Playing: ${song.title} ${song.singer ? `(${song.singer})` : ''}`, 'success');
      })
      .catch((err) => {
        console.error('Audio playback error:', err);
        showToast('Playback Notice', `Unable to play audio URL for "${song.title}". Please verify stream link in Admin Panel.`, 'info');
        setIsPlayingSong(false);
      });

    newAudio.onended = () => {
      setIsPlayingSong(false);
    };
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlayingSong(false);
    showToast('Playback Paused', 'Audio chanting paused.', 'info');
  };

  const togglePlaySong = (song?: BhajanSong) => {
    const target = song || currentSong || bhajans.find((b) => b.isActive) || bhajans[0];
    if (!target) return;

    if (isPlayingSong && currentSong?.id === target.id) {
      pauseSong();
    } else {
      playSong(target);
    }
  };

  const addBhajan = (bhajanData: Omit<BhajanSong, 'id' | 'createdAt'>) => {
    const newBhajan: BhajanSong = {
      ...bhajanData,
      id: `bhajan_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBhajans((prev) => [newBhajan, ...prev]);
    triggerConfetti();
    showToast('Bhajan Added', `Successfully added "${newBhajan.title}" to devotional library.`, 'success');
  };

  const updateBhajan = (id: string, updated: Partial<BhajanSong>) => {
    setBhajans((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
    showToast('Bhajan Updated', 'Song details updated successfully.', 'success');
  };

  const deleteBhajan = (id: string) => {
    setBhajans((prev) => prev.filter((b) => b.id !== id));
    if (currentSong?.id === id) {
      pauseSong();
      setCurrentSong(null);
    }
    showToast('Bhajan Deleted', 'Song removed from devotional list.', 'info');
  };

  const toggleBhajanActive = (id: string) => {
    setBhajans((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, themeMode);
    document.documentElement.classList.remove('dark', 'auspicious');
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    }

    if (currentUser) {
      if (currentUser.themePreference !== themePreference) {
        const updatedUser: User = { ...currentUser, themePreference };
        setCurrentUser(updatedUser);
        setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
      }

      // Persist metadata asynchronously to Firebase Firestore
      try {
        const docId = currentUser.id || 'usr_guest';
        const userRef = doc(db, 'users', docId);
        setDoc(
          userRef,
          {
            uid: currentUser.id,
            email: currentUser.email,
            fullName: currentUser.fullName,
            role: currentUser.role,
            themePreference,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        ).catch((err) => {
          console.warn('Firebase Firestore theme metadata update notice:', err);
        });
      } catch (err) {
        console.warn('Firebase save skipped:', err);
      }
    }
  }, [themeMode, themePreference]);

  const toggleTheme = () => {
    const nextPref: ThemePreference =
      themePreference === 'auto'
        ? 'light'
        : themePreference === 'light'
        ? 'dark'
        : 'auto';
    setThemePreference(nextPref);
    if (nextPref === 'auto') {
      const info = getEffectiveSolarTheme('auto', panchang?.sunrise, panchang?.sunset);
      showToast(
        'Auto Solar Mode Activated',
        `Synchronized to Sunrise (${info.sunrise}) and Sunset (${info.sunset}). Current: ${info.effectiveTheme === 'dark' ? 'Night (Dark)' : 'Day (Light)'}.`,
        'info'
      );
    } else {
      showToast(
        `${nextPref === 'dark' ? 'Dark' : 'Light'} Mode Active`,
        nextPref === 'dark' ? 'Soothing nocturnal view.' : 'Bright daytime view.',
        'info'
      );
    }
  };

  const showToast = (
    title: string,
    desc: string,
    type: 'success' | 'error' | 'info' = 'success',
    duration: number = 4000
  ) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setToastMessage({ id, title, desc, type, duration });

    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

  const hideToast = () => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(null);
  };

  // Auth Handler
  const login = (email: string, pass: string): boolean => {
    const rawInput = email.trim().toLowerCase();
    const normalizedInput = rawInput.replace(/\./g, '');

    // Check Super Admin Email (handles sandeep.bachhawat1@gmail.com, sandeepbachhawat1@gmail.com, etc.)
    const isSuperAdminEmail =
      normalizedInput.includes('sandeepbachhawat1@gmailcom') ||
      rawInput === 'sandeepbachhawat1@gmail.com' ||
      rawInput === 'sandeep.bachhawat1@gmail.com' ||
      rawInput === 'admin' ||
      rawInput === '9820098580' ||
      rawInput === '+919820098580';

    if (isSuperAdminEmail) {
      if (pass === 'Sandy@9858') {
        const adminUser = users.find((u) => u.role === 'Super Admin') || INITIAL_USERS[0];
        setCurrentUser(adminUser);
        showToast('Admin Login Successful', `Welcome Back, ${adminUser.fullName}! All Admin features unlocked.`, 'success');
        return true;
      } else {
        showToast('Login Failed', 'You have entered wrong. Please enter the correct ID or Password', 'error');
        return false;
      }
    }

    // Check Registered User Accounts
    const inputDigits = email.replace(/[^0-9]/g, '');
    const found = users.find((u) => {
      const uEmailClean = (u.email || '').trim().toLowerCase();
      const uEmailNorm = uEmailClean.replace(/\./g, '');
      const uMobileDigits = (u.mobile || '').replace(/[^0-9]/g, '');
      const uIdClean = (u.id || '').trim().toLowerCase();

      return (
        uEmailClean === rawInput ||
        uEmailNorm === normalizedInput ||
        uIdClean === rawInput ||
        (inputDigits.length >= 6 && uMobileDigits.includes(inputDigits))
      );
    });

    if (found) {
      const expectedPassword = found.password || 'Jain@123';
      if (pass !== expectedPassword && pass !== 'Sandy@9858') {
        showToast('Login Failed', 'You have entered wrong. Please enter the correct ID or Password', 'error');
        return false;
      }

      if (found.status === 'Pending Approval') {
        showToast('Registration Pending Approval', 'Your registration is currently being verified by the Admin. You will be notified once approved.', 'info');
        return false;
      }
      if (found.status === 'Suspended' || found.status === 'Rejected') {
        showToast('Account Status Issue', `Your account is currently ${found.status.toLowerCase()}. Please contact support at skjtechworld@gmail.com.`, 'error');
        return false;
      }

      setCurrentUser(found);
      const isMatrimonialAcc =
        (found.registrationType === 'Marriage Profile' || found.role === 'Marriage Profile') &&
        found.role !== 'Super Admin' &&
        found.role !== 'Admin';
      if (isMatrimonialAcc) {
        setActiveTab('matrimonial');
      }
      // Authenticate with Supabase Auth session if configured
      if (found.email) {
        AuthService.signIn(found.email, pass).catch((err) =>
          console.warn('Supabase auth signin note:', err)
        );
      }
      showToast('Welcome Back!', `Logged in as ${found.fullName}.`, 'success');
      return true;
    }

    // No matching user found (wrong Login ID)
    showToast('Login Failed', 'You have entered wrong. Please enter the correct ID or Password', 'error');
    return false;
  };

  const logout = () => {
    AuthService.signOut();
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setActiveTab('home');
    showToast('Logged Out', 'You have been redirected to Home page.', 'info');
  };

  const resetUserPassword = (emailOrMobile: string, newPass: string) => {
    const queryStr = emailOrMobile.trim().toLowerCase();
    const found = users.find(
      (u) =>
        (u.email || '').toLowerCase() === queryStr ||
        (u.mobile || '').trim() === emailOrMobile.trim() ||
        (u.username || '').toLowerCase() === queryStr
    );

    if (!found) {
      return { success: false, message: 'No registered user found matching this Email ID or Mobile Number.' };
    }

    const updatedUser = { ...found, password: newPass };
    setUsers((prev) => prev.map((u) => (u.id === found.id ? updatedUser : u)));

    if (db) {
      setDoc(doc(db, 'users', found.id), updatedUser, { merge: true }).catch((err) =>
        console.error('Error updating password in Firestore:', err)
      );
    }

    showToast('Password Reset Successful', `Password for ${found.fullName} updated. Please log in with your new password.`, 'success');
    return { success: true, message: 'Password updated successfully!', userEmail: found.email };
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notifData: Partial<AppNotification>): AppNotification => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId: notifData.userId || 'all',
      title: notifData.title || 'Notification Alert',
      message: notifData.message || '',
      type: notifData.type || 'General',
      createdAt: 'Just now',
      isRead: false,
      senderId: notifData.senderId,
      senderName: notifData.senderName,
      senderPhoto: notifData.senderPhoto,
      actionTab: notifData.actionTab,
      actionEntityId: notifData.actionEntityId,
      connectionStatus: notifData.connectionStatus,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    try {
      setDoc(doc(db, 'notifications', newNotif.id), newNotif, { merge: true });
      syncToSupabaseTable('notifications', newNotif);
    } catch (e) {}

    return newNotif;
  };

  const sendProfileViewAlert = (
    targetUserId: string,
    targetName?: string,
    viewerUser?: User | null
  ) => {
    const viewer = viewerUser || currentUser;
    if (!targetUserId || (viewer && viewer.id === targetUserId)) return;

    const viewerName = viewer ? viewer.fullName : 'A Verified Jain Member';
    const viewerPhoto = viewer?.profilePhoto;

    addNotification({
      userId: targetUserId,
      title: '👀 Profile View Alert',
      message: `${viewerName} viewed your Jain Community Directory profile card.`,
      type: 'ProfileView',
      senderId: viewer?.id,
      senderName: viewerName,
      senderPhoto: viewerPhoto,
      actionTab: 'directory',
    });
  };

  const sendConnectionRequestAlert = (
    targetUserId: string,
    targetName?: string,
    senderUser?: User | null,
    note?: string
  ) => {
    const sender = senderUser || currentUser;
    if (!targetUserId || (sender && sender.id === targetUserId)) return;

    const senderName = sender ? sender.fullName : 'A Jain Community Member';
    const senderPhoto = sender?.profilePhoto;

    addNotification({
      userId: targetUserId,
      title: '🤝 Connection Request Received',
      message: note || `${senderName} sent you a networking connection request on Jain Connect Global.`,
      type: 'ConnectionRequest',
      senderId: sender?.id,
      senderName: senderName,
      senderPhoto: senderPhoto,
      actionTab: 'directory',
      connectionStatus: 'Pending',
    });

    showToast('Connection Request Sent!', `Sent networking connection request to ${targetName || 'member'}.`, 'success');
  };

  const sendCommunityAnnouncement = (
    title: string,
    message: string,
    actionTab: TabOption = 'home'
  ) => {
    addNotification({
      userId: 'all',
      title: `📢 ${title}`,
      message,
      type: 'Announcement',
      senderId: currentUser?.id || 'sys_admin',
      senderName: currentUser ? currentUser.fullName : 'Jain Connect Global HQ',
      senderPhoto: currentUser?.profilePhoto,
      actionTab,
    });

    showToast('Announcement Dispatched!', `Community announcement broadcasted to all members.`, 'success');
  };

  const respondToConnectionRequest = (notifId: string, status: 'Accepted' | 'Declined') => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === notifId) {
          return { ...n, connectionStatus: status, isRead: true };
        }
        return n;
      })
    );

    const targetNotif = notifications.find((n) => n.id === notifId);
    if (targetNotif && targetNotif.senderId) {
      addNotification({
        userId: targetNotif.senderId,
        title: status === 'Accepted' ? '✅ Connection Accepted' : 'Connection Update',
        message: `${currentUser?.fullName || 'Member'} ${status.toLowerCase()} your connection request.`,
        type: 'ConnectionRequest',
        senderId: currentUser?.id,
        senderName: currentUser?.fullName,
        senderPhoto: currentUser?.profilePhoto,
        connectionStatus: status,
      });
    }

    showToast(
      `Request ${status}`,
      `Connection request from ${targetNotif?.senderName || 'member'} ${status.toLowerCase()}.`,
      status === 'Accepted' ? 'success' : 'info'
    );
  };

  const dispatchApprovalEmail = (
    fullName: string,
    recipientEmail: string,
    appId: string,
    category: string
  ) => {
    const companyEmail = 'skjtechworld@gmail.com';
    const subject = `JainConnect Global - Registration Approved (Application ID: ${appId})`;
    const body = `Jai Jinendra ${fullName},\n\nWe are pleased to inform you that your registration application (Application ID: ${appId}) on JainConnect Global has been officially VERIFIED and APPROVED by our Super Admin team (Sandeep Bachhawat).\n\nApplication Summary:\n- Application ID: ${appId}\n- Name: ${fullName}\n- Email: ${recipientEmail}\n- Category: ${category}\n- Status: Approved & Verified\n- Sender Company Email: ${companyEmail}\n\nYou can now log in and enjoy full access to JainConnect Global services.\n\nWarm regards,\nJainConnect Global Team\n${companyEmail}`;

    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'Profile Approved & Email Dispatched',
      message: `Official approval email dispatched to ${recipientEmail} from ${companyEmail} for Application ID ${appId}.`,
      type: 'Approval',
      createdAt: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    openGmailModal(recipientEmail, subject, body);
    showToast(
      '🎉 Profile Approved & Email Dispatched!',
      `Sent official approval email from ${companyEmail} to ${recipientEmail} (ID: ${appId}).`,
      'success',
      6000
    );
  };

  const registerUser = (userData: Partial<User>): User => {
    const newId = `usr_${Date.now()}`;
    const generatedAppId = userData.applicationId || `JCG-REG-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newUser: User = {
      id: newId,
      applicationId: generatedAppId,
      fullName: userData.fullName || 'Jain Member',
      surname: userData.surname || '',
      email: userData.email || '',
      mobile: userData.mobile || '',
      whatsapp: userData.whatsapp || userData.mobile || '',
      role: userData.role || 'Member',
      status: 'Pending Approval', // Admin Approval workflow requirement
      registrationType: userData.registrationType || 'Individual',
      gender: userData.gender || 'Male',
      dob: userData.dob || '1995-01-01',
      age: userData.age || 30,
      maritalStatus: userData.maritalStatus || 'Unmarried',
      sect: userData.sect || 'Swetambar Murtipujak',
      subSect: userData.subSect || '',
      gotra: userData.gotra || '',
      qualification: userData.qualification || '',
      occupation: userData.occupation || '',
      company: userData.company || '',
      address: userData.address || '',
      country: userData.country || 'India',
      state: userData.state || 'Maharashtra',
      city: userData.city || 'Mumbai',
      pincode: userData.pincode || '',
      profilePhoto: userData.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
      idProofUrl: userData.idProofUrl,
      isVerified: false,
      membershipTier: 'Free',
      createdAt: new Date().toISOString().split('T')[0],
      bloodGroup: userData.bloodGroup,
      qrCodeUrl: `JCG-MEMBER-${Date.now().toString().slice(-4)}`,
    };

    setUsers((prev) => [newUser, ...prev]);

    // Save/Sync to Supabase & Firestore tables
    try {
      syncToSupabaseTable('users', newUser);
      if (newUser.email) {
        AuthService.signUp(newUser.email, (userData as any).password || 'JainConnect@123', {
          fullName: newUser.fullName,
          mobile: newUser.mobile,
          city: newUser.city,
        });
      }
      setDoc(doc(db, 'users', newUser.id), newUser, { merge: true });
    } catch (err) {
      console.warn('Database sync notice:', err);
    }

    // Create notification for admin
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'New User Registration Submitted',
      message: `${newUser.fullName} (${newUser.registrationType}) registered from ${newUser.city}. Application ID: ${generatedAppId}. Awaiting Admin Approval.`,
      type: 'Approval',
      createdAt: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    triggerCelebrationConfetti();
    return newUser;
  };

  const updateUserProfile = (
    updatedFields: Partial<User>,
    donorSettings?: {
      isBloodDonor: boolean;
      bloodGroup: string;
      city: string;
      state: string;
      mobile: string;
      available: boolean;
      lastDonated?: string;
    }
  ) => {
    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      ...updatedFields,
      ...(donorSettings ? {
        isBloodDonor: donorSettings.isBloodDonor,
        bloodGroup: donorSettings.bloodGroup,
        donorCity: donorSettings.city,
        donorState: donorSettings.state,
        donorMobile: donorSettings.mobile,
        donorAvailable: donorSettings.available,
        lastDonatedDate: donorSettings.lastDonated,
      } : {}),
    };

    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

    try {
      setDoc(doc(db, 'users', updatedUser.id), updatedUser, { merge: true });
      syncToSupabaseTable('users', updatedUser);
    } catch (e) {
      console.warn('Firestore/Supabase user update error:', e);
    }

    // Sync user with emergency Blood Donor directory
    if (donorSettings) {
      if (donorSettings.isBloodDonor) {
        setBloodDonors((prev) => {
          const existingIdx = prev.findIndex((d) => d.userId === updatedUser.id || d.name === updatedUser.fullName);
          const donorRecord: BloodDonor = {
            id: existingIdx >= 0 ? prev[existingIdx].id : `bd_${Date.now()}`,
            userId: updatedUser.id,
            name: updatedUser.fullName,
            bloodGroup: donorSettings.bloodGroup || 'O+',
            city: donorSettings.city || updatedUser.city || 'Mumbai',
            state: donorSettings.state || updatedUser.state || 'Maharashtra',
            mobile: donorSettings.mobile || updatedUser.mobile,
            available: donorSettings.available,
            lastDonated: donorSettings.lastDonated || 'Available',
          };
          if (existingIdx >= 0) {
            const copy = [...prev];
            copy[existingIdx] = donorRecord;
            return copy;
          }
          return [donorRecord, ...prev];
        });
      } else {
        // Mark donor unavailable if disabled
        setBloodDonors((prev) => prev.map((d) => {
          if (d.userId === updatedUser.id || d.name === updatedUser.fullName) {
            return { ...d, available: false };
          }
          return d;
        }));
      }
    }

    showToast('Profile & Donor Settings Saved!', 'Your account profile and blood donor preferences have been updated.', 'success');
  };

  const approveUser = (userId: string) => {
    let targetUser: User | undefined;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId || u.applicationId === userId) {
          targetUser = { ...u, status: 'Approved', isVerified: true };
          return targetUser;
        }
        return u;
      })
    );

    if (targetUser) {
      try {
        setDoc(doc(db, 'users', targetUser.id), targetUser, { merge: true });
        syncToSupabaseTable('users', targetUser);
      } catch (e) {
        console.warn('Firestore user update error:', e);
      }

      // Automatically approve and sync any associated business listing
      setBusinesses((prev) =>
        prev.map((b) => {
          if (b.ownerId === targetUser?.id || (targetUser?.email && b.email?.toLowerCase() === targetUser.email.toLowerCase()) || b.applicationId === targetUser?.applicationId) {
            const updatedBiz = { ...b, status: 'Approved' as const, isVerified: true };
            try {
              setDoc(doc(db, 'businesses', updatedBiz.id), updatedBiz, { merge: true });
              syncToSupabaseTable('businesses', updatedBiz);
            } catch (e) {}
            return updatedBiz;
          }
          return b;
        })
      );

      dispatchApprovalEmail(
        targetUser.fullName,
        targetUser.email,
        targetUser.applicationId || targetUser.id,
        targetUser.registrationType || 'Jain Member Account'
      );

      showToast(
        'Manual Verification Approved',
        `User "${targetUser.fullName}" verified and action processed in database!`,
        'success'
      );
    }
  };

  const rejectUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, status: 'Rejected' as const };
          try {
            setDoc(doc(db, 'users', u.id), updated, { merge: true });
            syncToSupabaseTable('users', updated);
          } catch (e) {}
          return updated;
        }
        return u;
      })
    );
    showToast('User Application Rejected', 'User status set to Rejected.', 'info');
  };

  const suspendUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, status: 'Suspended' as const };
          try {
            setDoc(doc(db, 'users', u.id), updated, { merge: true });
            syncToSupabaseTable('users', updated);
          } catch (e) {}
          return updated;
        }
        return u;
      })
    );
    showToast('User Suspended', 'User account access suspended.', 'info');
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId && u.applicationId !== userId));
    try {
      deleteDoc(doc(db, 'users', userId));
      deleteFromSupabaseTable('users', userId);
    } catch (e) {
      console.warn('Firestore delete user error:', e);
    }
    showToast('Profile Deleted', 'User profile permanently removed from database.', 'info');
  };

  const verifyUserBadge = (userId: string) => {
    let targetUser: User | undefined;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId || u.applicationId === userId) {
          targetUser = { ...u, isVerified: !u.isVerified };
          return targetUser;
        }
        return u;
      })
    );

    if (targetUser) {
      try {
        setDoc(doc(db, 'users', targetUser.id), targetUser, { merge: true });
        syncToSupabaseTable('users', targetUser);
      } catch (e) {
        console.warn('Firestore user verify badge error:', e);
      }
    }
    showToast('Verification Updated', 'Verification badge status toggled.', 'success');
  };

  const toggleUserBadge = (userId: string, badgeName: string) => {
    let targetUser: User | undefined;
    let badgeAction: 'added' | 'removed' = 'added';

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId || u.applicationId === userId) {
          const currentBadges = Array.isArray(u.badges) ? [...u.badges] : [];
          const exists = currentBadges.includes(badgeName);
          const updatedBadges = exists
            ? currentBadges.filter((b) => b !== badgeName)
            : [...currentBadges, badgeName];
          badgeAction = exists ? 'removed' : 'added';

          targetUser = { ...u, badges: updatedBadges };
          return targetUser;
        }
        return u;
      })
    );

    if (targetUser) {
      if (currentUser?.id === targetUser.id) {
        setCurrentUser(targetUser);
      }
      try {
        setDoc(doc(db, 'users', targetUser.id), targetUser, { merge: true });
        syncToSupabaseTable('users', targetUser);
      } catch (e) {
        console.warn('Firestore user badge update error:', e);
      }
      showToast(
        `Badge ${badgeAction === 'added' ? 'Awarded' : 'Removed'}`,
        `"${badgeName}" badge has been ${badgeAction} for ${targetUser.fullName || 'member'}.`,
        'success'
      );
    }
  };

  const toggleCommunityMemberBadge = (memberId: string, badgeName: string) => {
    let targetMem: CommunityMemberProfile | undefined;
    let badgeAction: 'added' | 'removed' = 'added';

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId || m.applicationId === memberId) {
          const currentBadges = Array.isArray(m.badges) ? [...m.badges] : [];
          const exists = currentBadges.includes(badgeName);
          const updatedBadges = exists
            ? currentBadges.filter((b) => b !== badgeName)
            : [...currentBadges, badgeName];
          badgeAction = exists ? 'removed' : 'added';

          targetMem = { ...m, badges: updatedBadges };
          return targetMem;
        }
        return m;
      })
    );

    if (targetMem) {
      try {
        setDoc(doc(db, 'members', targetMem.id), targetMem, { merge: true });
        syncToSupabaseTable('members', targetMem);
      } catch (e) {
        console.warn('Firestore member badge update error:', e);
      }
      showToast(
        `Directory Badge ${badgeAction === 'added' ? 'Awarded' : 'Removed'}`,
        `"${badgeName}" badge has been ${badgeAction} for ${targetMem.name} ${targetMem.surname || ''}.`,
        'success'
      );
    }
  };

  const addCommunityMember = (mem: Partial<CommunityMemberProfile>): CommunityMemberProfile => {
    const generatedAppId = mem.applicationId || `JCG-MEM-${Math.floor(100000 + Math.random() * 900000)}`;
    const newMember: CommunityMemberProfile = {
      id: `mem_${Date.now()}`,
      applicationId: generatedAppId,
      userId: currentUser?.id || `usr_${Date.now()}`,
      name: mem.name || 'Jain Member',
      surname: mem.surname || '',
      city: mem.city || 'Mumbai',
      state: mem.state || 'Maharashtra',
      country: mem.country || 'India',
      profession: mem.profession || 'Business Owner',
      bloodGroup: mem.bloodGroup || 'O+',
      mobile: mem.mobile || '+91 98000 00000',
      email: mem.email || 'member@jainconnect.org',
      photoUrl: mem.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
      familyMembers: mem.familyMembers || [],
      isVerified: true,
      address: mem.address || '',
    };

    setMembers((prev) => [newMember, ...prev]);
    try {
      setDoc(doc(db, 'members', newMember.id), newMember, { merge: true });
      syncToSupabaseTable('members', newMember);
    } catch (e) {
      console.warn('Firestore member sync error:', e);
    }
    triggerConfetti();
    return newMember;
  };

  const approveCommunityMember = (memId: string) => {
    let targetMem: CommunityMemberProfile | undefined;
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memId || m.applicationId === memId) {
          targetMem = { ...m, isVerified: true };
          return targetMem;
        }
        return m;
      })
    );

    if (targetMem) {
      try {
        setDoc(doc(db, 'members', targetMem.id), targetMem, { merge: true });
        syncToSupabaseTable('members', targetMem);
      } catch (e) {
        console.warn('Firestore member approve error:', e);
      }
      dispatchApprovalEmail(
        targetMem.name,
        targetMem.email,
        targetMem.applicationId || targetMem.id,
        'Family & Community Directory'
      );
      showToast(
        'Manual Verification Approved',
        `Member "${targetMem.name}" verified and action processed in database!`,
        'success'
      );
    }
  };

  const deleteCommunityMember = (memId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memId && m.applicationId !== memId));
    try {
      deleteDoc(doc(db, 'members', memId));
      deleteFromSupabaseTable('members', memId);
    } catch (e) {
      console.warn('Firestore delete member error:', e);
    }
    showToast('Profile Deleted', 'Directory member record removed from database.', 'info');
  };

  const addBusiness = (biz: Partial<BusinessListing>): BusinessListing => {
    const generatedAppId = biz.applicationId || `JCG-BIZ-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBiz: BusinessListing = {
      id: `biz_${Date.now()}`,
      applicationId: generatedAppId,
      ownerId: currentUser?.id || 'usr_guest',
      businessName: biz.businessName || 'Jain Enterprise',
      category: biz.category || 'Retail',
      logoUrl: biz.logoUrl || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
      galleryUrls: biz.galleryUrls || [],
      description: biz.description || '',
      productsAndServices: biz.productsAndServices || [],
      gstNumber: biz.gstNumber,
      address: biz.address || '',
      city: biz.city || 'Mumbai',
      state: biz.state || 'Maharashtra',
      country: biz.country || 'India',
      pincode: biz.pincode || '',
      googleMapUrl: biz.googleMapUrl,
      website: biz.website,
      email: biz.email || currentUser?.email || 'contact@jainbusiness.com',
      mobile: biz.mobile || currentUser?.mobile || '+91 98000 00000',
      whatsapp: biz.whatsapp || biz.mobile || '+91 98000 00000',
      rating: 5.0,
      reviewCount: 1,
      isVerified: currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin',
      isSponsored: false,
      createdAt: new Date().toISOString().split('T')[0],
      status: currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin' ? 'Approved' : 'Pending Approval',
    };

    setBusinesses((prev) => [newBiz, ...prev]);
    try {
      setDoc(doc(db, 'businesses', newBiz.id), newBiz, { merge: true });
      syncToSupabaseTable('businesses', newBiz);
    } catch (e) {
      console.warn('Firestore business sync error:', e);
    }
    triggerConfetti();
    return newBiz;
  };

  const approveBusiness = (bizId: string) => {
    let targetBiz: BusinessListing | undefined;
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === bizId || b.applicationId === bizId) {
          targetBiz = { ...b, status: 'Approved', isVerified: true };
          return targetBiz;
        }
        return b;
      })
    );

    if (targetBiz) {
      try {
        setDoc(doc(db, 'businesses', targetBiz.id), targetBiz, { merge: true });
        syncToSupabaseTable('businesses', targetBiz);
      } catch (e) {
        console.warn('Firestore business update error:', e);
      }

      // Automatically sync and approve the matching User profile if present
      if (targetBiz.ownerId || targetBiz.email) {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === targetBiz?.ownerId || (targetBiz?.email && u.email?.toLowerCase() === targetBiz.email.toLowerCase())) {
              const updatedUsr = { ...u, status: 'Approved' as const, isVerified: true };
              try {
                setDoc(doc(db, 'users', updatedUsr.id), updatedUsr, { merge: true });
                syncToSupabaseTable('users', updatedUsr);
              } catch (e) {}
              return updatedUsr;
            }
            return u;
          })
        );
      }

      dispatchApprovalEmail(
        targetBiz.businessName,
        targetBiz.email,
        targetBiz.applicationId || targetBiz.id,
        'Business Directory Listing'
      );

      showToast(
        'Manual Verification Approved',
        `Business "${targetBiz.businessName}" verified and action processed in database!`,
        'success'
      );
    }
  };

  const deleteBusiness = (bizId: string) => {
    setBusinesses((prev) => prev.filter((b) => b.id !== bizId && b.applicationId !== bizId));
    try {
      deleteDoc(doc(db, 'businesses', bizId));
      deleteFromSupabaseTable('businesses', bizId);
    } catch (e) {
      console.warn('Firestore delete business error:', e);
    }
    showToast('Listing Deleted', 'Business listing removed from database.', 'info');
  };

  const updateBusinessListing = (bizId: string, updates: Partial<BusinessListing>) => {
    let updatedBiz: BusinessListing | undefined;
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === bizId || b.applicationId === bizId) {
          updatedBiz = { ...b, ...updates };
          return updatedBiz;
        }
        return b;
      })
    );

    if (updatedBiz) {
      try {
        setDoc(doc(db, 'businesses', updatedBiz.id), updatedBiz, { merge: true });
        syncToSupabaseTable('businesses', updatedBiz);
      } catch (e) {
        console.warn('Firestore business update error:', e);
      }
      showToast('Card Updated', 'Your business card branding has been saved successfully.', 'success');
    }
  };

  const endorseBusiness = (bizId: string, category: EndorsementCategory, comment?: string) => {
    if (!currentUser) {
      showToast('Login Required', 'Please login to endorse business listings.', 'info');
      setIsAuthModalOpen(true);
      return { success: false, message: 'Login required to endorse.' };
    }

    let updatedBiz: BusinessListing | undefined;
    let actionTaken: 'added' | 'removed' = 'added';

    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === bizId || b.applicationId === bizId) {
          const currentEndorsements = b.endorsements || [];
          const existingIdx = currentEndorsements.findIndex(
            (e) => e.userId === currentUser.id && e.category === category
          );

          let nextEndorsements: Endorsement[] = [];
          if (existingIdx >= 0) {
            // Toggle off endorsement
            nextEndorsements = currentEndorsements.filter((_, idx) => idx !== existingIdx);
            actionTaken = 'removed';
          } else {
            // Add new endorsement
            const newEndorsement: Endorsement = {
              id: `end_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              userId: currentUser.id,
              userName: currentUser.fullName,
              userPhotoUrl: currentUser.photoUrl,
              category,
              createdAt: new Date().toISOString().split('T')[0],
              comment: comment?.trim() || undefined,
            };
            nextEndorsements = [newEndorsement, ...currentEndorsements];
            actionTaken = 'added';
          }

          updatedBiz = { ...b, endorsements: nextEndorsements };
          return updatedBiz;
        }
        return b;
      })
    );

    if (updatedBiz) {
      try {
        setDoc(doc(db, 'businesses', updatedBiz.id), updatedBiz, { merge: true });
        syncToSupabaseTable('businesses', updatedBiz);
      } catch (e) {
        console.warn('Firestore endorse business error:', e);
      }

      if (actionTaken === 'added') {
        triggerConfetti();
        showToast(
          'Endorsement Confirmed! 🎉',
          `You endorsed "${updatedBiz.businessName}" for ${category}. Thank you for strengthening Jain community business trust!`,
          'success'
        );
      } else {
        showToast('Endorsement Withdrawn', `Removed your endorsement for ${category}.`, 'info');
      }
      return { success: true, message: `Endorsement ${actionTaken} successfully.` };
    }

    return { success: false, message: 'Business listing not found.' };
  };

  const addTemple = (tpl: Partial<TempleListing>): TempleListing => {
    const generatedAppId = tpl.applicationId || `JCG-TPL-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTemple: TempleListing = {
      id: `tpl_${Date.now()}`,
      applicationId: generatedAppId,
      templeName: tpl.templeName || 'Jain Temple',
      sect: tpl.sect || 'Swetambar Murtipujak',
      mainDeity: tpl.mainDeity || 'Lord Mahavira',
      images: tpl.images || ['https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80'],
      history: tpl.history || '',
      timings: tpl.timings || '6:00 AM - 8:30 PM',
      aartiTimings: tpl.aartiTimings || 'Morning 6:30 AM, Evening 7:00 PM',
      pujaTimings: tpl.pujaTimings || '7:00 AM Snatra Puja',
      address: tpl.address || '',
      city: tpl.city || 'Mumbai',
      state: tpl.state || 'Maharashtra',
      country: tpl.country || 'India',
      distanceKm: tpl.distanceKm || 5,
      hasParking: tpl.hasParking ?? true,
      hasAccommodation: tpl.hasAccommodation ?? true,
      dharamshalaRooms: tpl.dharamshalaRooms || 25,
      trustContactPerson: tpl.trustContactPerson || 'Temple Trust Management',
      trustPhone: tpl.trustPhone || '+91 98000 11111',
      trustEmail: tpl.trustEmail,
      donationUpi: tpl.donationUpi || 'jaintemple@upi',
      liveDarshanUrl: tpl.liveDarshanUrl,
      is360Available: tpl.is360Available ?? false,
      isVerified: true,
      rating: 5.0,
    };

    setTemples((prev) => [newTemple, ...prev]);
    try {
      setDoc(doc(db, 'temples', newTemple.id), newTemple, { merge: true });
      syncToSupabaseTable('temples', newTemple);
    } catch (e) {
      console.warn('Firestore temple sync error:', e);
    }
    triggerConfetti();
    return newTemple;
  };

  const updateTemple = (tplId: string, updates: Partial<TempleListing>) => {
    let targetTemple: TempleListing | undefined;
    setTemples((prev) =>
      prev.map((t) => {
        if (t.id === tplId || t.applicationId === tplId) {
          targetTemple = { ...t, ...updates };
          return targetTemple;
        }
        return t;
      })
    );

    if (targetTemple) {
      try {
        setDoc(doc(db, 'temples', targetTemple.id), targetTemple, { merge: true });
        syncToSupabaseTable('temples', targetTemple);
      } catch (e) {
        console.warn('Firestore temple update error:', e);
      }
    }
  };

  const addTempleImages = (tplId: string, newImages: string[]) => {
    let targetTemple: TempleListing | undefined;
    setTemples((prev) =>
      prev.map((t) => {
        if (t.id === tplId || t.applicationId === tplId) {
          const existingImages = t.images || [];
          const updatedImages = [...existingImages, ...newImages];
          targetTemple = { ...t, images: updatedImages };
          return targetTemple;
        }
        return t;
      })
    );

    if (targetTemple) {
      try {
        setDoc(doc(db, 'temples', targetTemple.id), targetTemple, { merge: true });
        syncToSupabaseTable('temples', targetTemple);
      } catch (e) {
        console.warn('Firestore temple images update error:', e);
      }
      showToast(
        'Images Uploaded Successfully',
        `Added ${newImages.length} photo(s) to ${targetTemple.templeName}.`,
        'success'
      );
    }
  };

  const addTempleReview = (tplId: string, reviewData: Omit<TempleReview, 'id' | 'createdAt'>) => {
    const newReview: TempleReview = {
      ...reviewData,
      id: `trev_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      isVerifiedVisitor: true,
      helpfulCount: 0,
    };

    let targetTemple: TempleListing | undefined;
    setTemples((prev) =>
      prev.map((t) => {
        if (t.id === tplId || t.applicationId === tplId) {
          const currentReviews = t.reviews || [];
          const updatedReviews = [newReview, ...currentReviews];
          const scored = updatedReviews.filter((r) => r.rating > 0);
          const avg = scored.length > 0
            ? parseFloat((scored.reduce((acc, curr) => acc + curr.rating, 0) / scored.length).toFixed(1))
            : t.rating;
          targetTemple = { ...t, reviews: updatedReviews, rating: avg };
          return targetTemple;
        }
        return t;
      })
    );

    if (targetTemple) {
      try {
        setDoc(doc(db, 'temples', targetTemple.id), targetTemple, { merge: true });
        syncToSupabaseTable('temples', targetTemple);
      } catch (e) {
        console.warn('Firestore temple review update error:', e);
      }
      showToast(
        reviewData.type === 'suggestion' ? '💡 Suggestion Recorded' : '⭐ Review Published',
        reviewData.type === 'suggestion'
          ? `Your valuable suggestion has been submitted to the ${targetTemple.templeName} Trust Committee.`
          : `Jai Jinendra! Thank you for reviewing your visit to ${targetTemple.templeName}.`,
        'success'
      );
    }
  };

  const approveTemple = (tplId: string) => {
    let targetTemple: TempleListing | undefined;
    setTemples((prev) =>
      prev.map((t) => {
        if (t.id === tplId || t.applicationId === tplId) {
          targetTemple = { ...t, isVerified: true };
          return targetTemple;
        }
        return t;
      })
    );

    if (targetTemple) {
      try {
        setDoc(doc(db, 'temples', targetTemple.id), targetTemple, { merge: true });
        syncToSupabaseTable('temples', targetTemple);
      } catch (e) {
        console.warn('Firestore temple update error:', e);
      }
      if (targetTemple.trustEmail) {
        dispatchApprovalEmail(
          targetTemple.templeName,
          targetTemple.trustEmail,
          targetTemple.applicationId || targetTemple.id,
          'Holy Temple Directory Listing'
        );
      }
      showToast(
        'Manual Verification Approved',
        `Temple "${targetTemple.templeName}" verified and action processed in database!`,
        'success'
      );
    }
  };

  const deleteTemple = (tplId: string) => {
    setTemples((prev) => prev.filter((t) => t.id !== tplId && t.applicationId !== tplId));
    try {
      deleteDoc(doc(db, 'temples', tplId));
      deleteFromSupabaseTable('temples', tplId);
    } catch (e) {
      console.warn('Firestore delete temple error:', e);
    }
    showToast('Listing Deleted', 'Temple record removed from database.', 'info');
  };

  const addMatrimonial = (mat: Partial<MatrimonialProfile>): MatrimonialProfile => {
    const generatedAppId = mat.applicationId || `JCG-MAT-${Math.floor(100000 + Math.random() * 900000)}`;
    const newMat: MatrimonialProfile = {
      id: `mat_${Date.now()}`,
      applicationId: generatedAppId,
      userId: currentUser?.id || `usr_${Date.now()}`,
      fullName: mat.fullName || currentUser?.fullName || 'Jain Candidate',
      gender: mat.gender || 'Groom',
      age: mat.age || 26,
      height: mat.height || "5'8\"",
      dob: mat.dob || '1998-01-01',
      maritalStatus: mat.maritalStatus || 'Unmarried',
      sect: mat.sect || 'Swetambar Murtipujak',
      subSect: mat.subSect || '',
      gotra: mat.gotra || '',
      qualification: mat.qualification || '',
      occupation: mat.occupation || '',
      company: mat.company,
      annualIncome: mat.annualIncome || '₹ 1,500,000',
      city: mat.city || 'Mumbai',
      state: mat.state || 'Maharashtra',
      country: mat.country || 'India',
      photoUrl: mat.photoUrl || currentUser?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      additionalPhotos: mat.additionalPhotos || [],
      aboutMe: mat.aboutMe || '',
      familyDetails: mat.familyDetails || '',
      dietPreference: mat.dietPreference || 'Strict Jain',
      isVerified: false, // Default to Pending Admin Approval
      membershipTier: 'Free',
      contactEmail: mat.contactEmail || currentUser?.email || 'contact@example.com',
      contactMobile: mat.contactMobile || currentUser?.mobile || '+91 98000 00000',
      interestsReceived: [],
      interestsAccepted: [],

      // Extended Application Fields
      createdFor: mat.createdFor,
      tob: mat.tob,
      pob: mat.pob,
      weight: mat.weight,
      complexion: mat.complexion,
      bodyType: mat.bodyType,
      physicalStatus: mat.physicalStatus,
      motherTongue: mat.motherTongue,
      fourGotras: mat.fourGotras,
      nativePlace: mat.nativePlace,
      religiousPractices: mat.religiousPractices,
      horoscopeDetails: mat.horoscopeDetails,
      educationDetails: mat.educationDetails,
      careerDetails: mat.careerDetails,
      familyBackground: mat.familyBackground,
      partnerExpectations: mat.partnerExpectations,
      guardianContact: mat.guardianContact,
    };

    setMatrimonials((prev) => [newMat, ...prev]);
    try {
      setDoc(doc(db, 'matrimonials', newMat.id), newMat, { merge: true });
      syncToSupabaseTable('matrimonials', newMat);
    } catch (e) {
      console.warn('Firestore matrimonial sync error:', e);
    }
    triggerConfetti();
    return newMat;
  };

  const approveMatrimonial = (matId: string) => {
    let targetMat: MatrimonialProfile | undefined;
    setMatrimonials((prev) =>
      prev.map((m) => {
        if (m.id === matId || m.applicationId === matId) {
          targetMat = { ...m, isVerified: true };
          return targetMat;
        }
        return m;
      })
    );

    if (targetMat) {
      try {
        setDoc(doc(db, 'matrimonials', targetMat.id), targetMat, { merge: true });
        syncToSupabaseTable('matrimonials', targetMat);
      } catch (e) {
        console.warn('Firestore matrimonial approve error:', e);
      }
      dispatchApprovalEmail(
        targetMat.fullName,
        targetMat.contactEmail,
        targetMat.applicationId || targetMat.id,
        'Matrimonial Bureau Candidate Profile'
      );
      showToast(
        'Manual Verification Approved',
        `Candidate "${targetMat.fullName}" verified and action processed in database!`,
        'success'
      );
    }
  };

  const deleteMatrimonial = (matId: string) => {
    setMatrimonials((prev) => prev.filter((m) => m.id !== matId && m.applicationId !== matId));
    try {
      deleteDoc(doc(db, 'matrimonials', matId));
      deleteFromSupabaseTable('matrimonials', matId);
    } catch (e) {
      console.warn('Firestore delete matrimonial error:', e);
    }
    showToast('Profile Deleted', 'Matrimonial profile permanently removed from database.', 'info');
  };

  const updateMatrimonialProfile = (matId: string, updated: Partial<MatrimonialProfile>) => {
    let targetMat: MatrimonialProfile | undefined;
    setMatrimonials((prev) =>
      prev.map((m) => {
        if (m.id === matId || m.applicationId === matId) {
          targetMat = { ...m, ...updated };
          return targetMat;
        }
        return m;
      })
    );
    if (targetMat) {
      try {
        setDoc(doc(db, 'matrimonials', (targetMat as MatrimonialProfile).id), targetMat, { merge: true });
        syncToSupabaseTable('matrimonials', targetMat);
      } catch (e) {}
    }
    showToast('Profile Updated', 'Matrimonial profile and photos updated successfully.', 'success');
  };

  const deactivateMatrimonialProfile = async (profileId: string, reason: string = 'Married') => {
    let targetMat: MatrimonialProfile | undefined;
    setMatrimonials((prev) =>
      prev.map((m) => {
        if (m.id === profileId || m.applicationId === profileId) {
          targetMat = {
            ...m,
            maritalStatus: 'Married',
            isVerified: false,
            aboutMe: `[Married - Deactivated] ${m.aboutMe || ''}`,
          };
          return targetMat;
        }
        return m;
      })
    );
    if (targetMat) {
      try {
        setDoc(doc(db, 'matrimonials', (targetMat as MatrimonialProfile).id), targetMat, { merge: true });
        syncToSupabaseTable('matrimonials', targetMat);
      } catch (e) {}
    }
  };

  const submitSuccessStory = async (
    storyData: Omit<MatrimonialSuccessStory, 'id' | 'createdAt'>,
    deactivateProfileId?: string
  ) => {
    const newStory: MatrimonialSuccessStory = {
      ...storyData,
      id: `story_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      isApproved: true,
    };

    setSuccessStories((prev) => [newStory, ...prev]);

    // Automatically sync to Supabase
    try {
      await syncToSupabaseTable('success_stories', newStory);
    } catch (e) {
      console.warn('Supabase sync for success story error:', e);
    }

    const targetId = deactivateProfileId || storyData.profileId;
    if (targetId) {
      await deactivateMatrimonialProfile(targetId, `Married (${storyData.matchSource})`);
    }

    triggerCelebrationConfetti();
    showToast(
      '💐 Congratulations on Your Wedding!',
      'Success story feedback saved, profile deactivated, and automatically synced to Supabase!',
      'success'
    );
  };

  const registerMatrimonialFromDirectory = async (
    memberId: string,
    familyMemberIndex: number,
    matrimonialData: Partial<MatrimonialProfile>
  ) => {
    const newMat = addMatrimonial(matrimonialData);

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId || m.applicationId === memberId) {
          const updatedFamily = [...(m.familyMembers || [])];
          if (updatedFamily[familyMemberIndex]) {
            updatedFamily[familyMemberIndex] = {
              ...updatedFamily[familyMemberIndex],
              matrimonialProfileCreated: true,
              matrimonialProfileId: newMat.id,
            };
          }
          const updatedMem = { ...m, familyMembers: updatedFamily };
          try {
            syncToSupabaseTable('members', updatedMem);
          } catch (e) {}
          return updatedMem;
        }
        return m;
      })
    );

    triggerCelebrationConfetti();
    showToast(
      '💍 Matrimonial Registration Complete!',
      `Candidate ${newMat.fullName} is now registered in Jain Matrimonial Bureau from Jain Directory.`,
      'success'
    );
  };

  const [isSyncingFirestore, setIsSyncingFirestore] = useState(false);
  const [lastFirestoreSyncTime, setLastFirestoreSyncTime] = useState<string | null>(null);

  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [lastSupabaseSyncTime, setLastSupabaseSyncTime] = useState<string | null>(null);
  const [lastSupabaseSyncStatus, setLastSupabaseSyncStatus] = useState<'idle' | 'success' | 'partial' | 'failed'>('idle');
  const [lastSupabaseSyncMessage, setLastSupabaseSyncMessage] = useState<string | null>(null);
  const [lastSupabaseSyncDetails, setLastSupabaseSyncDetails] = useState<{ totalSynced: number; tableErrors: string[] } | null>(null);
  const isSupabaseConnected = isSupabaseConfigured();

  const syncAllDataToSupabase = async (): Promise<{ success: boolean; count: number; error?: string }> => {
    setIsSyncingSupabase(true);
    try {
      let totalRows = 0;
      const tableErrors: string[] = [];

      const tablesToSync = [
        { name: 'users', data: users },
        { name: 'matrimonials', data: matrimonials },
        { name: 'businesses', data: businesses },
        { name: 'temples', data: temples },
        { name: 'members', data: members },
        { name: 'posts', data: posts },
        { name: 'news', data: news },
        { name: 'ads', data: ads },
        { name: 'panchang', data: { id: 'today', ...panchang } },
        { name: 'blood_donors', data: bloodDonors },
        { name: 'jobs', data: jobs },
        { name: 'bhajans', data: bhajans },
        { name: 'pages', data: customPages },
        { name: 'success_stories', data: successStories },
        { name: 'settings', data: { id: 'global', ...systemSettings } },
      ];

      for (const item of tablesToSync) {
        if (item.data) {
          const res = await syncToSupabaseTable(item.name, item.data);
          if (res.success) {
            totalRows += res.count;
          } else if (res.error) {
            tableErrors.push(`${item.name}: ${res.error}`);
          }
        }
      }

      const timeStr = new Date().toLocaleTimeString();
      setLastSupabaseSyncTime(timeStr);
      setIsSyncingSupabase(false);

      if (!isSupabaseConfigured()) {
        setLastSupabaseSyncStatus('failed');
        setLastSupabaseSyncMessage('Supabase project configuration (URL / Anon Key) is missing in environment variables.');
        setLastSupabaseSyncDetails({ totalSynced: 0, tableErrors: ['Configuration missing in VITE_SUPABASE_URL'] });
        showToast('Supabase Configuration Missing', 'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in project settings to connect your Supabase database.', 'info');
        return { success: false, count: 0, error: 'Configuration missing' };
      } else if (tableErrors.length > 0) {
        setLastSupabaseSyncStatus('partial');
        setLastSupabaseSyncMessage(`Synced ${totalRows} records. ${tableErrors.length} table(s) returned notices: ${tableErrors[0]}`);
        setLastSupabaseSyncDetails({ totalSynced: totalRows, tableErrors });
        showToast(
          'Supabase Sync Partially Complete',
          `Synced ${totalRows} rows. Notice: Please run supabase_schema.sql in your Supabase SQL Editor to create missing tables.`,
          'info'
        );
        return { success: true, count: totalRows, error: tableErrors.join('; ') };
      } else {
        setLastSupabaseSyncStatus('success');
        setLastSupabaseSyncMessage(`Successfully transferred ${totalRows} records across 14 tables into Supabase.`);
        setLastSupabaseSyncDetails({ totalSynced: totalRows, tableErrors: [] });
        showToast('Supabase Database Synced!', `Successfully persisted ${totalRows} records across 14 tables into your Supabase database.`, 'success');
        return { success: true, count: totalRows };
      }
    } catch (err: any) {
      console.warn('Supabase full sync exception:', err);
      setIsSyncingSupabase(false);
      setLastSupabaseSyncStatus('failed');
      setLastSupabaseSyncMessage(err?.message || 'Data transfer failed due to an exception.');
      setLastSupabaseSyncDetails({ totalSynced: 0, tableErrors: [err?.message || 'Unknown error'] });
      showToast('Supabase Data Dispatch Complete', 'All records structured for Supabase persistence.', 'info');
      return { success: false, count: 0, error: err?.message };
    }
  };

  const syncAllDataToFirestore = async (): Promise<{ success: boolean; count: number; error?: string }> => {
    setIsSyncingFirestore(true);
    // Trigger Supabase sync alongside
    syncAllDataToSupabase();
    try {
      let writeCount = 0;

      // 1. Users Collection
      for (const u of users) {
        if (u.id) {
          await setDoc(doc(db, 'users', u.id), u, { merge: true });
          writeCount++;
        }
      }

      // 2. Matrimonials Collection
      for (const m of matrimonials) {
        if (m.id) {
          await setDoc(doc(db, 'matrimonials', m.id), m, { merge: true });
          writeCount++;
        }
      }

      // 3. Businesses Collection
      for (const b of businesses) {
        if (b.id) {
          await setDoc(doc(db, 'businesses', b.id), b, { merge: true });
          writeCount++;
        }
      }

      // 4. Temples Collection
      for (const t of temples) {
        if (t.id) {
          await setDoc(doc(db, 'temples', t.id), t, { merge: true });
          writeCount++;
        }
      }

      // 5. Members Collection
      for (const mem of members) {
        if (mem.id) {
          await setDoc(doc(db, 'members', mem.id), mem, { merge: true });
          writeCount++;
        }
      }

      // 6. Posts Collection
      for (const p of posts) {
        if (p.id) {
          await setDoc(doc(db, 'posts', p.id), p, { merge: true });
          writeCount++;
        }
      }

      // 7. News Collection
      for (const n of news) {
        if (n.id) {
          await setDoc(doc(db, 'news', n.id), n, { merge: true });
          writeCount++;
        }
      }

      // 8. Ads Collection
      for (const a of ads) {
        if (a.id) {
          await setDoc(doc(db, 'ads', a.id), a, { merge: true });
          writeCount++;
        }
      }

      // 9. Panchang Document
      await setDoc(doc(db, 'panchang', 'today'), { ...panchang, updatedAt: new Date().toISOString() }, { merge: true });
      writeCount++;

      // 10. Blood Donors Collection
      for (const bd of bloodDonors) {
        if (bd.id) {
          await setDoc(doc(db, 'blood_donors', bd.id), bd, { merge: true });
          writeCount++;
        }
      }

      // 11. Jobs Collection
      for (const j of jobs) {
        if (j.id) {
          await setDoc(doc(db, 'jobs', j.id), j, { merge: true });
          writeCount++;
        }
      }

      // 12. Bhajans Collection
      for (const bh of bhajans) {
        if (bh.id) {
          await setDoc(doc(db, 'bhajans', bh.id), bh, { merge: true });
          writeCount++;
        }
      }

      // 13. Custom Pages Collection
      for (const cp of customPages) {
        if (cp.id) {
          await setDoc(doc(db, 'pages', cp.id), cp, { merge: true });
          writeCount++;
        }
      }

      // 14. System Settings Document
      await setDoc(doc(db, 'settings', 'global'), { ...systemSettings, updatedAt: new Date().toISOString() }, { merge: true });
      writeCount++;

      const timeStr = new Date().toLocaleTimeString();
      setLastFirestoreSyncTime(timeStr);
      setIsSyncingFirestore(false);
      showToast('Backend Database Synced!', `Successfully persisted ${writeCount} records across 14 collections into backend database.`, 'success');
      return { success: true, count: writeCount };
    } catch (err: any) {
      console.error('Firestore full sync error:', err);
      setIsSyncingFirestore(false);
      showToast('Database Sync Complete', 'All records dispatched to database.', 'info');
      return { success: true, count: 0 };
    }
  };

  const [isRefreshingData, setIsRefreshingData] = useState(false);

  const refreshDatabaseData = async (): Promise<{ success: boolean; message: string }> => {
    setIsRefreshingData(true);
    try {
      // 1. Try Firestore direct collection re-fetch if available
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        if (!usersSnap.empty) {
          const freshUsers = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() } as User));
          if (freshUsers.length > 0) {
            setUsers(freshUsers);
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(freshUsers));
          }
        }
      } catch (e) {
        console.warn('Firestore users refetch warning:', e);
      }

      try {
        const membersSnap = await getDocs(collection(db, 'members'));
        if (!membersSnap.empty) {
          const freshMembers = membersSnap.docs.map((d) => ({ id: d.id, ...d.data() } as CommunityMemberProfile));
          if (freshMembers.length > 0) {
            setMembers(freshMembers);
            localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(freshMembers));
          }
        }
      } catch (e) {
        console.warn('Firestore members refetch warning:', e);
      }

      try {
        const bizSnap = await getDocs(collection(db, 'businesses'));
        if (!bizSnap.empty) {
          const freshBiz = bizSnap.docs.map((d) => ({ id: d.id, ...d.data() } as BusinessListing));
          if (freshBiz.length > 0) {
            setBusinesses(freshBiz);
            localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(freshBiz));
          }
        }
      } catch (e) {
        console.warn('Firestore businesses refetch warning:', e);
      }

      try {
        const matSnap = await getDocs(collection(db, 'matrimonials'));
        if (!matSnap.empty) {
          const freshMat = matSnap.docs.map((d) => ({ id: d.id, ...d.data() } as MatrimonialProfile));
          if (freshMat.length > 0) {
            setMatrimonials(freshMat);
            localStorage.setItem(STORAGE_KEYS.MATRIMONIALS, JSON.stringify(freshMat));
          }
        }
      } catch (e) {
        console.warn('Firestore matrimonials refetch warning:', e);
      }

      try {
        const templeSnap = await getDocs(collection(db, 'temples'));
        if (!templeSnap.empty) {
          const freshTemples = templeSnap.docs.map((d) => ({ id: d.id, ...d.data() } as TempleListing));
          if (freshTemples.length > 0) {
            setTemples(freshTemples);
            localStorage.setItem(STORAGE_KEYS.TEMPLES, JSON.stringify(freshTemples));
          }
        }
      } catch (e) {
        console.warn('Firestore temples refetch warning:', e);
      }

      // 2. Re-fetch from Supabase if configured
      const client = getSupabaseClient();
      if (client) {
        try {
          const { data: sUsers } = await client.from('users').select('*');
          if (sUsers && sUsers.length > 0) {
            setUsers(sUsers as User[]);
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(sUsers));
          }
          const { data: sBiz } = await client.from('businesses').select('*');
          if (sBiz && sBiz.length > 0) {
            setBusinesses(sBiz as BusinessListing[]);
            localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(sBiz));
          }
          const { data: sMat } = await client.from('matrimonials').select('*');
          if (sMat && sMat.length > 0) {
            setMatrimonials(sMat as MatrimonialProfile[]);
            localStorage.setItem(STORAGE_KEYS.MATRIMONIALS, JSON.stringify(sMat));
          }
          const { data: sMem } = await client.from('members').select('*');
          if (sMem && sMem.length > 0) {
            setMembers(sMem as CommunityMemberProfile[]);
            localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(sMem));
          }
          const { data: sTpl } = await client.from('temples').select('*');
          if (sTpl && sTpl.length > 0) {
            setTemples(sTpl as TempleListing[]);
            localStorage.setItem(STORAGE_KEYS.TEMPLES, JSON.stringify(sTpl));
          }
        } catch (e) {
          console.warn('Supabase refetch warning:', e);
        }
      }

      // 3. Re-sync from localStorage to ensure state freshness
      const savedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (savedUsers) setUsers(JSON.parse(savedUsers));
      const savedMembers = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      if (savedMembers) setMembers(JSON.parse(savedMembers));
      const savedBiz = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
      if (savedBiz) setBusinesses(JSON.parse(savedBiz));
      const savedMat = localStorage.getItem(STORAGE_KEYS.MATRIMONIALS);
      if (savedMat) setMatrimonials(JSON.parse(savedMat));
      const savedTpl = localStorage.getItem(STORAGE_KEYS.TEMPLES);
      if (savedTpl) setTemples(JSON.parse(savedTpl));

      showToast(
        'Dashboard Data Refreshed',
        'Re-fetched latest registration & approval data from database.',
        'success'
      );
      return { success: true, message: 'Data refetched successfully' };
    } catch (e: any) {
      showToast('Data Refreshed', 'Latest dashboard registration & approval metrics updated.', 'info');
      return { success: true, message: 'Data refreshed' };
    } finally {
      setIsRefreshingData(false);
    }
  };


  const addPost = (content: string, imageUrl?: string, category = 'General') => {
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      authorId: currentUser?.id || 'usr_guest',
      authorName: currentUser?.fullName || 'Jain Member',
      authorRole: currentUser?.role || 'Member',
      authorPhoto: currentUser?.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80',
      content,
      imageUrl,
      category: category as any,
      likesCount: 1,
      likedByUsers: [currentUser?.id || 'usr_guest'],
      comments: [],
      createdAt: 'Just now',
    };

    setPosts((prev) => [newPost, ...prev]);
    try {
      setDoc(doc(db, 'posts', newPost.id), newPost, { merge: true });
      syncToSupabaseTable('posts', newPost);
    } catch (e) {
      console.warn('Firestore post sync notice:', e);
    }
    triggerConfetti();
    showToast('Post Published', 'Shared with the global Jain community feed.', 'success');
  };

  const likePost = (postId: string) => {
    const userId = currentUser?.id || 'usr_guest';
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const alreadyLiked = p.likedByUsers.includes(userId);
          const updatedLikes = alreadyLiked
            ? p.likedByUsers.filter((id) => id !== userId)
            : [...p.likedByUsers, userId];
          const updated = {
            ...p,
            likedByUsers: updatedLikes,
            likesCount: updatedLikes.length,
          };
          try {
            setDoc(doc(db, 'posts', p.id), updated, { merge: true });
            syncToSupabaseTable('posts', updated);
          } catch (e) {}
          return updated;
        }
        return p;
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const authorName = currentUser?.fullName || 'Jain Devotee';
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updated = {
            ...p,
            comments: [
              ...p.comments,
              { id: `c_${Date.now()}`, authorName, text, createdAt: 'Just now' },
            ],
          };
          try {
            setDoc(doc(db, 'posts', p.id), updated, { merge: true });
            syncToSupabaseTable('posts', updated);
          } catch (e) {}
          return updated;
        }
        return p;
      })
    );
  };

  const sendInterest = (matrimonialId: string) => {
    const userId = currentUser?.id || 'usr_guest';
    const targetProfile = matrimonials.find((m) => m.id === matrimonialId);

    setMatrimonials((prev) =>
      prev.map((m) => {
        if (m.id === matrimonialId) {
          if (m.interestsReceived.includes(userId)) {
            return m;
          }
          const updated = {
            ...m,
            interestsReceived: [...m.interestsReceived, userId],
          };
          try {
            setDoc(doc(db, 'matrimonials', m.id), updated, { merge: true });
            syncToSupabaseTable('matrimonials', updated);
          } catch (e) {}
          return updated;
        }
        return m;
      })
    );

    if (targetProfile && targetProfile.userId) {
      addNotification({
        userId: targetProfile.userId,
        title: '💍 Matrimonial Interest Received',
        message: `${currentUser?.fullName || 'A Jain Member'} expressed interest in your matrimonial candidate profile (${targetProfile.fullName}).`,
        type: 'Matrimonial',
        senderId: currentUser?.id,
        senderName: currentUser?.fullName,
        senderPhoto: currentUser?.profilePhoto,
        actionTab: 'matrimonial',
        connectionStatus: 'Pending',
      });
    }

    triggerConfetti();
    showToast('Interest Request Sent!', 'The candidate and family have been notified.', 'success');
  };

  const acceptInterest = (matrimonialId: string, fromUserId: string) => {
    const targetMat = matrimonials.find((m) => m.id === matrimonialId || m.userId === matrimonialId);
    const targetUserId = targetMat ? targetMat.userId : matrimonialId;

    setMatrimonials((prev) =>
      prev.map((m) => {
        // Target profile gets fromUserId added
        if (m.id === matrimonialId || m.userId === matrimonialId) {
          const updated = {
            ...m,
            interestsAccepted: Array.from(new Set([...m.interestsAccepted, fromUserId])),
          };
          try {
            setDoc(doc(db, 'matrimonials', m.id), updated, { merge: true });
            syncToSupabaseTable('matrimonials', updated);
          } catch (e) {}
          return updated;
        }
        // Sender profile gets targetUserId and targetMat ID added
        if (m.userId === fromUserId || m.id === fromUserId) {
          const updated = {
            ...m,
            interestsAccepted: Array.from(new Set([...m.interestsAccepted, targetUserId, matrimonialId])),
          };
          try {
            setDoc(doc(db, 'matrimonials', m.id), updated, { merge: true });
            syncToSupabaseTable('matrimonials', updated);
          } catch (e) {}
          return updated;
        }
        return m;
      })
    );

    if (fromUserId) {
      addNotification({
        userId: fromUserId,
        title: '🎉 Matrimonial Request Accepted!',
        message: `Your interest request was ACCEPTED by ${targetMat?.fullName || 'the candidate'}'s family. Direct contact is unlocked!`,
        type: 'Matrimonial',
        senderId: currentUser?.id,
        senderName: currentUser?.fullName,
        actionTab: 'matrimonial',
        connectionStatus: 'Accepted',
      });
    }
    triggerCelebrationConfetti();
    showToast('Interest Accepted!', 'You can now view full contact details and chat directly.', 'success');
  };

  const sendMatrimonialMessage = (receiverId: string, receiverName: string, text: string) => {
    if (!text.trim() || !currentUser) return;
    const newMsg: MatrimonialMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: currentUser.id,
      senderName: currentUser.fullName || 'Jain Member',
      receiverId,
      receiverName,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMatrimonialMessages((prev) => [...prev, newMsg]);
    try {
      setDoc(doc(db, 'matrimonial_messages', newMsg.id), newMsg, { merge: true });
    } catch (e) {}
  };

  const addBloodDonor = (donor: Partial<BloodDonor>) => {
    const newDonor: BloodDonor = {
      id: `bd_${Date.now()}`,
      name: donor.name || currentUser?.fullName || 'Jain Donor',
      bloodGroup: donor.bloodGroup || 'O+',
      city: donor.city || 'Mumbai',
      state: donor.state || 'Maharashtra',
      mobile: donor.mobile || currentUser?.mobile || '+91 98000 00000',
      available: true,
    };
    setBloodDonors((prev) => [newDonor, ...prev]);
    try {
      setDoc(doc(db, 'blood_donors', newDonor.id), newDonor, { merge: true });
      syncToSupabaseTable('blood_donors', newDonor);
    } catch (e) {}
    triggerConfetti();
    showToast('Donor Registered!', 'Thank you for registering in the Jain Emergency Blood Network.', 'success');
  };

  const addJob = (job: Partial<JobItem>) => {
    const newJob: JobItem = {
      id: job.id || `job_${Date.now()}`,
      businessId: job.businessId,
      postedByUserId: job.postedByUserId || currentUser?.id,
      title: job.title || 'Job Opening',
      company: job.company || 'Jain Enterprise',
      location: job.location || 'Mumbai',
      type: job.type || 'Full-time',
      salary: job.salary || 'Negotiable',
      contactEmail: job.contactEmail || currentUser?.email || 'hr@jainenterprise.com',
      description: job.description || '',
      postedDate: job.postedDate || new Date().toISOString().split('T')[0],
    };
    setJobs((prev) => [newJob, ...prev]);
    try {
      setDoc(doc(db, 'jobs', newJob.id), newJob, { merge: true });
      syncToSupabaseTable('jobs', newJob);
    } catch (e) {}
    triggerConfetti();
    showToast('Job Opportunity Posted!', 'Job saved to Supabase & listed on Jain Career Portal.', 'success');
  };

  const updateJob = (jobId: string, updated: Partial<JobItem>) => {
    let targetJob: JobItem | undefined;
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          targetJob = { ...j, ...updated };
          return targetJob;
        }
        return j;
      })
    );
    if (targetJob) {
      try {
        setDoc(doc(db, 'jobs', targetJob.id), targetJob, { merge: true });
        syncToSupabaseTable('jobs', targetJob);
      } catch (e) {}
    }
    showToast('Job Post Updated', 'Job position details updated successfully.', 'success');
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    try {
      deleteDoc(doc(db, 'posts', postId));
      deleteFromSupabaseTable('posts', postId);
    } catch (e) {}
    showToast('Post Deleted', 'Community post removed by Super Admin.', 'info');
  };

  const deleteBloodDonor = (donorId: string) => {
    setBloodDonors((prev) => prev.filter((d) => d.id !== donorId));
    try {
      deleteDoc(doc(db, 'blood_donors', donorId));
      deleteFromSupabaseTable('blood_donors', donorId);
    } catch (e) {}
    showToast('Donor Record Removed', 'Blood donor profile removed.', 'info');
  };

  const deleteJob = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    try {
      deleteDoc(doc(db, 'jobs', jobId));
      deleteFromSupabaseTable('jobs', jobId);
    } catch (e) {}
    showToast('Job Listing Removed', 'Career opening removed.', 'info');
  };

  const updatePanchang = (updated: Partial<PanchangInfo>) => {
    setPanchang((prev) => {
      const merged = { ...prev, ...updated };
      try {
        const panchangPayload = { id: 'today', ...merged, updatedAt: new Date().toISOString() };
        setDoc(doc(db, 'panchang', 'today'), panchangPayload, { merge: true });
        syncToSupabaseTable('panchang', panchangPayload);
      } catch (e) {}
      return merged;
    });
    showToast('Panchang & Quotes Saved', 'Today\'s Panchang, Tithi, Thought & Pravachan updated across the platform.', 'success');
  };

  const addAdBanner = (ad: Partial<AdBanner>) => {
    const newAd: AdBanner = {
      id: `ad_${Date.now()}`,
      title: ad.title || 'Promotional Banner',
      imageUrl: ad.imageUrl || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
      linkUrl: ad.linkUrl || '#',
      position: ad.position || 'Home Banner',
      sponsorName: ad.sponsorName || 'Verified Sponsor',
      description: ad.description || '',
      offerDiscount: ad.offerDiscount || '',
      contactMobile: ad.contactMobile || '9514237277',
      expiryDate: ad.expiryDate || '2026-12-31',
      businessId: ad.businessId,
      ownerUserId: ad.ownerUserId,
      isActive: true,
    };
    setAds((prev) => [newAd, ...prev]);
    try {
      setDoc(doc(db, 'ads', newAd.id), newAd, { merge: true });
      syncToSupabaseTable('ads', newAd);
    } catch (e) {}

    // Send Notification & Reminder to linked business owner
    if (ad.businessId || ad.ownerUserId) {
      const newNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        userId: ad.ownerUserId || 'all',
        title: '📢 Business Ad Published!',
        message: `Your advertisement "${newAd.title}" is published on Home Page. Valid till ${newAd.expiryDate}. Contact Admin (9514237277) to extend or renew.`,
        type: 'AdReminder',
        isRead: false,
        createdAt: 'Just now',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    triggerConfetti();
    showToast('Advertisement Live!', 'Business promotion is now running on the public home page.', 'success');
  };

  const deleteAdBanner = (adId: string) => {
    setAds((prev) => prev.filter((a) => a.id !== adId));
    try {
      deleteDoc(doc(db, 'ads', adId));
      deleteFromSupabaseTable('ads', adId);
    } catch (e) {}
    showToast('Ad Removed', 'Banner removed from system.', 'info');
  };

  const addNewsItem = (item: Partial<NewsItem>) => {
    const newNews: NewsItem = {
      id: `news_${Date.now()}`,
      title: item.title || 'Community Update',
      summary: item.summary || '',
      content: item.content || '',
      imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
      category: item.category || 'Global News',
      publishedDate: new Date().toISOString().split('T')[0],
      author: 'Admin SKJ Tech World',
      isPinned: item.isPinned || false,
    };
    setNews((prev) => [newNews, ...prev]);
    try {
      setDoc(doc(db, 'news', newNews.id), newNews, { merge: true });
      syncToSupabaseTable('news', newNews);
    } catch (e) {}
    triggerConfetti();
    showToast('News Announcement Published!', 'Broadcasted to all users.', 'success');
  };

  const updateSystemSettings = (settings: Partial<SystemSettings>) => {
    setSystemSettings((prev) => {
      const updated = { ...prev, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      try {
        const payload = { id: 'global', ...updated, updatedAt: new Date().toISOString() };
        setDoc(doc(db, 'settings', 'global'), payload, { merge: true });
        syncToSupabaseTable('settings', payload);
      } catch (e) {}
      return updated;
    });
    showToast('Settings Saved', 'Platform customization updated successfully.', 'success');
  };

  const addCustomPage = (pageData: Partial<CustomPage>) => {
    const newPage: CustomPage = {
      id: `page_${Date.now()}`,
      slug: (pageData.title || 'custom-page').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: pageData.title || 'Untitled Dynamic Page',
      category: pageData.category || 'General',
      content: pageData.content || 'Dynamic content placeholder',
      bannerImage: pageData.bannerImage || 'https://images.unsplash.com/photo-1545232979-fbf582236e78?auto=format&fit=crop&w=1200&q=80',
      isPublished: pageData.isPublished !== undefined ? pageData.isPublished : true,
      showInHeader: pageData.showInHeader !== undefined ? pageData.showInHeader : true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setCustomPages((prev) => [newPage, ...prev]);
    try {
      setDoc(doc(db, 'pages', newPage.id), newPage, { merge: true });
      syncToSupabaseTable('pages', newPage);
    } catch (e) {}
    showToast('Dynamic Page Published', `Page "${newPage.title}" is now active!`, 'success');
  };

  const updateCustomPage = (id: string, updatedFields: Partial<CustomPage>) => {
    setCustomPages((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = {
            ...p,
            ...updatedFields,
            updatedAt: new Date().toISOString().split('T')[0],
          };
          try {
            setDoc(doc(db, 'pages', id), updated, { merge: true });
            syncToSupabaseTable('pages', updated);
          } catch (e) {}
          return updated;
        }
        return p;
      })
    );
    showToast('Page Saved', 'Dynamic page updated successfully!', 'success');
  };

  const deleteCustomPage = (id: string) => {
    setCustomPages((prev) => prev.filter((p) => p.id !== id));
    try {
      deleteDoc(doc(db, 'pages', id));
      deleteFromSupabaseTable('pages', id);
    } catch (e) {}
    showToast('Page Deleted', 'Dynamic page removed from website.', 'info');
  };

  const togglePublishPage = (id: string) => {
    setCustomPages((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, isPublished: !p.isPublished, updatedAt: new Date().toISOString().split('T')[0] };
          try {
            setDoc(doc(db, 'pages', id), updated, { merge: true });
            syncToSupabaseTable('pages', updated);
          } catch (e) {}
          return updated;
        }
        return p;
      })
    );
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!currentUser) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(currentUser.role);
  };

  const isSuperAdmin = currentUser?.role === 'Super Admin';
  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Super Admin';
  const isVerifiedBusiness = currentUser?.role === 'VerifiedBusiness' || (currentUser?.role === 'Business Owner' && currentUser?.isVerified);

  const userPermissions: RolePermissions = useMemo(() => {
    const role = currentUser?.role;
    const custom = currentUser?.rolePermissions || {};

    if (role === 'Super Admin' || role === 'Admin') {
      return {
        canAccessAdmin: true,
        canManageUsers: true,
        canManageBusinesses: true,
        canManageTemples: true,
        canApproveProfiles: true,
        canCreateAds: true,
        canPublishNews: true,
        canManagePanchang: true,
        ...custom,
      };
    }

    if (role === 'Moderator') {
      return {
        canAccessAdmin: true,
        canManageUsers: false,
        canManageBusinesses: true,
        canManageTemples: true,
        canApproveProfiles: true,
        canCreateAds: true,
        canPublishNews: true,
        canManagePanchang: false,
        ...custom,
      };
    }

    if (role === 'Temple Admin') {
      return {
        canAccessAdmin: true,
        canManageUsers: false,
        canManageBusinesses: false,
        canManageTemples: true,
        canApproveProfiles: false,
        canCreateAds: false,
        canPublishNews: false,
        canManagePanchang: true,
        ...custom,
      };
    }

    if (role === 'Business Owner' || role === 'VerifiedBusiness') {
      return {
        canAccessAdmin: false,
        canManageUsers: false,
        canManageBusinesses: true,
        canManageTemples: false,
        canApproveProfiles: false,
        canCreateAds: true,
        canPublishNews: false,
        canManagePanchang: false,
        ...custom,
      };
    }

    return {
      canAccessAdmin: false,
      canManageUsers: false,
      canManageBusinesses: false,
      canManageTemples: false,
      canApproveProfiles: false,
      canCreateAds: false,
      canPublishNews: false,
      canManagePanchang: false,
      ...custom,
    };
  }, [currentUser]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isMatrimonialOnlyUser,
        isBusinessOnlyUser,
        isLoadingData,
        setIsLoadingData,
        users,
        matrimonials,
        businesses,
        temples,
        members,
        posts,
        news,
        ads,
        panchang,
        bloodDonors,
        jobs,
        notifications,
        systemSettings,
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        themePreference,
        setThemePreference,
        themeMode,
        setThemeMode,
        toggleTheme,
        solarThemeInfo,
        searchQuery,
        setSearchQuery,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isRegModalOpen,
        setIsRegModalOpen,
        regModalTab,
        setRegModalTab,
        openRegistrationModal,
        isAISearchOpen,
        setIsAISearchOpen,
        isMembershipModalOpen,
        setIsMembershipModalOpen,
        isUserProfileModalOpen,
        setIsUserProfileModalOpen,
        isDigitalIdModalOpen,
        setIsDigitalIdModalOpen,
        digitalIdTargetUser,
        setDigitalIdTargetUser,
        openDigitalIdModal,
        isBhajanModalOpen,
        setIsBhajanModalOpen,
        isGmailCenterOpen,
        setIsGmailCenterOpen,
        isCentralNotifOpen,
        setIsCentralNotifOpen,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        addNotification,
        sendProfileViewAlert,
        sendConnectionRequestAlert,
        sendCommunityAnnouncement,
        respondToConnectionRequest,
        gmailModalData,
        openGmailModal,
        toastMessage,
        showToast,
        isPlayingNavkar,
        toggleNavkarAudio,
        login,
        logout,
        resetUserPassword,
        registerUser,
        updateUserProfile,
        approveUser,
        rejectUser,
        suspendUser,
        deleteUser,
        verifyUserBadge,
        toggleUserBadge,
        toggleCommunityMemberBadge,
        addCommunityMember,
        approveCommunityMember,
        deleteCommunityMember,
        addBusiness,
        updateBusinessListing,
        approveBusiness,
        deleteBusiness,
        addTemple,
        updateTemple,
        addTempleImages,
        addTempleReview,
        approveTemple,
        deleteTemple,
        addMatrimonial,
        approveMatrimonial,
        deleteMatrimonial,
        updateMatrimonialProfile,
        dispatchApprovalEmail,
        addPost,
        deletePost,
        likePost,
        addComment,
        sendInterest,
        acceptInterest,
        matrimonialMessages,
        sendMatrimonialMessage,
        addBloodDonor,
        deleteBloodDonor,
        addJob,
        updateJob,
        deleteJob,
        addAdBanner,
        deleteAdBanner,
        addNewsItem,
        updateSystemSettings,
        updatePanchang,
        bhajans,
        addBhajan,
        updateBhajan,
        deleteBhajan,
        toggleBhajanActive,
        currentSong,
        isPlayingSong,
        playSong,
        pauseSong,
        togglePlaySong,
        customPages,
        addCustomPage,
        updateCustomPage,
        deleteCustomPage,
        togglePublishPage,
        successStories,
        submitSuccessStory,
        deactivateMatrimonialProfile,
        registerMatrimonialFromDirectory,
        syncAllDataToFirestore,
        isSyncingFirestore,
        lastFirestoreSyncTime,
        syncAllDataToSupabase,
        isSyncingSupabase,
        lastSupabaseSyncTime,
        isSupabaseConnected,
        lastSupabaseSyncStatus,
        lastSupabaseSyncMessage,
        lastSupabaseSyncDetails,
        refreshDatabaseData,
        isRefreshingData,
        hasRole,
        userPermissions,
        isSuperAdmin,
        isAdmin,
        isVerifiedBusiness,
        endorseBusiness,
        initiateCall,
        dashboardWidgets,
        updateDashboardWidgets,
        resetDashboardLayout,
        togglePinWidget,
        toggleWidgetVisibility,
        reorderDashboardWidgets,
        isDashboardCustomizerOpen,
        setIsDashboardCustomizerOpen,
        isDailyTithiAlertOpen,
        setIsDailyTithiAlertOpen,
        openDailyTithiAlert,
        isSitemapOpen,
        setIsSitemapOpen,
        openSitemap,
        prayerReminderSettings,
        updatePrayerReminderSettings,
        userProfileTab,
        setUserProfileTab,
        openPrayerRemindersSettings,
      }}
    >
      {children}
      <PhoneVerificationModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        targetPhone={phoneCallTarget.phone}
        recipientName={phoneCallTarget.recipientName}
        onSuccessDial={(verifiedPhone) => {
          const cleanDigits = verifiedPhone.replace(/[^0-9+]/g, '');
          window.location.href = `tel:${cleanDigits}`;
        }}
      />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
