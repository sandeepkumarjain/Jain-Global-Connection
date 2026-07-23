import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, AdBanner } from '../types';
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
  Trash2
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    users,
    matrimonials,
    businesses,
    temples,
    ads,
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

  const [activeAdminTab, setActiveAdminTab] = useState<'pending' | 'members' | 'ads' | 'settings'>('pending');

  // Pending User Modal State
  const [viewingPendingUser, setViewingPendingUser] = useState<User | null>(null);

  // Ad Form State
  const [adTitle, setAdTitle] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adSponsorName, setAdSponsorName] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adOfferDiscount, setAdOfferDiscount] = useState('');
  const [adContactMobile, setAdContactMobile] = useState('');
  const [adExpiryDate, setAdExpiryDate] = useState('');
  const [adLinkUrl, setAdLinkUrl] = useState('');

  // Comprehensive Settings State
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

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings({
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
    showToast('Settings Saved', 'Dynamic website text updated across the entire platform.', 'success');
  };

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle || !adImageUrl) return;
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
    });
    setAdTitle('');
    setAdImageUrl('');
    setAdSponsorName('');
    setAdDescription('');
    setAdOfferDiscount('');
    setAdContactMobile('');
    setAdExpiryDate('');
    setAdLinkUrl('');
    showToast('Advertisement Published', 'Business promotion is now live on the public home page.', 'success');
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

      {/* Tab 4: Dynamic Website Settings (Entire Website Words Control) */}
      {activeAdminTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-6 text-xs">
          <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Settings className="w-4 h-4 text-amber-500" />
            Dynamic Portal Branding & Website Wordings Control
          </h3>

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

