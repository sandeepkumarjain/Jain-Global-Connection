import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, AdBanner, BhajanSong } from '../types';
import {
  ShieldCheck,
  UserCheck,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Settings,
  Sparkles,
  Users,
  Building2,
  Heart,
  MapPin,
  Megaphone,
  Save,
  Lock,
  Plus,
  Eye,
  X,
  Phone,
  Mail,
  FileText,
  Tag,
  Calendar,
  Globe,
  Trash2,
  Music,
  Play,
  Pause,
  Radio
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    users,
    matrimonials,
    businesses,
    temples,
    ads,
    bhajans,
    addBhajan,
    updateBhajan,
    deleteBhajan,
    toggleBhajanActive,
    isPlayingSong,
    currentSong,
    togglePlaySong,
    approveUser,
    rejectUser,
    suspendUser,
    toggleUserVerification,
    systemSettings,
    updateSystemSettings,
    addAd,
    deleteAd,
    currentUser,
    showToast
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'pending' | 'members' | 'ads' | 'bhajans' | 'settings'>('pending');

  // Pending User Modal State
  const [viewingPendingUser, setViewingPendingUser] = useState<User | null>(null);

  // Bhajan / Song Form State
  const [songTitle, setSongTitle] = useState('');
  const [songHindiTitle, setSongHindiTitle] = useState('');
  const [songCategory, setSongCategory] = useState<'Navkar Mantra' | 'Stavan' | 'Bhajan' | 'Aarti' | 'Bhaktamar' | 'Stuti'>('Stavan');
  const [songSinger, setSongSinger] = useState('');
  const [songAudioUrl, setSongAudioUrl] = useState('');
  const [songLyrics, setSongLyrics] = useState('');

  // Ad Form State
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [adTitle, setAdTitle] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adSponsorName, setAdSponsorName] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adOfferDiscount, setAdOfferDiscount] = useState('');
  const [adContactMobile, setAdContactMobile] = useState('');
  const [adExpiryDate, setAdExpiryDate] = useState('');
  const [adLinkUrl, setAdLinkUrl] = useState('');

  // Comprehensive Settings State
  const [themePrimaryColor, setThemePrimaryColor] = useState(systemSettings.themePrimaryColor || 'amber');
  const [appName, setAppName] = useState(systemSettings.appName);
  const [tagline, setTagline] = useState(systemSettings.tagline);
  const [ticker, setTicker] = useState(systemSettings.announcementTicker);
  const [heroTitle, setHeroTitle] = useState(systemSettings.heroHeadline);
  const [heroSub, setHeroSub] = useState(systemSettings.heroSubheadline);
  const [devName, setDevName] = useState(systemSettings.developerName);
  const [contactPhone, setContactPhone] = useState(systemSettings.contactPhone);
  const [contactEmail, setContactEmail] = useState(systemSettings.contactEmail);
  const [address, setAddress] = useState(systemSettings.address);
  const [aboutTitle, setAboutTitle] = useState(systemSettings.aboutTitle || 'Welcome to Jain Connect Global');
  const [aboutDescription, setAboutDescription] = useState(
    systemSettings.aboutDescription || 'One Unified Platform for Every Jain, Every Business, Every Temple, Every Family Worldwide.'
  );
  const [matrimonialHeading, setMatrimonialHeading] = useState(systemSettings.matrimonialHeading || '1. Jain Matrimonial Bureau');
  const [businessHeading, setBusinessHeading] = useState(systemSettings.businessHeading || '2. Jain Business & Commercial Directory');
  const [templeHeading, setTempleHeading] = useState(systemSettings.templeHeading || '3. Holy Jain Temple & Tirth Directory');
  const [directoryHeading, setDirectoryHeading] = useState(systemSettings.directoryHeading || '4. Jain Family & Community Directory');

  const pendingUsers = users.filter((u) => u.status === 'Pending Approval');
  const approvedUsers = users.filter((u) => u.status === 'Approved');

  const handleSelectBusinessForAd = (bizId: string) => {
    setSelectedBusinessId(bizId);
    const found = businesses.find((b) => b.id === bizId);
    if (found) {
      setAdSponsorName(found.businessName);
      setAdContactMobile(found.mobile || systemSettings.contactPhone);
      setAdDescription(found.description);
      if (found.logoUrl) setAdImageUrl(found.logoUrl);
      if (found.website) setAdLinkUrl(found.website);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings({
      themePrimaryColor,
      appName,
      tagline,
      announcementTicker: ticker,
      heroHeadline: heroTitle,
      heroSubheadline: heroSub,
      developerName: devName,
      contactPhone,
      contactEmail,
      address,
      aboutTitle,
      aboutDescription,
      matrimonialHeading,
      businessHeading,
      templeHeading,
      directoryHeading,
    });
    showToast('Settings Saved', 'Theme color palette & website wordings updated across the platform.', 'success');
  };

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle || !adImageUrl) return;

    const linkedBiz = businesses.find((b) => b.id === selectedBusinessId);

    addAd({
      title: adTitle,
      imageUrl: adImageUrl,
      linkUrl: adLinkUrl || '#',
      sponsorName: adSponsorName || 'Verified Sponsor',
      position: 'Home Banner',
      description: adDescription,
      offerDiscount: adOfferDiscount,
      contactMobile: adContactMobile || systemSettings.contactPhone,
      expiryDate: adExpiryDate || '2026-12-31',
      businessId: selectedBusinessId || undefined,
      ownerUserId: linkedBiz?.ownerId || undefined,
    });
    setSelectedBusinessId('');
    setAdTitle('');
    setAdImageUrl('');
    setAdSponsorName('');
    setAdDescription('');
    setAdOfferDiscount('');
    setAdContactMobile('');
    setAdExpiryDate('');
    setAdLinkUrl('');
    showToast('Advertisement Published', 'Business promotion connected and published on home page.', 'success');
  };

  const handleCreateBhajan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle.trim() || !songAudioUrl.trim()) {
      showToast('Missing Details', 'Please enter a song title and audio URL.', 'error');
      return;
    }

    addBhajan({
      title: songTitle.trim(),
      hindiTitle: songHindiTitle.trim() || undefined,
      category: songCategory,
      singer: songSinger.trim() || undefined,
      audioUrl: songAudioUrl.trim(),
      lyrics: songLyrics.trim() || undefined,
      isActive: true,
      addedBy: currentUser?.fullName || 'Super Admin',
    });

    setSongTitle('');
    setSongHindiTitle('');
    setSongSinger('');
    setSongAudioUrl('');
    setSongLyrics('');
  };

  return (
    <div className="space-y-6">
      
      {/* Secure Admin Header */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-amber-500/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
            <ShieldCheck className="w-4 h-4" />
            <span>SUPER ADMIN CONTROL PANEL</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
            Jain Connect Global Super Admin
          </h2>

          <p className="text-xs text-amber-200/90 font-medium">
            Authenticated as <span className="font-bold underline text-amber-300">{currentUser?.fullName || 'Platform Super Admin'}</span>
          </p>
        </div>

        <div className="bg-slate-900/80 border border-amber-500/30 p-3.5 rounded-xl text-xs space-y-1 text-slate-300">
          <p className="font-bold text-amber-400 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-400" /> Enterprise Clearance
          </p>
          <p className="text-[11px] text-slate-400">Mandatory verification & content control active.</p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveAdminTab('pending')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'pending'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Pending Approvals ({pendingUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('members')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'members'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Member Verification Manager</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('ads')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'ads'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Business Promotions & Ads</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('bhajans')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'bhajans'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Devotional Songs & Bhajans ({bhajans.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'settings'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Dynamic Website Control</span>
        </button>
      </div>

      {/* Tab 1: Pending Approvals Queue with VIEW Option */}
      {activeAdminTab === 'pending' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Member Approval Queue (Mandatory Admin Verification)
            </h3>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full border border-amber-300">
              {pendingUsers.length} Requests Awaiting Clearance
            </span>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                All User Applications Processed!
              </p>
              <p className="text-xs text-slate-400">No pending accounts in queue.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.profilePhoto}
                      alt={u.fullName}
                      className="w-12 h-12 rounded-full object-cover border border-amber-400 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{u.fullName}</h4>
                        <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-full border border-amber-300">
                          {u.registrationType || 'Member Request'}
                        </span>
                      </div>
                      <p className="text-slate-500">{u.email} • {u.phone}</p>
                      <p className="text-amber-600 dark:text-amber-400 font-semibold">{u.city}, {u.state} ({u.sect || 'Jain'})</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setViewingPendingUser(u)}
                      className="px-3.5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100 rounded-xl font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Eye className="w-4 h-4 text-amber-600" />
                      <span>View Details</span>
                    </button>

                    <button
                      onClick={() => approveUser(u.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-md transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => rejectUser(u.id)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-md transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW PENDING USER DETAILS MODAL */}
      {viewingPendingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative my-8">
            <button
              onClick={() => setViewingPendingUser(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <img
                src={viewingPendingUser.profilePhoto}
                alt={viewingPendingUser.fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-500 shadow-md"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-300">
                  {viewingPendingUser.registrationType || 'Jain Connect Registration'}
                </span>
                <h3 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white mt-1">
                  {viewingPendingUser.fullName}
                </h3>
                <p className="text-xs text-slate-500">Status: Pending Approval</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <span className="font-bold text-slate-500">Full Name & Surname:</span>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{viewingPendingUser.fullName}</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <span className="font-bold text-slate-500">Registration Panel:</span>
                <p className="font-semibold text-amber-600 dark:text-amber-400">{viewingPendingUser.registrationType || 'General Member'}</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <span className="font-bold text-slate-500">Contact Email:</span>
                <p className="font-semibold text-slate-900 dark:text-white">{viewingPendingUser.email}</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <span className="font-bold text-slate-500">Mobile / WhatsApp:</span>
                <p className="font-semibold text-slate-900 dark:text-white">{viewingPendingUser.phone}</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <span className="font-bold text-slate-500">Jain Sect & Gotra:</span>
                <p className="font-semibold text-slate-900 dark:text-white">{viewingPendingUser.sect || 'Jain'} • {viewingPendingUser.subSect || 'All'} (Gotra: {viewingPendingUser.gotra || 'N/A'})</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <span className="font-bold text-slate-500">Profession & Qualification:</span>
                <p className="font-semibold text-slate-900 dark:text-white">{viewingPendingUser.occupation || 'N/A'} ({viewingPendingUser.qualification || 'Educated'})</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1 col-span-1 md:col-span-2">
                <span className="font-bold text-slate-500">Address & Location:</span>
                <p className="font-semibold text-slate-900 dark:text-white">{viewingPendingUser.address || 'N/A'}, {viewingPendingUser.city}, {viewingPendingUser.state}, {viewingPendingUser.pincode}</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewingPendingUser(null)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-200"
              >
                Close
              </button>

              <button
                onClick={() => {
                  rejectUser(viewingPendingUser.id);
                  setViewingPendingUser(null);
                }}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Application</span>
              </button>

              <button
                onClick={() => {
                  approveUser(viewingPendingUser.id);
                  setViewingPendingUser(null);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve Member Access</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Member Verification Manager */}
      {activeAdminTab === 'members' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <UserCheck className="w-4 h-4 text-emerald-500" />
            Approved Member Verification & Badges
          </h3>

          <div className="space-y-3">
            {approvedUsers.map((u) => (
              <div
                key={u.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.profilePhoto}
                    alt={u.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-amber-400 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 dark:text-white">{u.fullName}</span>
                      {u.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-500" title="Verified Badge Active" />
                      )}
                    </div>
                    <p className="text-slate-500">{u.email} • {u.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleUserVerification(u.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
                      u.isVerified
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {u.isVerified ? 'Remove Verified Badge' : 'Grant Verified Badge'}
                  </button>

                  <button
                    onClick={() => suspendUser(u.id)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-bold text-xs hover:bg-red-200"
                  >
                    Suspend User
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Business Promotions & Ads Manager */}
      {activeAdminTab === 'ads' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
          <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Megaphone className="w-4 h-4 text-amber-500" />
            Homepage Business Promotions & Detailed Ad Creation
          </h3>

          <form onSubmit={handleCreateAd} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
            <p className="font-bold text-slate-900 dark:text-white text-sm">Create New Detailed Business Ad Banner</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="col-span-1 sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>Connect Registered Business (Auto-populates Ad Details & Triggers Renewal Reminder)</span>
                  <span className="text-[10px] text-amber-600 font-semibold">Optional Business Link</span>
                </label>
                <select
                  value={selectedBusinessId}
                  onChange={(e) => handleSelectBusinessForAd(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 font-medium text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="">-- Select Registered Business Listing --</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.businessName} ({b.city}, {b.category}) - Owner: {b.ownerName || 'Verified'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Ad Headline / Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Bachhawat Jewels - Antique Kundan Collection"
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Banner Image URL *</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={adImageUrl}
                  onChange={(e) => setAdImageUrl(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Sponsor / Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Bachhawat Jewels & Heritage Diamonds"
                  value={adSponsorName}
                  onChange={(e) => setAdSponsorName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Special Offer / Discount Badge</label>
                <input
                  type="text"
                  placeholder="e.g. FLAT 15% OFF for Jain Members"
                  value={adOfferDiscount}
                  onChange={(e) => setAdOfferDiscount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Contact Phone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="e.g. 9514237277"
                  value={adContactMobile}
                  onChange={(e) => setAdContactMobile(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Ad Validity Expiry Date</label>
                <input
                  type="date"
                  value={adExpiryDate}
                  onChange={(e) => setAdExpiryDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Ad Description Details</label>
              <textarea
                rows={2}
                placeholder="Describe special discounts, product collection, or services offered..."
                value={adDescription}
                onChange={(e) => setAdDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-black rounded-xl flex items-center gap-1.5 shadow-lg">
              <Plus className="w-4 h-4" />
              <span>Publish Advertisement Banner</span>
            </button>
          </form>

          {/* Active Ads Showcase */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase">Live Advertisements ({ads.length}):</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ads.map((ad) => (
                <div key={ad.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-3 text-xs shadow-md">
                  <div className="flex items-start gap-3">
                    <img src={ad.imageUrl} alt={ad.title} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-amber-400" />
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold rounded text-[10px]">
                        {ad.offerDiscount || 'Featured Ad'}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{ad.title}</h4>
                      <p className="text-amber-600 font-semibold">{ad.sponsorName}</p>
                      <p className="text-slate-500 text-[11px]">{ad.contactMobile || '9514237277'}</p>
                    </div>
                  </div>

                  {ad.description && (
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2">
                      {ad.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400">Valid till: {ad.expiryDate || '2026-12-31'}</span>
                    <button onClick={() => deleteAd(ad.id)} className="text-red-600 font-bold hover:underline flex items-center gap-1">
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Ad</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Devotional Songs & Bhajans Management */}
      {activeAdminTab === 'bhajans' && (
        <div className="space-y-6">
          {/* Add New Song / Bhajan Form */}
          <form onSubmit={handleCreateBhajan} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-amber-500" />
                Add New Devotional Song / Bhajan / Stavan
              </h3>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full border border-amber-300">
                {bhajans.length} Songs in Library
              </span>
            </div>

            {/* Quick Audio URL Presets */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-amber-500" />
                Quick MP3 Presets (Click to autofill sample audio stream links):
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    name: 'Navkar Mantra Chanting',
                    category: 'Navkar Mantra',
                    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-spiritual-112191.mp3',
                    singer: 'Traditional Jain Chanting',
                    hindi: 'णमोकार मंत्र दिव्य जाप'
                  },
                  {
                    name: 'Maitri Bhav Stavan',
                    category: 'Stavan',
                    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a82d02.mp3?filename=relaxing-flute-spiritual-10148.mp3',
                    singer: 'Sadhana Sargam',
                    hindi: 'मैत्री भाव नु पवित्र झरणु'
                  },
                  {
                    name: 'Bhaktamar Stotra',
                    category: 'Bhaktamar',
                    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=indian-ambient-meditation-15220.mp3',
                    singer: 'Panditji Recitation',
                    hindi: 'भक्तामर स्तोत्र पाठ'
                  },
                  {
                    name: 'Mahavir Swami Aarti',
                    category: 'Aarti',
                    url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_34d1ed36d9.mp3?filename=spiritual-meditation-temple-124018.mp3',
                    singer: 'Jain Mahila Mandal',
                    hindi: 'भगवान महावीर आरती'
                  }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSongTitle(preset.name);
                      setSongHindiTitle(preset.hindi);
                      setSongCategory(preset.category as any);
                      setSongSinger(preset.singer);
                      setSongAudioUrl(preset.url);
                    }}
                    className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 hover:bg-amber-200 text-[11px] font-semibold rounded-lg transition-colors border border-amber-300 dark:border-amber-700/50"
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Song / Bhajan Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Maitri Bhav Nu Pavitra Zharnu"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Native Title (Hindi / Gujarati)
                </label>
                <input
                  type="text"
                  placeholder="e.g., मैत्री भाव नु पवित्र झरणु"
                  value={songHindiTitle}
                  onChange={(e) => setSongHindiTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium font-serif"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={songCategory}
                  onChange={(e) => setSongCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                >
                  <option value="Navkar Mantra">Navkar Mantra</option>
                  <option value="Stavan">Stavan</option>
                  <option value="Bhajan">Bhajan</option>
                  <option value="Aarti">Aarti</option>
                  <option value="Bhaktamar">Bhaktamar</option>
                  <option value="Stuti">Stuti</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Singer / Artist Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Anuradha Paudwal, Lata Mangeshkar"
                  value={songSinger}
                  onChange={(e) => setSongSinger(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Audio File URL (MP3 / Audio Stream) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/audio/my-bhajan.mp3"
                  value={songAudioUrl}
                  onChange={(e) => setSongAudioUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Lyrics / Sacred Verses (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Enter song lyrics or stavan verses..."
                value={songLyrics}
                onChange={(e) => setSongLyrics(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium text-xs"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-extrabold text-xs rounded-xl shadow-lg hover:from-amber-600 hover:to-amber-800 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Song to Bhajan Library</span>
            </button>
          </form>

          {/* Published Songs & Bhajans Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Music className="w-4 h-4 text-amber-500" />
              Published Devotional Song Playlist ({bhajans.length})
            </h3>

            {bhajans.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No songs added yet. Add your first song above!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] font-bold uppercase text-slate-500">
                    <tr>
                      <th className="p-3">Play</th>
                      <th className="p-3">Song Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Singer</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {bhajans.map((song) => {
                      const isThisPlaying = isPlayingSong && currentSong?.id === song.id;
                      return (
                        <tr key={song.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3">
                            <button
                              onClick={() => togglePlaySong(song)}
                              className={`p-2 rounded-full transition-all ${
                                isThisPlaying
                                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-500 hover:text-slate-950'
                              }`}
                              title={isThisPlaying ? 'Pause Audio' : 'Play Song'}
                            >
                              {isThisPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                            </button>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{song.title}</p>
                              {song.hindiTitle && (
                                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-serif">{song.hindiTitle}</p>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-300 dark:border-amber-800">
                              {song.category}
                            </span>
                          </td>
                          <td className="p-3 font-medium text-slate-600 dark:text-slate-400">
                            {song.singer || 'Traditional'}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => toggleBhajanActive(song.id)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                song.isActive
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                              }`}
                            >
                              {song.isActive ? 'Active' : 'Disabled'}
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => deleteBhajan(song.id)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                              title="Delete Bhajan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Dynamic Website Settings (Entire Website Words Control) */}
      {activeAdminTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-6 text-xs">
          <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Settings className="w-4 h-4 text-amber-500" />
            Dynamic Portal Branding & Website Wordings Control
          </h3>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-300 dark:border-amber-800 space-y-3">
            <p className="font-bold text-amber-900 dark:text-amber-300 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Website Color Scheme & Primary Brand Accent
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { id: 'amber', label: 'Saffron Amber (Classic)', bg: 'bg-amber-500' },
                { id: 'emerald', label: 'Sacred Jain Green', bg: 'bg-emerald-600' },
                { id: 'ruby', label: 'Royal Ruby Red', bg: 'bg-rose-600' },
                { id: 'sapphire', label: 'Divine Sapphire Blue', bg: 'bg-blue-600' },
                { id: 'saffron', label: 'Sandalwood Gold', bg: 'bg-yellow-500' },
                { id: 'purple', label: 'Ahimsa Purple', bg: 'bg-purple-600' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setThemePrimaryColor(c.id)}
                  className={`p-2.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1.5 transition-all ${
                    themePrimaryColor === c.id
                      ? 'border-amber-600 dark:border-amber-400 bg-white dark:bg-slate-900 shadow-md ring-2 ring-amber-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full ${c.bg} shadow-sm`} />
                  <span className="text-center text-[10px] text-slate-800 dark:text-slate-200 leading-tight">
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Application Platform Name
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Developer Organization Name
              </label>
              <input
                type="text"
                value={devName}
                onChange={(e) => setDevName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Platform Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Top Ticker Announcement Bar Text
              </label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Homepage Hero Main Headline
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Homepage Hero Subheadline
              </label>
              <input
                type="text"
                value={heroSub}
                onChange={(e) => setHeroSub(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Support Contact Phone Number
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Support Contact Email ID
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Support Physical Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Homepage About / Welcome Title
              </label>
              <input
                type="text"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Homepage About / Welcome Description
              </label>
              <textarea
                rows={2}
                value={aboutDescription}
                onChange={(e) => setAboutDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Matrimonial Portal Heading
              </label>
              <input
                type="text"
                value={matrimonialHeading}
                onChange={(e) => setMatrimonialHeading(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Business Directory Portal Heading
              </label>
              <input
                type="text"
                value={businessHeading}
                onChange={(e) => setBusinessHeading(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Temple Directory Portal Heading
              </label>
              <input
                type="text"
                value={templeHeading}
                onChange={(e) => setTempleHeading(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jain Directory Census Heading
              </label>
              <input
                type="text"
                value={directoryHeading}
                onChange={(e) => setDirectoryHeading(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-extrabold text-xs rounded-xl shadow-lg hover:from-amber-600 hover:to-amber-800 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply Platform Settings</span>
          </button>
        </form>
      )}
    </div>
  );
};

