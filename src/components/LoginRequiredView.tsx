import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  LogIn,
  UserPlus,
  ShieldCheck,
  Heart,
  Building2,
  MapPin,
  Users,
  MessageSquare,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface LoginRequiredViewProps {
  title: string;
  description?: string;
  sectionIcon?: 'matrimonial' | 'business' | 'temple' | 'directory' | 'feed' | 'emergency' | 'admin';
}

export const LoginRequiredView: React.FC<LoginRequiredViewProps> = ({
  title,
  description = 'Full profile records, contact numbers, and directory search are strictly reserved for verified members to ensure community privacy.',
  sectionIcon = 'directory',
}) => {
  const { setIsAuthModalOpen, setIsRegModalOpen } = useApp();

  const getIcon = () => {
    switch (sectionIcon) {
      case 'matrimonial':
        return <Heart className="w-10 h-10 text-red-500 fill-red-500" />;
      case 'business':
        return <Building2 className="w-10 h-10 text-amber-500" />;
      case 'temple':
        return <MapPin className="w-10 h-10 text-emerald-500" />;
      case 'directory':
        return <Users className="w-10 h-10 text-amber-500" />;
      case 'feed':
        return <MessageSquare className="w-10 h-10 text-blue-500" />;
      case 'emergency':
        return <AlertCircle className="w-10 h-10 text-red-500" />;
      case 'admin':
        return <ShieldCheck className="w-10 h-10 text-amber-500" />;
      default:
        return <Lock className="w-10 h-10 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-amber-300/60 dark:border-amber-800/60 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 max-w-2xl mx-auto my-8 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Icon Badge */}
      <div className="relative inline-flex items-center justify-center p-4 bg-amber-500/10 dark:bg-amber-950/50 rounded-2xl border border-amber-400/30 shadow-inner">
        {getIcon()}
        <span className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-amber-950 rounded-full shadow-md">
          <Lock className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* Text Headline */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-full uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          Member Sign In Required
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Feature Value Bullets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Verified Jain Community Network</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Direct Contact Numbers & WhatsApp</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Filter by Sect, Gotra & City</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Golden Verified Badge Checkmark</span>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-amber-950 font-extrabold text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In / Login to Existing Account</span>
        </button>

        <button
          onClick={() => setIsRegModalOpen(true)}
          className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs rounded-2xl border border-slate-300 dark:border-slate-600 transition-all flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4 text-amber-500" />
          <span>Register Now</span>
        </button>
      </div>
    </div>
  );
};
