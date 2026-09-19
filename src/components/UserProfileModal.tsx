import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  HeartHandshake,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  Save,
  Briefcase,
  QrCode,
  Award,
  Crown,
  Zap,
  Sparkles,
  Activity,
  BadgeCheck,
  TrendingUp,
  Bell,
  BellRing,
  BellOff,
  Volume2,
  VolumeX,
  Clock,
  Sunrise,
  Sunset,
  Flame,
  Plus,
  Trash2,
  RotateCcw,
  Send,
  Sliders,
  Check,
  HelpCircle,
  Info,
  Bookmark,
  BookmarkCheck,
  ArrowRight
} from 'lucide-react';
import {
  playSubtlePrayerBell,
  getNotificationPermissionStatus,
  requestBrowserNotificationPermission,
  sendPrayerBrowserNotification,
  formatTimeTo12Hour,
  DEFAULT_PRAYER_REMINDERS,
} from '../utils/prayerReminderSound';
import { PrayerReminderItem, PrayerReminderSettings } from '../types';

export const UserProfileModal: React.FC = () => {
  const {
    currentUser,
    isUserProfileModalOpen,
    setIsUserProfileModalOpen,
    setIsDigitalIdModalOpen,
    updateUserProfile,
    userProfileTab,
    setUserProfileTab,
    prayerReminderSettings,
    updatePrayerReminderSettings,
    showToast,
    bloodDonors,
    posts = [],
    businesses = [],
    temples = [],
    matrimonials = [],
    removeSavedRitual,
    openAskPanditWithGuide,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'reminders' | 'donor' | 'rituals'>('profile');

  // Local form state initialized from currentUser
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [company, setCompany] = useState('');
  const [gotra, setGotra] = useState('');
  const [sect, setSect] = useState('Swetambar Murtipujak');

  // Blood Donor Settings
  const [isBloodDonor, setIsBloodDonor] = useState(false);
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [donorCity, setDonorCity] = useState('Mumbai');
  const [donorState, setDonorState] = useState('Maharashtra');
  const [donorMobile, setDonorMobile] = useState('');
  const [donorAvailable, setDonorAvailable] = useState(true);
  const [lastDonatedDate, setLastDonatedDate] = useState('Ready to Donate');

  // Prayer Reminder Local State
  const [localPrayerSettings, setLocalPrayerSettings] = useState<PrayerReminderSettings>(prayerReminderSettings);
  const [browserPermStatus, setBrowserPermStatus] = useState<'granted' | 'denied' | 'default' | 'unsupported'>('default');
  const [isTestingChime, setIsTestingChime] = useState(false);
  const [isTestingNotification, setIsTestingNotification] = useState(false);
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customPrayerName, setCustomPrayerName] = useState('');
  const [customPrayerHindi, setCustomPrayerHindi] = useState('');
  const [customPrayerTime, setCustomPrayerTime] = useState('06:00');
  const [customPrayerCategory, setCustomPrayerCategory] = useState<'samayik' | 'aarti' | 'pratikraman' | 'pachkan' | 'custom'>('samayik');
  const [customPrayerDesc, setCustomPrayerDesc] = useState('');

  // Synchronize when modal opens or userProfileTab changes
  useEffect(() => {
    if (isUserProfileModalOpen) {
      if (userProfileTab) {
        setActiveTab(userProfileTab);
      }
      setBrowserPermStatus(getNotificationPermissionStatus());
    }
  }, [isUserProfileModalOpen, userProfileTab]);

  // Populate form state when currentUser or modal visibility changes
  useEffect(() => {
    if (currentUser) {
      const existingDonor = bloodDonors.find(
        (d) => d.userId === currentUser.id || d.name === currentUser.fullName
      );

      setFullName(currentUser.fullName || '');
      setMobile(currentUser.mobile || '');
      setEmail(currentUser.email || '');
      setCity(currentUser.city || 'Mumbai');
      setState(currentUser.state || 'Maharashtra');
      setAddress(currentUser.address || '');
      setOccupation(currentUser.occupation || '');
      setCompany(currentUser.company || '');
      setGotra(currentUser.gotra || '');
      setSect(currentUser.sect || 'Swetambar Murtipujak');

      setIsBloodDonor(currentUser.isBloodDonor ?? !!existingDonor ?? false);
      setBloodGroup(currentUser.bloodGroup || existingDonor?.bloodGroup || 'O+');
      setDonorCity(currentUser.donorCity || existingDonor?.city || currentUser.city || 'Mumbai');
      setDonorState(currentUser.donorState || existingDonor?.state || currentUser.state || 'Maharashtra');
      setDonorMobile(currentUser.donorMobile || existingDonor?.mobile || currentUser.mobile || '');
      setDonorAvailable(currentUser.donorAvailable ?? existingDonor?.available ?? true);
      setLastDonatedDate(currentUser.lastDonatedDate || existingDonor?.lastDonated || 'Ready to Donate');
    }
  }, [currentUser, isUserProfileModalOpen, bloodDonors]);

  // Sync prayer reminders from context if updated
  useEffect(() => {
    if (prayerReminderSettings) {
      setLocalPrayerSettings(prayerReminderSettings);
    }
  }, [prayerReminderSettings]);

  if (!isUserProfileModalOpen || !currentUser) return null;

  // Request browser notification permission
  const handleRequestPermission = async () => {
    const status = await requestBrowserNotificationPermission();
    setBrowserPermStatus(status);
    if (status === 'granted') {
      setLocalPrayerSettings((prev) => ({
        ...prev,
        browserNotificationsAllowed: true,
      }));
      showToast(
        'Notifications Allowed ✓',
        'You will receive subtle prayer notifications for scheduled Samayik & Aarti timings.',
        'success'
      );
    } else if (status === 'denied') {
      showToast(
        'Notifications Blocked',
        'Browser notifications were denied in your site settings. Subtle temple bell chimes will still sound while this tab is open.',
        'info'
      );
    }
  };

  // Play a test subtle temple bell chime
  const handleTestChime = () => {
    setIsTestingChime(true);
    playSubtlePrayerBell(localPrayerSettings.soundVolume || 0.6);
    showToast('Sacred Temple Chime', 'Sound test played with subtle authentic harmonics.', 'info');
    setTimeout(() => setIsTestingChime(false), 900);
  };

  // Test both chime and browser notification
  const handleTestNotification = () => {
    setIsTestingNotification(true);
    if (localPrayerSettings.soundVolume > 0) {
      playSubtlePrayerBell(localPrayerSettings.soundVolume);
    }

    const testItem: PrayerReminderItem = {
      id: 'test_sample',
      name: 'Samayik & Aarti Test Alert',
      hindiName: 'सामायिक व आरती स्मरण',
      category: 'samayik',
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      enabled: true,
      soundEnabled: true,
      description: 'Jai Jinendra! Your subtle prayer reminder notifications and sacred temple bell chime are functioning perfectly.',
    };

    const sent = sendPrayerBrowserNotification(testItem);
    if (sent) {
      showToast(
        '🙏 Test Prayer Reminder Sent',
        'Subtle browser notification and sacred chime dispatched successfully!',
        'success'
      );
    } else {
      showToast(
        '🙏 Temple Chime Played',
        'Bell chime sounded! (Grant browser notification permission above to enable desktop popups)',
        'info'
      );
    }

    setTimeout(() => setIsTestingNotification(false), 800);
  };

  // Reminder toggles
  const handleToggleReminder = (id: string) => {
    setLocalPrayerSettings((prev) => ({
      ...prev,
      reminders: prev.reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    }));
  };

  const handleToggleReminderSound = (id: string) => {
    setLocalPrayerSettings((prev) => ({
      ...prev,
      reminders: prev.reminders.map((r) => (r.id === id ? { ...r, soundEnabled: !r.soundEnabled } : r)),
    }));
  };

  const handleChangeReminderTime = (id: string, newTime: string) => {
    setLocalPrayerSettings((prev) => ({
      ...prev,
      reminders: prev.reminders.map((r) => (r.id === id ? { ...r, time: newTime } : r)),
    }));
  };

  const handleDeleteReminder = (id: string) => {
    setLocalPrayerSettings((prev) => ({
      ...prev,
      reminders: prev.reminders.filter((r) => r.id !== id),
    }));
  };

  const handleResetToDefaults = () => {
    setLocalPrayerSettings((prev) => ({
      ...prev,
      reminders: DEFAULT_PRAYER_REMINDERS,
    }));
    showToast('Reset to Recommended', 'Prayer timings reset to traditional Jain Samayik and Aarti hours.', 'info');
  };

  const handleAddCustomPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrayerName.trim()) return;

    const newPrayer: PrayerReminderItem = {
      id: `custom_rem_${Date.now()}`,
      name: customPrayerName.trim(),
      hindiName: customPrayerHindi.trim() || undefined,
      category: customPrayerCategory,
      time: customPrayerTime,
      enabled: true,
      soundEnabled: true,
      description: customPrayerDesc.trim() || `Daily ${customPrayerName.trim()} prayer reminder.`,
    };

    setLocalPrayerSettings((prev) => ({
      ...prev,
      reminders: [...prev.reminders, newPrayer],
    }));

    setCustomPrayerName('');
    setCustomPrayerHindi('');
    setCustomPrayerDesc('');
    setShowAddCustomModal(false);
    showToast('Prayer Added', `Added "${newPrayer.name}" to your daily prayer schedule.`, 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Update Profile & Blood Donor
    updateUserProfile(
      {
        fullName,
        mobile,
        email,
        city,
        state,
        address,
        occupation,
        company,
        gotra,
        sect,
        bloodGroup,
        prayerReminderSettings: localPrayerSettings,
      },
      {
        isBloodDonor,
        bloodGroup,
        city: donorCity || city,
        state: donorState || state,
        mobile: donorMobile || mobile,
        available: donorAvailable,
        lastDonated: lastDonatedDate,
      }
    );

    // 2. Persist Prayer Reminder Settings
    updatePrayerReminderSettings(localPrayerSettings);

    showToast(
      'Settings Saved',
      'Profile details, prayer reminder preferences, and donor settings updated successfully.',
      'success'
    );
    setIsUserProfileModalOpen(false);
  };

  const bloodGroups = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];

  // Dynamic Platform Activity & Badge Calculations
  const userPostsCount = posts.filter(
    (p) => p.authorId === currentUser?.id || p.authorName === currentUser?.fullName
  ).length;

  const userBusinessesCount = businesses.filter(
    (b) => b.ownerId === currentUser?.id || b.ownerName === currentUser?.fullName
  ).length;

  const userTemplesCount = temples.filter(
    (t) => t.contactPerson === currentUser?.fullName
  ).length;

  const userMatrimonialsCount = matrimonials.filter(
    (m) => m.userId === currentUser?.id || m.fullName === currentUser?.fullName
  ).length;

  const isDonorActive = isBloodDonor && donorAvailable;
  const isVerifiedBadge = Boolean(currentUser?.isVerified || currentUser?.isPhoneVerified);
  const isActiveContributorBadge = userPostsCount > 0 || isDonorActive || userBusinessesCount > 0;
  const isCommunityLeaderBadge =
    currentUser?.role === 'Admin' ||
    currentUser?.role === 'SuperAdmin' ||
    userTemplesCount > 0 ||
    (userPostsCount >= 2 && userBusinessesCount >= 1);

  const unlockedBadgesCount = [isVerifiedBadge, isActiveContributorBadge, isCommunityLeaderBadge].filter(Boolean).length;
  const activeRemindersCount = localPrayerSettings.reminders.filter((r) => r.enabled).length;

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'samayik':
        return 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'aarti':
        return 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700';
      case 'pratikraman':
        return 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700';
      case 'pachkan':
        return 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-full border-2 border-white/80 overflow-hidden shadow-md shrink-0">
              <img
                src={currentUser.profilePhoto}
                alt={currentUser.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold font-serif">{currentUser.fullName}</h2>
              </div>
              <p className="text-xs text-amber-200 font-medium">
                {currentUser.role} • {currentUser.registrationType} Profile
              </p>

              {/* Header Badges Bar */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {isVerifiedBadge && (
                  <span className="px-2.5 py-0.5 bg-emerald-500/90 text-white text-[10px] font-extrabold rounded-full flex items-center gap-1 shadow-sm border border-emerald-300/40">
                    <ShieldCheck className="w-3 h-3 text-emerald-100" />
                    Verified
                  </span>
                )}
                {isActiveContributorBadge && (
                  <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-extrabold rounded-full flex items-center gap-1 shadow-sm border border-amber-200">
                    <Award className="w-3 h-3 text-slate-950" />
                    Active Contributor
                  </span>
                )}
                {isCommunityLeaderBadge && (
                  <span className="px-2.5 py-0.5 bg-purple-600 text-white text-[10px] font-extrabold rounded-full flex items-center gap-1 shadow-sm border border-purple-300/40">
                    <Crown className="w-3 h-3 text-amber-300" />
                    Community Leader
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsUserProfileModalOpen(false);
                setIsDigitalIdModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm border border-white/30"
              title="Open QR Code Digital ID Card"
            >
              <QrCode className="w-4 h-4 text-amber-200" />
              <span className="hidden sm:inline">QR Digital ID</span>
            </button>

            <button
              onClick={() => setIsUserProfileModalOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body & Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Settings Section Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => {
                setActiveTab('profile');
                setUserProfileTab('profile');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'profile'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Profile Details</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('reminders');
                setUserProfileTab('reminders');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'reminders'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BellRing className="w-3.5 h-3.5 text-amber-500" />
              <span>Prayer Reminders</span>
              {localPrayerSettings.enabled ? (
                <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full leading-none">
                  {activeRemindersCount} Active
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium leading-none">Off</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('donor');
                setUserProfileTab('donor');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'donor'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-red-500" />
              <span>Blood Donor</span>
              {isBloodDonor && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full leading-none">
                  {bloodGroup}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('rituals');
                setUserProfileTab('rituals');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'rituals'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>Saved Rituals</span>
              <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full leading-none">
                {currentUser?.savedRituals?.length || 0}
              </span>
            </button>
          </div>

          {/* TAB 1: PROFILE DETAILS */}
          {activeTab === 'profile' && (
            <div className="space-y-5 animate-fade-in">
              {/* Section: Member Status & Activity Badges */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-900/5 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-950/60 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    Member Status & Platform Badges
                  </h3>
                  <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2.5 py-0.5 rounded-full border border-amber-300/50">
                    {unlockedBadgesCount} / 3 Badges Unlocked
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Verified Badge Card */}
                  <div
                    className={`p-3 rounded-xl border transition-all ${
                      isVerifiedBadge
                        ? 'bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-slate-900 dark:text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isVerifiedBadge
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-xs block leading-tight">Verified</span>
                        <span
                          className={`text-[10px] font-bold ${
                            isVerifiedBadge ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'
                          }`}
                        >
                          {isVerifiedBadge ? 'Unlocked ✓' : 'Pending Verification'}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                      Identity & mobile number verified on Jain Connect Global.
                    </p>
                  </div>

                  {/* Active Contributor Badge Card */}
                  <div
                    className={`p-3 rounded-xl border transition-all ${
                      isActiveContributorBadge
                        ? 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-slate-900 dark:text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isActiveContributorBadge
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-xs block leading-tight">Active Contributor</span>
                        <span
                          className={`text-[10px] font-bold ${
                            isActiveContributorBadge ? 'text-amber-700 dark:text-amber-400' : 'text-slate-400'
                          }`}
                        >
                          {isActiveContributorBadge ? 'Unlocked ✓' : 'Not Active Yet'}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                      Participates in community posts, blood donation, or directory listings.
                    </p>
                  </div>

                  {/* Community Leader Badge Card */}
                  <div
                    className={`p-3 rounded-xl border transition-all ${
                      isCommunityLeaderBadge
                        ? 'bg-purple-500/10 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800 text-slate-900 dark:text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isCommunityLeaderBadge
                            ? 'bg-purple-600 text-amber-300 shadow-sm'
                            : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        <Crown className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-xs block leading-tight">Community Leader</span>
                        <span
                          className={`text-[10px] font-bold ${
                            isCommunityLeaderBadge ? 'text-purple-700 dark:text-purple-400' : 'text-slate-400'
                          }`}
                        >
                          {isCommunityLeaderBadge ? 'Unlocked ✓' : 'Locked'}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                      Holds admin role, temple leadership, or multi-service community activity.
                    </p>
                  </div>
                </div>

                {/* Live Activity Breakdown Metrics */}
                <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold">
                      <Activity className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      Feed Posts: <strong>{userPostsCount}</strong>
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <HeartHandshake className="w-3.5 h-3.5 text-red-500" />
                      Blood Donor: <strong>{isDonorActive ? 'Registered' : 'Not Registered'}</strong>
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <Building className="w-3.5 h-3.5 text-blue-500" />
                      Listings: <strong>{userBusinessesCount + userTemplesCount + userMatrimonialsCount}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-800 dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-300/40">
                    Tier: {currentUser?.membershipTier || 'Free'} Member
                  </span>
                </div>
              </div>

              {/* Basic Profile Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <User className="w-4 h-4" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (!donorCity) setDonorCity(e.target.value);
                      }}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      State / Province *
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        if (!donorState) setDonorState(e.target.value);
                      }}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Residential Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 402, Jain Derasar Lane"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Occupation / Business
                    </label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="e.g. Textile Merchant, CA, Engineer"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Firm / Company Name
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Vardhman Textiles"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Jain Sect *
                    </label>
                    <select
                      value={sect}
                      onChange={(e) => setSect(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                    >
                      <option value="Swetambar Murtipujak">Swetambar Murtipujak</option>
                      <option value="Swetambar Sthanakvasi">Swetambar Sthanakvasi</option>
                      <option value="Swetambar Terapanthi">Swetambar Terapanthi</option>
                      <option value="Digambar Bispanthi">Digambar Bispanthi</option>
                      <option value="Digambar Terapanthi">Digambar Terapanthi</option>
                      <option value="Digambar Taranpanthi">Digambar Taranpanthi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Gotra / Kul
                    </label>
                    <input
                      type="text"
                      value={gotra}
                      onChange={(e) => setGotra(e.target.value)}
                      placeholder="e.g. Bachhawat, Lodha, Doshi"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRAYER REMINDERS (SAMAYIK & AARTI) */}
          {activeTab === 'reminders' && (
            <div className="space-y-5 animate-fade-in">
              {/* Master Opt-in Card */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50/40 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-950 rounded-2xl border border-amber-300/80 dark:border-amber-800/80 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 shadow-md shrink-0 mt-0.5">
                      <BellRing className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                          Daily Prayer Reminders (दैनिक सामायिक व आरती स्मरण)
                        </h3>
                        {localPrayerSettings.enabled && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40 text-[10px] font-black rounded-full">
                            Enabled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        Opt-in to receive subtle, time-based browser notifications for daily Samayik, Aarti, and Chauvihar timings.
                      </p>
                    </div>
                  </div>

                  {/* Master Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={localPrayerSettings.enabled}
                      onChange={(e) => {
                        const newEnabled = e.target.checked;
                        setLocalPrayerSettings((prev) => ({
                          ...prev,
                          enabled: newEnabled,
                        }));
                        if (newEnabled && browserPermStatus === 'default') {
                          handleRequestPermission();
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                {/* If Enabled: Browser Notification Permission Status & Test Alert */}
                {localPrayerSettings.enabled && (
                  <div className="pt-3 border-t border-amber-200 dark:border-amber-800/60 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-xs">
                        {browserPermStatus === 'granted' ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className="text-emerald-800 dark:text-emerald-300 font-bold">
                              Browser Notifications Active & Permitted
                            </span>
                          </>
                        ) : browserPermStatus === 'denied' ? (
                          <>
                            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            <span className="text-rose-800 dark:text-rose-300 font-bold">
                              Notifications blocked in browser. (Temple chime will play while tab is open)
                            </span>
                          </>
                        ) : (
                          <>
                            <Bell className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                              Allow browser notifications to receive alerts when visiting other tabs
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {browserPermStatus !== 'granted' && browserPermStatus !== 'unsupported' && (
                          <button
                            type="button"
                            onClick={handleRequestPermission}
                            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                          >
                            <Bell className="w-3.5 h-3.5" />
                            <span>Allow Notifications</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={handleTestNotification}
                          disabled={isTestingNotification}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-1.5"
                          title="Trigger a test reminder notification and sound chime right now"
                        >
                          <Send className={`w-3 h-3 ${isTestingNotification ? 'animate-spin' : ''}`} />
                          <span>Send Test Reminder</span>
                        </button>
                      </div>
                    </div>

                    {/* Subtle Temple Sound Settings */}
                    <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">
                            Subtle Temple Bell Chime
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            Plays a serene, gentle brass bell chime (D5 harmonic) upon scheduled time.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.05"
                            value={localPrayerSettings.soundVolume}
                            onChange={(e) =>
                              setLocalPrayerSettings((prev) => ({
                                ...prev,
                                soundVolume: parseFloat(e.target.value),
                              }))
                            }
                            className="w-24 accent-amber-600 cursor-pointer"
                            title={`Volume: ${Math.round(localPrayerSettings.soundVolume * 100)}%`}
                          />
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 w-7">
                            {Math.round(localPrayerSettings.soundVolume * 100)}%
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={handleTestChime}
                          disabled={isTestingChime}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] shadow-sm flex items-center gap-1 transition-all"
                        >
                          <Sparkles className={`w-3 h-3 ${isTestingChime ? 'animate-spin' : ''}`} />
                          <span>Preview Bell</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Scheduled Timings List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      Daily Scheduled Prayers ({localPrayerSettings.reminders.length})
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Configure your morning and evening timings for Samayik, Aarti, and sacred vows.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCustomModal(!showAddCustomModal)}
                      className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800 font-bold text-xs flex items-center gap-1 border border-amber-300/60 dark:border-amber-700 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Custom</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetToDefaults}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs transition-colors"
                      title="Reset to recommended standard timings"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Add Custom Prayer Form */}
                {showAddCustomModal && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Add Custom Daily Prayer Timing
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowAddCustomModal(false)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Prayer Title *
                        </label>
                        <input
                          type="text"
                          value={customPrayerName}
                          onChange={(e) => setCustomPrayerName(e.target.value)}
                          placeholder="e.g. Bhaktamar Path"
                          className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Hindi Subtitle
                        </label>
                        <input
                          type="text"
                          value={customPrayerHindi}
                          onChange={(e) => setCustomPrayerHindi(e.target.value)}
                          placeholder="e.g. भक्तामर स्तोत्र पाठ"
                          className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Scheduled Time (24h) *
                        </label>
                        <input
                          type="time"
                          value={customPrayerTime}
                          onChange={(e) => setCustomPrayerTime(e.target.value)}
                          className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="w-full sm:flex-1">
                        <input
                          type="text"
                          value={customPrayerDesc}
                          onChange={(e) => setCustomPrayerDesc(e.target.value)}
                          placeholder="Short reminder note (e.g. Recite 48 slokas with devotion)"
                          className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddCustomPrayer}
                        className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Prayer Reminder</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Reminder Items List */}
                <div className="space-y-2.5">
                  {localPrayerSettings.reminders.map((reminder) => {
                    const isCustom = reminder.id.startsWith('custom_');
                    return (
                      <div
                        key={reminder.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          reminder.enabled && localPrayerSettings.enabled
                            ? 'bg-white dark:bg-slate-900 border-amber-200 dark:border-slate-800 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Left: Info & Badges */}
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={() => handleToggleReminder(reminder.id)}
                              className={`p-2 rounded-xl border mt-0.5 transition-colors ${
                                reminder.enabled && localPrayerSettings.enabled
                                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700'
                              }`}
                              title={reminder.enabled ? 'Click to disable' : 'Click to enable'}
                            >
                              {reminder.category === 'samayik' ? (
                                <Sunrise className="w-4 h-4" />
                              ) : reminder.category === 'aarti' ? (
                                <Flame className="w-4 h-4" />
                              ) : (
                                <Sparkles className="w-4 h-4" />
                              )}
                            </button>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-xs text-slate-900 dark:text-white">
                                  {reminder.name}
                                </span>
                                {reminder.hindiName && (
                                  <span className="text-[11px] text-amber-800 dark:text-amber-400 font-medium">
                                    • {reminder.hindiName}
                                  </span>
                                )}
                                <span
                                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border ${getCategoryBadgeClass(
                                    reminder.category
                                  )}`}
                                >
                                  {reminder.category}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                {reminder.description}
                              </p>
                            </div>
                          </div>

                          {/* Right: Time Picker, Chime Toggle & Actions */}
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {/* Time input */}
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              <input
                                type="time"
                                value={reminder.time}
                                onChange={(e) => handleChangeReminderTime(reminder.id, e.target.value)}
                                className="bg-transparent text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                              />
                              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 pl-1 border-l border-slate-300 dark:border-slate-700">
                                {formatTimeTo12Hour(reminder.time)}
                              </span>
                            </div>

                            {/* Sound toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleReminderSound(reminder.id)}
                              className={`p-1.5 rounded-xl border transition-colors ${
                                reminder.soundEnabled
                                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                              }`}
                              title={reminder.soundEnabled ? 'Temple chime enabled' : 'Temple chime muted'}
                            >
                              {reminder.soundEnabled ? (
                                <Volume2 className="w-3.5 h-3.5" />
                              ) : (
                                <VolumeX className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Individual Toggle */}
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={reminder.enabled}
                                onChange={() => handleToggleReminder(reminder.id)}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                            </label>

                            {/* Delete custom reminder */}
                            {isCustom && (
                              <button
                                type="button"
                                onClick={() => handleDeleteReminder(reminder.id)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                title="Remove custom prayer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Spiritual Note */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Spiritual Significance:</strong> Performing daily Samayik (48 minutes) and attending Aarti brings calmness (समता भाव), cleanses Karmic dust, and anchors our modern fast-paced day in devotion and introspection.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: BLOOD DONOR LIFELINE */}
          {activeTab === 'donor' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 sm:p-5 bg-gradient-to-br from-red-500/10 via-red-500/5 to-slate-900/5 dark:from-red-950/30 dark:via-slate-900 dark:to-slate-950 rounded-2xl border border-red-200 dark:border-red-900/50 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-2xl bg-red-500 text-white shadow-md shrink-0 mt-0.5">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-red-950 dark:text-red-200">
                        Jain Emergency Blood Donor Lifeline (रक्तदान सेवा)
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        Join our life-saving volunteer network to donate blood when community members or hospital patients urgently need matching blood.
                      </p>
                    </div>
                  </div>

                  {/* Donor Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={isBloodDonor}
                      onChange={(e) => setIsBloodDonor(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                {isBloodDonor && (
                  <div className="pt-3 border-t border-red-200 dark:border-red-900/40 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Blood Group *
                        </label>
                        <select
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none"
                        >
                          {bloodGroups.map((bg) => (
                            <option key={bg} value={bg}>
                              {bg}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Donor Contact Mobile *
                        </label>
                        <input
                          type="text"
                          value={donorMobile}
                          onChange={(e) => setDonorMobile(e.target.value)}
                          placeholder={mobile || 'Mobile Number'}
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Availability Status
                        </label>
                        <select
                          value={donorAvailable ? 'yes' : 'no'}
                          onChange={(e) => setDonorAvailable(e.target.value === 'yes')}
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none"
                        >
                          <option value="yes">Available to Donate</option>
                          <option value="no">Temporarily Unavailable</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          City of Donation *
                        </label>
                        <input
                          type="text"
                          value={donorCity}
                          onChange={(e) => setDonorCity(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          value={donorState}
                          onChange={(e) => setDonorState(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Last Donated Date
                        </label>
                        <input
                          type="text"
                          value={lastDonatedDate}
                          onChange={(e) => setLastDonatedDate(e.target.value)}
                          placeholder="e.g. 2026-05-10 or Ready First Time"
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium outline-none"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-red-100/70 dark:bg-red-900/30 rounded-xl text-[11px] text-red-800 dark:text-red-200 flex items-start gap-2 border border-red-200 dark:border-red-800">
                      <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>
                        Your blood group and contact details will be respectfully listed in the Emergency Directory tab so families in urgent medical need can quickly reach out to you.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SAVED PUJA RITUALS */}
          {activeTab === 'rituals' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-900/5 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-950/60 rounded-2xl border border-amber-200 dark:border-amber-800/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg">
                      🪔
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                        Bookmarked Puja Procedures
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {currentUser?.savedRituals?.length || 0} saved rituals in your personal profile for quick access during sadhana.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserProfileModalOpen(false);
                      openAskPanditWithGuide('');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto shrink-0"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Explore All 6 Guides</span>
                  </button>
                </div>
              </div>

              {(!currentUser?.savedRituals || currentUser.savedRituals.length === 0) ? (
                <div className="text-center py-12 px-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto text-xl">
                    ✨
                  </div>
                  <h4 className="font-serif font-bold text-base text-slate-800 dark:text-slate-200">
                    No Saved Puja Procedures Yet
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Bookmark your family's favorite puja procedures — such as Ashtaprakari Puja, Jinendra Abhishek & Snatra, Samayik Vidhi, or Evening Aarti — to access them quickly during temple or home rituals.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserProfileModalOpen(false);
                      openAskPanditWithGuide('ashtaprakari');
                    }}
                    className="mt-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Start Ashtaprakari Puja Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentUser.savedRituals.map((ritual) => (
                    <div
                      key={ritual.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400">
                            <BookmarkCheck className="w-4 h-4 fill-current" />
                          </span>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                            {ritual.title}
                          </h4>
                          {ritual.hindiTitle && (
                            <span className="text-xs text-amber-800 dark:text-amber-300 font-serif">
                              ({ritual.hindiTitle})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400 pl-6">
                          {ritual.tradition && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300/40">
                              {ritual.tradition}
                            </span>
                          )}
                          {ritual.category && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {ritual.category}
                            </span>
                          )}
                          {ritual.durationMinutes && (
                            <span className="flex items-center gap-1 text-[11px]">
                              <Clock className="w-3 h-3 text-slate-400" />
                              ~{ritual.durationMinutes} mins
                            </span>
                          )}
                          {ritual.totalSteps && (
                            <span className="text-[11px]">
                              • {ritual.totalSteps} steps
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400">
                            • Saved {new Date(ritual.savedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserProfileModalOpen(false);
                            openAskPanditWithGuide(ritual.id);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                        >
                          <span>Open Guide</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeSavedRitual(ritual.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Remove saved ritual"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] text-slate-400">
              {activeTab === 'reminders' ? (
                <span>
                  {localPrayerSettings.enabled
                    ? `${activeRemindersCount} prayer timings active`
                    : 'Prayer reminders disabled'}
                </span>
              ) : activeTab === 'donor' ? (
                <span>{isBloodDonor ? `Blood Donor: ${bloodGroup}` : 'Not registered as donor'}</span>
              ) : activeTab === 'rituals' ? (
                <span>{currentUser?.savedRituals?.length || 0} Bookmarked Puja Rituals</span>
              ) : (
                <span>Logged in as {currentUser.fullName}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsUserProfileModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
