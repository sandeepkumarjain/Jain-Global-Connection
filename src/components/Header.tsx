import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
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
  AlertCircle
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    themeMode,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    setIsAuthModalOpen,
    setIsRegModalOpen,
    setIsAISearchOpen,
    setIsMembershipModalOpen,
    notifications,
    logout,
    systemSettings,
    showToast,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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

  const languages = ['English', 'Hindi', 'Gujarati', 'Marwari', 'Kannada', 'Tamil', 'Telugu'] as const;

  const navItems = [
    { id: 'home', label: 'Home', icon: Globe },
    { id: 'matrimonial', label: 'Matrimonial', icon: Heart },
    { id: 'business', label: 'Business Directory', icon: Building2 },
    { id: 'directory', label: 'Jain Directory', icon: Users },
    { id: 'temple', label: 'Temple Directory', icon: MapPin },
    { id: 'panchang', label: 'Panchang & Quotes', icon: Calendar },
    { id: 'feed', label: 'Community Feed', icon: MessageSquare },
    { id: 'emergency', label: 'Services & Emergency', icon: AlertCircle },
  ];

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-50 w-full transition-colors duration-300">
      {/* Top Ticker & Utility Bar */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-amber-100 text-xs py-1.5 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Ticker Text */}
          <div className="flex items-center gap-2 overflow-hidden w-full md:w-auto">
            <span className="bg-amber-500 text-amber-950 font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase shrink-0">
              OFFICIAL
            </span>
            <p className="truncate font-medium text-amber-200/90 text-[11px]">
              {systemSettings.announcementTicker}
            </p>
          </div>

          {/* Quick Info & Admin Indicator */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5 text-amber-200">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-medium">Developed by {systemSettings.developerName}</span>
            </div>

            {/* Language Switcher */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-amber-200 hover:text-white transition-colors text-[11px]">
                <Globe className="w-3 h-3 text-amber-400" />
                <span>{language}</span>
              </button>
              <div className="absolute right-0 mt-1 hidden group-hover:block bg-slate-900 text-white rounded-lg shadow-xl border border-amber-500/20 py-1 w-32 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang as any)}
                    className={`w-full text-left px-3 py-1 text-xs hover:bg-amber-600/30 transition-colors ${
                      language === lang ? 'text-amber-400 font-bold bg-amber-900/30' : 'text-slate-300'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-1 rounded-full text-amber-200 hover:text-white hover:bg-amber-800/40 transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {themeMode === 'light' ? <Moon className="w-3.5 h-3.5 text-amber-300" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Glassmorphism Header */}
      <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-amber-200/40 dark:border-amber-900/40 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Logo & Branding */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300">
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
                <span className="text-amber-400 font-black text-xl tracking-tighter">JC</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-serif">
                  JAIN CONNECT
                </h1>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                  GLOBAL
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                One Platform for Every Jain, Business & Temple
              </p>
            </div>
          </div>

          {/* Global Search Bar with Voice & AI Assistant Button */}
          <div className="hidden md:flex flex-1 max-w-md relative items-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search Businesses, Temples, Members, Matrimonial..."
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Membership Upgrade Button */}
            <button
              onClick={() => setIsMembershipModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 hover:bg-amber-200 rounded-full text-xs font-semibold transition-all shadow-sm"
            >
              <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Membership</span>
            </button>

            {/* Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notif Popup */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50">
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
                  className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-amber-300/50 hover:border-amber-500 transition-all"
                >
                  <img
                    src={currentUser.profilePhoto}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-amber-400"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[100px]">
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
                        setIsRegModalOpen(true);
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login / Admin</span>
                </button>
                <button
                  onClick={() => setIsRegModalOpen(true)}
                  className="hidden sm:flex px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-full text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-500" />
                  <span>Register</span>
                </button>
              </div>
            )}

            {/* Mobile Navigation Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="hidden md:block bg-slate-900/95 dark:bg-slate-950 text-amber-100 border-t border-amber-500/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-all border-b-2 whitespace-nowrap ${
                      isActive
                        ? 'border-amber-400 text-amber-300 bg-amber-900/30 font-bold'
                        : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Admin Panel Tab highlight if Admin */}
              {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin') && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-extrabold transition-all border-b-2 whitespace-nowrap ${
                    activeTab === 'admin'
                      ? 'border-amber-400 text-amber-300 bg-amber-900/50'
                      : 'border-amber-500/40 text-amber-400 hover:bg-amber-950/40'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Admin Panel</span>
                </button>
              )}
            </div>

            {/* Quick Login Info */}
            {currentUser?.email === 'sandeepbachhawat1@gmail.com' && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-mono font-bold shrink-0">
                Logged in as Super Admin
              </span>
            )}
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900 text-white p-4 space-y-3 border-t border-amber-500/30">
            {/* Mobile Search */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search Jain Connect Global..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-20 py-2 text-xs rounded-full bg-slate-800 text-white border border-slate-700"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <button
                onClick={() => {
                  setIsAISearchOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="absolute right-1 top-1 bottom-1 px-2.5 bg-amber-600 text-white text-[10px] font-bold rounded-full"
              >
                AI Search
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="grid grid-cols-2 gap-2 pt-2">
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
                    className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold ${
                      isActive ? 'bg-amber-600 text-white font-bold' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}

              {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin') && (
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="col-span-2 flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-extrabold bg-amber-500 text-slate-950"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Control Panel</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
