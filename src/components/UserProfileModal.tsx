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
  TrendingUp
} from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const {
    currentUser,
    isUserProfileModalOpen,
    setIsUserProfileModalOpen,
    setIsDigitalIdModalOpen,
    updateUserProfile,
    bloodDonors,
    posts = [],
    businesses = [],
    temples = [],
    matrimonials = [],
  } = useApp();

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

  if (!isUserProfileModalOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    setIsUserProfileModalOpen(false);
  };

  const bloodGroups = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];

  // Dynamic Platform Activity & Badge Calculations
  const userPostsCount = posts.filter(
    (p) => p.authorId === currentUser?.id || p.authorName === currentUser?.fullName
  ).length;

  const userBusinessesCount = businesses.filter(
    (b) =>
      b.ownerId === currentUser?.id ||
      (currentUser?.email && b.email?.toLowerCase() === currentUser?.email.toLowerCase())
  ).length;

  const userTemplesCount = temples.filter(
    (t) =>
      t.createdBy === currentUser?.id ||
      (currentUser?.email && t.contactEmail?.toLowerCase() === currentUser?.email.toLowerCase())
  ).length;

  const userMatrimonialsCount = matrimonials.filter(
    (m) =>
      m.userId === currentUser?.id ||
      (currentUser?.email && m.contactEmail?.toLowerCase() === currentUser?.email.toLowerCase())
  ).length;

  const isDonorActive =
    currentUser?.isBloodDonor ||
    bloodDonors.some(
      (d) =>
        d.userId === currentUser?.id ||
        (currentUser?.email && d.email?.toLowerCase() === currentUser?.email.toLowerCase()) ||
        (currentUser?.mobile && d.mobile === currentUser?.mobile)
    );

  const isVerifiedBadge =
    Boolean(currentUser?.isVerified) ||
    Boolean(currentUser?.isPhoneVerified) ||
    currentUser?.status === 'Approved';

  const isActiveContributorBadge =
    isDonorActive ||
    userPostsCount > 0 ||
    userBusinessesCount > 0 ||
    userMatrimonialsCount > 0 ||
    currentUser?.membershipTier === 'Premium' ||
    currentUser?.membershipTier === 'Elite';

  const isCommunityLeaderBadge =
    ['Super Admin', 'Admin', 'Moderator', 'Temple Admin', 'Business Owner'].includes(
      currentUser?.role || ''
    ) ||
    currentUser?.registrationType === 'NGO' ||
    currentUser?.registrationType === 'Trust' ||
    userTemplesCount > 0 ||
    (userBusinessesCount > 0 && isDonorActive && userPostsCount > 0);

  const unlockedBadgesCount = [isVerifiedBadge, isActiveContributorBadge, isCommunityLeaderBadge].filter(Boolean).length;

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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
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
          
          {/* Section 1: Basic Profile Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <User className="w-4 h-4" />
              Member Profile Settings
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
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
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
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
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
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
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
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Gotra / Family Lineage
                </label>
                <input
                  type="text"
                  value={gotra}
                  onChange={(e) => setGotra(e.target.value)}
                  placeholder="e.g. Bachhawat, Mehta, Shah"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Occupation / Profession
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Software Engineer, Business Owner"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jain Sect
                </label>
                <select
                  value={sect}
                  onChange={(e) => setSect(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Swetambar Murtipujak">Swetambar Murtipujak</option>
                  <option value="Swetambar Sthanakvasi">Swetambar Sthanakvasi</option>
                  <option value="Swetambar Terapanthi">Swetambar Terapanthi</option>
                  <option value="Digambar Bisapanthi">Digambar Bisapanthi</option>
                  <option value="Digambar Terapanthi">Digambar Terapanthi</option>
                  <option value="Digambar Taranpanthi">Digambar Taranpanthi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Blood Donor Registration & Settings */}
          <div className="p-5 bg-gradient-to-br from-red-50 via-white to-red-50/50 dark:from-red-950/40 dark:via-slate-900 dark:to-red-950/20 rounded-2xl border-2 border-red-200 dark:border-red-900/60 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-red-200 dark:border-red-900/50">
              <div>
                <h3 className="text-sm font-extrabold text-red-900 dark:text-red-300 flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-red-600 animate-pulse" />
                  Jain Emergency Blood Donor Signup
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Save lives in your city during urgent medical emergencies.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={isBloodDonor}
                  onChange={(e) => setIsBloodDonor(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-red-600"></div>
                <span className="ml-2 text-xs font-bold text-red-900 dark:text-red-200">
                  {isBloodDonor ? 'Active Blood Donor' : 'Not Registered'}
                </span>
              </label>
            </div>

            {isBloodDonor && (
              <div className="space-y-4 text-xs animate-fade-in pt-1">
                
                {/* Blood Group Selection Chips */}
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Select Your Blood Group *
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {bloodGroups.map((bg) => (
                      <button
                        type="button"
                        key={bg}
                        onClick={() => setBloodGroup(bg)}
                        className={`py-2 rounded-xl text-xs font-black transition-all ${
                          bloodGroup === bg
                            ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400 scale-105'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/40'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Donor Contact & City Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Donor Location City *
                    </label>
                    <input
                      type="text"
                      value={donorCity}
                      onChange={(e) => setDonorCity(e.target.value)}
                      placeholder="e.g. Mumbai, Bikaner, Surat"
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Emergency Contact Phone Number *
                    </label>
                    <input
                      type="text"
                      value={donorMobile}
                      onChange={(e) => setDonorMobile(e.target.value)}
                      placeholder="+91 98000 00000"
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Availability Status
                    </label>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setDonorAvailable(true)}
                        className={`flex-1 py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                          donorAvailable
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Available Now
                      </button>
                      <button
                        type="button"
                        onClick={() => setDonorAvailable(false)}
                        className={`flex-1 py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                          !donorAvailable
                            ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        Temporarily Away
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Last Donated Date / Note
                    </label>
                    <input
                      type="text"
                      value={lastDonatedDate}
                      onChange={(e) => setLastDonatedDate(e.target.value)}
                      placeholder="e.g. 2026-05-10 or Ready First Time"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div className="p-3 bg-red-100/70 dark:bg-red-900/30 rounded-xl text-[11px] text-red-800 dark:text-red-200 flex items-start gap-2 border border-red-200 dark:border-red-800">
                  <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>
                    Your blood group and city will be listed in the Emergency Directory tab so community members in urgent need of blood can connect with you.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsUserProfileModalOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile & Donor Settings</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
