import React from 'react';
import { useApp } from '../context/AppContext';
import { NAV_TRANSLATIONS } from '../utils/translations';
import {
  Home,
  ChevronRight,
  Heart,
  Building2,
  Users,
  Landmark,
  Calendar,
  MessageSquare,
  AlertCircle,
  ShieldAlert,
  Compass
} from 'lucide-react';

export const BreadcrumbNav: React.FC = () => {
  const { activeTab, setActiveTab, language, isMatrimonialOnlyUser, isBusinessOnlyUser } = useApp();

  const currentNavs = NAV_TRANSLATIONS[language] || NAV_TRANSLATIONS.English;

  // Icon mapping for tabs
  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'matrimonial':
        return <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
      case 'business':
        return <Building2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      case 'directory':
        return <Users className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case 'temple':
        return <Landmark className="w-3.5 h-3.5 text-sky-500 shrink-0" />;
      case 'panchang':
        return <Calendar className="w-3.5 h-3.5 text-orange-500 shrink-0" />;
      case 'feed':
        return <MessageSquare className="w-3.5 h-3.5 text-purple-500 shrink-0" />;
      case 'emergency':
        return <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />;
      case 'admin':
        return <ShieldAlert className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
      case 'home':
      default:
        return <Home className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
    }
  };

  const getTabDescription = (tab: string) => {
    switch (tab) {
      case 'matrimonial':
        return 'Verified Jain Matrimony & Bio-Data Profiles';
      case 'business':
        return 'Verified Jain Entrepreneurs & Visiting Cards';
      case 'directory':
        return 'Global Sangh Family & Member Directory';
      case 'temple':
        return 'Holy Shrines, Tirths, Maps & Darshan';
      case 'panchang':
        return 'Daily Jain Tithi, Choghadiya & Quotes';
      case 'feed':
        return 'Global Sangh News, Events & Discussions';
      case 'emergency':
        return '24/7 Blood Donors & Emergency Support';
      case 'admin':
        return 'Platform Governance & Member Approvals';
      case 'home':
      default:
        return 'Jain Connect Global Home Sangh Portal';
    }
  };

  // If locked user, restrict
  const handleHomeClick = () => {
    if (isMatrimonialOnlyUser || isBusinessOnlyUser) return;
    setActiveTab('home');
  };

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-[60px] sm:top-[68px] z-30 transition-colors py-2 px-3 sm:px-6 shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {/* Main Breadcrumb Trail */}
        <ol className="flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap">
          {/* Root Segment: Home */}
          <li>
            <button
              onClick={handleHomeClick}
              disabled={isMatrimonialOnlyUser || isBusinessOnlyUser}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'home'
                  ? 'bg-amber-500/15 text-amber-900 dark:text-amber-300 font-extrabold border border-amber-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer'
              } ${isMatrimonialOnlyUser || isBusinessOnlyUser ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Home className="w-3.5 h-3.5 text-amber-500" />
              <span>{currentNavs.home || 'Home'}</span>
            </button>
          </li>

          {/* Current Active Tab Segment if not Home */}
          {activeTab !== 'home' && (
            <>
              <li className="text-slate-400 dark:text-slate-600">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white dark:bg-amber-500/20 dark:text-amber-300 font-extrabold border border-slate-800 dark:border-amber-500/30 shadow-xs">
                  {getTabIcon(activeTab)}
                  <span>{currentNavs[activeTab] || activeTab}</span>
                </div>
              </li>
            </>
          )}
        </ol>

        {/* Dynamic Context Tag line for Desktop */}
        <div className="hidden md:flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
          <Compass className="w-3 h-3 text-amber-500 shrink-0" />
          <span className="truncate max-w-xs lg:max-w-md">{getTabDescription(activeTab)}</span>
        </div>
      </div>
    </nav>
  );
};
