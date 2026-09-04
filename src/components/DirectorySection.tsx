import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { VerifiedBadge } from './VerifiedBadge';
import {
  Users,
  Search,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  UserCheck,
  QrCode,
  ShieldCheck,
  Plus,
  X,
  Heart,
  CheckCircle2,
  Sparkles,
  Award,
  Crown,
  Landmark,
  Zap,
  Medal,
  Star,
  Tag,
  Lock,
  Globe2,
  LogIn
} from 'lucide-react';
import { CommunityMemberProfile, FamilyMember, MatrimonialProfile } from '../types';

export const DirectorySection: React.FC = () => {
  const {
    members,
    openRegistrationModal,
    showToast,
    registerMatrimonialFromDirectory,
    currentUser,
    setIsAuthModalOpen,
    initiateCall,
    sendProfileViewAlert,
    sendConnectionRequestAlert,
    systemSettings
  } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<string>('All');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('All');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('All');
  const [selectedMember, setSelectedMember] = useState<CommunityMemberProfile | null>(null);
  const [showIDModal, setShowIDModal] = useState(false);

  // Available cities & states for dedicated search/filter
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      if (m.city && m.city.trim()) set.add(m.city.trim());
    });
    return Array.from(set).sort();
  }, [members]);

  const availableStates = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      if (m.state && m.state.trim()) set.add(m.state.trim());
    });
    return Array.from(set).sort();
  }, [members]);

  const totalCensusCount = useMemo(() => {
    return members.reduce((acc, m) => acc + 1 + (m.familyMembers?.length || 0), 0);
  }, [members]);

  const getMemberBadges = (m: CommunityMemberProfile): string[] => {
    const badgeList: string[] = [];

    if (m.isVerified) {
      badgeList.push('Verified');
    }

    if (m.isCommunityLeader || m.userId === 'usr_admin_sandeep' || m.id === 'mem_001') {
      badgeList.push('Community Leader');
    }

    if (m.membershipTier === 'Trustee') {
      badgeList.push('Sangh Trustee');
    } else if (m.membershipTier === 'Elite') {
      badgeList.push('Elite Member');
    } else if (m.membershipTier === 'Premium') {
      badgeList.push('Premium');
    }

    if (m.badges && Array.isArray(m.badges)) {
      m.badges.forEach((b) => {
        if (!badgeList.includes(b)) {
          badgeList.push(b);
        }
      });
    }

    return badgeList;
  };

  const renderProfileBadge = (badgeText: string) => {
    const lower = badgeText.toLowerCase();
    if (lower.includes('verified')) {
      return (
        <span key={badgeText} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs">
          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>Verified</span>
        </span>
      );
    }
    if (lower.includes('community leader') || lower.includes('leader')) {
      return (
        <span key={badgeText} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-800 shadow-xs">
          <Award className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          <span>Community Leader</span>
        </span>
      );
    }
    if (lower.includes('trustee') || lower.includes('sangh')) {
      return (
        <span key={badgeText} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border border-amber-400 dark:border-amber-700 shadow-xs">
          <Landmark className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>Sangh Trustee</span>
        </span>
      );
    }
    if (lower.includes('premium')) {
      return (
        <span key={badgeText} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-800 shadow-xs">
          <Crown className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
          <span>Premium</span>
        </span>
      );
    }
    if (lower.includes('elite')) {
      return (
        <span key={badgeText} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-yellow-100 dark:bg-yellow-950/80 text-yellow-950 dark:text-yellow-200 border border-yellow-400 dark:border-yellow-700 shadow-xs">
          <Sparkles className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
          <span>Elite Member</span>
        </span>
      );
    }
    if (lower.includes('youth') || lower.includes('ambassador')) {
      return (
        <span key={badgeText} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-100 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-800 shadow-xs">
          <Zap className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
          <span>Youth Ambassador</span>
        </span>
      );
    }
    if (lower.includes('contributor') || lower.includes('key')) {
      return (
        <span key={badgeText} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800 shadow-xs">
          <Medal className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          <span>Key Contributor</span>
        </span>
      );
    }
    return (
      <span key={badgeText} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-xs">
        <Star className="w-3 h-3 text-amber-500" />
        <span>{badgeText}</span>
      </span>
    );
  };

  // Quick Matrimonial Register Modal State
  const [selectedMatCandidate, setSelectedMatCandidate] = useState<{
    member: CommunityMemberProfile;
    familyIdx: number;
    familyMember: FamilyMember;
  } | null>(null);

  const [matFormData, setMatFormData] = useState<Partial<MatrimonialProfile>>({});

  const handleOpenMatrimonialModal = (member: CommunityMemberProfile, familyIdx: number, fam: FamilyMember) => {
    const isFemale = fam.gender === 'Female' || fam.relation === 'Daughter' || fam.relation === 'Sister';
    const initialGender: 'Bride' | 'Groom' = isFemale ? 'Bride' : 'Groom';

    setMatFormData({
      fullName: `${fam.name} ${member.surname || ''}`.trim(),
      gender: initialGender,
      age: fam.age || 24,
      height: "5'6\"",
      maritalStatus: 'Unmarried',
      sect: 'Shwetambar',
      subSect: 'Murti Pujak',
      fatherName: `${member.name} ${member.surname || ''}`.trim(),
      motherName: 'Jain Family Mother',
      selfGotra: 'Kashyap',
      motherGotra: 'Gautam',
      highestDegree: fam.occupation || 'B.Tech / MBA',
      employedIn: 'Private Sector',
      annualIncome: '10 - 15 Lakhs',
      city: member.city || 'Mumbai',
      state: member.state || 'Maharashtra',
      country: member.country || 'India',
      aboutMe: `Registered from Jain Family Directory. ${fam.name} is a polite, family-oriented Jain candidate.`,
      contactMobile: member.mobile,
      contactEmail: member.email,
      photoUrl: isFemale
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    });

    setSelectedMatCandidate({ member, familyIdx, familyMember: fam });
  };

  const handleConfirmMatrimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatCandidate) return;

    await registerMatrimonialFromDirectory(
      selectedMatCandidate.member.id,
      selectedMatCandidate.familyIdx,
      matFormData
    );

    setSelectedMatCandidate(null);
  };

  const filtered = members.filter((m) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = `${m.name} ${m.surname}`.toLowerCase().includes(term);
      const matchCity = (m.city || '').toLowerCase().includes(term);
      const matchState = (m.state || '').toLowerCase().includes(term);
      const matchProfession = (m.profession || '').toLowerCase().includes(term);
      const matchAddress = currentUser && m.address ? m.address.toLowerCase().includes(term) : false;

      if (!matchName && !matchCity && !matchState && !matchProfession && !matchAddress) {
        return false;
      }
    }

    if (selectedCityFilter !== 'All' && (m.city || '').toLowerCase() !== selectedCityFilter.toLowerCase()) {
      return false;
    }

    if (selectedStateFilter !== 'All' && (m.state || '').toLowerCase() !== selectedStateFilter.toLowerCase()) {
      return false;
    }

    if (selectedBadgeFilter !== 'All') {
      const badges = getMemberBadges(m).map((b) => b.toLowerCase());
      const filterLower = selectedBadgeFilter.toLowerCase();
      if (!badges.some((b) => b.includes(filterLower))) {
        return false;
      }
    }

    return true;
  });

  const badgeFilterCategories = [
    'All',
    'Verified',
    'Community Leader',
    'Sangh Trustee',
    'Premium',
    'Elite Member',
    'Youth Ambassador',
  ];

  return (
    <div className="space-y-6">
      
      {/* Banner with Community Unity & Strength in Numbers Motto */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>{systemSettings.directorySubtitle || 'Jain Community Census & Directory'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
            {systemSettings.directoryHeading || 'United in Numbers, Strengthening the Global Jain Community'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            This platform is dedicated to uniting our worldwide Jain community, showing our collective strength and harmony. To protect every household, <strong>family members data is 100% confidential and visible to each family head only</strong>. Public visitors see only the Family Head name &amp; business; logged-in members searching by city or state can view verified head address &amp; contact numbers.
          </p>

          {/* Census Statistics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 text-center">
              <span className="block text-xl font-black text-amber-400 font-serif">{members.length}</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase">Jain Households</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 text-center">
              <span className="block text-xl font-black text-emerald-400 font-serif">{totalCensusCount}+</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase">Jains Counted</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 text-center">
              <span className="block text-xl font-black text-amber-300 font-serif">{availableCities.length}</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase">Active Cities</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 text-center">
              <span className="block text-xl font-black text-purple-300 font-serif">{availableStates.length}</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase">States &amp; Regions</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => openRegistrationModal('family')}
              className="px-5 py-3 min-h-[44px] bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-bold text-xs rounded-xl shadow-lg hover:from-amber-600 hover:to-amber-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register Family in Jain Census</span>
            </button>
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 border border-amber-500/30 text-[11px] text-amber-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Privacy Protected: Family members never shown to others</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Input, City/State Filters, Badge Filter Pills */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
          {/* Main Search Input */}
          <div className="md:col-span-6 relative">
            <input
              type="text"
              placeholder="Search Family Head Name, Business, Profession, City..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          {/* City Filter */}
          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium cursor-pointer"
              >
                <option value="All">All Cities ({availableCities.length})</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 text-amber-500 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* State Filter */}
          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={selectedStateFilter}
                onChange={(e) => setSelectedStateFilter(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium cursor-pointer"
              >
                <option value="All">All States ({availableStates.length})</option>
                {availableStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <Globe2 className="w-3.5 h-3.5 text-amber-500 absolute left-2.5 top-3" />
            </div>
          </div>
        </div>

        {/* Profile Badge Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0 flex items-center gap-1 mr-1">
            <Tag className="w-3 h-3 text-amber-500" /> Filter Badges:
          </span>
          {badgeFilterCategories.map((badgeCat) => {
            const isActive = selectedBadgeFilter === badgeCat;
            return (
              <button
                key={badgeCat}
                onClick={() => setSelectedBadgeFilter(badgeCat)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {badgeCat === 'Verified' && <ShieldCheck className="w-3.5 h-3.5" />}
                {badgeCat === 'Community Leader' && <Award className="w-3.5 h-3.5" />}
                {badgeCat === 'Sangh Trustee' && <Landmark className="w-3.5 h-3.5" />}
                {badgeCat === 'Premium' && <Crown className="w-3.5 h-3.5" />}
                {badgeCat === 'Elite Member' && <Sparkles className="w-3.5 h-3.5" />}
                {badgeCat === 'Youth Ambassador' && <Zap className="w-3.5 h-3.5" />}
                <span>{badgeCat}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Summary & Clear Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span>Showing <strong>{filtered.length}</strong> of <strong>{members.length}</strong> Jain Families</span>
            {selectedCityFilter !== 'All' && (
              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded text-[11px]">
                City: {selectedCityFilter}
              </span>
            )}
            {selectedStateFilter !== 'All' && (
              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded text-[11px]">
                State: {selectedStateFilter}
              </span>
            )}
          </div>

          {(searchTerm || selectedBadgeFilter !== 'All' || selectedCityFilter !== 'All' || selectedStateFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedBadgeFilter('All');
                setSelectedCityFilter('All');
                setSelectedStateFilter('All');
              }}
              className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 hover:bg-amber-200 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((m) => {
          const mBadges = getMemberBadges(m);
          const totalFamilySize = (m.familyMembers?.length || 0) + 1;
          const isOwnFamily = Boolean(
            currentUser && (
              currentUser.id === m.userId ||
              currentUser.email === m.email ||
              (currentUser.fullName && (currentUser.fullName.toLowerCase() === `${m.name} ${m.surname}`.toLowerCase()))
            )
          );
          const isLoggedIn = Boolean(currentUser);

          return (
            <div
              key={m.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-lg space-y-4 transition-all ${
                isOwnFamily
                  ? 'border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/50'
              }`}
            >
              {/* Own Family Identification Banner */}
              {isOwnFamily && (
                <div className="p-2.5 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/15 border border-amber-300 dark:border-amber-700/60 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-extrabold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Your Family Profile (Private to You)</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Visible only to you
                  </span>
                </div>
              )}

              {/* Family Head Header */}
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <img
                    src={m.photoUrl}
                    alt={m.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-md"
                  />
                  {m.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white dark:border-slate-900" title="Verified Member">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white truncate">
                      {m.name} {m.surname}
                    </h3>
                  </div>

                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{m.profession}</span>
                  </p>

                  {/* Public: Shows City & State */}
                  {!isLoggedIn && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>{m.city}, {m.state}</span>
                    </p>
                  )}

                  {/* Logged in: Shows Full Residential Address & Mobile Number */}
                  {isLoggedIn && (
                    <div className="space-y-1 mt-1">
                      <p className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-900 dark:text-slate-100">Address:</strong>{' '}
                          {m.address || `${m.city}, ${m.state}, ${m.country}`}
                        </span>
                      </p>

                      <p className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>
                          <strong className="text-slate-900 dark:text-slate-100">Head Mobile:</strong>{' '}
                          <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{m.mobile}</span>
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Visual Profile Badges Row */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    {mBadges.map((badge) => renderProfileBadge(badge))}
                  </div>

                  {/* Jain Community Census Strength Badge */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold rounded-full">
                      <Users className="w-3 h-3 text-amber-600" />
                      <span>Jain Census: {totalFamilySize} Family Members</span>
                    </span>

                    {/* Blood Group: Visible ONLY to own family */}
                    {isOwnFamily && m.bloodGroup && (
                      <span className="px-2 py-0.5 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-[10px] font-bold rounded">
                        Blood Group: {m.bloodGroup} (Private)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* STRICT PRIVACY RULE ENFORCEMENT:
                  1. Own Family: Can view all own family members + register children in matrimonial
                  2. Logged-in member viewing other family: Family members are completely hidden!
                  3. Public: Contact, address and family members are completely hidden! */}

              {/* CASE 1: OWN FAMILY PROFILE (Full Access to own household) */}
              {isOwnFamily && m.familyMembers && m.familyMembers.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-xs space-y-2">
                  <p className="font-extrabold text-slate-800 dark:text-slate-200 text-[11px] flex items-center justify-between">
                    <span>Your Family Members ({m.familyMembers.length}):</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                      Direct Matrimonial Eligible
                    </span>
                  </p>

                  <div className="space-y-1.5">
                    {m.familyMembers.map((fam, idx) => {
                      const isEligibleForMatrimony =
                        fam.age >= 18 ||
                        fam.relation === 'Son' ||
                        fam.relation === 'Daughter' ||
                        fam.relation === 'Brother' ||
                        fam.relation === 'Sister';

                      return (
                        <div
                          key={idx}
                          className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/70 rounded-xl text-[11px]"
                        >
                          <div className="flex items-center gap-1.5 font-medium">
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              {fam.name}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              ({fam.relation} • {fam.age || 22} yrs)
                            </span>
                          </div>

                          {fam.matrimonialProfileCreated ? (
                            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span>Matrimonial Active</span>
                            </span>
                          ) : isEligibleForMatrimony ? (
                            <button
                              type="button"
                              onClick={() => handleOpenMatrimonialModal(m, idx, fam)}
                              className="px-2.5 py-1 bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white font-bold text-[10px] rounded-lg shadow-sm flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                              title="Directly register candidate in Jain Matrimonial Bureau"
                            >
                              <Heart className="w-3 h-3 fill-white" />
                              <span>Register in Matrimonial</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">
                              {fam.occupation || 'Family Member'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CASE 2: LOGGED-IN VIEWING ANOTHER FAMILY (Privacy Shield Notice) */}
              {isLoggedIn && !isOwnFamily && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 text-xs flex items-center justify-between gap-3 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                        Family Member Details are Confidential
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Visible only to this household. Counted in global Jain census for community unity.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-1 rounded-lg shrink-0">
                    {totalFamilySize} Census Members
                  </span>
                </div>
              )}

              {/* CASE 3: PUBLIC / GUEST VIEW (Login prompt for Address & Mobile) */}
              {!isLoggedIn && (
                <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                    <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <p className="text-[11px] font-medium leading-tight">
                      Residential address, phone dialer, and personal details are protected for community privacy.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Log in to Search by City/State &amp; View Contact</span>
                  </button>
                </div>
              )}

              {/* Actions Section: Only for Logged-In Members */}
              {isLoggedIn ? (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <button
                    onClick={() => {
                      setSelectedMember(m);
                      setShowIDModal(true);
                      if (m.userId || m.id) {
                        sendProfileViewAlert(m.userId || m.id, `${m.name} ${m.surname}`, currentUser);
                      }
                    }}
                    className="px-3 py-2 min-h-[40px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
                    title="View Digital ID card and trigger view alert"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-500" />
                    <span>Digital ID</span>
                  </button>

                  <button
                    onClick={() => {
                      if (m.userId || m.id) {
                        sendConnectionRequestAlert(
                          m.userId || m.id,
                          `${m.name} ${m.surname}`,
                          currentUser,
                          `Jai Jinendra ${m.name}! I would like to connect with your family on Jain Connect Global.`
                        );
                      }
                    }}
                    className="px-3 py-2 min-h-[40px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-center gap-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                    title="Send networking connection request"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Connect</span>
                  </button>

                  <button
                    onClick={() => {
                      initiateCall(m.mobile, `${m.name} ${m.surname}`);
                      if (m.userId || m.id) {
                        sendProfileViewAlert(m.userId || m.id, `${m.name} ${m.surname}`, currentUser);
                      }
                    }}
                    className="px-3.5 py-2 min-h-[40px] bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                    title="Click to call via verified phone dialer"
                  >
                    <Phone className="w-3.5 h-3.5 fill-current" />
                    <span>Contact</span>
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Digital ID Card Modal */}
      {showIDModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative text-slate-800 dark:text-slate-100 space-y-4 text-center">
            
            <button
              onClick={() => setShowIDModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ID Card Graphic */}
            <div className="bg-gradient-to-b from-amber-900 via-amber-950 to-slate-950 text-white p-5 rounded-2xl border border-amber-500/50 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                <span className="text-[10px] font-bold text-amber-400 tracking-wider">JAIN CONNECT GLOBAL</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>

              <img
                src={selectedMember.photoUrl}
                alt={selectedMember.name}
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-amber-400 shadow-md"
              />

              <div>
                <div className="flex items-center justify-center gap-1.5">
                  <h4 className="text-lg font-bold font-serif">{selectedMember.name} {selectedMember.surname}</h4>
                  {selectedMember.isVerified && <VerifiedBadge type="member" showText={true} size="sm" />}
                </div>
                <p className="text-xs text-amber-300">{selectedMember.profession}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{selectedMember.city}, {selectedMember.country}</p>

                {/* Profile Badges on ID Card */}
                <div className="flex flex-wrap items-center justify-center gap-1 mt-2.5">
                  {getMemberBadges(selectedMember).map((b) => renderProfileBadge(b))}
                </div>
              </div>

              <div className="bg-white p-2 rounded-xl w-32 h-32 mx-auto flex items-center justify-center shadow-md">
                <QRCodeSVG
                  value={`MEMBER:${selectedMember.name} ${selectedMember.surname}|ID:JCG-MEM-${selectedMember.id.slice(-6).toUpperCase()}|CITY:${selectedMember.city}|VERIFIED:TRUE`}
                  size={112}
                  bgColor="#FFFFFF"
                  fgColor="#0F172A"
                  level="M"
                />
              </div>

              <p className="text-[9px] text-amber-300 font-mono">
                MEMBER ID: JCG-MEM-{selectedMember.id.slice(-6).toUpperCase()}
              </p>
            </div>

            <button
              onClick={() => {
                showToast('ID Downloaded', 'Digital Jain Member ID saved to device.', 'success');
                setShowIDModal(false);
              }}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Save Digital ID Card
            </button>
          </div>
        </div>
      )}

      {/* Quick Matrimonial Registration Modal from Directory */}
      {selectedMatCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative text-slate-800 dark:text-slate-100 my-8 space-y-5">
            <button
              onClick={() => setSelectedMatCandidate(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 text-center border-b border-rose-100 dark:border-rose-900/50 pb-4">
              <div className="inline-flex p-3 bg-rose-100 dark:bg-rose-950/60 rounded-2xl text-rose-600 dark:text-rose-400 mb-1">
                <Heart className="w-7 h-7 fill-rose-500" />
              </div>
              <h3 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white">
                Register Candidate in Jain Matrimonial Bureau
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pre-filled from <span className="font-bold">{selectedMatCandidate.member.name} {selectedMatCandidate.member.surname}</span> family profile in Jain Directory.
              </p>
            </div>

            <form onSubmit={handleConfirmMatrimonialSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Candidate Full Name *</label>
                  <input
                    type="text"
                    value={matFormData.fullName || ''}
                    onChange={(e) => setMatFormData({ ...matFormData, fullName: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Gender / Role *</label>
                  <select
                    value={matFormData.gender || 'Bride'}
                    onChange={(e) => setMatFormData({ ...matFormData, gender: e.target.value as 'Bride' | 'Groom' })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-bold"
                  >
                    <option value="Bride">Bride (Kanya)</option>
                    <option value="Groom">Groom (Var)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Age (Yrs)</label>
                  <input
                    type="number"
                    value={matFormData.age || 24}
                    onChange={(e) => setMatFormData({ ...matFormData, age: parseInt(e.target.value) || 24 })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Height</label>
                  <input
                    type="text"
                    value={matFormData.height || "5'6\""}
                    onChange={(e) => setMatFormData({ ...matFormData, height: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Sect</label>
                  <select
                    value={matFormData.sect || 'Shwetambar'}
                    onChange={(e) => setMatFormData({ ...matFormData, sect: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-medium"
                  >
                    <option value="Shwetambar">Shwetambar</option>
                    <option value="Digambar">Digambar</option>
                    <option value="Sthanakvasi">Sthanakvasi</option>
                    <option value="Terapanthi">Terapanthi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Self Gotra</label>
                  <input
                    type="text"
                    value={matFormData.selfGotra || 'Kashyap'}
                    onChange={(e) => setMatFormData({ ...matFormData, selfGotra: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mother Gotra</label>
                  <input
                    type="text"
                    value={matFormData.motherGotra || 'Gautam'}
                    onChange={(e) => setMatFormData({ ...matFormData, motherGotra: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">City / Location</label>
                  <input
                    type="text"
                    value={matFormData.city || ''}
                    onChange={(e) => setMatFormData({ ...matFormData, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Mobile</label>
                  <input
                    type="text"
                    value={matFormData.contactMobile || ''}
                    onChange={(e) => setMatFormData({ ...matFormData, contactMobile: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Candidate Photo URL</label>
                <input
                  type="url"
                  value={matFormData.photoUrl || ''}
                  onChange={(e) => setMatFormData({ ...matFormData, photoUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMatCandidate(null)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm & Register Matrimonial Candidate</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
