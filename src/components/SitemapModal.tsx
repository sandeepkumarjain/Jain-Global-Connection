import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { TabOption } from '../types';
import {
  Search,
  X,
  Map,
  Heart,
  Building2,
  Landmark,
  Users,
  Droplet,
  Calendar,
  Clock,
  Music,
  Radio,
  Bell,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  FileText,
  Lock,
  Phone,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Compass,
  MessageSquare,
  BookOpen,
  QrCode,
  Layers,
  Flame,
  Globe,
  Sun,
  Moon,
  ChevronRight,
  Filter,
  BellRing
} from 'lucide-react';

export type SitemapCategory =
  | 'All'
  | 'Directories'
  | 'Spiritual'
  | 'Community'
  | 'Tools'
  | 'Governance';

export interface SitemapSectionItem {
  id: string;
  title: string;
  hindiTitle: string;
  description: string;
  category: 'Directories' | 'Spiritual' | 'Community' | 'Tools' | 'Governance';
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badge?: string;
  badgeColor?: string;
  targetTab?: TabOption;
  customAction?: () => void;
  keywords: string[];
  subFeatures: string[];
  requiresAuth?: boolean;
}

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPolicy?: (type: 'terms' | 'privacy') => void;
}

export const SitemapModal: React.FC<SitemapModalProps> = ({
  isOpen,
  onClose,
  onOpenPolicy
}) => {
  const {
    setActiveTab,
    openRegistrationModal,
    setIsDigitalIdModalOpen,
    setIsBhajanModalOpen,
    setIsAISearchOpen,
    setIsDashboardCustomizerOpen,
    setIsCentralNotifOpen,
    openDailyTithiAlert,
    openPrayerRemindersSettings,
    setIsAuthModalOpen,
    toggleNavkarAudio,
    isPlayingNavkar,
    currentUser,
    isMatrimonialOnlyUser,
    isBusinessOnlyUser,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SitemapCategory>('All');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when modal opens & register keyboard shortcuts
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery('');
      setSelectedCategory('All');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Define full comprehensive list of accessible sections
  const allSections: SitemapSectionItem[] = useMemo(() => {
    return [
      // DIRECTORIES
      {
        id: 'matrimonial-dir',
        title: 'Jain Matrimonial Directory',
        hindiTitle: 'जैन विवाह संबंध निर्देशिका',
        description:
          'Verified Jain marriage biodatas, horoscope matching, sect filters (Digambar, Shwetambar, Sthanakvasi, Terapanthi), education, gotra, and express interest.',
        category: 'Directories',
        icon: Heart,
        iconBg: 'bg-rose-500/15 dark:bg-rose-500/20',
        iconColor: 'text-rose-600 dark:text-rose-400',
        badge: 'Verified Biodatas',
        badgeColor: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
        targetTab: 'matrimonial',
        keywords: [
          'marriage', 'biodata', 'matrimony', 'rishtey', 'shaadi', 'kundali',
          'horoscope', 'gotra', 'shwetambar', 'digambar', 'terapanthi', 'sthanakvasi'
        ],
        subFeatures: ['Bio-Data Profiles', 'Kundali Matching', 'Sect & Gotra Filter', 'Express Interest', 'Register Biodata']
      },
      {
        id: 'business-dir',
        title: 'Jain Business Directory',
        hindiTitle: 'जैन व्यापार एवं उद्योग निर्देशिका',
        description:
          'Verified global Jain entrepreneurs, MSMEs, startups, digital visiting cards, B2B trade networking, and peer business endorsements.',
        category: 'Directories',
        icon: Building2,
        iconBg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        badge: 'B2B Network',
        badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        targetTab: 'business',
        keywords: [
          'business', 'trade', 'visiting card', 'b2b', 'entrepreneur', 'industry',
          'company', 'jobs', 'vendor', 'products', 'services', 'endorsements'
        ],
        subFeatures: ['Verified Entrepreneurs', 'Digital Visiting Cards', 'Industry Categories', 'Trust Endorsements', 'Add Business']
      },
      {
        id: 'temple-dir',
        title: 'Jain Temples & Tirth Darshan',
        hindiTitle: 'तीर्थ एवं मंदिर दर्शन निर्देशिका',
        description:
          'Comprehensive global directory of sacred Jain Derasars, Tirthankara shrines, GPS navigation, Dharamshala booking & Bhojanshala facilities, plus Live Darshan streams.',
        category: 'Directories',
        icon: Landmark,
        iconBg: 'bg-amber-500/15 dark:bg-amber-500/20',
        iconColor: 'text-amber-600 dark:text-amber-400',
        badge: 'GPS & Dharamshala',
        badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        targetTab: 'temple',
        keywords: [
          'temple', 'tirth', 'derasar', 'mandir', 'dharamshala', 'bhojanshala',
          'live darshan', 'gps', 'route', 'shrine', 'jinalaya', 'tirthankar', 'leaflet', 'map', 'nearby'
        ],
        subFeatures: ['Interactive Leaflet Map', 'Tirthankara Shrines', 'Live Darshan Streams', 'Dharamshala Finder', 'Turn-by-Turn GPS']
      },
      {
        id: 'member-dir',
        title: 'Global Sangh Member & Family Directory',
        hindiTitle: 'अखिल भारतीय संघ सदस्य निर्देशिका',
        description:
          'Connect with verified Jain families worldwide, search by native place, city, or sangh unit, and view verified digital member cards.',
        category: 'Directories',
        icon: Users,
        iconBg: 'bg-blue-500/15 dark:bg-blue-500/20',
        iconColor: 'text-blue-600 dark:text-blue-400',
        badge: 'Family Roster',
        badgeColor: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800',
        targetTab: 'directory',
        keywords: [
          'member', 'family', 'directory', 'sangh', 'city', 'native place',
          'community', 'roster', 'phone directory', 'pariwar'
        ],
        subFeatures: ['Verified Members', 'City / State Filters', 'Native Place Index', 'Digital Sangh ID', 'Direct Contact']
      },
      {
        id: 'emergency-donors',
        title: '24/7 Jain Emergency Blood Donor Lifeline',
        hindiTitle: '24/7 आपातकालीन रक्तदाता सेवा',
        description:
          'Instant emergency lifeline with verified voluntary Jain blood donors filtered by blood group and city, with 1-click verified calling and SOS dispatch.',
        category: 'Directories',
        icon: Droplet,
        iconBg: 'bg-red-500/15 dark:bg-red-500/20',
        iconColor: 'text-red-600 dark:text-red-400',
        badge: '24/7 Lifeline',
        badgeColor: 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800',
        targetTab: 'emergency',
        keywords: [
          'blood', 'donor', 'emergency', 'sos', 'hospital', 'blood group',
          'plasma', 'urgent', 'lifeline', 'raktdaan', 'seva'
        ],
        subFeatures: ['Blood Group Filters', 'City-wise Search', 'Direct Phone Dial', 'Register as Donor', 'SOS Dispatch']
      },
      {
        id: 'registration-portal',
        title: 'Sangh Listing Registration Portal',
        hindiTitle: 'नवीन प्रविष्टि एवं पंजीयन पोर्टल',
        description:
          'Submit a new verified listing for Jain Matrimonial biodata, Business directory, Temple/Derasar entry, or Sangh Family membership.',
        category: 'Directories',
        icon: Compass,
        iconBg: 'bg-purple-500/15 dark:bg-purple-500/20',
        iconColor: 'text-purple-600 dark:text-purple-400',
        badge: 'Multi-Portal',
        badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800',
        customAction: () => openRegistrationModal(),
        keywords: ['register', 'add listing', 'submit', 'join', 'form', 'apply', 'enrollment'],
        subFeatures: ['Matrimonial Form', 'Business Registration', 'Temple Submission', 'Family Membership']
      },

      // SPIRITUAL & PANCHANG
      {
        id: 'panchang-full',
        title: 'Daily Jain Panchang & Tithi Portal',
        hindiTitle: 'दैनिक जैन पंचांग एवं तिथि दर्पण',
        description:
          'Traditional Jain lunar calendar tracking Vikram Samvat 2082, Paksha, Tithi, Nakshatra, Yoga, Daily Agam Sutra, and sacred vows.',
        category: 'Spiritual',
        icon: Calendar,
        iconBg: 'bg-orange-500/15 dark:bg-orange-500/20',
        iconColor: 'text-orange-600 dark:text-orange-400',
        badge: 'Vikram Samvat 2082',
        badgeColor: 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-800',
        targetTab: 'panchang',
        keywords: [
          'panchang', 'tithi', 'calendar', 'vikram samvat', 'paksha', 'nakshatra',
          'yoga', 'parva', 'paryushan', 'mahavir jayanti', 'agam', 'quote'
        ],
        subFeatures: ['Daily Jain Tithi', 'Nakshatra & Yoga', 'Daily Agam Quotes', 'Upcoming Festivals', 'Location Sync']
      },
      {
        id: 'choghadiya-muhurat',
        title: 'Auspicious Choghadiya Muhurat Calculator',
        hindiTitle: 'शुभ-अमृत-लाभ चौघड़िया मुहूर्त',
        description:
          'Real-time Shubh, Labh, Amrit, Char, Kaal, Rog, and Udveg daytime and nighttime Choghadiya intervals computed for your exact geographic coordinates.',
        category: 'Spiritual',
        icon: Clock,
        iconBg: 'bg-amber-500/15 dark:bg-amber-500/20',
        iconColor: 'text-amber-600 dark:text-amber-400',
        badge: 'Real-Time',
        badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        targetTab: 'panchang',
        keywords: [
          'choghadiya', 'muhurat', 'shubh', 'labh', 'amrit', 'char', 'kaal',
          'rog', 'udveg', 'auspicious time', 'day night choghadiya'
        ],
        subFeatures: ['Day Choghadiya', 'Ratri Choghadiya', 'Live Current Slot', 'City Coordinates']
      },
      {
        id: 'pachkan-alerts',
        title: 'Pachkan Vows & Tithi Reminders',
        hindiTitle: 'पचक्खाण समय एवं तिथि स्मरण पत्र',
        description:
          'Instant popup view of daily fasting vows: Chauvihar, Navkarsi, Porsi, Sadh-Porsi, Purimaddh, Ayambil, and upcoming festival fasts.',
        category: 'Spiritual',
        icon: Bell,
        iconBg: 'bg-yellow-500/15 dark:bg-yellow-500/20',
        iconColor: 'text-yellow-600 dark:text-yellow-500',
        badge: 'Daily Alert',
        badgeColor: 'bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800',
        customAction: () => openDailyTithiAlert(),
        keywords: [
          'pachkan', 'chauvihar', 'navkarsi', 'porsi', 'ayambil', 'ekasana',
          'biyansana', 'upvas', 'fasting', 'vow', 'tithi alert'
        ],
        subFeatures: ['Daily Vow Timings', 'Sunrise Calculations', 'Festival Alert', 'Audio Reminder']
      },
      {
        id: 'daily-prayer-reminders',
        title: 'Daily Prayer Reminders (Samayik & Aarti)',
        hindiTitle: 'दैनिक सामायिक व आरती स्मरण प्रणाली',
        description:
          'Opt-in to subtle, time-based browser notifications and authentic brass temple bell chimes for daily morning Samayik, Mangal Aarti, Chauvihar, and Sandhya Aarti.',
        category: 'Spiritual',
        icon: BellRing,
        iconBg: 'bg-amber-500/15 dark:bg-amber-500/20',
        iconColor: 'text-amber-600 dark:text-amber-400',
        badge: 'Browser Notifications',
        badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        customAction: () => {
          onClose();
          openPrayerRemindersSettings();
        },
        keywords: [
          'prayer reminder', 'samayik', 'aarti', 'chauvihar', 'browser notification',
          'temple chime', 'sound', 'timings', 'sandhya aarti', 'mangal aarti', 'pratikraman', 'alert', 'notification'
        ],
        subFeatures: ['Opt-in Browser Notifications', 'Subtle Brass Bell Chime', 'Customizable Daily Timings', 'Samayik & Aarti Presets']
      },
      {
        id: 'navkar-mantra-audio',
        title: 'Navkar Mahamantra Chanting Player',
        hindiTitle: 'णमोकार महामंत्र जप एवं ऑडियो',
        description:
          'Peaceful meditative audio loop of the supreme Navkar Mantra (Namo Arihantanam...), ideal for morning meditation, office peace, and evening pratikraman.',
        category: 'Spiritual',
        icon: Music,
        iconBg: 'bg-indigo-500/15 dark:bg-indigo-500/20',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        badge: isPlayingNavkar ? 'Playing Now' : 'Audio Stream',
        badgeColor: isPlayingNavkar
          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
          : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
        customAction: () => {
          toggleNavkarAudio();
          showToast(
            isPlayingNavkar ? 'Navkar Audio Paused' : 'Playing Navkar Mantra',
            'Sacred chanting stream active.',
            'info'
          );
        },
        keywords: [
          'navkar', 'namokar', 'mantra', 'chanting', 'audio', 'sound', 'jaap',
          'arihant', 'siddha', 'spiritual audio', 'meditation'
        ],
        subFeatures: ['Continuous Jaap Loop', 'Peaceful Sitar Harmony', '1-Click Toggle', 'Volume Control']
      },
      {
        id: 'bhajan-library',
        title: 'Jain Bhakti Sangeet & Stotras',
        hindiTitle: 'जैन भक्ति संगीत एवं स्तोत्र वाटिका',
        description:
          'Collection of traditional Jain devotional songs, Stotras (Bhaktamar, Uvasaggaharam), and peaceful instrumental bhajans with in-app audio controls.',
        category: 'Spiritual',
        icon: Radio,
        iconBg: 'bg-pink-500/15 dark:bg-pink-500/20',
        iconColor: 'text-pink-600 dark:text-pink-400',
        badge: 'Devotional Songs',
        badgeColor: 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-800',
        customAction: () => setIsBhajanModalOpen(true),
        keywords: [
          'bhajan', 'bhakti', 'sangeet', 'stotra', 'bhaktamar', 'uvasaggaharam',
          'geet', 'stavans', 'devotional music'
        ],
        subFeatures: ['Curated Playlist', 'Lyrics Support', 'Background Playback', 'Stotras & Chants']
      },

      // COMMUNITY & MEDIA
      {
        id: 'community-feed',
        title: 'Global Sangh Community Feed & News',
        hindiTitle: 'अखिल भारतीय संघ समाचार एवं संवाद',
        description:
          'Stay updated with official announcements, youth accomplishments, tapovan camps, pravachans, social events, and community discussions.',
        category: 'Community',
        icon: MessageSquare,
        iconBg: 'bg-violet-500/15 dark:bg-violet-500/20',
        iconColor: 'text-violet-600 dark:text-violet-400',
        badge: 'Community Wall',
        badgeColor: 'bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-800',
        targetTab: 'feed',
        keywords: [
          'feed', 'news', 'events', 'announcements', 'posts', 'pravachan',
          'tapovan', 'youth', 'sangh sandesh', 'social wall'
        ],
        subFeatures: ['Official Announcements', 'Event Calendars', 'Tapovan Notices', 'Post Feedback & Likes']
      },
      {
        id: 'home-portal',
        title: 'Jain Connect Global Sangh Portal (Home)',
        hindiTitle: 'जैन कनेक्ट ग्लोबल मुख्य संघ द्वार',
        description:
          'Central homepage featuring the live Tithi banner, hero banner carousel, quick directory highlights, featured temples, and personalized widgets.',
        category: 'Community',
        icon: Globe,
        iconBg: 'bg-amber-500/15 dark:bg-amber-500/20',
        iconColor: 'text-amber-600 dark:text-amber-400',
        badge: 'Central Hub',
        badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        targetTab: 'home',
        keywords: ['home', 'portal', 'dashboard', 'highlights', 'overview', 'main'],
        subFeatures: ['Daily Tithi Banner', 'Hero Carousel', 'Featured Temples', 'Quick Access Cards']
      },

      // MEMBER TOOLS & UTILITIES
      {
        id: 'digital-id-card',
        title: 'Member Digital Sangh ID Card',
        hindiTitle: 'डिजिटल जैन संघ पहचान पत्र (QR युक्त)',
        description:
          'Official QR-coded verified Jain community identity card displaying member photograph, Sangh unit, blood group, validity, and printable layout.',
        category: 'Tools',
        icon: QrCode,
        iconBg: 'bg-cyan-500/15 dark:bg-cyan-500/20',
        iconColor: 'text-cyan-600 dark:text-cyan-400',
        badge: 'Official Pass',
        badgeColor: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800',
        customAction: () => {
          if (!currentUser) {
            setIsAuthModalOpen(true);
            showToast('Sign In Required', 'Please log in to view your verified Digital Sangh ID card.', 'info');
          } else {
            setIsDigitalIdModalOpen(true);
          }
        },
        keywords: [
          'digital id', 'id card', 'qr code', 'sangh pass', 'identity',
          'verification', 'card download', 'print id'
        ],
        subFeatures: ['Secure QR Verification', 'Printable & Shareable', 'Blood Group Badge', 'Official Seal']
      },
      {
        id: 'ai-smart-search',
        title: 'Smart AI Search & Sangha Assistant',
        hindiTitle: 'स्मार्ट एआई संघ खोज एवं सहायक',
        description:
          'Natural language intelligent semantic search across all temples, matrimonial biodatas, businesses, member rosters, and panchang queries.',
        category: 'Tools',
        icon: Sparkles,
        iconBg: 'bg-purple-500/15 dark:bg-purple-500/20',
        iconColor: 'text-purple-600 dark:text-purple-400',
        badge: 'AI Powered',
        badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800',
        customAction: () => setIsAISearchOpen(true),
        keywords: [
          'ai search', 'assistant', 'smart search', 'voice search', 'semantic',
          'gemini', 'find anything', 'instant search'
        ],
        subFeatures: ['Cross-Directory Query', 'Natural Language', 'Voice Input Ready', 'Instant Suggestions']
      },
      {
        id: 'dashboard-customizer',
        title: 'Personalized Home Dashboard Customizer',
        hindiTitle: 'होम डैशबोर्ड विजेट कस्टमाइज़र',
        description:
          'Personalize your home screen by reordering, pinning, or hiding widgets (Panchang, News, Quick Directories, Featured Temples) to match your lifestyle.',
        category: 'Tools',
        icon: SlidersHorizontal,
        iconBg: 'bg-teal-500/15 dark:bg-teal-500/20',
        iconColor: 'text-teal-600 dark:text-teal-400',
        badge: 'Drag & Drop',
        badgeColor: 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-800',
        customAction: () => {
          setActiveTab('home');
          setIsDashboardCustomizerOpen(true);
        },
        keywords: [
          'customize', 'reorder', 'widgets', 'pin', 'dashboard', 'layout',
          'personalize', 'home settings'
        ],
        subFeatures: ['Drag & Reorder', 'Pin Favorite Widgets', 'Show / Hide Modules', 'Instant Sync']
      },
      {
        id: 'central-notifications',
        title: 'Central Notification & Alerts Center',
        hindiTitle: 'केंद्रीय सूचना एवं अलर्ट केंद्र',
        description:
          'Real-time centralized hub for profile view alerts, matrimonial connection requests, community announcements, and administrative notices.',
        category: 'Tools',
        icon: Bell,
        iconBg: 'bg-rose-500/15 dark:bg-rose-500/20',
        iconColor: 'text-rose-600 dark:text-rose-400',
        badge: 'Live Alerts',
        badgeColor: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
        customAction: () => setIsCentralNotifOpen(true),
        keywords: ['notifications', 'alerts', 'messages', 'connection requests', 'inbox'],
        subFeatures: ['Connection Requests', 'Profile View Alerts', 'Mark All Read', 'Instant Filter']
      },

      // GOVERNANCE & LEGAL
      {
        id: 'admin-governance',
        title: 'Admin Governance & Approval Portal',
        hindiTitle: 'प्रशासन एवं संघ संचालन नियंत्रण कक्ष',
        description:
          'Authorized management console for reviewing pending directory submissions, verifying user badges, managing roles, and monitoring audit logs.',
        category: 'Governance',
        icon: ShieldCheck,
        iconBg: 'bg-slate-700/15 dark:bg-slate-500/20',
        iconColor: 'text-slate-800 dark:text-slate-200',
        badge: 'Admin Only',
        badgeColor: 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
        targetTab: 'admin',
        requiresAuth: true,
        keywords: [
          'admin', 'control panel', 'approvals', 'users', 'moderation',
          'audit log', 'settings', 'super admin', 'verify'
        ],
        subFeatures: ['Listing Approvals', 'Member Verification', 'Role Assignment', 'System Logs']
      },
      {
        id: 'terms-conditions',
        title: 'Terms of Use & Community Code',
        hindiTitle: 'नियम एवं समुदाय आचार संहिता',
        description:
          'Community guidelines, authenticity verification prerequisites, zero-tolerance fake profile policy, and platform usage regulations.',
        category: 'Governance',
        icon: FileText,
        iconBg: 'bg-amber-500/15 dark:bg-amber-500/20',
        iconColor: 'text-amber-700 dark:text-amber-300',
        badge: 'Legal',
        badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
        customAction: () => onOpenPolicy?.('terms'),
        keywords: ['terms', 'conditions', 'rules', 'code of conduct', 'guidelines', 'usage'],
        subFeatures: ['Authenticity Pledge', 'Account Conduct', 'Safety Rules', 'Copyable Legal Copy']
      },
      {
        id: 'privacy-policy',
        title: 'Privacy Policy & Biodata Protection',
        hindiTitle: 'गोपनीयता नीति एवं डेटा सुरक्षा',
        description:
          'Strict safeguarding of matrimonial bio-datas, contact phone shielding, encrypted credential storage, and non-commercial data commitments.',
        category: 'Governance',
        icon: Lock,
        iconBg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
        iconColor: 'text-emerald-700 dark:text-emerald-300',
        badge: 'Data Shield',
        badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        customAction: () => onOpenPolicy?.('privacy'),
        keywords: ['privacy', 'policy', 'biodata security', 'phone protection', 'gdpr', 'data safety'],
        subFeatures: ['Bio-Data Privacy', 'Phone Number Masking', 'No Data Reselling', 'Secure Architecture']
      },
      {
        id: 'contact-support',
        title: 'Sangha Helpline & Technical Support',
        hindiTitle: 'संघ हेल्पलाइन एवं तकनीकी सहायता',
        description:
          'Reach out to Jain Connect Global administrators, WhatsApp sangha support team, or SKJ Tech World developers for queries and feedback.',
        category: 'Governance',
        icon: Phone,
        iconBg: 'bg-blue-500/15 dark:bg-blue-500/20',
        iconColor: 'text-blue-600 dark:text-blue-400',
        badge: 'Helpdesk',
        badgeColor: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800',
        customAction: () => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          showToast('Support Information', 'Viewing Contact & Support in footer.', 'info');
        },
        keywords: ['contact', 'support', 'helpline', 'phone', 'email', 'skj tech world', 'feedback', 'help'],
        subFeatures: ['Direct Phone Help', 'Official Email', 'Developer Support', 'Feedback Submission']
      }
    ];
  }, [
    currentUser,
    isPlayingNavkar,
    onOpenPolicy,
    openDailyTithiAlert,
    openRegistrationModal,
    setActiveTab,
    setIsAISearchOpen,
    setIsAuthModalOpen,
    setIsBhajanModalOpen,
    setIsCentralNotifOpen,
    setIsDashboardCustomizerOpen,
    setIsDigitalIdModalOpen,
    showToast,
    toggleNavkarAudio
  ]);

  // Categories list with counts
  const categoriesList: { name: SitemapCategory; count: number }[] = useMemo(() => {
    return [
      { name: 'All', count: allSections.length },
      { name: 'Directories', count: allSections.filter((s) => s.category === 'Directories').length },
      { name: 'Spiritual', count: allSections.filter((s) => s.category === 'Spiritual').length },
      { name: 'Community', count: allSections.filter((s) => s.category === 'Community').length },
      { name: 'Tools', count: allSections.filter((s) => s.category === 'Tools').length },
      { name: 'Governance', count: allSections.filter((s) => s.category === 'Governance').length }
    ];
  }, [allSections]);

  // Filtered sections based on category and search query
  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allSections.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (!query) return true;

      const titleMatch = item.title.toLowerCase().includes(query);
      const hindiMatch = item.hindiTitle.toLowerCase().includes(query);
      const descMatch = item.description.toLowerCase().includes(query);
      const categoryMatch = item.category.toLowerCase().includes(query);
      const keywordMatch = item.keywords.some((k) => k.toLowerCase().includes(query));
      const subFeatureMatch = item.subFeatures.some((sf) => sf.toLowerCase().includes(query));

      return titleMatch || hindiMatch || descMatch || categoryMatch || keywordMatch || subFeatureMatch;
    });
  }, [allSections, selectedCategory, searchQuery]);

  // Group filtered sections by category if "All" is active, else flat list
  const groupedSections: Record<string, SitemapSectionItem[]> = useMemo(() => {
    if (selectedCategory !== 'All' || searchQuery.trim()) {
      return { 'Search Results': filteredSections };
    }

    const groups: Record<string, SitemapSectionItem[]> = {
      'Sacred Sangha Directories (सामुदायिक निर्देशिकाएँ)': [],
      'Spiritual & Panchang (आध्यात्मिक व पंचांग)': [],
      'Community News & Media (समाचार व विचार-मंथन)': [],
      'Digital Member Tools (डिजिटल सेवाएँ व टूल्स)': [],
      'Governance, Security & Policies (प्रशासन व नियम)': []
    };

    allSections.forEach((item) => {
      if (item.category === 'Directories') {
        groups['Sacred Sangha Directories (सामुदायिक निर्देशिकाएँ)'].push(item);
      } else if (item.category === 'Spiritual') {
        groups['Spiritual & Panchang (आध्यात्मिक व पंचांग)'].push(item);
      } else if (item.category === 'Community') {
        groups['Community News & Media (समाचार व विचार-मंथन)'].push(item);
      } else if (item.category === 'Tools') {
        groups['Digital Member Tools (डिजिटल सेवाएँ व टूल्स)'].push(item);
      } else if (item.category === 'Governance') {
        groups['Governance, Security & Policies (प्रशासन व नियम)'].push(item);
      }
    });

    return groups;
  }, [allSections, filteredSections, selectedCategory, searchQuery]);

  // Execute navigation
  const handleItemClick = (item: SitemapSectionItem) => {
    // If user has restricted role and tries to navigate outside
    if (isMatrimonialOnlyUser && item.targetTab && item.targetTab !== 'matrimonial') {
      showToast(
        'Matrimonial Profile Restricted',
        'Your profile is currently configured for the Matrimonial portal.',
        'info'
      );
      onClose();
      return;
    }
    if (isBusinessOnlyUser && item.targetTab && item.targetTab !== 'business') {
      showToast(
        'Business Profile Restricted',
        'Your profile is currently configured for the Business portal.',
        'info'
      );
      onClose();
      return;
    }

    // If requires auth and not logged in
    if (item.requiresAuth && !currentUser) {
      onClose();
      setIsAuthModalOpen(true);
      showToast('Authentication Required', 'Please log in to access this portal.', 'info');
      return;
    }

    if (item.customAction) {
      onClose();
      item.customAction();
    } else if (item.targetTab) {
      setActiveTab(item.targetTab);
      onClose();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="sitemap-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden animate-fadeIn"
      onClick={onClose}
    >
      <motion.div
        id="sitemap-modal-container"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border border-amber-300/70 dark:border-amber-800/60 rounded-3xl max-w-5xl w-full h-[90vh] sm:h-[86vh] flex flex-col shadow-2xl overflow-hidden relative text-slate-900 dark:text-slate-100"
      >
        {/* ========================================================================= */}
        {/* HEADER SECTION                                                           */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/40 dark:via-slate-900 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 shrink-0 mt-0.5">
                <Map className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-xl font-serif font-extrabold text-slate-900 dark:text-white tracking-wide">
                    Global Sangha Sitemap & Directory Index
                  </h2>
                  <span className="text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40">
                    सम्पूर्ण पोर्टल सूची
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Searchable, categorized index of all accessible directories, spiritual tools, community services, and member utilities.
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              id="sitemap-close-btn"
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
              title="Close Sitemap (Esc)"
              aria-label="Close sitemap modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar Input */}
          <div className="mt-4 sm:mt-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600 dark:text-amber-400" />
            <input
              id="sitemap-search-input"
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sections, matrimony, businesses, temples, choghadiya, emergency donors, audio... (Type / or click)"
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-750 focus:border-amber-500 dark:focus:border-amber-400 rounded-2xl text-xs sm:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-3 overflow-x-auto no-scrollbar pb-0.5">
            {categoriesList.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  id={`sitemap-cat-${cat.name.toLowerCase()}`}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-xs border border-amber-500'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-slate-750'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BODY: SCROLLABLE CATEGORIZED CARDS                                       */}
        {/* ========================================================================= */}
        <div
          id="sitemap-sections-scroll"
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 custom-scrollbar"
        >
          {filteredSections.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No matching sections found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                We couldn't find any section matching "{searchQuery}". Try searching for terms like "matrimony", "blood", "temple", "panchang", or "visiting cards".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Reset Search & Filters
              </button>
            </div>
          ) : (
            /* Grouped / Filtered Section Results */
            (Object.entries(groupedSections) as [string, SitemapSectionItem[]][]).map(([groupTitle, items]) => {
              if (!items || items.length === 0) return null;

              return (
                <div key={groupTitle} className="space-y-3">
                  {/* Category Header (if categorized view) */}
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>{groupTitle}</span>
                    </h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Grid of Section Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {items.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <div
                          key={item.id}
                          id={`sitemap-item-${item.id}`}
                          onClick={() => handleItemClick(item)}
                          className="group relative flex flex-col justify-between p-4 rounded-2xl bg-slate-50/70 hover:bg-white dark:bg-slate-850/60 dark:hover:bg-slate-800 border border-slate-200/80 hover:border-amber-400 dark:border-slate-800 dark:hover:border-amber-600 transition-all duration-200 hover:shadow-md cursor-pointer text-left"
                        >
                          <div>
                            {/* Card Top Row: Icon, Title, Badge */}
                            <div className="flex items-start justify-between gap-2.5">
                              <div className="flex items-start gap-3">
                                <div
                                  className={`p-2.5 rounded-xl ${item.iconBg} ${item.iconColor} shrink-0 mt-0.5 transition-transform group-hover:scale-105`}
                                >
                                  <IconComponent className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                    {item.title}
                                  </h4>
                                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                                    {item.hindiTitle}
                                  </p>
                                </div>
                              </div>

                              {item.badge && (
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${item.badgeColor}`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>

                            {/* Description */}
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                              {item.description}
                            </p>

                            {/* Key Highlights / Sub-features Pills */}
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {item.subFeatures.map((sub, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-750 font-medium"
                                >
                                  {sub}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Card Footer: Action Trigger */}
                          <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                            <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
                              {item.category}
                            </span>
                            <div className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                              <span>Open Section</span>
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ========================================================================= */}
        {/* FOOTER BAR: QUICK ACTIONS & HELPFUL SHORTCUTS                             */}
        {/* ========================================================================= */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              Tip: Click any section card to navigate instantly or press{' '}
              <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded font-mono border border-slate-300 dark:border-slate-700">
                Esc
              </kbd>{' '}
              to exit.
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                onClose();
                openDailyTithiAlert();
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[11px] font-bold transition cursor-pointer"
            >
              📅 Daily Tithi
            </button>
            <button
              onClick={() => {
                onClose();
                openRegistrationModal();
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[11px] font-bold transition cursor-pointer"
            >
              📝 Register Listing
            </button>
            <button
              onClick={() => {
                onClose();
                setActiveTab('emergency');
              }}
              className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30 text-[11px] font-bold transition cursor-pointer"
            >
              🩸 Blood Donors
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
