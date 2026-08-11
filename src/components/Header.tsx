import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { NAV_TRANSLATIONS } from '../utils/translations';
import { useTypingPlaceholder } from '../hooks/useTypingPlaceholder';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  Search,
  Sparkles,
  Sun,
  Moon,
  Globe,
  Bell,
  UserCheck,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus,
  Crown,
  Menu,
  X,
  Heart,
  Building2,
  Users,
  MapPin,
  Calendar,
  MessageSquare,
  AlertCircle,
  Music,
  Play,
  Pause,
  Volume2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Compass,
  Mail,
  QrCode
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    isMatrimonialOnlyUser,
    isBusinessOnlyUser,
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    themeMode,
    setThemeMode,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    setIsAuthModalOpen,
    setIsRegModalOpen,
    openRegistrationModal,
    setIsAISearchOpen,
    setIsMembershipModalOpen,
    setIsUserProfileModalOpen,
    setIsDigitalIdModalOpen,
    setIsBhajanModalOpen,
    openGmailModal,
    notifications,
    setIsCentralNotifOpen,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    logout,
    systemSettings,
    showToast,
    panchang,
    bhajans,
    currentSong,
    isPlayingSong,
    togglePlaySong,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const SEARCH_PLACEHOLDERS = [
    'Search for businesses...',
    'Find a Tirth & Temple...',
    'Explore matrimonial profiles...',
    'Search Jain family directory...',
    'Discover Jain Panchang & Events...',
    'Ask AI for Jain Wisdom & Scriptures...',
  ];

  const animatedSearchPlaceholder = useTypingPlaceholder(SEARCH_PLACEHOLDERS);

  const handleTabClick = (tabId: string) => {
    // Restricted Matrimonial logged-in user: can ONLY see Matrimonial
    if (isMatrimonialOnlyUser) {
      if (tabId !== 'matrimonial') {
        showToast(
          'Portal Restricted',
          'Your account is registered exclusively for Matrimonial Services. Access to other portals is restricted.',
          'info'
        );
        setActiveTab('matrimonial');
        return;
      }
      setActiveTab('matrimonial');
      return;
    }

    // Restricted Business logged-in user: can ONLY see Business Directory
    if (isBusinessOnlyUser) {
      if (tabId !== 'business') {
        showToast(
          'Business Portal Restricted',
          'Your account is logged in as a Business Entity. Access is restricted exclusively to the Business Directory.',
          'info'
        );
        setActiveTab('business');
        return;
      }
      setActiveTab('business');
      return;
    }

    // 1. Logged-out Guest User: Only Matrimonial requires login
    if (!currentUser) {
      if (tabId === 'matrimonial') {
        setIsAuthModalOpen(true);
        showToast('Login Required', 'Please sign in or register to access Matrimonial Directory.', 'info');
        return;
      }
      setActiveTab(tabId as any);
      return;
    }

    // 2. Super Admin & Admin have unrestricted access
    if (currentUser.role === 'Super Admin' || currentUser.role === 'Admin') {
      setActiveTab(tabId as any);
      return;
    }

    // 3. Jain Directory, Business Directory, Temple Directory registered users can see all options except Matrimonial
    if (['Business', 'Temple', 'Individual', 'NGO', 'Trust'].includes(currentUser.registrationType)) {
      if (tabId === 'matrimonial') {
        showToast(
          'Portal Restricted',
          'Matrimonial Directory is exclusive to registered Marriage Profiles. Register a Marriage profile to access.',
          'info'
        );
        return;
      }
      setActiveTab(tabId as any);
      return;
    }

    setActiveTab(tabId as any);
  };

  const navScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkNavScroll = () => {
    if (navScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navScrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  const handleScrollLeft = () => {
    if (navScrollRef.current) {
      navScrollRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (navScrollRef.current) {
      navScrollRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  const LANGUAGE_OPTIONS = [
    { code: 'English', label: 'English', native: 'English' },
    { code: 'Hindi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'Gujarati', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'Marathi', label: 'Marathi', native: 'मराठी' },
    { code: 'Kannada', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'Tamil', label: 'Tamil', native: 'தமிழ்' },
    { code: 'Telugu', label: 'Telugu', native: 'తెలుగు' },
  ] as const;

  const currentLangObj = LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0];
  const langTranslations = NAV_TRANSLATIONS[language] || NAV_TRANSLATIONS.English;

  const navItems = [
    { id: 'home', label: langTranslations.home || 'Home', shortLabel: langTranslations.home || 'Home', icon: Globe },
    { id: 'matrimonial', label: langTranslations.matrimonial || 'Matrimonial', shortLabel: 'Matrimonial', icon: Heart },
    { id: 'business', label: langTranslations.business || 'Business Directory', shortLabel: 'Business', icon: Building2 },
    { id: 'directory', label: langTranslations.directory || 'Jain Directory', shortLabel: 'Directory', icon: Users },
    { id: 'temple', label: langTranslations.temple || 'Temple Directory', shortLabel: 'Temples', icon: MapPin },
    { id: 'panchang', label: langTranslations.panchang || 'Panchang & Quotes', shortLabel: 'Panchang', icon: Calendar },
    { id: 'feed', label: langTranslations.feed || 'Community Feed', shortLabel: 'Feed', icon: MessageSquare },
    { id: 'emergency', label: langTranslations.emergency || 'Services & Emergency', shortLabel: 'Services', icon: AlertCircle },
  ];

  const displayedNavItems = isMatrimonialOnlyUser
    ? navItems.filter((item) => item.id === 'matrimonial')
    : isBusinessOnlyUser
    ? navItems.filter((item) => item.id === 'business')
    : navItems;

  useEffect(() => {
    checkNavScroll();
    window.addEventListener('resize', checkNavScroll);
    return () => window.removeEventListener('resize', checkNavScroll);
  }, [displayedNavItems]);

  const NAV_ITEM_THEMES: Record<string, { active: string; hover: string; iconActive: string; iconInactive: string }> = {
    home: {
      active: 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 border-amber-300 font-black shadow-md scale-[1.02]',
      hover: 'hover:bg-amber-800/90 hover:text-amber-200 hover:border-amber-400',
      iconActive: 'text-slate-950',
      iconInactive: 'text-amber-400',
    },
    matrimonial: {
      active: 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white border-rose-300 font-black shadow-md scale-[1.02]',
      hover: 'hover:bg-rose-900/90 hover:text-rose-200 hover:border-rose-400',
      iconActive: 'text-white',
      iconInactive: 'text-rose-300',
    },
    business: {
      active: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 border-amber-300 font-black shadow-md scale-[1.02]',
      hover: 'hover:bg-orange-900/90 hover:text-amber-200 hover:border-amber-400',
      iconActive: 'text-slate-950',
      iconInactive: 'text-amber-300',
    },
    directory: {
      active: 'bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white border-cyan-300 font-black shadow-md scale-[1.02]',
      hover: 'hover:bg-cyan-900/90 hover:text-cyan-200 hover:border-cyan-400',
      iconActive: 'text-white',
      iconInactive: 'text-cyan-300',
    },
    temple: {
      active: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white border-emerald-300 font-black shadow-md scale-[1.02]',
      hover: 'hover:bg-emerald-900/90 hover:text-emerald-200 hover:border-emerald-400',
      iconActive: 'text-white',
      iconInactive: 'text-emerald-300',
    },
    panchang: {
      active: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white border-indigo-300 font-black shadow-md scale-[1.02]',
      hover: 'hover:bg-indigo-900/90 hover:text-indigo-200 hover:border-indigo-400',
      iconActive: 'text-white',
      iconInactive: 'text-indigo-300',
    },
    feed: {
      active: 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-600 text-white border-fuchsia-300 font-black shadow-md scale-[1.02]',
      hover: 'hover:bg-fuchsia-900/90 hover:text-fuchsia-200 hover:border-fuchsia-400',
      iconActive: 'text-white',
      iconInactive: 'text-fuchsia-300',
    },
    emergency: {
      active: 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white border-red-300 font-black shadow-md scale-[1.02]',
      hover: 'hover:bg-red-900/90 hover:text-red-200 hover:border-red-400',
      iconActive: 'text-white',
      iconInactive: 'text-red-300',
    },
  };

  const userNotifications = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'Super Admin' || currentUser.role === 'Admin') {
      return notifications;
    }
    const email = (currentUser.email || '').toLowerCase();
    const name = (currentUser.fullName || '').toLowerCase();
    const userId = currentUser.id;

    return notifications.filter((n) => {
      if (n.userId === userId) return true;
      if (n.userId === 'all') return true;
      const msg = (n.message || '').toLowerCase();
      const title = (n.title || '').toLowerCase();
      if (email && (msg.includes(email) || title.includes(email))) return true;
      if (name && (msg.includes(name) || title.includes(name))) return true;
      return false;
    });
  }, [currentUser, notifications]);

  const unreadNotifsCount = userNotifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-50 w-full max-w-full transition-colors duration-300">
      {/* Top Ticker & Utility Bar with Sacred Gold Graphics */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-100 text-xs py-1.5 px-2.5 sm:px-4 shadow-md border-b border-amber-600/30 relative w-full max-w-full">
        {/* Subtle Decorative Background Motif */}
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2 relative z-10 w-full max-w-full">
          {/* Sacred Ticker Text with Graphic Emblem */}
          <div className="flex items-center gap-1.5 overflow-hidden flex-1 min-w-0">
            <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-amber-950 font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] tracking-wider uppercase shrink-0 flex items-center gap-1 shadow-sm border border-amber-300">
              {/* Jain Ahimsa Palm / Lotus Golden Symbol SVG */}
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-950 shrink-0" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <span>OFFICIAL</span>
            </div>

            <div className="flex items-center gap-1 truncate font-medium text-amber-100 text-[10px] sm:text-xs min-w-0">
              <span className="text-amber-400 font-bold text-xs sm:text-sm select-none shrink-0">🙏</span>
              <p className="truncate font-semibold tracking-wide min-w-0">
                {systemSettings.announcementTicker}
              </p>
            </div>
          </div>

          {/* Quick Info & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Today's Jain Tithi & Date Badge */}
            <button
              onClick={() => setActiveTab('panchang')}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-100 text-[10px] sm:text-[11px] font-semibold shadow-xs cursor-pointer transition-all hover:border-amber-400 shrink-0"
              title="Click to view Today's Jain Panchang"
            >
              <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="text-amber-100 font-bold">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              <span className="text-amber-500/60">•</span>
              <span className="text-amber-300 font-extrabold">{panchang?.tithi ? panchang.tithi.split('(')[0].trim() : 'Jain Tithi'}</span>
            </button>

            {/* Developer Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-900/60 border border-amber-500/30 text-amber-200 shadow-inner text-[10px] sm:text-[11px]">
              <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
              <span>
                <span className="hidden md:inline">Developed by </span>
                <strong className="text-amber-300 font-bold">{systemSettings.developerName}</strong>
              </span>
            </div>

            {/* Language Switcher Dropdown */}
            <LanguageSwitcher variant="topbar" />
          </div>
        </div>
      </div>

      {/* Main Glassmorphism Header */}
      <div className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-amber-200/40 dark:border-amber-900/40 shadow-sm transition-colors w-full max-w-full">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2 flex items-center justify-between gap-1.5 sm:gap-4 w-full max-w-full">
          
          {/* Logo & Branding */}
          <div
            onClick={() => {
              if (isMatrimonialOnlyUser) {
                setActiveTab('matrimonial');
              } else {
                setActiveTab('home');
              }
            }}
            className="flex items-center gap-1.5 sm:gap-3 cursor-pointer group shrink min-w-0 overflow-hidden"
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                <img
                  src="/src/assets/images/jain_connect_logo_1784713492384.jpg"
                  alt="Jain Connect Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-amber-400 font-black text-sm sm:text-xl tracking-tighter">JC</span>
              </div>
            </div>
            <div className="min-w-0 overflow-hidden">
              <div className="flex items-center gap-1">
                <h1 className="text-xs sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-serif truncate">
                  JAIN CONNECT
                </h1>
                <span className="text-[8px] sm:text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-1 py-0.2 rounded font-bold uppercase tracking-wider shrink-0">
                  GLOBAL
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden md:block truncate">
                One Platform for Every Jain, Business & Temple
              </p>
            </div>
          </div>

          {/* Global Search Bar with Voice & AI Assistant Button */}
          <div className="hidden md:flex flex-1 max-w-md relative items-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={animatedSearchPlaceholder || 'Search for businesses, temples...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-24 py-2 text-xs rounded-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              
              <button
                onClick={() => setIsAISearchOpen(true)}
                className="absolute right-1.5 top-1 bottom-1 px-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-[11px] font-semibold rounded-full flex items-center gap-1 shadow-sm transition-all"
              >
                <Sparkles className="w-3 h-3 text-amber-200 animate-pulse" />
                <span>AI Assist</span>
              </button>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Membership Upgrade Button */}
            <button
              onClick={() => setIsMembershipModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 hover:bg-amber-200 rounded-full text-xs font-semibold transition-all shadow-sm"
            >
              <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Membership</span>
            </button>

            {/* Gmail Integration Center Button */}
            <button
              onClick={() => openGmailModal()}
              className="p-1.5 sm:p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative shrink-0"
              title="Gmail Community Center"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
            </button>

            {/* Notification Dropdown - Only shown when logged in */}
            {currentUser && (
              <div className="relative shrink-0">
                <button
                  onClick={() => setIsCentralNotifOpen(true)}
                  className="p-1.5 sm:p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                  title="Open Central Notification Center"
                >
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-600 text-white text-[8px] sm:text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {/* Notif Quick Dropdown */}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-amber-500" />
                        Member Notifications
                      </h3>
                      <button
                        onClick={() => {
                          setIsNotifOpen(false);
                          setIsCentralNotifOpen(true);
                        }}
                        className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline"
                      >
                        View All ({userNotifications.length})
                      </button>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {userNotifications.length === 0 ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400 py-3 text-center">
                          No notifications found for your account.
                        </p>
                      ) : (
                        userNotifications.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              setIsNotifOpen(false);
                              setIsCentralNotifOpen(true);
                            }}
                            className={`p-2 rounded-lg cursor-pointer transition-all text-xs ${
                              !n.isRead
                                ? 'bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800'
                                : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50'
                            }`}
                          >
                            <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                              <span>{n.title}</span>
                              {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5 line-clamp-2">{n.message}</p>
                            <span className="text-[9px] text-amber-600 dark:text-amber-400 font-medium block mt-1">
                              {n.createdAt}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 text-center">
                      <button
                        onClick={() => {
                          setIsNotifOpen(false);
                          setIsCentralNotifOpen(true);
                        }}
                        className="w-full py-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        Open Notification Center
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Account Controls */}
            {currentUser ? (
              <div className="relative shrink-0 flex items-center gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1 sm:gap-1.5 p-0.5 sm:p-1 pl-1 pr-1.5 sm:pr-2.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-amber-300/60 hover:border-amber-500 transition-all cursor-pointer shadow-sm"
                  title="Click to toggle user profile menu"
                >
                  <img
                    src={currentUser.profilePhoto}
                    alt={currentUser.fullName}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-amber-400 shrink-0"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[90px]">
                        {currentUser.fullName}
                      </span>
                      {currentUser.isVerified && (
                        <UserCheck className="w-3 h-3 text-amber-500 shrink-0" />
                      )}
                    </div>
                    <span className="text-[9px] text-amber-600 dark:text-amber-400 font-extrabold uppercase block tracking-wider">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180 text-amber-500' : ''}`} />
                </button>

                {/* Direct 1-Click Logout Button */}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                  className="p-1.5 sm:p-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 rounded-full text-xs font-extrabold transition-all shadow-sm flex items-center gap-1 shrink-0 cursor-pointer"
                  title="Sign Out / Log Out"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="hidden xl:inline text-[11px] font-black">Sign Out</span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    {/* Click-outside backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-amber-300 dark:border-amber-800/80 py-2 z-50 text-xs">
                      <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1 bg-amber-50/50 dark:bg-amber-950/20 rounded-t-xl">
                        <p className="font-extrabold text-slate-900 dark:text-white truncate">{currentUser.fullName}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="inline-block px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold rounded text-[10px]">
                            Status: {currentUser.status}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            {currentUser.registrationType}
                          </span>
                        </div>
                      </div>

                      {(currentUser.role === 'Super Admin' || currentUser.role === 'Admin') && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('admin');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-bold flex items-center gap-2 cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Admin Control Panel</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setIsDigitalIdModalOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-extrabold flex items-center gap-2 cursor-pointer"
                      >
                        <QrCode className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Digital Member ID & QR Card</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserProfileModalOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold flex items-center gap-2 cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>My Profile & Blood Donor Settings</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          openRegistrationModal();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 font-semibold cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>Register New Listing</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 font-black flex items-center gap-2 border-t border-red-200 dark:border-red-900/40 mt-1 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                        <span>Sign Out / Log Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-full text-xs font-black transition-all shadow-sm flex items-center gap-1 shrink-0 whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login<span className="hidden sm:inline"> / Admin</span></span>
                </button>
                <button
                  onClick={() => openRegistrationModal()}
                  className="hidden sm:flex px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-full text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 items-center gap-1.5 shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-500" />
                  <span>Register</span>
                </button>
              </div>
            )}

            {/* Mobile Navigation Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/10 transition-colors shrink-0"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar - Visible on desktop, hidden on mobile as options are in mobile menu */}
        <div className="hidden md:block bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-amber-50 border-t border-amber-500/30 shadow-md w-full relative group">
          <div className="max-w-7xl mx-auto px-2 lg:px-4 py-2 w-full relative flex items-center">
            {/* Left Scroll Button Indicator */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={handleScrollLeft}
                className="absolute left-1.5 z-20 p-1.5 rounded-full bg-amber-950/90 text-amber-300 border border-amber-500/50 shadow-lg hover:bg-amber-800 hover:text-white transition-all cursor-pointer shrink-0"
                title="Scroll Navigation Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {/* Horizontal Scroll Nav Container */}
            <div
              ref={navScrollRef}
              onScroll={checkNavScroll}
              className="flex items-center justify-start 2xl:justify-between gap-1.5 lg:gap-2 flex-nowrap w-full overflow-x-auto no-scrollbar scroll-smooth pr-10 sm:pr-12 lg:pr-16"
            >
              {displayedNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const theme = NAV_ITEM_THEMES[item.id] || NAV_ITEM_THEMES.home;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 lg:px-3 lg:py-1.5 text-[11px] lg:text-xs font-bold transition-all rounded-full whitespace-nowrap shrink-0 border cursor-pointer ${
                      isActive
                        ? theme.active
                        : `bg-slate-900/80 dark:bg-slate-950/80 text-slate-100 border-slate-700/60 ${theme.hover}`
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? theme.iconActive : theme.iconInactive}`} />
                    <span className="hidden 2xl:inline">{item.label}</span>
                    <span className="2xl:hidden">{item.shortLabel || item.label}</span>
                  </button>
                );
              })}

              {/* Devotional Bhajans Button */}
              {!isMatrimonialOnlyUser && (
                <button
                  type="button"
                  onClick={() => setIsBhajanModalOpen(true)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 lg:px-3 lg:py-1.5 rounded-full text-[11px] lg:text-xs font-bold transition-all border shrink-0 whitespace-nowrap shadow-sm cursor-pointer ${
                    isPlayingSong
                      ? 'border-amber-400 bg-amber-900/90 text-amber-300 animate-pulse'
                      : 'border-amber-500/40 bg-amber-950/80 text-amber-200 hover:text-white hover:bg-amber-900'
                  }`}
                  title="Click to view & listen to Jain Devotional Bhajans & Songs"
                >
                  <Music className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="hidden 2xl:inline">Bhajans & Songs</span>
                  <span className="2xl:hidden">Bhajans</span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.2 rounded-full border border-amber-500/30">
                    {bhajans.filter((b) => b.isActive).length}
                  </span>
                  {isPlayingSong && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-0.5" />}
                </button>
              )}

              {/* Admin Panel Tab highlight if Admin */}
              {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin' || currentUser?.email === 'sandeepbachhawat1@gmail.com') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 lg:px-3 lg:py-1.5 text-[11px] lg:text-xs font-extrabold transition-all rounded-full whitespace-nowrap shrink-0 border cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'border-amber-500/50 bg-amber-950/40 text-amber-400 hover:bg-amber-900/60'
                  }`}
                  title="Control Panel"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Admin</span>
                </button>
              )}

              {/* Trailing Spacer to guarantee full visibility and generous padding when scrolled right */}
              <div className="w-8 shrink-0 min-w-[2rem]" />
            </div>

            {/* Right Scroll Button Indicator */}
            {canScrollRight && (
              <button
                type="button"
                onClick={handleScrollRight}
                className="absolute right-1.5 z-20 p-1.5 rounded-full bg-amber-950/90 text-amber-300 border border-amber-500/50 shadow-lg hover:bg-amber-800 hover:text-white transition-all cursor-pointer shrink-0"
                title="Scroll Navigation Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Modern Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-950/98 backdrop-blur-xl text-white p-4 space-y-4 border-t border-amber-500/30 shadow-2xl animate-fade-in max-h-[85vh] overflow-y-auto">
            {/* User Account / Welcome Header inside Drawer */}
            {currentUser ? (
              <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 p-3.5 rounded-2xl border border-amber-500/30 flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.profilePhoto}
                    alt={currentUser.fullName}
                    className="w-10 h-10 rounded-full border-2 border-amber-400 object-cover shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-extrabold text-white truncate max-w-[160px]">{currentUser.fullName}</p>
                      {currentUser.isVerified && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[10px] text-amber-300 font-semibold">{currentUser.registrationType} • {currentUser.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIsDigitalIdModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl border border-amber-500/30 text-xs font-bold"
                    title="Digital ID"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl border border-red-500/40 text-xs font-bold"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 p-3.5 rounded-2xl border border-amber-500/30 space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold text-amber-300 font-serif">Welcome to Jain Connect Global</p>
                    <p className="text-[10px] text-slate-400">Connect with Jain Community, Matrimonial & Businesses</p>
                  </div>
                  <Crown className="w-5 h-5 text-amber-400 shrink-0" />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => {
                      openRegistrationModal();
                      setIsMobileMenuOpen(false);
                    }}
                    className="py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Register</span>
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Search & AI Assistant */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder={animatedSearchPlaceholder || 'Search Jain Connect Global...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-24 py-2.5 text-xs rounded-xl bg-slate-900 text-white border border-slate-700 focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                onClick={() => {
                  setIsAISearchOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 text-[10px] font-black rounded-lg shadow flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-slate-950" />
                <span>AI Search</span>
              </button>
            </div>

            {/* Mobile Language Switcher */}
            <LanguageSwitcher variant="mobile" className="pt-2 border-t border-slate-800" />

            {/* Mobile Navigation Links */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Directory Portals & Features
              </p>
              <div className="grid grid-cols-2 gap-2">
                {displayedNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleTabClick(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                      <span className="truncate text-left">{item.label}</span>
                    </button>
                  );
                })}

                {!isMatrimonialOnlyUser && (
                  <button
                    onClick={() => {
                      setIsBhajanModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="col-span-2 flex items-center justify-between p-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-950 to-slate-900 text-amber-300 border border-amber-500/40 shadow-md hover:bg-amber-900"
                  >
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Devotional Bhajans & Stavan</span>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-extrabold border border-amber-500/30">
                      {bhajans.filter((b) => b.isActive).length} Songs
                    </span>
                  </button>
                )}

                {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin') && (
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setIsMobileMenuOpen(false);
                    }}
                    className="col-span-2 flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Control Panel</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
