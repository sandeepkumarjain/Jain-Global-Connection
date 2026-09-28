import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { MatrimonialProfile } from '../types';
import {
  Heart,
  Lock,
  LogIn,
  UserPlus,
  ShieldCheck,
  MapPin,
  GraduationCap,
  Users,
  Globe,
  BadgeCheck,
  Leaf
} from 'lucide-react';

/** Mask a full name for public display: "Rakesh Kumar Jain" -> "R. K. J***" */
const maskName = (fullName: string): string => {
  const parts = (fullName || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'Jain Member';
  const initials = parts
    .slice(0, -1)
    .map((p) => `${p.charAt(0).toUpperCase()}.`)
    .join(' ');
  const last = parts[parts.length - 1];
  const maskedLast = last.length <= 1 ? `${last}***` : `${last.charAt(0).toUpperCase()}${'*'.repeat(Math.min(3, last.length - 1))}`;
  return parts.length === 1 ? maskedLast : `${initials} ${maskedLast}`;
};

const PublicProfileCard: React.FC<{ profile: MatrimonialProfile; index: number }> = ({ profile, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-30px' }}
    transition={{ duration: 0.4, delay: 0.05 * index }}
    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-md space-y-3 hover:border-red-400/60 hover:shadow-xl transition-all"
  >
    <div className="flex items-start gap-3.5">
      {/* Privacy-first placeholder avatar: real photos are member-only */}
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-100 to-amber-100 dark:from-red-950 dark:to-amber-950 border border-red-200 dark:border-red-900 flex items-center justify-center shrink-0">
        <span className="text-lg font-extrabold font-serif text-red-400 dark:text-red-300">
          {(profile.fullName || 'J').charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h4 className="text-sm font-bold font-serif text-slate-900 dark:text-white truncate">
            {maskName(profile.fullName)}
          </h4>
          {profile.isVerified && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 rounded-full">
              <BadgeCheck className="w-2.5 h-2.5" /> Verified
            </span>
          )}
        </div>
        <p className="text-[11px] font-bold text-red-500 dark:text-red-400 mt-0.5">
          {profile.gender}, {profile.age} yrs{profile.height ? `, ${profile.height}` : ''}
        </p>
      </div>
    </div>

    <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
      <p className="flex items-center gap-1.5">
        <GraduationCap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span className="truncate">{profile.qualification || 'Graduate'}{profile.occupation ? ` - ${profile.occupation}` : ''}</span>
      </p>
      <p className="flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span className="truncate">{profile.state || profile.city || 'India'}{profile.country && profile.country !== 'India' ? `, ${profile.country}` : ''}</span>
      </p>
      <p className="flex items-center gap-1.5">
        <Leaf className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span className="truncate">{profile.sect}{profile.dietPreference ? ` - ${profile.dietPreference}` : ''}</span>
      </p>
    </div>

    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
      <Lock className="w-3 h-3 shrink-0" />
      <span>Full biodata, family details &amp; contact number are member-only.</span>
    </div>
  </motion.div>
);

/**
 * Public preview of the Jain Matrimonial Bureau for signed-out visitors.
 * Shows aggregate counts and privacy-masked sample profiles so guests can
 * evaluate the community before registering. No names in full, no photos,
 * no contact details, no family information.
 */
export const MatrimonialPreview: React.FC = () => {
  const { matrimonials, setIsAuthModalOpen, setIsRegModalOpen } = useApp();

  const activeProfiles = useMemo(
    () => (matrimonials || []).filter((p) => (p as any).status ? (p as any).status === 'Approved' : true),
    [matrimonials]
  );

  const stats = useMemo(() => {
    const brides = activeProfiles.filter((p) => p.gender === 'Bride').length;
    const grooms = activeProfiles.filter((p) => p.gender === 'Groom').length;
    const verified = activeProfiles.filter((p) => p.isVerified).length;
    const countries = new Set(activeProfiles.map((p) => p.country).filter(Boolean)).size;
    return { total: activeProfiles.length, brides, grooms, verified, countries };
  }, [activeProfiles]);

  const sample = activeProfiles.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Public header */}
      <div className="bg-gradient-to-r from-red-500/10 via-rose-500/10 to-amber-500/10 dark:from-red-950/40 dark:via-rose-950/30 dark:to-amber-950/40 border border-red-200 dark:border-red-900/50 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-950/80 border border-red-200 dark:border-red-800/60 rounded-full text-red-700 dark:text-red-300 text-[11px] font-bold uppercase tracking-widest">
          <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
          <span>Jain Matrimonial Bureau - Public Preview</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white leading-tight">
          Verified Jain Brides &amp; Grooms, Across Every Tradition
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Explore a privacy-protected preview of live matrimonial profiles from the global Jain sangh.
          Full biodatas, family backgrounds, photos and contact numbers are shared only with registered
          members, so families stay in control of their privacy.
        </p>

        {/* Live aggregate stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-3 border border-red-100 dark:border-red-900/40 text-center">
            <p className="text-xl font-black text-red-500">{stats.total}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Live Profiles</p>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-3 border border-red-100 dark:border-red-900/40 text-center">
            <p className="text-xl font-black text-rose-500">{stats.brides} / {stats.grooms}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Brides / Grooms</p>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-3 border border-red-100 dark:border-red-900/40 text-center">
            <p className="text-xl font-black text-emerald-600">{stats.verified}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Verified</p>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-3 border border-red-100 dark:border-red-900/40 text-center">
            <p className="text-xl font-black text-amber-600">{stats.countries || 1}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Countries</p>
          </div>
        </div>
      </div>

      {/* Masked sample profiles */}
      {sample.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-red-500" />
              Recently Listed Profiles (Preview)
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3" /> Names masked for privacy
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sample.map((p, i) => (
              <PublicProfileCard key={p.id} profile={p} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Privacy promise + CTAs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 text-center">
        <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Family details, photos and contact numbers are never public</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Create a free account to search the complete bureau, view full biodatas and horoscope details,
          and express interest. Registration also lets your own family profile reach verified Jain families worldwide.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <button
            onClick={() => setIsRegModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register a Marriage Profile</span>
          </button>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-slate-700 border border-red-200 dark:border-slate-700 text-red-700 dark:text-red-300 font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to View Full Profiles</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatrimonialPreview;
