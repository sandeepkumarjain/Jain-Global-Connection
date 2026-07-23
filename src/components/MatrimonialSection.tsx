import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Filter,
  CheckCircle,
  FileText,
  MessageCircle,
  MapPin,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Search,
  Sparkles,
  Download,
  X
} from 'lucide-react';
import { MatrimonialProfile } from '../types';

export const MatrimonialSection: React.FC = () => {
  const { matrimonials, sendInterest, currentUser, showToast, setIsRegModalOpen } = useApp();

  const [genderFilter, setGenderFilter] = useState<'All' | 'Bride' | 'Groom'>('All');
  const [sectFilter, setSectFilter] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<MatrimonialProfile | null>(null);
  const [showBiodataModal, setShowBiodataModal] = useState(false);

  const filtered = matrimonials.filter((m) => {
    if (genderFilter !== 'All' && m.gender !== genderFilter) return false;
    if (sectFilter !== 'All' && !m.sect.includes(sectFilter)) return false;
    if (verifiedOnly && !m.isVerified) return false;
    return true;
  });

  const handleDownloadBiodata = (p: MatrimonialProfile) => {
    showToast('Biodata Downloaded', `Generated formal Jain Biodata PDF for ${p.fullName}.`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-amber-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-900/50 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-900/50 border border-red-500/40 rounded-full text-red-300 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>Sacred Jain Matrimonial Directory</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
            Connecting Suitable Jain Brides & Grooms Worldwide
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            Verified Jain profiles sorted by Sect, Gotra, Education, Profession, and Values. Admin Verification guarantees safety and authenticity.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsRegModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-bold text-xs rounded-xl shadow-lg hover:from-amber-600 hover:to-amber-800 transition-all flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-amber-950" />
              <span>Create Marriage Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Filter className="w-4 h-4 text-amber-500" />
            <span>Filter Matrimonial Profiles</span>
          </div>
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            Showing {filtered.length} Profiles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {/* Gender Pill Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Looking For</label>
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              {['All', 'Groom', 'Bride'].map((g) => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(g as any)}
                  className={`flex-1 py-1.5 font-bold transition-colors ${
                    genderFilter === g
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {g === 'Groom' ? 'Grooms' : g === 'Bride' ? 'Brides' : 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* Sect Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Jain Sect</label>
            <select
              value={sectFilter}
              onChange={(e) => setSectFilter(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Jain Sects</option>
              <option value="Swetambar">Swetambar</option>
              <option value="Digambar">Digambar</option>
              <option value="Sthanakvasi">Sthanakvasi</option>
              <option value="Terapanthi">Terapanthi</option>
            </select>
          </div>

          {/* Verified Checkbox */}
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Verified Badge Only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((p) => {
          const hasInterest = currentUser && p.interestsReceived.includes(currentUser.id);

          return (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-amber-500/50 transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                {/* Header Info */}
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-md">
                    <img src={p.photoUrl} alt={p.fullName} className="w-full h-full object-cover" />
                    <span
                      className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                        p.gender === 'Groom' ? 'bg-blue-600 text-white' : 'bg-pink-600 text-white'
                      }`}
                    >
                      {p.gender}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white truncate">
                        {p.fullName}
                      </h3>
                      {p.isVerified && (
                        <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" title="Admin Verified" />
                      )}
                    </div>

                    <p className="text-xs text-amber-700 dark:text-amber-400 font-bold mt-0.5">
                      {p.age} Yrs • {p.height} • {p.maritalStatus}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-semibold rounded">
                        {p.sect}
                      </span>
                      {p.gotra && (
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold rounded">
                          Gotra: {p.gotra}
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold rounded">
                        {p.dietPreference}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info List */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <p className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{p.qualification}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>
                      {p.occupation} {p.company ? `at ${p.company}` : ''} ({p.annualIncome})
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>
                      {p.city}, {p.state}, {p.country}
                    </span>
                  </p>
                </div>

                {/* About snippet */}
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  "{p.aboutMe}"
                </p>
              </div>

              {/* Action Footer */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedProfile(p);
                    setShowBiodataModal(true);
                  }}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Full Biodata</span>
                </button>

                <button
                  onClick={() => sendInterest(p.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                    hasInterest
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-red-600 to-amber-600 text-white hover:from-red-700 hover:to-amber-700'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{hasInterest ? 'Interest Sent' : 'Express Interest'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Biodata Modal */}
      {showBiodataModal && selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold font-serif flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Formal Jain Biodata: {selectedProfile.fullName}
              </h3>
              <button onClick={() => setShowBiodataModal(false)} className="text-amber-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-800 dark:text-slate-200">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <img
                  src={selectedProfile.photoUrl}
                  alt={selectedProfile.fullName}
                  className="w-24 h-28 object-cover rounded-xl border-2 border-amber-400 shadow-md"
                />
                <div>
                  <h4 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                    {selectedProfile.fullName}
                  </h4>
                  <p className="text-amber-600 font-bold">
                    {selectedProfile.age} Yrs | {selectedProfile.height} | {selectedProfile.maritalStatus}
                  </p>
                  <p className="text-slate-500 mt-1">Sect: {selectedProfile.sect}</p>
                  <p className="text-slate-500">Gotra: {selectedProfile.gotra || 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-amber-700 dark:text-amber-400 uppercase text-[11px] tracking-wider border-l-2 border-amber-500 pl-2">
                  Personal & Professional Details
                </h5>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p><span className="text-slate-500">Qualification:</span> {selectedProfile.qualification}</p>
                  <p><span className="text-slate-500">Occupation:</span> {selectedProfile.occupation}</p>
                  <p><span className="text-slate-500">Annual Income:</span> {selectedProfile.annualIncome}</p>
                  <p><span className="text-slate-500">Location:</span> {selectedProfile.city}, {selectedProfile.state}</p>
                  <p><span className="text-slate-500">Diet:</span> {selectedProfile.dietPreference}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-amber-700 dark:text-amber-400 uppercase text-[11px] tracking-wider border-l-2 border-amber-500 pl-2">
                  Family Background
                </h5>
                <p className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed">
                  {selectedProfile.familyDetails}
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-amber-700 dark:text-amber-400 uppercase text-[11px] tracking-wider border-l-2 border-amber-500 pl-2">
                  About Candidate
                </h5>
                <p className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed italic">
                  "{selectedProfile.aboutMe}"
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleDownloadBiodata(selectedProfile)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Biodata PDF</span>
              </button>

              <button
                onClick={() => {
                  sendInterest(selectedProfile.id);
                  setShowBiodataModal(false);
                }}
                className="px-5 py-2 bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-xl text-xs font-bold"
              >
                Express Interest Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
