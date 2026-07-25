import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NAV_TRANSLATIONS } from '../utils/translations';
import { useTypingPlaceholder } from '../hooks/useTypingPlaceholder';
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
  Home,
  Compass,
  Mail
} from 'lucide-react';

export const Header: React.FC = () => {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const {
    currentUser,
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
    setIsBhajanModalOpen,
    openGmailModal,
    notifications,
    logout,
    systemSettings,
    showToast,
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

    // 3. Matrimonial registered users can see Matrimonial, Temple Directory, Panchang & Quotes
    if (currentUser.registrationType === 'Marriage Profile') {
      if (['business', 'directory'].includes(tabId)) {
        showToast(
          'Portal Restricted',
          'Matrimonial members have access to Matrimonial, Temple Directory, Panchang & Community Feed.',
          'info'
        );
        return;
      }
      setActiveTab(tabId as any);
      return;
    }

    // 4. Jain Directory, Business Directory, Temple Directory registered users can see all options except Matrimonial
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

  const LANGUAGE_OPTIONS = [
    { code: 'English', label: 'English', native: 'English' },
    { code: 'Hindi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'Gujarati', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'Marwari', label: 'Marwari', native: 'मारवाड़ी' },
    { code: 'Kannada', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'Tamil', label: 'Tamil', native: 'தமிழ்' },
    { code: 'Telugu', label: 'Telugu', native: 'తెలుగు' },
  ] as const;

  const currentLangObj = LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0];
  const langTranslations = NAV_TRANSLATIONS[language] || NAV_TRANSLATIONS.English;

  const navItems = [
    { id: 'home', label: langTranslations.home || 'Home', icon: Globe },
    { id: 'matrimonial', label: langTranslations.matrimonial || 'Matrimonial', icon: Heart },
    { id: 'business', label: langTranslations.business || 'Business Directory', icon: Building2 },
    { id: 'directory', label: langTranslations.directory || 'Jain Directory', icon: Users },
    { id: 'temple', label: langTranslations.temple || 'Temple Directory', icon: MapPin },
    { id: 'panchang', label: langTranslations.panchang || 'Panchang & Quotes', icon: Calendar },
    { id: 'feed', label: langTranslations.feed || 'Community Feed', icon: MessageSquare },
    { id: 'emergency', label: langTranslations.emergency || 'Services & Emergency', icon: AlertCircle },
  ];

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-50 w-full transition-colors duration-300">
      {/* Top Ticker & Utility Bar with Sacred Gold Graphics */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-100 text-xs py-1.5 px-3 sm:px-4 shadow-md border-b border-amber-600/30 relative overflow-hidden">
        {/* Subtle Decorative Background Motif */}
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 relative z-10 overflow-hidden">
          {/* Sacred Ticker Text with Graphic Emblem */}
          <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
            <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-amber-950 font-extrabold px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] tracking-wider uppercase shrink-0 flex items-center gap-1 shadow-sm border border-amber-300">
              {/* Jain Ahimsa Palm / Lotus Golden Symbol SVG */}
              <svg className="w-3 h-3 fill-amber-950 shrink-0" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <span>OFFICIAL</span>
            </div>

            <div className="flex items-center gap-1.5 truncate font-medium text-amber-100 text-[11px] sm:text-xs">
              <span className="text-amber-400 font-bold text-xs sm:text-sm select-none">🙏</span>
              <p className="truncate font-semibold tracking-wide">
                {systemSettings.announcementTicker}
              </p>
            </div>
          </div>

          {/* Quick Info & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Developer Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-900/60 border border-amber-500/30 text-amber-200 shadow-inner text-[10px] sm:text-[11px]">
              <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
              <span>
                <span className="hidden md:inline">Developed by </span>
                <strong className="text-amber-300 font-bold">{systemSettings.developerName}</strong>
              </span>
            </div>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-900/50 hover:bg-amber-800 text-amber-200 hover:text-white text-[10px] sm:text-[11px] font-semibold border border-amber-500/30 transition-all shadow-sm"
                title="Select Interface Language"
              >
                <Globe className="w-3 h-3 text-amber-400" />
                <span className="font-medium">{currentLangObj.native}</span>
                <ChevronDown className="w-2.5 h-2.5 opacity-60" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-1.5 bg-slate-900 text-white rounded-2xl shadow-2xl border border-amber-500/30 py-2 w-48 z-50 animate-fade-in">
                  <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400/80 border-b border-slate-800 flex items-center justify-between">
                    <span>Select Language / भाषा</span>
                    <button
                      onClick={() => setIsLangDropdownOpen(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto no-scrollbar py-1">
                    {LANGUAGE_OPTIONS.map((lang) => {
                      const isSelected = language === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code as any);
                            setIsLangDropdownOpen(false);
                            showToast(
                              `Language Changed: ${lang.native}`,
                              `Interface language set to ${lang.label} (${lang.native}).`,
                              'success'
                            );
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-amber-600/30 transition-colors ${
                            isSelected ? 'text-amber-300 font-bold bg-amber-900/50' : 'text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-serif">{lang.native}</span>
                            <span className="text-[10px] text-slate-400">({lang.label})</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Selector Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/60 hover:bg-amber-800 text-amber-200 hover:text-white text-[10px] sm:text-[11px] font-semibold border border-amber-500/30 transition-all shadow-sm"
                title="Select Theme Mode (Light, Dark, or Auspicious Gold)"
              >
                {themeMode === 'light' && <Sun className="w-3 h-3 text-amber-300" />}
                {themeMode === 'dark' && <Moon className="w-3 h-3 text-amber-200" />}
                {themeMode === 'auspicious' && <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />}
                <span className="capitalize hidden xs:inline">{themeMode === 'auspicious' ? 'Gold' : themeMode}</span>
              </button>

              <div className="absolute right-0 mt-1 hidden group-hover:block bg-slate-900 text-white rounded-xl shadow-2xl border border-amber-500/30 py-1.5 w-40 z-50">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400/80 border-b border-slate-800">
                  Select Theme
                </div>
                
                <button
                  onClick={() => setThemeMode('light')}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-amber-600/30 transition-colors ${
                    themeMode === 'light' ? 'text-amber-400 font-bold bg-amber-900/40' : 'text-slate-300'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>Light Mode</span>
                </button>

                <button
                  onClick={() => setThemeMode('dark')}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-amber-600/30 transition-colors ${
                    themeMode === 'dark' ? 'text-amber-400 font-bold bg-amber-900/40' : 'text-slate-300'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-amber-200" />
                  <span>Dark Mode</span>
                </button>

                <button
                  onClick={() => setThemeMode('auspicious')}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-amber-600/30 transition-colors ${
                    themeMode === 'auspicious' ? 'text-amber-400 font-bold bg-amber-900/40' : 'text-amber-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Auspicious Gold</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Glassmorphism Header */}
      <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-amber-200/40 dark:border-amber-900/40 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Branding */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                <img
                  src="/src/assets/images/jain_connect_logo_1784713492384.jpg"
                  alt="Jain Connect Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback icon if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-amber-400 font-black text-lg sm:text-xl tracking-tighter">JC</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-serif whitespace-nowrap">
                  JAIN CONNECT
                </h1>
                <span className="text-[9px] sm:text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-1 py-0.2 rounded font-bold uppercase tracking-wider">
                  GLOBAL
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden md:block">
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
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
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
              className="p-1.5 sm:p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              title="Gmail Community Center"
            >
              <Mail className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
            </button>

            {/* Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-1.5 sm:p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notif Popup */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-amber-500" />
                      Notifications
                    </h3>
                    <span className="text-[10px] text-amber-600 font-semibold">{notifications.length} Total</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 text-xs"
                      >
                        <p className="font-bold text-slate-800 dark:text-slate-200">{n.title}</p>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">{n.message}</p>
                        <span className="text-[9px] text-amber-600 dark:text-amber-400 font-medium block mt-1">
                          {n.createdAt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Account Controls */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1 pl-1.5 pr-2 sm:pr-3 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-amber-300/50 hover:border-amber-500 transition-all"
                >
                  <img
                    src={currentUser.profilePhoto}
                    alt={currentUser.fullName}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-amber-400"
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
                    <span className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold uppercase block">
                      {currentUser.role}
                    </span>
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{currentUser.fullName}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{currentUser.email}</p>
                      <span className="mt-1 inline-block px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold rounded text-[10px]">
                        Status: {currentUser.status}
                      </span>
                    </div>

                    {(currentUser.role === 'Super Admin' || currentUser.role === 'Admin') && (
                      <button
                        onClick={() => {
                          setActiveTab('admin');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-bold flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Admin Control Panel</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsUserProfileModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-700 dark:text-red-300 font-bold flex items-center gap-2"
                    >
                      <UserCheck className="w-4 h-4 text-red-600" />
                      <span>My Profile & Blood Donor Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        openRegistrationModal();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4 text-slate-500" />
                      <span>Register New Listing</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 font-semibold flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1 shrink-0 whitespace-nowrap"
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
              className="md:hidden p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar - Always Visible on Mobile and Desktop */}
        <div className="bg-slate-900/95 dark:bg-slate-950 text-amber-100 border-t border-amber-500/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-2 xl:px-4 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1 flex-nowrap">
            <div className="flex items-center gap-1 xl:gap-1 flex-nowrap shrink-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center gap-1 xl:gap-1.5 px-2.5 xl:px-2.5 py-1.5 text-xs font-semibold transition-all rounded-lg whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-amber-600 text-slate-950 font-bold shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Devotional Bhajans Button - Compact Style */}
              <button
                onClick={() => setIsBhajanModalOpen(true)}
                className={`flex items-center gap-1 px-2.5 py-1.5 my-0.5 rounded-full text-xs font-bold transition-all border shrink-0 whitespace-nowrap shadow-sm hover:scale-105 ${
                  isPlayingSong
                    ? 'border-amber-400 bg-amber-900/80 text-amber-300 animate-pulse'
                    : 'border-amber-500/40 bg-amber-950/80 text-amber-200 hover:text-white hover:bg-amber-900'
                }`}
                title="Click to view & listen to Jain Devotional Bhajans & Songs in same window"
              >
                <Music className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>🎵 Bhajans & Songs</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.2 rounded-full border border-amber-500/30">
                  {bhajans.filter((b) => b.isActive).length}
                </span>
                {isPlayingSong && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-0.5" />}
              </button>

              {/* Admin Panel Tab highlight if Admin */}
              {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin') && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-extrabold transition-all rounded-lg whitespace-nowrap shrink-0 ${
                    activeTab === 'admin'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'border border-amber-500/40 text-amber-400 hover:bg-amber-950/40'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Admin</span>
                </button>
              )}
            </div>

            {/* Quick Login Info */}
            {currentUser?.email === 'sandeepbachhawat1@gmail.com' && (
              <span className="hidden 2xl:inline-block text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-mono font-bold shrink-0">
                Super Admin
              </span>
            )}
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-950/98 backdrop-blur-xl text-white p-4 space-y-4 border-t border-amber-500/30 shadow-2xl animate-fade-in max-h-[85vh] overflow-y-auto">
            {/* Mobile Search */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder={animatedSearchPlaceholder || 'Search Jain Connect Global...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-20 py-2.5 text-xs rounded-full bg-slate-900 text-white border border-slate-700 focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                onClick={() => {
                  setIsAISearchOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="absolute right-1 top-1 bottom-1 px-3 bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 text-[10px] font-black rounded-full shadow"
              >
                AI Search
              </button>
            </div>

            {/* Mobile Language Selector */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Select Language / भाषा</span>
                <span className="text-[9px] text-slate-400">Current: {currentLangObj.native}</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGE_OPTIONS.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as any);
                      showToast(
                        `Language Changed: ${lang.native}`,
                        `Interface language set to ${lang.label} (${lang.native}).`,
                        'success'
                      );
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                      language === lang.code
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{lang.native}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Theme Switcher */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5" /> Theme Mode
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setThemeMode('light')}
                  className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border ${
                    themeMode === 'light' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" /> Light
                </button>
                <button
                  onClick={() => setThemeMode('dark')}
                  className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border ${
                    themeMode === 'dark' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" /> Dark
                </button>
                <button
                  onClick={() => setThemeMode('auspicious')}
                  className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border ${
                    themeMode === 'auspicious' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-950" /> Gold
                </button>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Navigation Directory Portals
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleTabClick(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold shadow-md'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-amber-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}

                <button
                  onClick={() => {
                    setIsBhajanModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold bg-amber-950/90 text-amber-300 border border-amber-500/50 shadow-md hover:bg-amber-900"
                >
                  <Music className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">🎵 Bhajans & Songs ({bhajans.filter((b) => b.isActive).length})</span>
                </button>

                {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin') && (
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setIsMobileMenuOpen(false);
                    }}
                    className="col-span-1 sm:col-span-2 flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Control Panel</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile User Profile Summary / Quick Actions */}
            {currentUser && (
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.profilePhoto}
                    alt={currentUser.fullName}
                    className="w-8 h-8 rounded-full border border-amber-400 object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-white truncate max-w-[150px]">{currentUser.fullName}</p>
                    <p className="text-[10px] text-amber-400">{currentUser.registrationType} • {currentUser.role}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold border border-red-500/40 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-amber-500/30 px-1 py-1 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-bold min-h-[44px] min-w-[44px] transition-all ${
            activeTab === 'home' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => handleTabClick('temples')}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-bold min-h-[44px] min-w-[44px] transition-all ${
            activeTab === 'temples' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Temples</span>
        </button>

        <button
          onClick={() => handleTabClick('matrimonial')}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-bold min-h-[44px] min-w-[44px] transition-all ${
            activeTab === 'matrimonial' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4 text-red-500" />
          <span>Rishte</span>
        </button>

        <button
          onClick={() => handleTabClick('business')}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-bold min-h-[44px] min-w-[44px] transition-all ${
            activeTab === 'business' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Vyapar</span>
        </button>

        <button
          onClick={() => setIsBhajanModalOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-bold min-h-[44px] min-w-[44px] text-amber-300 animate-pulse"
        >
          <Music className="w-4 h-4 text-amber-400" />
          <span>Bhajans</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-bold min-h-[44px] min-w-[44px] transition-all ${
            isMobileMenuOpen ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Menu className="w-4 h-4" />
          <span>More</span>
        </button>
      </div>
    </header>
  );
};
