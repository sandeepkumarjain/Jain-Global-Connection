import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
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
import { BhajanLibraryModal } from './components/BhajanLibraryModal';
import { GmailCenterModal } from './components/GmailCenterModal';
import { AudioPlayer } from './components/AudioPlayer';
import { LoginRequiredView } from './components/LoginRequiredView';
import { DailyJainWisdom } from './components/DailyJainWisdom';
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
  Award
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    toast,
    themeMode,
    currentUser,
    setIsAuthModalOpen,
    setIsRegModalOpen,
    isGmailCenterOpen,
    setIsGmailCenterOpen,
    gmailModalData,
    systemSettings
  } = useApp();

  // Auto scroll to top when any tab or navigation option is clicked
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 overflow-x-hidden ${
        themeMode === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Header */}
      <Header />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-20 md:pb-6 space-y-8">
        
        {/* TAB 1: HOME VIEW */}
        {activeTab === 'home' && (
          <div className="space-y-10">
            {/* Hero Banner Carousel */}
            <HeroBanner />

            {/* Daily Jain Panchang & Tithi Summary with Agam & Promotions */}
            <PanchangWidget />

            {/* Daily Jain Wisdom Scriptures & Quotes Carousel */}
            <DailyJainWisdom />

            {/* GUEST VISITORS HOME VIEW (LOGGED OUT) */}
            {!currentUser ? (
              <div className="space-y-12">
                
                {/* Website Overview Banner */}
                <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-amber-800/50 relative overflow-hidden space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-xs font-bold uppercase tracking-widest">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span>Welcome to Jain Connect Global</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-white max-w-3xl leading-tight">
                    {systemSettings.aboutTitle || 'Welcome to Jain Connect Global'}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    {systemSettings.aboutDescription || 'Designed by SKJ Tech World, Jain Connect Global connects Swetambar, Digambar, Sthanakvasi, and Terapanthi Jains across 120+ countries.'} To protect family privacy and contact numbers, profile listings are reserved for authenticated members.
                  </p>

                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-amber-950 font-black text-xs rounded-xl shadow-xl transition-all flex items-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Your Account</span>
                    </button>

                    <button
                      onClick={() => setIsRegModalOpen(true)}
                      className="px-6 py-3 bg-slate-900/80 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4 text-amber-400" />
                      <span>Register New Listing</span>
                    </button>
                  </div>
                </div>

                {/* Portal Category Overview Cards (Logged Out) */}
                <div className="space-y-6">
                  <div className="text-center space-y-2 max-w-2xl mx-auto">
                    <span className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                      Explore Our Directory Portals
                    </span>
                    <h3 className="text-2xl font-extrabold font-serif text-slate-900 dark:text-white">
                      Four Core Pillars of Jain Connect Global
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Sign in or register to unlock direct contact numbers, candidate biodatas, and interactive searches.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Portal 1: Matrimonial */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 hover:border-red-500/50 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group">
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
                    </div>

                    {/* Portal 2: Business Directory */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 hover:border-amber-500/50 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group">
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
                    </div>

                    {/* Portal 3: Temple Directory */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 hover:border-emerald-500/50 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group">
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
                    </div>

                    {/* Portal 4: Jain Directory Census */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4 hover:border-blue-500/50 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group">
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
                    </div>
                  </div>
                </div>

                {/* Core Jain Principles & Platform Security */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-xl space-y-6">
                  <div className="text-center space-y-1.5 max-w-xl mx-auto">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Ethical & Secure Digital Ecosystem</span>
                    </span>
                    <h3 className="text-2xl font-bold font-serif">
                      Guided by Five Eternal Jain Principles
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                      <p className="font-extrabold text-amber-400">AHIMSA</p>
                      <p className="text-[10px] text-slate-400">Non-Violence</p>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                      <p className="font-extrabold text-amber-400">SATYA</p>
                      <p className="text-[10px] text-slate-400">Truthfulness</p>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                      <p className="font-extrabold text-amber-400">ASTEYA</p>
                      <p className="text-[10px] text-slate-400">Non-Stealing</p>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                      <p className="font-extrabold text-amber-400">BRAHMACHARYA</p>
                      <p className="text-[10px] text-slate-400">Chastity</p>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1 col-span-2 sm:col-span-1">
                      <p className="font-extrabold text-amber-400">APARIGRAHA</p>
                      <p className="text-[10px] text-slate-400">Non-Possessiveness</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Call to Action */}
                <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-amber-950 rounded-3xl p-8 shadow-2xl text-center space-y-4">
                  <h3 className="text-2xl font-black font-serif">
                    Join Over 10,000,000+ Jains Worldwide Today
                  </h3>
                  <p className="text-xs font-semibold max-w-xl mx-auto text-amber-950/80">
                    Register your family details, matrimonial candidate profile, business listing, or temple trust for verification.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-6 py-3 bg-amber-950 hover:bg-black text-amber-100 font-extrabold text-xs rounded-2xl shadow-xl transition-all flex items-center gap-2"
                    >
                      <LogIn className="w-4 h-4 text-amber-400" />
                      <span>Existing Member Sign In</span>
                    </button>
                    <button
                      onClick={() => setIsRegModalOpen(true)}
                      className="px-6 py-3 bg-white hover:bg-amber-50 text-amber-950 font-extrabold text-xs rounded-2xl shadow-xl transition-all flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4 text-amber-600" />
                      <span>New Registration</span>
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
      </main>

      {/* Global Modals */}
      <AuthModal />
      <RegisterModal />
      <AISearchModal />
      <MembershipModal />
      <UserProfileModal />
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
