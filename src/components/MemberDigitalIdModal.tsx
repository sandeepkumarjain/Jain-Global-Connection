import React, { useState, useRef, useEffect, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import { safeHtml2Canvas } from '../utils/safeHtml2Canvas';
import { useApp } from '../context/AppContext';
import { User, CommunityMemberProfile } from '../types';
import { triggerGoldShimmerConfetti } from '../utils/confetti';
import {
  X,
  QrCode,
  ShieldCheck,
  Download,
  Copy,
  CheckCircle2,
  Printer,
  Sparkles,
  MapPin,
  Heart,
  Calendar,
  Share2,
  User as UserIcon,
  Award,
  Check,
  Scan,
  Palette,
  Sun,
  FileText,
  Info,
  HelpCircle,
  ExternalLink,
  Image as ImageIcon,
  SlidersHorizontal,
  BookOpen,
  Quote,
  Briefcase,
  Compass,
  RotateCcw,
  Lock,
  Globe,
  Users,
  UserPlus,
  Clock,
  Send,
  MessageSquare,
} from 'lucide-react';
import { resolveUserBadges, getBadgeVisualConfig, BADGE_SYSTEM_REGISTRY } from '../utils/badgeSystem';

export interface PublicCardFieldPreferences {
  showMotto: boolean;
  mottoText: string;
  showScripture: boolean;
  scriptureText: string;
  showGotra: boolean;
  showLocation: boolean;
  showBloodGroup: boolean;
  showTier: boolean;
  showOccupation: boolean;
  occupationText: string;
  showNativePlace: boolean;
  nativePlaceText: string;
}

const SCRIPTURE_PRESETS = [
  'Navkar Mahamantra',
  'Tattvartha Sutra',
  'Bhaktamara Stotra',
  'Samayik Sutra',
  'Acharanga Sutra',
  'Uttaradhyayana Sutra',
  'Barah Bhavna',
  'Uvasaggaharam Stotra',
];

const MOTTO_PRESETS = [
  'Parasparopagraho Jivanam (Live & Let Live)',
  'Ahimsa Paramo Dharma',
  'Jiyo aur Jeene Do',
  'Michhami Dukkadam',
  'Samyak Darshan Jnana Charitrani',
  'Atmavat Sarvabhuteshu',
];

interface MemberDigitalIdModalProps {
  userOverride?: User | null;
  isOpenOverride?: boolean;
  onCloseOverride?: () => void;
}

export const MemberDigitalIdModal: React.FC<MemberDigitalIdModalProps> = ({
  userOverride,
  isOpenOverride,
  onCloseOverride,
}) => {
  const {
    currentUser,
    isDigitalIdModalOpen,
    setIsDigitalIdModalOpen,
    showToast,
    themeMode,
    updateUserProfile,
    sendConnectionRequestAlert,
    notifications,
    setIsAuthModalOpen,
    members,
    digitalIdTargetUser,
    setDigitalIdTargetUser,
  } = useApp();

  const [previewMemberId, setPreviewMemberId] = useState<string>('');

  const resolvedUser = useMemo(() => {
    if (userOverride) return userOverride;
    if (digitalIdTargetUser) {
      if ('name' in digitalIdTargetUser && !('fullName' in digitalIdTargetUser)) {
        const m = digitalIdTargetUser as CommunityMemberProfile;
        return {
          id: m.userId || m.id,
          fullName: `${m.name} ${m.surname}`.trim(),
          surname: m.surname,
          email: m.email || '',
          mobile: m.mobile || '',
          role: (m.membershipTier === 'Trustee' ? 'Admin' : 'Member') as any,
          status: 'Approved',
          registrationType: 'Individual',
          gender: 'Male',
          dob: '1985-01-01',
          age: 38,
          maritalStatus: 'Married',
          sect: 'Swetambar Murtipujak',
          subSect: '',
          gotra: 'Kashyap',
          city: m.city,
          state: m.state,
          country: m.country,
          address: m.address,
          pincode: '400001',
          membershipTier: m.membershipTier || 'Premium',
          membershipStatus: 'Active',
          profilePhoto: m.photoUrl,
          occupation: m.profession,
          bloodGroup: m.bloodGroup,
          isVerified: m.isVerified,
          badges: m.badges || ['Verified'],
          isCommunityLeader: m.isCommunityLeader,
        } as unknown as User;
      }
      return digitalIdTargetUser as User;
    }
    if (previewMemberId && previewMemberId !== 'self') {
      const m = members.find((mem) => (mem.userId || mem.id) === previewMemberId);
      if (m) {
        return {
          id: m.userId || m.id,
          fullName: `${m.name} ${m.surname}`.trim(),
          surname: m.surname,
          email: m.email || '',
          mobile: m.mobile || '',
          role: (m.membershipTier === 'Trustee' ? 'Admin' : 'Member') as any,
          status: 'Approved',
          registrationType: 'Individual',
          gender: 'Male',
          dob: '1985-01-01',
          age: 38,
          maritalStatus: 'Married',
          sect: 'Swetambar Murtipujak',
          subSect: '',
          gotra: 'Kashyap',
          city: m.city,
          state: m.state,
          country: m.country,
          address: m.address,
          pincode: '400001',
          membershipTier: m.membershipTier || 'Premium',
          membershipStatus: 'Active',
          profilePhoto: m.photoUrl,
          occupation: m.profession,
          bloodGroup: m.bloodGroup,
          isVerified: m.isVerified,
          badges: m.badges || ['Verified'],
          isCommunityLeader: m.isCommunityLeader,
        } as unknown as User;
      }
    }
    return currentUser;
  }, [userOverride, digitalIdTargetUser, previewMemberId, members, currentUser]);

  const user = resolvedUser || currentUser;
  const isOpen = isOpenOverride !== undefined ? isOpenOverride : isDigitalIdModalOpen;
  const handleClose = () => {
    if (onCloseOverride) {
      onCloseOverride();
    } else {
      setIsDigitalIdModalOpen(false);
    }
    if (setDigitalIdTargetUser) {
      setDigitalIdTargetUser(null);
    }
    setPreviewMemberId('');
  };

  const isOwnProfile = Boolean(currentUser && user && currentUser.id === user.id);

  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'pending' | 'accepted' | 'declined'>('idle');

  useEffect(() => {
    if (!user || !currentUser || isOwnProfile) {
      setConnectionStatus('idle');
      return;
    }

    const targetId = user.id;
    const currId = currentUser.id;

    const existingNotif = notifications.find(
      (n) =>
        n.type === 'ConnectionRequest' &&
        ((n.userId === targetId && n.senderId === currId) ||
          (n.userId === currId && n.senderId === targetId))
    );

    if (existingNotif) {
      if (existingNotif.connectionStatus === 'Accepted') {
        setConnectionStatus('accepted');
        return;
      }
      if (existingNotif.connectionStatus === 'Declined') {
        setConnectionStatus('declined');
        return;
      }
      setConnectionStatus('pending');
      return;
    }

    try {
      const stored = localStorage.getItem(`jcg_conn_${currId}_${targetId}`);
      if (stored === 'pending' || stored === 'accepted' || stored === 'declined') {
        setConnectionStatus(stored as any);
        return;
      }
    } catch {
      // ignore
    }

    setConnectionStatus('idle');
  }, [user?.id, currentUser?.id, notifications, isOwnProfile]);

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectNote, setConnectNote] = useState('');
  const [connectCategory, setConnectCategory] = useState<string>('General Networking');
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  const CONNECT_CATEGORIES = [
    { id: 'General', label: '🤝 General Networking', text: 'I would like to connect with your family on Jain Connect Global.' },
    { id: 'Family', label: '👨‍👩‍👦 Family & Samaj Reference', text: 'Greetings from our family! Looking forward to staying in touch through the Sangh network.' },
    { id: 'Business', label: '💼 Professional & Trade', text: 'Jai Jinendra! Let us connect for mutual professional synergy and Jain business networking.' },
    { id: 'Matrimonial', label: '💍 Matrimonial Inquiry', text: 'Jai Jinendra! Reaching out regarding community matrimonial reference and family introduction.' },
    { id: 'Seva', label: '🙏 Sangh & Seva Activities', text: 'Jai Jinendra! Interested in coordinating together on upcoming Sangh seva and religious initiatives.' },
  ];

  const handleOpenConnect = () => {
    if (!user) return;

    if (!currentUser) {
      showToast(
        'Sign In Required 🔐',
        `Please sign in to send a networking connection request to ${user.fullName}.`,
        'info'
      );
      setIsAuthModalOpen(true);
      return;
    }

    if (isOwnProfile) {
      showToast(
        'Profile Owner (You)',
        'You are viewing your own digital ID card. When other members view your card, they can click Connect to send you a connection request.',
        'info'
      );
      return;
    }

    if (connectionStatus === 'accepted') {
      showToast(
        'Already Connected 🤝',
        `You and ${user.fullName} are already connected on Jain Connect Global.`,
        'success'
      );
      return;
    }

    if (connectionStatus === 'pending') {
      showToast(
        'Request Already Sent ⏳',
        `Your connection request to ${user.fullName} has been sent and is awaiting acceptance.`,
        'info'
      );
      return;
    }

    setConnectNote(
      `Jai Jinendra ${user.fullName}! I would like to connect with your family on Jain Connect Global.`
    );
    setConnectCategory('General Networking');
    setIsConnectModalOpen(true);
  };

  const handleSendConnectionRequest = () => {
    if (!user || !currentUser) return;
    setIsSendingRequest(true);

    try {
      const baseNote = connectNote.trim() || `Jai Jinendra ${user.fullName}! I would like to connect with your family on Jain Connect Global.`;
      const finalNote = connectCategory && connectCategory !== 'General Networking'
        ? `[${connectCategory}] ${baseNote}`
        : baseNote;

      sendConnectionRequestAlert(
        user.id,
        user.fullName,
        currentUser,
        finalNote
      );

      try {
        localStorage.setItem(`jcg_conn_${currentUser.id}_${user.id}`, 'pending');
      } catch {
        // ignore
      }

      setConnectionStatus('pending');
      setIsConnectModalOpen(false);
      triggerGoldShimmerConfetti();
    } catch (err) {
      console.error('Error sending connection request:', err);
      showToast('Failed to Send Request', 'Please try again later.', 'error');
    } finally {
      setIsSendingRequest(false);
    }
  };

  // Digital ID Privacy Status: 'public' vs 'private' (only visible to connected family members)
  const [privacyStatus, setPrivacyStatus] = useState<'public' | 'private'>(() => {
    if (user?.digitalIdPrivacy) return user.digitalIdPrivacy;
    if (user?.id) {
      try {
        const stored = localStorage.getItem(`jcg_digital_id_privacy_${user.id}`);
        if (stored === 'private' || stored === 'public') return stored;
      } catch {
        // ignore
      }
    }
    return 'public';
  });

  useEffect(() => {
    if (!user) return;
    if (user.digitalIdPrivacy) {
      setPrivacyStatus(user.digitalIdPrivacy);
    } else {
      try {
        const stored = localStorage.getItem(`jcg_digital_id_privacy_${user.id}`);
        if (stored === 'private' || stored === 'public') {
          setPrivacyStatus(stored);
        } else {
          setPrivacyStatus('public');
        }
      } catch {
        setPrivacyStatus('public');
      }
    }
  }, [user?.id, user?.digitalIdPrivacy]);

  const handleTogglePrivacy = (newStatus: 'public' | 'private') => {
    if (!user) return;
    setPrivacyStatus(newStatus);
    try {
      localStorage.setItem(`jcg_digital_id_privacy_${user.id}`, newStatus);
    } catch {
      // ignore
    }
    if (updateUserProfile && (!userOverride || userOverride.id === currentUser?.id)) {
      updateUserProfile({ digitalIdPrivacy: newStatus });
    }
    if (newStatus === 'private') {
      showToast(
        'ID Status: Private 🔒',
        'Digital ID is now set to Private: only visible to connected family members.',
        'info'
      );
    } else {
      showToast(
        'ID Status: Public 🌐',
        'Digital ID is now set to Public: visible across the community directory and events.',
        'success'
      );
    }
  };

  const [cardSide, setCardSide] = useState<'front' | 'qr'>('front');
  const [cardTheme, setCardTheme] = useState<'auspicious' | 'light'>('auspicious');
  const [eventTag, setEventTag] = useState<string>('Jain Sangh Community Pass');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);
  const [scanVerified, setScanVerified] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [selectedBadgeDetail, setSelectedBadgeDetail] = useState<{
    name: string;
    tagline: string;
    description: string;
    category: string;
    criteria: string;
  } | null>(null);
  const [showBadgeSystemInfo, setShowBadgeSystemInfo] = useState(false);

  // Micro-interaction & Gold-Shimmer Entrance State
  const [simulatedBadges, setSimulatedBadges] = useState<string[]>([]);
  const [newlyEarnedBadges, setNewlyEarnedBadges] = useState<string[]>([]);
  const [celebratedBadge, setCelebratedBadge] = useState<string | null>(null);
  const [isShimmeringAll, setIsShimmeringAll] = useState(false);

  // Subtle celebratory toast notification for newly awarded unviewed badge
  const [badgeAwardToast, setBadgeAwardToast] = useState<{
    visible: boolean;
    badgeNames: string[];
    primaryBadge: string;
  } | null>(null);

  // Small 'Edit' toggle and non-sensitive card field customization
  const [isEditMode, setIsEditMode] = useState(false);

  const defaultFieldPrefs: PublicCardFieldPreferences = {
    showMotto: true,
    mottoText: user?.motto || 'Parasparopagraho Jivanam (Live & Let Live)',
    showScripture: true,
    scriptureText: user?.favoriteScripture || 'Navkar Mahamantra',
    showGotra: true,
    showLocation: true,
    showBloodGroup: true,
    showTier: true,
    showOccupation: Boolean(user?.occupation),
    occupationText: user?.occupation || 'Professional / Sangh Sevi',
    showNativePlace: Boolean((user as any)?.nativePlace),
    nativePlaceText: (user as any)?.nativePlace || 'Rajasthan / Gujarat',
  };

  const [fieldPrefs, setFieldPrefs] = useState<PublicCardFieldPreferences>(defaultFieldPrefs);

  useEffect(() => {
    if (!user) return;
    try {
      const stored = localStorage.getItem(`jcg_card_fields_${user.id}`);
      if (stored) {
        setFieldPrefs({ ...defaultFieldPrefs, ...JSON.parse(stored) });
      } else {
        setFieldPrefs(defaultFieldPrefs);
      }
    } catch {
      setFieldPrefs(defaultFieldPrefs);
    }
  }, [user?.id]);

  const updateFieldPref = <K extends keyof PublicCardFieldPreferences>(
    key: K,
    val: PublicCardFieldPreferences[K]
  ) => {
    if (!user) return;
    setFieldPrefs((prev) => {
      const updated = { ...prev, [key]: val };
      try {
        localStorage.setItem(`jcg_card_fields_${user.id}`, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleResetFieldPrefs = () => {
    if (!user) return;
    setFieldPrefs(defaultFieldPrefs);
    try {
      localStorage.setItem(`jcg_card_fields_${user.id}`, JSON.stringify(defaultFieldPrefs));
    } catch {
      // ignore
    }
    showToast('Display Reset', 'Reset digital ID public display fields to default.', 'info');
  };

  // Auto-dismiss the celebratory toast notification after 6.5s
  useEffect(() => {
    if (!badgeAwardToast?.visible) return;
    const timer = setTimeout(() => {
      setBadgeAwardToast((prev) => (prev ? { ...prev, visible: false } : null));
    }, 6500);
    return () => clearTimeout(timer);
  }, [badgeAwardToast?.visible]);

  const cardRef = useRef<HTMLDivElement>(null);

  // Resolve member's active badges based on profile data and registry rules + any simulated earned badges
  const baseActiveBadges = user ? resolveUserBadges(user) : [];
  const activeBadges = Array.from(new Set([...baseActiveBadges, ...simulatedBadges]));

  // Auto-detect newly unlocked badges from storage to trigger entrance animation & subtle celebratory toast
  useEffect(() => {
    if (!isOpen || !user) return;

    const storageKey = `jcg_seen_badges_${user.id}`;
    let seenBadges: string[] = [];
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) seenBadges = JSON.parse(raw);
    } catch {
      // ignore
    }

    const freshBadges = activeBadges.filter((b) => !seenBadges.includes(b));
    if (freshBadges.length > 0) {
      setNewlyEarnedBadges(freshBadges);
      setCelebratedBadge(freshBadges[0]);
      triggerGoldShimmerConfetti();

      // Subtle celebratory toast notification to ensure high visibility
      const badgeNamesText =
        freshBadges.length === 1
          ? `"${freshBadges[0]}"`
          : `${freshBadges.slice(0, 2).map((b) => `"${b}"`).join(' & ')}${freshBadges.length > 2 ? ` +${freshBadges.length - 2} more` : ''}`;

      showToast(
        '🌟 New Honor Awarded!',
        `Congratulations! You've received the ${badgeNamesText} badge on your Digital ID with radiant gold shimmer.`,
        'success',
        6000
      );

      // Display dedicated subtle celebratory toast notification within the modal
      setBadgeAwardToast({
        visible: true,
        badgeNames: freshBadges,
        primaryBadge: freshBadges[0],
      });

      try {
        localStorage.setItem(storageKey, JSON.stringify(activeBadges));
      } catch {
        // ignore
      }
    }
  }, [isOpen, user?.id, activeBadges.length]);

  if (!isOpen || !user) return null;

  // Handler to simulate earning a badge or previewing the gold shimmer entrance
  const handleSimulateNewBadge = (specificBadge?: string) => {
    const allRegisteredBadges = Object.keys(BADGE_SYSTEM_REGISTRY);
    const unearned = allRegisteredBadges.filter((b) => !activeBadges.includes(b));

    const badgeToEarn = specificBadge || (unearned.length > 0 ? unearned[0] : activeBadges[0] || 'Verified Donor');

    setSimulatedBadges((prev) => Array.from(new Set([...prev, badgeToEarn])));
    setNewlyEarnedBadges((prev) => Array.from(new Set([...prev, badgeToEarn])));
    setCelebratedBadge(badgeToEarn);
    setIsShimmeringAll(true);
    setCardSide('front');

    triggerGoldShimmerConfetti();

    showToast(
      '🌟 New Badge Earned!',
      `"${badgeToEarn}" unlocked with a radiant gold shimmer on your Digital ID!`,
      'success',
      6000
    );

    // Also trigger celebratory toast notification preview
    setBadgeAwardToast({
      visible: true,
      badgeNames: [badgeToEarn],
      primaryBadge: badgeToEarn,
    });

    setTimeout(() => {
      setIsShimmeringAll(false);
    }, 4500);
  };

  // Micro-interaction on tapping an existing badge: re-trigger shimmer + open inspector
  const handleBadgeClick = (badgeName: string, config: any, e?: React.MouseEvent) => {
    setNewlyEarnedBadges((prev) => Array.from(new Set([...prev, badgeName])));
    setCelebratedBadge(badgeName);

    // Calculate click coordinates for targeted gold sparks
    if (e) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      triggerGoldShimmerConfetti({ x, y });
    } else {
      triggerGoldShimmerConfetti();
    }

    setSelectedBadgeDetail({
      name: badgeName,
      tagline: config.tagline,
      description: config.description,
      category: config.category,
      criteria: config.criteria,
    });
  };

  // Generate unique standardized Member ID
  const memberCode = `JCG-2026-${(user.id || '108').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-6)}`;

  // Construct JSON profile verification payload for QR
  const qrDataObj = {
    platform: 'Jain Connect Global Sangh',
    memberId: memberCode,
    fullName: user.fullName,
    email: user.email,
    mobile: user.mobile,
    sect: user.sect || 'Swetambar Murtipujak',
    gotra: fieldPrefs.showGotra ? user.gotra || 'Jain Sangh' : undefined,
    city: fieldPrefs.showLocation ? user.city || 'Mumbai' : undefined,
    state: fieldPrefs.showLocation ? user.state || 'Maharashtra' : undefined,
    role: user.role || 'Member',
    bloodGroup: fieldPrefs.showBloodGroup ? user.bloodGroup || 'O+' : undefined,
    motto: fieldPrefs.showMotto && fieldPrefs.mottoText.trim() ? fieldPrefs.mottoText.trim() : undefined,
    favoriteScripture:
      fieldPrefs.showScripture && fieldPrefs.scriptureText.trim()
        ? fieldPrefs.scriptureText.trim()
        : undefined,
    occupation:
      fieldPrefs.showOccupation && fieldPrefs.occupationText.trim()
        ? fieldPrefs.occupationText.trim()
        : undefined,
    nativePlace:
      fieldPrefs.showNativePlace && fieldPrefs.nativePlaceText.trim()
        ? fieldPrefs.nativePlaceText.trim()
        : undefined,
    membershipTier: fieldPrefs.showTier ? user.membershipTier || 'Verified Member' : undefined,
    isVerified: user.isVerified ?? true,
    badges: activeBadges,
    verificationTimestamp: new Date().toISOString(),
    eventTag: eventTag,
    digitalIdPrivacy: privacyStatus,
    privacyScope:
      privacyStatus === 'private'
        ? 'Private (Only visible to connected family members)'
        : 'Public (Global Jain Sangh Community)',
    isFamilyOnly: privacyStatus === 'private',
  };

  const qrString = JSON.stringify(qrDataObj);

  const handleDownloadPdf = async () => {
    if (!cardRef.current || !user) return;
    setIsDownloadingPdf(true);
    showToast('Generating PDF', 'Converting Member Digital ID card to formatted PDF...', 'info');

    try {
      const canvas = await safeHtml2Canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Standard ID Card dimension: 88mm x 55mm (landscape credit card pass size)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [88, 55],
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, 88, 55);

      const cleanName = (user.fullName || 'Member').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`JCG_Digital_ID_${cleanName}.pdf`);

      showToast('Digital ID PDF Downloaded! 📄', 'Member Digital ID saved as formatted PDF document.', 'success');
    } catch (err) {
      console.error('Error generating Member ID PDF:', err);
      showToast('PDF Download Failed', 'Unable to generate PDF document.', 'error');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current || !user) return;
    setIsDownloadingImage(true);
    showToast('Generating ID Image', 'Capturing high-resolution image of your Digital ID card...', 'info');

    try {
      const canvas = await safeHtml2Canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = dataUrl;
      const cleanName = (user.fullName || 'Member').replace(/[^a-zA-Z0-9]/g, '_');
      const sideTag = cardSide === 'qr' ? 'QR_Verification' : 'Front';
      link.download = `JCG_Digital_ID_${cleanName}_${sideTag}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Digital ID Image Saved! 🖼️', 'Member Digital ID card downloaded successfully as PNG image.', 'success');
    } catch (err) {
      console.error('Error generating Member ID image:', err);
      showToast('Image Download Failed', 'Unable to capture Digital ID card as image.', 'error');
    } finally {
      setIsDownloadingImage(false);
    }
  };

  const handleCopyMemberId = () => {
    navigator.clipboard.writeText(memberCode);
    setCopiedId(true);
    showToast('Member ID Copied', `Copied ${memberCode} to clipboard.`, 'success');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(qrString);
    setCopiedPayload(true);
    showToast('QR Data Copied', 'Encrypted member profile payload copied to clipboard.', 'success');
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handlePrintCard = () => {
    window.print();
    showToast('Print Initiated', 'Sending Digital ID Card layout to system printer.', 'info');
  };

  const handleSimulateScan = () => {
    setIsSimulatingScan(true);
    setScanVerified(false);
    setTimeout(() => {
      setIsSimulatingScan(false);
      setScanVerified(true);
      showToast(
        'QR Code Verified! ✅',
        `Authenticated ${user.fullName} (${memberCode}) for ${eventTag}.`,
        'success'
      );
    }, 1200);
  };

  const EVENT_TAG_OPTIONS = [
    'Jain Sangh Community Pass',
    'Paryushan Mahaparv 2026 Access',
    'Jain Business Conclave Delegate',
    'Sangh Mahasabha Voting Member',
    'Emergency Medical & Blood ID',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in print:p-0 print:bg-white">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-300/50 dark:border-amber-700/50 my-6 overflow-hidden print:shadow-none print:border-none print:my-0">
        
        {/* Header Modal Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <QrCode className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-serif leading-tight">Digital Member ID & QR Card</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-extrabold uppercase tracking-wider">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-amber-200">
                Official Sangh ID for event check-in, directory sharing & verification
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtle Celebratory Toast Notification for Newly Awarded Unviewed Badge */}
        {badgeAwardToast && badgeAwardToast.visible && (
          <div
            id="celebratory-badge-toast"
            className="absolute top-18 sm:top-20 left-3 right-3 sm:left-5 sm:right-5 z-40 animate-badge-entrance pointer-events-auto"
            role="status"
            aria-live="polite"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-amber-950 to-slate-950 p-3.5 sm:p-4 text-white shadow-2xl border-2 border-amber-400 backdrop-blur-xl ring-4 ring-amber-500/25">
              <span className="gold-shimmer-sheen" />
              <div className="relative z-10 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shrink-0 animate-star-sparkle">
                  <Sparkles className="w-5 h-5 text-slate-950" />
                </div>
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      New Honor Awarded
                    </span>
                    <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                      ✨ Gold Shimmer Active
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                    <span>Congratulations! You earned</span>
                    <span className="px-2 py-0.5 rounded-lg bg-amber-500/30 text-amber-200 border border-amber-400/60 font-black">
                      {badgeAwardToast.badgeNames.join(', ')}
                    </span>
                  </h4>
                  <p className="text-xs text-amber-100/90 mt-1 leading-relaxed">
                    This prestigious Sangh recognition is now active on your Digital ID with our radiant gold shimmer.
                  </p>
                  <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        const config = getBadgeVisualConfig(badgeAwardToast.primaryBadge);
                        setSelectedBadgeDetail({
                          name: badgeAwardToast.primaryBadge,
                          tagline: config.tagline,
                          description: config.description,
                          category: config.category,
                          criteria: config.criteria,
                        });
                        setBadgeAwardToast((prev) => (prev ? { ...prev, visible: false } : null));
                      }}
                      className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-xs flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
                    >
                      <Award className="w-3 h-3 text-slate-950" />
                      <span>Inspect Honor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerGoldShimmerConfetti()}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 text-xs font-bold border border-amber-400/30 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Sparks ✨</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBadgeAwardToast((prev) => (prev ? { ...prev, visible: false } : null))}
                      className="px-2 py-1 rounded-lg text-slate-400 hover:text-white text-xs font-medium transition-colors cursor-pointer ml-auto"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBadgeAwardToast((prev) => (prev ? { ...prev, visible: false } : null))}
                  className="p-1 rounded-lg text-amber-300/80 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                  title="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Subtle Auto-Dismiss Progress Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-950/80 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 animate-toast-progress" />
              </div>
            </div>
          </div>
        )}

        {/* Modal Content Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[85vh] overflow-y-auto">

          {/* Event Pass Selector Pill & Card Theme Toggle */}
          <div className="print:hidden bg-amber-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-amber-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            {/* Card Owner Profile Switcher */}
            <div
              id="digital-id-card-owner-switcher"
              className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-amber-300/80 dark:border-slate-600 shrink-0 text-xs shadow-2xs"
            >
              <Users className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
                Card:
              </span>
              <select
                id="digital-id-member-select"
                value={userOverride ? userOverride.id : (previewMemberId || 'self')}
                onChange={(e) => {
                  const val = e.target.value;
                  setPreviewMemberId(val);
                  if (setDigitalIdTargetUser) {
                    if (val === 'self') {
                      setDigitalIdTargetUser(null);
                    } else {
                      const m = members.find((mem) => (mem.userId || mem.id) === val);
                      if (m) setDigitalIdTargetUser(m);
                    }
                  }
                }}
                className="bg-transparent text-slate-900 dark:text-white font-bold text-xs focus:outline-none cursor-pointer pr-1 max-w-[130px] sm:max-w-none truncate"
                title="Switch between your digital ID and other community members to preview cards and connect"
              >
                {currentUser && (
                  <option value="self">
                    {currentUser.fullName} (You)
                  </option>
                )}
                {members
                  .filter((m) => !currentUser || (m.userId || m.id) !== currentUser.id)
                  .slice(0, 10)
                  .map((m) => (
                    <option key={m.id} value={m.userId || m.id}>
                      {m.name} {m.surname} ({m.city})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Pass Type:
              </span>
              <select
                value={eventTag}
                onChange={(e) => setEventTag(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-amber-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs"
              >
                {EVENT_TAG_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Connect Button in Top Settings Toolbar */}
            <button
              id="digital-id-topbar-connect-btn"
              type="button"
              onClick={handleOpenConnect}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 border ${
                isOwnProfile
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  : connectionStatus === 'accepted'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                  : connectionStatus === 'pending'
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-emerald-400 shadow-sm hover:scale-105 active:scale-95'
              }`}
              title={
                isOwnProfile
                  ? 'Viewing your own digital card'
                  : connectionStatus === 'accepted'
                  ? `Connected with ${user.fullName}`
                  : connectionStatus === 'pending'
                  ? 'Connection request pending acceptance'
                  : `Send a connection request to ${user.fullName}`
              }
            >
              {isOwnProfile ? (
                <>
                  <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Your ID</span>
                </>
              ) : connectionStatus === 'accepted' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Connected</span>
                </>
              ) : connectionStatus === 'pending' ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pending</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Connect</span>
                </>
              )}
            </button>

            {/* Theme Toggle Pill */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-amber-300/80 dark:border-slate-600 shrink-0">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 px-1 flex items-center gap-1">
                <Palette className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                Card Theme:
              </span>
              <button
                onClick={() => {
                  setCardTheme('light');
                  showToast('Card Theme Changed', 'Switched Digital ID theme to Light Minimal.', 'info');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  cardTheme === 'light'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sun className="w-3 h-3 text-amber-400" />
                <span>Light</span>
              </button>
              <button
                onClick={() => {
                  setCardTheme('auspicious');
                  showToast('Card Theme Changed', 'Switched Digital ID theme to Auspicious Gold.', 'info');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  cardTheme === 'auspicious'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>Auspicious</span>
              </button>
            </div>

            {/* Instant Digital ID Privacy Status Toggle (Public vs Private - Connected Family Only) */}
            <div
              id="digital-id-privacy-settings-toggle"
              className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-amber-300/80 dark:border-slate-600 shrink-0 shadow-2xs"
            >
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 px-1 flex items-center gap-1">
                {privacyStatus === 'private' ? (
                  <Lock className="w-3 h-3 text-rose-500 dark:text-rose-400" />
                ) : (
                  <Globe className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                )}
                Privacy:
              </span>
              <button
                id="digital-id-privacy-public-toggle-btn"
                type="button"
                onClick={() => handleTogglePrivacy('public')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  privacyStatus === 'public'
                    ? 'bg-emerald-600 text-white shadow-xs scale-102 ring-1 ring-emerald-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Public: Visible across community directory and verified events"
              >
                <Globe className="w-3 h-3" />
                <span>Public</span>
              </button>
              <button
                id="digital-id-privacy-private-toggle-btn"
                type="button"
                onClick={() => handleTogglePrivacy('private')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  privacyStatus === 'private'
                    ? 'bg-rose-600 text-white shadow-xs scale-102 ring-1 ring-rose-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Private: Only visible to connected family members"
              >
                <Lock className="w-3 h-3" />
                <span>Private (Family Only)</span>
              </button>
            </div>

            {/* Badges Guide Explorer Trigger */}
            <button
              onClick={() => setShowBadgeSystemInfo(true)}
              className="px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300/50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Explore all Sangh Member Badges and qualification criteria"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Badges System</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-900 text-[10px] font-black">
                {activeBadges.length} Active
              </span>
            </button>

            {/* Micro-interaction: Simulate / Test Earning a Badge */}
            <button
              onClick={() => handleSimulateNewBadge()}
              className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105 active:scale-95 border border-amber-300 dark:border-amber-400"
              title="Simulate earning a new Sangh badge with smooth entrance animation and gold shimmer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-star-sparkle" />
              <span>Earn Badge</span>
              <span className="text-[9px] px-1 rounded-md bg-amber-300 text-slate-950 font-black shadow-xs">
                ✨
              </span>
            </button>

            {/* Small 'Edit' Toggle for Customizing Public Digital ID Card Display Fields */}
            <button
              id="member-card-edit-toggle-btn"
              onClick={() => {
                setIsEditMode((prev) => !prev);
                if (!isEditMode) {
                  showToast('Edit Display Active', 'Select which non-sensitive fields appear on your digital ID.', 'info');
                }
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border ${
                isEditMode
                  ? 'bg-amber-600 text-white border-amber-500 ring-2 ring-amber-400/60 shadow-md scale-102'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-amber-300/60 dark:border-slate-700 hover:border-amber-400'
              }`}
              title="Toggle field selection to choose which non-sensitive fields (like favorite scripture or motto) display on your public digital ID card"
            >
              <SlidersHorizontal
                className={`w-3.5 h-3.5 ${
                  isEditMode ? 'text-amber-200' : 'text-amber-600 dark:text-amber-400'
                }`}
              />
              <span>{isEditMode ? 'Close Edit' : 'Edit'}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isEditMode ? 'bg-amber-300 animate-ping' : 'bg-amber-500'
                }`}
              />
            </button>
          </div>

          {/* View Toggle Tabs */}
          <div className="flex items-center justify-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl print:hidden border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setCardSide('front')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                cardSide === 'front'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Digital ID Front</span>
            </button>
            <button
              onClick={() => setCardSide('qr')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                cardSide === 'qr'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Code Verification</span>
            </button>
          </div>

          {/* Custom Non-Sensitive Display Fields Editor Panel */}
          {isEditMode && (
            <div
              id="public-fields-edit-panel"
              className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-slate-900/5 dark:from-slate-800 dark:via-slate-800/95 dark:to-slate-900 border-2 border-amber-400/70 shadow-xl space-y-4 animate-fade-in print:hidden"
            >
              <div className="flex items-center justify-between border-b border-amber-300/40 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-amber-500 text-slate-950 shadow-xs">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Customize Public ID Display Fields</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-extrabold border border-amber-300 dark:border-amber-800">
                        Live Preview
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Select non-sensitive personal details and Jain inspirations to display on your digital ID.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetFieldPrefs}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Reset all public card fields to defaults"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="hidden sm:inline">Reset Defaults</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditMode(false);
                      showToast('Display Saved', 'Your digital ID card presentation has been updated.', 'success');
                    }}
                    className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>

              {/* Digital ID Privacy Settings Section (Public vs Private - Connected Family Members Only) */}
              <div
                id="member-digital-id-privacy-settings-section"
                className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-400/80 dark:border-slate-700 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-amber-200/50 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2.5 rounded-xl text-white shadow-xs transition-colors ${
                        privacyStatus === 'private' ? 'bg-rose-600' : 'bg-emerald-600'
                      }`}
                    >
                      {privacyStatus === 'private' ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Globe className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                        <span>Digital ID Privacy & Access Scope</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                            privacyStatus === 'private'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          }`}
                        >
                          {privacyStatus === 'private' ? 'Private • Family Only' : 'Public ID'}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        Choose whether your digital card is public community-wide or restricted strictly to connected family members.
                      </p>
                    </div>
                  </div>

                  {/* Dual Segmented Switch Buttons */}
                  <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto shrink-0 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleTogglePrivacy('public')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        privacyStatus === 'public'
                          ? 'bg-emerald-600 text-white shadow-xs scale-102 ring-1 ring-emerald-400'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Public</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTogglePrivacy('private')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        privacyStatus === 'private'
                          ? 'bg-rose-600 text-white shadow-xs scale-102 ring-1 ring-rose-400'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Private (Family Only)</span>
                    </button>
                  </div>
                </div>

                {/* Explanatory Dual Scope Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    onClick={() => handleTogglePrivacy('public')}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      privacyStatus === 'public'
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-400/40 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                        <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Public Status (Community Wide)</span>
                      </div>
                      {privacyStatus === 'public' && (
                        <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Visible to verified members in global directory searches, event gate passes, matrimonial biodata verification, and Sangh gatherings.
                    </p>
                  </div>

                  <div
                    onClick={() => handleTogglePrivacy('private')}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      privacyStatus === 'private'
                        ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 ring-2 ring-rose-400/40 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-800 dark:text-rose-300">
                        <Lock className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        <span>Private Status (Connected Family Members Only)</span>
                      </div>
                      {privacyStatus === 'private' && (
                        <span className="text-[10px] font-black uppercase text-rose-700 dark:text-rose-300 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Restricted access. Only verified, connected family members within your household can view your digital ID card details and QR verification.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid of Non-Sensitive Field Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* 1. Life Motto / Philosophy */}
                <div className="p-3 rounded-xl border border-amber-200/80 dark:border-slate-700 bg-white dark:bg-slate-900/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 dark:text-slate-100">
                      <input
                        type="checkbox"
                        checked={fieldPrefs.showMotto}
                        onChange={(e) => updateFieldPref('showMotto', e.target.checked)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="flex items-center gap-1.5">
                        <Quote className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        Favorite Motto / Philosophy
                      </span>
                    </label>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        fieldPrefs.showMotto
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {fieldPrefs.showMotto ? 'Visible' : 'Hidden'}
                    </span>
                  </div>

                  {fieldPrefs.showMotto && (
                    <div className="space-y-1.5 pt-1">
                      <input
                        type="text"
                        value={fieldPrefs.mottoText}
                        onChange={(e) => updateFieldPref('mottoText', e.target.value)}
                        placeholder="Enter your personal Jain life motto..."
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-semibold">Presets:</span>
                        {MOTTO_PRESETS.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => updateFieldPref('mottoText', m)}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-medium transition-colors"
                          >
                            {m.split(' (')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Favorite Scripture / Sutra */}
                <div className="p-3 rounded-xl border border-amber-200/80 dark:border-slate-700 bg-white dark:bg-slate-900/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 dark:text-slate-100">
                      <input
                        type="checkbox"
                        checked={fieldPrefs.showScripture}
                        onChange={(e) => updateFieldPref('showScripture', e.target.checked)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        Favorite Scripture / Shloka
                      </span>
                    </label>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        fieldPrefs.showScripture
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {fieldPrefs.showScripture ? 'Visible' : 'Hidden'}
                    </span>
                  </div>

                  {fieldPrefs.showScripture && (
                    <div className="space-y-1.5 pt-1">
                      <input
                        type="text"
                        value={fieldPrefs.scriptureText}
                        onChange={(e) => updateFieldPref('scriptureText', e.target.value)}
                        placeholder="e.g. Navkar Mahamantra, Tattvartha Sutra..."
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-semibold">Presets:</span>
                        {SCRIPTURE_PRESETS.slice(0, 5).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => updateFieldPref('scriptureText', s)}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-medium transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Gotra / Family Lineage */}
                <div className="p-3 rounded-xl border border-amber-200/80 dark:border-slate-700 bg-white dark:bg-slate-900/80 flex items-center justify-between">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 dark:text-slate-100">
                      <input
                        type="checkbox"
                        checked={fieldPrefs.showGotra}
                        onChange={(e) => updateFieldPref('showGotra', e.target.checked)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Gotra / Family Lineage</span>
                    </label>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 pl-6">
                      Displays "{user.gotra || 'Jain Family'}" on card
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                      fieldPrefs.showGotra
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {fieldPrefs.showGotra ? 'Visible' : 'Hidden'}
                  </span>
                </div>

                {/* 4. City & State Location */}
                <div className="p-3 rounded-xl border border-amber-200/80 dark:border-slate-700 bg-white dark:bg-slate-900/80 flex items-center justify-between">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 dark:text-slate-100">
                      <input
                        type="checkbox"
                        checked={fieldPrefs.showLocation}
                        onChange={(e) => updateFieldPref('showLocation', e.target.checked)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <span>City & State Location</span>
                    </label>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 pl-6">
                      Displays "{user.city || 'Mumbai'}, {user.state || 'MH'}"
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                      fieldPrefs.showLocation
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {fieldPrefs.showLocation ? 'Visible' : 'Hidden'}
                  </span>
                </div>

                {/* 5. Emergency Blood Group */}
                <div className="p-3 rounded-xl border border-amber-200/80 dark:border-slate-700 bg-white dark:bg-slate-900/80 flex items-center justify-between">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 dark:text-slate-100">
                      <input
                        type="checkbox"
                        checked={fieldPrefs.showBloodGroup}
                        onChange={(e) => updateFieldPref('showBloodGroup', e.target.checked)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                        Emergency Blood Group
                      </span>
                    </label>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 pl-6">
                      Displays "{user.bloodGroup || 'O+'}" for donor coordination
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                      fieldPrefs.showBloodGroup
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {fieldPrefs.showBloodGroup ? 'Visible' : 'Hidden'}
                  </span>
                </div>

                {/* 6. Membership Tier */}
                <div className="p-3 rounded-xl border border-amber-200/80 dark:border-slate-700 bg-white dark:bg-slate-900/80 flex items-center justify-between">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 dark:text-slate-100">
                      <input
                        type="checkbox"
                        checked={fieldPrefs.showTier}
                        onChange={(e) => updateFieldPref('showTier', e.target.checked)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Membership Tier</span>
                    </label>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 pl-6">
                      Displays "{user.membershipTier || 'Verified Member'}"
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                      fieldPrefs.showTier
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {fieldPrefs.showTier ? 'Visible' : 'Hidden'}
                  </span>
                </div>

                {/* 7. Profession / Occupation */}
                <div className="p-3 rounded-xl border border-amber-200/80 dark:border-slate-700 bg-white dark:bg-slate-900/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 dark:text-slate-100">
                      <input
                        type="checkbox"
                        checked={fieldPrefs.showOccupation}
                        onChange={(e) => updateFieldPref('showOccupation', e.target.checked)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        Profession / Vocation
                      </span>
                    </label>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        fieldPrefs.showOccupation
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {fieldPrefs.showOccupation ? 'Visible' : 'Hidden'}
                    </span>
                  </div>

                  {fieldPrefs.showOccupation && (
                    <input
                      type="text"
                      value={fieldPrefs.occupationText}
                      onChange={(e) => updateFieldPref('occupationText', e.target.value)}
                      placeholder="e.g. Software Architect, Diamond Merchant..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  )}
                </div>

                {/* 8. Native Place / Mool Niwas */}
                <div className="p-3 rounded-xl border border-amber-200/80 dark:border-slate-700 bg-white dark:bg-slate-900/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 dark:text-slate-100">
                      <input
                        type="checkbox"
                        checked={fieldPrefs.showNativePlace}
                        onChange={(e) => updateFieldPref('showNativePlace', e.target.checked)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        Native Place (Mool Niwas)
                      </span>
                    </label>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        fieldPrefs.showNativePlace
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {fieldPrefs.showNativePlace ? 'Visible' : 'Hidden'}
                    </span>
                  </div>

                  {fieldPrefs.showNativePlace && (
                    <input
                      type="text"
                      value={fieldPrefs.nativePlaceText}
                      onChange={(e) => updateFieldPref('nativePlaceText', e.target.value)}
                      placeholder="e.g. Osian, Rajasthan or Patan, Gujarat..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  )}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center gap-2 text-[11px] text-amber-900 dark:text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>
                  <strong>Tip:</strong> Selected non-sensitive fields are reflected immediately below on your live card, embedded in QR verification, and included in local downloads.
                </span>
              </div>
            </div>
          )}

          {/* Celebratory Micro-Interaction Banner with Gold Shimmer */}
          {celebratedBadge && (
            <div className="relative overflow-hidden p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border border-amber-400/80 dark:border-amber-500 shadow-md flex items-center justify-between gap-3 animate-badge-entrance">
              <span className="gold-shimmer-sheen" />
              <div className="flex items-center gap-2.5 relative z-10">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md animate-star-sparkle shrink-0">
                  <Sparkles className="w-4 h-4 text-slate-950" />
                </div>
                <div>
                  <p className="text-xs font-black text-amber-900 dark:text-amber-200 flex items-center gap-1.5 flex-wrap">
                    <span>Honor Earned:</span>
                    <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-[11px] font-black shadow-xs">
                      {celebratedBadge}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200 font-bold">
                      Gold Shimmer ✨
                    </span>
                  </p>
                  <p className="text-[10px] font-semibold text-amber-800/90 dark:text-amber-300">
                    Badge is adorned with radiant golden shimmer and entrance animation on your Digital ID.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10 shrink-0">
                <button
                  onClick={() => triggerGoldShimmerConfetti()}
                  className="px-2 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-black shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
                  title="Fire golden sparkles"
                >
                  <Sparkles className="w-3 h-3" />
                  <span className="hidden sm:inline">Sparks</span>
                </button>
                <button
                  onClick={() => setCelebratedBadge(null)}
                  className="p-1 rounded-lg text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
                  title="Dismiss celebration"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Physical Digital ID Card Container */}
          <div
            ref={cardRef}
            className={`relative rounded-3xl p-5 sm:p-6 shadow-2xl border-2 overflow-hidden transition-all transform hover:scale-[1.01] ${
              cardTheme === 'auspicious'
                ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-white border-amber-300/60'
                : 'bg-gradient-to-br from-slate-50 via-white to-amber-50/50 text-slate-900 border-slate-300'
            }`}
          >
            {/* Background Decorative Elements */}
            <div
              className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-2xl pointer-events-none ${
                cardTheme === 'auspicious' ? 'bg-white/10' : 'bg-amber-500/10'
              }`}
            />
            <div
              className={`absolute -bottom-12 -left-12 w-40 h-40 rounded-full blur-2xl pointer-events-none ${
                cardTheme === 'auspicious' ? 'bg-amber-400/20' : 'bg-slate-300/40'
              }`}
            />
            <div
              className={`absolute top-1/2 right-4 pointer-events-none text-9xl font-serif ${
                cardTheme === 'auspicious' ? 'opacity-10 text-white' : 'opacity-5 text-slate-900'
              }`}
            >
              🙏
            </div>

            {/* Top Brand Banner */}
            <div
              className={`flex items-center justify-between pb-3 mb-4 relative z-10 border-b ${
                cardTheme === 'auspicious' ? 'border-amber-300/30' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shadow-md ${
                    cardTheme === 'auspicious'
                      ? 'bg-amber-400 text-amber-950'
                      : 'bg-slate-900 text-amber-400'
                  }`}
                >
                  JCG
                </div>
                <div>
                  <h3
                    className={`font-serif font-black text-sm tracking-wider uppercase ${
                      cardTheme === 'auspicious' ? 'text-amber-100' : 'text-slate-900'
                    }`}
                  >
                    Jain Connect Global
                  </h3>
                  <p
                    className={`text-[9px] tracking-widest uppercase font-semibold ${
                      cardTheme === 'auspicious' ? 'text-amber-200' : 'text-slate-500'
                    }`}
                  >
                    Global Jain Sangh Digital Card
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center justify-end gap-1.5 flex-wrap">
                {/* Privacy Badge on Card Header */}
                {privacyStatus === 'private' ? (
                  <span
                    id="card-privacy-indicator-badge-private"
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${
                      cardTheme === 'auspicious'
                        ? 'bg-rose-500/30 text-rose-100 border-rose-300/60 shadow-xs'
                        : 'bg-rose-100 text-rose-800 border-rose-300 shadow-xs'
                    }`}
                    title="Digital ID Privacy: Private (Only visible to connected family members)"
                  >
                    <Lock className="w-2.5 h-2.5 shrink-0" />
                    <span>Private • Family Only</span>
                  </span>
                ) : (
                  <span
                    id="card-privacy-indicator-badge-public"
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${
                      cardTheme === 'auspicious'
                        ? 'bg-emerald-500/30 text-emerald-100 border-emerald-300/50 shadow-xs'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs'
                    }`}
                    title="Digital ID Privacy: Public (Visible across community)"
                  >
                    <Globe className="w-2.5 h-2.5 shrink-0" />
                    <span>Public ID</span>
                  </span>
                )}

                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase ${
                    cardTheme === 'auspicious'
                      ? 'bg-amber-400/30 text-amber-100 border-amber-300/40'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {eventTag}
                </span>
              </div>
            </div>

            {cardSide === 'front' ? (
              /* CARD FRONT VIEW */
              <div className="space-y-4 relative z-10">
                {/* Private Digital ID Status Banner when restricted */}
                {privacyStatus === 'private' && (
                  <div
                    id="card-front-private-family-banner"
                    className={`px-3 py-1.5 rounded-xl border text-[11px] flex items-center justify-between gap-2 transition-all ${
                      cardTheme === 'auspicious'
                        ? 'bg-rose-950/60 border-rose-400/50 text-rose-100 shadow-inner'
                        : 'bg-rose-50 border-rose-200 text-rose-900 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-medium truncate">
                      <Lock
                        className={`w-3.5 h-3.5 shrink-0 ${
                          cardTheme === 'auspicious' ? 'text-rose-300' : 'text-rose-600'
                        }`}
                      />
                      <span className="truncate">
                        <strong>Private Digital ID</strong> • Only visible to connected family members
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md shrink-0 ${
                        cardTheme === 'auspicious'
                          ? 'bg-rose-500/40 text-rose-200 border border-rose-300/40'
                          : 'bg-rose-200 text-rose-900'
                      }`}
                    >
                      Family Scope
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={user.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                      alt={user.fullName}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 shadow-xl ${
                        cardTheme === 'auspicious' ? 'border-amber-300' : 'border-slate-300'
                      }`}
                    />
                    {user.isVerified && (
                      <span
                        className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full shadow-md"
                        title="Verified Member"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2
                        className={`text-lg sm:text-xl font-serif font-black truncate ${
                          cardTheme === 'auspicious' ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {user.fullName}
                      </h2>
                    </div>

                    <p
                      className={`text-xs font-semibold mt-0.5 ${
                        cardTheme === 'auspicious' ? 'text-amber-200' : 'text-slate-600'
                      }`}
                    >
                      {user.role || 'Sangh Member'} • {user.sect || 'Swetambar'}
                    </p>

                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-mono font-bold tracking-wider ${
                          cardTheme === 'auspicious'
                            ? 'bg-amber-950/70 border-amber-300/50 text-amber-200'
                            : 'bg-slate-100 border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>ID:</span>
                        <span
                          className={
                            cardTheme === 'auspicious'
                              ? 'text-amber-300 font-black'
                              : 'text-amber-700 font-black'
                          }
                        >
                          {memberCode}
                        </span>
                      </div>

                      {/* Connect Button on Card Front */}
                      <button
                        id="card-front-connect-btn"
                        type="button"
                        onClick={handleOpenConnect}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer ${
                          isOwnProfile
                            ? cardTheme === 'auspicious'
                              ? 'bg-amber-900/40 border border-amber-400/30 text-amber-200/90'
                              : 'bg-slate-100 border border-slate-300 text-slate-600'
                            : connectionStatus === 'accepted'
                            ? 'bg-emerald-500 text-white ring-1 ring-emerald-300 shadow-sm'
                            : connectionStatus === 'pending'
                            ? cardTheme === 'auspicious'
                              ? 'bg-amber-500/30 border border-amber-300/60 text-amber-200'
                              : 'bg-amber-100 border border-amber-300 text-amber-800'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white ring-1 ring-emerald-300 shadow-md hover:scale-105 active:scale-95'
                        }`}
                        title={
                          isOwnProfile
                            ? 'Profile Owner (You)'
                            : connectionStatus === 'accepted'
                            ? `Connected with ${user.fullName}`
                            : connectionStatus === 'pending'
                            ? 'Connection request pending'
                            : `Send networking connection request to ${user.fullName}`
                        }
                      >
                        {isOwnProfile ? (
                          <>
                            <UserIcon className="w-3 h-3" />
                            <span>Your ID</span>
                          </>
                        ) : connectionStatus === 'accepted' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Connected</span>
                          </>
                        ) : connectionStatus === 'pending' ? (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Request Sent</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3 h-3" />
                            <span>Connect</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Non-Sensitive Personal Jain Life Motto Banner */}
                {fieldPrefs.showMotto && fieldPrefs.mottoText.trim() && (
                  <div
                    className={`px-3 py-1.5 rounded-xl border text-xs font-serif italic flex items-center gap-2 transition-all ${
                      cardTheme === 'auspicious'
                        ? 'bg-amber-950/60 border-amber-300/40 text-amber-100 shadow-inner'
                        : 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-xs'
                    }`}
                  >
                    <Quote
                      className={`w-3.5 h-3.5 shrink-0 rotate-180 ${
                        cardTheme === 'auspicious' ? 'text-amber-300' : 'text-amber-600'
                      }`}
                    />
                    <span className="truncate">“{fieldPrefs.mottoText}”</span>
                  </div>
                )}

                {/* PROMINENT MEMBER BADGES SECTION */}
                {activeBadges.length > 0 && (
                  <div
                    className={`p-2.5 rounded-2xl border transition-all relative overflow-hidden ${
                      cardTheme === 'auspicious'
                        ? 'bg-gradient-to-r from-black/40 via-amber-950/40 to-black/40 border-amber-400/50 shadow-inner'
                        : 'bg-gradient-to-r from-amber-50/90 via-white to-amber-50/90 border-amber-300 shadow-xs'
                    } ${
                      celebratedBadge ? 'ring-2 ring-amber-400/80 shadow-lg' : ''
                    }`}
                  >
                    {/* Background Golden Sheen when global shimmer is active */}
                    {(celebratedBadge || isShimmeringAll) && (
                      <span className="gold-shimmer-sheen opacity-60" />
                    )}

                    <div className="flex items-center justify-between mb-1.5 px-0.5 relative z-10">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                          cardTheme === 'auspicious' ? 'text-amber-300' : 'text-amber-900'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        Sangh Accreditations & Honors
                      </span>
                      <div className="flex items-center gap-2">
                        {newlyEarnedBadges.length > 0 && (
                          <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1 animate-pulse">
                            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                            Honors Active
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold ${
                            cardTheme === 'auspicious' ? 'text-amber-200/90' : 'text-slate-600'
                          }`}
                        >
                          {activeBadges.length} Active {activeBadges.length === 1 ? 'Honor' : 'Honors'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 relative z-10">
                      {activeBadges.map((badgeName, index) => {
                        const config = getBadgeVisualConfig(badgeName);
                        const style = cardTheme === 'auspicious' ? config.auspicious : config.light;
                        const IconComponent = config.icon;
                        const isNewlyEarned =
                          newlyEarnedBadges.includes(badgeName) || celebratedBadge === badgeName;

                        return (
                          <button
                            key={badgeName}
                            type="button"
                            onClick={(e) => handleBadgeClick(badgeName, config, e)}
                            className={`group relative overflow-hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-black transition-all cursor-pointer transform hover:scale-105 active:scale-95 shadow-xs ${
                              style.badgeBg
                            } ${style.textColor} ${style.borderColor} ${
                              isNewlyEarned
                                ? 'animate-badge-entrance gold-badge-border-glow animate-gold-aura-pulse ring-2 ring-amber-400/90 shadow-md scale-102'
                                : 'hover:border-amber-400/90'
                            }`}
                            style={{
                              animationDelay: isNewlyEarned ? `${index * 120}ms` : undefined,
                            }}
                            title={`Click to view criteria and re-trigger gold shimmer for ${badgeName}`}
                          >
                            {/* Gold Shimmer Sheen Layer for Newly Earned Badges */}
                            {(isNewlyEarned || isShimmeringAll) && (
                              <span className="gold-shimmer-sheen gold-shimmer-sheen-fast" />
                            )}

                            {/* Hover Micro-interaction: Gold Shimmer Sheen Wave */}
                            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl overflow-hidden">
                              <span className="gold-shimmer-sheen" />
                            </span>

                            <span className="relative z-10 flex items-center gap-1.5">
                              <IconComponent
                                className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:rotate-12 ${style.iconColor}`}
                              />
                              <span className="tracking-wide">{badgeName}</span>
                              <span className="text-[9px] opacity-75 font-normal hidden sm:inline">
                                • {config.tagline}
                              </span>
                            </span>

                            {/* Celebratory Micro-Badge Indicator */}
                            {isNewlyEarned && (
                              <span className="relative z-10 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-300 dark:text-amber-200 animate-star-sparkle shrink-0" />
                                <span className="px-1 py-0.2 rounded-md bg-amber-400 text-slate-950 text-[8px] font-black uppercase tracking-wider shadow-xs animate-bounce">
                                  New
                                </span>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Dynamic Non-Sensitive Attributes Grid */}
                {(() => {
                  const visibleItems: React.ReactNode[] = [];

                  if (fieldPrefs.showGotra) {
                    visibleItems.push(
                      <div
                        key="gotra"
                        className={`p-2 rounded-xl border ${
                          cardTheme === 'auspicious'
                            ? 'bg-amber-950/40 border-amber-300/20'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <p
                          className={`text-[10px] font-bold uppercase ${
                            cardTheme === 'auspicious' ? 'text-amber-300/80' : 'text-slate-500'
                          }`}
                        >
                          Gotra / Family
                        </p>
                        <p
                          className={`font-semibold truncate ${
                            cardTheme === 'auspicious' ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {user.gotra || 'Jain Family'}
                        </p>
                      </div>
                    );
                  }

                  if (fieldPrefs.showLocation) {
                    visibleItems.push(
                      <div
                        key="location"
                        className={`p-2 rounded-xl border ${
                          cardTheme === 'auspicious'
                            ? 'bg-amber-950/40 border-amber-300/20'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <p
                          className={`text-[10px] font-bold uppercase ${
                            cardTheme === 'auspicious' ? 'text-amber-300/80' : 'text-slate-500'
                          }`}
                        >
                          Location
                        </p>
                        <p
                          className={`font-semibold truncate flex items-center gap-1 ${
                            cardTheme === 'auspicious' ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          <MapPin
                            className={`w-3 h-3 shrink-0 ${
                              cardTheme === 'auspicious' ? 'text-amber-300' : 'text-amber-600'
                            }`}
                          />
                          {user.city || 'Mumbai'}, {user.state || 'MH'}
                        </p>
                      </div>
                    );
                  }

                  if (fieldPrefs.showBloodGroup) {
                    visibleItems.push(
                      <div
                        key="bloodGroup"
                        className={`p-2 rounded-xl border ${
                          cardTheme === 'auspicious'
                            ? 'bg-amber-950/40 border-amber-300/20'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <p
                          className={`text-[10px] font-bold uppercase ${
                            cardTheme === 'auspicious' ? 'text-amber-300/80' : 'text-slate-500'
                          }`}
                        >
                          Blood Group
                        </p>
                        <p
                          className={`font-semibold flex items-center gap-1 ${
                            cardTheme === 'auspicious' ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          <Heart className="w-3 h-3 text-red-500 fill-red-500 shrink-0" />
                          {user.bloodGroup || 'O+'} (Available)
                        </p>
                      </div>
                    );
                  }

                  if (fieldPrefs.showTier) {
                    visibleItems.push(
                      <div
                        key="tier"
                        className={`p-2 rounded-xl border ${
                          cardTheme === 'auspicious'
                            ? 'bg-amber-950/40 border-amber-300/20'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <p
                          className={`text-[10px] font-bold uppercase ${
                            cardTheme === 'auspicious' ? 'text-amber-300/80' : 'text-slate-500'
                          }`}
                        >
                          Membership Tier
                        </p>
                        <p
                          className={`font-semibold flex items-center gap-1 ${
                            cardTheme === 'auspicious' ? 'text-amber-300' : 'text-amber-700 font-bold'
                          }`}
                        >
                          <Award
                            className={`w-3 h-3 shrink-0 ${
                              cardTheme === 'auspicious' ? 'text-amber-400' : 'text-amber-600'
                            }`}
                          />
                          {user.membershipTier || 'Verified Member'}
                        </p>
                      </div>
                    );
                  }

                  if (fieldPrefs.showScripture && fieldPrefs.scriptureText.trim()) {
                    visibleItems.push(
                      <div
                        key="scripture"
                        className={`p-2 rounded-xl border ${
                          cardTheme === 'auspicious'
                            ? 'bg-amber-950/40 border-amber-300/20'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <p
                          className={`text-[10px] font-bold uppercase ${
                            cardTheme === 'auspicious' ? 'text-amber-300/80' : 'text-slate-500'
                          }`}
                        >
                          Favorite Scripture
                        </p>
                        <p
                          className={`font-semibold truncate flex items-center gap-1 ${
                            cardTheme === 'auspicious' ? 'text-amber-200' : 'text-amber-800'
                          }`}
                        >
                          <BookOpen
                            className={`w-3 h-3 shrink-0 ${
                              cardTheme === 'auspicious' ? 'text-amber-300' : 'text-amber-600'
                            }`}
                          />
                          {fieldPrefs.scriptureText}
                        </p>
                      </div>
                    );
                  }

                  if (fieldPrefs.showOccupation && fieldPrefs.occupationText.trim()) {
                    visibleItems.push(
                      <div
                        key="occupation"
                        className={`p-2 rounded-xl border ${
                          cardTheme === 'auspicious'
                            ? 'bg-amber-950/40 border-amber-300/20'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <p
                          className={`text-[10px] font-bold uppercase ${
                            cardTheme === 'auspicious' ? 'text-amber-300/80' : 'text-slate-500'
                          }`}
                        >
                          Profession / Vocation
                        </p>
                        <p
                          className={`font-semibold truncate flex items-center gap-1 ${
                            cardTheme === 'auspicious' ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          <Briefcase
                            className={`w-3 h-3 shrink-0 ${
                              cardTheme === 'auspicious' ? 'text-amber-300' : 'text-amber-600'
                            }`}
                          />
                          {fieldPrefs.occupationText}
                        </p>
                      </div>
                    );
                  }

                  if (fieldPrefs.showNativePlace && fieldPrefs.nativePlaceText.trim()) {
                    visibleItems.push(
                      <div
                        key="nativePlace"
                        className={`p-2 rounded-xl border ${
                          cardTheme === 'auspicious'
                            ? 'bg-amber-950/40 border-amber-300/20'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <p
                          className={`text-[10px] font-bold uppercase ${
                            cardTheme === 'auspicious' ? 'text-amber-300/80' : 'text-slate-500'
                          }`}
                        >
                          Native Place (Mool)
                        </p>
                        <p
                          className={`font-semibold truncate flex items-center gap-1 ${
                            cardTheme === 'auspicious' ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          <Compass
                            className={`w-3 h-3 shrink-0 ${
                              cardTheme === 'auspicious' ? 'text-amber-300' : 'text-amber-600'
                            }`}
                          />
                          {fieldPrefs.nativePlaceText}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div
                      className={`grid grid-cols-2 gap-2 text-xs pt-1 border-t ${
                        cardTheme === 'auspicious' ? 'border-amber-300/20' : 'border-slate-200'
                      }`}
                    >
                      {visibleItems.length > 0 ? (
                        visibleItems
                      ) : (
                        <div
                          className={`col-span-2 p-2.5 rounded-xl border text-center text-xs italic ${
                            cardTheme === 'auspicious'
                              ? 'bg-amber-950/30 border-amber-300/20 text-amber-200/80'
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          All non-sensitive attributes hidden. Use "Edit" toggle above to customize.
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Micro Footer Notice */}
                <div
                  className={`text-[10px] flex items-center justify-between pt-1 ${
                    cardTheme === 'auspicious' ? 'text-amber-200/90' : 'text-slate-500'
                  }`}
                >
                  <span>Authentic Sangh Profile</span>
                  <span>Flip card for QR Verification</span>
                </div>
              </div>
            ) : (
              /* CARD QR BACK VIEW */
              <div className="flex flex-col items-center text-center space-y-3 relative z-10 py-1">
                <div
                  className={`p-3 bg-white rounded-2xl shadow-xl border-4 flex items-center justify-center ${
                    cardTheme === 'auspicious' ? 'border-amber-300' : 'border-slate-300'
                  }`}
                >
                  <QRCodeSVG
                    value={qrString}
                    size={160}
                    bgColor="#FFFFFF"
                    fgColor={cardTheme === 'auspicious' ? '#78350F' : '#0F172A'}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div>
                  <p
                    className={`text-xs font-mono font-bold tracking-wider ${
                      cardTheme === 'auspicious' ? 'text-amber-200' : 'text-slate-800'
                    }`}
                  >
                    {memberCode}
                  </p>
                  <p
                    className={`text-[11px] font-medium mt-0.5 ${
                      cardTheme === 'auspicious' ? 'text-white' : 'text-slate-600'
                    }`}
                  >
                    Scan with any QR scanner or camera to verify authenticity
                  </p>
                </div>

                {/* Privacy Scope Notice on QR Back */}
                <div
                  id="card-qr-privacy-scope-indicator"
                  className={`w-full p-2 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                    privacyStatus === 'private'
                      ? cardTheme === 'auspicious'
                        ? 'bg-rose-950/50 border-rose-400/40 text-rose-100'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                      : cardTheme === 'auspicious'
                        ? 'bg-emerald-950/40 border-emerald-400/40 text-emerald-100'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0 text-left">
                    {privacyStatus === 'private' ? (
                      <Lock className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    )}
                    <span className="truncate text-[11px] font-bold">
                      {privacyStatus === 'private'
                        ? 'Private: Visible to Connected Family Members Only'
                        : 'Public: Visible across the Jain Connect Community'}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                      privacyStatus === 'private'
                        ? 'bg-rose-500/30 text-rose-200 border border-rose-400/40'
                        : 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                    }`}
                  >
                    {privacyStatus === 'private' ? 'Family Only' : 'Public'}
                  </span>
                </div>

                {/* Custom Non-Sensitive Identity Highlights on QR Verification Back */}
                {((fieldPrefs.showMotto && fieldPrefs.mottoText.trim()) ||
                  (fieldPrefs.showScripture && fieldPrefs.scriptureText.trim())) && (
                  <div
                    className={`w-full p-2 rounded-xl border text-xs flex flex-col items-center gap-1 ${
                      cardTheme === 'auspicious'
                        ? 'bg-amber-950/40 border-amber-300/30 text-amber-100'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    {fieldPrefs.showMotto && fieldPrefs.mottoText.trim() && (
                      <p className="italic font-serif flex items-center gap-1 text-[11px] truncate max-w-full">
                        <Quote className="w-3 h-3 text-amber-400 shrink-0 rotate-180" />
                        <span className="truncate">“{fieldPrefs.mottoText}”</span>
                      </p>
                    )}
                    {fieldPrefs.showScripture && fieldPrefs.scriptureText.trim() && (
                      <p className="flex items-center gap-1 text-[10px] font-medium opacity-90 truncate max-w-full">
                        <BookOpen className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>Scripture: {fieldPrefs.scriptureText}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Verified Sangh Badges on QR View */}
                {activeBadges.length > 0 && (
                  <div
                    className={`w-full p-2 rounded-xl border text-center ${
                      cardTheme === 'auspicious'
                        ? 'bg-amber-950/60 border-amber-300/40 text-amber-200'
                        : 'bg-amber-50/80 border-slate-300 text-slate-800'
                    }`}
                  >
                    <p
                      className={`text-[10px] font-black uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5 ${
                        cardTheme === 'auspicious' ? 'text-amber-300' : 'text-amber-900'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Encrypted Sangh Badges on Record
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      {activeBadges.map((badgeName) => {
                        const cfg = getBadgeVisualConfig(badgeName);
                        const IconC = cfg.icon;
                        const isNewlyEarned =
                          newlyEarnedBadges.includes(badgeName) || celebratedBadge === badgeName;

                        return (
                          <span
                            key={badgeName}
                            className={`relative overflow-hidden inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold border transition-all ${
                              cardTheme === 'auspicious'
                                ? 'bg-black/40 border-amber-400/50 text-amber-200'
                                : 'bg-white border-amber-300 text-slate-900 shadow-xs'
                            } ${
                              isNewlyEarned
                                ? 'animate-badge-entrance gold-badge-border-glow ring-2 ring-amber-400'
                                : ''
                            }`}
                          >
                            {isNewlyEarned && <span className="gold-shimmer-sheen" />}
                            <IconC className="w-3 h-3 text-amber-500 relative z-10" />
                            <span className="relative z-10">{badgeName}</span>
                            {isNewlyEarned ? (
                              <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-star-sparkle relative z-10" />
                            ) : (
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 relative z-10" />
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div
                  className={`w-full pt-2 border-t flex items-center justify-around text-[10px] font-semibold ${
                    cardTheme === 'auspicious'
                      ? 'border-amber-300/30 text-amber-200'
                      : 'border-slate-200 text-slate-500'
                  }`}
                >
                  <span>🔒 Secure Sangh Encryption</span>
                  <span>✅ Instant Event Verification</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions & Sharing Toolbar */}
          <div className="space-y-3 print:hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {/* Connect with Profile Owner Action Button */}
              <button
                id="member-digital-id-connect-btn"
                type="button"
                onClick={handleOpenConnect}
                className={`col-span-2 sm:col-span-1 px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95 border ${
                  isOwnProfile
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    : connectionStatus === 'accepted'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                    : connectionStatus === 'pending'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                    : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-emerald-400 dark:border-emerald-500 shadow-md shadow-emerald-600/20'
                }`}
                title={
                  isOwnProfile
                    ? 'You are the profile owner of this digital ID'
                    : connectionStatus === 'accepted'
                    ? `You and ${user.fullName} are connected`
                    : connectionStatus === 'pending'
                    ? 'Connection request pending acceptance'
                    : `Send a networking connection request to ${user.fullName}`
                }
              >
                {isOwnProfile ? (
                  <>
                    <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Profile Owner</span>
                  </>
                ) : connectionStatus === 'accepted' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Connected</span>
                  </>
                ) : connectionStatus === 'pending' ? (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Request Pending</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </>
                )}
              </button>

              <button
                id="download-id-image-btn"
                onClick={handleDownloadImage}
                disabled={isDownloadingImage}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-95 border border-amber-300 dark:border-amber-400"
                title="Save your digital ID card locally as high-resolution PNG image"
              >
                {isDownloadingImage ? (
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-slate-950" />
                ) : (
                  <ImageIcon className="w-3.5 h-3.5 text-slate-950" />
                )}
                <span>{isDownloadingImage ? 'Saving...' : 'Download ID as Image'}</span>
              </button>

              <button
                id="download-id-pdf-btn"
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-extrabold hover:from-amber-700 hover:to-amber-800 text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-95 border border-amber-500/40"
                title="Download formatted ID card PDF"
              >
                {isDownloadingPdf ? (
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-amber-200" />
                )}
                <span>{isDownloadingPdf ? 'Creating...' : 'Download PDF'}</span>
              </button>

              <button
                onClick={handleCopyMemberId}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-600" />}
                <span>{copiedId ? 'ID Copied' : 'Copy ID'}</span>
              </button>

              <button
                onClick={handleCopyPayload}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-amber-600" />}
                <span>{copiedPayload ? 'Data Copied' : 'Copy QR'}</span>
              </button>

              <button
                onClick={handlePrintCard}
                className="col-span-2 sm:col-span-1 px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Print Pass</span>
              </button>
            </div>

            {/* Simulated QR Check-in Tester for Event Organizers */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Event Organizer QR Verification</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Test authenticating this digital card at sangh gates</p>
                </div>
              </div>

              <button
                onClick={handleSimulateScan}
                disabled={isSimulatingScan}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-xs ${
                  scanVerified
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                    : 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800'
                }`}
              >
                {isSimulatingScan ? (
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
                ) : scanVerified ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>
                  {isSimulatingScan ? 'Scanning...' : scanVerified ? 'Card Authenticated' : 'Simulate Check-in'}
                </span>
              </button>
            </div>

            {/* Scan Authentication Details Breakdown */}
            {scanVerified && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-left space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Sangh Gate Verification Successful
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                    Authentic Pass
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold px-2 py-1 rounded-lg bg-emerald-100/60 dark:bg-emerald-900/40">
                  <span className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-200">
                    {privacyStatus === 'private' ? (
                      <Lock className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    )}
                    Access Scope:
                  </span>
                  <span
                    className={`font-black uppercase text-[10px] px-2 py-0.5 rounded-md ${
                      privacyStatus === 'private'
                        ? 'bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200'
                        : 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                    }`}
                  >
                    {privacyStatus === 'private' ? 'Private • Connected Family Only' : 'Public ID'}
                  </span>
                </div>

                <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/60">
                  <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-1.5 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-500" />
                    Authenticated Member Badges & Accreditations:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeBadges.map((b) => {
                      const cfg = getBadgeVisualConfig(b);
                      const IconComp = cfg.icon;
                      return (
                        <span
                          key={b}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/80 text-emerald-950 dark:text-emerald-100 text-[11px] font-bold border border-emerald-300 dark:border-emerald-700"
                        >
                          <IconComp className="w-3 h-3 text-amber-500" />
                          <span>{b}</span>
                          <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Selected Badge Honor Inspector Modal */}
        {selectedBadgeDetail && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-3xl w-full max-w-md p-6 shadow-2xl relative space-y-4 animate-scale-up">
              <button
                onClick={() => setSelectedBadgeDetail(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-md">
                  <Award className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-black font-serif text-slate-900 dark:text-white">
                      {selectedBadgeDetail.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                    {selectedBadgeDetail.tagline} • {selectedBadgeDetail.category}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                <div>
                  <p className="font-bold text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Significance
                  </p>
                  <p className="mt-0.5 leading-relaxed">{selectedBadgeDetail.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Qualification & Verification Standard
                  </p>
                  <p className="mt-0.5 leading-relaxed font-mono text-[11px] text-amber-800 dark:text-amber-300">
                    {selectedBadgeDetail.criteria}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active Credential on {user.fullName}&apos;s Digital ID
                </span>
                <span className="text-[10px] uppercase">Verified Sangh Record</span>
              </div>

              <button
                onClick={() => setSelectedBadgeDetail(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Close Badge Details
              </button>
            </div>
          </div>
        )}

        {/* Sangh Badge System Directory / Guide Modal */}
        {showBadgeSystemInfo && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowBadgeSystemInfo(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-serif text-slate-900 dark:text-white">
                    Sangh Member Badge System
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Official recognitions displayed on Jain Connect Global Digital ID cards
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {Object.entries(BADGE_SYSTEM_REGISTRY).map(([badgeName, item]) => {
                  const IconComp = item.icon;
                  const isEarned = activeBadges.includes(badgeName);
                  return (
                    <div
                      key={badgeName}
                      className={`p-3 rounded-2xl border transition-all ${
                        isEarned
                          ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-90'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-xl ${isEarned ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">
                              {badgeName}
                            </h4>
                            <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                              {item.tagline}
                            </span>
                          </div>
                        </div>

                        {isEarned ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black border border-emerald-300 dark:border-emerald-800 shrink-0">
                            Earned ✓
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold shrink-0">
                            Eligible
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[10px]">
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Category: </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{item.category}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setShowBadgeSystemInfo(false);
                            handleSimulateNewBadge(badgeName);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                            isEarned
                              ? 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950 shadow-xs'
                          }`}
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{isEarned ? 'Replay Shimmer 🌟' : 'Simulate Unlock ✨'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-300 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 flex items-center justify-between">
                <div>
                  <p className="font-bold">Want to update or add your Sangh Badges?</p>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300">
                    Update your profile or contact the Sangh Samiti administrators.
                  </p>
                </div>
                <button
                  onClick={() => setShowBadgeSystemInfo(false)}
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs shrink-0 cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs print:hidden">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Jain Connect Global • Sangh ID Engine
          </span>
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Connection Request Composer Dialog */}
        {isConnectModalOpen && user && (
          <div
            id="member-digital-id-connect-modal"
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
            onClick={() => setIsConnectModalOpen(false)}
          >
            <div
              className="bg-white dark:bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4 text-slate-800 dark:text-slate-100 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                      Send Connection Request
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Connect with profile owner <strong className="text-emerald-600 dark:text-emerald-400">{user.fullName}</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Owner & Authenticated Sender Preview Strip */}
              <div className="p-3 bg-gradient-to-r from-emerald-50/70 to-teal-50/40 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={user.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-400/60 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{user.fullName}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user.role || 'Member'} • {user.city || 'India'}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 block font-mono">
                    ID: {memberCode}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-md bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-extrabold uppercase">
                    Profile Owner
                  </span>
                </div>
              </div>

              {/* Sender Info */}
              {currentUser && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-400 shrink-0">From:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 truncate">{currentUser.fullName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({currentUser.city || 'Sangh Member'})</span>
                </div>
              )}

              {/* Note Category Pills */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Connection Purpose / Topic</span>
                  <span className="text-[10px] text-slate-400 font-normal">Select a preset greeting</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CONNECT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setConnectCategory(cat.label);
                        setConnectNote(`Jai Jinendra ${user.fullName}! ${cat.text}`);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        connectCategory === cat.label
                          ? 'bg-emerald-600 text-white shadow-xs font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Note Input */}
              <div className="space-y-1.5">
                <label htmlFor="connect-request-note-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Personal Greeting / Introduction</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {connectNote.length}/300
                  </span>
                </label>
                <textarea
                  id="connect-request-note-input"
                  value={connectNote}
                  onChange={(e) => setConnectNote(e.target.value)}
                  rows={3}
                  maxLength={300}
                  placeholder={`Jai Jinendra ${user.fullName}! Write a polite greeting or family introduction...`}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                />
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Info className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>This sends an instant connection request alert with your profile to {user.fullName}.</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-send-connect-request-btn"
                  type="button"
                  onClick={handleSendConnectionRequest}
                  disabled={isSendingRequest}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-95"
                >
                  {isSendingRequest ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Connection Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
