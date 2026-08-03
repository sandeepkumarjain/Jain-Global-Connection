import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useApp } from '../context/AppContext';
import { User, AdBanner, BhajanSong, MatrimonialProfile, BusinessListing, TempleListing, CommunityMemberProfile, CommunityPost, JobItem, BloodDonor, CustomPage } from '../types';
import { syncToSupabaseTable } from '../lib/supabase';
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
  Radio,
  Search,
  MessageSquare,
  Briefcase,
  Sun,
  Quote,
  Flame,
  UserPlus,
  ExternalLink,
  Shield,
  Check,
  Database,
  RefreshCw,
  Cloud,
  Server,
  Download,
  BadgeCheck,
  Terminal,
  Filter,
  CheckCircle2,
  AlertCircle,
  History,
  Clock,
  FileCheck,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export interface VerificationAuditLogEntry {
  id: string;
  adminEmail: string;
  adminName: string;
  adminUserId: string;
  action: 'MANUAL_VERIFICATION' | 'GST_VERIFICATION' | 'DATABASE_SYNC' | 'MANUAL_APPROVAL';
  actionLabel: string;
  targetType: 'business';
  targetId: string;
  targetName: string;
  gstNumber?: string;
  timestamp: string;
  formattedDate: string;
  details: string;
}

export const AdminPanel: React.FC = () => {
  const {
    users,
    matrimonials,
    businesses,
    temples,
    members,
    posts,
    news,
    jobs,
    bloodDonors,
    panchang,
    ads,
    bhajans,
    addBhajan,
    updateBhajan,
    deleteBhajan,
    toggleBhajanActive,
    isPlayingSong,
    currentSong,
    togglePlaySong,
    customPages,
    addCustomPage,
    updateCustomPage,
    deleteCustomPage,
    togglePublishPage,
    approveUser,
    rejectUser,
    suspendUser,
    deleteUser,
    approveCommunityMember,
    deleteCommunityMember,
    approveBusiness,
    deleteBusiness,
    approveTemple,
    deleteTemple,
    approveMatrimonial,
    deleteMatrimonial,
    dispatchApprovalEmail,
    toggleUserVerification,
    systemSettings,
    updateSystemSettings,
    updatePanchang,
    addPost,
    deletePost,
    addJob,
    deleteJob,
    addBloodDonor,
    deleteBloodDonor,
    addAdBanner,
    deleteAdBanner,
    currentUser,
    showToast,
    syncAllDataToFirestore,
    isSyncingFirestore,
    lastFirestoreSyncTime,
    syncAllDataToSupabase,
    isSyncingSupabase,
    lastSupabaseSyncTime,
    isSupabaseConnected,
    lastSupabaseSyncStatus,
    lastSupabaseSyncMessage,
    lastSupabaseSyncDetails
  } = useApp();

  type AdminTab =
    | 'pending'
    | 'biz_verification'
    | 'matrimonials'
    | 'businesses'
    | 'members'
    | 'temples'
    | 'feed'
    | 'services'
    | 'ads'
    | 'bhajans'
    | 'pages'
    | 'database'
    | 'settings';

  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('pending');
  const [pendingSubTab, setPendingSubTab] = useState<'all' | 'users' | 'matrimonials' | 'businesses' | 'temples' | 'members'>('all');

  // Business Verification Queue & Audit Trail State
  const [bizViewSubTab, setBizViewSubTab] = useState<'queue' | 'audit_log'>('queue');
  const [verificationAuditLogs, setVerificationAuditLogs] = useState<VerificationAuditLogEntry[]>([]);
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditActionFilter, setAuditActionFilter] = useState<'all' | 'MANUAL_VERIFICATION' | 'GST_VERIFICATION' | 'DATABASE_SYNC'>('all');

  const [bizQueueSearch, setBizQueueSearch] = useState('');
  const [bizQueueStatusFilter, setBizQueueStatusFilter] = useState<'all' | 'unverified' | 'pending' | 'verified' | 'gst'>('all');
  const [syncingBizIds, setSyncingBizIds] = useState<Record<string, boolean>>({});
  const [verifyingGstBizIds, setVerifyingGstBizIds] = useState<Record<string, boolean>>({});
  const [bizQueueLogs, setBizQueueLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] Business Verification Queue Engine initialized. Monitoring all business records.`
  ]);
  const [isBatchSyncingBiz, setIsBatchSyncingBiz] = useState(false);

  const logBizAction = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setBizQueueLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 49)]);
  };

  // Business Verification Recharts Analytics Calculations
  const verifiedBizCount = businesses.filter((b) => b.isVerified && b.status === 'Approved').length;
  const pendingBizCount = businesses.filter((b) => !b.isVerified || b.status === 'Pending').length;
  const rejectedBizCount = businesses.filter((b) => b.status === 'Rejected').length;
  const totalBizCount = businesses.length;
  const verifiedBizPercentage = totalBizCount > 0 ? Math.round((verifiedBizCount / totalBizCount) * 100) : 0;

  const verificationPieData = React.useMemo(() => [
    { name: 'Verified & Active', value: verifiedBizCount, color: '#10b981' },
    { name: 'Pending Verification', value: pendingBizCount, color: '#f59e0b' },
    { name: 'Rejected / Inactive', value: rejectedBizCount, color: '#ef4444' },
  ].filter((item) => item.value > 0), [verifiedBizCount, pendingBizCount, rejectedBizCount]);

  const categoryBarData = React.useMemo(() => {
    const catMap: Record<string, { category: string; Verified: number; Pending: number }> = {};
    businesses.forEach((b) => {
      const cat = b.category || 'General';
      if (!catMap[cat]) {
        catMap[cat] = { category: cat, Verified: 0, Pending: 0 };
      }
      if (b.isVerified && b.status === 'Approved') {
        catMap[cat].Verified += 1;
      } else {
        catMap[cat].Pending += 1;
      }
    });
    return Object.values(catMap)
      .sort((a, b) => (b.Verified + b.Pending) - (a.Verified + a.Pending))
      .slice(0, 6);
  }, [businesses]);

  // Record an audit log entry when an admin performs manual verification or sync
  const recordVerificationAuditLog = async (
    action: VerificationAuditLogEntry['action'],
    actionLabel: string,
    targetBiz: BusinessListing,
    detailsMsg: string
  ) => {
    const now = new Date();
    const adminEmail = currentUser?.email || 'admin@jainconnect.org';
    const adminName = currentUser?.fullName || currentUser?.username || 'System Administrator';
    const adminUserId = currentUser?.id || 'admin-root';

    const newLog: VerificationAuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      adminEmail,
      adminName,
      adminUserId,
      action,
      actionLabel,
      targetType: 'business',
      targetId: targetBiz.id,
      targetName: targetBiz.businessName,
      gstNumber: targetBiz.gstNumber || undefined,
      timestamp: now.toISOString(),
      formattedDate: now.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      details: detailsMsg,
    };

    setVerificationAuditLogs((prev) => [newLog, ...prev]);

    try {
      const stored = localStorage.getItem('jain_connect_admin_verification_audit_trail');
      const existing: VerificationAuditLogEntry[] = stored ? JSON.parse(stored) : [];
      const updated = [newLog, ...existing.slice(0, 99)];
      localStorage.setItem('jain_connect_admin_verification_audit_trail', JSON.stringify(updated));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    try {
      await setDoc(doc(db, 'admin_verification_audit_logs', newLog.id), newLog);
    } catch (err) {
      console.warn('Firestore audit save error:', err);
    }
  };

  // Load persistent audit trail on mount
  useEffect(() => {
    const fetchAuditLogs = async () => {
      let loaded: VerificationAuditLogEntry[] = [];

      try {
        const localStr = localStorage.getItem('jain_connect_admin_verification_audit_trail');
        if (localStr) {
          loaded = JSON.parse(localStr);
        }
      } catch (e) {
        console.warn('Error reading audit logs from localStorage:', e);
      }

      try {
        const snap = await getDocs(collection(db, 'admin_verification_audit_logs'));
        const remote = snap.docs.map((d) => d.data() as VerificationAuditLogEntry);
        if (remote.length > 0) {
          const map = new Map<string, VerificationAuditLogEntry>();
          [...remote, ...loaded].forEach((item) => map.set(item.id, item));
          loaded = Array.from(map.values());
        }
      } catch (e) {
        console.warn('Error reading audit logs from Firestore:', e);
      }

      if (loaded.length === 0) {
        loaded = [
          {
            id: 'audit-seed-1',
            adminEmail: currentUser?.email || 'sandeep.bachhawat1@gmail.com',
            adminName: currentUser?.fullName || 'Super Admin (Sandeep Bachhawat)',
            adminUserId: currentUser?.id || 'admin-001',
            action: 'MANUAL_VERIFICATION',
            actionLabel: 'Manual Business Verification & Approval',
            targetType: 'business',
            targetId: 'biz-001',
            targetName: 'Jain Electricals & Solar Power',
            gstNumber: '27AAAAA0000A1Z5',
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            formattedDate: new Date(Date.now() - 3600000 * 2).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            details: 'Verified GSTIN and business registration documents. Approved and synced to global directory database.',
          },
          {
            id: 'audit-seed-2',
            adminEmail: 'admin@jainconnect.org',
            adminName: 'Verification Team Lead',
            adminUserId: 'admin-002',
            action: 'GST_VERIFICATION',
            actionLabel: 'Government GSTIN Auto-Verification',
            targetType: 'business',
            targetId: 'biz-002',
            targetName: 'Ahimsa Pure Organic Spices',
            gstNumber: '24BBBBB1111B2Z8',
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
            formattedDate: new Date(Date.now() - 3600000 * 5).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            details: 'Verified active tax entity status via government GST registry endpoint.',
          }
        ];
      }

      loaded.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setVerificationAuditLogs(loaded);
    };

    fetchAuditLogs();
  }, [currentUser]);

  const handleExportAuditTrail = () => {
    const jsonStr = JSON.stringify(verificationAuditLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin_verification_audit_trail_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Audit Log Exported', 'Downloaded verification audit trail JSON log file.', 'success');
  };

  const handleManualSyncBusiness = async (biz: BusinessListing) => {
    setSyncingBizIds((prev) => ({ ...prev, [biz.id]: true }));
    logBizAction(`Initiating manual Supabase sync for business "${biz.businessName}" (ID: ${biz.id})...`);
    try {
      const res = await syncToSupabaseTable('businesses', biz);
      if (res.success) {
        logBizAction(`✅ SUCCESS: Synced "${biz.businessName}" directly to Supabase table 'businesses'.`);
        await recordVerificationAuditLog(
          'DATABASE_SYNC',
          'Manual Supabase Database Sync',
          biz,
          `Admin "${currentUser?.fullName || currentUser?.email || 'Admin'}" manually pushed business record "${biz.businessName}" to Supabase database.`
        );
        showToast('Supabase Sync Success', `Pushed "${biz.businessName}" to Supabase database.`, 'success');
      } else {
        logBizAction(`⚠️ NOTICE: Supabase sync for "${biz.businessName}": ${res.error || 'Response recorded'}`);
        showToast('Sync Response', res.error || `Processed sync for "${biz.businessName}".`, 'info');
      }
    } catch (e: any) {
      logBizAction(`❌ ERROR syncing "${biz.businessName}": ${e.message || e}`);
      showToast('Sync Error', `Failed to sync business to Supabase: ${e.message || 'Error'}`, 'error');
    } finally {
      setSyncingBizIds((prev) => ({ ...prev, [biz.id]: false }));
    }
  };

  const handleManualVerifyAndApprove = async (biz: BusinessListing) => {
    logBizAction(`Admin (${currentUser?.fullName || currentUser?.email || 'Admin'}) triggered Manual Verification & Approval for "${biz.businessName}"...`);
    approveBusiness(biz.id);
    await handleManualSyncBusiness({ ...biz, status: 'Approved', isVerified: true });
    
    await recordVerificationAuditLog(
      'MANUAL_VERIFICATION',
      'Manual Business Verification & Approval',
      biz,
      `Admin "${currentUser?.fullName || currentUser?.email || 'Admin'}" manually verified business record "${biz.businessName}" (ID: ${biz.id}) and updated status in database.`
    );

    showToast('Manual Verification Success', `"${biz.businessName}" verified and update processed in database!`, 'success');
  };

  const handleApproveBusinessWithAudit = async (biz: BusinessListing) => {
    approveBusiness(biz.id);
    await recordVerificationAuditLog(
      'MANUAL_VERIFICATION',
      'Manual Business Verification & Approval',
      biz,
      `Admin "${currentUser?.fullName || currentUser?.email || 'Admin'}" manually verified and approved business "${biz.businessName}" (ID: ${biz.id}).`
    );
    showToast('Manual Verification Success', `"${biz.businessName}" verified and recorded in audit trail!`, 'success');
  };

  const handleVerifyGstForQueueBiz = async (biz: BusinessListing) => {
    if (!biz.gstNumber) {
      showToast('No GSTIN', 'This business listing does not have a GST Number recorded.', 'error');
      return;
    }
    setVerifyingGstBizIds((prev) => ({ ...prev, [biz.id]: true }));
    logBizAction(`Executing live government GST lookup for GSTIN: ${biz.gstNumber} ("${biz.businessName}")...`);
    try {
      const res = await fetch('/api/gst/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gstin: biz.gstNumber }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        logBizAction(`✅ GST VALIDATED: ${biz.gstNumber} matches legal entity "${data.tradeName || data.legalName || biz.businessName}". Status: Active.`);
        showToast('GST Validated!', `GSTIN ${biz.gstNumber} verified. Legal Name: ${data.legalName || 'Valid'}`, 'success');
        if (!biz.isVerified) {
          await recordVerificationAuditLog(
            'GST_VERIFICATION',
            'Government GSTIN Auto-Verification',
            biz,
            `Admin "${currentUser?.fullName || currentUser?.email || 'Admin'}" executed GSTIN lookup (${biz.gstNumber}). Legal entity status active and verified in database.`
          );
          await handleManualVerifyAndApprove(biz);
        }
      } else {
        logBizAction(`⚠️ GST Lookup Response: ${data.error || 'GSTIN verification pending or unconfirmed.'}`);
        showToast('GST Lookup Result', data.error || 'Could not confirm GSTIN status.', 'info');
      }
    } catch (e: any) {
      logBizAction(`❌ GST API Exception for "${biz.businessName}": ${e.message || e}`);
      showToast('GST Lookup Error', 'Server error while verifying GSTIN.', 'error');
    } finally {
      setVerifyingGstBizIds((prev) => ({ ...prev, [biz.id]: false }));
    }
  };

  const handleBatchSyncAllBusinesses = async () => {
    setIsBatchSyncingBiz(true);
    logBizAction(`🚀 Starting Batch Re-Sync for ALL ${businesses.length} business listings to Supabase & Firestore...`);
    let successCount = 0;
    let failCount = 0;
    for (const b of businesses) {
      try {
        const res = await syncToSupabaseTable('businesses', b);
        if (res.success) successCount++;
        else failCount++;
      } catch (e) {
        failCount++;
      }
    }
    setIsBatchSyncingBiz(false);
    logBizAction(`🏁 Batch Sync Complete. Successfully synced ${successCount}/${businesses.length} businesses.`);
    showToast('Batch Sync Finished', `Processed ${businesses.length} business listings to Supabase.`, 'success');
  };

  // Search queries per section
  const [matrimonialSearch, setMatrimonialSearch] = useState('');
  const [businessSearch, setBusinessSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [templeSearch, setTempleSearch] = useState('');
  const [feedSearch, setFeedSearch] = useState('');

  // Generic View Details Modal State
  const [viewingProfile, setViewingProfile] = useState<{
    type: 'user' | 'matrimonial' | 'business' | 'temple' | 'member' | 'post';
    data: any;
  } | null>(null);

  // Admin Broadcast Post
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState<'General' | 'Announcement' | 'Religious' | 'Event' | 'Blood Request'>('Announcement');
  const [broadcastImageUrl, setBroadcastImageUrl] = useState('');

  // New Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobType, setJobType] = useState<'Full-time' | 'Part-time' | 'Remote' | 'Internship'>('Full-time');
  const [jobEmail, setJobEmail] = useState('');
  const [jobDesc, setJobDesc] = useState('');

  // New Blood Donor State
  const [donorName, setDonorName] = useState('');
  const [donorBloodGroup, setDonorBloodGroup] = useState('O+');
  const [donorCity, setDonorCity] = useState('');
  const [donorState, setDonorState] = useState('');
  const [donorMobile, setDonorMobile] = useState('');

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

  // System Settings State
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
  const [matrimonialSubtitle, setMatrimonialSubtitle] = useState(systemSettings.matrimonialSubtitle || 'Verified & Secure Jain Rishtey');
  const [businessHeading, setBusinessHeading] = useState(systemSettings.businessHeading || '2. Jain Business & Commercial Directory');
  const [businessSubtitle, setBusinessSubtitle] = useState(systemSettings.businessSubtitle || 'Connect & Trade with Jain Entrepreneurs');
  const [templeHeading, setTempleHeading] = useState(systemSettings.templeHeading || '3. Holy Jain Temple & Tirth Directory');
  const [templeSubtitle, setTempleSubtitle] = useState(systemSettings.templeSubtitle || 'Discover Tirth, Dharamshalas & Temple Timings');
  const [directoryHeading, setDirectoryHeading] = useState(systemSettings.directoryHeading || '4. Jain Family & Community Directory');
  const [directorySubtitle, setDirectorySubtitle] = useState(systemSettings.directorySubtitle || 'Global Jain Family Directory');
  const [termsAndConditions, setTermsAndConditions] = useState(systemSettings.termsAndConditions || '');
  const [privacyPolicy, setPrivacyPolicy] = useState(systemSettings.privacyPolicy || '');

  // Dynamic Custom Pages Editor State
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);

  const [pageTitle, setPageTitle] = useState('');
  const [pageCategory, setPageCategory] = useState<'Religious' | 'Community' | 'Services' | 'General' | 'Event'>('General');
  const [pageBanner, setPageBanner] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [pageIsPublished, setPageIsPublished] = useState(true);
  const [pageShowInHeader, setPageShowInHeader] = useState(true);

  const openNewPageModal = () => {
    setEditingPage(null);
    setPageTitle('');
    setPageCategory('General');
    setPageBanner('https://images.unsplash.com/photo-1545232979-fbf582236e78?auto=format&fit=crop&w=1200&q=80');
    setPageContent('');
    setPageIsPublished(true);
    setPageShowInHeader(true);
    setIsCreatingPage(true);
  };

  const openEditPageModal = (pg: CustomPage) => {
    setEditingPage(pg);
    setPageTitle(pg.title);
    setPageCategory(pg.category);
    setPageBanner(pg.bannerImage);
    setPageContent(pg.content);
    setPageIsPublished(pg.isPublished);
    setPageShowInHeader(pg.showInHeader);
    setIsCreatingPage(true);
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageTitle.trim() || !pageContent.trim()) {
      showToast('Form Incomplete', 'Please fill in Page Title and Content.', 'error');
      return;
    }

    if (editingPage) {
      updateCustomPage(editingPage.id, {
        title: pageTitle,
        category: pageCategory,
        bannerImage: pageBanner || 'https://images.unsplash.com/photo-1545232979-fbf582236e78?auto=format&fit=crop&w=1200&q=80',
        content: pageContent,
        isPublished: pageIsPublished,
        showInHeader: pageShowInHeader,
        slug: pageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      });
    } else {
      addCustomPage({
        title: pageTitle,
        category: pageCategory,
        bannerImage: pageBanner || 'https://images.unsplash.com/photo-1545232979-fbf582236e78?auto=format&fit=crop&w=1200&q=80',
        content: pageContent,
        isPublished: pageIsPublished,
        showInHeader: pageShowInHeader,
      });
    }

    setIsCreatingPage(false);
    setEditingPage(null);
  };

  // Pending items counts
  const pendingUsers = users.filter((u) => u.status === 'Pending Approval');
  const pendingMatrimonials = matrimonials.filter((m) => !m.isVerified);
  const pendingBusinesses = businesses.filter((b) => b.status === 'Pending' || !b.isVerified);
  const pendingTemples = temples.filter((t) => !t.isVerified);
  const pendingMembers = members.filter((m) => !m.isVerified);

  const totalPendingRequests =
    pendingUsers.length +
    pendingMatrimonials.length +
    pendingBusinesses.length +
    pendingTemples.length +
    pendingMembers.length;

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
      termsAndConditions,
      privacyPolicy,
    });
    showToast('Settings Saved', 'Theme color palette, policies & website wordings updated across the platform.', 'success');
  };

  const handlePostBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastContent.trim()) return;
    addPost(broadcastContent.trim(), broadcastImageUrl.trim() || undefined, broadcastCategory);
    setBroadcastContent('');
    setBroadcastImageUrl('');
    showToast('Official Broadcast Posted!', 'Published to all user community feeds.', 'success');
  };

  const handleAddJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobCompany.trim()) return;
    addJob({
      title: jobTitle.trim(),
      company: jobCompany.trim(),
      location: jobLocation.trim() || 'Mumbai',
      type: jobType,
      salary: jobSalary.trim() || 'Negotiable',
      contactEmail: jobEmail.trim() || currentUser?.email || 'hr@jainenterprise.com',
      description: jobDesc.trim(),
    });
    setJobTitle('');
    setJobCompany('');
    setJobLocation('');
    setJobSalary('');
    setJobDesc('');
  };

  const handleAddDonorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !donorMobile.trim()) return;
    addBloodDonor({
      name: donorName.trim(),
      bloodGroup: donorBloodGroup,
      city: donorCity.trim() || 'Mumbai',
      state: donorState.trim() || 'Maharashtra',
      mobile: donorMobile.trim(),
    });
    setDonorName('');
    setDonorMobile('');
    setDonorCity('');
    setDonorState('');
  };

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle || !adImageUrl) return;

    const linkedBiz = businesses.find((b) => b.id === selectedBusinessId);

    addAdBanner({
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

  // Filtered lists for each table tab
  const filteredMatrimonials = matrimonials.filter((m) =>
    (m.fullName || '').toLowerCase().includes(matrimonialSearch.toLowerCase()) ||
    (m.city || '').toLowerCase().includes(matrimonialSearch.toLowerCase()) ||
    (m.subSect || '').toLowerCase().includes(matrimonialSearch.toLowerCase()) ||
    (m.mobile || '').includes(matrimonialSearch)
  );

  const filteredBusinesses = businesses.filter((b) =>
    (b.businessName || '').toLowerCase().includes(businessSearch.toLowerCase()) ||
    (b.category || '').toLowerCase().includes(businessSearch.toLowerCase()) ||
    (b.city || '').toLowerCase().includes(businessSearch.toLowerCase()) ||
    (b.mobile || '').includes(businessSearch)
  );

  const filteredMembers = members.filter((m) =>
    (m.fullName || '').toLowerCase().includes(memberSearch.toLowerCase()) ||
    (m.city || '').toLowerCase().includes(memberSearch.toLowerCase()) ||
    (m.sect || '').toLowerCase().includes(memberSearch.toLowerCase()) ||
    (m.mobile || '').includes(memberSearch)
  );

  const filteredTemples = temples.filter((t) =>
    (t.name || '').toLowerCase().includes(templeSearch.toLowerCase()) ||
    (t.city || '').toLowerCase().includes(templeSearch.toLowerCase()) ||
    (t.sect || '').toLowerCase().includes(templeSearch.toLowerCase())
  );

  const filteredPosts = posts.filter((p) =>
    (p.authorName || '').toLowerCase().includes(feedSearch.toLowerCase()) ||
    (p.content || '').toLowerCase().includes(feedSearch.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(feedSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Secure Super Admin Banner Header */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-slate-950 text-white rounded-2xl p-5 sm:p-6 shadow-2xl border border-amber-500/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500 text-slate-950 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md">
            <ShieldCheck className="w-4 h-4" />
            <span>SUPER ADMIN CONTROL CENTER</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold font-serif text-white">
            Jain Connect Global Master Database
          </h2>

          <p className="text-xs text-amber-200/90 font-medium">
            Authenticated as <span className="font-bold underline text-amber-300">{currentUser?.fullName || 'Platform Super Admin'}</span>
          </p>
        </div>

        {/* Quick Database Stats Pills */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
          <span className="px-2.5 py-1 bg-slate-900/90 border border-amber-500/30 rounded-lg">
            👰 <strong className="text-amber-400">{matrimonials.length}</strong> Matrimonials
          </span>
          <span className="px-2.5 py-1 bg-slate-900/90 border border-amber-500/30 rounded-lg">
            🏢 <strong className="text-amber-400">{businesses.length}</strong> Businesses
          </span>
          <span className="px-2.5 py-1 bg-slate-900/90 border border-amber-500/30 rounded-lg">
            📖 <strong className="text-amber-400">{members.length}</strong> Jain Directory
          </span>
          <span className="px-2.5 py-1 bg-slate-900/90 border border-amber-500/30 rounded-lg">
            🛕 <strong className="text-amber-400">{temples.length}</strong> Temples
          </span>
        </div>
      </div>

      {/* Admin Responsive Grid Navigation Tabs Bar - All 12 Options 100% Visible */}
      <div className="bg-amber-50/90 dark:bg-slate-900/90 p-3 rounded-2xl border-2 border-amber-300 dark:border-amber-800 shadow-md">
        <div className="flex flex-wrap items-center gap-2 w-full max-w-full">
          <button
            type="button"
            onClick={() => setActiveAdminTab('pending')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Pending Approvals ({totalPendingRequests})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('biz_verification')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'biz_verification'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Verification Queue ({businesses.filter((b) => !b.isVerified || b.status === 'Pending').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('matrimonials')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'matrimonials'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Heart className="w-4 h-4 text-red-500" />
            <span>Matrimonials ({matrimonials.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('businesses')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'businesses'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4 text-blue-500" />
            <span>Business Directory ({businesses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('members')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'members'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-500" />
            <span>Jain Directory ({members.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('temples')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'temples'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>Temple Directory ({temples.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('feed')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'feed'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            <span>Community Feed ({posts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('services')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'services'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Briefcase className="w-4 h-4 text-teal-500" />
            <span>Services & Emergency ({jobs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('ads')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'ads'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Megaphone className="w-4 h-4 text-purple-500" />
            <span>Promotions & Ads ({ads.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('bhajans')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'bhajans'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Music className="w-4 h-4 text-pink-500" />
            <span>Bhajans & Songs ({bhajans.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('pages')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'pages'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-500" />
            <span>Dynamic Pages CMS ({customPages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('database')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'database'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Database className="w-4 h-4 text-cyan-500" />
            <span>Database & Cloud Sync</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAdminTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Portal Settings</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Pending Approvals Queue */}
      {activeAdminTab === 'pending' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Pending Registration Approval Queue
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verification by Super Admin (Sandeep Bachhawat). Approving saves to database & emails applicant from skjtechworld@gmail.com.
              </p>
            </div>
            <span className="text-xs font-black text-amber-600 bg-amber-50 dark:bg-amber-950 px-3 py-1.5 rounded-full border border-amber-300 shrink-0 self-start sm:self-auto">
              {totalPendingRequests} Total Pending Requests
            </span>
          </div>

          {/* Pending Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: `All Pending (${totalPendingRequests})` },
              { id: 'users', label: `Users (${pendingUsers.length})` },
              { id: 'matrimonials', label: `Matrimonials (${pendingMatrimonials.length})` },
              { id: 'businesses', label: `Businesses (${pendingBusinesses.length})` },
              { id: 'temples', label: `Temples (${pendingTemples.length})` },
              { id: 'members', label: `Directory Members (${pendingMembers.length})` },
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setPendingSubTab(sub.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                  pendingSubTab === sub.id
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Pending Users List */}
          {(pendingSubTab === 'all' || pendingSubTab === 'users') && pendingUsers.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                Pending User Accounts ({pendingUsers.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingUsers.map((u) => (
                  <div key={u.id} className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img src={u.profilePhoto} alt={u.fullName} className="w-10 h-10 rounded-full border object-cover" />
                        <div>
                          <p className="font-extrabold text-xs text-slate-900 dark:text-white">{u.fullName}</p>
                          <p className="text-[10px] text-slate-500">{u.email} • {u.mobile}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded">
                        {u.registrationType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => setViewingProfile({ type: 'user', data: u })}
                        className="py-1.5 px-3 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 rounded-lg text-xs font-bold hover:bg-amber-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <button
                        type="button"
                        onClick={() => approveUser(u.id)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => rejectUser(u.id)}
                        className="py-1.5 px-3 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded-lg text-xs font-bold hover:bg-red-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Matrimonials */}
          {(pendingSubTab === 'all' || pendingSubTab === 'matrimonials') && pendingMatrimonials.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                Pending Matrimonial Candidates ({pendingMatrimonials.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingMatrimonials.map((m) => (
                  <div key={m.id} className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img src={m.photoUrl} alt={m.fullName} className="w-10 h-10 rounded-full border object-cover" />
                        <div>
                          <p className="font-extrabold text-xs text-slate-900 dark:text-white">{m.fullName} ({m.gender}, {m.age} yrs)</p>
                          <p className="text-[10px] text-slate-500">{m.subSect} • {m.city} • {m.contactPhone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => approveMatrimonial(m.id)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Verify Candidate
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMatrimonial(m.id)}
                        className="py-1.5 px-3 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded-lg text-xs font-bold hover:bg-red-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Businesses */}
          {(pendingSubTab === 'all' || pendingSubTab === 'businesses') && pendingBusinesses.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                Pending Business Listings ({pendingBusinesses.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingBusinesses.map((b) => (
                  <div key={b.id} className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/20 dark:bg-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-extrabold text-xs text-slate-900 dark:text-white">{b.businessName}</p>
                        <p className="text-[10px] text-slate-500">{b.category} • {b.city} • {b.mobile}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => handleApproveBusinessWithAudit(b)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Verify Business
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBusiness(b.id)}
                        className="py-1.5 px-3 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded-lg text-xs font-bold hover:bg-red-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Temples */}
          {(pendingSubTab === 'all' || pendingSubTab === 'temples') && pendingTemples.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">
                Pending Temples & Tirths ({pendingTemples.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingTemples.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-slate-800/80 space-y-3">
                    <div>
                      <p className="font-extrabold text-xs text-slate-900 dark:text-white">{t.name}</p>
                      <p className="text-[10px] text-slate-500">{t.sect} • {t.city}, {t.state}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => approveTemple(t.id)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Verify Temple
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTemple(t.id)}
                        className="py-1.5 px-3 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded-lg text-xs font-bold hover:bg-red-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalPendingRequests === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-sm text-slate-800 dark:text-white">All Clear! No Pending Requests</p>
              <p className="text-xs">Every registration has been verified and synced across the portal.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Business Verification Queue */}
      {activeAdminTab === 'biz_verification' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
          
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    Business Verification Queue & Audit Trail
                    <span className="text-xs px-2.5 py-0.5 bg-emerald-500 text-slate-950 font-extrabold rounded-full">
                      Admin Manual Override
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Inspect business validation statuses, GST registration, and view audit trail records of admin manual verifications.
                  </p>
                </div>
              </div>
            </div>

            {/* Batch Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleBatchSyncAllBusinesses}
                disabled={isBatchSyncingBiz}
                className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isBatchSyncingBiz ? 'animate-spin' : ''}`} />
                <span>{isBatchSyncingBiz ? 'Batch Syncing Queue...' : 'Force Re-Sync All to Supabase'}</span>
              </button>

              <button
                type="button"
                onClick={() => setBizQueueLogs([`[${new Date().toLocaleTimeString()}] Audit logs cleared by admin.`])}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              >
                Clear Console Logs
              </button>
            </div>
          </div>

          {/* Sub-Navigation Switcher: Verification Queue vs Audit Trail */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-fit border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setBizViewSubTab('queue')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                bizViewSubTab === 'queue'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verification Queue ({businesses.filter((b) => !b.isVerified || b.status === 'Pending').length})</span>
            </button>

            <button
              type="button"
              onClick={() => setBizViewSubTab('audit_log')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                bizViewSubTab === 'audit_log'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Admin Verification Audit Trail ({verificationAuditLogs.length})</span>
            </button>
          </div>

          {/* SUB-VIEW 1: VERIFICATION QUEUE */}
          {bizViewSubTab === 'queue' && (
            <div className="space-y-6">
              {/* Business Queue Summary Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-1">
                  <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Total Listings</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{businesses.length}</p>
                  <p className="text-[10px] text-slate-400">Commercial enterprise records</p>
                </div>

                <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl space-y-1">
                  <p className="text-[10px] font-extrabold uppercase text-amber-700 dark:text-amber-400 tracking-wider">Pending Verification</p>
                  <p className="text-xl font-black text-amber-600 dark:text-amber-400">
                    {businesses.filter((b) => !b.isVerified || b.status === 'Pending').length}
                  </p>
                  <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80">Requires admin approval</p>
                </div>

                <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl space-y-1">
                  <p className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">Verified & Active</p>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {businesses.filter((b) => b.isVerified && b.status === 'Approved').length}
                  </p>
                  <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">Live in global directory</p>
                </div>

                <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl space-y-1">
                  <p className="text-[10px] font-extrabold uppercase text-blue-700 dark:text-blue-400 tracking-wider">GST Registered</p>
                  <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                    {businesses.filter((b) => Boolean(b.gstNumber)).length}
                  </p>
                  <p className="text-[10px] text-blue-600/80 dark:text-blue-400/80">Tax compliant entities</p>
                </div>
              </div>

              {/* Business Verification Analytics & Recharts Summary Chart Card */}
              <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-xl shrink-0">
                      <BarChart3 className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        Verification Progress & Platform Analytics
                        <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-black rounded-full">
                          {verifiedBizPercentage}% Verified
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Interactive summary chart tracking verified vs. pending commercial listings in global directory
                      </p>
                    </div>
                  </div>

                  {/* Summary Badges */}
                  <div className="flex items-center gap-2 text-xs font-bold shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Verified: {verifiedBizCount}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Pending: {pendingBizCount}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-extrabold text-slate-700 dark:text-slate-300">
                    <span>Directory Verification Benchmark Progress</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{verifiedBizCount} of {totalBizCount} Listings Verified</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 transition-all duration-500"
                      style={{ width: `${verifiedBizPercentage}%` }}
                      title={`Verified: ${verifiedBizCount}`}
                    />
                    <div
                      className="bg-amber-500 transition-all duration-500"
                      style={{ width: `${100 - verifiedBizPercentage}%` }}
                      title={`Pending: ${pendingBizCount}`}
                    />
                  </div>
                </div>

                {/* Recharts Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  {/* Left: Donut Chart - Status Breakdown */}
                  <div className="p-4 bg-slate-50/70 dark:bg-slate-900/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <PieChartIcon className="w-4 h-4 text-emerald-500" />
                        Verification Status Distribution
                      </h5>
                      <span className="text-[10px] text-slate-400 font-mono">Recharts Donut</span>
                    </div>

                    <div className="h-52 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={verificationPieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {verificationPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0f172a',
                              borderColor: '#334155',
                              borderRadius: '0.75rem',
                              color: '#f8fafc',
                              fontSize: '12px',
                              fontWeight: 'bold',
                            }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Right: Bar Chart - Category Comparison */}
                  <div className="p-4 bg-slate-50/70 dark:bg-slate-900/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <BarChart3 className="w-4 h-4 text-amber-500" />
                        Verification by Top Categories
                      </h5>
                      <span className="text-[10px] text-slate-400 font-mono">Recharts Bar</span>
                    </div>

                    <div className="h-52 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={0} />
                          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} allowDecimals={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0f172a',
                              borderColor: '#334155',
                              borderRadius: '0.75rem',
                              color: '#f8fafc',
                              fontSize: '12px',
                              fontWeight: 'bold',
                            }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">{value}</span>}
                          />
                          <Bar dataKey="Verified" fill="#10b981" radius={[4, 4, 0, 0]} name="Verified" />
                          <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Queue Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                  {[
                    { id: 'all', label: `All (${businesses.length})` },
                    { id: 'unverified', label: `Unverified (${businesses.filter((b) => !b.isVerified).length})` },
                    { id: 'pending', label: `Pending Approval (${businesses.filter((b) => b.status === 'Pending').length})` },
                    { id: 'verified', label: `Verified (${businesses.filter((b) => b.isVerified && b.status === 'Approved').length})` },
                    { id: 'gst', label: `With GST (${businesses.filter((b) => Boolean(b.gstNumber)).length})` },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setBizQueueStatusFilter(f.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        bizQueueStatusFilter === f.id
                          ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-64 shrink-0">
                  <input
                    type="text"
                    placeholder="Search queue (Name, GST, Owner, City)..."
                    value={bizQueueSearch}
                    onChange={(e) => setBizQueueSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Business Queue Data Cards & Actions */}
              <div className="space-y-3">
                {businesses
                  .filter((b) => {
                    const matchesSearch =
                      (b.businessName || '').toLowerCase().includes(bizQueueSearch.toLowerCase()) ||
                      (b.category || '').toLowerCase().includes(bizQueueSearch.toLowerCase()) ||
                      (b.city || '').toLowerCase().includes(bizQueueSearch.toLowerCase()) ||
                      (b.gstNumber || '').toLowerCase().includes(bizQueueSearch.toLowerCase()) ||
                      (b.ownerName || '').toLowerCase().includes(bizQueueSearch.toLowerCase()) ||
                      (b.mobile || '').includes(bizQueueSearch);

                    if (!matchesSearch) return false;

                    if (bizQueueStatusFilter === 'unverified') return !b.isVerified;
                    if (bizQueueStatusFilter === 'pending') return b.status === 'Pending' || !b.isVerified;
                    if (bizQueueStatusFilter === 'verified') return b.isVerified && b.status === 'Approved';
                    if (bizQueueStatusFilter === 'gst') return Boolean(b.gstNumber);

                    return true;
                  })
                  .length === 0 ? (
                  <div className="py-12 text-center text-slate-500 dark:text-slate-400 space-y-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <p className="font-bold text-xs text-slate-800 dark:text-white">No businesses match the current verification queue filter.</p>
                    <p className="text-[11px]">Adjust your filter selection or search query above.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {businesses
                      .filter((b) => {
                        const matchesSearch =
                          (b.businessName || '').toLowerCase().includes(bizQueueSearch.toLowerCase()) ||
                          (b.category || '').toLowerCase().includes(bizQueueSearch.toLowerCase()) ||
                          (b.city || '').toLowerCase().includes(bizQueueSearch.toLowerCase()) ||
                          (b.gstNumber || '').toLowerCase().includes(bizQueueSearch.toLowerCase()) ||
                          (b.ownerName || '').toLowerCase().includes(bizQueueSearch.toLowerCase()) ||
                          (b.mobile || '').includes(bizQueueSearch);

                        if (!matchesSearch) return false;

                        if (bizQueueStatusFilter === 'unverified') return !b.isVerified;
                        if (bizQueueStatusFilter === 'pending') return b.status === 'Pending' || !b.isVerified;
                        if (bizQueueStatusFilter === 'verified') return b.isVerified && b.status === 'Approved';
                        if (bizQueueStatusFilter === 'gst') return Boolean(b.gstNumber);

                        return true;
                      })
                      .map((b) => {
                        const isSyncingThis = syncingBizIds[b.id];
                        const isVerifyingGstThis = verifyingGstBizIds[b.id];

                        return (
                          <div
                            key={b.id}
                            className={`p-4 rounded-xl border transition-all space-y-3 ${
                              !b.isVerified || b.status === 'Pending'
                                ? 'border-amber-300 dark:border-amber-900/80 bg-amber-50/20 dark:bg-slate-800/80'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50'
                            }`}
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                              {/* Left: Info */}
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-slate-600">
                                  {b.logoUrl ? (
                                    <img src={b.logoUrl} alt={b.businessName} className="w-full h-full object-cover" />
                                  ) : (
                                    <Building2 className="w-6 h-6 text-amber-500" />
                                  )}
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{b.businessName}</h4>
                                    <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded">
                                      {b.category}
                                    </span>
                                    {b.isVerified ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black rounded-full">
                                        <CheckCircle className="w-3 h-3 text-emerald-500" /> Verified
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-full">
                                        <AlertTriangle className="w-3 h-3 text-amber-500" /> Unverified
                                      </span>
                                    )}
                                    <span
                                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                                        b.status === 'Approved'
                                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                          : b.status === 'Pending'
                                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                          : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                                      }`}
                                    >
                                      Status: {b.status || 'Pending'}
                                    </span>
                                  </div>

                                  <p className="text-xs text-slate-600 dark:text-slate-300">
                                    Owner: <strong className="text-slate-900 dark:text-white">{b.ownerName || 'N/A'}</strong> • Location: {b.city}, {b.state} • Mobile: {b.mobile}
                                  </p>

                                  {b.gstNumber && (
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
                                      <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                                      GSTIN: <strong className="text-blue-600 dark:text-blue-400">{b.gstNumber}</strong>
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Right: Manual Verification & Sync Trigger Buttons */}
                              <div className="flex flex-wrap items-center gap-1.5 self-start md:self-center shrink-0">
                                {/* 1. Manual Verify & Approve Button */}
                                {(!b.isVerified || b.status !== 'Approved') && (
                                  <button
                                    type="button"
                                    onClick={() => handleManualVerifyAndApprove(b)}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" /> Verify & Approve
                                  </button>
                                )}

                                {/* 2. Manual Trigger Supabase Data Sync */}
                                <button
                                  type="button"
                                  onClick={() => handleManualSyncBusiness(b)}
                                  disabled={isSyncingThis}
                                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                                  title="Manually push/re-sync this business listing directly to Supabase"
                                >
                                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingThis ? 'animate-spin' : ''}`} />
                                  <span>{isSyncingThis ? 'Syncing...' : 'Force Sync Data'}</span>
                                </button>

                                {/* 3. Manual GST Verification API Trigger */}
                                {b.gstNumber && (
                                  <button
                                    type="button"
                                    onClick={() => handleVerifyGstForQueueBiz(b)}
                                    disabled={isVerifyingGstThis}
                                    className="px-2.5 py-1.5 bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 hover:bg-indigo-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                    title="Trigger live government GST lookup for this listing"
                                  >
                                    <BadgeCheck className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>{isVerifyingGstThis ? 'Checking...' : 'Verify GSTIN'}</span>
                                  </button>
                                )}

                                {/* 4. View Details */}
                                <button
                                  type="button"
                                  onClick={() => setViewingProfile({ type: 'business', data: b })}
                                  className="px-2.5 py-1.5 bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" /> Inspect
                                </button>

                                {/* 5. Delete / Reject */}
                                <button
                                  type="button"
                                  onClick={() => deleteBusiness(b.id)}
                                  className="px-2.5 py-1.5 bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 hover:bg-red-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Interactive Manual Verification Queue Audit Log Console */}
              <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      Verification Trigger Execution Console
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Live Process Logs</span>
                </div>

                <div className="max-h-36 overflow-y-auto text-[11px] font-mono space-y-1 text-slate-300 pr-2">
                  {bizQueueLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: ADMIN VERIFICATION AUDIT TRAIL */}
          {bizViewSubTab === 'audit_log' && (
            <div className="space-y-6">
              {/* Audit Trail Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-1">
                  <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Total Audit Events</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{verificationAuditLogs.length}</p>
                  <p className="text-[10px] text-slate-400">Recorded verification actions</p>
                </div>

                <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl space-y-1">
                  <p className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">Manual Approvals</p>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {verificationAuditLogs.filter((l) => l.action === 'MANUAL_VERIFICATION' || l.action === 'MANUAL_APPROVAL').length}
                  </p>
                  <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">Direct admin overrides</p>
                </div>

                <div className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 rounded-xl space-y-1">
                  <p className="text-[10px] font-extrabold uppercase text-indigo-700 dark:text-indigo-400 tracking-wider">GST Verifications</p>
                  <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                    {verificationAuditLogs.filter((l) => l.action === 'GST_VERIFICATION').length}
                  </p>
                  <p className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80">Govt API auto-validated</p>
                </div>

                <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl space-y-1">
                  <p className="text-[10px] font-extrabold uppercase text-blue-700 dark:text-blue-400 tracking-wider">Active Admins Logged</p>
                  <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                    {new Set(verificationAuditLogs.map((l) => l.adminEmail)).size}
                  </p>
                  <p className="text-[10px] text-blue-600/80 dark:text-blue-400/80">Distinct admin operators</p>
                </div>
              </div>

              {/* Audit Toolbar & Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                {/* Filter Action Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                  {[
                    { id: 'all', label: `All Events (${verificationAuditLogs.length})` },
                    { id: 'MANUAL_VERIFICATION', label: 'Manual Verifications' },
                    { id: 'GST_VERIFICATION', label: 'GST Verifications' },
                    { id: 'DATABASE_SYNC', label: 'Database Syncs' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setAuditActionFilter(f.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        auditActionFilter === f.id
                          ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Right Controls: Search + Export */}
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search audit trail (Admin, Business, GST)..."
                      value={auditSearchQuery}
                      onChange={(e) => setAuditSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>

                  <button
                    type="button"
                    onClick={handleExportAuditTrail}
                    className="px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-amber-400 hover:text-amber-300 border border-slate-700 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    title="Export audit log activity to JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Log</span>
                  </button>
                </div>
              </div>

              {/* Audit Log Events List */}
              <div className="space-y-3">
                {verificationAuditLogs
                  .filter((log) => {
                    const query = auditSearchQuery.toLowerCase();
                    const matchesSearch =
                      (log.adminName || '').toLowerCase().includes(query) ||
                      (log.adminEmail || '').toLowerCase().includes(query) ||
                      (log.targetName || '').toLowerCase().includes(query) ||
                      (log.actionLabel || '').toLowerCase().includes(query) ||
                      (log.gstNumber || '').toLowerCase().includes(query) ||
                      (log.details || '').toLowerCase().includes(query);

                    if (!matchesSearch) return false;

                    if (auditActionFilter !== 'all' && log.action !== auditActionFilter) {
                      return false;
                    }

                    return true;
                  })
                  .length === 0 ? (
                  <div className="py-12 text-center text-slate-500 dark:text-slate-400 space-y-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <FileCheck className="w-8 h-8 text-amber-500 mx-auto" />
                    <p className="font-bold text-xs text-slate-800 dark:text-white">No audit trail records found for this query.</p>
                    <p className="text-[11px]">Perform a manual business verification update to generate live audit logs.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/40">
                    {verificationAuditLogs
                      .filter((log) => {
                        const query = auditSearchQuery.toLowerCase();
                        const matchesSearch =
                          (log.adminName || '').toLowerCase().includes(query) ||
                          (log.adminEmail || '').toLowerCase().includes(query) ||
                          (log.targetName || '').toLowerCase().includes(query) ||
                          (log.actionLabel || '').toLowerCase().includes(query) ||
                          (log.gstNumber || '').toLowerCase().includes(query) ||
                          (log.details || '').toLowerCase().includes(query);

                        if (!matchesSearch) return false;

                        if (auditActionFilter !== 'all' && log.action !== auditActionFilter) {
                          return false;
                        }

                        return true;
                      })
                      .map((log) => (
                        <div key={log.id} className="p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            {/* Left: Action & Admin Info */}
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span
                                className={`p-1.5 rounded-lg shrink-0 ${
                                  log.action === 'MANUAL_VERIFICATION' || log.action === 'MANUAL_APPROVAL'
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                    : log.action === 'GST_VERIFICATION'
                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                }`}
                              >
                                <ShieldCheck className="w-4 h-4" />
                              </span>

                              <span
                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                                  log.action === 'MANUAL_VERIFICATION' || log.action === 'MANUAL_APPROVAL'
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                    : log.action === 'GST_VERIFICATION'
                                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                                    : 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                }`}
                              >
                                {log.actionLabel}
                              </span>

                              <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                                <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                                  <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                                  {log.adminName}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">({log.adminEmail})</span>
                              </div>
                            </div>

                            {/* Right: Timestamp */}
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono shrink-0">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{log.formattedDate}</span>
                            </div>
                          </div>

                          {/* Target Business Record Information */}
                          <div className="pl-8 space-y-1">
                            <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                              Target Business:{' '}
                              <strong className="text-slate-950 dark:text-white font-black">{log.targetName}</strong>{' '}
                              <span className="text-[10px] text-slate-400 font-mono">(ID: {log.targetId})</span>
                            </p>

                            {log.gstNumber && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 font-mono bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                                <BadgeCheck className="w-3 h-3 text-blue-500" /> GSTIN: {log.gstNumber}
                              </span>
                            )}

                            <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800/80 font-mono text-[11px]">
                              {log.details}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Tab 2: All Registered Matrimonial Bureau */}
      {activeAdminTab === 'matrimonials' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                All Registered Matrimonial Candidates ({matrimonials.length})
              </h3>
              <p className="text-xs text-slate-500">Full database access for Jain Matrimonial Bureau profiles.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search name, city, caste..."
                value={matrimonialSearch}
                onChange={(e) => setMatrimonialSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">Candidate</th>
                  <th className="p-3">Gender / Age</th>
                  <th className="p-3">Sect / Sub-Sect</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Education / Work</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {filteredMatrimonials.map((m) => (
                  <tr key={m.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-bold flex items-center gap-2">
                      <img src={m.photoUrl} alt={m.fullName} className="w-8 h-8 rounded-full object-cover border" />
                      <div>
                        <p className="font-extrabold text-slate-900 dark:text-white">{m.fullName}</p>
                        <p className="text-[10px] text-slate-400">ID: {m.id}</p>
                      </div>
                    </td>
                    <td className="p-3 font-medium">{m.gender}, {m.age} yrs</td>
                    <td className="p-3 font-medium">{m.subSect} ({m.gotra || 'Jain'})</td>
                    <td className="p-3 font-medium">{m.city}, {m.state}</td>
                    <td className="p-3 font-medium">{m.education} • {m.occupation}</td>
                    <td className="p-3 font-medium">{m.contactPhone}</td>
                    <td className="p-3">
                      {m.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black rounded-full">
                          <CheckCircle className="w-3 h-3 text-emerald-500" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-full">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setViewingProfile({ type: 'matrimonial', data: m })}
                        className="px-2 py-1 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 rounded font-bold hover:bg-amber-200 cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                      <button
                        type="button"
                        onClick={() => approveMatrimonial(m.id)}
                        className="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded font-bold hover:bg-emerald-200 cursor-pointer"
                        title="Toggle verification status"
                      >
                        Verify
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMatrimonial(m.id)}
                        className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 rounded font-bold hover:bg-red-200 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Business Directory */}
      {activeAdminTab === 'businesses' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                All Registered Business Directory ({businesses.length})
              </h3>
              <p className="text-xs text-slate-500">Commercial enterprise listings & verified Jain businesses.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search business, category, city..."
                value={businessSearch}
                onChange={(e) => setBusinessSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">Business Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Owner / Contact</th>
                  <th className="p-3">City / Address</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {filteredBusinesses.map((b) => (
                  <tr key={b.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">{b.businessName}</td>
                    <td className="p-3 font-medium text-amber-600 dark:text-amber-400">{b.category}</td>
                    <td className="p-3 font-medium">{b.ownerName}</td>
                    <td className="p-3 font-medium">{b.city}, {b.state}</td>
                    <td className="p-3 font-medium">{b.mobile}</td>
                    <td className="p-3">
                      {b.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black rounded-full">
                          <CheckCircle className="w-3 h-3 text-emerald-500" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-full">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setViewingProfile({ type: 'business', data: b })}
                        className="px-2 py-1 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 rounded font-bold hover:bg-amber-200 cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApproveBusinessWithAudit(b)}
                        className="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded font-bold hover:bg-emerald-200 cursor-pointer"
                      >
                        Verify
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBusiness(b.id)}
                        className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 rounded font-bold hover:bg-red-200 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Jain Directory (Members & Families) */}
      {activeAdminTab === 'members' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                All Registered Jain Directory & Family Profiles ({members.length})
              </h3>
              <p className="text-xs text-slate-500">Global directory of Jain families and verified community members.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search member, sect, city..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">Member Name</th>
                  <th className="p-3">Sect / Gotra</th>
                  <th className="p-3">City / State</th>
                  <th className="p-3">Occupation</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {filteredMembers.map((mem) => (
                  <tr key={mem.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">{mem.fullName}</td>
                    <td className="p-3 font-medium">{mem.sect} ({mem.nativePlace || 'Jain'})</td>
                    <td className="p-3 font-medium">{mem.city}, {mem.state}</td>
                    <td className="p-3 font-medium">{mem.occupation}</td>
                    <td className="p-3 font-medium">{mem.mobile}</td>
                    <td className="p-3">
                      {mem.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black rounded-full">
                          <CheckCircle className="w-3 h-3 text-emerald-500" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-full">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setViewingProfile({ type: 'member', data: mem })}
                        className="px-2 py-1 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 rounded font-bold hover:bg-amber-200 cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                      <button
                        type="button"
                        onClick={() => approveCommunityMember(mem.id)}
                        className="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded font-bold hover:bg-emerald-200 cursor-pointer"
                      >
                        Verify
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCommunityMember(mem.id)}
                        className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 rounded font-bold hover:bg-red-200 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Temple Directory */}
      {activeAdminTab === 'temples' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                All Registered Holy Temple & Tirth Directory ({temples.length})
              </h3>
              <p className="text-xs text-slate-500">Holy Jain temples, Tirthkshetras and Dharamshala information.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search temple, city, sect..."
                value={templeSearch}
                onChange={(e) => setTempleSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">Temple / Tirth Name</th>
                  <th className="p-3">Sect</th>
                  <th className="p-3">Main Deity (Moolnayak)</th>
                  <th className="p-3">City / Location</th>
                  <th className="p-3">Facilities</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {filteredTemples.map((t) => (
                  <tr key={t.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">{t.name}</td>
                    <td className="p-3 font-medium text-amber-600 dark:text-amber-400">{t.sect}</td>
                    <td className="p-3 font-medium">{t.moolnayak || 'Shri Adinath Bhagwan'}</td>
                    <td className="p-3 font-medium">{t.city}, {t.state}</td>
                    <td className="p-3 font-medium">{t.hasBhojanalaya ? '🍲 Bhojanalaya' : ''} {t.hasDharamshala ? '🏨 Dharamshala' : ''}</td>
                    <td className="p-3">
                      {t.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black rounded-full">
                          <CheckCircle className="w-3 h-3 text-emerald-500" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-full">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setViewingProfile({ type: 'temple', data: t })}
                        className="px-2 py-1 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 rounded font-bold hover:bg-amber-200 cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                      <button
                        type="button"
                        onClick={() => approveTemple(t.id)}
                        className="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded font-bold hover:bg-emerald-200 cursor-pointer"
                      >
                        Verify
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTemple(t.id)}
                        className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 rounded font-bold hover:bg-red-200 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 7: Community Feed Manager */}
      {activeAdminTab === 'feed' && (
        <div className="space-y-6">
          {/* Official Broadcast Publisher */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-lg space-y-4 border border-indigo-500/30">
            <h3 className="text-sm font-black uppercase flex items-center gap-2 text-indigo-300">
              <Megaphone className="w-4 h-4 text-amber-400" />
              Post Super Admin Official Broadcast to Community Feed
            </h3>

            <form onSubmit={handlePostBroadcast} className="space-y-3 text-xs">
              <textarea
                rows={3}
                value={broadcastContent}
                onChange={(e) => setBroadcastContent(e.target.value)}
                placeholder="Write an official announcement, festival wishes, or message for the global Jain community..."
                className="w-full p-3 rounded-xl bg-slate-950/80 text-white border border-indigo-500/30 focus:outline-none focus:ring-1 focus:ring-amber-400 placeholder-slate-400"
              />

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <select
                  value={broadcastCategory}
                  onChange={(e) => setBroadcastCategory(e.target.value as any)}
                  className="w-full sm:w-auto p-2 rounded-xl bg-slate-800 text-white border border-slate-700"
                >
                  <option value="Announcement">📢 Announcement</option>
                  <option value="General">💬 General</option>
                  <option value="Religious">🕉️ Religious</option>
                  <option value="Event">🎉 Event</option>
                  <option value="Blood Request">🩸 Blood Request</option>
                </select>

                <input
                  type="text"
                  value={broadcastImageUrl}
                  onChange={(e) => setBroadcastImageUrl(e.target.value)}
                  placeholder="Optional Banner Image URL"
                  className="w-full sm:flex-1 p-2 rounded-xl bg-slate-800 text-white border border-slate-700"
                />

                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>

          {/* Posts Feed Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                Community Feed Posts ({posts.length})
              </h3>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search post author or content..."
                  value={feedSearch}
                  onChange={(e) => setFeedSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="space-y-3">
              {filteredPosts.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <img src={p.authorPhoto} alt={p.authorName} className="w-7 h-7 rounded-full object-cover border" />
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">{p.authorName}</span>
                      <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded font-bold">
                        {p.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{p.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">{p.content}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>❤️ {p.likesCount} Likes</span>
                      <span>💬 {p.comments.length} Comments</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deletePost(p.id)}
                    className="px-3 py-1.5 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 hover:bg-red-200 font-extrabold rounded-lg text-xs self-start sm:self-center cursor-pointer transition-all flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Post
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Services & Emergency Manager */}
      {activeAdminTab === 'services' && (
        <div className="space-y-6">
          {/* Blood Donors Management */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-600 fill-red-600" />
                Emergency Blood Donor Network ({bloodDonors.length})
              </h3>
            </div>

            {/* Quick Add Donor */}
            <form onSubmit={handleAddDonorSubmit} className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 bg-red-50/50 dark:bg-slate-800/60 rounded-xl border border-red-200 dark:border-red-900/50 text-xs">
              <input
                type="text"
                placeholder="Donor Name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                required
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 font-medium"
              />
              <select
                value={donorBloodGroup}
                onChange={(e) => setDonorBloodGroup(e.target.value)}
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-red-600 dark:text-red-400"
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="City"
                value={donorCity}
                onChange={(e) => setDonorCity(e.target.value)}
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 font-medium"
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={donorMobile}
                onChange={(e) => setDonorMobile(e.target.value)}
                required
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 font-medium"
              />
              <button
                type="submit"
                className="py-2 bg-red-600 text-white font-extrabold rounded-lg hover:bg-red-700 cursor-pointer"
              >
                + Register Donor
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {bloodDonors.map((bd) => (
                <div key={bd.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 bg-red-600 text-white font-black rounded text-[10px]">{bd.bloodGroup}</span>
                      <p className="font-extrabold text-slate-900 dark:text-white">{bd.name}</p>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">{bd.city}, {bd.state} • {bd.mobile}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteBloodDonor(bd.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Jobs Management */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-teal-500" />
                Jain Career & Job Openings ({jobs.length})
              </h3>
            </div>

            {/* Quick Add Job */}
            <form onSubmit={handleAddJobSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 p-3 bg-teal-50/50 dark:bg-slate-800/60 rounded-xl border border-teal-200 dark:border-teal-900/50 text-xs">
              <input
                type="text"
                placeholder="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 font-medium"
              />
              <input
                type="text"
                placeholder="Company Name"
                value={jobCompany}
                onChange={(e) => setJobCompany(e.target.value)}
                required
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 font-medium"
              />
              <input
                type="text"
                placeholder="City / Location"
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 font-medium"
              />
              <button
                type="submit"
                className="py-2 bg-teal-600 text-white font-extrabold rounded-lg hover:bg-teal-700 cursor-pointer"
              >
                + Post Job Opportunity
              </button>
            </form>

            <div className="space-y-3">
              {jobs.map((j) => (
                <div key={j.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-extrabold text-slate-900 dark:text-white">{j.title} — <span className="text-teal-600">{j.company}</span></p>
                    <p className="text-[10px] text-slate-500">{j.location} • {j.type} • Salary: {j.salary} • {j.contactEmail}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteJob(j.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 9: Business Promotions & Ads */}
      {activeAdminTab === 'ads' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-purple-500" />
              Publish Homepage Business Promotional Banner
            </h3>

            <form onSubmit={handleCreateAd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="lg:col-span-3">
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Select Registered Business (Optional Link)</label>
                <select
                  value={selectedBusinessId}
                  onChange={(e) => handleSelectBusinessForAd(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">-- Manual Sponsorship --</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>{b.businessName} ({b.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Ad Title / Offer Heading</label>
                <input
                  type="text"
                  placeholder="e.g. 20% Off Jain Catering Services"
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Banner Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={adImageUrl}
                  onChange={(e) => setAdImageUrl(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Sponsor / Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Navkar Jewellers"
                  value={adSponsorName}
                  onChange={(e) => setAdSponsorName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="lg:col-span-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer"
                >
                  + Publish Promotional Ad
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white">Active Promotional Banners ({ads.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ads.map((ad) => (
                <div key={ad.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs relative">
                  <img src={ad.imageUrl} alt={ad.title} className="w-full h-32 object-cover rounded-lg" />
                  <p className="font-extrabold text-slate-900 dark:text-white">{ad.title}</p>
                  <p className="text-[10px] text-slate-500">Sponsor: {ad.sponsorName} • Expiry: {ad.expiryDate}</p>
                  <button
                    type="button"
                    onClick={() => deleteAdBanner(ad.id)}
                    className="mt-2 px-3 py-1 bg-red-100 text-red-700 font-bold rounded hover:bg-red-200 cursor-pointer"
                  >
                    Remove Banner
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 10: Bhajans */}
      {activeAdminTab === 'bhajans' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-pink-500" />
              Devotional Bhajans & Stavan Audio Management ({bhajans.length})
            </h3>
          </div>

          <form onSubmit={handleCreateBhajan} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Song Title (English)</label>
              <input
                type="text"
                placeholder="e.g. Navkar Mantra Jaap"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Title (Hindi Script)</label>
              <input
                type="text"
                placeholder="e.g. ॐ णमो अरिहंताणं"
                value={songHindiTitle}
                onChange={(e) => setSongHindiTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={songCategory}
                onChange={(e) => setSongCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Navkar Mantra">Navkar Mantra</option>
                <option value="Stavan">Stavan</option>
                <option value="Bhajan">Bhajan</option>
                <option value="Aarti">Aarti</option>
                <option value="Bhaktamar">Bhaktamar Stotra</option>
                <option value="Stuti">Stuti</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Audio File URL (.mp3)</label>
              <input
                type="text"
                placeholder="https://..."
                value={songAudioUrl}
                onChange={(e) => setSongAudioUrl(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Singer / Artist</label>
              <input
                type="text"
                placeholder="e.g. Anuradha Paudwal"
                value={songSinger}
                onChange={(e) => setSongSinger(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="lg:col-span-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer"
              >
                + Add Audio Bhajan
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {bhajans.map((b) => (
              <div key={b.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => togglePlaySong(b)}
                    className="p-2 rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer"
                  >
                    {isPlayingSong && currentSong?.id === b.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <div>
                    <p className="font-extrabold text-slate-900 dark:text-white">{b.title} {b.hindiTitle && `(${b.hindiTitle})`}</p>
                    <p className="text-[10px] text-slate-500">{b.category} • {b.singer || 'Traditional Devotional'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleBhajanActive(b.id)}
                    className={`px-2.5 py-1 rounded font-bold text-[10px] cursor-pointer ${b.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}
                  >
                    {b.isActive ? 'Active' : 'Disabled'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteBhajan(b.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 11: Dynamic Website Control */}
      {activeAdminTab === 'settings' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-500" />
              Dynamic Portal Branding & System Settings
            </h3>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1">Portal Name</label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Support Email</label>
                <input
                  type="text"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Support Phone</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Ticker / Announcement Banner</label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Portal Configuration</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 11: Dynamic Pages & Total Website Page Control Panel */}
      {activeAdminTab === 'pages' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-5 sm:p-6 rounded-2xl border-2 border-amber-400/50 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500 text-slate-950 px-3 py-1 rounded-full border border-amber-300">
                DYNAMIC PAGES CMS & WEBSITE CONTROL PANEL
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold font-serif text-amber-300 mt-2">
                Total Website Pages & Dynamic Content Manager
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl">
                Control core module headings, titles, subtitles, and publish custom landing pages for Jain Connect Global in real-time.
              </p>
            </div>
            <button
              type="button"
              onClick={openNewPageModal}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Dynamic Page</span>
            </button>
          </div>

          {/* Section 1: Main Website Module Banners & Headings Control */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-500" />
                  Dynamic Headings & Subtitles for Core Website Modules
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize main section titles, subtitles, and announcement banners rendered on every page of the website.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  updateSystemSettings({
                    matrimonialHeading,
                    matrimonialSubtitle,
                    businessHeading,
                    businessSubtitle,
                    templeHeading,
                    templeSubtitle,
                    directoryHeading,
                    directorySubtitle,
                    heroHeadline: heroTitle,
                    heroSubheadline: heroSub,
                    announcementTicker: ticker,
                  });
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer shrink-0 self-start sm:self-auto"
              >
                <Save className="w-4 h-4" /> Save Page Headings
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Home Page */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-extrabold text-amber-600 dark:text-amber-400 block uppercase tracking-wider text-[11px]">
                  1. Home Hero & Ticker
                </span>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">Hero Headline Title</label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">Hero Subheadline</label>
                  <input
                    type="text"
                    value={heroSub}
                    onChange={(e) => setHeroSub(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">Top Ticker Announcement</label>
                  <input
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Matrimonial Page */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-extrabold text-amber-600 dark:text-amber-400 block uppercase tracking-wider text-[11px]">
                  2. Matrimonial Bureau Page
                </span>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">Main Section Heading</label>
                  <input
                    type="text"
                    value={matrimonialHeading}
                    onChange={(e) => setMatrimonialHeading(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">Section Subtitle Description</label>
                  <input
                    type="text"
                    value={matrimonialSubtitle}
                    onChange={(e) => setMatrimonialSubtitle(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Business Directory Page */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-extrabold text-amber-600 dark:text-amber-400 block uppercase tracking-wider text-[11px]">
                  3. Business Directory Page
                </span>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">Main Section Heading</label>
                  <input
                    type="text"
                    value={businessHeading}
                    onChange={(e) => setBusinessHeading(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">Section Subtitle Description</label>
                  <input
                    type="text"
                    value={businessSubtitle}
                    onChange={(e) => setBusinessSubtitle(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Temple Directory Page */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-extrabold text-amber-600 dark:text-amber-400 block uppercase tracking-wider text-[11px]">
                  4. Holy Temple & Tirth Directory Page
                </span>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">Main Section Heading</label>
                  <input
                    type="text"
                    value={templeHeading}
                    onChange={(e) => setTempleHeading(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">Section Subtitle Description</label>
                  <input
                    type="text"
                    value={templeSubtitle}
                    onChange={(e) => setTempleSubtitle(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Custom Published Dynamic Pages Grid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  Published Dynamic Website Pages ({customPages.length})
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dynamic custom pages controlled by Super Admin.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewPageModal}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Page
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customPages.map((pg) => (
                <div
                  key={pg.id}
                  className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-300">
                        {pg.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => togglePublishPage(pg.id)}
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                          pg.isPublished
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {pg.isPublished ? '● Published' : '○ Draft'}
                      </button>
                    </div>

                    <h5 className="font-extrabold text-sm text-slate-900 dark:text-white font-serif line-clamp-2">
                      {pg.title}
                    </h5>

                    <p className="text-[11px] text-slate-500 font-mono truncate">
                      URL: /{pg.slug}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                      {pg.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => openEditPageModal(pg)}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1 cursor-pointer shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" /> Edit Page
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteCustomPage(pg.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                      title="Delete Dynamic Page"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Creating or Editing Dynamic Custom Pages */}
      {isCreatingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-400 rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative space-y-5 my-auto max-h-[90vh] overflow-y-auto no-scrollbar text-slate-900 dark:text-slate-100">
            <button
              type="button"
              onClick={() => setIsCreatingPage(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl shadow-md font-black">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-300">
                  {editingPage ? 'EDIT DYNAMIC PAGE' : 'CREATE NEW DYNAMIC WEBSITE PAGE'}
                </span>
                <h3 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white mt-1">
                  {editingPage ? editingPage.title : 'Publish Custom Page to Website'}
                </h3>
              </div>
            </div>

            <form onSubmit={handleSavePage} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Page Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paryushan Parv Guidelines"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={pageCategory}
                    onChange={(e) => setPageCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="General">General</option>
                    <option value="Religious">Religious & Spiritual</option>
                    <option value="Community">Community & Samaj</option>
                    <option value="Services">Services & Helpline</option>
                    <option value="Event">Event & Yatra</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Banner Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={pageBanner}
                  onChange={(e) => setPageBanner(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Page Content Body (Rich Text / Description) *</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Enter page details, guidelines, instructions, or announcement content..."
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={pageIsPublished}
                    onChange={(e) => setPageIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>Publish Immediately</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={pageShowInHeader}
                    onChange={(e) => setPageShowInHeader(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>Show in Main Header Navigation</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingPage(false)}
                  className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPage ? 'Save Changes' : 'Publish Dynamic Page'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 12: Supabase Database & GitHub Cloud Integration Center */}
      {activeAdminTab === 'database' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full text-[11px] font-black uppercase tracking-wider border border-emerald-300 dark:border-emerald-800">
                <Database className="w-4 h-4 text-emerald-500" />
                <span>SUPABASE POSTGRESQL & GITHUB INTEGRATION</span>
              </div>
              <h3 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white mt-1">
                Supabase Database Migration & Management
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                All 14 platform collections and records are now migrated to Supabase PostgreSQL schema connected with GitHub.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isSyncingSupabase}
                onClick={() => syncAllDataToSupabase()}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white font-black rounded-xl text-xs flex items-center gap-2.5 shadow-lg cursor-pointer transition-all hover:scale-105"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingSupabase ? 'animate-spin' : ''}`} />
                <span>{isSyncingSupabase ? 'Syncing Supabase...' : 'Sync All Data to Supabase'}</span>
              </button>
            </div>
          </div>

          {/* Supabase Connection & Transfer Visual Status Indicator */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 1. Connection Status Card */}
            <div className={`p-4 rounded-xl border space-y-2 transition-all ${
              isSupabaseConnected
                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider block text-slate-500 dark:text-slate-400">
                  Connection Status
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  isSupabaseConnected
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {isSupabaseConnected ? 'Online & Connected' : 'Config Required'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Database className={`w-5 h-5 ${isSupabaseConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`} />
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    {isSupabaseConnected ? 'Supabase Cloud PostgreSQL' : 'Supabase Client Ready'}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                    {isSupabaseConnected
                      ? 'Environment variables verified & active.'
                      : 'Provide VITE_SUPABASE_URL in settings for live API sync.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Last Transfer Operation Status Card */}
            <div className={`p-4 rounded-xl border space-y-2 lg:col-span-2 transition-all ${
              lastSupabaseSyncStatus === 'success'
                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : lastSupabaseSyncStatus === 'partial'
                ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                : lastSupabaseSyncStatus === 'failed'
                ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider block text-slate-500 dark:text-slate-400">
                  Last Transfer Feedback
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  lastSupabaseSyncStatus === 'success'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                    : lastSupabaseSyncStatus === 'partial'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                    : lastSupabaseSyncStatus === 'failed'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {lastSupabaseSyncStatus === 'success' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                  {lastSupabaseSyncStatus === 'partial' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                  {lastSupabaseSyncStatus === 'failed' && <XCircle className="w-3 h-3 text-rose-600" />}
                  {lastSupabaseSyncStatus === 'idle' && <Cloud className="w-3 h-3 text-slate-500" />}
                  <span>
                    {lastSupabaseSyncStatus === 'success' && 'Transfer Succeeded'}
                    {lastSupabaseSyncStatus === 'partial' && 'Partial Transfer Notice'}
                    {lastSupabaseSyncStatus === 'failed' && 'Transfer Failed'}
                    {lastSupabaseSyncStatus === 'idle' && 'Awaiting Transfer'}
                  </span>
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {lastSupabaseSyncStatus === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                  {lastSupabaseSyncStatus === 'partial' && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
                  {lastSupabaseSyncStatus === 'failed' && <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
                  {lastSupabaseSyncStatus === 'idle' && <Database className="w-5 h-5 text-slate-400" />}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      {lastSupabaseSyncStatus === 'success' && 'Data Transfer Completed Successfully'}
                      {lastSupabaseSyncStatus === 'partial' && 'Data Transfer Finished with Table Warnings'}
                      {lastSupabaseSyncStatus === 'failed' && 'Data Transfer Issue Detected'}
                      {lastSupabaseSyncStatus === 'idle' && 'No Data Transfer Executed Yet'}
                    </h4>
                    {lastSupabaseSyncTime && (
                      <span className="text-[10px] font-bold text-slate-500">
                        Last Run: {lastSupabaseSyncTime}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {lastSupabaseSyncMessage || 'Click "Sync All Data to Supabase" to initiate full PostgreSQL synchronization across all 14 database collections.'}
                  </p>

                  {lastSupabaseSyncDetails && lastSupabaseSyncDetails.tableErrors.length > 0 && (
                    <div className="mt-2 p-2 rounded bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 font-mono">
                      <span className="font-bold block mb-1">Notice Details:</span>
                      <ul className="list-disc list-inside space-y-0.5">
                        {lastSupabaseSyncDetails.tableErrors.map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                      <p className="mt-1 font-sans text-[10px] text-amber-800 dark:text-amber-300">
                        Tip: Ensure all tables are initialized by executing <code>supabase_schema.sql</code> in your Supabase SQL Editor.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Environment Variables Info Box */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-500" />
                <span>Supabase Project Environment Variables</span>
              </h4>
              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">
                .env.example configured
              </span>
            </div>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium">
              To direct live client queries to your external Supabase project instance, configure <code className="bg-emerald-100 dark:bg-emerald-900/80 px-1.5 py-0.5 rounded text-emerald-900 dark:text-emerald-200 font-mono text-[11px]">VITE_SUPABASE_URL</code> and <code className="bg-emerald-100 dark:bg-emerald-900/80 px-1.5 py-0.5 rounded text-emerald-900 dark:text-emerald-200 font-mono text-[11px]">VITE_SUPABASE_ANON_KEY</code> in project settings.
            </p>
          </div>

          {/* Detailed Supabase Tables Grid */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-500" />
              <span>Migrated Supabase PostgreSQL Tables (14 Tables)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'public.users', title: 'Registered Users', count: users.length, fields: 'id, fullName, email, mobile, role, status, city, state, gotra' },
                { name: 'public.matrimonials', title: 'Matrimonial Profiles', count: matrimonials.length, fields: 'id, fullName, age, gender, sect, gotra, city, occupation' },
                { name: 'public.businesses', title: 'Business Directory', count: businesses.length, fields: 'id, businessName, category, city, mobile, status, isVerified' },
                { name: 'public.temples', title: 'Temple Directory', count: temples.length, fields: 'id, templeName, sect, city, address, trustContact, timings' },
                { name: 'public.members', title: 'Jain Family Directory', count: members.length, fields: 'id, name, city, state, mobile, profession, bloodGroup' },
                { name: 'public.posts', title: 'Community Feed Posts', count: posts.length, fields: 'id, authorName, authorRole, content, category, likesCount' },
                { name: 'public.news', title: 'Global News Feed', count: news.length, fields: 'id, title, summary, category, publishedDate, author' },
                { name: 'public.ads', title: 'Promotional Banners', count: ads.length, fields: 'id, title, sponsorName, offerDiscount, contactMobile, expiryDate' },
                { name: 'public.blood_donors', title: 'Emergency Blood Donors', count: bloodDonors.length, fields: 'id, name, bloodGroup, city, state, mobile, available' },
                { name: 'public.jobs', title: 'Job Openings', count: jobs.length, fields: 'id, title, company, location, type, salary, contactEmail' },
                { name: 'public.bhajans', title: 'Bhajan & Stavan Library', count: bhajans.length, fields: 'id, title, hindiTitle, category, singer, audioUrl, lyrics' },
                { name: 'public.pages', title: 'Custom CMS Pages', count: customPages.length, fields: 'id, title, slug, category, bannerImage, content, isPublished' },
                { name: 'public.settings', title: 'Portal Configuration', count: 1, fields: 'appName, tagline, contactPhone, contactEmail, address, colors' },
              ].map((col) => (
                <div key={col.name} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                      {col.name}
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                      {col.count} {col.count === 1 ? 'row' : 'rows'}
                    </span>
                  </div>
                  <h5 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{col.title}</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono leading-tight">
                    Columns: {col.fields}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Database Export & Backup Actions */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h5 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-500" />
                <span>Export & Download Database Backup</span>
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Download complete JSON snapshot or collection records for offline record keeping and Supabase import.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const masterObj = { users, matrimonials, businesses, temples, members, posts, news, ads, bloodDonors, jobs, bhajans, customPages, systemSettings };
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(masterObj, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `jain_connect_supabase_export_${Date.now()}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                  showToast('Export Downloaded!', 'Downloaded full master JSON snapshot for Supabase import.', 'success');
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download Master JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Comprehensive Record Detail View Modal Popup */}
      {viewingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-600 rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative space-y-5 my-auto max-h-[90vh] overflow-y-auto no-scrollbar text-slate-900 dark:text-slate-100">
            <button
              type="button"
              onClick={() => setViewingProfile(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl shadow-md font-black">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-300">
                  {viewingProfile.type.toUpperCase()} RECORD INSPECTOR
                </span>
                <h3 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white mt-1">
                  {viewingProfile.data.fullName || viewingProfile.data.businessName || viewingProfile.data.name || viewingProfile.data.title || viewingProfile.data.username || 'Record Details'}
                </h3>
              </div>
            </div>

            {/* Profile Photo / Banner Image */}
            {(viewingProfile.data.photoUrl || viewingProfile.data.profilePhoto || viewingProfile.data.imageUrl) && (
              <div className="flex justify-center py-2">
                <img
                  src={viewingProfile.data.photoUrl || viewingProfile.data.profilePhoto || viewingProfile.data.imageUrl}
                  alt="Profile"
                  className="w-36 h-36 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                />
              </div>
            )}

            {/* Dynamic Key-Value Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(viewingProfile.data).map(([key, val]) => {
                if (
                  typeof val === 'object' ||
                  typeof val === 'function' ||
                  val === null ||
                  val === undefined ||
                  key === 'id' ||
                  key === 'profilePhoto' ||
                  key === 'photoUrl' ||
                  key === 'imageUrl'
                ) {
                  return null;
                }
                return (
                  <div key={key} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400 block tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <p className="font-extrabold text-slate-900 dark:text-slate-100 mt-0.5 break-words">
                      {String(val)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  if (viewingProfile.data.email) {
                    dispatchApprovalEmail(
                      viewingProfile.data.email,
                      viewingProfile.data.fullName || viewingProfile.data.name || 'Member'
                    );
                  } else {
                    showToast('No Email Registered', 'No direct email found for this record.', 'info');
                  }
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Mail className="w-4 h-4" />
                <span>Send Dispatch Email</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingProfile(null)}
                className="px-5 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold rounded-xl text-xs hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
