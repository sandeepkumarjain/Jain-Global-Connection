import React from 'react';
import { motion } from 'motion/react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BreadcrumbNav } from './components/BreadcrumbNav';
import { Footer } from './components/Footer';
import { HeroBanner } from './components/HeroBanner';
import { PanchangWidget } from './components/PanchangWidget';
import { MatrimonialSection } from './components/MatrimonialSection';
import { BusinessSection } from './components/BusinessSection';
import { DirectorySection } from './components/DirectorySection';
import { TempleSection } from './components/TempleSection';
import { CommunityFeed } from './components/CommunityFeed';
import { EmergencyDirectory } from './components/EmergencyDirectory';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { RegisterModal } from './components/RegisterModal';
import { AISearchModal } from './components/AISearchModal';
import { MembershipModal } from './components/MembershipModal';
import { UserProfileModal } from './components/UserProfileModal';
import { MemberDigitalIdModal } from './components/MemberDigitalIdModal';
import { BhajanLibraryModal } from './components/BhajanLibraryModal';
import { GmailCenterModal } from './components/GmailCenterModal';
import { AudioPlayer } from './components/AudioPlayer';
import { LoginRequiredView } from './components/LoginRequiredView';
import { DailyJainWisdom } from './components/DailyJainWisdom';
import { GlobalSanghHighlights } from './components/GlobalSanghHighlights';
import { JainPrinciplesSection } from './components/JainPrinciplesSection';
import { VivahSuccessStoriesSection } from './components/VivahSuccessStoriesSection';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  Heart,
  Building2,
  MapPin,
  Users,
  ShieldCheck,
  Sparkles,
  LogIn,
  UserPlus,
  Compass,
  Lock,
  Globe,
  Award,
  ArrowUp
} from 'lucide-react';

const getTabMetaData = (tab: string) => {
  switch (tab) {
    case 'matrimonial':
      return {
        title: 'Jain Matrimonial | Jain Connect Global',
        description: 'Find verified Jain matrimonial profiles across Digambar, Shwetambar, Sthanakvasi, and Terapanthi sects.'
      };
    case 'business':
      return {
        title: 'Jain Business Directory | Jain Connect Global',
        description: 'Discover and connect with trusted Jain entrepreneurs, businesses, and digital visiting cards globally.'
      };
    case 'directory':
      return {
        title: 'Global Member Directory | Jain Connect Global',
        description: 'Search verified Jain members, community leaders, and local sanghs worldwide.'
      };
    case 'temple':
      return {
        title: 'Jain Temples & Teerth Directory | Jain Connect Global',
        description: 'Explore holy Jain temples, teerthkshetras, dharmashalas, and trusts with photos and maps.'
      };
    case 'panchang':
      return {
        title: 'Jain Panchang & Daily Tithi | Jain Connect Global',
        description: 'Access live Jain Panchang, Navkarshi, Chouvihar timings, Kalyanaks, and festive dates.'
      };
    case 'feed':
      return {
        title: 'Community Feed & News | Jain Connect Global',
        description: 'Read community posts, announcements, upcoming events, and spiritual articles from the global Jain sangh.'
      };
    case 'emergency':
      return {
        title: 'Emergency Help & Blood Donors | Jain Connect Global',
        description: '24/7 Jain emergency contacts, blood donor network, medical aid, and sangh support.'
      };
    case 'admin':
      return {
        title: 'Admin Control Panel | Jain Connect Global',
        description: 'Manage Jain Connect Global members, business approvals, and platform settings.'
      };
    case 'home':
    default:
      return {
        title: 'Jain Connect Global | Empowering Global Jain Sangh',
        description: 'Connect with the global Jain community, explore Jain Panchang, daily tithi, quotes, and community news.'
      };
  }
};

const MainContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    toast,
    themeMode,
    currentUser,
    isMatrimonialOnlyUser,
    isBusinessOnlyUser,
    setIsAuthModalOpen,
    setIsRegModalOpen,
    isGmailCenterOpen,
    setIsGmailCenterOpen,
    gmailModalData,
    systemSettings
  } = useApp();

  const tabMeta = getTabMetaData(activeTab);

  const [showBackToTop, setShowBackToTop] = React.useState(false);

  // Auto scroll to top when any tab or navigation option is clicked
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Track page scrolling to show/hide "Back to Top" button
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 w-full max-w-full overflow-x-hidden ${
        themeMode === 'dark'
          ? 'dark bg-slate-950 text-slate-100'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      <Helmet>
        <title>{tabMeta.title}</title>
        <meta name="description" content={tabMeta.description} />
      </Helmet>

      {/* Top Header */}
      <Header />

      {/* Dynamic Breadcrumb Navigation */}
      <BreadcrumbNav />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full max-w-full mx-auto px-2.5 sm:px-6 pt-4 sm:pt-6 pb-12 space-y-6 sm:space-y-8 overflow-x-hidden">
        {isMatrimonialOnlyUser ? (
          <MatrimonialSection />
        ) : isBusinessOnlyUser ? (
          <BusinessSection />
        ) : (
          <>
            {/* TAB 1: HOME VIEW */}
        {activeTab === 'home' && (
          <div className="space-y-10">
            {/* Hero Banner Carousel */}
            <HeroBanner />

            {/* Daily Jain Panchang & Tithi Summary with Agam & Promotions */}
            <PanchangWidget />

            {/* Global Sangh Hub & Quick Directory Explorer */}
            <GlobalSanghHighlights />

            {/* Daily Jain Wisdom Scriptures & Quotes Carousel */}
            <DailyJainWisdom />

            {/* GUEST VISITORS HOME VIEW (LOGGED OUT) */}
            {!currentUser ? (
              <div className="space-y-12">
                
                {/* Website Overview Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-100/60 dark:from-slate-900 dark:via-amber-950/40 dark:to-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-200/80 dark:border-amber-800/40 relative overflow-hidden space-y-4"
                >
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-100/80 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-700/60 rounded-full text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-widest shadow-xs">
                    <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Welcome to Jain Connect Global</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white max-w-3xl leading-tight">
                    {systemSettings.aboutTitle || 'Welcome to Jain Connect Global'}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    {systemSettings.aboutDescription || 'Designed by SKJ Tech World, Jain Connect Global connects Swetambar, Digambar, Sthanakvasi, and Terapanthi Jains across 120+ countries.'} To protect family privacy and contact numbers, profile listings are reserved for authenticated members.
                  </p>

                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4 text-amber-200" />
                      <span>Sign In to Your Account</span>
                    </button>

                    <button
                      onClick={() => setIsRegModalOpen(true)}
                      className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 border border-amber-200/80 dark:border-slate-700 text-amber-900 dark:text-amber-300 font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                      <span>Register New Listing</span>
                    </button>
                  </div>
                </motion.div>

                {/* Portal Category Overview Cards (Logged Out) */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="text-center space-y-2 max-w-2xl mx-auto"
                  >
                    <span className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                      Explore Our Directory Portals
                    </span>
                    <h3 className="text-2xl font-extrabold font-serif text-slate-900 dark:text-white">
                      Four Core Pillars of Jain Connect Global
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Sign in or register to unlock direct contact numbers, candidate biodatas, and interactive searches.
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Portal 1: Matrimonial */}
                    <motion.div
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 hover:border-red-500/50 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500 group-hover:scale-110 transition-transform duration-300">
                          <Heart className="w-7 h-7 fill-red-500" />
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Protected Member Portal</span>
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-lg font-bold font-serif text-slate-900 dark:text-white group-hover:text-red-500 transition-colors">
                          {systemSettings.matrimonialHeading || '1. Jain Matrimonial Bureau'}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          Discover over 5,000+ verified Jain Grooms and Brides. Filter profiles by Jain Sect (Swetambar, Digambar, Terapanthi), Gotra, Qualification, Profession, and Strict Jain Diet preference.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="w-full py-2.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-bold text-xs rounded-xl border border-red-200 dark:border-red-900/50 transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In to Search Matrimonial Profiles</span>
                      </button>
                    </motion.div>

                    {/* Portal 2: Business Directory */}
                    <motion.div
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 hover:border-amber-500/50 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500 group-hover:scale-110 transition-transform duration-300">
                          <Building2 className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Protected Member Portal</span>
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-lg font-bold font-serif text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                          {systemSettings.businessHeading || '2. Jain Business & Commercial Directory'}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          Promote and connect with verified Jain-owned businesses worldwide. Featuring Jewellers, CAs, IT firms, Real Estate developers, Manufacturers, and Legal Advisors with GST verification.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="w-full py-2.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-xl border border-amber-200 dark:border-amber-900/50 transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In to Access Business Directory</span>
                      </button>
                    </motion.div>

                    {/* Portal 3: Temple Directory */}
                    <motion.div
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 hover:border-emerald-500/50 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                          <MapPin className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Protected Member Portal</span>
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-lg font-bold font-serif text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                          3. Holy Jain Temple & Tirth Directory
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          Explore sacred Derasars globally with location coordinates, daily Aarti timings, Pakshal details, Dharamshala room availability, Bhojanashala facilities, and Live Darshan video feeds.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="w-full py-2.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-xl border border-emerald-200 dark:border-emerald-900/50 transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In to Browse Holy Temples</span>
                      </button>
                    </motion.div>

                    {/* Portal 4: Jain Directory Census */}
                    <motion.div
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 hover:border-blue-500/50 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                          <Users className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Protected Member Portal</span>
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-lg font-bold font-serif text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                          4. Jain Family & Community Directory
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          Global digital census recording complete Jain family trees, blood group registries for emergency blood donation, QR digital community ID cards, and city-wise Jain mandals.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="w-full py-2.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-300 font-bold text-xs rounded-xl border border-blue-200 dark:border-blue-900/50 transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In to Access Jain Directory</span>
                      </button>
                    </motion.div>
                  </div>
                </div>

                {/* Vivah Success Stories & Marriage Feedback Section for Guest Visitors */}
                <VivahSuccessStoriesSection />

                {/* Core Jain Principles & Platform Security */}
                <JainPrinciplesSection />

                {/* Bottom Call to Action - Modern Gold Gradient Canvas */}
                <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-amber-950 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-5 border border-amber-300/40">
                  {/* Subtle Background Pattern Accent */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-300/20 via-transparent to-transparent pointer-events-none" />

                  <div className="relative z-10 max-w-2xl mx-auto space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/15 border border-amber-950/20 rounded-full text-[11px] font-extrabold uppercase tracking-widest text-amber-950">
                      <Sparkles className="w-3.5 h-3.5 text-amber-950" />
                      <span>Empowering Global Jain Unity</span>
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-black font-serif tracking-tight text-amber-950">
                      Join Over 10,000,000+ Jains Worldwide Today
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-amber-950/85 leading-relaxed">
                      Register your family details, matrimonial candidate profile, business listing, or temple trust for instant verification and global digital connectivity.
                    </p>
                  </div>

                  <div className="relative z-10 flex flex-wrap items-center justify-center gap-3.5 pt-2">
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-6 py-3.5 bg-amber-950 hover:bg-black text-amber-100 font-extrabold text-xs rounded-2xl shadow-2xl hover:shadow-black/30 transition-all duration-300 flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <LogIn className="w-4 h-4 text-amber-400" />
                      <span>Existing Member Sign In</span>
                    </button>
                    <button
                      onClick={() => setIsRegModalOpen(true)}
                      className="px-6 py-3.5 bg-white hover:bg-amber-50 text-amber-950 font-extrabold text-xs rounded-2xl shadow-2xl transition-all duration-300 flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <UserPlus className="w-4 h-4 text-amber-600" />
                      <span>Free Family Profile Registration</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* AUTHENTICATED LOGGED-IN HOME VIEW */
              <div className="space-y-10">
                {/* Matrimonial Preview Section */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                      <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                        Featured Jain Matrimonial Matches
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('matrimonial')}
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      View All Profiles →
                    </button>
                  </div>
                  <MatrimonialSection />
                </section>

                {/* Vivah Success Stories & Marriage Feedback Section */}
                <VivahSuccessStoriesSection />

                {/* Business Directory Section */}
                <section className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-amber-500" />
                      <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                        Verified Jain Businesses & Trade Directory
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('business')}
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      Explore Directory →
                    </button>
                  </div>
                  <BusinessSection />
                </section>

                {/* Temple Directory Section */}
                <section className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-emerald-500" />
                      <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                        Holy Jain Temples, Tirths & Live Darshan
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('temple')}
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      Browse All Temples →
                    </button>
                  </div>
                  <TempleSection />
                </section>
              </div>
            )}
          </div>
        )}

        {/* PROTECTED TABS: REQUIRE LOGIN WHEN UNAUTHENTICATED */}

        {/* Tab 2: Matrimonial (Restricted to logged-in users) */}
        {activeTab === 'matrimonial' && (
          currentUser ? (
            <MatrimonialSection />
          ) : (
            <LoginRequiredView
              title="Jain Matrimonial Bureau Access Restricted"
              description="Candidate biodatas, family backgrounds, and contact details are strictly restricted to verified members."
              sectionIcon="matrimonial"
            />
          )
        )}

        {/* Tab 3: Business Directory (Public Access) */}
        {activeTab === 'business' && <BusinessSection />}

        {/* Tab 4: Jain Directory (Public Access) */}
        {activeTab === 'directory' && <DirectorySection />}

        {/* Tab 5: Temple Directory (Public Access) */}
        {activeTab === 'temple' && <TempleSection />}

        {/* Tab 6: Panchang & Quotes (Public Access) */}
        {activeTab === 'panchang' && <PanchangWidget />}

        {/* Tab 7: Community Feed (Public Access) */}
        {activeTab === 'feed' && <CommunityFeed />}

        {/* Tab 8: Emergency Services (Public Access) */}
        {activeTab === 'emergency' && <EmergencyDirectory />}

        {/* Tab 9: Admin Control Panel */}
        {activeTab === 'admin' && (
          currentUser ? (
            <AdminPanel />
          ) : (
            <LoginRequiredView
              title="Super Admin Control Panel Restricted"
              description="Sign in with Super Admin clearance to access approval management."
              sectionIcon="admin"
            />
          )
        )}
          </>
        )}
      </main>

      {/* Global Modals */}
      <AuthModal />
      <RegisterModal />
      <AISearchModal />
      <MembershipModal />
      <UserProfileModal />
      <MemberDigitalIdModal />
      <BhajanLibraryModal />
      <GmailCenterModal
        isOpen={isGmailCenterOpen}
        onClose={() => setIsGmailCenterOpen(false)}
        defaultRecipient={gmailModalData.recipient}
        defaultSubject={gmailModalData.subject}
        defaultBody={gmailModalData.body}
      />
      <AudioPlayer />

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div
            className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl border text-xs font-medium max-w-sm ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border-emerald-500'
                : toast.type === 'error'
                ? 'bg-slate-900 text-white border-red-500'
                : 'bg-slate-900 text-white border-amber-500'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <div>
              <p className="font-bold text-sm text-white">{toast.title}</p>
              <p className="text-slate-300 text-[11px] mt-0.5">{toast.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* Unique Compact Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-950/85 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/50 hover:border-amber-300 shadow-xl shadow-amber-950/50 backdrop-blur-md flex items-center justify-center transition-all duration-300 group hover:scale-110 active:scale-90"
          title="Back to Top"
          aria-label="Back to top"
        >
          {/* Subtle glowing ring aura */}
          <span className="absolute inset-0 rounded-full bg-amber-500/20 group-hover:bg-amber-400/30 blur-sm transition-all -z-10" />
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform stroke-[2.5]" />
        </button>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <HelmetProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </HelmetProvider>
  );
}

export default App;
